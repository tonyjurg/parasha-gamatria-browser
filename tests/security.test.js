import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseSearchValue, shebanqUrl} from '../site/core.js';

test('numeric searches accept only decimal nonnegative safe integers', () => {
  for (const [input, expected] of [['0', 0], ['26', 26], [' 913 ', 913], ['00026', 26],
    [String(Number.MAX_SAFE_INTEGER), Number.MAX_SAFE_INTEGER]]) {
    assert.equal(parseSearchValue(input), expected);
  }
  for (const input of ['', ' ', '-1', '+1', '1.0', '1.5', '1e3', '0x10', 'Infinity', 'NaN',
    '9007199254740992', '26x', '<img src=x onerror=alert(1)>', null, undefined, 26]) {
    assert.equal(parseSearchValue(input), null, String(input));
  }
});

test('SHEBANQ destinations stay on the fixed HTTPS origin and encode parameters', () => {
  const book = 'Genesis"><script>alert(1)</script>';
  const url = new URL(shebanqUrl([book, 1, 1]));
  assert.equal(url.origin, 'https://shebanq.ancient-data.org');
  assert.equal(url.pathname, '/hebrew/text');
  assert.equal(url.searchParams.get('book'), book);
  const app = readFileSync(new URL('../site/app.js', import.meta.url), 'utf8');
  assert.match(app, /link\.target\s*=\s*['_"]_blank['_"]/);
  assert.match(app, /link\.rel\s*=\s*['_"]noopener noreferrer['_"]/);
});

test('both HTML pages enforce CSP before loading any resources', () => {
  for (const page of ['index.html', 'info.html']) {
    const html = readFileSync(new URL(`../site/${page}`, import.meta.url), 'utf8');
    const meta = html.match(/<meta http-equiv="Content-Security-Policy" content="([^"]+)">/);
    assert.ok(meta, `${page}: missing CSP`);
    assert.ok(meta.index < html.indexOf('<link'), `${page}: CSP must precede resources`);
    for (const directive of ["default-src 'self'", "script-src 'self'", "style-src 'self'",
      "img-src 'self'", "connect-src 'self'", "object-src 'none'", "base-uri 'none'", "form-action 'none'"]) {
      assert.ok(meta[1].split(';').map(value => value.trim()).includes(directive), `${page}: ${directive}`);
    }
    assert.doesNotMatch(meta[1], /unsafe-inline|unsafe-eval/);
  }
});
