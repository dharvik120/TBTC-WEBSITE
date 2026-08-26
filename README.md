# Shree TBTC Global Industries – Dynamic Industrial E-Commerce & CMS Portal

A modern, high-performance, dynamic B2B industrial procurement portal and Content Management System (CMS) designed for **Shree TBTC Global Industries**. The platform showcases industrial electrical switchgears, structural steel products, lubricants/greases, filtration products, compressors, and high-tension insulators with real-time administration control and client quotation builders.

---

## 🌐 Live Deployments

*   **Production Portal**: [https://tbtc-website.vercel.app](https://tbtc-website.vercel.app)
*   **Admin CMS Dashboard**: [https://tbtc-website.vercel.app/admin](https://tbtc-website.vercel.app/admin)

---

## 🚀 Key Features

### 1. Dynamic Content Management (CMS)
*   **Real-time Synchronization**: Force-dynamic cache-bypassing root layouts ensure that changes to company settings, sliders, contact details, social links, headers, and footers propagate immediately to the public homepage without site rebuilds.
*   **Multi-Sector Slider Control**: Add, delete, or re-order homepage sliders with customizable transition speeds, transitions (fade/slide), and call-to-actions.
*   **Dynamic Theme Engine**: Swap themes, brands, primary/secondary colors, background settings, and buttons directly via the admin settings.

### 2. Products Catalog & Download Center
*   **Categorized Navigation**: Dynamic multi-level products grid layout supporting category slugs, detailed product pages, custom brands, and specification attributes.
*   **PDF Download Center**: Secure document upload engine where admins can upload catalogs, brochures, or specification PDFs, allowing customers to download files directly.

### 3. User & Dynamic Permission Matrix
*   **Super Admin Control**: Create, manage, and toggle system roles (`SUPER_ADMIN`, `ADMIN`, `EDITOR`).
*   **Role Permission Matrix**: Granular security checkboxes allowing the Super Admin to toggle write/edit permissions per role across:
    *   Website Settings (Themes, SEO, navigation headers/footers)
    *   Products and categories catalog
    *   Document/PDF uploads
    *   Inquiries and quotation form builders
    *   Custom pages and about CMS sections
*   **Secure Route Middleware**: Zero-DB-hit cryptographic JWT middleware protecting restricted pages and redirecting unauthorized role accesses back to the dashboard with security warnings.

### 4. Interactive Quotation Builder
*   **Dynamic Quote Cart**: Users can browse items, add them to a dedicated cart, adjust quantities, add custom specifications notes, and submit a quote inquiry form directly to the admin dashboard.

---

## 🛠️ Technology Stack

*   **Frontend**: Next.js 16 (App Router, Turbopack, React 19)
*   **Styling**: Tailwind CSS 4 with custom dynamic CSS properties configuration
*   **Database**: PostgreSQL hosted on Supabase (ap-south-1 connection-pooled)
*   **Database ORM**: Prisma ORM (Client v6.0.1)
*   **Authentication**: Custom secure JWT authentication
*   **Hosting**: Vercel Serverless Platform
