import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function POST(req: NextRequest) {
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
        });
        const html = await response.text();
        const $ = cheerio.load(html);

        // Extract Name/Title
        const name = $("h1.elementor-heading-title").first().text().trim() ||
            $("h1").first().text().trim() ||
            $('meta[property="og:title"]').attr("content") ||
            $("title").text().trim();

        // Extract SEO Description
        const seoDesc = $('meta[name="description"]').attr("content") ||
            $('meta[property="og:description"]').attr("content") ||
            "";

        // Extract Image
        const imageUrl = $('.elementor-image img').first().attr("src") ||
            $('img.wp-post-image').first().attr("src") ||
            $('meta[property="og:image"]').attr("content") ||
            $('meta[name="twitter:image"]').attr("content") ||
            "";

        // Extract Content/Description
        let description = "";

        const contentSelectors = [
            ".elementor-widget-theme-post-content .elementor-widget-container",
            ".elementor-post__content",
            "article.post",
            "main article",
            ".entry-content",
            ".category-description",
            "#content .elementor-section-wrap"
        ];

        for (const selector of contentSelectors) {
            const el = $(selector);
            if (el.length > 0) {
                const html = el.html() || "";
                if (html.length > 300) {
                    description = html;
                    break;
                }
            }
        }

        if (!description || description.length < 300) {
            const parts: string[] = [];
            $('p, h2, h3, h4, ul, ol').each((_, el) => {
                const text = $(el).text();
                if (text.length > 20 && !text.includes("Copyright") && !text.includes("Menu")) {
                    parts.push($.html(el));
                }
            });
            description = parts.join("\n");
        }

        // Cleanup
        if (description) {
            const $content = cheerio.load(description, null, false);
            $content("script, style, iframe, button, noscript, .share-buttons, .ads, .related, .comments, .elementor-edit-area").remove();

            $content("img").each((_, img) => {
                const src = $(img).attr("src");
                if (src && src.startsWith("/")) {
                    try {
                        const baseUrl = new URL(url).origin;
                        $(img).attr("src", baseUrl + src);
                    } catch (e) { }
                }
            });
            description = $content.html();
        }

        return NextResponse.json({
            name,
            seoTitle: name,
            seoDesc,
            imageUrl,
            description
        });

    } catch (error: any) {
        console.error("Scraping error:", error);
        return NextResponse.json({ error: error.message || "Failed to fetch content" }, { status: 500 });
    }
}
