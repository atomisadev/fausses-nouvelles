"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

interface ArticleData {
  title: string;
  content: string;
  siteName: string;
  favicon: string;
  mainImage: string;
  url: string;
}

export default function Article() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url");
  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState<ArticleData | null>(null);

  useEffect(() => {
    if (url) {
      fetch(`/api/article?url=${encodeURIComponent(url)}`)
        .then((res) => res.json())
        .then((data) => {
          setArticle(data);
          setLoading(false);
        });
    }
  }, [url]);

  return (
    <main className="flex min-h-screen items-center justify-center flex-col p-4">
      {loading ? (
        <div className="flex flex-col items-center gap-4">
          <h1 className="font-apple-garamond font-light text-4xl">
            fausses nouvelles
          </h1>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
          <p className="font-apple-garamond">Loading your article</p>
        </div>
      ) : (
        article && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl w-full rounded-lg overflow-hidden shadow-lg bg-white"
          >
            {article.mainImage && (
              <div className="w-full h-48 relative">
                <Image
                  src={article.mainImage}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <h1 className="font-apple-garamond text-2xl mb-4">
                {article.title}
              </h1>
              <p className="font-apple-garamond text-gray-600">
                {article.content.split(" ").slice(0, 10).join(" ")}...
              </p>
            </div>
          </motion.div>
        )
      )}
    </main>
  );
}
