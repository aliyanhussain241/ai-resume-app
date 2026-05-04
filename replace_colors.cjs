const fs = require('fs');

const colors = {
  'gray-900': '#111827',
  'gray-800': '#1f2937',
  'gray-700': '#374151',
  'gray-600': '#4b5563',
  'gray-500': '#6b7280',
  'gray-400': '#9ca3af',
  'gray-300': '#d1d5db',
  'gray-200': '#e5e7eb',
  'gray-100': '#f3f4f6',
  'gray-50': '#f9fafb',
  'red-50': '#fef2f2',
  'red-600': '#dc2626',
  'red-500': '#ef4444'
};

function processFile(filePath) {
  let file = fs.readFileSync(filePath, 'utf8');

  for (const [key, val] of Object.entries(colors)) {
    file = file.replace(new RegExp(`text-${key}`, 'g'), `text-[${val}]`);
    file = file.replace(new RegExp(`bg-${key}`, 'g'), `bg-[${val}]`);
    file = file.replace(new RegExp(`border-${key}`, 'g'), `border-[${val}]`);
    file = file.replace(new RegExp(`ring-${key}`, 'g'), `ring-[${val}]`);
  }

  fs.writeFileSync(filePath, file, 'utf8');
}

processFile('src/App.tsx');
console.log('Replaced colors successfully');
