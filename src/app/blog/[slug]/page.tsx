import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { getAllSlugs, getPostBySlug } from "@/lib/blog";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.meta.title,
    description: post.meta.description,
    openGraph: {
      title: `${post.meta.title} — BayesIQ`,
      description: post.meta.description,
      type: "article",
      publishedTime: post.meta.date,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/blog"
          className="text-sm text-bayesiq-400 hover:text-bayesiq-600"
        >
          &larr; Back to blog
        </Link>

        <header className="mt-8">
          <p className="text-sm text-bayesiq-400">{post.meta.date}</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-bayesiq-900">
            {post.meta.title}
          </h1>
          <p className="mt-4 text-lg text-bayesiq-600">
            {post.meta.description}
          </p>
        </header>

        <div className="prose-bayesiq mt-12">
          <MDXRemote source={post.content} />
        </div>
      </div>
    </article>
  );
}
