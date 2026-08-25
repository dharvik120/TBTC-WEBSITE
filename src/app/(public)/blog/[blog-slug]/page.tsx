import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Calendar, User, ArrowLeft } from "lucide-react";
import prisma from "@/lib/prisma";
import { Metadata } from "next";

interface BlogPostPageProps {
  params: Promise<{
    "blog-slug": string;
  }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams["blog-slug"];

  const blog = await prisma.blog.findUnique({
    where: { slug },
  });

  if (!blog) return {};

  return {
    title: blog.seoTitle || blog.title,
    description: blog.seoDescription || blog.summary || undefined,
    keywords: blog.seoKeywords || undefined,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams["blog-slug"];

  // Fetch the blog post
  const blog = await prisma.blog.findUnique({
    where: { slug },
  });

  if (!blog || blog.status !== "PUBLISHED") {
    notFound();
  }

  return (
    <div className="w-full py-8 lg:py-12 bg-slate-50/50">
      <div className="max-w-4xl mx-auto px-4 font-sans">
        
        {/* Breadcrumbs */}
        <nav className="text-xs font-mono text-slate-400 mb-6 flex items-center gap-1.5 uppercase">
          <Link href="/" className="hover:text-slate-600">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/blog" className="hover:text-slate-600">Blog</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-600 font-bold truncate max-w-[200px]">{blog.title}</span>
        </nav>

        {/* Back Link */}
        <Link 
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 mb-6 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Articles</span>
        </Link>

        {/* Blog Container */}
        <article className="bg-white border border-slate-200 rounded-md p-6 lg:p-10 shadow-sm overflow-hidden">
          
          {/* Header */}
          <header className="border-b border-slate-150 pb-6 mb-8">
            <h1 className="text-2xl lg:text-4xl font-black text-slate-950 tracking-tight leading-snug mb-4">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(blog.publishDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              {blog.author && (
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  <span>By {blog.author}</span>
                </div>
              )}
            </div>
          </header>

          {/* Featured Image */}
          {blog.featuredImageUrl && (
            <div className="w-full aspect-video rounded overflow-hidden border border-slate-200 mb-8 bg-slate-50">
              <img 
                src={blog.featuredImageUrl} 
                alt={blog.title} 
                className="w-full h-full object-cover" 
              />
            </div>
          )}

          {/* Body Content */}
          <div className="prose max-w-none text-slate-650 leading-relaxed text-sm whitespace-pre-line space-y-4">
            {blog.content}
          </div>

        </article>

      </div>
    </div>
  );
}
