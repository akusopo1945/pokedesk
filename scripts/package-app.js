const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const version = require('../package.json').version;
const distDir = path.join(__dirname, '..', 'dist-installer');

console.log(`\n=== PokeDesk Package Script v${version} ===\n`);

// Step 1: Check if portable build exists
const portableDir = path.join(distDir, 'win-unpacked');
if (!fs.existsSync(portableDir)) {
  console.error('ERROR: win-unpacked not found. Run "pnpm run build:portable" first.');
  process.exit(1);
}

// Step 2: Compress to 7z
const archiveName = `PokeDesk-${version}.7z`;
const archivePath = path.join(distDir, archiveName);

console.log(`Step 1: Compressing to ${archiveName}...`);

try {
  // Try 7z from PATH
  execSync(`7z a -t7z -mx=9 "${archivePath}" "${portableDir}\\*"`, { stdio: 'inherit' });
} catch {
  try {
    // Try 7za from node_modules
    const sevenZipBin = require('7zip-bin');
    const binPath = sevenZipBin.path7za;
    execSync(`"${binPath}" a -t7z -mx=9 "${archivePath}" "${portableDir}\\*"`, { stdio: 'inherit' });
  } catch {
    console.error('ERROR: 7z not found. Install 7-Zip or add 7z to PATH.');
    process.exit(1);
  }
}

const stats = fs.statSync(archivePath);
const sizeMB = (stats.size / 1024 / 1024).toFixed(2);

console.log(`\nDone! Archive: ${archivePath} (${sizeMB} MB)`);

// Step 3: Print instructions
console.log(`
=== NEXT STEPS ===

1. Upload ${archiveName} ke GitHub Releases:
   - Buka: https://github.com/pokedesk/pokedesk/releases/new
   - Tag: v${version}
   - Title: PokeDesk v${version}
   - Upload file: ${archivePath}
   - Centang "Pre-release" jika beta, jangan centang jika stable
   - Publish release

2. Upload ${archiveName} ke Google Drive (opsional, untuk fallback):
   - Upload ke Google Drive
   - Set sharing ke "Anyone with link"
   - Copy file ID dari URL
   - Update version.json dengan URL Google Drive

3. Update version.json:
   - Edit version.json di root project
   - Update downloadUrls.googleDrive jika pakai Google Drive
   - Commit + push

4. Build web installer (opsional):
   - Install NSIS: https://nsis.sourceforge.io/
   - Copy ${archivePath} ke folder installer/
   - Jalankan: makensis installer/web-installer.nsi
   - Output: installer/PokeDesk-Setup.exe

`);
