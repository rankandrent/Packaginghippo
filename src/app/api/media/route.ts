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
            context: true, // Fetch context (metadata including alt, caption/name)
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
        const { public_id, alt, caption, new_slug } = await request.json()

        if (!public_id) {
            return NextResponse.json({ error: "Missing public_id" }, { status: 400 })
        }

        // 1. Update context metadata (alt text + display name/caption)
        const contextData: Record<string, string> = {}
        if (alt !== undefined) contextData.alt = alt
        if (caption !== undefined) contextData.caption = caption

        if (Object.keys(contextData).length > 0) {
            await cloudinary.api.update(public_id, {
                context: contextData,
                agent: agent
            })
        }

        // 2. Rename the image if a new slug is provided (changes the URL)
        let newPublicId = public_id
        let newSecureUrl = ''
        if (new_slug && new_slug.trim()) {
            // Build the new public_id: keep the folder, change the filename
            const parts = public_id.split('/')
            const folder = parts.slice(0, -1).join('/')
            const slugified = new_slug
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '')

            newPublicId = folder ? `${folder}/${slugified}` : slugified

            if (newPublicId !== public_id) {
                const renameResult = await cloudinary.uploader.rename(public_id, newPublicId, {
                    overwrite: true,
                }) as any
                newSecureUrl = renameResult.secure_url

                // Re-apply context to renamed image (context is preserved but let's be safe)
                if (Object.keys(contextData).length > 0) {
                    await cloudinary.api.update(newPublicId, {
                        context: contextData,
                        agent: agent
                    })
                }
            }
        }

        return NextResponse.json({
            success: true,
            new_public_id: newPublicId,
            new_secure_url: newSecureUrl || undefined
        })
    } catch (error: any) {
        console.error("Media Update Error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to update media" },
            { status: 500 }
        )
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const public_id = searchParams.get('public_id')

        if (!public_id) {
            return NextResponse.json({ error: "Missing public_id" }, { status: 400 })
        }

        const result = await cloudinary.api.delete_resources([public_id], {
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
