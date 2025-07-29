// Simple favicon generator script
// This script creates basic favicon files for the FashionHub app

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create SVG favicon content
const createSVGContent = (size) => {
  const fontSize = Math.max(8, size / 4);
  const circleRadius = size / 4;
  
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${size/8}" fill="#3b82f6"/>
  <circle cx="${size/2}" cy="${size/2}" r="${circleRadius}" fill="white"/>
  <text x="${size/2}" y="${size/2 + fontSize/3}" text-anchor="middle" fill="#3b82f6" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold">F</text>
</svg>`;
};

// Create favicon files
const faviconFiles = [
  { name: 'favicon-16x16.png', size: 16, type: 'svg' },
  { name: 'favicon-32x32.png', size: 32, type: 'svg' },
  { name: 'apple-touch-icon.png', size: 180, type: 'svg' },
  { name: 'android-chrome-192x192.png', size: 192, type: 'svg' },
  { name: 'android-chrome-512x512.png', size: 512, type: 'svg' }
];

console.log('🔧 Generating favicon files...');

try {
  faviconFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', 'public', file.name);
    
    if (file.type === 'svg') {
      // Create SVG content
      const svgContent = createSVGContent(file.size);
      fs.writeFileSync(filePath, svgContent);
      console.log(`✅ Created ${file.name} (${file.size}x${file.size} SVG)`);
    }
  });

  // Also create a main favicon.ico reference
  const mainFaviconPath = path.join(__dirname, '..', 'public', 'favicon.ico');
  const svgContent = createSVGContent(32);
  fs.writeFileSync(mainFaviconPath, svgContent);
  console.log(`✅ Created favicon.ico (32x32 SVG)`);

  console.log('\n🎉 All favicon files created successfully!');
  console.log('📝 Note: These are SVG-based favicons that work in modern browsers.');
  console.log('For production, create professional PNG favicons using:');
  console.log('- https://realfavicongenerator.net/');
  console.log('- https://favicon.io/');
  console.log('- Professional design tools');
  
} catch (error) {
  console.error('❌ Error creating favicon files:', error.message);
  console.log('\n📝 Creating simple placeholder files instead...');
  
  // Fallback: create simple text files
  faviconFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', 'public', file.name);
    
    // Create a simple text-based placeholder
    const placeholderContent = `<!-- Placeholder favicon for ${file.name} -->`;
    fs.writeFileSync(filePath, placeholderContent);
    console.log(`✅ Created ${file.name} (placeholder)`);
  });
} 