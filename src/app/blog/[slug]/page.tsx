
import { blogPosts, type Post } from '@/lib/blog-data';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

function getPost(slug: string): Post | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="relative z-10 mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/blog" className="flex items-center text-primary hover:underline mb-8 text-sm font-semibold">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to all articles
      </Link>
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Published on {new Date(post.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </header>
      
      <div
        className="prose prose-lg mx-auto"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
