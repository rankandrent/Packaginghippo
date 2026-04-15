import nodemailer from "nodemailer"
import type { Inquiry } from "@prisma/client"
import prisma from "@/lib/db"

type GeneralSettings = {
    siteName?: string
    email?: string
}

function getSmtpConfig() {
    const host = process.env.SMTP_HOST
    const port = Number(process.env.SMTP_PORT || 587)
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS
    const from = process.env.SMTP_FROM || user
    const secure = process.env.SMTP_SECURE === "true" || port === 465

    if (!host || !user || !pass || !from) {
        return null
    }

    return { host, port, user, pass, from, secure }
}

async function getGeneralSettings(): Promise<GeneralSettings> {
    try {
        const setting = await prisma.siteSettings.findUnique({
            where: { key: "general" },
        })

        return (setting?.value as GeneralSettings) || {}
    } catch (error) {
        console.error("Failed to load general settings for email notifications:", error)
        return {}
    }
}

function buildInquiryEmailHtml(siteName: string, inquiry: Inquiry) {
    const detailRows = [
        ["Name", inquiry.name],
        ["Email", inquiry.email],
        ["Phone", inquiry.phone],
        ["Company", inquiry.company],
        ["Box Type", inquiry.boxType],
        ["Quantity", inquiry.quantity],
        ["Dimensions", inquiry.dimensions],
        ["Material", inquiry.material],
        ["Color", inquiry.color],
        ["Turnaround", inquiry.turnaround],
        ["Source Page", inquiry.sourcePage],
        ["Source URL", inquiry.sourceUrl],
        ["Submitted At", inquiry.createdAt.toLocaleString()],
    ].filter(([, value]) => Boolean(value))

    const rows = detailRows
        .map(
            ([label, value]) => `
                <tr>
                    <td style="padding:10px 12px;border:1px solid #e5e7eb;font-weight:700;background:#f9fafb;width:180px;">${label}</td>
                    <td style="padding:10px 12px;border:1px solid #e5e7eb;">${String(value)}</td>
                </tr>
            `
        )
        .join("")

    const messageBlock = inquiry.message
        ? `
            <div style="margin-top:24px;">
                <div style="font-size:14px;font-weight:700;color:#111827;margin-bottom:8px;">Message</div>
                <div style="padding:16px;border:1px solid #e5e7eb;border-radius:8px;background:#f9fafb;color:#374151;white-space:pre-wrap;">${inquiry.message}</div>
            </div>
        `
        : ""

    return `
        <div style="font-family:Arial,sans-serif;max-width:760px;margin:0 auto;padding:24px;color:#111827;">
            <h1 style="margin:0 0 8px;font-size:24px;">New Website Inquiry</h1>
            <p style="margin:0 0 24px;color:#4b5563;">A new inquiry was submitted on ${siteName}.</p>

            <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;">
                <tbody>${rows}</tbody>
            </table>

            ${messageBlock}
        </div>
    `
}

function buildInquiryEmailText(siteName: string, inquiry: Inquiry) {
    return [
        `New website inquiry on ${siteName}`,
        "",
        `Name: ${inquiry.name}`,
        `Email: ${inquiry.email}`,
        inquiry.phone ? `Phone: ${inquiry.phone}` : "",
        inquiry.company ? `Company: ${inquiry.company}` : "",
        inquiry.boxType ? `Box Type: ${inquiry.boxType}` : "",
        inquiry.quantity ? `Quantity: ${inquiry.quantity}` : "",
        inquiry.dimensions ? `Dimensions: ${inquiry.dimensions}` : "",
        inquiry.material ? `Material: ${inquiry.material}` : "",
        inquiry.color ? `Color: ${inquiry.color}` : "",
        inquiry.turnaround ? `Turnaround: ${inquiry.turnaround}` : "",
        inquiry.sourcePage ? `Source Page: ${inquiry.sourcePage}` : "",
        inquiry.sourceUrl ? `Source URL: ${inquiry.sourceUrl}` : "",
        `Submitted At: ${inquiry.createdAt.toLocaleString()}`,
        "",
        inquiry.message ? `Message:\n${inquiry.message}` : "",
    ]
        .filter(Boolean)
        .join("\n")
}

export async function sendInquiryNotificationEmail(inquiry: Inquiry) {
    const smtp = getSmtpConfig()

    if (!smtp) {
        console.warn("SMTP config is missing. Inquiry email notification skipped.")
        return { sent: false, reason: "missing_smtp_config" as const }
    }

    const general = await getGeneralSettings()
    const siteName = general.siteName || "Packaging Hippo"
    const recipient = process.env.NOTIFICATION_EMAIL || general.email || smtp.from

    if (!recipient) {
        console.warn("Notification recipient is missing. Inquiry email notification skipped.")
        return { sent: false, reason: "missing_recipient" as const }
    }

    const transporter = nodemailer.createTransport({
        host: smtp.host,
        port: smtp.port,
        secure: smtp.secure,
        auth: {
            user: smtp.user,
            pass: smtp.pass,
        },
    })

    await transporter.sendMail({
        from: smtp.from,
        to: recipient,
        replyTo: inquiry.email || undefined,
        subject: `[${siteName}] New inquiry from ${inquiry.name}`,
        text: buildInquiryEmailText(siteName, inquiry),
        html: buildInquiryEmailHtml(siteName, inquiry),
    })

    return { sent: true as const }
}
