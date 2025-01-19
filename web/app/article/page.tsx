"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Be_Vietnam_Pro } from "next/font/google";

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["400", "600"],
  subsets: ["latin"],
});

interface ArticleData {
  title: string;
  content: string;
  siteName: string;
  favicon: string;
  mainImage: string;
  url: string;
}

interface NLPData {
  corroboration?: any;
  rating?: any;
  classification?: any;
}

export default function Article() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url");
  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [nlpData, setNlpData] = useState<NLPData>({});

  useEffect(() => {
    async function fetchData() {
      if (url) {
        // Fetch article
        const articleRes = await fetch(
          `/api/article?url=${encodeURIComponent(url)}`
        );
        const articleData = await articleRes.json();
        setArticle(articleData);

        // Fetch NLP data
        const [corrobRes, ratingRes, classifyRes] = await Promise.all([
          fetch("http://132.145.162.209/api/nlp/corroborate", {
            method: "POST",
            headers: {
              accept: "application/json",
              "Content-Type": "application/json",
            },
            mode: "cors", // Add CORS mode
            body: JSON.stringify({
              content: articleData.content,
              title: articleData.title,
            }),
          }),
          fetch(
            `http://132.145.162.209/api/nlp/rating?input=${encodeURIComponent(
              articleData.content
            )}`,
            {
              method: "POST",
              headers: {
                accept: "application/json",
                "Content-Type": "application/json",
              },
              mode: "cors",
            }
          ),
          fetch("http://132.145.162.209/api/nlp/classify", {
            method: "POST",
            headers: {
              accept: "application/json",
              "Content-Type": "application/json",
            },
            mode: "cors",
            body: JSON.stringify({
              content: articleData.content,
              title: articleData.title,
            }),
          }),
        ]);

        const [corrobData, ratingData, classifyData] = await Promise.all([
          corrobRes.json(),
          ratingRes.json(),
          classifyRes.json(),
        ]);

        setNlpData({
          corroboration: corrobData,
          rating: ratingData,
          classification: classifyData,
        });
        setLoading(false);
      }
    }

    fetchData();
  }, [url]);

  return (
    <main className="flex min-h-screen items-center justify-center flex-col p-4">
      <div className="flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-4">
          <h1 className="font-apple-garamond font-light tracking-tighter text-6xl">
            fausses nouvelles
          </h1>
          {loading && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
              <p className={`${beVietnamPro.className} font-semibold`}>
                Loading your article
              </p>
            </>
          )}
        </div>

        {article && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl w-[24rem] rounded-lg overflow-hidden shadow-lg bg-white"
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
              <p className={`${beVietnamPro.className} mb-3 font-semibold`}>
                Article from {article.siteName}
              </p>
              <h1 className="font-apple-garamond font-bold text-2xl mb-4">
                {article.title}
              </h1>
              <p className={`${beVietnamPro.className} text-gray-600`}>
                {article.content.split(" ").slice(0, 15).join(" ")}...
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
