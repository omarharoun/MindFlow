#!/bin/bash

echo "🚀 Deploying MindFlow to Netlify..."
echo "=================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the MindFlow directory."
    exit 1
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist
rm -rf .expo

# Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Build for web
echo "🔨 Building for web..."
npm run build:web

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Error: Build failed. dist directory not found."
    exit 1
fi

echo "✅ Build completed successfully!"
echo "📁 Build output: dist/"
echo ""
echo "🌐 To deploy to Netlify:"
echo "1. Go to https://app.netlify.com"
echo "2. Drag and drop the 'dist' folder"
echo "3. Or connect your GitHub repository"
echo ""
echo "🔗 Or use Netlify CLI:"
echo "npm install -g netlify-cli"
echo "netlify deploy --dir=dist --prod" 