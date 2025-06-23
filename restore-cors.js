#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔄 Restoring original CORS configuration...');

// Find the expo middleware file
const nodeModulesPath = path.join(__dirname, 'node_modules');
const expoPath = path.join(nodeModulesPath, '@expo');

if (!fs.existsSync(expoPath)) {
  console.log('❌ Expo not found in node_modules');
  process.exit(1);
}

// Look for backup files in different possible locations
const possiblePaths = [
  path.join(expoPath, 'dev-server', 'src', 'middleware', 'cors.ts'),
  path.join(expoPath, 'dev-server', 'lib', 'middleware', 'cors.js'),
  path.join(expoPath, 'cli', 'src', 'middleware', 'cors.ts'),
  path.join(expoPath, 'cli', 'lib', 'middleware', 'cors.js'),
];

let restoredCount = 0;

for (const filePath of possiblePaths) {
  const backupPath = filePath + '.backup';
  
  if (fs.existsSync(backupPath)) {
    console.log(`📁 Restoring: ${filePath}`);
    fs.copyFileSync(backupPath, filePath);
    fs.unlinkSync(backupPath);
    restoredCount++;
  }
}

// Also restore dev server files if they were patched
const devServerPaths = [
  path.join(expoPath, 'dev-server', 'src', 'DevServer.ts'),
  path.join(expoPath, 'dev-server', 'lib', 'DevServer.js'),
];

for (const devServerPath of devServerPaths) {
  const backupPath = devServerPath + '.backup';
  
  if (fs.existsSync(backupPath)) {
    console.log(`📁 Restoring dev server: ${devServerPath}`);
    fs.copyFileSync(backupPath, devServerPath);
    fs.unlinkSync(backupPath);
    restoredCount++;
  }
}

if (restoredCount > 0) {
  console.log(`✅ Restored ${restoredCount} files to original state`);
} else {
  console.log('ℹ️  No backup files found to restore');
}

console.log('🎉 CORS configuration restored!'); 