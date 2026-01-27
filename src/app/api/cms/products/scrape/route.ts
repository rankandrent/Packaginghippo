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

        // Extract Name
        const name = $("h1.elementor-heading-title").first().text().trim() ||
            $("h1.product_title").first().text().trim() ||
            $("h1").first().text().trim() ||
            $('meta[property="og:title"]').attr("content") ||
            $("title").text().trim();

        // Extract SEO Description
        const seoDesc = $('meta[name="description"]').attr("content") ||
            $('meta[property="og:description"]').attr("content") ||
            "";

        // Extract Images (get first few)
        const images: string[] = [];
        $('.elementor-image img, .woocommerce-product-gallery img, .product-images img').each((_, img) => {
            const src = $(img).attr("src");
            if (src && !images.includes(src)) {
                images.push(src);
            }
        });

        if (images.length === 0) {
            const ogImage = $('meta[property="og:image"]').attr("content");
            if (ogImage) images.push(ogImage);
        }

        // Extract Price
        let price = 0;
        const priceText = $(".price, .amount, .product-price").first().text().replace(/[^0-9.]/g, "");
        if (priceText) {
            price = parseFloat(priceText);
        }

        // Extract Short Description
        const shortDesc = $(".woocommerce-product-details__short-description, .product-short-description, .short-description").first().text().trim();

        // Extract Long Description
        let description = "";
        const contentSelectors = [
            "#tab-description",
            ".product-description",
            ".elementor-widget-theme-post-content .elementor-widget-container",
            ".entry-content",
            "#content .elementor-section-wrap"
        ];

        for (const selector of contentSelectors) {
            const el = $(selector);
            if (el.length > 0) {
                const html = el.html() || "";
                if (html.length > 200) {
                    description = html;
                    break;
                }
            }
        }

        if (!description || description.length < 200) {
            const parts: string[] = [];
            $('p, h2, h3, h4, ul, ol').each((_, el) => {
                const $el = $(el);
                if ($el.closest('header, footer, nav').length === 0) {
                    const text = $el.text();
                    if (text.length > 20 && !text.includes("Copyright") && !text.includes("Menu")) {
                        parts.push($.html(el));
                    }
                }
            });
            description = parts.join("\n");
        }

        // Cleanup
        if (description) {
            const $content = cheerio.load(description, null, false);
            $content("script, style, iframe, button, noscript, .share-buttons, .ads, .related, .comments").remove();

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
            images: images.slice(0, 5),
            description,
            shortDesc,
            price
        });

    } catch (error: any) {
        console.error("Scraping error:", error);
        return NextResponse.json({ error: error.message || "Failed to fetch content" }, { status: 500 });
    }
}
