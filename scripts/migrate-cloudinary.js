const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const https = require('https');

const prisma = new PrismaClient();

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: status ${res.statusCode}`));
      }
      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve(destPath);
      });
      fileStream.on('error', reject);
    }).on('error', reject);
  });
}

async function main() {
  const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // 1. Migrate Product Images
  const productImages = await prisma.productImage.findMany({
    where: { imageUrl: { contains: 'cloudinary' } }
  });
  console.log(`Found ${productImages.length} Cloudinary product images.`);
  for (const img of productImages) {
    try {
      const ext = path.extname(new URL(img.imageUrl).pathname) || '.jpg';
      const filename = `product-${img.id}${ext}`;
      const localFilePath = path.join(uploadsDir, filename);
      console.log(`Downloading ${img.imageUrl} -> ${filename}...`);
      await downloadFile(img.imageUrl, localFilePath);
      const newUrl = `/uploads/${filename}`;
      await prisma.productImage.update({
        where: { id: img.id },
        data: { imageUrl: newUrl }
      });
      console.log(`Updated productImage ${img.id} to ${newUrl}`);
    } catch (err) {
      console.error(`Error migrating image ${img.id}:`, err);
    }
  }

  // 2. Migrate Product Documents
  const productDocs = await prisma.productDocument.findMany({
    where: { fileUrl: { contains: 'cloudinary' } }
  });
  console.log(`Found ${productDocs.length} Cloudinary product documents.`);
  for (const doc of productDocs) {
    try {
      const ext = path.extname(new URL(doc.fileUrl).pathname) || '.pdf';
      const cleanName = doc.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filename = `doc-${doc.id}-${cleanName.endsWith('.pdf') ? cleanName : cleanName + ext}`;
      const localFilePath = path.join(uploadsDir, filename);
      console.log(`Downloading ${doc.fileUrl} -> ${filename}...`);
      await downloadFile(doc.fileUrl, localFilePath);
      const newUrl = `/uploads/${filename}`;
      await prisma.productDocument.update({
        where: { id: doc.id },
        data: { fileUrl: newUrl }
      });
      console.log(`Updated productDocument ${doc.id} to ${newUrl}`);
    } catch (err) {
      console.error(`Error migrating doc ${doc.id}:`, err);
    }
  }

  // 3. Migrate any Download records with Cloudinary
  const downloads = await prisma.download.findMany({
    where: { fileUrl: { contains: 'cloudinary' } }
  });
  console.log(`Found ${downloads.length} Cloudinary download records.`);
  for (const dl of downloads) {
    try {
      const ext = path.extname(new URL(dl.fileUrl).pathname) || '.pdf';
      const cleanName = dl.title.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filename = `download-${dl.id}-${cleanName.endsWith('.pdf') ? cleanName : cleanName + ext}`;
      const localFilePath = path.join(uploadsDir, filename);
      console.log(`Downloading ${dl.fileUrl} -> ${filename}...`);
      await downloadFile(dl.fileUrl, localFilePath);
      const newUrl = `/uploads/${filename}`;
      await prisma.download.update({
        where: { id: dl.id },
        data: { fileUrl: newUrl }
      });
      console.log(`Updated download ${dl.id} to ${newUrl}`);
    } catch (err) {
      console.error(`Error migrating download ${dl.id}:`, err);
    }
  }

  console.log("Migration finished.");
  await prisma.$disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

