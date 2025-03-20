import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the dist directory
const distDir = path.join(__dirname, 'dist');
const indexPath = path.join(distDir, 'index.html');

// Read the index.html file
let html = fs.readFileSync(indexPath, 'utf8');
const $ = cheerio.load(html);

// Process script tags
$('script[src]').each(function() {
  const src = $(this).attr('src');
  
  // Skip external scripts like Google Maps
  if (src.startsWith('http')) {
    return;
  }
  
  const scriptPath = path.join(distDir, src.startsWith('/') ? src.slice(1) : src);
  
  try {
    if (fs.existsSync(scriptPath)) {
      const scriptContent = fs.readFileSync(scriptPath, 'utf8');
      $(this).removeAttr('src');
      $(this).text(scriptContent);
      console.log(`Inlined script: ${src}`);
    } else {
      console.warn(`Script file not found: ${scriptPath}`);
    }
  } catch (error) {
    console.error(`Error processing script ${src}:`, error);
  }
});

// Process link tags (CSS)
$('link[rel="stylesheet"]').each(function() {
  const href = $(this).attr('href');
  const cssPath = path.join(distDir, href.startsWith('/') ? href.slice(1) : href);
  
  try {
    if (fs.existsSync(cssPath)) {
      const cssContent = fs.readFileSync(cssPath, 'utf8');
      const styleTag = $('<style></style>');
      styleTag.text(cssContent);
      $(this).replaceWith(styleTag);
      console.log(`Inlined CSS: ${href}`);
    } else {
      console.warn(`CSS file not found: ${cssPath}`);
    }
  } catch (error) {
    console.error(`Error processing CSS ${href}:`, error);
  }
});

// Save the modified HTML
fs.writeFileSync(indexPath, $.html());
console.log('Assets inlined successfully!'); 