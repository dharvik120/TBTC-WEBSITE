const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Starting database updates...");

  // 1. Add / Update "Electrical Automation" Category
  const existingEA = await prisma.category.findUnique({
    where: { slug: 'electrical-automation' }
  });

  if (!existingEA) {
    const createdEA = await prisma.category.create({
      data: {
        name: 'Electrical Automation',
        slug: 'electrical-automation',
        description: 'Comprehensive industrial automation systems, sensors, control relays, and smart electrical equipment.',
        displayOrder: 1,
        isActive: true,
        isFeatured: true,
        parentId: null
      }
    });
    console.log("Created 'Electrical Automation' category:", createdEA.id);
  } else {
    const updatedEA = await prisma.category.update({
      where: { slug: 'electrical-automation' },
      data: {
        name: 'Electrical Automation',
        isActive: true,
        isFeatured: true
      }
    });
    console.log("Updated 'Electrical Automation' category to active & featured:", updatedEA.id);
  }

  // 2. Remove "Disc Insulators" / "Tip Insulator" from categories (deactivate)
  const insulatorCats = await prisma.category.findMany({
    where: {
      OR: [
        { slug: { contains: 'insulator' } },
        { name: { contains: 'Insulator' } }
      ]
    }
  });
  for (const cat of insulatorCats) {
    await prisma.category.update({
      where: { id: cat.id },
      data: {
        isActive: false,
        isFeatured: false
      }
    });
    console.log(`Deactivated category: ${cat.name} (${cat.slug})`);
  }

  // 3 & 4. Ensure Steels and Filters categories are properly named
  const steelsCat = await prisma.category.findFirst({
    where: { slug: 'steels' }
  });
  if (steelsCat && steelsCat.name.includes('Fitting')) {
    await prisma.category.update({
      where: { id: steelsCat.id },
      data: { name: 'Steels' }
    });
    console.log("Cleaned up Steels category name.");
  }

  // 5. Update CompanySettings: email, topBarConfig, navigationConfig, footerConfig
  const settings = await prisma.companySettings.findUnique({
    where: { id: 'singleton' }
  });

  if (settings) {
    // Update TopBarConfig email
    let topBarConfig = settings.topBarConfig;
    if (topBarConfig) {
      try {
        const parsed = JSON.parse(topBarConfig);
        const updated = parsed.map(item => {
          if (item.type === 'email' || item.value?.includes('@')) {
            return { ...item, value: 'sales@stbtcgi.com' };
          }
          return item;
        });
        topBarConfig = JSON.stringify(updated);
      } catch (e) {
        console.error("Error parsing topBarConfig:", e);
      }
    }

    // Build fresh navigationConfig
    const updatedNav = [
      { name: "Home", href: "/", isExternal: false },
      { name: "About Us", href: "/about", isExternal: false },
      {
        name: "Products",
        href: "/products",
        isExternal: false,
        dropdownItems: [
          { name: "All Categories", href: "/products" },
          { name: "Electrical Automation", href: "/products/electrical-automation" },
          { name: "Electrical Switchgear", href: "/products/electrical-switchgear" },
          { name: "Steels", href: "/products/steels" },
          { name: "Lubricants & Greases", href: "/products/lubricant-grease" },
          { name: "Filters", href: "/products/filters" },
          { name: "Air Compressors", href: "/products/compressor" }
        ]
      },
      { name: "Downloads", href: "/downloads", isExternal: false },
      { name: "Blog", href: "/blog", isExternal: false },
      { name: "Contact Us", href: "/contact", isExternal: false }
    ];

    // Update footer config to remove insulator if present and update email
    let footerConfig = settings.footerConfig;
    if (footerConfig) {
      try {
        const parsedFooter = JSON.parse(footerConfig);
        const updatedFooter = parsedFooter.map(col => {
          if (col.type === 'text' && col.content) {
            col.content = col.content.replace(/,\s*and\s*(high-tension\s*)?insulators/gi, '')
                                     .replace(/,\s*insulators/gi, '');
          }
          return col;
        });
        footerConfig = JSON.stringify(updatedFooter);
      } catch (e) {
        console.error("Error parsing footerConfig:", e);
      }
    }

    await prisma.companySettings.update({
      where: { id: 'singleton' },
      data: {
        email: 'sales@stbtcgi.com',
        topBarConfig: topBarConfig,
        navigationConfig: JSON.stringify(updatedNav),
        footerConfig: footerConfig,
        seoDescriptionDefault: settings.seoDescriptionDefault?.replace(/,\s*and\s*Tip Insulators\./i, '.')
      }
    });
    console.log("Successfully updated CompanySettings: email, navigationConfig, topBarConfig, footerConfig!");
  }

  // 6. Fix any remaining Cloudinary link in productDocument if any
  const brokenDoc = await prisma.productDocument.findFirst({
    where: { fileUrl: { contains: 'cloudinary' } }
  });
  if (brokenDoc) {
    await prisma.productDocument.update({
      where: { id: brokenDoc.id },
      data: { fileUrl: '/uploads/1787680052042-TBTC_V_CARD_BACK.png' }
    });
    console.log("Updated broken productDocument to local upload file.");
  }

  console.log("Database updates complete!");
  await prisma.$disconnect();
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});

