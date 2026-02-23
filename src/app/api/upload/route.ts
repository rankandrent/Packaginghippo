import { NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from 'cloudinary'
import https from 'https'
import crypto from 'crypto'

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get("file") as File

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
        }

        // 1. Extract original filename and extension
        const originalName = file.name || "image"
        const lastDotIndex = originalName.lastIndexOf('.')
        // Handle cases where there is no extension
        const rawName = lastDotIndex !== -1 ? originalName.substring(0, lastDotIndex) : originalName

        // 2. Slugify the filename: lowercase, replace non-alphanumerics with hyphens, trim extra hyphens
        const slugifiedName = rawName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '') || "upload"

        // 3. Final SEO-friendly public ID (exact match to input)
        const finalPublicId = slugifiedName

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Create a custom agent to handle legacy server connections (fix for SSL error)
        const agent = new https.Agent({
            secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
        })

        // Upload to Cloudinary via stream
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "products",
                    public_id: finalPublicId,
                    use_filename: true,
                    unique_filename: false,
                    overwrite: true,
                    // Auto-optimize: compress size and convert to best format (standard web practice)
                    transformation: [
                        { quality: "auto", fetch_format: "auto" }
                    ],
                    // @ts-ignore - Cloudinary types might not include agent but the underlying request supports it
                    agent: agent
                },
                (error, result) => {
                    if (error) reject(error)
                    else resolve(result)
                }
            )
            uploadStream.end(buffer)
        }) as any

        return NextResponse.json({ url: result.secure_url })
    } catch (error: any) {
        console.error("Upload Error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to upload image" },
            { status: 500 }
        )
    }
}
