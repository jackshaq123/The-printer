#!/bin/bash

echo "🚀 Pushing THE PRINTER to GitHub..."
echo "===================================="

# Check if remote exists
if git remote get-url origin > /dev/null 2>&1; then
    echo "Remote origin already exists. Updating..."
    git remote set-url origin https://github.com/jackshaq123/the-printer.git
else
    echo "Adding remote origin..."
    git remote add origin https://github.com/jackshaq123/the-printer.git
fi

echo ""
echo "📤 Pushing to GitHub..."
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SUCCESS! Code pushed to GitHub!"
    echo ""
    echo "🌐 Next steps:"
    echo "1. Go to: https://vercel.com"
    echo "2. Sign up/Login with GitHub"
    echo "3. Click 'New Project'"
    echo "4. Import your 'the-printer' repository"
    echo "5. Add environment variables (see DEPLOYMENT_STEPS.md)"
    echo "6. Click 'Deploy'"
    echo ""
    echo "🎉 Your app will be live in minutes!"
else
    echo ""
    echo "❌ Push failed! Please check the error above."
    echo "Make sure you created the repository on GitHub first."
fi
