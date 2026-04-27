import Link from "next/link";
import BookButton from "./BookButton";
import MobileMenu from "./MobileMenu";

type NavKey = "digital" | "consulting" | "labs" | "insights" | "about";

const links: { key: NavKey; href: string; label: string }[] = [
  { key: "digital", href: "/digital", label: "Digital" },
  { key: "consulting", href: "/consulting", label: "Consulting" },
  { key: "labs", href: "/labs", label: "Labs" },
  { key: "insights", href: "/blog", label: "Insights" },
  { key: "about", href: "/about", label: "About" },
];

export default function SiteNav({ active }: { active?: NavKey }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-4 backdrop-blur-xl bg-[var(--color-surface)]/80 border-b border-[var(--color-line)]">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
        <Link href="/" className="text-display text-xl tracking-tight shrink-0">
          Polycloud<span className="text-[var(--color-primary-orange)]">.</span>
        </Link>

        <div className="hidden md:flex items-center gap-9 text-[14px] text-[var(--color-text)]">
          {links.map((l) => (
            <Link
              key={l.key}
              href={l.href}
              className={
                active === l.key
                  ? "link-underline text-[var(--color-ink)] font-medium"
                  : "link-underline"
              }
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/login"
            className="hidden sm:inline-block text-[13px] text-[var(--color-text)] hover:text-[var(--color-ink)] link-underline px-2 py-2"
          >
            Sign in
          </Link>
          <BookButton
            variant="primary"
            className="!py-2 !px-4 !text-[13px]"
          >
            <span className="hidden sm:inline">Book a call</span>
            <span className="sm:hidden">Book</span>
          </BookButton>
          <MobileMenu links={links} active={active} />
        </div>
      </div>
    </nav>
  );
}
