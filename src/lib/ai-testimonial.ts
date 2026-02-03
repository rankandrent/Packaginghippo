
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

if (!OPENROUTER_API_KEY) {
    console.warn("Missing OPENROUTER_API_KEY")
}

type GeneratedTestimonial = {
    name: string
    role: string
    content: string
    rating: number
}

async function generateTestimonials(prompt: string, count: number = 3): Promise<GeneratedTestimonial[]> {
    if (!OPENROUTER_API_KEY) {
        console.error("AI Generation Failed: OPENROUTER_API_KEY is missing from environment variables.")
        throw new Error("OPENROUTER_API_KEY is not set. Please restart the server if you just added it.")
    }

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                // "HTTP-Referer": "https://packaginghippo.com", // Optional
            },
            body: JSON.stringify({
                "model": "google/gemini-2.0-flash-001", // Or any other good model
                "messages": [
                    {
                        "role": "system",
                        "content": `You are a helpful assistant that generates realistic customer testimonials. 
                        Return ONLY a JSON array of objects. Each object must have:
                        - name: string (realistic name)
                        - role: string (e.g. "Marketing Manager at ...", "Business Owner", etc.)
                        - content: string (the review text, professional and enthusiastic, 30-50 words)
                        - rating: number (float between 4.0 and 5.0)`
                    },
                    {
                        "role": "user",
                        "content": `${prompt} Generate ${count} unique testimonials.`
                    }
                ],
                "response_format": { type: "json_object" }
            })
        });

        if (!response.ok) {
            const err = await response.text()
            console.error("OpenRouter API Error:", err)
            throw new Error(`OpenRouter API Error: ${response.status}`)
        }

        const data = await response.json()
        const content = data.choices[0].message.content

        // Parse JSON from content
        let parsed: { testimonials: GeneratedTestimonial[] } | GeneratedTestimonial[]
        try {
            parsed = JSON.parse(content)
        } catch (e) {
            // Fallback if it didn't return pure JSON (sometimes happens)
            const match = content.match(/\[[\s\S]*\]/)
            if (match) {
                parsed = JSON.parse(match[0])
            } else {
                throw e
            }
        }

        if (Array.isArray(parsed)) {
            return parsed
        } else if (parsed.testimonials && Array.isArray(parsed.testimonials)) {
            return parsed.testimonials
        }

        return []

    } catch (error) {
        console.error("Error generating testimonials:", error)
        return []
    }
}

export async function generateProductTestimonials(productName: string, productDesc: string, count: number = 3) {
    const prompt = `Write authentic 5-star reviews for a custom packaging product called "${productName}". 
    Context: ${productDesc.slice(0, 200)}. 
    Focus on quality, print clarity, and durability. 
    Vary the tone (some short, some detailed).`
    return generateTestimonials(prompt, count)
}

export async function generateCategoryTestimonials(categoryName: string, categoryDesc: string, count: number = 3) {
    const prompt = `Write authentic 5-star reviews for a packaging service category called "${categoryName}".
    Context: ${categoryDesc.slice(0, 200)}.
    Focus on service, delivery speed, and bulk pricing.
    Vary the tone.`
    return generateTestimonials(prompt, count)
}
