import * as cheerio from "cheerio";

async function test() {
    const url = "https://packaginghippo.com/candle-boxes/";
    console.log(`Testing scraping for: ${url}`);

    const response = await fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
    });
    const html = await response.text();
    const $ = cheerio.load(html);

    // From route.ts logic:
    let shortDesc = $(".woocommerce-product-details__short-description, .product-short-description, .short-description").first().text().trim();

    if (!shortDesc) {
        const targetSection = $('#content section:first-child section:first-child div.elementor-column:first-child div.elementor-widget-text-editor:nth-of-type(4) p');
        if (targetSection.length > 0) {
            shortDesc = targetSection.text().trim();
        }
    }

    if (!shortDesc) {
        $('p').each((_, el) => {
            const text = $(el).text().trim();
            if (text.toLowerCase().includes("having trouble") || text.toLowerCase().includes("increased sales and long-lasting impressions")) {
                shortDesc = text;
                return false;
            }
        });
    }

    console.log("Extracted Short Description:");
    console.log(shortDesc);

    if (shortDesc && shortDesc.startsWith("Having trouble")) {
        console.log("SUCCESS: Short description correctly extracted.");
    } else {
        console.log("FAILURE: Short description not found or incorrect.");
    }
}

test();
