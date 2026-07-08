import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// TEMPORARY diagnostic endpoint to debug live email delivery.
// Token-gated so it can't be abused. Remove after debugging.
const DIAG_TOKEN = 'DIAG-57d5e7ba5ef58f92'

export async function GET(req: NextRequest) {
    if (req.nextUrl.searchParams.get('token') !== DIAG_TOKEN) {
        return NextResponse.json({ error: 'not found' }, { status: 404 })
    }

    const host = process.env.SMTP_HOST
    const port = Number(process.env.SMTP_PORT || 587)
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS
    const from = process.env.SMTP_FROM
    const to = process.env.NOTIFICATION_EMAIL

    const present = {
        SMTP_HOST: host || null,
        SMTP_PORT: port,
        SMTP_USER: user || null,
        SMTP_PASS: pass ? `set(${pass.length} chars)` : null,
        SMTP_FROM: from || null,
        NOTIFICATION_EMAIL: to || null,
    }

    if (!host || !user || !pass || !from || !to) {
        return NextResponse.json({ ok: false, reason: 'ENV_MISSING_AT_RUNTIME', present })
    }

    try {
        const transporter = nodemailer.createTransport({
            host,
            port,
            secure: port === 465,
            auth: { user, pass },
        })
        await transporter.verify()
        const info = await transporter.sendMail({
            from: `"Packaging Hippo LIVE diag" <${from}>`,
            to,
            subject: 'Packaging Hippo — LIVE diagnostic email',
            text: 'Agar ye email mil gayi to live server se email ja rahi hai.',
        })
        return NextResponse.json({ ok: true, present, accepted: info.accepted, rejected: info.rejected })
    } catch (e: any) {
        return NextResponse.json({ ok: false, reason: 'SEND_FAILED', error: e?.message, code: e?.code, present })
    }
}
