import { APP_NAME, CONTACT_EMAIL } from '@/utils/constants/brand'
import { Resend } from 'resend'

const resendClient = new Resend(process.env.RESEND_KEY)

export const sendEmail = (to: string, subject: string, html: string) =>
  resendClient.emails.send({
    from: 'noreply@sendfy.dev',
    to,
    subject,
    html,
  })

export const sendEmailAsParagraphs = (to: string, subject: string, messages: string[]) =>
  resendClient.emails.send({
    from: 'noreply@sendfy.dev',
    to,
    subject,
    html: `<table style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="background-color: #f4f4f4; padding: 20px; text-align: center;">
                <h1 style="margin: 0; color: #2c3e50; font-size: 24px;">${APP_NAME}</h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px;">
                ${messages.map((m) => `<p style="margin-bottom: 16px;">${m}</p>`)}   
            </td>
        </tr>
        <tr>
            <td style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 12px; color: #666;">
                © 2025 ${APP_NAME} | Contact: ${CONTACT_EMAIL}
            </td>
        </tr>
    </table>`,
  })
