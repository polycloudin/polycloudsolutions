"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { SNAPSHOTS, shortMonth } from "./data";

type ChartKind = "pnl" | "cash" | "gst" | "tds";

function ChartCard({
  title,
  subtitle,
  kind,
  delay,
}: {
  title: string;
  subtitle: string;
  kind: ChartKind;
  delay: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const check = () => {
      if ((window as unknown as { Chart?: unknown }).Chart) {
        setReady(true);
        return true;
      }
      return false;
    };
    if (check()) return;
    const t = setInterval(() => {
      if (check()) clearInterval(t);
    }, 100);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!ready || !canvasRef.current) return;
    const ChartLib = (window as unknown as { Chart?: any }).Chart;
    if (!ChartLib) return;

    const labels = SNAPSHOTS.map((s) => shortMonth(s.monthYear));
    const BLUE = "#1A5FD4";
    const ORANGE = "#F46B2C";
    const SUCCESS = "#15803D";
    const ERROR = "#DC2626";
    const INK = "#0A0A0A";

    const inrTick = (v: number) => {
      const n = Math.abs(v);
      if (n >= 10_000_000) return "₹" + (v / 10_000_000).toFixed(1) + "Cr";
      if (n >= 100_000) return "₹" + (v / 100_000).toFixed(0) + "L";
      if (n >= 1000) return "₹" + (v / 1000).toFixed(0) + "K";
      return "₹" + v;
    };

    ChartLib.defaults.font.family =
      "'Inter', system-ui, -apple-system, sans-serif";
    ChartLib.defaults.font.size = 11;
    ChartLib.defaults.color = "#6B7280";

    const common = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index" as const, intersect: false },
      plugins: {
        legend: {
          position: "bottom" as const,
          labels: {
            boxWidth: 8,
            boxHeight: 8,
            padding: 16,
            usePointStyle: true,
            pointStyle: "rectRounded",
          },
        },
        tooltip: {
          backgroundColor: INK,
          titleColor: "#FAFAF8",
          bodyColor: "#FAFAF8",
          padding: 10,
          titleFont: { size: 12, weight: "600" as const },
          bodyFont: { size: 12 },
          displayColors: false,
          callbacks: {
            label: (ctx: { dataset: { label: string }; raw: number }) =>
              `${ctx.dataset.label}: ${inrTick(ctx.raw)}`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: inrTick, padding: 6 },
          grid: { color: "#F3F0E8" },
        },
        x: { ticks: { padding: 4 }, grid: { display: false } },
      },
    };

    const configs: Record<ChartKind, any> = {
      pnl: {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Revenue",
              data: SNAPSHOTS.map((s) => s.revenue),
              borderColor: BLUE,
              backgroundColor: BLUE + "1f",
              fill: true,
              tension: 0.35,
              pointRadius: 0,
              pointHoverRadius: 4,
              borderWidth: 2,
            },
            {
              label: "Expenses",
              data: SNAPSHOTS.map((s) => s.expenses),
              borderColor: ERROR,
              backgroundColor: "transparent",
              fill: false,
              tension: 0.35,
              borderDash: [4, 3],
              pointRadius: 0,
              pointHoverRadius: 4,
              borderWidth: 1.5,
            },
          ],
        },
        options: common,
      },
      cash: {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Closing cash",
              data: SNAPSHOTS.map((s) => s.closingCash),
              borderColor: BLUE,
              backgroundColor: BLUE + "1f",
              fill: true,
              tension: 0.4,
              pointRadius: 0,
              pointHoverRadius: 4,
              borderWidth: 2,
            },
          ],
        },
        options: {
          ...common,
          plugins: { ...common.plugins, legend: { display: false } },
        },
      },
      gst: {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Liability",
              data: SNAPSHOTS.map((s) => s.gstLiability),
              backgroundColor: ORANGE,
              borderRadius: 4,
              barPercentage: 0.75,
              categoryPercentage: 0.8,
            },
            {
              label: "Paid",
              data: SNAPSHOTS.map((s) => s.gstPaid),
              backgroundColor: SUCCESS,
              borderRadius: 4,
              barPercentage: 0.75,
              categoryPercentage: 0.8,
            },
          ],
        },
        options: common,
      },
      tds: {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Deducted",
              data: SNAPSHOTS.map((s) => s.tdsDeducted),
              backgroundColor: BLUE,
              borderRadius: 4,
              barPercentage: 0.75,
              categoryPercentage: 0.8,
            },
            {
              label: "Deposited",
              data: SNAPSHOTS.map((s) => s.tdsDeposited),
              backgroundColor: SUCCESS,
              borderRadius: 4,
              barPercentage: 0.75,
              categoryPercentage: 0.8,
            },
          ],
        },
        options: common,
      },
    };

    const chart = new ChartLib(canvasRef.current, configs[kind]);
    return () => chart.destroy();
  }, [ready, kind]);

  return (
    <div
      className={`anim-fade-up ${delay} border border-[var(--color-line)] rounded-sm bg-[var(--color-surface)] p-6`}
    >
      <h3 className="text-[17px] md:text-[19px] text-[var(--color-ink)]">
        {title}
      </h3>
      <p className="mt-1 mb-4 text-[12px] text-[var(--color-text-muted)]">
        {subtitle}
      </p>
      <div className="h-56">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}

export default function DashboardCharts() {
  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"
        strategy="afterInteractive"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard
          title="Revenue & expenses"
          subtitle="Top-line performance with gross-margin envelope."
          kind="pnl"
          delay="delay-1"
        />
        <ChartCard
          title="Closing cash"
          subtitle="Month-end bank balance."
          kind="cash"
          delay="delay-2"
        />
        <ChartCard
          title="GST — liability & paid"
          subtitle="Difference indicates exposure pending deposit."
          kind="gst"
          delay="delay-3"
        />
        <ChartCard
          title="TDS — deducted & deposited"
          subtitle="Gap triggers Section 201(1A) interest."
          kind="tds"
          delay="delay-4"
        />
      </div>
    </>
  );
}
