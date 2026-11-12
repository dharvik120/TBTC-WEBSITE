"use server";

import prisma from "@/lib/prisma";

export async function submitInquiry(data: {
  name: string;
  companyName?: string;
  email: string;
  phone: string;
  inquiryType: string;
  relatedProductId?: string;
  message: string;
  dynamicValues?: any;
}) {
  try {
    if (!data.name || !data.email || !data.phone || !data.message) {
      return { error: "Please fill out all required fields." };
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name: data.name,
        companyName: data.companyName || null,
        email: data.email,
        phone: data.phone,
        inquiryType: data.inquiryType || "GENERAL",
        relatedProductId: data.relatedProductId || null,
        message: data.message,
        dynamicValues: data.dynamicValues
          ? typeof data.dynamicValues === "string"
            ? data.dynamicValues
            : JSON.stringify(data.dynamicValues)
          : null,
        status: "NEW",
      },
    });

    // Send email notification asynchronously
    try {
      const { sendMail } = await import("@/lib/mailer");
      const adminEmail = process.env.SALES_NOTIFICATION_EMAIL || "sales@stbtcgi.com";
      await sendMail({
        to: adminEmail,
        subject: `[TBTC Inquiry] ${data.name} - ${data.inquiryType}`,
        text: `New Customer Inquiry:
Name: ${data.name}
Company: ${data.companyName || "N/A"}
Email: ${data.email}
Phone: ${data.phone}
Type: ${data.inquiryType}

Message:
${data.message}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <div style="background: #0b3c5d; color: white; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
              <h2 style="margin: 0; font-size: 18px;">Shree TBTC - New Global Inquiry</h2>
              <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.9;">Inquiry ID: ${inquiry.id}</p>
            </div>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
              <tr><td style="padding: 8px; font-weight: bold; width: 120px; color: #475569;">Name:</td><td style="padding: 8px;">${data.name}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold; color: #475569;">Company:</td><td style="padding: 8px;">${data.companyName || "N/A"}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold; color: #475569;">Email:</td><td style="padding: 8px;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
              <tr><td style="padding: 8px; font-weight: bold; color: #475569;">Phone:</td><td style="padding: 8px;"><a href="tel:${data.phone}">${data.phone}</a></td></tr>
              <tr><td style="padding: 8px; font-weight: bold; color: #475569;">Type:</td><td style="padding: 8px;">${data.inquiryType}</td></tr>
            </table>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 6px;">
              <h4 style="margin: 0 0 10px 0; color: #334155;">Customer Message:</h4>
              <p style="margin: 0; font-size: 13px; color: #1e293b; white-space: pre-wrap;">${data.message}</p>
            </div>
            <div style="margin-top: 25px; text-align: center; font-size: 11px; color: #94a3b8;">
              Shree TBTC Global Industries • Automated System
            </div>
          </div>
        `,
      });
    } catch (mailErr) {
      console.warn("Mail dispatch skipped or logged to preview:", mailErr);
    }

    return { success: true, inquiryId: inquiry.id };
  } catch (error) {
    console.error("Error submitting inquiry:", error);
    return { error: "Something went wrong. Please try again later." };
  }
}

export async function submitQuoteRequest(
  customerDetails: {
    name: string;
    companyName?: string;
    email: string;
    phone: string;
    city?: string;
    state?: string;
    message?: string;
  },
  items: { productId: string; quantity: number; note?: string }[]
) {
  try {
    if (!customerDetails.name || !customerDetails.email || !customerDetails.phone) {
      return { error: "Please fill out all required fields (Name, Email, Phone)." };
    }

    if (!items || items.length === 0) {
      return { error: "Your quotation list is empty." };
    }

    // Create quote request inside a transaction
    const quoteRequest = await prisma.$transaction(async (tx) => {
      const qr = await tx.quoteRequest.create({
        data: {
          name: customerDetails.name,
          companyName: customerDetails.companyName || null,
          email: customerDetails.email,
          phone: customerDetails.phone,
          city: customerDetails.city || null,
          state: customerDetails.state || null,
          message: customerDetails.message || null,
          status: "NEW",
        },
      });

      await tx.quoteRequestItem.createMany({
        data: items.map((item) => ({
          quoteRequestId: qr.id,
          productId: item.productId,
          quantity: item.quantity,
          note: item.note || null,
        })),
      });

      return qr;
    });

    // Send email notification for Quote Request
    try {
      const { sendMail } = await import("@/lib/mailer");
      const adminEmail = process.env.SALES_NOTIFICATION_EMAIL || "sales@stbtcgi.com";
      await sendMail({
        to: adminEmail,
        subject: `[TBTC Quote Request] ${customerDetails.name} (${items.length} materials)`,
        text: `New Quote Request Received:
Customer: ${customerDetails.name}
Company: ${customerDetails.companyName || "N/A"}
Email: ${customerDetails.email}
Phone: ${customerDetails.phone}
Location: ${customerDetails.city || ""} ${customerDetails.state || ""}
Items count: ${items.length}

Notes:
${customerDetails.message || "No notes"}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <div style="background: #0b3c5d; color: white; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
              <h2 style="margin: 0; font-size: 18px;">Shree TBTC - New Quotation Request</h2>
              <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.9;">Quote ID: ${quoteRequest.id}</p>
            </div>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
              <tr><td style="padding: 8px; font-weight: bold; width: 120px; color: #475569;">Buyer Name:</td><td style="padding: 8px;">${customerDetails.name}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold; color: #475569;">Company:</td><td style="padding: 8px;">${customerDetails.companyName || "N/A"}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold; color: #475569;">Email:</td><td style="padding: 8px;"><a href="mailto:${customerDetails.email}">${customerDetails.email}</a></td></tr>
              <tr><td style="padding: 8px; font-weight: bold; color: #475569;">Phone:</td><td style="padding: 8px;"><a href="tel:${customerDetails.phone}">${customerDetails.phone}</a></td></tr>
              <tr><td style="padding: 8px; font-weight: bold; color: #475569;">Items Count:</td><td style="padding: 8px;">${items.length} materials requested</td></tr>
            </table>
            ${customerDetails.message ? `
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 6px;">
                <h4 style="margin: 0 0 10px 0; color: #334155;">Customer Message / Instructions:</h4>
                <p style="margin: 0; font-size: 13px; color: #1e293b; white-space: pre-wrap;">${customerDetails.message}</p>
              </div>
            ` : ""}
            <div style="margin-top: 25px; text-align: center; font-size: 11px; color: #94a3b8;">
              Shree TBTC Global Industries • Automated System
            </div>
          </div>
        `,
      });
    } catch (mailErr) {
      console.warn("Quote mail dispatch skipped or logged to preview:", mailErr);
    }

    return { success: true, quoteRequestId: quoteRequest.id };
  } catch (error) {
    console.error("Error submitting quote request:", error);
    return { error: "Something went wrong. Please try again later." };
  }
}
