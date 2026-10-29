import nodemailer from "nodemailer";
import config from "../config/config.js";
import {emailConfigSchema} from "../types/types.js";
import type { EmailConfig } from "../types/types.js";

const transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: Number(config.SMTP_PORT ?? 465),
    secure: config.SMTP_SECURE === "true",
    auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASSWORD,
    },
});

function generateHtml(subject: string, body: string): string{
    return `<!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>title</title>
        </head>
        <body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#202124;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
            style="background-color:#f4f6f8;padding:32px 12px;">
            <tr>
            <td align="center">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0"
                style="width:100%;max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;">
                <tr>
                    <td style="background:#202938;padding:24px 32px;">
                    <p style="margin:0;color:#ffffff;font-size:20px;font-weight:bold;">
                        NoCron
                    </p>
                    <p style="margin:8px 0 0;color:#cbd5e1;font-size:13px;">
                        Notification
                    </p>
                    </td>
                </tr>
                <tr>
                    <td style="padding:32px;">
                    <h1 style="margin:0 0 20px;font-size:22px;line-height:1.4;color:#111827;">
                        ${subject}
                    </h1>
                    <div style="font-size:15px;line-height:1.8;color:#374151;overflow-wrap:anywhere;">
                        ${body}
                    </div>
                    </td>
                </tr>
                <tr>
                    <td style="padding:20px 32px;border-top:1px solid #e5e7eb;">
                    <p style="margin:0;font-size:12px;line-height:1.6;color:#6b7280;">
                        This email was sent automatically by a NoCron workflow.
                    </p>
                    </td>
                </tr>
                </table>
            </td>
            </tr>
        </table>
        </body>
    </html>
`
}

export default async function sendEmail(emailConfig: EmailConfig) {
    const result = await transporter.sendMail({
        from: config.SMTP_USER,
        to: emailConfig.to,
        subject: emailConfig.subject,
        html: generateHtml(emailConfig.subject, emailConfig.body)
    });

    console.log("Message was sent", result.messageId);
}
