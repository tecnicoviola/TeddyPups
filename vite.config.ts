import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'next-image-proxy',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && req.url.startsWith('/_next/image')) {
            try {
              const urlObj = new URL(req.url, 'http://localhost:3000');
              const targetUrl = urlObj.searchParams.get('url');
              if (targetUrl) {
                const cleanTarget = decodeURIComponent(targetUrl).split('?')[0];
                let filePath = path.join(__dirname, 'public', cleanTarget.replace(/^\//, ''));
                if (!fs.existsSync(filePath)) {
                  // Fallback check in public/images
                  const baseName = path.basename(cleanTarget);
                  filePath = path.join(__dirname, 'public', 'images', baseName);
                }
                if (fs.existsSync(filePath)) {
                  const ext = path.extname(filePath).toLowerCase();
                  const contentType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : ext === '.avif' ? 'image/avif' : 'image/jpeg';
                  res.setHeader('Content-Type', contentType);
                  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
                  return fs.createReadStream(filePath).pipe(res);
                }
              }
            } catch (err) {
              console.error('Error handling _next/image:', err);
            }
          }
          next();
        });
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
    watch: {
      ignored: ['**/.chrome*/**', '**/reference/**', '**/*.png', '**/*.jpg', '**/*.webp'],
    },
  },
});

