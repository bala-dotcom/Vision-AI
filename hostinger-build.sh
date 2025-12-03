#!/bin/bash
# Build script for Hostinger deployment
# This script will be run automatically by Hostinger after git pull

echo "🚀 Starting build process..."

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed!"
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ npm install failed!"
    exit 1
fi

# Build frontend
echo "🔨 Building frontend..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo "❌ dist folder not found after build!"
    exit 1
fi

echo "✅ Build completed successfully!"

# Copy files to public_html
echo "📤 Copying files to public_html..."
cp -r dist/* public_html/
cp .htaccess public_html/ 2>/dev/null || echo "⚠️  .htaccess not found, skipping..."

echo "✅ Deployment complete!"

