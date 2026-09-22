import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { Card } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Blog" };

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <SiteShell>
      <div className="mx-auto max-w-5xl px-4 py-16 md:px-6">
        <p className="text-smg">Insights</p>
        <h1 className="mt-2 font-display text-4xl">Our blog</h1>
        <div className="mt-10 grid gap-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <Card className="hover:orange-ring">
                <p className="text-xs text-white/40">{post.createdAt.toDateString()}</p>
                <h2 className="mt-2 text-2xl font-semibold">{post.title}</h2>
                <p className="mt-2 text-white/60">{post.excerpt}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
