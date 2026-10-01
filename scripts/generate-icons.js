import fs from 'fs';
import path from 'path';
import opentype from 'opentype.js';
import sharp from 'sharp';

// Load Playfair Display Bold
const ttfPath = '/tmp/PlayfairDisplay-Bold.ttf';
const buffer = fs.readFileSync(ttfPath);
const font = opentype.parse(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));

// Calculate metrics for "Bookiin"
// We want "Bookiin." to be horizontally centered and proportionally sized inside the squircle
// In IMG_1886.jpeg:
// The icon is a square squircle with dark outer frame and warm cream paper.
// "Bookiin." spans approximately 68-72% of the inner paper width.
const targetTextWidth = 330; // on a 512x512 canvas
const fontSize = 84;

// Get path for "Bookiin"
const glyphPath = font.getPath('Bookiin', 0, 0, fontSize);
const bbox = glyphPath.getBoundingBox();
const textWidth = bbox.x2 - bbox.x1;
const textHeight = bbox.y2 - bbox.y1;

// Period dimensions and position
const dotRadius = 7.5;
const dotSpacing = 8; // gap between 'n' and dot
const totalWidth = textWidth + dotSpacing + (dotRadius * 2);

// Center horizontally on 512 canvas
const startX = Math.round((512 - totalWidth) / 2 - bbox.x1);
// Center vertically on 512 canvas: baseline offset
// The cap height and baseline need to be optically centered
const baselineY = Math.round(256 + (textHeight / 2) - 4);

// Re-generate path at centered position
const centeredPath = font.getPath('Bookiin', startX, baselineY, fontSize);
const pathData = centeredPath.toPathData(2);

// Dot position: right after 'n' foot, aligned with baseline
const dotCenterX = Math.round(startX + bbox.x2 + dotSpacing + dotRadius);
const dotCenterY = Math.round(baselineY - dotRadius + 1);

console.log({
  textWidth,
  textHeight,
  totalWidth,
  startX,
  baselineY,
  dotCenterX,
  dotCenterY
});

// Build standard icon SVG (512x512)
// Matches IMG_1886.jpeg:
// - Outer soft shadow
// - Dark charcoal/matte black squircle rim (#211F1D / #181715)
// - Inner warm cream paper (#F6F4EB with subtle gradient)
// - Debossed "Bookiin" letterpress effect
// - Caramel gold dot (#C39D5C) with deboss
function generateStandardSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Outer bezel subtle lighting -->
    <linearGradient id="bezelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2D2A26" />
      <stop offset="50%" stop-color="#211F1D" />
      <stop offset="100%" stop-color="#141312" />
    </linearGradient>

    <!-- Bezel highlight rim -->
    <linearGradient id="bezelRim" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#4A4540" stop-opacity="0.6" />
      <stop offset="30%" stop-color="#35312C" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#0A0A09" stop-opacity="0.8" />
    </linearGradient>

    <!-- Cream paper luxurious background gradient -->
    <linearGradient id="paperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FAF8F2" />
      <stop offset="45%" stop-color="#F5F2E8" />
      <stop offset="100%" stop-color="#ECE7DC" />
    </linearGradient>

    <!-- Subtle inner paper shadow to create depth against bezel -->
    <linearGradient id="paperInnerShadow" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.12" />
      <stop offset="15%" stop-color="#000000" stop-opacity="0.03" />
      <stop offset="85%" stop-color="#FFFFFF" stop-opacity="0.05" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.4" />
    </linearGradient>

    <!-- Text deboss fill gradient: darker at the top recess -->
    <linearGradient id="textDeboss" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1E1A17" />
      <stop offset="30%" stop-color="#28231F" />
      <stop offset="100%" stop-color="#36302A" />
    </linearGradient>

    <!-- Gold dot fill gradient with deboss -->
    <linearGradient id="goldDotGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#9E7836" />
      <stop offset="40%" stop-color="#B8924E" />
      <stop offset="100%" stop-color="#D1AB6A" />
    </linearGradient>

    <!-- Soft drop shadow for icon on white presentation background -->
    <filter id="iconShadow" x="-10%" y="-10%" width="125%" height="125%">
      <feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#000000" flood-opacity="0.22" />
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#000000" flood-opacity="0.14" />
    </filter>

    <!-- Letterpress Deboss Filter for text: Top inner shadow + bottom edge highlight -->
    <filter id="letterpress" x="-15%" y="-15%" width="130%" height="130%">
      <!-- Bottom-right white bevel highlight -->
      <feDropShadow dx="0" dy="1.6" stdDeviation="0.8" flood-color="#FFFFFF" flood-opacity="0.85" />
      <!-- Dark deep recess shadow inside top edge -->
      <feDropShadow dx="0" dy="-1.8" stdDeviation="1.2" flood-color="#0B0908" flood-opacity="0.55" />
    </filter>

    <!-- Dot deboss filter -->
    <filter id="dotDeboss" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="1.4" stdDeviation="0.6" flood-color="#FFFFFF" flood-opacity="0.75" />
      <feDropShadow dx="0" dy="-1.5" stdDeviation="0.8" flood-color="#5E4314" flood-opacity="0.6" />
    </filter>

    <!-- Paper Grain Texture Pattern -->
    <filter id="paperGrain" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noise" />
      <feColorMatrix type="matrix" values="0 0 0 0 0.88  0 0 0 0 0.85  0 0 0 0 0.80  0 0 0 0.07 0" />
      <feBlend mode="multiply" in="SourceGraphic" />
    </filter>
  </defs>

  <!-- Canvas Backdrop (clean, slightly warm white) -->
  <rect width="512" height="512" fill="#FAF9F7" />

  <!-- Main Squircle Icon with Shadow -->
  <g filter="url(#iconShadow)">
    <!-- Outer Charcoal Bezel (Squircle) -->
    <rect x="54" y="54" width="404" height="404" rx="98" fill="url(#bezelGrad)" stroke="url(#bezelRim)" stroke-width="2" />

    <!-- Inner Cream Paper Surface -->
    <rect x="64" y="64" width="384" height="384" rx="88" fill="url(#paperGrad)" />

    <!-- Paper Texture & Border Vignette -->
    <rect x="64" y="64" width="384" height="384" rx="88" fill="url(#paperInnerShadow)" />
    <!-- Fine inner border rim -->
    <rect x="64" y="64" width="384" height="384" rx="88" fill="none" stroke="#211F1D" stroke-width="1.5" stroke-opacity="0.3" />

    <!-- Debossed "Bookiin" Typography -->
    <g filter="url(#letterpress)">
      <path d="${pathData}" fill="url(#textDeboss)" />
    </g>

    <!-- Debossed Warm Gold Dot "." -->
    <g filter="url(#dotDeboss)">
      <circle cx="${dotCenterX}" cy="${dotCenterY}" r="${dotRadius}" fill="url(#goldDotGrad)" />
      <!-- Subtle inner reflection on dot -->
      <circle cx="${dotCenterX - 1.5}" cy="${dotCenterY - 1.5}" r="${dotRadius * 0.45}" fill="#FFF4D6" fill-opacity="0.45" />
    </g>
  </g>
</svg>`;
}

// Build Maskable Icon SVG (512x512)
// For Android adaptive icons, background must be full bleed,
// and all essential elements must fit securely within the 80% circle (diameter 410px, radius 205px).
function generateMaskableSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="mBezelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2D2A26" />
      <stop offset="50%" stop-color="#211F1D" />
      <stop offset="100%" stop-color="#141312" />
    </linearGradient>

    <linearGradient id="mPaperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FAF8F2" />
      <stop offset="45%" stop-color="#F5F2E8" />
      <stop offset="100%" stop-color="#ECE7DC" />
    </linearGradient>

    <linearGradient id="mTextDeboss" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1E1A17" />
      <stop offset="30%" stop-color="#28231F" />
      <stop offset="100%" stop-color="#36302A" />
    </linearGradient>

    <linearGradient id="mGoldDotGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#9E7836" />
      <stop offset="40%" stop-color="#B8924E" />
      <stop offset="100%" stop-color="#D1AB6A" />
    </linearGradient>

    <filter id="mLetterpress" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="1.6" stdDeviation="0.8" flood-color="#FFFFFF" flood-opacity="0.85" />
      <feDropShadow dx="0" dy="-1.8" stdDeviation="1.2" flood-color="#0B0908" flood-opacity="0.55" />
    </filter>

    <filter id="mDotDeboss" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="1.4" stdDeviation="0.6" flood-color="#FFFFFF" flood-opacity="0.75" />
      <feDropShadow dx="0" dy="-1.5" stdDeviation="0.8" flood-color="#5E4314" flood-opacity="0.6" />
    </filter>
  </defs>

  <!-- Full-bleed Paper background so no borders are cut off when cropped into circle -->
  <rect width="512" height="512" fill="url(#mPaperGrad)" />

  <!-- Embedded Squircle Frame comfortably inside 80% safe zone (center: 256, radius 180) -->
  <rect x="76" y="76" width="360" height="360" rx="78" fill="none" stroke="url(#mBezelGrad)" stroke-width="12" opacity="0.9" />

  <!-- Inner fine line -->
  <rect x="86" y="86" width="340" height="340" rx="70" fill="none" stroke="#211F1D" stroke-width="1.5" stroke-opacity="0.25" />

  <!-- Debossed "Bookiin" Typography centered inside safe zone -->
  <g filter="url(#mLetterpress)">
    <path d="${pathData}" fill="url(#mTextDeboss)" />
  </g>

  <!-- Debossed Warm Gold Dot "." -->
  <g filter="url(#mDotDeboss)">
    <circle cx="${dotCenterX}" cy="${dotCenterY}" r="${dotRadius}" fill="url(#mGoldDotGrad)" />
    <circle cx="${dotCenterX - 1.5}" cy="${dotCenterY - 1.5}" r="${dotRadius * 0.45}" fill="#FFF4D6" fill-opacity="0.45" />
  </g>
</svg>`;
}

// Build Apple Touch Icon SVG (180x180)
// iOS automatically crops with squircle mask, so full bleed cream paper with bezel looks native and seamless
function generateAppleTouchSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="aBezelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2D2A26" />
      <stop offset="50%" stop-color="#211F1D" />
      <stop offset="100%" stop-color="#141312" />
    </linearGradient>

    <linearGradient id="aPaperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FAF8F2" />
      <stop offset="45%" stop-color="#F5F2E8" />
      <stop offset="100%" stop-color="#ECE7DC" />
    </linearGradient>

    <linearGradient id="aTextDeboss" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1E1A17" />
      <stop offset="30%" stop-color="#28231F" />
      <stop offset="100%" stop-color="#36302A" />
    </linearGradient>

    <linearGradient id="aGoldDotGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#9E7836" />
      <stop offset="40%" stop-color="#B8924E" />
      <stop offset="100%" stop-color="#D1AB6A" />
    </linearGradient>

    <filter id="aLetterpress" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="1.6" stdDeviation="0.8" flood-color="#FFFFFF" flood-opacity="0.85" />
      <feDropShadow dx="0" dy="-1.8" stdDeviation="1.2" flood-color="#0B0908" flood-opacity="0.55" />
    </filter>

    <filter id="aDotDeboss" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="1.4" stdDeviation="0.6" flood-color="#FFFFFF" flood-opacity="0.75" />
      <feDropShadow dx="0" dy="-1.5" stdDeviation="0.8" flood-color="#5E4314" flood-opacity="0.6" />
    </filter>
  </defs>

  <!-- Full-bleed paper background -->
  <rect width="512" height="512" fill="url(#aPaperGrad)" />

  <!-- Outer Charcoal Bezel border around canvas edge -->
  <rect x="0" y="0" width="512" height="512" fill="none" stroke="url(#aBezelGrad)" stroke-width="24" />
  <rect x="14" y="14" width="484" height="484" fill="none" stroke="#211F1D" stroke-width="2" stroke-opacity="0.4" />

  <!-- Debossed "Bookiin" Typography -->
  <g filter="url(#aLetterpress)">
    <path d="${pathData}" fill="url(#aTextDeboss)" />
  </g>

  <!-- Debossed Warm Gold Dot "." -->
  <g filter="url(#aDotDeboss)">
    <circle cx="${dotCenterX}" cy="${dotCenterY}" r="${dotRadius}" fill="url(#aGoldDotGrad)" />
    <circle cx="${dotCenterX - 1.5}" cy="${dotCenterY - 1.5}" r="${dotRadius * 0.45}" fill="#FFF4D6" fill-opacity="0.45" />
  </g>
</svg>`;
}

async function run() {
  const stdSvg = generateStandardSvg();
  const maskableSvg = generateMaskableSvg();
  const appleSvg = generateAppleTouchSvg();

  // Write SVGs
  fs.writeFileSync('public/icon.svg', stdSvg);
  fs.writeFileSync('public/pwa-maskable-512x512.svg', maskableSvg);
  console.log('Saved SVG files.');

  // Generate PNGs with sharp
  // 1. pwa-512x512.png
  await sharp(Buffer.from(stdSvg))
    .resize(512, 512)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile('public/pwa-512x512.png');
  console.log('Generated public/pwa-512x512.png');

  // 2. pwa-192x192.png
  await sharp(Buffer.from(stdSvg))
    .resize(192, 192)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile('public/pwa-192x192.png');
  console.log('Generated public/pwa-192x192.png');

  // 3. pwa-maskable-512x512.png
  await sharp(Buffer.from(maskableSvg))
    .resize(512, 512)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile('public/pwa-maskable-512x512.png');
  console.log('Generated public/pwa-maskable-512x512.png');

  // 4. apple-touch-icon.png (180x180)
  await sharp(Buffer.from(appleSvg))
    .resize(180, 180)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile('public/apple-touch-icon.png');
  console.log('Generated public/apple-touch-icon.png');

  console.log('All icons generated successfully!');
}

run().catch((e) => {
  console.error('Error generating icons:', e);
  process.exit(1);
});
