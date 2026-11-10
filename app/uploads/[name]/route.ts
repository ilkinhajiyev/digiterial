import fs from 'fs';
import path from 'path';

export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!/^[\w.-]+$/.test(name)) return new Response('Bad request', { status: 400 });
  const root = process.env.CATALOG_DATA_DIR
    ? path.join(process.env.CATALOG_DATA_DIR, 'media')
    : path.join(process.cwd(), 'public', 'media', 'uploads');
  const file = path.join(root, name);
  if (!file.startsWith(root) || !fs.existsSync(file)) return new Response('Not found', { status: 404 });
  const ext = path.extname(name).toLowerCase();
  const type = ext === '.pdf' ? 'application/pdf' : ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
  return new Response(fs.readFileSync(file), { headers: { 'Content-Type': type, 'Cache-Control': 'public, max-age=86400' } });
}
