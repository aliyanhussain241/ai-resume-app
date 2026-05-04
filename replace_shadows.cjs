const fs = require('fs');

const shadowMap = {
  'shadow-sm': '[box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)]',
  'shadow-md': '[box-shadow:0_4px_6px_-1px_rgba(0,0,0,0.1)]',
  'shadow-lg': '[box-shadow:0_10px_15px_-3px_rgba(0,0,0,0.1)]',
  'shadow-xl': '[box-shadow:0_20px_25px_-5px_rgba(0,0,0,0.1)]',
  'shadow-none': '[box-shadow:none]',
  'shadow ': '[box-shadow:0_1px_3px_0_rgba(0,0,0,0.1)] '
};

function processFile(filePath) {
  let file = fs.readFileSync(filePath, 'utf8');

  for (const [key, val] of Object.entries(shadowMap)) {
    // Add spaces to be safe about word boundaries, or use regex
    file = file.replace(new RegExp(`\\b${key}\\b`, 'g'), val);
  }

  // Also replace ring-1 ring-gray-900/5 in App.tsx specifically
  file = file.replace(/ring-1 ring-gray-900\/5/g, '[box-shadow:0_0_0_1px_rgba(17,24,39,0.05)]');

  fs.writeFileSync(filePath, file, 'utf8');
}

processFile('src/components/ResumePreview.tsx');
processFile('src/App.tsx');
console.log('Replaced shadows successfully');
