import nodemailer from "nodemailer"
import type { Inquiry, Order } from "@prisma/client"
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

/**
 * Notification recipients. NOTIFICATION_EMAIL may contain multiple addresses
 * separated by comma or semicolon (e.g. "sales@x.com, owner@gmail.com").
 * Falls back to the site settings email, then the SMTP sender.
 */
function getRecipients(general: GeneralSettings, smtpFrom: string): string[] {
    const raw = process.env.NOTIFICATION_EMAIL || general.email || smtpFrom || ""
    const list = raw
        .split(/[,;]+/)
        .map((e) => e.trim())
        .filter((e) => e.includes("@"))
    return Array.from(new Set(list))
}

// ---- Brand palette (matches the website) ----
const BRAND = {
    navy: "#011f7b",
    navyDark: "#01154f",
    gold: "#DAA520",
    ink: "#212529",
    muted: "#5c636a",
    canvas: "#f4f5f7",
    card: "#ffffff",
    border: "#e6e8eb",
}

function escapeHtml(value: unknown): string {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
}

type EmailRow = [string, unknown]

/**
 * Renders a polished, email-client-safe (table + inline styles) branded email.
 */
function renderBrandedEmail(opts: {
    siteName: string
    badge: string
    title: string
    intro: string
    rows: EmailRow[]
    message?: string | null
    ctaLabel?: string
    ctaUrl?: string
}): string {
    const { siteName, badge, title, intro, rows, message, ctaLabel, ctaUrl } = opts

    const rowsHtml = rows
        .filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== "")
        .map(
            ([label, value]) => `
            <tr>
                <td style="padding:13px 18px;border-bottom:1px solid ${BRAND.border};font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:${BRAND.navy};width:180px;vertical-align:top;background:${BRAND.canvas};">${escapeHtml(label)}</td>
                <td style="padding:13px 18px;border-bottom:1px solid ${BRAND.border};font-size:14px;color:${BRAND.ink};vertical-align:top;">${escapeHtml(value)}</td>
            </tr>`
        )
        .join("")

    const messageHtml = message
        ? `
        <div style="margin:22px 0 4px;">
            <div style="font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:${BRAND.navy};margin-bottom:8px;">Message</div>
            <div style="padding:16px 18px;border-left:4px solid ${BRAND.gold};background:${BRAND.canvas};border-radius:6px;color:${BRAND.ink};font-size:14px;line-height:1.7;white-space:pre-wrap;">${escapeHtml(message)}</div>
        </div>`
        : ""

    const ctaHtml = ctaLabel && ctaUrl
        ? `
        <div style="text-align:center;margin:28px 0 6px;">
            <a href="${escapeHtml(ctaUrl)}" style="display:inline-block;background:${BRAND.gold};color:${BRAND.navy};font-weight:700;font-size:14px;text-decoration:none;padding:13px 28px;border-radius:999px;">${escapeHtml(ctaLabel)}</a>
        </div>`
        : ""

    return `<!doctype html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${BRAND.canvas};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.canvas};padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:${BRAND.card};border-radius:14px;overflow:hidden;border:1px solid ${BRAND.border};">

        <!-- Header -->
        <tr>
          <td style="background:${BRAND.navy};padding:26px 28px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:800;letter-spacing:.02em;">
                  <span style="color:#ffffff;">PACKAGING</span><span style="color:${BRAND.gold};">HIPPO</span>
                </td>
                <td align="right">
                  <span style="display:inline-block;background:${BRAND.gold};color:${BRAND.navy};font-family:Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:6px 12px;border-radius:999px;">${escapeHtml(badge)}</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Title -->
        <tr>
          <td style="padding:28px 28px 4px;font-family:Arial,Helvetica,sans-serif;">
            <h1 style="margin:0 0 6px;font-size:22px;line-height:1.25;color:${BRAND.navy};">${escapeHtml(title)}</h1>
            <p style="margin:0;font-size:14px;color:${BRAND.muted};">${escapeHtml(intro)}</p>
          </td>
        </tr>

        <!-- Details -->
        <tr>
          <td style="padding:18px 28px 4px;font-family:Arial,Helvetica,sans-serif;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BRAND.border};border-radius:8px;overflow:hidden;">
              <tbody>${rowsHtml}</tbody>
            </table>
            ${messageHtml}
            ${ctaHtml}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:22px 28px 26px;font-family:Arial,Helvetica,sans-serif;">
            <div style="border-top:1px solid ${BRAND.border};padding-top:16px;font-size:12px;color:${BRAND.muted};">
              This notification was sent automatically from <strong style="color:${BRAND.navy};">${escapeHtml(siteName)}</strong>. Reply to this email to respond directly to the customer.
            </div>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function buildInquiryEmailText(siteName: string, inquiry: Inquiry) {
    return [
        `New website inquiry on ${siteName}`,
        "",
        `Name: ${inquiry.name}`,
        `Email: ${inquiry.email}`,
        inquiry.phone ? `Phone: ${inquiry.phone}` : "",
        inquiry.company ? `Company: ${inquiry.company}` : "",
        inquiry.type ? `Form Type: ${inquiry.type}` : "",
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
    const recipients = getRecipients(general, smtp.from)
    if (recipients.length === 0) {
        console.warn("Notification recipient is missing. Inquiry email notification skipped.")
        return { sent: false, reason: "missing_recipient" as const }
    }

    const html = renderBrandedEmail({
        siteName,
        badge: "New Inquiry",
        title: `New inquiry from ${inquiry.name}`,
        intro: `A new ${inquiry.type || "contact"} form was submitted on ${siteName}.`,
        rows: [
            ["Name", inquiry.name],
            ["Email", inquiry.email],
            ["Phone", inquiry.phone],
            ["Company", inquiry.company],
            ["Form Type", inquiry.type],
            ["Box Type", inquiry.boxType],
            ["Quantity", inquiry.quantity],
            ["Dimensions", inquiry.dimensions],
            ["Material", inquiry.material],
            ["Color", inquiry.color],
            ["Turnaround", inquiry.turnaround],
            ["Source Page", inquiry.sourcePage],
            ["Source URL", inquiry.sourceUrl],
            ["Submitted At", inquiry.createdAt.toLocaleString()],
        ],
        message: inquiry.message,
    })

    const transporter = nodemailer.createTransport({
        host: smtp.host,
        port: smtp.port,
        secure: smtp.secure,
        auth: { user: smtp.user, pass: smtp.pass },
    })

    await transporter.sendMail({
        from: `"${siteName}" <${smtp.from}>`,
        to: recipients,
        replyTo: inquiry.email || undefined,
        subject: `[${siteName}] New inquiry from ${inquiry.name}`,
        text: buildInquiryEmailText(siteName, inquiry),
        html,
    })

    return { sent: true as const, recipients }
}

export async function sendOrderNotificationEmail(order: Order) {
    const smtp = getSmtpConfig()
    if (!smtp) {
        console.warn("SMTP config is missing. Order email notification skipped.")
        return { sent: false, reason: "missing_smtp_config" as const }
    }

    const general = await getGeneralSettings()
    const siteName = general.siteName || "Packaging Hippo"
    const recipients = getRecipients(general, smtp.from)
    if (recipients.length === 0) {
        console.warn("Notification recipient is missing. Order email notification skipped.")
        return { sent: false, reason: "missing_recipient" as const }
    }

    const address = [order.addressLine1, order.addressLine2, order.city, order.state, order.zipCode, order.country]
        .filter(Boolean)
        .join(", ")

    const itemCount = Array.isArray((order as any).items) ? (order as any).items.length : undefined

    const html = renderBrandedEmail({
        siteName,
        badge: "New Order",
        title: `New order ${order.orderNumber}`,
        intro: `A new order was placed on ${siteName}.`,
        rows: [
            ["Order #", order.orderNumber],
            ["Name", order.customerName],
            ["Email", order.customerEmail],
            ["Phone", order.customerPhone],
            ["Address", address],
            ["Items", itemCount !== undefined ? `${itemCount} item(s)` : undefined],
            ["Subtotal", `$${Number(order.subtotal).toFixed(2)}`],
            ["Shipping", `$${Number(order.shippingCost).toFixed(2)}`],
            ["Tax", `$${Number(order.taxAmount).toFixed(2)}`],
            ["Total", `$${Number(order.totalAmount).toFixed(2)}`],
            ["Payment", order.paymentStatus],
            ["Status", order.status],
            ["Placed At", order.createdAt.toLocaleString()],
        ],
    })

    const transporter = nodemailer.createTransport({
        host: smtp.host,
        port: smtp.port,
        secure: smtp.secure,
        auth: { user: smtp.user, pass: smtp.pass },
    })

    await transporter.sendMail({
        from: `"${siteName}" <${smtp.from}>`,
        to: recipients,
        replyTo: order.customerEmail || undefined,
        subject: `[${siteName}] New order ${order.orderNumber} from ${order.customerName}`,
        html,
    })

    return { sent: true as const, recipients }
}
