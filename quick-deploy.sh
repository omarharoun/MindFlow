#!/bin/bash

echo "🚀 Quick Deploy to Netlify"
echo "=========================="

# Create dist directory if it doesn't exist
mkdir -p dist

# Copy assets if they exist
if [ -d "assets" ]; then
    echo "📁 Copying assets..."
    cp -r assets dist/
fi

# Create a simple index.html if it doesn't exist
if [ ! -f "dist/index.html" ]; then
    echo "📄 Creating index.html..."
    cat > dist/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MindFlow</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .container {
            text-align: center;
            padding: 2rem;
        }
        .logo {
            font-size: 3rem;
            font-weight: bold;
            margin-bottom: 1rem;
            background: linear-gradient(45deg, #3B82F6, #8B5CF6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .subtitle {
            font-size: 1.2rem;
            color: #94A3B8;
            margin-bottom: 2rem;
        }
        .message {
            color: #64748B;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">MindFlow</div>
        <div class="subtitle">Your AI-Powered Learning Companion</div>
        <div class="message">Coming Soon - Full app deployment in progress</div>
    </div>
</body>
</html>
EOF
fi

echo "✅ Build ready for deployment!"
echo "📁 Build output: dist/"
echo ""
echo "🌐 To deploy to Netlify:"
echo "1. Go to https://app.netlify.com"
echo "2. Drag and drop the 'dist' folder"
echo "3. Your site will be deployed automatically"
echo ""
echo "🔗 Or use Netlify CLI:"
echo "npm install -g netlify-cli"
echo "netlify deploy --dir=dist --prod" 