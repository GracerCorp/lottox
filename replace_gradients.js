const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir, callback) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      walk(p, callback);
    } else {
      callback(p);
    }
  }
}

let changedCount = 0;

walk(srcDir, (filepath) => {
  if (!filepath.endsWith('.tsx') && !filepath.endsWith('.ts')) return;

  let content = fs.readFileSync(filepath, 'utf-8');
  let newContent = content;

  // Dark mode background
  newContent = newContent.replace(
    /radial-gradient\(ellipse 80% 60% at 50% 0%, #1e40af 0%, #0f172a 60%, #020617 100%\)/g,
    'radial-gradient(ellipse 80% 60% at 50% 0%, #262626 0%, #171717 60%, #0a0a0a 100%)'
  );

  // Light mode background
  newContent = newContent.replace(
    /radial-gradient\(ellipse 80% 60% at 50% 0%, #bfdbfe 0%, #e0f2fe 40%, #f8fafc 100%\)/g,
    'radial-gradient(ellipse 80% 60% at 50% 0%, #fef3c7 0%, #f5f5f5 40%, #ffffff 100%)'
  );

  // Soft glow - dark
  newContent = newContent.replace(
    /radial-gradient\(ellipse 55% 40% at 50% 15%, rgba\(59,130,246,0.25\) 0%, transparent 70%\)/g,
    'radial-gradient(ellipse 55% 40% at 50% 15%, rgba(212,175,55,0.15) 0%, transparent 70%)'
  );

  newContent = newContent.replace(
    /radial-gradient\(ellipse 55% 40% at 50% 20%, rgba\(59,130,246,0.35\) 0%, transparent 70%\)/g,
    'radial-gradient(ellipse 55% 40% at 50% 20%, rgba(212,175,55,0.15) 0%, transparent 70%)'
  );

  // Soft glow - light
  newContent = newContent.replace(
    /radial-gradient\(ellipse 55% 40% at 50% 15%, rgba\(99,179,237,0.35\) 0%, transparent 70%\)/g,
    'radial-gradient(ellipse 55% 40% at 50% 15%, rgba(223,177,41,0.15) 0%, transparent 70%)'
  );

  // Layout themeColor dark
  newContent = newContent.replace(
    /{ media: "\\(prefers-color-scheme: dark\\)", color: "#060b1a" }/g,
    '{ media: "(prefers-color-scheme: dark)", color: "#0a0a0a" }'
  );

  // Bottom fade dark
  newContent = newContent.replace(
    /rgba\(2,6,23,0\.85\)/g,
    'rgba(10,10,10,0.85)'
  );

  // Bottom fade light
  newContent = newContent.replace(
    /rgba\(240,249,255,0\.85\)/g,
    'rgba(255,255,255,0.85)'
  );

  // Flare beams
  if (filepath.includes('BackgroundFlare.tsx')) {
    newContent = newContent.replace(
      /from-blue-400\/20 via-cyan-400\/5 dark:from-blue-500\/30 dark:via-cyan-400\/10/g,
      'from-gold-400/20 via-gold-300/5 dark:from-gold-500/30 dark:via-gold-400/10'
    );
    newContent = newContent.replace(
      /from-indigo-400\/20 via-violet-400\/5 dark:from-indigo-500\/30 dark:via-violet-400\/10/g,
      'from-amber-400/20 via-orange-400/5 dark:from-amber-500/30 dark:via-amber-400/10'
    );
    newContent = newContent.replace(
      /from-blue-500\/10 dark:from-blue-900\/40/g,
      'from-gold-600/10 dark:from-gold-700/30'
    );
  }

  if (content !== newContent) {
    fs.writeFileSync(filepath, newContent, 'utf-8');
    console.log(`Updated ${filepath}`);
    changedCount++;
  }
});

console.log(`Done! Replaced gradient themes in ${changedCount} files.`);
