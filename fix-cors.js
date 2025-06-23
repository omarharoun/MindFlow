#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Applying aggressive CORS fix...');

// Target the actual CORS middleware file
const corsFile = path.join(__dirname, 'node_modules/@expo/cli/build/src/start/server/middleware/CorsMiddleware.js');

if (!fs.existsSync(corsFile)) {
  console.log('❌ CORS middleware file not found');
  console.log('Expected location:', corsFile);
  process.exit(1);
}

console.log(`📁 Found CORS file: ${corsFile}`);

// Read the current content
const content = fs.readFileSync(corsFile, 'utf8');

// Create backup
const backupPath = corsFile + '.backup';
if (!fs.existsSync(backupPath)) {
  fs.writeFileSync(backupPath, content);
  console.log(`💾 Created backup: ${backupPath}`);
}

// Apply aggressive CORS fix - replace the entire middleware function
const modifiedContent = content.replace(
  /function\s+CorsMiddleware[^{]*{[\s\S]*?}/g,
  `function CorsMiddleware(req, res, next) {
  // Allow all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, X-File-Name');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
}`
);

// Write the modified content
fs.writeFileSync(corsFile, modifiedContent);
console.log('✅ Applied aggressive CORS fix to CorsMiddleware.js');

// Also patch the main dev server file if it exists
const devServerPaths = [
  path.join(__dirname, 'node_modules/@expo/dev-server/src/DevServer.ts'),
  path.join(__dirname, 'node_modules/@expo/dev-server/lib/DevServer.js'),
];

for (const devServerPath of devServerPaths) {
  if (fs.existsSync(devServerPath)) {
    console.log(`🔧 Patching dev server: ${devServerPath}`);
    let devServerContent = fs.readFileSync(devServerPath, 'utf8');
    
    // Add CORS headers to all responses
    if (devServerPath.endsWith('.ts')) {
      devServerContent = devServerContent.replace(
        /(app\.use\([^)]*\))/g,
        `$1
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, X-File-Name');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');
  next();
});`
      );
    } else {
      devServerContent = devServerContent.replace(
        /(app\.use\([^)]*\))/g,
        `$1
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, X-File-Name');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');
  next();
});`
      );
    }
    
    // Create backup for dev server
    const devServerBackup = devServerPath + '.backup';
    if (!fs.existsSync(devServerBackup)) {
      fs.writeFileSync(devServerBackup, devServerContent);
      console.log(`💾 Created dev server backup: ${devServerBackup}`);
    }
    
    fs.writeFileSync(devServerPath, devServerContent);
    console.log('✅ Patched dev server');
  }
}

console.log('🎉 CORS fix applied successfully!');
console.log('🚀 You can now start Expo with: npm start'); 