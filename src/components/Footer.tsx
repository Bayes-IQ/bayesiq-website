import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-bayesiq-200 bg-bayesiq-50">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="text-lg font-bold text-bayesiq-900">BayesIQ</p>
            <p className="mt-1 text-sm text-bayesiq-500">
              AI-powered data auditing for teams that can&apos;t afford bad metrics.
            </p>
          </div>
          <nav className="flex gap-6">
            <Link href="/services" className="text-sm text-bayesiq-500 hover:text-bayesiq-900">
              Services
            </Link>
            <Link href="/approach" className="text-sm text-bayesiq-500 hover:text-bayesiq-900">
              Approach
            </Link>
            <Link href="/case-studies" className="text-sm text-bayesiq-500 hover:text-bayesiq-900">
              Case Studies
            </Link>
            <Link href="/contact" className="text-sm text-bayesiq-500 hover:text-bayesiq-900">
              Contact
            </Link>
          </nav>
        </div>
        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-bayesiq-400">
            &copy; {new Date().getFullYear()} BayesIQ. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-bayesiq-400 hover:text-bayesiq-600">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-bayesiq-400 hover:text-bayesiq-600">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
