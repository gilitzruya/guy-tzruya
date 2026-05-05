import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="flex min-h-[100vh] flex-col items-center justify-center gap-4 px-6 text-center"
      style={{ fontFamily: "system-ui, sans-serif" }}
    >
      <p className="text-[var(--color-text)]/90">Page not found</p>
      <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-semibold">
        <Link
          href="/he"
          className="text-[var(--color-accent)] underline-offset-4 hover:underline"
          prefetch={false}
        >
          Hebrew home
        </Link>
        <span className="text-[var(--color-text)]/40">·</span>
        <Link
          href="/en"
          className="text-[var(--color-accent)] underline-offset-4 hover:underline"
          prefetch={false}
        >
          English home
        </Link>
      </div>
    </div>
  );
}
