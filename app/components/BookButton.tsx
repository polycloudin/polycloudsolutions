"use client";

import { useState } from "react";
import BookModal from "./BookModal";

type Variant = "primary" | "secondary" | "light-primary" | "light-secondary";

const variantClasses: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  "light-primary":
    "btn-primary !bg-white !text-[var(--color-ink)] !border-white hover:!bg-[var(--color-primary-blue)] hover:!border-[var(--color-primary-blue)] hover:!text-white",
  "light-secondary":
    "btn-secondary !text-white !border-white/30 hover:!bg-white hover:!text-[var(--color-ink)]",
};

export default function BookButton({
  children,
  variant = "primary",
  className = "",
  topic,
}: {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  topic?: "digital" | "consulting" | "general";
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${variantClasses[variant]} ${className}`}
      >
        {children}
      </button>
      <BookModal open={open} onClose={() => setOpen(false)} defaultTopic={topic} />
    </>
  );
}
