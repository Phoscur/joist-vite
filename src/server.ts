import { Hono, Context } from 'hono';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { getCookie, setCookie } from 'hono/cookie';
import { readFile } from 'node:fs/promises';
import './html.element.server';
import { defaultLang, Language } from './app/i18n';
import { GameRenderer } from './render.server';
import { Injector } from '@joist/di';
const isProd = process.env.NODE_ENV === 'production';
const distFolder = process.env.BUILD_DIR ?? 'dist/phlame';
const html = async () => await readFile(isProd ? `${distFolder}/index.html` : 'index.html', 'utf8');

const engineInjector = new Injector();

const app = new Hono()
  .use('/assets/*', serveStatic({ root: isProd ? `${distFolder}/` : './' })); // path must end with '/';

if (isProd) {
  const index = await html();
  const game = new GameRenderer();
  app.get('/*', (c) => {
    const lang = (getCookie(c, 'lang') as Language | undefined) ?? defaultLang;
    return c.html(game.render(engineInjector, index, 'Production Phlame', lang));
  });
} else {
  const game = new GameRenderer();

  app.get('/*', async (c) => {
    const lang = (getCookie(c, 'lang') as Language | undefined) ?? defaultLang;
    const index = await html();
    return c.html(game.render(engineInjector, index, 'Server Joist Vite', lang));
  });
}
export default app;

if (isProd) {
  /* eslint-disable-next-line @typescript-eslint/no-misused-spread */
  serve({ ...app, port: 4000 }, (info) => {
    console.log(`Listening on http://localhost:${info.port}`);
  });
}
