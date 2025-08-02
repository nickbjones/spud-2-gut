// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';
import { IncomingForm, File as FormidableFile } from 'formidable';
import fs from 'fs';
import { promisify } from 'util';
import { Readable } from 'stream';

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Disable Next.js body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to parse form using formidable
const parseForm = async (req: Request): Promise<{ file: FormidableFile }> => {
  const form = new IncomingForm({ keepExtensions: true });

  const buffer = await req.arrayBuffer();
  const stream = Readable.from(Buffer.from(buffer));

  return await new Promise((resolve, reject) => {
    form.parse(stream as any, (err, fields, files) => {
      if (err) return reject(err);

      const fileField = files.image;
      let file: FormidableFile;

      if (!fileField) return reject(new Error('No file uploaded'));

      if (Array.isArray(fileField)) {
        file = fileField[0];
      } else {
        file = fileField;
      }

      resolve({ file });
    });
  });
};

export async function POST(req: Request) {
  try {
    const { file } = await parseForm(req);

    const fileContent = fs.readFileSync(file.filepath);
    const fileName = `${Date.now()}-${file.originalFilename}`;

    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: fileName,
      Body: fileContent,
      ContentType: file.mimetype || 'application/octet-stream',
      ACL: ObjectCannedACL.public_read,
    };

    await s3.send(new PutObjectCommand(uploadParams));

    const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    return NextResponse.json({ url: fileUrl }, { status: 200 });
  } catch (err) {
    console.error('Upload failed:', err);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
