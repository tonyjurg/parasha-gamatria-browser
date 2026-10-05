import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';

test('browser and guide links work under a GitHub Pages project subdirectory', () => {
  const site = new URL('../site/', import.meta.url);
  const published = new URL('https://tonyjurg.github.io/parasha-gamatria-browser/');
  for (const page of ['index.html', 'info.html']) {
    const html = readFileSync(new URL(page, site), 'utf8');
    for (const [, reference] of html.matchAll(/(?:href|src)=["']([^"']+)["']/g)) {
      const target = new URL(reference.replaceAll('&amp;', '&'), new URL(page, published));
      if (target.origin !== published.origin) continue;
      assert.ok(target.pathname.startsWith(published.pathname), `${page}: ${reference} escapes the project`);
      const relative = target.pathname.slice(published.pathname.length);
      assert.ok(existsSync(new URL(relative, site)), `${page}: missing ${relative}`);
      if (reference.startsWith('#')) {
        assert.ok(html.includes(`id="${target.hash.slice(1)}"`), `${page}: missing anchor ${reference}`);
      }
    }
  }
});
test('both pages credit TJ Engineering with a bundled logo and safe external link', () => {
  const logo = readFileSync(new URL('../site/assets/tje-black.png', import.meta.url));
  assert.equal(logo.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  for (const page of ['index.html', 'info.html']) {
    const html = readFileSync(new URL(`../site/${page}`, import.meta.url), 'utf8');
    const footer = html.match(/<footer>[\s\S]*?<\/footer>/)?.[0];
    assert.ok(footer, `${page}: missing footer`);
    assert.match(footer, /href="https:\/\/github\.com\/TJ-engineering" target="_blank" rel="noopener noreferrer"/);
    assert.match(footer, /src="assets\/tje-black\.png" width="40" height="40" alt=""/);
    assert.match(footer, /a TJ Engineering project/);
  }
});
