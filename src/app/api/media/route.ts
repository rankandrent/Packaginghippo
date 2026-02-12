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

// Create a custom agent to handle legacy server connections
const agent = new https.Agent({
    secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
})

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const cursor = searchParams.get('cursor') // For pagination

        const result = await cloudinary.api.resources({
            type: 'upload',
            prefix: '', // Fetch all uploaded images
            max_results: 50,
            next_cursor: cursor,
            direction: 'desc', // Newest first
            context: true, // Fetch context (metadata)
            // @ts-ignore
            agent: agent
        })

        return NextResponse.json(result)
    } catch (error: any) {
        console.error("Media Fetch Error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to fetch media" },
            { status: 500 }
        )
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { public_id, alt } = await request.json()

        if (!public_id) {
            return NextResponse.json({ error: "Missing public_id" }, { status: 400 })
        }

        // Update Cloudinary context (where we store alt text)
        // We use the key 'alt' in the context object
        const result = await cloudinary.api.update(public_id, {
            context: {
                alt: alt
            },
            // @ts-ignore
            agent: agent
        })

        return NextResponse.json({ success: true, result })
    } catch (error: any) {
        console.error("Media Update Error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to update media" },
            { status: 500 }
        )
    }
}
// ... existing imports and code ...

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const public_id = searchParams.get('public_id')

        if (!public_id) {
            return NextResponse.json({ error: "Missing public_id" }, { status: 400 })
        }

        const result = await cloudinary.api.delete_resources([public_id], {
            // @ts-ignore
            agent: agent
        })

        return NextResponse.json({ success: true, result })
    } catch (error: any) {
        console.error("Media Delete Error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to delete media" },
            { status: 500 }
        )
    }
}
