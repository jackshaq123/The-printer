#!/bin/bash

echo "🚀 Complete GitHub Deployment for THE PRINTER"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "src" ]; then
    print_error "This script must be run from the the-printer directory"
    exit 1
fi

print_status "Starting complete deployment process..."

# Step 1: Check Git status
print_status "Step 1: Checking Git repository status..."
if [ ! -d ".git" ]; then
    print_error "Git repository not initialized. Please run 'git init' first."
    exit 1
fi

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    print_warning "There are uncommitted changes. Committing them now..."
    git add .
    git commit -m "Auto-commit before deployment: $(date)"
    print_success "Changes committed successfully"
else
    print_success "No uncommitted changes found"
fi

# Step 2: Build the project
print_status "Step 2: Building the project for production..."
if npm run build; then
    print_success "Project built successfully!"
else
    print_error "Build failed! Please fix the errors before deploying."
    exit 1
fi

# Step 3: Create GitHub repository instructions
print_status "Step 3: Preparing GitHub repository setup..."

# Create a comprehensive setup guide
cat > GITHUB_SETUP.md << 'EOF'
# 🚀 GitHub Repository Setup Guide

## Quick Setup (5 minutes)

### 1. Create GitHub Repository
- Go to: https://github.com/new
- Repository name: `the-printer`
- Description: `AI-powered business assistant built with Next.js`
- Make it **Public** (recommended for portfolio)
- **DO NOT** initialize with README (we already have one)
- Click "Create repository"

### 2. Copy These Commands
After creating the repository, run these commands in your terminal:

```bash
# Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/the-printer.git
git branch -M main
git push -u origin main
```

### 3. Deploy to Vercel (Recommended)
- Go to: https://vercel.com
- Sign up/Login with GitHub
- Click "New Project"
- Import your `the-printer` repository
- Add environment variables:
  - `OPENAI_API_KEY` = your OpenAI API key
  - `PAYPAL_CLIENT_ID` = your PayPal client ID
  - `PAYPAL_CLIENT_SECRET` = your PayPal client secret
  - `JWT_SECRET` = any secure random string
  - `RESEND_API_KEY` = your Resend API key (optional)
  - `ADMIN_KEY` = your admin access key (optional)
- Click "Deploy"

### 4. Your App Will Be Live!
- Vercel will give you a URL like: `https://the-printer-abc123.vercel.app`
- You can add a custom domain later

## Alternative Deployment Options

### Railway
- Go to: https://railway.app
- Connect GitHub and deploy

### Netlify
- Go to: https://netlify.com
- Connect GitHub and deploy

### Self-Hosted
- See `DEPLOYMENT.md` for detailed instructions

## Need Help?
- Check `README.md` for project overview
- Check `DEPLOYMENT.md` for detailed deployment options
- Run `./setup-github.sh` for interactive setup

---
**Happy Deploying! 🚀**
EOF

print_success "GitHub setup guide created: GITHUB_SETUP.md"

# Step 4: Create deployment checklist
print_status "Step 4: Creating deployment checklist..."

cat > DEPLOYMENT_CHECKLIST.md << 'EOF'
# ✅ Deployment Checklist

## Pre-Deployment
- [x] Project builds successfully
- [x] Git repository initialized
- [x] All changes committed
- [x] Environment variables documented

## GitHub Setup
- [ ] Create GitHub repository
- [ ] Add remote origin
- [ ] Push code to GitHub
- [ ] Verify repository is public/accessible

## Environment Variables (Required)
- [ ] `OPENAI_API_KEY` - Your OpenAI API key
- [ ] `PAYPAL_CLIENT_ID` - Your PayPal client ID  
- [ ] `PAYPAL_CLIENT_SECRET` - Your PayPal client secret
- [ ] `JWT_SECRET` - Secure random string for JWT signing

## Environment Variables (Optional)
- [ ] `RESEND_API_KEY` - For email functionality
- [ ] `ADMIN_KEY` - For admin access
- [ ] `AFFILIATE_DISCLOSURE_TEXT` - Custom affiliate text
- [ ] `LEAD_BUYER_WEBHOOK_URL` - Lead buyer webhook

## Deployment
- [ ] Choose hosting platform (Vercel recommended)
- [ ] Connect GitHub repository
- [ ] Configure environment variables
- [ ] Deploy application
- [ ] Test all features
- [ ] Set up custom domain (optional)

## Post-Deployment
- [ ] Test user registration/login
- [ ] Test AI chat functionality
- [ ] Test PayPal checkout
- [ ] Test lead generation
- [ ] Test newsletter signup
- [ ] Monitor performance
- [ ] Set up monitoring/analytics

## Security Checklist
- [ ] Environment variables are secure
- [ ] JWT secret is strong
- [ ] API keys are not exposed
- [ ] HTTPS is enabled
- [ ] CORS is configured properly

---
**Status: Ready for deployment! 🚀**
EOF

print_success "Deployment checklist created: DEPLOYMENT_CHECKLIST.md"

# Step 5: Create quick start script
print_status "Step 5: Creating quick start script..."

cat > quick-deploy.sh << 'EOF'
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
EOF

chmod +x quick-deploy.sh
print_success "Quick deploy script created: quick-deploy.sh"

# Step 6: Final status and instructions
print_status "Step 6: Final deployment preparation..."

echo ""
echo "🎉 DEPLOYMENT PREPARATION COMPLETE!"
echo "===================================="
echo ""

print_success "✅ Project builds successfully"
print_success "✅ Git repository is ready"
print_success "✅ All documentation created"
print_success "✅ Deployment scripts prepared"
echo ""

echo "📋 NEXT STEPS:"
echo "=============="
echo ""

echo "1️⃣  Run the quick deploy script:"
echo "   ./quick-deploy.sh"
echo ""

echo "2️⃣  Or follow the manual setup:"
echo "   - Read GITHUB_SETUP.md"
echo "   - Follow DEPLOYMENT_CHECKLIST.md"
echo ""

echo "3️⃣  Your app will be live on the internet!"
echo ""

echo "🚀 Ready to deploy? Run: ./quick-deploy.sh"
echo ""

# Show current git status
echo "📊 Current Git Status:"
git status --short

echo ""
echo "🌐 Local development server: http://localhost:3000"
echo "📚 Documentation: README.md, DEPLOYMENT.md"
echo "🔧 Setup script: setup-github.sh"
echo "⚡ Quick deploy: quick-deploy.sh"
echo ""

print_success "THE PRINTER is ready for deployment! 🚀" 