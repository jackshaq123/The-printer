#!/bin/bash

echo "🔍 VERIFYING DEPLOYMENT STATUS"
echo "=============================="
echo ""

# Check if remote exists
if git remote get-url origin > /dev/null 2>&1; then
    REMOTE_URL=$(git remote get-url origin)
    echo "✅ Remote origin exists: $REMOTE_URL"
    
    # Check if it's the correct format
    if [[ $REMOTE_URL == *"github.com"* ]]; then
        echo "✅ Remote URL format is correct"
    else
        echo "❌ Remote URL format is incorrect"
    fi
else
    echo "❌ Remote origin does not exist"
    echo "Run: git remote add origin https://github.com/jackshq123/the-printer.git"
fi

echo ""
echo "📊 Git Status:"
git status --short

echo ""
echo "🌐 Local Development:"
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Local server is running on http://localhost:3000"
else
    echo "❌ Local server is not running"
    echo "Run: npm run dev"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Create GitHub repository at: https://github.com/new"
echo "2. Repository name: the-printer"
echo "3. Make it Public"
echo "4. DON'T initialize with README"
echo "5. Run: ./push-to-github.sh"
echo "6. Deploy to Vercel"
