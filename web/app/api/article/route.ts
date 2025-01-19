import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

const COHERE_API_URL = "https://api.cohere.ai/v1/chat";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Invalid URL provided" },
        { status: 400 }
      );
    }

    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    const rawTitle = $("title").text() || "Untitled";
    const rawContent =
      $("article").text().replace(/\s+/g, " ").trim() ||
      $("main").text().replace(/\s+/g, " ").trim() ||
      $("body").text().replace(/\s+/g, " ").trim();

    // Extract main image
    const mainImage =
      $('meta[property="og:image"]').attr("content") || // Try Open Graph image first
      $('meta[name="twitter:image"]').attr("content") || // Then Twitter image
      $("article img").first().attr("src") || // Then first image in article
      $("main img").first().attr("src") || // Then first image in main
      $("body img").first().attr("src"); // Finally any image on page

    const siteName =
      $('meta[property="og:site_name"]').attr("content") ||
      new URL(url).hostname.replace(/^www\./, "");

    const favicon =
      $('link[rel="icon"]').attr("href") ||
      $('link[rel="shortcut icon"]').attr("href") ||
      $('link[rel="apple-touch-icon"]').attr("href") ||
      new URL("/favicon.ico", url).toString();

    const { data: cohereResponse } = await axios.post(
      COHERE_API_URL,
      {
        message: JSON.stringify({
          title: rawTitle,
          content: rawContent,
          siteName: siteName,
          favicon: favicon,
          mainImage: mainImage,
        }),
        model: "command-r-plus-08-2024",
        preamble:
          "You are a JSON cleaner. I will give you JSON from scraped news articles that contains metadata including title, content, site name, favicon URL and main image URL. Clean the title and content of any extra text while preserving the metadata. Return ONLY JSON with keys: title, content, siteName, favicon, and mainImage.",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.COHERE_API_KEY!}`,
          "Content-Type": "application/json",
        },
      }
    );

    const cleanedData = JSON.parse(cohereResponse.text);

    return NextResponse.json({
      title: cleanedData.title,
      content: cleanedData.content,
      siteName: cleanedData.siteName,
      favicon: cleanedData.favicon,
      mainImage: cleanedData.mainImage,
      url: url,
    });
  } catch (error) {
    console.error("Error processing article:", error);
    return NextResponse.json(
      { error: "Failed to process article" },
      { status: 500 }
    );
  }
}
