"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { setSession, destroySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";

// -------------------------------------------------------------
// Authentication
// -------------------------------------------------------------

export async function adminLogin(prevState: any, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Please enter both username and password." };
  }

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return { error: "Invalid credentials." };
  }

  const isValid = bcrypt.compareSync(password, user.passwordHash);
  if (!isValid) {
    return { error: "Invalid credentials." };
  }

  await setSession({ id: user.id, username: user.username, role: user.role });
  return { success: true };
}

export async function adminLogout() {
  await destroySession();
  redirect("/admin/login");
}

// -------------------------------------------------------------
// File Upload Action
// -------------------------------------------------------------

export async function uploadFile(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file || file.size === 0) return null;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Clean file name
    const ext = path.extname(file.name);
    const base = path.basename(file.name, ext).replace(/[^a-zA-Z0-9-]/g, "_");
    const filename = `${Date.now()}-${base}${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    fs.writeFileSync(path.join(uploadDir, filename), buffer);
    return `/uploads/${filename}`;
  } catch (error) {
    console.error("File upload error:", error);
    return null;
  }
}

// -------------------------------------------------------------
// Company Settings
// -------------------------------------------------------------

export async function updateCompanySettings(data: {
  companyName: string;
  primaryColor: string;
  secondaryColor: string;
  email: string;
  phoneNumbers: string;
  whatsAppNumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  gstNumber: string;
  businessHours: string;
  googleMapsEmbed: string;
  socialLinks?: { facebook?: string; twitter?: string; linkedin?: string; instagram?: string };
  seoTitleDefault: string;
  seoDescriptionDefault: string;
}) {
  await prisma.companySettings.upsert({
    where: { id: "singleton" },
    update: {
      companyName: data.companyName,
      primaryColor: data.primaryColor,
      secondaryColor: data.secondaryColor,
      email: data.email,
      phoneNumbers: data.phoneNumbers,
      whatsAppNumber: data.whatsAppNumber,
      address: data.address,
      city: data.city,
      state: data.state,
      country: data.country,
      postalCode: data.postalCode,
      gstNumber: data.gstNumber,
      businessHours: data.businessHours,
      googleMapsEmbed: data.googleMapsEmbed,
      seoTitleDefault: data.seoTitleDefault,
      seoDescriptionDefault: data.seoDescriptionDefault,
    },
    create: {
      id: "singleton",
      companyName: data.companyName,
      primaryColor: data.primaryColor,
      secondaryColor: data.secondaryColor,
      email: data.email,
      phoneNumbers: data.phoneNumbers,
      whatsAppNumber: data.whatsAppNumber,
      address: data.address,
      city: data.city,
      state: data.state,
      country: data.country,
      postalCode: data.postalCode,
      gstNumber: data.gstNumber,
      businessHours: data.businessHours,
      googleMapsEmbed: data.googleMapsEmbed,
      seoTitleDefault: data.seoTitleDefault,
      seoDescriptionDefault: data.seoDescriptionDefault,
    },
  });

  revalidatePath("/");
  return { success: true };
}

// -------------------------------------------------------------
// Categories
// -------------------------------------------------------------

export async function saveCategory(
  id: string | null,
  data: {
    name: string;
    slug: string;
    description: string;
    imageUrl: string | null;
    displayOrder: number;
    isActive: boolean;
    parentId: string | null;
  }
) {
  const payload = {
    name: data.name,
    slug: data.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
    description: data.description,
    imageUrl: data.imageUrl,
    displayOrder: data.displayOrder,
    isActive: data.isActive,
    parentId: data.parentId || null,
  };

  if (id) {
    await prisma.category.update({
      where: { id },
      data: payload,
    });
  } else {
    await prisma.category.create({
      data: payload,
    });
  }

  revalidatePath("/");
  revalidatePath("/products");
  return { success: true };
}

export async function deleteCategory(id: string) {
  await prisma.category.delete({
    where: { id },
  });
  revalidatePath("/");
  revalidatePath("/products");
  return { success: true };
}

// -------------------------------------------------------------
// Brands
// -------------------------------------------------------------

export async function saveBrand(
  id: string | null,
  data: {
    name: string;
    slug: string;
    logoUrl: string | null;
    description: string;
    websiteUrl: string;
    isActive: boolean;
    isFeatured: boolean;
  }
) {
  const payload = {
    name: data.name,
    slug: data.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
    logoUrl: data.logoUrl,
    description: data.description,
    websiteUrl: data.websiteUrl || null,
    isActive: data.isActive,
    isFeatured: data.isFeatured,
  };

  if (id) {
    await prisma.brand.update({
      where: { id },
      data: payload,
    });
  } else {
    await prisma.brand.create({
      data: payload,
    });
  }

  revalidatePath("/");
  revalidatePath("/products");
  return { success: true };
}

export async function deleteBrand(id: string) {
  await prisma.brand.delete({
    where: { id },
  });
  revalidatePath("/");
  revalidatePath("/products");
  return { success: true };
}

// -------------------------------------------------------------
// Products
// -------------------------------------------------------------

export async function saveProduct(
  id: string | null,
  data: {
    name: string;
    slug: string;
    modelNumber: string;
    sku: string;
    shortDescription: string;
    fullDescription: string;
    keyFeatures: string;
    technicalSpecs: string; // JSON String
    applications: string;
    categoryId: string;
    brandId: string | null;
    isFeatured: boolean;
    showPrice: boolean;
    price: number | null;
    isAvailable: boolean;
    isActive: boolean;
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string;
    displayOrder: number;
    images: string[]; // List of image URLs
    documents: { name: string; fileUrl: string; docType: string }[];
  }
) {
  const productPayload = {
    name: data.name,
    slug: data.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
    modelNumber: data.modelNumber || null,
    sku: data.sku || null,
    shortDescription: data.shortDescription,
    fullDescription: data.fullDescription,
    keyFeatures: data.keyFeatures,
    technicalSpecs: data.technicalSpecs,
    applications: data.applications,
    categoryId: data.categoryId,
    brandId: data.brandId || null,
    isFeatured: data.isFeatured,
    showPrice: data.showPrice,
    price: data.price,
    isAvailable: data.isAvailable,
    isActive: data.isActive,
    seoTitle: data.seoTitle || null,
    seoDescription: data.seoDescription || null,
    seoKeywords: data.seoKeywords || null,
    displayOrder: data.displayOrder,
  };

  let product;
  if (id) {
    product = await prisma.product.update({
      where: { id },
      data: productPayload,
    });

    // Delete existing images and docs
    await prisma.productImage.deleteMany({ where: { productId: id } });
    await prisma.productDocument.deleteMany({ where: { productId: id } });
  } else {
    product = await prisma.product.create({
      data: productPayload,
    });
  }

  // Create new images
  if (data.images && data.images.length > 0) {
    await prisma.productImage.createMany({
      data: data.images.map((url, index) => ({
        productId: product.id,
        imageUrl: url,
        displayOrder: index,
      })),
    });
  }

  // Create new documents
  if (data.documents && data.documents.length > 0) {
    await prisma.productDocument.createMany({
      data: data.documents.map((doc) => ({
        productId: product.id,
        name: doc.name,
        fileUrl: doc.fileUrl,
        docType: doc.docType,
      })),
    });
  }

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath(`/product/${product.slug}`);
  return { success: true };
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({
    where: { id },
  });
  revalidatePath("/");
  revalidatePath("/products");
  return { success: true };
}

// -------------------------------------------------------------
// Slider
// -------------------------------------------------------------

export async function saveSlide(
  id: string | null,
  data: {
    heading: string;
    subheading: string;
    ctaText: string;
    ctaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
    desktopImageUrl: string;
    mobileImageUrl: string;
    overlayOpacity: number;
    textAlignment: string;
    displayOrder: number;
    isActive: boolean;
  }
) {
  const payload = {
    heading: data.heading,
    subheading: data.subheading,
    ctaText: data.ctaText || null,
    ctaLink: data.ctaLink || null,
    secondaryCtaText: data.secondaryCtaText || null,
    secondaryCtaLink: data.secondaryCtaLink || null,
    desktopImageUrl: data.desktopImageUrl,
    mobileImageUrl: data.mobileImageUrl || null,
    overlayOpacity: data.overlayOpacity,
    textAlignment: data.textAlignment,
    displayOrder: data.displayOrder,
    isActive: data.isActive,
  };

  if (id) {
    await prisma.heroSlide.update({
      where: { id },
      data: payload,
    });
  } else {
    await prisma.heroSlide.create({
      data: payload,
    });
  }

  revalidatePath("/");
  return { success: true };
}

export async function deleteSlide(id: string) {
  await prisma.heroSlide.delete({
    where: { id },
  });
  revalidatePath("/");
  return { success: true };
}

// -------------------------------------------------------------
// Inquiries
// -------------------------------------------------------------

export async function updateInquiryStatus(id: string, status: string, internalNotes: string) {
  await prisma.inquiry.update({
    where: { id },
    data: { status, internalNotes },
  });
  return { success: true };
}

export async function deleteInquiry(id: string) {
  await prisma.inquiry.delete({
    where: { id },
  });
  return { success: true };
}

// -------------------------------------------------------------
// Quote Requests
// -------------------------------------------------------------

export async function updateQuoteStatus(id: string, status: string, internalNotes: string) {
  await prisma.quoteRequest.update({
    where: { id },
    data: { status, internalNotes },
  });
  return { success: true };
}

export async function deleteQuoteRequest(id: string) {
  await prisma.quoteRequest.delete({
    where: { id },
  });
  return { success: true };
}

// -------------------------------------------------------------
// Industries, Why Choose Us, and Blogs
// -------------------------------------------------------------

export async function saveWhyChooseUs(
  id: string | null,
  data: { title: string; description: string; iconName: string; displayOrder: number }
) {
  if (id) {
    await prisma.whyChooseUs.update({ where: { id }, data });
  } else {
    await prisma.whyChooseUs.create({ data });
  }
  revalidatePath("/about");
  revalidatePath("/");
  return { success: true };
}

export async function deleteWhyChooseUs(id: string) {
  await prisma.whyChooseUs.delete({ where: { id } });
  revalidatePath("/about");
  revalidatePath("/");
  return { success: true };
}

export async function saveIndustry(
  id: string | null,
  data: { name: string; slug: string; description: string; imageUrl: string | null; displayOrder: number; isActive: boolean }
) {
  const payload = {
    name: data.name,
    slug: data.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
    description: data.description,
    imageUrl: data.imageUrl,
    displayOrder: data.displayOrder,
    isActive: data.isActive,
  };

  if (id) {
    await prisma.industry.update({ where: { id }, data: payload });
  } else {
    await prisma.industry.create({ data: payload });
  }
  revalidatePath("/");
  return { success: true };
}

export async function deleteIndustry(id: string) {
  await prisma.industry.delete({ where: { id } });
  revalidatePath("/");
  return { success: true };
}

export async function saveBlog(
  id: string | null,
  data: {
    title: string;
    slug: string;
    summary: string;
    content: string;
    featuredImageUrl: string | null;
    author: string;
    status: string;
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string;
    publishDate: Date;
  }
) {
  const payload = {
    title: data.title,
    slug: data.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
    summary: data.summary,
    content: data.content,
    featuredImageUrl: data.featuredImageUrl,
    author: data.author,
    status: data.status,
    seoTitle: data.seoTitle || null,
    seoDescription: data.seoDescription || null,
    seoKeywords: data.seoKeywords || null,
    publishDate: data.publishDate,
  };

  if (id) {
    await prisma.blog.update({ where: { id }, data: payload });
  } else {
    await prisma.blog.create({ data: payload });
  }
  revalidatePath("/blog");
  return { success: true };
}

export async function deleteBlog(id: string) {
  await prisma.blog.delete({ where: { id } });
  revalidatePath("/blog");
  return { success: true };
}

// -------------------------------------------------------------
// Upgraded Actions (Themes, Custom Pages, Form Fields, Locations, Platforms)
// -------------------------------------------------------------

export async function updateThemeAndColors(data: {
  activeTheme: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  darkSectionColor: string;
  textColor: string;
  buttonColor: string;
  buttonHoverColor: string;
  linkColor: string;
}) {
  await prisma.companySettings.update({
    where: { id: "singleton" },
    data
  });
  revalidatePath("/");
  return { success: true };
}

export async function updateSliderGlobalSettings(data: {
  sliderAutoplay: boolean;
  sliderAutoplaySpeed: number;
  sliderTransitionStyle: string;
  sliderTransitionSpeed: number;
  sliderShowArrows: boolean;
  sliderShowDots: boolean;
  sliderHeight: string;
}) {
  await prisma.companySettings.update({
    where: { id: "singleton" },
    data
  });
  revalidatePath("/");
  return { success: true };
}

export async function updateTopBarConfig(data: {
  enableTopContactBar: boolean;
  topBarTitle: string;
  topBarConfig: string;
}) {
  await prisma.companySettings.update({
    where: { id: "singleton" },
    data
  });
  revalidatePath("/");
  return { success: true };
}

export async function updateHeaderNavigationConfig(data: {
  navigationConfig: string;
  headerCtaText: string;
  headerCtaLink: string;
  enableHeaderSearch: boolean;
  enableStickyHeader: boolean;
  logoUrl?: string | null;
  mobileLogoUrl?: string | null;
}) {
  await prisma.companySettings.update({
    where: { id: "singleton" },
    data
  });
  revalidatePath("/");
  return { success: true };
}

export async function updateHomepageSectionsConfig(sectionsConfig: string) {
  await prisma.companySettings.update({
    where: { id: "singleton" },
    data: { homepageSectionsConfig: sectionsConfig }
  });
  revalidatePath("/");
  return { success: true };
}

export async function updateWhoWeAreIntro(data: {
  introEnabled: boolean;
  introHeading: string;
  introHighlightHeading: string;
  introSubtitle: string;
  introDescription: string;
  introImages: string;
  introCtaText: string;
  introCtaLink: string;
  introCtaStyle: string;
  introBgColor: string;
  introTextColor: string;
  introLayoutStyle: string;
}) {
  await prisma.companySettings.update({
    where: { id: "singleton" },
    data
  });
  revalidatePath("/");
  return { success: true };
}

export async function updateWhyWorkUsSection(data: {
  whyWorkEnabled: boolean;
  whyWorkHeading: string;
  whyWorkHighlight: string;
  whyWorkSubtitle: string;
  whyWorkDescription: string;
  whyWorkBgColor: string;
  whyWorkTextColor: string;
  whyWorkImage: string | null;
  whyWorkLayout: string;
}) {
  await prisma.companySettings.update({
    where: { id: "singleton" },
    data
  });
  revalidatePath("/");
  return { success: true };
}

export async function updateIndustriesSectionSettings(data: {
  homeIndustriesEnabled: boolean;
  homeIndustriesHeading: string;
  homeIndustriesSubtitle: string;
  homeIndustriesDescription: string;
  homeIndustriesBgColor: string;
  homeIndustriesTextColor: string;
  homeIndustriesLayout: string;
}) {
  await prisma.companySettings.update({
    where: { id: "singleton" },
    data
  });
  revalidatePath("/");
  return { success: true };
}

export async function updateCtaSectionSettings(data: {
  homeCtaEnabled: boolean;
  homeCtaHeading: string;
  homeCtaHighlight: string;
  homeCtaDescription: string;
  homeCtaBgColor: string;
  homeCtaBgImage: string | null;
  homeCtaBgOverlay: number;
  homeCtaTextColor: string;
  homeCtaButtons: string;
}) {
  await prisma.companySettings.update({
    where: { id: "singleton" },
    data
  });
  revalidatePath("/");
  return { success: true };
}

export async function updateFooterConfig(data: {
  footerConfig: string;
  copyrightText: string;
  copyrightLink: string;
  devCreditText: string;
  devCreditLink: string;
  devCreditEnabled: boolean;
  devCreditOpenInNewTab: boolean;
}) {
  await prisma.companySettings.update({
    where: { id: "singleton" },
    data
  });
  revalidatePath("/");
  return { success: true };
}

export async function updateAboutPageCMS(data: {
  aboutHeroTitle: string;
  aboutHeroSubtitle: string;
  aboutHeroBgImage: string | null;
  aboutHeroCtaText: string;
  aboutHeroCtaLink: string;
  aboutStoryHeading: string;
  aboutStoryContent: string;
  aboutStoryImages: string;
  aboutStoryHighlights: string;
  aboutMissionHeading: string;
  aboutMissionContent: string;
  aboutMissionImage: string | null;
  aboutVisionHeading: string;
  aboutVisionContent: string;
  aboutVisionImage: string | null;
  aboutValuesConfig: string;
  aboutStatsConfig: string;
  aboutTeamConfig: string;
  aboutCertificationsConfig: string;
  aboutCtaConfig: string;
}) {
  await prisma.companySettings.update({
    where: { id: "singleton" },
    data
  });
  revalidatePath("/about");
  return { success: true };
}

export async function saveLocation(
  id: string | null,
  data: {
    name: string;
    address: string;
    phone: string | null;
    email: string | null;
    mapEmbed: string | null;
    displayOrder: number;
    isActive: boolean;
  }
) {
  if (id) {
    await prisma.location.update({ where: { id }, data });
  } else {
    await prisma.location.create({ data });
  }
  revalidatePath("/contact");
  return { success: true };
}

export async function deleteLocation(id: string) {
  await prisma.location.delete({ where: { id } });
  revalidatePath("/contact");
  return { success: true };
}

export async function saveSocialPlatform(
  id: string | null,
  data: {
    platformName: string;
    iconName: string;
    profileUrl: string;
    displayOrder: number;
    isActive: boolean;
  }
) {
  if (id) {
    await prisma.socialPlatform.update({ where: { id }, data });
  } else {
    await prisma.socialPlatform.create({ data });
  }
  revalidatePath("/");
  return { success: true };
}

export async function deleteSocialPlatform(id: string) {
  await prisma.socialPlatform.delete({ where: { id } });
  revalidatePath("/");
  return { success: true };
}

export async function saveFormField(
  id: string | null,
  data: {
    formType: string;
    label: string;
    name: string;
    type: string;
    placeholder: string | null;
    isRequired: boolean;
    options: string | null;
    validation: string | null;
    helpText: string | null;
    displayOrder: number;
    isActive: boolean;
  }
) {
  if (id) {
    await prisma.formField.update({ where: { id }, data });
  } else {
    await prisma.formField.create({ data });
  }
  return { success: true };
}

export async function deleteFormField(id: string) {
  await prisma.formField.delete({ where: { id } });
  return { success: true };
}

export async function saveCustomPage(
  id: string | null,
  data: {
    title: string;
    slug: string;
    content: string;
    seoTitle: string | null;
    seoDescription: string | null;
    isActive: boolean;
  }
) {
  const payload = {
    title: data.title,
    slug: data.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
    content: data.content,
    seoTitle: data.seoTitle,
    seoDescription: data.seoDescription,
    isActive: data.isActive,
  };

  if (id) {
    await prisma.customPage.update({ where: { id }, data: payload });
  } else {
    await prisma.customPage.create({ data: payload });
  }
  revalidatePath("/");
  return { success: true };
}

export async function deleteCustomPage(id: string) {
  await prisma.customPage.delete({ where: { id } });
  revalidatePath("/");
  return { success: true };
}

export async function saveDownload(
  id: string | null,
  data: {
    title: string;
    fileUrl: string;
    category: string | null;
    description: string | null;
    coverImageUrl: string | null;
    brandName: string | null;
    downloadAccess: string;
    displayOrder: number;
    isActive: boolean;
    isFeatured: boolean;
  }
) {
  if (id) {
    await prisma.download.update({ where: { id }, data });
  } else {
    await prisma.download.create({ data });
  }
  revalidatePath("/downloads");
  return { success: true };
}

export async function deleteDownload(id: string) {
  await prisma.download.delete({ where: { id } });
  revalidatePath("/downloads");
  return { success: true };
}

export async function toggleProductFeatured(id: string, isFeatured: boolean) {
  await prisma.product.update({
    where: { id },
    data: { isFeatured }
  });
  revalidatePath("/");
  return { success: true };
}

export async function updateFeaturedSectionSettings(data: {
  homeFeaturedProductsEnabled: boolean;
  homeFeaturedProductsHeading: string;
  homeFeaturedProductsSubtitle: string;
  homeFeaturedProductsLimit: number;
  homeFeaturedProductsCtaText: string;
  homeFeaturedProductsCtaLink: string;
}) {
  await prisma.companySettings.update({
    where: { id: "singleton" },
    data
  });
  revalidatePath("/");
  return { success: true };
}

// -------------------------------------------------------------
// First-time Setup & Forgot/Reset Password Actions
// -------------------------------------------------------------
import crypto from "crypto";
import { sendMail } from "@/lib/mailer";

export async function checkIsFirstTimeSetup() {
  try {
    const userCount = await prisma.user.count();
    return { isFirstTime: userCount === 0 };
  } catch (error) {
    console.error("Error checking user count:", error);
    return { isFirstTime: false };
  }
}

export async function registerAdmin(data: {
  username: string;
  email: string;
  passwordPass: string;
  bypass?: boolean;
}) {
  try {
    const userCount = await prisma.user.count();
    if (userCount > 0 && !data.bypass) {
      return { error: "First-time setup registration is already disabled." };
    }

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username: data.username },
    });
    if (existingUser) {
      return { error: "Username is already taken. Please choose another username." };
    }

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingEmail) {
      return { error: "Email address is already registered. Please use a different email." };
    }

    const passwordHash = await bcrypt.hash(data.passwordPass, 10);
    await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        passwordHash,
        role: "SUPER_ADMIN", // First user gets super admin capabilities
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error creating user:", error);
    return { error: error.message || "Failed to create administrator account." };
  }
}

export async function requestPasswordReset(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: "This email address is not registered in our system." };
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 3600000); // 1 hour validity

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetTokenExpiry: expiry,
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetLink = `${appUrl}/admin/reset-password?token=${token}`;

    const mailHtml = `
      <div style="font-family: sans-serif; padding: 20px; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-top: 0;">Password Reset Request</h2>
        <p style="color: #475569; font-size: 14px; line-height: 1.5;">You are receiving this email because a password reset request was initiated for your Shree TBTC Global Admin account.</p>
        <div style="margin: 25px 0; text-align: center;">
          <a href="${resetLink}" style="background-color: #0f172a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 14px; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #64748b; font-size: 12px; line-height: 1.5;">This link will expire in 1 hour. If you did not request this, please ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="color: #94a3b8; font-size: 10px; margin-bottom: 0;">If the button doesn't work, copy-paste this link in your browser: ${resetLink}</p>
      </div>
    `;

    const result = await sendMail({
      to: email,
      subject: "Password Reset - Shree TBTC Global Admin Portal",
      text: `Reset your password by visiting this link: ${resetLink}`,
      html: mailHtml,
    });

    return { success: true, devLink: result.fallback ? resetLink : null };
  } catch (error: any) {
    console.error("Error in requestPasswordReset:", error);
    return { error: error.message || "Something went wrong." };
  }
}

export async function resetPassword(token: string, newPass: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return { error: "Reset token is invalid or has expired." };
    }

    const passwordHash = await bcrypt.hash(newPass, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error in resetPassword:", error);
    return { error: error.message || "Failed to reset password." };
  }
}


