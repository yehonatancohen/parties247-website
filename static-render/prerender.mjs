import path from 'node:path';
import { promises as fs } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const templatePath = path.join(distDir, 'index.html');
const reactRouterDomEntry = path.join(projectRoot, 'node_modules/react-router-dom/dist/index.mjs');
const reactRouterEntry = path.join(projectRoot, 'node_modules/react-router/dist/development/index.mjs');

const resolveOutputPath = async (route) => {
  if (route === '/') {
    return path.join(distDir, 'index.html');
  }
  const segments = route.replace(/^\//, '').split('/');
  const filePath = path.join(distDir, ...segments, 'index.html');
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  return filePath;
};

const main = async () => {
  const template = await fs.readFile(templatePath, 'utf-8');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    ssr: { noExternal: ['react-router-dom', 'react-router'] },
    resolve: {
      alias: {
        'react-router-dom': reactRouterDomEntry,
        'react-router': reactRouterEntry,
      },
    },
    optimizeDeps: {
      noDiscovery: true,
      include: [],
    },
  });

  try {
    const { fetchInitialState, buildRouteList, renderAppToHtml } = await vite.ssrLoadModule(
      '/static-render/render-app.tsx',
    );

    const initialState = await fetchInitialState();
    const parties = Array.isArray(initialState.parties) ? initialState.parties : [];
    const routes = buildRouteList(parties);

    for (const route of routes) {
      const html = renderAppToHtml(route, template, initialState);
      const outputPath = await resolveOutputPath(route);
      await fs.writeFile(outputPath, html, 'utf-8');
      console.log(`Pre-rendered ${route}`);
    }
  } finally {
    await vite.close();
  }
};

main().catch((error) => {
  console.error('Pre-rendering failed:', error);
  process.exitCode = 1;
});
