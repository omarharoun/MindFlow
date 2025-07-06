#!/bin/bash

echo "🧹 Cleaning MindFlow project..."
echo "=================================="

# Remove node_modules and lock files
echo "📦 Removing existing node_modules and lock files..."
rm -rf node_modules
rm -f package-lock.json
rm -f yarn.lock

# Clear cache
echo "🗑️  Clearing cache..."
npx expo install --fix
npm cache clean --force

# Install dependencies
echo "📥 Installing dependencies..."
npm install

# Install expo dependencies
echo "📱 Installing Expo dependencies..."
npx expo install

echo "✅ Clean installation complete!"
echo "🚀 You can now run: npm start" 