import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-biq-border bg-biq-surface-1">
      <div className="mx-auto max-w-5xl px-6 py-12">
        {/* Brand + nav */}
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="text-lg font-bold text-biq-text-primary">Bayes<span className="text-biq-primary">IQ</span></p>
            <p className="mt-1 text-sm text-biq-text-muted">
              Governed analytics consulting and platform for teams that need trustworthy metrics.
            </p>
          </div>
          <nav className="flex flex-wrap gap-6">
            <Link href="/consulting" className="text-sm text-biq-text-muted hover:text-biq-text-primary">
              Consulting
            </Link>
            <Link href="/platform" className="text-sm text-biq-text-muted hover:text-biq-text-primary">
              Platform
            </Link>
            <Link href="/consulting/case-studies" className="text-sm text-biq-text-muted hover:text-biq-text-primary">
              Case Studies
            </Link>
            <Link href="/contact" className="text-sm text-biq-text-muted hover:text-biq-text-primary">
              Contact
            </Link>
            <Link href="/privacy" className="text-sm text-biq-text-muted hover:text-biq-text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-biq-text-muted hover:text-biq-text-primary">
              Terms of Service
            </Link>
          </nav>
        </div>

        {/* Legal */}
        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-biq-text-muted">
            &copy; {new Date().getFullYear()} BayesIQ. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-biq-text-muted hover:text-biq-text-secondary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-biq-text-muted hover:text-biq-text-secondary">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
