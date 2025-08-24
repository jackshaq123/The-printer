#!/bin/bash

echo "🚀 Quick Deploy Script for THE PRINTER"
echo "======================================"

# Get GitHub username
read -p "Enter your GitHub username: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ GitHub username is required"
    exit 1
fi

echo ""
echo "📋 Next Steps:"
echo ""

echo "1️⃣  Create GitHub repository:"
echo "   - Go to: https://github.com/new"
echo "   - Repository name: the-printer"
echo "   - Description: AI-powered business assistant built with Next.js"
echo "   - Make it Public"
echo "   - DON'T initialize with README"
echo "   - Click 'Create repository'"
echo ""

echo "2️⃣  Run these commands:"
echo "   git remote add origin https://github.com/$GITHUB_USERNAME/the-printer.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""

echo "3️⃣  Deploy to Vercel:"
echo "   - Go to: https://vercel.com"
echo "   - Sign up/Login with GitHub"
echo "   - Click 'New Project'"
echo "   - Import your 'the-printer' repository"
echo "   - Add environment variables (see GITHUB_SETUP.md)"
echo "   - Click 'Deploy'"
echo ""

echo "✅ Your app will be live in minutes!"
echo "📚 For detailed instructions, see GITHUB_SETUP.md"
