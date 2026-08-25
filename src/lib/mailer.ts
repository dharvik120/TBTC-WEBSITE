import nodemailer from "nodemailer";

interface SendMailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export async function sendMail({ to, subject, text, html }: SendMailOptions) {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || `"Shree TBTC Portal" <no-reply@stbtcgi.in>`;

  // Fallback: If SMTP is not configured, print to console so they can test immediately!
  if (!host || !user || !pass) {
    console.log("---------------- SMTP MAIL PREVIEW ----------------");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Text: ${text}`);
    console.log("---------------------------------------------------");
    return { success: true, fallback: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });

    await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send email via SMTP:", error);
    return { success: false, error };
  }
}
