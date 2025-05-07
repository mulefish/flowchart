const fs = require('fs');
const path = require('path');

// ✅ STARTING POINT - your project root
const rootDir = path.resolve("C:\\Users\\squar\\telos\\tsapre.desktop\\telos\\apps\\twe\\src");

// Entry points to exclude from orphan detection
const entryFiles = ['main.js', 'main.ts', 'App.vue'];

const allFiles = new Set();
const importedFiles = new Set();

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (let file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (/\.(js|ts|vue)$/.test(file)) {
      const relativePath = path.relative(rootDir, fullPath);
      allFiles.add(relativePath);
      scanImports(fullPath);
    }
  }
}

function scanImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const importRegex = /(?:import|require)\s*(?:["'\(]\s*([^"'\)\s]+)\s*["'\)])/g;
  let match;

  while ((match = importRegex.exec(content))) {
    let importPath = match[1];

    // Skip node_modules or external imports
    if (importPath.startsWith('.') || importPath.startsWith('/')) {
      let resolvedPath = resolveImport(filePath, importPath);
      if (resolvedPath) {
        const relPath = path.relative(rootDir, resolvedPath);
        importedFiles.add(relPath);
      }
    }
  }
}

function resolveImport(fromFile, importPath) {
  const dir = path.dirname(fromFile);
  const tryPaths = [
    path.resolve(dir, importPath),
    path.resolve(dir, importPath + '.js'),
    path.resolve(dir, importPath + '.ts'),
    path.resolve(dir, importPath + '.vue'),
    path.resolve(dir, importPath, 'index.js'),
    path.resolve(dir, importPath, 'index.ts'),
    path.resolve(dir, importPath, 'index.vue'),
  ];
  for (const p of tryPaths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

// Run scan
walk(rootDir);

const entryPaths = new Set(entryFiles.map(f => path.normalize(f)));
const orphans = [...allFiles].filter(
  f => !importedFiles.has(f) && !entryPaths.has(f)
);

// Output orphaned files
console.log('\n=== Orphan Files ===');
orphans.forEach(f => console.log(f));
