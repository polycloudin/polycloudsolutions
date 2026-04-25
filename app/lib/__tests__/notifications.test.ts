import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createClient, type Client } from "@libsql/client";
import {
  recordNotification,
  listNotifications,
  markRead,
  newNotificationId,
  validateNotificationBody,
  _resetNotificationsDbForTests,
  _resetNotificationsSchemaForTests,
  type Notification,
} from "../notifications";

let db: Client;

beforeEach(() => {
  db = createClient({ url: ":memory:" });
  _resetNotificationsDbForTests(db);
  _resetNotificationsSchemaForTests();
});

afterEach(() => {
  _resetNotificationsDbForTests(null);
  db.close();
});

const sample = (overrides: Partial<Notification> = {}): Notification => ({
  kind: "approval-needed",
  tenant: "polycloud",
  title: "TDS 24Q deadline in 7 days",
  body: "Q4 24Q filing due 31 May. Last quarter: filed 2 days late.",
  severity: "high",
  link: "/client/polycloud?tab=ops",
  ...overrides,
});

describe("newNotificationId", () => {
  it("generates a 30-char prefixed id", () => {
    const id = newNotificationId();
    expect(id).toMatch(/^nfn_[0-9A-HJKMNP-TV-Z]{26}$/);
  });

  it("differs from the events prefix", () => {
    const id = newNotificationId();
    expect(id.startsWith("nfn_")).toBe(true);
    expect(id.startsWith("evt_")).toBe(false);
  });
});

describe("validateNotificationBody", () => {
  it("accepts a complete valid body", () => {
    const r = validateNotificationBody(sample());
    expect("error" in r).toBe(false);
  });

  it("rejects unknown kind", () => {
    const r = validateNotificationBody({ ...sample(), kind: "weather" });
    expect("error" in r).toBe(true);
  });

  it("rejects unknown severity", () => {
    const r = validateNotificationBody({ ...sample(), severity: "panic" });
    expect("error" in r).toBe(true);
  });

  it("rejects missing tenant", () => {
    const sampled = sample();
    const rest: Partial<Notification> = { ...sampled };
    delete rest.tenant;
    const r = validateNotificationBody(rest);
    expect("error" in r).toBe(true);
  });

  it("rejects malformed expires_at", () => {
    const r = validateNotificationBody({ ...sample(), expires_at: "not-iso" });
    expect("error" in r).toBe(true);
  });

  it("accepts ISO expires_at", () => {
    const r = validateNotificationBody({
      ...sample(),
      expires_at: "2026-12-31T23:59:59Z",
    });
    expect("error" in r).toBe(false);
  });
});

describe("recordNotification", () => {
  it("persists and returns id", async () => {
    const r = await recordNotification(sample());
    expect(r).not.toBeNull();
    expect(r!.id).toMatch(/^nfn_/);
  });

  it("returns null when DB unavailable", async () => {
    _resetNotificationsDbForTests(null);
    _resetNotificationsSchemaForTests();
    const r = await recordNotification(sample());
    expect(r).toBeNull();
  });

  it("preserves link + body + severity through round-trip", async () => {
    await recordNotification(sample({ severity: "critical" }));
    const list = await listNotifications("polycloud");
    expect(list.length).toBe(1);
    expect(list[0].severity).toBe("critical");
    expect(list[0].link).toBe("/client/polycloud?tab=ops");
    expect(list[0].body).toContain("Q4 24Q");
  });
});

describe("listNotifications", () => {
  beforeEach(async () => {
    await recordNotification(
      sample({ tenant: "tenant-a", title: "A1", severity: "high" }),
    );
    await recordNotification(
      sample({ tenant: "tenant-a", title: "A2", severity: "low" }),
    );
    await recordNotification(
      sample({ tenant: "tenant-b", title: "B1", severity: "critical" }),
    );
  });

  it("respects tenant filter (only tenant-a items returned)", async () => {
    const r = await listNotifications("tenant-a");
    expect(r.length).toBe(2);
    expect(r.every((n) => n.tenant === "tenant-a")).toBe(true);
  });

  it("never leaks notifications from other tenants", async () => {
    const r = await listNotifications("tenant-b");
    expect(r.length).toBe(1);
    expect(r[0].title).toBe("B1");
  });

  it("filters by severity", async () => {
    const r = await listNotifications("tenant-a", { severity: "high" });
    expect(r.length).toBe(1);
    expect(r[0].title).toBe("A1");
  });

  it("excludes expired notifications by default", async () => {
    await recordNotification(
      sample({
        tenant: "tenant-c",
        title: "Expired",
        expires_at: "2020-01-01T00:00:00Z",
      }),
    );
    const r = await listNotifications("tenant-c");
    expect(r.length).toBe(0);
  });

  it("includes expired when include_expired = true", async () => {
    await recordNotification(
      sample({
        tenant: "tenant-c",
        title: "Expired",
        expires_at: "2020-01-01T00:00:00Z",
      }),
    );
    const r = await listNotifications("tenant-c", { include_expired: true });
    expect(r.length).toBe(1);
  });

  it("returns empty array when DB unavailable (never throws)", async () => {
    _resetNotificationsDbForTests(null);
    _resetNotificationsSchemaForTests();
    const r = await listNotifications("tenant-a");
    expect(r).toEqual([]);
  });
});

describe("markRead", () => {
  it("marks an existing notification read for the given email", async () => {
    const r = await recordNotification(sample({ tenant: "t1", title: "X" }));
    expect(r).not.toBeNull();
    const ok = await markRead(r!.id, "vk@polycloud.in");
    expect(ok).toBe(true);

    const list = await listNotifications("t1");
    expect(list[0].read_by).toContain("vk@polycloud.in");
  });

  it("is idempotent — same email marked twice doesn't duplicate", async () => {
    const r = await recordNotification(sample({ tenant: "t1" }));
    await markRead(r!.id, "vk@polycloud.in");
    await markRead(r!.id, "vk@polycloud.in");
    const list = await listNotifications("t1");
    expect(list[0].read_by.length).toBe(1);
  });

  it("treats email comparison case-insensitively", async () => {
    const r = await recordNotification(sample({ tenant: "t1" }));
    await markRead(r!.id, "VK@polycloud.in");
    await markRead(r!.id, "vk@polycloud.in");
    const list = await listNotifications("t1");
    // Only one entry, the first-seen casing
    expect(list[0].read_by.length).toBe(1);
  });

  it("supports multiple readers", async () => {
    const r = await recordNotification(sample({ tenant: "t1" }));
    await markRead(r!.id, "vk@polycloud.in");
    await markRead(r!.id, "aasrith@polycloud.in");
    const list = await listNotifications("t1");
    expect(list[0].read_by.length).toBe(2);
  });

  it("returns false for nonexistent id", async () => {
    const ok = await markRead("nfn_NOPE", "vk@polycloud.in");
    expect(ok).toBe(false);
  });

  it("unread_only filter excludes items already read by the user", async () => {
    const r1 = await recordNotification(sample({ tenant: "t1", title: "Read me" }));
    await recordNotification(sample({ tenant: "t1", title: "Still unread" }));
    await markRead(r1!.id, "vk@polycloud.in");
    const list = await listNotifications("t1", {
      unread_only: true,
      unread_for_email: "vk@polycloud.in",
    });
    expect(list.length).toBe(1);
    expect(list[0].title).toBe("Still unread");
  });
});
