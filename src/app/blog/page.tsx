import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights on data quality, telemetry validation, and analytics pipeline reliability from BayesIQ.",
  openGraph: {
    title: "Blog — BayesIQ",
    description:
      "Insights on data quality, telemetry validation, and analytics pipeline reliability from BayesIQ.",
  },
};

const blogJsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "BayesIQ Blog",
  description: "Insights on data quality, telemetry validation, and analytics pipeline reliability.",
  publisher: { "@type": "Organization", name: "BayesIQ", url: "https://bayes-iq.com" },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <section className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-bayesiq-900">
          Blog
        </h1>
        <p className="mt-4 text-lg text-bayesiq-600">
          Practical insights on data quality, telemetry, and analytics
          reliability.
        </p>

        <div className="mt-12 space-y-10">
          {posts.length === 0 && (
            <p className="text-sm text-bayesiq-400">No posts yet.</p>
          )}
          {posts.map((post) => (
            <article key={post.slug} className="border-t border-bayesiq-200 pt-8">
              <p className="text-xs text-bayesiq-400">{post.date}</p>
              <h2 className="mt-2 text-xl font-semibold text-bayesiq-900">
                <Link
                  href={`/blog/${post.slug}`}
                  className="hover:text-accent"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-bayesiq-600">
                {post.description}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-3 inline-block text-sm font-medium text-bayesiq-900 hover:text-accent"
              >
                Read more &rarr;
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
    </>
  );
}
