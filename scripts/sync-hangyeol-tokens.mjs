import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const pkg = path.join(root, 'node_modules/@orderthan31/hangyeol-core');
const source = readFileSync(path.join(pkg, 'payload/source/foundation/theme.css'), 'utf8');
const hash = createHash('sha256').update(source).digest('hex');
// Preserve canonical CSS selectors and declarations verbatim. Only omit the
// Tailwind @theme utility registration, because this host has no Tailwind adapter.
const css = source.slice(source.indexOf('@layer base'));
mkdirSync(path.join(root, 'src/theme'), { recursive: true });
writeFileSync(path.join(root, 'src/theme/hangyeol-tokens.css'), `/* Generated canonical token-only consumption, not supported source installation.\n * @orderthan31/hangyeol-core@0.0.1 foundation/theme.css SHA256 ${hash}\n */\n${css}`);
const assets = ['Pretendard-Regular.woff2', 'Pretendard-Medium.woff2', 'Pretendard-SemiBold.woff2', 'Pretendard-Bold.woff2', 'LICENSE', 'provenance.json'];
mkdirSync(path.join(root, 'public/fonts/hangyeol'), { recursive: true });
const hashes = {};
for (const name of assets) {
 const input = path.join(pkg, 'payload/assets', name);
 copyFileSync(input, path.join(root, 'public/fonts/hangyeol', name));
 hashes[name] = createHash('sha256').update(readFileSync(input)).digest('hex');
}
writeFileSync(path.join(root, 'src/theme/provenance.json'), JSON.stringify({ package: '@orderthan31/hangyeol-core', version: '0.0.1', mode: 'canonical-token-only', sourceSha256: hash, omitted: 'Tailwind @theme utility registration only; canonical @layer base blocks preserved verbatim', assetSha256: hashes }, null, 2) + '\n');
console.log(JSON.stringify({ mode: 'canonical-token-only', sourceSha256: hash, copiedAssets: assets.length }, null, 2));
