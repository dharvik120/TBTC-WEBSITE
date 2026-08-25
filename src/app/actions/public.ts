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
        dynamicValues: data.dynamicValues ? (typeof data.dynamicValues === "string" ? data.dynamicValues : JSON.stringify(data.dynamicValues)) : null,
        status: "NEW",
      },
    });

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

    return { success: true, quoteRequestId: quoteRequest.id };
  } catch (error) {
    console.error("Error submitting quote request:", error);
    return { error: "Something went wrong. Please try again later." };
  }
}
