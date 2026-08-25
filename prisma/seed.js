const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database for Shree TBTC Global Industries...');

  // 1. Create default admin user
  const adminUsername = 'admin';
  const adminEmail = 'info@stbtcgi.in';
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ username: adminUsername }, { email: adminEmail }] }
  });

  if (!existingUser) {
    const passwordHash = bcrypt.hashSync('admin123', 10);
    await prisma.user.create({
      data: {
        username: adminUsername,
        email: adminEmail,
        passwordHash,
        role: 'SUPER_ADMIN'
      }
    });
    console.log('Admin user created (Username: admin, Password: admin123).');
  } else {
    console.log('Admin user already exists.');
  }

  // 1b. Seed default Role Configs
  const defaultRoles = [
    {
      role: 'ADMIN',
      canEditSettings: true,
      canEditProducts: true,
      canEditDownloads: true,
      canEditBlogs: true,
      canEditForms: true,
      canEditCustomPages: true
    },
    {
      role: 'EDITOR',
      canEditSettings: false,
      canEditProducts: true,
      canEditDownloads: true,
      canEditBlogs: true,
      canEditForms: false,
      canEditCustomPages: false
    }
  ];

  for (const roleConf of defaultRoles) {
    const existingRole = await prisma.roleConfig.findUnique({
      where: { role: roleConf.role }
    });
    if (!existingRole) {
      await prisma.roleConfig.create({
        data: roleConf
      });
      console.log(`RoleConfig seeded for ${roleConf.role}`);
    }
  }

  // 2. Initial Top Bar Config JSON
  const topBarConfig = JSON.stringify([
    { id: "1", type: "phone", label: "Call Us", value: "+91-9331404702", icon: "Phone", isEnabled: true, displayOrder: 1 },
    { id: "2", type: "email", label: "Email", value: "info@stbtcgi.in", icon: "Mail", isEnabled: true, displayOrder: 2 },
    { id: "3", type: "hours", label: "Hours", value: "Mon - Sat: 10AM - 5PM", icon: "Clock", isEnabled: true, displayOrder: 3 },
    { id: "4", type: "whatsapp", label: "WhatsApp Chat", value: "+919331404702", icon: "MessageSquare", isEnabled: true, displayOrder: 4 }
  ]);

  // 3. Initial Navigation Config JSON
  const navigationConfig = JSON.stringify([
    { name: "Home", href: "/", isExternal: false },
    { name: "About Us", href: "/about", isExternal: false },
    { 
      name: "Products", 
      href: "/products", 
      isExternal: false,
      dropdownItems: [
        { name: "All Categories", href: "/products" },
        { name: "Electrical Switchgear", href: "/products/electrical-switchgear" },
        { name: "Steels & Fittings", href: "/products/steels" },
        { name: "Lubricants & Greases", href: "/products/lubricant-grease" },
        { name: "Industrial Filters", href: "/products/filters" },
        { name: "Air Compressors", href: "/products/compressor" },
        { name: "Disc Insulators", href: "/products/tip-insulator" }
      ]
    },
    { name: "Downloads", href: "/downloads", isExternal: false },
    { name: "Blog", href: "/blog", isExternal: false },
    { name: "Contact Us", href: "/contact", isExternal: false }
  ]);

  // 4. Initial Footer Config JSON
  const footerConfig = JSON.stringify([
    {
      title: "Company Info",
      type: "text",
      content: "Shree TBTC Global Industries is a leading procurement force and industrial supplier based in Howrah, West Bengal, delivering switchgears, steels, lubricants, filters, and insulators."
    },
    {
      title: "Quick Links",
      type: "links",
      links: [
        { text: "Home", href: "/" },
        { text: "About Us", href: "/about" },
        { text: "Products", href: "/products" },
        { text: "Literature Center", href: "/downloads" },
        { text: "Technical Blog", href: "/blog" },
        { text: "Contact Us", href: "/contact" }
      ]
    },
    {
      title: "Product Segments",
      type: "categories",
      limit: 5
    },
    {
      title: "Head Office",
      type: "contact",
      showHours: true
    }
  ]);

  // 5. Initial Homepage Sections configuration
  const homepageSectionsConfig = JSON.stringify([
    { id: "slider", name: "Hero Banner Slides", isEnabled: true, displayOrder: 1 },
    { id: "intro", name: "Who We Are", isEnabled: true, displayOrder: 2 },
    { id: "categories", name: "Category grid", isEnabled: true, displayOrder: 3 },
    { id: "featured", name: "Featured Products", isEnabled: true, displayOrder: 4 },
    { id: "why", name: "Why Choose Us benefits", isEnabled: true, displayOrder: 5 },
    { id: "industries", name: "Industries We Serve", isEnabled: true, displayOrder: 6 },
    { id: "cta", name: "Call to Action banners", isEnabled: true, displayOrder: 7 }
  ]);

  // 6. About Page Values
  const aboutValuesConfig = JSON.stringify([
    { title: "Genuine Quality", description: "100% original and certified industrial components sourced from premium makers.", iconName: "ShieldCheck" },
    { title: "Reliable Supply", description: "High stock levels and minimal transit delays to ensure industrial uptime.", iconName: "Clock" },
    { title: "Expert Assistance", description: "Experienced engineering advisors providing precise model matching support.", iconName: "Wrench" }
  ]);

  // 7. About Page Stats
  const aboutStatsConfig = JSON.stringify([
    { value: "15+", label: "Years of Trust", iconName: "Award" },
    { value: "5000+", label: "Components Listed", iconName: "Package" },
    { value: "100%", label: "Traceable Materials", iconName: "CheckCircle" }
  ]);

  // 8. Upsert central settings
  await prisma.companySettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      companyName: 'Shree TBTC Global Industries',
      activeTheme: 'theme1',
      primaryColor: '#0b3c5d',
      secondaryColor: '#d9534f',
      accentColor: '#328cc1',
      backgroundColor: '#ffffff',
      darkSectionColor: '#0f172a',
      textColor: '#334155',
      buttonColor: '#0b3c5d',
      buttonHoverColor: '#0d4870',
      linkColor: '#0b3c5d',
      email: 'info@stbtcgi.in',
      phoneNumbers: '+91-9331404702, +91-8240450043, +91-9038707773',
      whatsAppNumber: '+919331404702',
      address: 'Flat No: 302, 14/1 Sree Kishen Bhakat Lane, Howrah - 711101, West Bengal, India',
      city: 'Howrah',
      state: 'West Bengal',
      country: 'India',
      postalCode: '711101',
      gstNumber: '',
      businessHours: 'Monday – Saturday (10:00 AM – 05:00 PM)',
      googleMapsEmbed: '',
      enableTopContactBar: true,
      topBarTitle: 'DEALER & IMPORTER',
      topBarConfig,
      headerCtaText: 'Request Quote',
      headerCtaLink: '/quote',
      enableHeaderSearch: true,
      enableStickyHeader: true,
      navigationConfig,
      sliderAutoplay: true,
      sliderAutoplaySpeed: 5000,
      sliderTransitionStyle: 'fade',
      sliderTransitionSpeed: 500,
      sliderShowArrows: true,
      sliderShowDots: true,
      sliderHeight: 'h-[600px]',
      introEnabled: true,
      introHeading: 'Who We Are',
      introHighlightHeading: 'Shree TBTC Global Industries',
      introSubtitle: 'Your Trusted Industrial Procurement Partner',
      introDescription: 'Shree TBTC Global Industries is a leading procurement force and industrial supplier based in West Bengal. Established as a primary supply hub in Howrah, under the leadership of Mr. Premnath Agrahari, we specialize in supplying low/medium voltage electrical switchgear, high-grade carbon/alloy steels, industrial lubricants, compressors, and porcelain disc insulators.',
      introImages: JSON.stringify(['https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800']),
      introCtaText: 'Read Our Profile',
      introCtaLink: '/about',
      introCtaStyle: 'primary',
      introBgColor: '#ffffff',
      introTextColor: '#334155',
      introLayoutStyle: 'left-image',
      homeCategoriesLimit: 6,
      homeCategoriesLayout: 'grid',
      homeFeaturedProductsEnabled: true,
      homeFeaturedProductsHeading: 'Featured Products',
      homeFeaturedProductsSubtitle: 'High-Quality Industrial Supplies',
      homeFeaturedProductsLimit: 6,
      homeFeaturedProductsCtaText: 'View All Products',
      homeFeaturedProductsCtaLink: '/products',
      homeFeaturedProductsLayout: 'grid',
      whyWorkEnabled: true,
      whyWorkHeading: 'Why Work With Shree TBTC',
      whyWorkHighlight: 'Shree TBTC',
      whyWorkSubtitle: 'Our Commitment to Quality',
      whyWorkDescription: 'We deliver only certified and traceable industrial components directly from original manufacturers, guaranteeing zero-downtime operations.',
      whyWorkBgColor: '#f8fafc',
      whyWorkTextColor: '#334155',
      whyWorkLayout: 'left-content',
      homeIndustriesEnabled: true,
      homeIndustriesHeading: 'Industries We Serve',
      homeIndustriesSubtitle: 'Sectors We Support',
      homeIndustriesDescription: 'Supporting vital utilities, heavy manufacturing, food processing and refining plants with high-spec machinery components.',
      homeIndustriesBgColor: '#ffffff',
      homeIndustriesTextColor: '#334155',
      homeIndustriesLayout: 'grid',
      homeCtaEnabled: true,
      homeCtaHeading: 'Looking for a specific Industrial Component or custom steel order?',
      homeCtaHighlight: 'Industrial Component',
      homeCtaDescription: 'Talk to our technical sales experts for direct stock availability checks, catalog downloads, and custom pricing contracts.',
      homeCtaBgColor: '#0b3c5d',
      homeCtaBgImage: null,
      homeCtaBgOverlay: 0.8,
      homeCtaTextColor: '#ffffff',
      homeCtaButtons: JSON.stringify([
        { text: "Submit Inquiry", link: "/contact", style: "primary", color: "#d9534f", textColor: "#ffffff", openInNewTab: false, isActive: true },
        { text: "WhatsApp Sales", link: "https://wa.me/919331404702", style: "secondary", color: "#25D366", textColor: "#ffffff", openInNewTab: true, isActive: true }
      ]),
      footerConfig,
      copyrightText: '© {year} Shree TBTC Global Industries. All Rights Reserved.',
      devCreditText: 'Created & Developed By Webz Technologies',
      devCreditLink: 'https://webztechnologies.com/',
      devCreditEnabled: true,
      devCreditOpenInNewTab: true,
      aboutHeroTitle: 'About Our Company',
      aboutHeroSubtitle: 'Your Trusted Partner in Industrial Procurement',
      aboutHeroBgImage: null,
      aboutHeroCtaText: 'Contact Our Office',
      aboutHeroCtaLink: '/contact',
      aboutStoryHeading: 'One-Stop Source for Switchgear, Steels, Lubricants & Insulators',
      aboutStoryContent: 'Founded under the leadership of Mr. Premnath Agrahari, Shree TBTC Global Industries has established itself as a premier dealer and importer in West Bengal. We serve as a trusted procurement partner for processing grids, power utilities, and heavy manufacturing divisions.',
      aboutStoryImages: JSON.stringify(['https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800']),
      aboutStoryHighlights: JSON.stringify([
        "Traceable IEC & IS compliant parts",
        "Authorised stockist for heavy switchgear",
        "Direct imports of high-grade alloy steels"
      ]),
      aboutMissionHeading: 'Our Mission',
      aboutMissionContent: 'To bridge industrial resource gaps by procuring high-grade components directly from original channels, minimizing logistics delay and maximizing factory runtime.',
      aboutMissionImage: null,
      aboutVisionHeading: 'Our Vision',
      aboutVisionContent: 'To be India\'s most trusted B2B industrial procurement house, known for our uncompromising quality standards and original parts distribution.',
      aboutVisionImage: null,
      aboutValuesConfig,
      aboutStatsConfig,
      aboutTeamConfig: JSON.stringify([]),
      aboutCertificationsConfig: JSON.stringify([]),
      aboutCtaConfig: JSON.stringify({ heading: "Get a Technical Quotation Today", buttonText: "Request RFQ", link: "/quote" }),
      homepageSectionsConfig,
      seoTitleDefault: 'Shree TBTC Global Industries | Industrial Electrical & Automation',
      seoDescriptionDefault: 'Shree TBTC Global Industries is a leading importer and dealer of Electrical Switchgears, Industrial Steels, Lubricants/Greases, Compressor Filters, and Tip Insulators based in Howrah, West Bengal.'
    }
  });
  console.log('Company settings initialized.');

  // 9. Seed Hero Slides
  const existingSlides = await prisma.heroSlide.count();
  if (existingSlides === 0) {
    await prisma.heroSlide.createMany({
      data: [
        {
          heading: 'Premium Industrial Switchgear & Components',
          subheading: 'Importer and dealer of high-quality electrical switchgear, MPCBs, and overload relays.',
          ctaText: 'Explore Switchgear',
          ctaLink: '/products/electrical-switchgear',
          desktopImageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200',
          overlayOpacity: 0.5,
          textAlignment: 'LEFT',
          displayOrder: 1,
          isActive: true,
          buttonsConfig: JSON.stringify([
            { text: "Explore Switchgear", link: "/products/electrical-switchgear", style: "primary", color: "#0b3c5d", textColor: "#ffffff", openInNewTab: false, isActive: true },
            { text: "Request Catalog", link: "/contact", style: "secondary", color: "#ffffff", textColor: "#334155", openInNewTab: false, isActive: true }
          ])
        },
        {
          heading: 'Industrial Steels & Fittings',
          subheading: 'Premium steel flanges, plates, pipes, tubes, strips, and valves for high-pressure installations.',
          ctaText: 'Browse Steels',
          ctaLink: '/products/steels',
          desktopImageUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=1200',
          overlayOpacity: 0.5,
          textAlignment: 'CENTER',
          displayOrder: 2,
          isActive: true,
          buttonsConfig: JSON.stringify([
            { text: "Browse Steels", link: "/products/steels", style: "primary", color: "#d9534f", textColor: "#ffffff", openInNewTab: false, isActive: true }
          ])
        },
        {
          heading: 'Specialized Lubricants & Industrial Filters',
          subheading: 'High-performance food-grade greases, robot greases, polymer melt filters, and compressor filtration.',
          ctaText: 'View Products',
          ctaLink: '/products',
          desktopImageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200',
          overlayOpacity: 0.5,
          textAlignment: 'RIGHT',
          displayOrder: 3,
          isActive: true,
          buttonsConfig: JSON.stringify([
            { text: "View Products", link: "/products", style: "primary", color: "#0b3c5d", textColor: "#ffffff", openInNewTab: false, isActive: true }
          ])
        }
      ]
    });
    console.log('Hero slides seeded.');
  }

  // 10. Seed Categories
  const categoriesData = [
    { name: 'Electrical Switchgear', slug: 'electrical-switchgear', description: 'All kinds of electrical switchgear, overload relays, MPCBs, and motor control components.' },
    { name: 'Steels', slug: 'steels', description: 'Various steel products including flanges, plates, pipes and tubes, strips, angles, and valves.' },
    { name: 'Lubricant/ Grease', slug: 'lubricant-grease', description: 'Comprehensive range of food-grade, low-temperature, robot, and cartridge greases.' },
    { name: 'Filters', slug: 'filters', description: 'Compressor filters, polymer melt filters, and other high-performance filtration solutions.' },
    { name: 'Compressor', slug: 'compressor', description: 'Reciprocating, rotary screw, and centrifugal compressor units and accessories.' },
    { name: 'Tip Insulator', slug: 'tip-insulator', description: 'Porcelain and polymer insulators engineered for high-tension electrical systems.' }
  ];

  const categories = {};
  for (const cat of categoriesData) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        isActive: true,
        isFeatured: true,
        displayOrder: 0
      }
    });
    categories[cat.slug] = record.id;
  }
  console.log('Categories seeded.');

  // 11. Seed Why Choose Us
  const whyCount = await prisma.whyChooseUs.count();
  if (whyCount === 0) {
    await prisma.whyChooseUs.createMany({
      data: [
        {
          title: 'Genuine Products',
          description: 'We supply only original, high-quality, and certified industrial components from trusted global manufacturers.',
          iconName: 'ShieldCheck',
          displayOrder: 1,
          isActive: true
        },
        {
          title: 'Technical Support',
          description: 'Our experienced engineering team provides selection assistance and comprehensive technical resources for your applications.',
          iconName: 'Wrench',
          displayOrder: 2,
          isActive: true
        },
        {
          title: 'Fast Response',
          description: 'Get rapid technical quotes, catalogs, and sales assistance within 24 hours of your inquiry.',
          iconName: 'Zap',
          displayOrder: 3,
          isActive: true
        },
        {
          title: 'Import Capabilities',
          description: 'Direct procurement and custom import handling for specialized items that are hard to source locally.',
          iconName: 'Globe',
          displayOrder: 4,
          isActive: true
        }
      ]
    });
    console.log('Why Choose Us items seeded.');
  }

  // 12. Seed Industries
  const indCount = await prisma.industry.count();
  if (indCount === 0) {
    await prisma.industry.createMany({
      data: [
        {
          name: 'Power Generation & Utilities',
          slug: 'power-generation',
          description: 'High-tension insulators, switchgears, and power monitoring panels built for substation grids.',
          imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=600',
          displayOrder: 1,
          isActive: true
        },
        {
          name: 'Steel & Metal Processing',
          slug: 'steel-processing',
          description: 'Industrial flanges, heavy piping, control valves, and high-temperature lubricants designed for demanding metallurgy plants.',
          imageUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600',
          displayOrder: 2,
          isActive: true
        },
        {
          name: 'Food & Beverage Packaging',
          slug: 'food-beverage',
          description: 'NSF H1 food-grade lubricants, sanitary piping, and corrosion-resistant switchgear for strict hygiene lines.',
          imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
          displayOrder: 3,
          isActive: true
        }
      ]
    });
    console.log('Industries seeded.');
  }

  // 13. Seed Sample Products
  const productsData = [
    {
      name: 'Thermal Overload Relay',
      slug: 'thermal-overload-relay',
      modelNumber: 'STBT-OR-22',
      sku: 'SW-OR-22',
      shortDescription: 'High-sensitivity thermal overload relay for electric motors.',
      fullDescription: 'Protects electrical motors against sustained overcurrent, overload, and phase failures. Integrates directly with motor contactors.',
      keyFeatures: '- Adjusting current range: 9A to 13A\n- Rated operational voltage: up to 690V AC\n- Standard compliance: IEC 60947-4-1\n- Trip class: Class 10A\n- Easy mounting directly underneath contactors',
      technicalSpecs: JSON.stringify({
        "Adjusting Range": "9A - 13A",
        "Trip Class": "10A",
        "Standard": "IEC 60947-4-1",
        "Control Voltage": "690V AC",
        "Contacts": "1 NO + 1 NC",
        "Reset Mode": "Manual / Automatic"
      }),
      applications: 'Motor control centers, industrial pump panels, conveyor motor protection, HVAC compressors.',
      categorySlug: 'electrical-switchgear',
      isFeatured: true,
      price: null,
      showPrice: false,
      isAvailable: true
    },
    {
      name: 'Motor Protection Circuit Breaker (MPCB)',
      slug: 'motor-protection-circuit-breaker',
      modelNumber: 'STBT-MPCB-32',
      sku: 'SW-MP-32',
      shortDescription: 'High-breaking capacity MPCB for short-circuit and overload motor safety.',
      fullDescription: 'Combines thermal overload protection, magnetic short-circuit protection, and switching functionality in a single compact DIN-rail unit.',
      keyFeatures: '- Adjustable thermal release current: 25A to 32A\n- Short-circuit breaking capacity: 50kA at 400V\n- Rotary/Push Button handle for visual indication of state\n- High electrical and mechanical durability',
      technicalSpecs: JSON.stringify({
        "Current Rating": "25A - 32A",
        "Breaking Capacity (Icu)": "50kA at 400V",
        "Mounting Type": "35mm DIN Rail",
        "Operating Temp": "-20°C to +60°C",
        "IP Rating": "IP20",
        "Frequency": "50/60 Hz"
      }),
      applications: 'Heavy machinery lines, motor control starter panels, ventilation setups.',
      categorySlug: 'electrical-switchgear',
      isFeatured: true,
      price: null,
      showPrice: false,
      isAvailable: true
    },
    {
      name: 'Carbon Steel Slip-On Flange',
      slug: 'carbon-steel-slip-on-flange',
      modelNumber: 'STBT-SOF-DN80',
      sku: 'ST-SO-80',
      shortDescription: 'ANSI B16.5 carbon steel slip-on flange for pipeline connections.',
      fullDescription: 'High-durability forged carbon steel flange. Ideal for pipelines carrying water, steam, oil, or gas under pressure. Highly resistant to fatigue.',
      keyFeatures: '- Flange Type: Slip-On (SO)\n- Standard: ASME/ANSI B16.5\n- Material Specification: ASTM A105 Forged Carbon Steel\n- Pressure Class: 150 lbs\n- High mechanical tolerance and smooth gasket face',
      technicalSpecs: JSON.stringify({
        "Flange Type": "Slip-On",
        "Nominal Pipe Size": "3 inches (DN80)",
        "Pressure Rating": "Class 150",
        "Material": "ASTM A105 Carbon Steel",
        "Gasket Surface": "Raised Face (RF)",
        "Bolting holes": "8 holes"
      }),
      applications: 'Utility steam piping, water treatment facilities, chemical processing lines.',
      categorySlug: 'steels',
      isFeatured: true,
      price: null,
      showPrice: false,
      isAvailable: true
    },
    {
      name: 'Premium Food-Grade Synthetic Grease',
      slug: 'food-grade-synthetic-grease',
      modelNumber: 'STBT-FG-GR400',
      sku: 'LB-FG-400',
      shortDescription: 'NSF H1 registered food-grade grease for machinery operating in sanitary environments.',
      fullDescription: 'Non-toxic, high-performance synthetic grease designed for processing and packaging machinery where incidental contact with food may occur. Resists wash-offs.',
      keyFeatures: '- NSF H1 Certified for food safety compliance\n- Excellent water washout and chemical spray resistance\n- Wide thermal range: -40°C to +150°C\n- Neutral odor and taste, completely clear color',
      technicalSpecs: JSON.stringify({
        "Certification": "NSF H1 #14498",
        "NLGI Grade": "2",
        "Thickener": "Aluminum Complex",
        "Base Oil": "Synthetic PAO",
        "Dropping Point": "260°C",
        "Operating Temp": "-40°C to +150°C"
      }),
      applications: 'Beverage filling, food packaging conveyors, pharma processing lines.',
      categorySlug: 'lubricant-grease',
      isFeatured: true,
      price: null,
      showPrice: false,
      isAvailable: true
    },
    {
      name: 'Polymer Melt Pleated Filter Element',
      slug: 'polymer-melt-filter-element',
      modelNumber: 'STBT-PMF-50L',
      sku: 'FL-PM-50',
      shortDescription: 'Stainless steel pleated wire mesh filter for polymer melt filtration.',
      fullDescription: 'High-temperature, high-pressure filter element built with multiple layers of stainless steel pleated wire mesh to extract fine impurities from polymer melts and plastics.',
      keyFeatures: '- Media: Pleated 5-layer Stainless Steel 316L wire cloth\n- Extended surface area for higher dirt capacity and longer lifespan\n- Cleanable and reusable multiple times\n- Resists pressures up to 200 bar',
      technicalSpecs: JSON.stringify({
        "Filter Media": "SS 316L Pleated Mesh",
        "Filtration Rating": "20 microns",
        "Max Temperature": "350°C",
        "Max Differential Press": "200 bar",
        "Connection Type": "Threaded / Flat Gasket"
      }),
      applications: 'Plastic extrusion machines, fiber spinning lines, polymer recycling plants.',
      categorySlug: 'filters',
      isFeatured: true,
      price: null,
      showPrice: false,
      isAvailable: true
    },
    {
      name: 'Porcelain Suspension Disc Insulator',
      slug: 'porcelain-suspension-disc-insulator',
      modelNumber: 'STBT-INS-11KVD',
      sku: 'TI-PR-11',
      shortDescription: '11KV high-tension porcelain disc insulator for suspension and tension overhead lines.',
      fullDescription: 'High electromechanical strength porcelain insulator. Designed to insulate and support overhead electrical distribution conductors on poles and towers.',
      keyFeatures: '- Rated Voltage: 11kV\n- Creepage distance: 320mm\n- Electromechanical failing load: 70kN\n- Made from high-grade glazed porcelain for anti-contamination\n- Standards: IEC 60383 / IS 731',
      technicalSpecs: JSON.stringify({
        "Insulator Class": "Suspension Disc",
        "Rated Voltage": "11kV",
        "Creepage Distance": "320mm",
        "Failing Load": "70kN",
        "Material": "Glazed Porcelain",
        "Hardware Connection": "Ball and Socket (16mm)"
      }),
      applications: 'High-voltage transmission power lines, railway catenary grids, substations.',
      categorySlug: 'tip-insulator',
      isFeatured: true,
      price: null,
      showPrice: false,
      isAvailable: true
    }
  ];

  for (const prod of productsData) {
    const catId = categories[prod.categorySlug];
    if (!catId) continue;

    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        name: prod.name,
        modelNumber: prod.modelNumber,
        sku: prod.sku,
        shortDescription: prod.shortDescription,
        fullDescription: prod.fullDescription,
        keyFeatures: prod.keyFeatures,
        technicalSpecs: prod.technicalSpecs,
        applications: prod.applications,
        categoryId: catId,
        isFeatured: prod.isFeatured,
        isAvailable: prod.isAvailable
      },
      create: {
        name: prod.name,
        slug: prod.slug,
        modelNumber: prod.modelNumber,
        sku: prod.sku,
        shortDescription: prod.shortDescription,
        fullDescription: prod.fullDescription,
        keyFeatures: prod.keyFeatures,
        technicalSpecs: prod.technicalSpecs,
        applications: prod.applications,
        categoryId: catId,
        isFeatured: prod.isFeatured,
        isAvailable: prod.isAvailable,
        showPrice: prod.showPrice,
        isActive: true
      }
    });
  }
  console.log('Sample products seeded.');

  // 14. Seed default Form Builder Fields
  const existingFields = await prisma.formField.count();
  if (existingFields === 0) {
    await prisma.formField.createMany({
      data: [
        // GENERAL INQUIRY FORM
        { label: "Your Full Name", name: "fullName", type: "TEXT", placeholder: "e.g. John Doe", isRequired: true, formType: "GENERAL", displayOrder: 1 },
        { label: "Business Email", name: "email", type: "EMAIL", placeholder: "e.g. john@company.com", isRequired: true, formType: "GENERAL", displayOrder: 2 },
        { label: "Phone Number", name: "phone", type: "PHONE", placeholder: "e.g. +91 93314 04702", isRequired: true, formType: "GENERAL", displayOrder: 3 },
        { label: "Company / Organization", name: "companyName", type: "TEXT", placeholder: "e.g. Acme Industries Ltd", isRequired: false, formType: "GENERAL", displayOrder: 4 },
        { label: "Detailed Message", name: "message", type: "TEXTAREA", placeholder: "Specify technical parameters or stock checks...", isRequired: true, formType: "GENERAL", displayOrder: 5 },
        
        // CONTACT FORM
        { label: "Full Name", name: "fullName", type: "TEXT", placeholder: "Your name", isRequired: true, formType: "CONTACT", displayOrder: 1 },
        { label: "Email Address", name: "email", type: "EMAIL", placeholder: "Your email", isRequired: true, formType: "CONTACT", displayOrder: 2 },
        { label: "Phone Number", name: "phone", type: "PHONE", placeholder: "Your phone", isRequired: true, formType: "CONTACT", displayOrder: 3 },
        { label: "Subject", name: "subject", type: "TEXT", placeholder: "Reason for contact", isRequired: false, formType: "CONTACT", displayOrder: 4 },
        { label: "Message Description", name: "message", type: "TEXTAREA", placeholder: "Enter query details...", isRequired: true, formType: "CONTACT", displayOrder: 5 },

        // PRODUCT INQUIRY
        { label: "Contact Name", name: "fullName", type: "TEXT", placeholder: "Your name", isRequired: true, formType: "PRODUCT", displayOrder: 1 },
        { label: "Corporate Email", name: "email", type: "EMAIL", placeholder: "Your email", isRequired: true, formType: "PRODUCT", displayOrder: 2 },
        { label: "Primary Phone", name: "phone", type: "PHONE", placeholder: "Your phone", isRequired: true, formType: "PRODUCT", displayOrder: 3 },
        { label: "Estimate Volume / Quantity Needed", name: "quantityNeeded", type: "NUMBER", placeholder: "e.g. 50 units", isRequired: false, formType: "PRODUCT", displayOrder: 4 },
        { label: "Custom Requirements / Notes", name: "message", type: "TEXTAREA", placeholder: "Notes on model number or voltage range...", isRequired: true, formType: "PRODUCT", displayOrder: 5 }
      ]
    });
    console.log('Dynamic form fields seeded.');
  }

  // 15. Seed Locations
  const existingLocations = await prisma.location.count();
  if (existingLocations === 0) {
    await prisma.location.create({
      data: {
        name: "Howrah Head Office",
        address: "Flat No: 302, 14/1 Sree Kishen Bhakat Lane, Howrah - 711101, West Bengal, India",
        phone: "+91-9331404702, +91-8240450043, +91-9038707773",
        email: "info@stbtcgi.in",
        mapEmbed: "",
        displayOrder: 1,
        isActive: true
      }
    });
    console.log('Locations seeded.');
  }

  // 16. Seed Social Platforms
  const existingSocials = await prisma.socialPlatform.count();
  if (existingSocials === 0) {
    await prisma.socialPlatform.createMany({
      data: [
        { platformName: "Facebook", iconName: "Facebook", profileUrl: "https://facebook.com/shreetbtc", displayOrder: 1, isActive: true },
        { platformName: "LinkedIn", iconName: "Linkedin", profileUrl: "https://linkedin.com/company/shreetbtc", displayOrder: 2, isActive: true },
        { platformName: "Twitter", iconName: "Twitter", profileUrl: "https://twitter.com/shreetbtc", displayOrder: 3, isActive: true }
      ]
    });
    console.log('Social platforms seeded.');
  }

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
