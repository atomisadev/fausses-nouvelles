"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Be_Vietnam_Pro } from "next/font/google";
import { FaCheck, FaTimes } from "react-icons/fa";

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["300", "400", "500", "600"],
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

//temp info
const fake = false;
const arr = [
  {
    title: "Biden walks into flames unknowingly",
    match: 74,
    url: "https://www.nytimes.com/",
    site: "The Washington Post",
    desc: "Biden accidentally walks into the flames while trying to recover his dog.",
  },
  {
    title:
      "What!? The President of the United States walks into flames unknowingly",
    match: 44,
    url: "https://www.nytimes.com/",
    site: "New York Times",
    desc: "Biden accidentally walks into the flames while trying to recover his dog.",
  },
  {
    title:
      "What!? The President of the United States walks into flames unknowingly",
    match: 14,
    url: "https://www.nytimes.com/",
    site: "New York Times",
    desc: "Biden accidentally walks into the flames while trying to recover his dog.",
  },
];

export default function Article() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url");
  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [nlpData, setNlpData] = useState<NLPData>({});
  const [showContent, setShowContent] = useState(false);

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
            mode: "cors",
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

        // Add delay before showing content
        setTimeout(() => {
          setLoading(false);
          setShowContent(true);
        }, 2000); // 2 second delay
      }
    }

    fetchData();
  }, [url]);

  return (
    <main className="flex min-h-screen items-center justify-center flex-col p-4">
      <div className="flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-4">
          <h1 className="font-apple-garamond font-light text-6xl">
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

        {article && showContent && (
          <div className="grid grid-cols-2 space-x-8 space-y-1 w-[52rem]">
            <div className="row-span-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-[36.2rem] rounded-lg border-2 border-[rgba(0,0,0,0.04)] bg-[#00000006] flex flex-col"
              >
                {article.mainImage && (
                  <div className="w-full h-[25rem] relative">
                    <Image
                      src={article.mainImage}
                      alt={article.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="p-6 mt-auto">
                  <p className={`${beVietnamPro.className} mb-3 font-semibold`}>
                    Article from {article.siteName}
                  </p>
                  <h1 className="font-apple-garamond font-bold text-2xl mb-4">
                    {article.title}
                  </h1>
                  <p
                    className={`${beVietnamPro.className} text-gray-600 tracking-tighter`}
                  >
                    {article.content.split(" ").slice(0, 15).join(" ")}...
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="row-span-3">
              <h1 className="font-apple-garamond font-medium text-[2rem]">
                fausses nouvelles says...
              </h1>
              <p
                className={`${beVietnamPro.className} font-normal text-black/50 text-[0.8rem] mt-[-6x] mb-3 tracking-tighter`}
              >
                This result may be inaccurate as it is AI generated by{" "}
                <span className="underline decoration-1">fausse-lite</span>.
              </p>
              <div>
                {nlpData.classification?.prediction === "0" ? (
                  <div
                    className={`${beVietnamPro.className} text-center bg-[rgba(34,205,99,0.14)] py-4 rounded-lg border-2 border-[rgba(1,90,25,0.1)] text-[#004219] flex items-center justify-center gap-4 font-medium text-[1.4rem]`}
                  >
                    <FaCheck className="text-[#004219] text-2xl" />
                    We say this is real news
                  </div>
                ) : (
                  <div
                    className={`${beVietnamPro.className} text-center bg-[rgba(205,63,34,0.10)] py-4 rounded-lg border-2 border-[rgba(90,22,1,0.1)] text-[#420700] flex items-center justify-center gap-4 font-medium text-[1.4rem]`}
                  >
                    <FaTimes className="text-[#420700] text-2xl" />
                    We say this is fake news
                  </div>
                )}
              </div>
            </div>

            <div className="row-span-5 col-start-2 row-start-4">
              <div>
                <h1 className="font-apple-garamond font-medium text-[2rem] mb-[0.5px]">
                  corroborated results
                </h1>
                <p
                  className={`${beVietnamPro.className} font-normal text-black/50 text-[0.8rem] mt-[-6x] mb-3 tracking-tighter`}
                >
                  We fact-checked this article among a big list of articles
                  online.
                </p>
              </div>
              <div className="overflow-y-auto overflow-x-hidden h-[calc(100%-3rem)] pr-2">
                {nlpData.corroboration?.similarArticles
                  .slice(0, 2)
                  .map((item, index) => (
                    <div
                      key={index}
                      className="bg-[rgba(0,0,0,0.02)] rounded-lg px-8 py-4 mb-4 border-2 border-[rgba(0,0,0,0.04)]"
                    >
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block hover:opacity-80 transition-opacity"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className={`${beVietnamPro.className} text-sm font-semibold`}
                          >
                            {item.source}
                          </span>
                          <span
                            className={`${
                              beVietnamPro.className
                            } text-xs px-2 py-0.5 rounded-full font-medium ${
                              item.similarityScore * 100 >= 80
                                ? "bg-[rgba(34,205,99,0.14)] text-[#004219]"
                                : item.similarityScore * 100 >= 50
                                ? "bg-[rgba(255,178,55,0.14)] text-[#663D00]"
                                : "bg-[rgba(205,63,34,0.10)] text-[#420700]"
                            }`}
                          >
                            {Math.round(item.similarityScore * 100)}% similar
                          </span>
                        </div>
                        <h3 className="font-apple-garamond leading-tight mb-2 font-semibold text-[1.5rem]">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <p
                            className={`${beVietnamPro.className} text-xs font-semibold text-[rgba(0,0,0,0.62)] tracking-tighter`}
                          >
                            {item.content?.split(" ").slice(0, 15).join(" ")}...
                          </p>
                        </div>
                      </a>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
