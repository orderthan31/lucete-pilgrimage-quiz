import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(resolve(process.cwd(), path));
const html = read('index.html').toString('utf8');
const document = new DOMParser().parseFromString(html, 'text/html');
const origin = 'https://lucete-pilgrimage-quiz.vercel.app';
const meta = (key: string, attribute = 'property') => {
  const elements = document.head.querySelectorAll(`meta[${attribute}="${key}"]`);
  expect(elements, `Exactly one ${key}`).toHaveLength(1);
  return elements[0].getAttribute('content') ?? '';
};
const pngSize = (bytes: Buffer) => {
  expect(bytes.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
  return [bytes.readUInt32BE(16), bytes.readUInt32BE(20)];
};
const jpegSize = (bytes: Buffer) => {
  expect(bytes.readUInt16BE(0)).toBe(0xffd8);
  let offset = 2;
  while (offset < bytes.length) {
    expect(bytes[offset]).toBe(0xff);
    const marker = bytes[offset + 1];
    const length = bytes.readUInt16BE(offset + 2);
    if ([0xc0, 0xc1, 0xc2].includes(marker)) {
      expect(bytes[offset + 9]).toBe(3); // RGB, no CMYK sharing surprises.
      return [bytes.readUInt16BE(offset + 7), bytes.readUInt16BE(offset + 5)];
    }
    offset += length + 2;
  }
  throw new Error('JPEG frame not found');
};

describe('static social sharing contract', () => {
  it('provides Korean title, description and one production canonical without JavaScript', () => {
    expect(document.documentElement.lang).toBe('ko');
    expect(document.title).toBe('2026 루체테 성지순례 퀴즈 | 영통영덕성당');
    expect(meta('description', 'name')).toContain('영통영덕성당 청년회 루체테');
    expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(`${origin}/`);
    expect(meta('application-name', 'name')).toContain('루체테');
    expect(meta('theme-color', 'name')).toBe('#0F172A');
  });

  it('defines complete Open Graph values and a public absolute JPEG URL', () => {
    expect(meta('og:type')).toBe('website');
    expect(meta('og:locale')).toBe('ko_KR');
    expect(meta('og:title')).toBe('2026 루체테 성지순례 퀴즈');
    expect(meta('og:site_name')).toBe('루체테 성지순례');
    expect(meta('og:description')).toBe(meta('description', 'name'));
    expect(meta('og:url')).toBe(`${origin}/`);
    expect(meta('og:image')).toBe(`${origin}/social/lucete-pilgrimage-2026-og-v1.jpg`);
    expect(meta('og:image:secure_url')).toBe(meta('og:image'));
    expect(meta('og:image:type')).toBe('image/jpeg');
    expect(meta('og:image:width')).toBe('1200');
    expect(meta('og:image:height')).toBe('630');
    expect(meta('og:image:alt')).toContain('루체테 CI');
    const image = read(`public${new URL(meta('og:image')).pathname}`);
    expect(jpegSize(image)).toEqual([1200, 630]);
    expect(image.length).toBeLessThan(300_000);
  });

  it('provides a separate 2:1 Twitter large-image card without invented accounts', () => {
    expect(meta('twitter:card', 'name')).toBe('summary_large_image');
    expect(meta('twitter:title', 'name')).toBe(meta('og:title'));
    expect(meta('twitter:description', 'name')).toBe(meta('og:description'));
    expect(meta('twitter:image', 'name')).toBe(`${origin}/social/lucete-pilgrimage-2026-twitter-v1.jpg`);
    expect(meta('twitter:image:alt', 'name')).toContain('루체테 CI');
    expect(document.querySelector('meta[name="twitter:site"]')).toBeNull();
    expect(document.querySelector('meta[name="twitter:creator"]')).toBeNull();
    expect(jpegSize(read(`public${new URL(meta('twitter:image', 'name')).pathname}`))).toEqual([1200, 600]);
  });

  it('ships CI-derived browser, Apple and application icons with correct sizes', () => {
    const apple = document.querySelector('link[rel="apple-touch-icon"]');
    expect(apple?.getAttribute('sizes')).toBe('180x180');
    expect(pngSize(read(`public${apple?.getAttribute('href')}`))).toEqual([180, 180]);
    const png = document.querySelector('link[rel="icon"][type="image/png"]');
    expect(pngSize(read(`public${png?.getAttribute('href')}`))).toEqual([32, 32]);
    const ico = read('public/favicon.ico');
    expect(ico.readUInt16LE(0)).toBe(0);
    expect(ico.readUInt16LE(2)).toBe(1);
    expect(ico.readUInt16LE(4)).toBe(4);
    const manifestLink = document.querySelector('link[rel="manifest"]');
    const manifest = JSON.parse(read(`public${manifestLink?.getAttribute('href')}`).toString());
    expect(manifest.lang).toBe('ko-KR');
    expect(manifest.display).toBe('browser');
    expect(manifest.start_url).toBe('/');
    for (const icon of manifest.icons) {
      expect(pngSize(read(`public${icon.src}`)).join('x')).toBe(icon.sizes);
      expect(icon.purpose).toBe('any');
    }
    expect(read('public/favicon.svg').toString()).toContain('<image');
    expect(read('public/favicon.svg').toString()).not.toContain('#173e35');
  });

  it('keeps the original screenshot CI intact and verifies every generated asset hash', () => {
    const ledger = JSON.parse(read('public/social/assets-manifest.json').toString());
    const source = read('public/brand/lucete-profile.png');
    expect(createHash('sha256').update(source).digest('hex')).toBe('5d6dc81b64c07161b1c418f26939a6ed35311235a3fefed2a849030c7ccf51ed');
    expect(ledger.source.sha256).toBe(createHash('sha256').update(source).digest('hex'));
    expect(ledger.source.is_vector_master).toBe(false);
    for (const asset of ledger.assets) {
      const bytes = read(`public${asset.path}`);
      expect(bytes.length, asset.path).toBe(asset.bytes);
      expect(createHash('sha256').update(bytes).digest('hex'), asset.path).toBe(asset.sha256);
    }
    expect(pngSize(read('public/social/lucete-pilgrimage-2026-og-v1.png'))).toEqual([1200, 630]);
  });
});
