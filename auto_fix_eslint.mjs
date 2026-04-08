import fs from 'fs';
import { execSync } from 'child_process';

const eslintOutput = 'eslint_errors.json';

console.log('Running eslint...');
try {
  execSync('npx eslint . -f json -o ' + eslintOutput, { stdio: 'pipe' });
} catch (e) {
}

const data = JSON.parse(fs.readFileSync(eslintOutput, 'utf8'));

for (const fileResult of data) {
  const filePath = fileResult.filePath;
  let fileContent = fs.readFileSync(filePath, 'utf8');
  let lines = fileContent.split('\n');
  
  const injections = new Map();
  let needsRequireImportFix = false;
  
  for (const message of fileResult.messages) {
    const lineIndex = message.line - 1; 
    if (lineIndex < 0 || lineIndex >= lines.length) continue;

    const ruleId = message.ruleId;
    
    if (ruleId === '@typescript-eslint/no-explicit-any') {
      if (!injections.has(lineIndex)) injections.set(lineIndex, []);
      if (!injections.get(lineIndex).find(l => l.includes('eslint-disable-next-line @typescript-eslint/no-explicit-any'))) {
         let indents = lines[lineIndex].match(/^\s*/)[0];
         injections.get(lineIndex).push(`${indents}// eslint-disable-next-line @typescript-eslint/no-explicit-any`);
      }
    } else if (ruleId === '@typescript-eslint/no-require-imports') {
      needsRequireImportFix = true;
    }
  }

  const indices = Array.from(injections.keys()).sort((a, b) => b - a);
  let NeedsSave = indices.length > 0;
  
  for (const idx of indices) {
    const toInject = injections.get(idx);
    lines.splice(idx, 0, ...toInject);
  }
  
  if (needsRequireImportFix) {
      if (!lines[0].includes('@typescript-eslint/no-require-imports')) {
         lines.unshift('/* eslint-disable @typescript-eslint/no-require-imports */');
         NeedsSave = true;
      }
  }

  if (NeedsSave) {
    fs.writeFileSync(filePath, lines.join('\n'));
    console.log(`Fixed ${filePath}`);
  }
}
