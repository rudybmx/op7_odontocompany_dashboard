const fs = require('fs');
const path = require('path');
const file = fs.readFileSync('src/lib/contexto-layout.tsx', 'utf8');

let newFile = file;

// Updated regex to properly match spaces and optional rota property
const regex = /\{([^}]*?)rota:\s*['"]([^'"]+)['"]([^}]*?)\}/g;
let match;
while ((match = regex.exec(file)) !== null) {
  const rota = match[2];
  
  // Check if file exists and has PaginaEmConstrucao
  const pagePath = path.join('src', 'app', '(plataforma)', rota, 'page.tsx');
  let hasEmConstrucao = false;
  if (fs.existsSync(pagePath)) {
    const pageContent = fs.readFileSync(pagePath, 'utf8');
    if (pageContent.includes('PaginaEmConstrucao')) {
      hasEmConstrucao = true;
    }
  } else {
    // Also consider it em construcao if it doesn't exist
    hasEmConstrucao = true;
  }
  
  if (hasEmConstrucao) {
    const orig = match[0];
    const replacement = orig.replace(/,\s*rota:\s*['"][^'"]+['"]/, '');
    newFile = newFile.replace(orig, replacement);
  }
}

fs.writeFileSync('src/lib/contexto-layout.tsx', newFile);
console.log('Done!');
