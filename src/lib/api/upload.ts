// /pages/api/upload.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { S3Client, PutObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';
import formidable, { File as FormidableFile } from 'formidable';
import fs from 'fs';

// Disable Next.js body parser so we can use formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Formidable error:', err);
      return res.status(500).json({ error: 'Error parsing form data' });
    }

    const fileField = files.image;
    let file: FormidableFile;

    if (!fileField) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (Array.isArray(fileField)) {
      file = fileField[0]; // take the first file
    } else {
      file = fileField;
    }

    try {
      const fileContent = fs.readFileSync(file.filepath);
      const fileName = `${Date.now()}-${file.originalFilename}`;

      const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: fileName,
        Body: fileContent,
        ContentType: file.mimetype || 'application/octet-stream',
        ACL: ObjectCannedACL.public_read, // ✅ correct enum
      };

      await s3Client.send(new PutObjectCommand(uploadParams));

      const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

      return res.status(200).json({ url: fileUrl });
    } catch (uploadError) {
      console.error('S3 upload error:', uploadError);
      return res.status(500).json({ error: 'Error uploading file to S3' });
    }
  });
}
