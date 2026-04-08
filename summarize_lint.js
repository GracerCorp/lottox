/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('eslint_errors.json', 'utf8'));

const errorsByRule = {};

data.forEach(file => {
  file.messages.forEach(msg => {
    const rule = msg.ruleId || 'unknown';
    if (!errorsByRule[rule]) {
      errorsByRule[rule] = [];
    }
    errorsByRule[rule].push({
      file: file.filePath.replace('/Users/kvivek/Documents/lottox/', ''),
      line: msg.line,
      col: msg.column,
      message: msg.message
    });
  });
});

for (const [rule, errors] of Object.entries(errorsByRule)) {
  console.log(`\n=== Rule: ${rule} (${errors.length} errors) ===`);
  const files = {};
  errors.forEach(e => {
    if (!files[e.file]) files[e.file] = [];
    files[e.file].push(e);
  });
  
  for (const [file, fileErrors] of Object.entries(files)) {
     console.log(`  File: ${file} (${fileErrors.length} errors)`);
     // Just print the first 2-3 to get an idea
     fileErrors.slice(0, 3).forEach(e => {
       console.log(`    Line ${e.line}:${e.col} - ${e.message}`);
     });
     if (fileErrors.length > 3) console.log(`    ... and ${fileErrors.length - 3} more`);
  }
}
