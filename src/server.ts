import { APP_BASE_HREF } from '@angular/common';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './main.server';

export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  //Arhcivos estáticos
  server.use(express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
  }));

  //Rutas
  server.get('**', async (req, res) => {
    try {
      const html = await bootstrap();
      res.send(html);
    } catch (error) {
      console.error('Error en SSR:', error);
      res.status(500).send('Error del servidor');
    }
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;
  const server = app();
  
  server.listen(port, () => {
    console.log(`Servidor Express ejecutándose en http://localhost:${port}`);
  });
}

run();