
import Link from 'next/link';
import { blogPosts } from '@/lib/blog-data';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

export default function BlogPage() {
  return (
    <div className="relative z-10 mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          The Statement Converter Blog
        </h1>
        <p className="mt-4 text-xl text-gray-500">
          Tips, tricks, and insights on managing your financial data.
        </p>
      </header>

      <div className="space-y-8">
        {blogPosts.map((post) => (
          <Link href={`/blog/${post.slug}`} key={post.slug} legacyBehavior>
            <a className="block group">
              <Card className="transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 group-hover:border-primary">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-base pt-2">
                    {post.summary}
                  </CardDescription>
                  <div className="flex items-center text-primary font-semibold pt-4 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    Read more <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardHeader>
              </Card>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
