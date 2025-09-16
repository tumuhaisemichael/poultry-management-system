import { formidable } from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), 'public/uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const form = formidable({
    uploadDir: uploadDir,
    keepExtensions: true,
    filename: (name, ext, part, form) => {
      return `${Date.now()}_${part.originalFilename}`;
    }
  });

  try {
    const [fields, files] = await form.parse(req);

    if (!files.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const uploadedFile = files.file[0];
    const filePath = `/uploads/${uploadedFile.newFilename}`;

    return res.status(200).json({ filePath });
  } catch (error) {
    console.error('File upload error:', error);
    return res.status(500).json({ error: 'Error uploading file.' });
  }
}
