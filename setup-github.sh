#!/bin/bash

echo "🚀 Setting up GitHub repository for THE PRINTER"
echo "================================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please run 'git init' first."
    exit 1
fi

echo "📋 Current Git status:"
git status --short

echo ""
echo "🔗 To deploy to GitHub, follow these steps:"
echo ""

echo "1️⃣  Create a new repository on GitHub:"
echo "   - Go to https://github.com/new"
echo "   - Repository name: the-printer"
echo "   - Description: AI-powered business assistant built with Next.js"
echo "   - Make it Public or Private (your choice)"
echo "   - Don't initialize with README (we already have one)"
echo ""

echo "2️⃣  Add the remote origin (replace YOUR_USERNAME with your GitHub username):"
echo "   git remote add origin https://github.com/YOUR_USERNAME/the-printer.git"
echo ""

echo "3️⃣  Push to GitHub:"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""

echo "4️⃣  Deploy to Vercel:"
echo "   - Go to https://vercel.com"
echo "   - Sign up/Login with GitHub"
echo "   - Click 'New Project'"
echo "   - Import your 'the-printer' repository"
echo "   - Add environment variables:"
echo "     • OPENAI_API_KEY"
echo "     • PAYPAL_CLIENT_ID"
echo "     • PAYPAL_CLIENT_SECRET"
echo "     • JWT_SECRET"
echo "     • RESEND_API_KEY"
echo "     • ADMIN_KEY"
echo "   - Click 'Deploy'"
echo ""

echo "5️⃣  Set up custom domain (optional):"
echo "   - In Vercel dashboard, go to Settings → Domains"
echo "   - Add your custom domain"
echo "   - Update DNS records as instructed"
echo ""

echo "🎯 Alternative deployment options:"
echo "   • Railway: https://railway.app"
echo "   • Netlify: https://netlify.com"
echo "   • Docker: See DEPLOYMENT.md for details"
echo ""

echo "📚 For detailed deployment instructions, see DEPLOYMENT.md"
echo ""

echo "✅ Ready to deploy! Your Next.js app is built and ready."
echo "🌐 Local development server: http://localhost:3000"
echo ""

# Check if .env exists
if [ -f ".env" ]; then
    echo "⚠️  Warning: .env file exists. Make sure to:"
    echo "   - Add .env to .gitignore (already done)"
    echo "   - Set up environment variables in your hosting platform"
    echo "   - Never commit sensitive API keys to GitHub"
else
    echo "📝 Note: Create .env file with your API keys before deploying"
fi

echo ""
echo "🚀 Happy deploying!" 