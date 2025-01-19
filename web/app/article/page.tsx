"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Be_Vietnam_Pro } from "next/font/google";

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
  const [loading, setLoading] = useState(false);
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
        <div className="flex flex-col items-center gap-6">
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
          <div className="flex flex-row gap-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-xl w-[24rem] rounded-lg shadow-lg bg-[#00000006]"
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
                <p
                  className={`${beVietnamPro.className} text-gray-600 tracking-tighter`}
                >
                  {article.content.split(" ").slice(0, 15).join(" ")}...
                </p>
              </div>
            </motion.div>
            <div className="px-4 py-2 w-[28rem]">
              <h1 className={`font-apple-garamond font-medium text-[2rem]`}>
                fausses nouvelles says...
              </h1>
              <p
                className={`${beVietnamPro.className} font-light text-[0.8rem] tracking-tighter`}
              >
                This result may be inaccurate as it is AI generated by{" "}
                <span className="underline decoration-1">fausse-lite</span>.
              </p>
              <div>
                {fake ? (
                  <div
                    className={`${beVietnamPro.className} text-center bg-[rgba(34,205,99,0.14)] py-4 rounded-lg border-2 border-[rgba(1,90,25,0.1)] text-[#004219] font-medium text-[1.4rem]`}
                  >
                    We say this is real news
                  </div>
                ) : (
                  <div
                    className={`${beVietnamPro.className} text-center bg-[rgba(205,63,34,0.10)] py-4 rounded-lg border-2 border-[rgba(90,22,1,0.1)] text-[#420700] font-medium text-[1.4rem]`}
                  >
                    We say this is fake news
                  </div>
                )}
              </div>
              <h1
                className={`font-apple-garamond font-medium text-[2rem] mt-8`}
              >
                corroborated results
              </h1>
              <div>
                <div className="overflow-scroll	h-64 overflow-x-hidden">
                  {arr.map((item, index) => (
                    <div key={index} className="bg-[rgba(0,0,0,0.02)] rounded-lg px-8 py-4 my-4 border-2 border-[rgba(0,0,0,0.04)]" >
                      <a href={item.url}>
                      
                      <span className={`${beVietnamPro.className} text-sm font-semi-bold`}>{item.site}</span>
                      
                      <h3 className="font-apple-garamond font-semibold text-[1.5rem]">{item.title}</h3>
                      <p className={`${beVietnamPro.className} text-xs font-semi-bold text-[rgba(0,0,0,0.62)] tracking-tighter`}>{item.desc}</p>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
