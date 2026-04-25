"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { StoredNotification, NotificationSeverity } from "../../lib/notifications";

interface Props {
  notif: StoredNotification;
  isRead: boolean;
}

const SEVERITY_STYLE: Record<
  NotificationSeverity,
  { color: string; bg: string; ring: string; label: string }
> = {
  low: { color: "#6B7280", bg: "#F3F4F6", ring: "#E5E7EB", label: "Low" },
  medium: { color: "#1A5FD4", bg: "#EEF4FF", ring: "#BFDBFE", label: "Medium" },
  high: { color: "#B45309", bg: "#FFFBEB", ring: "#FCD34D", label: "High" },
  critical: { color: "#DC2626", bg: "#FEF2F2", ring: "#FCA5A5", label: "Critical" },
};

const KIND_LABEL: Record<string, string> = {
  "approval-needed": "Approval needed",
  "deadline-warn": "Deadline warning",
  "deadline-due": "Deadline due",
  alert: "Alert",
  review: "Review",
};

export default function NotificationItem({ notif, isRead }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [readOptimistic, setReadOptimistic] = useState(isRead);

  const style = SEVERITY_STYLE[notif.severity];

  function markRead() {
    if (readOptimistic) return;
    setReadOptimistic(true);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/notifications/${notif.id}/read`, {
          method: "POST",
        });
        if (!res.ok) {
          // Roll back optimistic update on failure
          setReadOptimistic(false);
        } else {
          // Refresh server data so the unread count + filters reflect truth
          router.refresh();
        }
      } catch {
        setReadOptimistic(false);
      }
    });
  }

  return (
    <li
      className={
        "bg-white border rounded-xl p-4 md:p-5 transition-colors " +
        (readOptimistic
          ? "border-[var(--color-line)] opacity-70"
          : "border-[var(--color-line)] hover:border-[var(--color-ink)]")
      }
      style={
        readOptimistic
          ? undefined
          : { boxShadow: `inset 4px 0 0 ${style.ring}` }
      }
    >
      <div className="flex items-start gap-3 mb-2 flex-wrap">
        <span
          className="mono text-[9.5px] uppercase tracking-[0.16em] px-1.5 py-0.5 rounded"
          style={{ color: style.color, backgroundColor: style.bg }}
        >
          {style.label}
        </span>
        <span className="mono text-[10.5px] text-[var(--color-text-muted)]">
          {KIND_LABEL[notif.kind] ?? notif.kind}
        </span>
        <span className="mono text-[10.5px] text-[var(--color-text-muted)]">·</span>
        <span className="mono text-[10.5px] text-[var(--color-text-muted)]">
          {notif.tenant}
        </span>
        <span className="mono text-[10.5px] text-[var(--color-text-muted)] ml-auto" title={notif.created_at}>
          {formatTs(notif.created_at)}
        </span>
      </div>

      <h3 className="text-[14.5px] font-medium tracking-tight leading-snug mb-1.5">
        {notif.title}
      </h3>
      <p className="text-[12.5px] text-[var(--color-text-secondary)] leading-relaxed mb-3 whitespace-pre-line">
        {notif.body}
      </p>

      <div className="flex items-center gap-3 pt-2 border-t border-[var(--color-line)]">
        {notif.link && (
          <Link
            href={notif.link}
            className="text-[12px] font-medium text-[var(--color-primary-blue)] hover:underline"
          >
            Open →
          </Link>
        )}
        {!readOptimistic && (
          <button
            type="button"
            onClick={markRead}
            disabled={pending}
            className="ml-auto mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-secondary)] hover:text-[var(--color-ink)] border border-[var(--color-line)] hover:border-[var(--color-ink)] rounded-full px-3 py-1 disabled:opacity-50"
          >
            {pending ? "Marking…" : "Mark read"}
          </button>
        )}
        {readOptimistic && (
          <span className="ml-auto mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-success)]">
            Read
          </span>
        )}
      </div>
    </li>
  );
}

function formatTs(iso: string): string {
  const d = new Date(iso.replace(" ", "T") + (iso.endsWith("Z") ? "" : "Z"));
  if (Number.isNaN(d.getTime())) return iso;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: now.getFullYear() === d.getFullYear() ? undefined : "numeric",
  });
}
