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

        // Extract Title
        const title = $("h1.elementor-heading-title").first().text().trim() ||
            $("h1").first().text().trim() ||
            $('meta[property="og:title"]').attr("content") ||
            $("title").text().trim();

        // Extract SEO Description
        const seoDesc = $('meta[name="description"]').attr("content") ||
            $('meta[property="og:description"]').attr("content") ||
            "";

        // Extract Main Image
        const mainImage = $('.elementor-image img').first().attr("src") ||
            $('img.wp-post-image').first().attr("src") ||
            $('meta[property="og:image"]').attr("content") ||
            $('meta[name="twitter:image"]').attr("content") ||
            "";

        // Extract Content - Ultra-robust detection
        let content = "";

        // 1. Try specific high-probability selectors
        const contentSelectors = [
            ".elementor-widget-theme-post-content .elementor-widget-container",
            ".elementor-post__content",
            "article.post",
            "main article",
            ".entry-content",
            "#content .elementor-section-wrap" // Broad Elementor check
        ];

        for (const selector of contentSelectors) {
            const el = $(selector);
            if (el.length > 0) {
                const html = el.html() || "";
                if (html.length > 500) {
                    content = html;
                    break;
                }
            }
        }

        // 2. Fallback: Find the container with the most paragraphs (heuristic)
        if (!content || content.length < 500) {
            let maxScore = 0;
            let bestEl: any = null;

            $('div, section, article').each((_, el) => {
                const $el = $(el);
                // Score based on child elements often found in blog posts
                const score = ($el.find('> p').length * 2) +
                    ($el.find('> h2, > h3').length * 3) +
                    ($el.find('> ul, > ol').length * 2);

                if (score > maxScore) {
                    maxScore = score;
                    bestEl = el;
                }
            });

            if (bestEl) {
                content = $(bestEl).html() || "";
            }
        }

        // 3. Last Resort: Use all paragraphs and headings in order
        if (!content || content.length < 300) {
            const parts: string[] = [];
            $('p, h2, h3, h4, ul, ol').each((_, el) => {
                const text = $(el).text();
                if (text.length > 20 && !text.includes("Copyright") && !text.includes("Menu")) {
                    parts.push($.html(el));
                }
            });
            content = parts.join("\n");
        }

        // Cleanup the final content
        if (content) {
            const $content = cheerio.load(content, null, false);
            // Remove common unwanted tags
            $content("script, style, iframe, button, noscript, .share-buttons, .ads, .related, .comments, .elementor-edit-area, .elementor-widget-button").remove();

            // Fix relative images if any
            $content("img").each((_, img) => {
                const src = $(img).attr("src");
                if (src && src.startsWith("/")) {
                    try {
                        const baseUrl = new URL(url).origin;
                        $(img).attr("src", baseUrl + src);
                    } catch (e) { }
                }
            });

            content = $content.html();
        }

        return NextResponse.json({
            title,
            seoDesc,
            mainImage,
            content,
            excerpt: seoDesc // Use SEO description as excerpt by default
        });

    } catch (error: any) {
        console.error("Scraping error:", error);
        return NextResponse.json({ error: error.message || "Failed to fetch content" }, { status: 500 });
    }
}
