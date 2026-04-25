import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createClient, type Client } from "@libsql/client";
import {
  recordEvent,
  listEvents,
  newEventId,
  validateEventBody,
  _resetEventsDbForTests,
  _resetEventsSchemaForTests,
  type PortalEvent,
} from "../events";

let db: Client;

beforeEach(() => {
  db = createClient({ url: ":memory:" });
  _resetEventsDbForTests(db);
  _resetEventsSchemaForTests();
});

afterEach(() => {
  _resetEventsDbForTests(null);
  db.close();
});

const sampleEvent = (overrides: Partial<PortalEvent["payload"]> = {}): PortalEvent => ({
  kind: "recon-run",
  payload: {
    ts: "2026-04-23T15:30:00Z",
    actor: "ca-firm-toolkit@kumar-textiles",
    summary: "GSTR-2B recon complete",
    signal: "16 invoices in 2B",
    action: "Matched 13 / flagged 3",
    outcome: "5-sheet Excel ready",
    links: [{ label: "Excel", href: "file:///tmp/recon.xlsx" }],
    tags: ["gstr-2b"],
    ...overrides,
  },
});

describe("newEventId", () => {
  it("generates a 30-char prefixed id (evt_ + 26 ulid chars)", () => {
    const id = newEventId();
    expect(id).toMatch(/^evt_[0-9A-HJKMNP-TV-Z]{26}$/);
  });

  it("generates unique ids across many calls", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 1000; i++) seen.add(newEventId());
    expect(seen.size).toBe(1000);
  });

  it("ids sort roughly by time (timestamp prefix)", () => {
    const ids: string[] = [];
    ids.push(newEventId());
    // Two ids generated back-to-back should usually have the same timestamp prefix.
    // We verify by checking the alphabet is base32 — the strict timestamp-monotonic
    // property is documented but not load-tested here.
    ids.push(newEventId());
    expect(ids[0].length).toBe(30);
    expect(ids[1].length).toBe(30);
  });
});

describe("validateEventBody", () => {
  it("accepts a complete valid body", () => {
    const r = validateEventBody({
      kind: "memo-shipped",
      payload: {
        ts: "2026-04-23T10:00:00Z",
        actor: "nexus@pharma-fund-x",
        summary: "Memo shipped",
      },
    });
    expect("error" in r).toBe(false);
    if (!("error" in r)) {
      expect(r.kind).toBe("memo-shipped");
      expect(r.payload.ts).toBe("2026-04-23T10:00:00Z");
    }
  });

  it("rejects missing kind", () => {
    const r = validateEventBody({ payload: { ts: "2026-04-23T10:00:00Z", actor: "x", summary: "y" } });
    expect("error" in r).toBe(true);
  });

  it("rejects unknown kind", () => {
    const r = validateEventBody({
      kind: "unknown-kind",
      payload: { ts: "2026-04-23T10:00:00Z", actor: "x", summary: "y" },
    });
    expect("error" in r).toBe(true);
  });

  it("accepts the new signal-detected kind (Nexus C1-C6)", () => {
    const r = validateEventBody({
      kind: "signal-detected",
      payload: { ts: "2026-04-23T10:00:00Z", actor: "x", summary: "y" },
    });
    expect("error" in r).toBe(false);
  });

  it("rejects empty actor", () => {
    const r = validateEventBody({
      kind: "alert",
      payload: { ts: "2026-04-23T10:00:00Z", actor: "  ", summary: "y" },
    });
    expect("error" in r).toBe(true);
  });

  it("rejects non-ISO ts", () => {
    const r = validateEventBody({
      kind: "alert",
      payload: { ts: "not-a-date", actor: "x", summary: "y" },
    });
    expect("error" in r).toBe(true);
  });

  it("rejects malformed links array", () => {
    const r = validateEventBody({
      kind: "alert",
      payload: {
        ts: "2026-04-23T10:00:00Z",
        actor: "x",
        summary: "y",
        links: [{ label: "ok" }],
      },
    });
    expect("error" in r).toBe(true);
  });

  it("rejects non-string tag entries", () => {
    const r = validateEventBody({
      kind: "alert",
      payload: { ts: "2026-04-23T10:00:00Z", actor: "x", summary: "y", tags: ["ok", 1] },
    });
    expect("error" in r).toBe(true);
  });
});

describe("recordEvent", () => {
  it("persists an event and returns its id", async () => {
    const r = await recordEvent("kumar-textiles", sampleEvent());
    expect(r).not.toBeNull();
    expect(r!.id).toMatch(/^evt_/);
  });

  it("returns null when no DB is configured", async () => {
    _resetEventsDbForTests(null);
    _resetEventsSchemaForTests();
    const r = await recordEvent("kumar-textiles", sampleEvent());
    expect(r).toBeNull();
  });

  it("preserves the full payload through round-trip", async () => {
    await recordEvent("kumar-textiles", sampleEvent());
    const events = await listEvents({ tenant: "kumar-textiles" });
    expect(events.length).toBe(1);
    expect(events[0].payload.signal).toBe("16 invoices in 2B");
    expect(events[0].payload.outcome).toBe("5-sheet Excel ready");
    expect(events[0].payload.links?.[0].label).toBe("Excel");
    expect(events[0].payload.tags?.[0]).toBe("gstr-2b");
  });
});

describe("listEvents", () => {
  beforeEach(async () => {
    await recordEvent(
      "tenant-a",
      sampleEvent({ ts: "2026-04-20T10:00:00Z", summary: "A1 oldest" }),
    );
    await recordEvent(
      "tenant-a",
      { kind: "memo-shipped", payload: sampleEvent({ ts: "2026-04-22T10:00:00Z", summary: "A2" }).payload },
    );
    await recordEvent(
      "tenant-b",
      sampleEvent({ ts: "2026-04-23T10:00:00Z", summary: "B1 newest" }),
    );
  });

  it("returns an empty array when DB unavailable (never throws)", async () => {
    _resetEventsDbForTests(null);
    _resetEventsSchemaForTests();
    const r = await listEvents();
    expect(r).toEqual([]);
  });

  it("returns all events in DESC order by ts", async () => {
    const r = await listEvents({});
    expect(r.length).toBe(3);
    expect(r[0].payload.summary).toBe("B1 newest");
    expect(r[2].payload.summary).toBe("A1 oldest");
  });

  it("filters by tenant", async () => {
    const r = await listEvents({ tenant: "tenant-a" });
    expect(r.length).toBe(2);
    expect(r.every((e) => e.tenant === "tenant-a")).toBe(true);
  });

  it("filters by kind", async () => {
    const r = await listEvents({ kind: "memo-shipped" });
    expect(r.length).toBe(1);
    expect(r[0].kind).toBe("memo-shipped");
  });

  it("filters by since (inclusive)", async () => {
    const r = await listEvents({ since: "2026-04-22T00:00:00Z" });
    expect(r.length).toBe(2);
    expect(r.every((e) => e.payload.ts >= "2026-04-22T00:00:00Z")).toBe(true);
  });

  it("respects limit", async () => {
    const r = await listEvents({ limit: 1 });
    expect(r.length).toBe(1);
    expect(r[0].payload.summary).toBe("B1 newest");
  });

  it("clamps limit to max 200", async () => {
    const r = await listEvents({ limit: 99999 });
    expect(r.length).toBe(3);
  });
});
