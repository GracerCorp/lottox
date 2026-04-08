/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");

function replaceThemeClass(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = dir + "/" + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      replaceThemeClass(file);
    } else if (file.endsWith(".tsx") || file.endsWith(".ts") || file.endsWith(".css")) {
      const originalContent = fs.readFileSync(file, "utf8");
      // globally replacing navy with neutral
      const newContent = originalContent.replace(/navy-/g, "neutral-");
      if (originalContent !== newContent) {
        fs.writeFileSync(file, newContent, "utf8");
        console.log(`Updated theme in ${file}`);
      }
    }
  });
}

replaceThemeClass("src");
