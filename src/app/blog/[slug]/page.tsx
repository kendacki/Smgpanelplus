import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site-shell";
import { prisma } from "@/lib/prisma";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) notFound();

  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <p className="text-sm text-white/40">{post.createdAt.toDateString()}</p>
        <h1 className="mt-2 font-display text-4xl">{post.title}</h1>
        <div className="mt-8 space-y-4 text-white/75">
          {post.content.split("\n\n").map((para) => (
            <p key={para.slice(0, 24)}>{para}</p>
          ))}
        </div>
      </article>
    </SiteShell>
  );
}
