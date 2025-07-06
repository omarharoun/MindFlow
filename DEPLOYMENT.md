# MindFlow Deployment Guide

## 🚀 Deploy to Netlify

### Option 1: Automatic Deployment (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [Netlify](https://app.netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Set build settings:
     - Build command: `npm run build:web`
     - Publish directory: `dist`
   - Click "Deploy site"

### Option 2: Manual Deployment

1. **Build the project**
   ```bash
   cd MindFlow
   ./deploy.sh
   ```

2. **Deploy to Netlify**
   - Go to [Netlify](https://app.netlify.com)
   - Drag and drop the `dist` folder
   - Your site will be deployed automatically

### Option 3: Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build and deploy**
   ```bash
   cd MindFlow
   npm run build:web
   netlify deploy --dir=dist --prod
   ```

## 🔧 Configuration Files

- `netlify.toml` - Netlify configuration
- `package.json` - Build scripts
- `app.json` - Expo web configuration
- `webpack.config.js` - Web bundling configuration

## 📁 Build Output

The build process creates a `dist` directory containing:
- Static HTML files
- JavaScript bundles
- CSS files
- Assets (images, fonts, etc.)

## 🌐 Environment Variables

If you need to set environment variables in Netlify:
1. Go to Site settings > Environment variables
2. Add any required variables (e.g., API keys)

## 🔍 Troubleshooting

### Build Fails
- Check Node.js version (should be 18+)
- Run `npm install --legacy-peer-deps`
- Clear cache: `rm -rf node_modules package-lock.json`

### Runtime Errors
- Check browser console for errors
- Verify all dependencies are installed
- Test locally first: `npm run web`

### Deployment Issues
- Ensure `dist` directory exists
- Check Netlify build logs
- Verify `netlify.toml` configuration

## 📱 Mobile Deployment

For mobile app deployment:
- **iOS**: Use Expo Application Services (EAS)
- **Android**: Use Expo Application Services (EAS)

```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Build for production
eas build --platform ios
eas build --platform android
``` 