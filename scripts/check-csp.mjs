import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';

// Validate the production output after `npm run build`, including prerendered pages.
const output = new URL('../.vercel/output/', import.meta.url);
const { default: app } = await import(new URL('_functions/entry.mjs', output));
const config = JSON.parse(await readFile(new URL('config.json', output), 'utf8'));
const staticPolicies = new Map(
  config.routes
    .filter((route) => route.headers?.['content-security-policy'])
    .map((route) => [route.src, route.headers['content-security-policy']]),
);
const routes = new Set([
  '/pt-br/', '/en/', '/pt-br/articles', '/en/articles',
  ...staticPolicies.keys(),
]);

for (const lang of ['pt-br', 'en']) {
  const projects = await readdir(new URL(`static/${lang}/projects/`, output), { withFileTypes: true });
  for (const project of projects.filter((entry) => entry.isDirectory())) {
    const route = `/${lang}/projects/${project.name}`;
    assert.ok(staticPolicies.has(route), `${route} is missing its CSP header in the Vercel output`);
  }
}

for (const route of routes) {
  let html;
  let policy = staticPolicies.get(route);
  if (policy) {
    html = await readFile(new URL(`static${route}/index.html`, output), 'utf8');
  } else {
    const response = await app.fetch(new Request(`https://portfolio.skittz.dev${route}`));
    assert.equal(response.status, 200, `${route} must render successfully`);
    policy = response.headers.get('content-security-policy');
    html = await response.text();
  }

  assert.ok(policy, `${route} is missing its CSP header`);
  const directives = new Map(policy.split(';').map((value) => {
    const [name, ...sources] = value.trim().split(/\s+/);
    return [name, sources];
  }));
  const scriptSources = directives.get('script-src-elem') ?? directives.get('script-src');
  assert.ok(scriptSources?.length, `${route} must restrict scripts`);
  for (const name of ['script-src', 'script-src-elem']) {
    for (const source of directives.get(name) ?? []) {
      assert.ok(!["'unsafe-inline'", "'unsafe-eval'", 'data:', '*'].includes(source),
        `${route} permits unrestricted scripts through ${source}`);
    }
  }
  assert.deepEqual(directives.get('script-src-attr'), ["'none'"], `${route} permits inline event handlers`);
  assert.deepEqual(directives.get('frame-ancestors'), ["'none'"], `${route} permits framing`);

  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const [, attributes, content] = match;
    const type = attributes.match(/\btype="([^"]*)"/)?.[1] ?? '';
    if (type && !['module', 'text/javascript', 'application/javascript'].includes(type)) continue;
    const src = attributes.match(/\bsrc="([^"]*)"/)?.[1];
    if (src) {
      assert.ok(src.startsWith('/') && !src.startsWith('//'), `${route} loads an external script: ${src}`);
    } else {
      // ClientRouter injects a data: module when it encounters an inline module.
      assert.notEqual(type, 'module', `${route} has a module incompatible with this CSP`);
      const hash = `'sha256-${createHash('sha256').update(content).digest('base64')}'`;
      assert.ok(scriptSources.includes(hash), `${route} has an unauthorized inline script`);
    }
  }

  for (const [, href] of html.matchAll(/href="(\/(?:en|pt-br)\/articles\/[^"#?]+)"/g)) {
    routes.add(href);
  }
}

console.log(`CSP verified on ${routes.size} production pages, including all ${staticPolicies.size} project pages.`);
