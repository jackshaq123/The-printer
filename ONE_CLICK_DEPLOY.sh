#!/bin/bash

echo "🚀 ONE-CLICK DEPLOYMENT FOR THE PRINTER"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

print_status "Starting one-click deployment process..."

# Step 1: Get GitHub username
echo ""
echo "📝 GITHUB SETUP"
echo "==============="
read -p "Enter your GitHub username: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    print_error "GitHub username is required"
    exit 1
fi

print_success "GitHub username: $GITHUB_USERNAME"

# Step 2: Check Git status and commit any changes
print_status "Step 1: Preparing Git repository..."
if [ -n "$(git status --porcelain)" ]; then
    print_warning "Committing uncommitted changes..."
    git add .
    git commit -m "Auto-commit before deployment: $(date)"
    print_success "Changes committed successfully"
else
    print_success "No uncommitted changes found"
fi

# Step 3: Build the project
print_status "Step 2: Building project for production..."
if npm run build; then
    print_success "Project built successfully!"
else
    print_error "Build failed! Please fix the errors before deploying."
    exit 1
fi

# Step 4: Create comprehensive deployment instructions
print_status "Step 3: Creating deployment instructions..."

cat > DEPLOYMENT_STEPS.md << EOF
# 🚀 DEPLOYMENT STEPS FOR $GITHUB_USERNAME

## ⚡ **5-Minute Deployment to GitHub + Vercel**

### **Step 1: Create GitHub Repository (2 minutes)**

1. **Go to GitHub**: https://github.com/new
2. **Repository name**: \`The-printer\`
3. **Description**: \`AI-powered business assistant built with Next.js\`
4. **Visibility**: Choose **Public** (recommended for portfolio)
5. **Important**: **DO NOT** check "Add a README file" (we already have one)
6. **Click**: "Create repository"

### **Step 2: Push Code to GitHub (1 minute)**

After creating the repository, run these commands in your terminal:

\`\`\`bash
# Make sure you're in the the-printer directory
cd /Users/yaaco/Library/CloudStorage/OneDrive-Personal/st/cursor\\ ai/the-printer

# Add the remote (your username: $GITHUB_USERNAME)
git remote add origin https://github.com/$GITHUB_USERNAME/The-printer.git

# Set main branch and push
git branch -M main
git push -u origin main
\`\`\`

### **Step 3: Deploy to Vercel (2 minutes)**

1. **Go to Vercel**: https://vercel.com
2. **Sign up/Login** with your GitHub account
3. **Click**: "New Project"
4. **Import**: Select your \`The-printer\` repository
5. **Environment Variables**: Add these (click "Add" for each):
   - \`OPENAI_API_KEY\` = \`your_openai_api_key_here\`
   - \`PAYPAL_CLIENT_ID\` = \`your_paypal_client_id_here\`
   - \`PAYPAL_CLIENT_SECRET\` = \`your_paypal_secret_here\`
   - \`JWT_SECRET\` = \`your-super-secure-jwt-secret-key-123\`
   - \`RESEND_API_KEY\` = \`your_resend_key_here\` (optional)
   - \`ADMIN_KEY\` = \`supersecret123\`
6. **Click**: "Deploy"

### **Step 4: Your App is Live! 🎉**

- **Vercel URL**: \`https://the-printer-abc123.vercel.app\`
- **Custom Domain**: Add later in Vercel dashboard
- **Auto-deploy**: Every push to GitHub will auto-deploy

---

## 🔧 **Quick Commands (After creating repo)**

\`\`\`bash
# Make sure you're in the the-printer directory
cd /Users/yaaco/Library/CloudStorage/OneDrive-Personal/st/cursor\\ ai/the-printer

# Add the remote (your username: $GITHUB_USERNAME)
git remote add origin https://github.com/$GITHUB_USERNAME/The-printer.git

# Push to GitHub
git branch -M main
git push -u origin main

# Then deploy to Vercel manually
\`\`\`

---

## 🌟 **What You Get**

✅ **Live Website** on the internet  
✅ **Auto-deployment** from GitHub  
✅ **Custom domain** support  
✅ **SSL/HTTPS** automatically  
✅ **Global CDN** for fast loading  
✅ **Analytics** and monitoring  
✅ **GitHub integration** for easy updates  

---

## 🚨 **Troubleshooting**

### **Repository not found error**
- Make sure you created the repository on GitHub first
- Check the repository name is exactly \`The-printer\`
- Verify your GitHub username is correct: \`$GITHUB_USERNAME\`

### **Push fails**
- Make sure you're in the right directory
- Check you have write access to the repository
- Try \`git remote -v\` to verify remote URL

### **Vercel deployment fails**
- Check all environment variables are set
- Verify the repository is public (or you have access)
- Check Vercel logs for specific errors

---

## 📞 **Need Help?**

1. **Check logs**: Look at terminal output for errors
2. **Verify steps**: Make sure you followed each step exactly
3. **Check files**: All deployment files are in your project
4. **Documentation**: See \`README.md\` and \`DEPLOYMENT.md\`

---

## 🎯 **DEPLOYMENT CHECKLIST**

- [ ] Create GitHub repository at https://github.com/new
- [ ] Repository name: \`The-printer\`
- [ ] Make it Public
- [ ] DON'T initialize with README
- [ ] Run \`./push-to-github.sh\`
- [ ] Go to https://vercel.com
- [ ] Sign up/Login with GitHub
- [ ] Import \`The-printer\` repository
- [ ] Add environment variables
- [ ] Click Deploy
- [ ] Your app is live! 🎉

---

**🎯 Goal: Get your app live on the internet in 5 minutes!**

**Next step**: Create the GitHub repository, then run the commands above! 🚀
EOF

print_success "Deployment steps created: DEPLOYMENT_STEPS.md"

# Step 5: Create automated push script
print_status "Step 4: Creating automated push script..."

cat > push-to-github.sh << EOF
#!/bin/bash

echo "🚀 Pushing THE PRINTER to GitHub..."
echo "===================================="

# Check if remote exists
if git remote get-url origin > /dev/null 2>&1; then
    echo "Remote origin already exists. Updating..."
    git remote set-url origin https://github.com/$GITHUB_USERNAME/The-printer.git
else
    echo "Adding remote origin..."
    git remote add origin https://github.com/$GITHUB_USERNAME/The-printer.git
fi

echo ""
echo "📤 Pushing to GitHub..."
git branch -M main
git push -u origin main

if [ \$? -eq 0 ]; then
    echo ""
    echo "✅ SUCCESS! Code pushed to GitHub!"
    echo ""
    echo "🌐 Next steps:"
    echo "1. Go to: https://vercel.com"
    echo "2. Sign up/Login with GitHub"
    echo "3. Click 'New Project'"
    echo "4. Import your 'The-printer' repository"
    echo "5. Add environment variables (see DEPLOYMENT_STEPS.md)"
    echo "6. Click 'Deploy'"
    echo ""
    echo "🎉 Your app will be live in minutes!"
else
    echo ""
    echo "❌ Push failed! Please check the error above."
    echo "Make sure you created the repository on GitHub first."
fi
EOF

chmod +x push-to-github.sh
print_success "Push script created: push-to-github.sh"

# Step 6: Final instructions
print_status "Step 5: Final deployment preparation..."

echo ""
echo "🎉 ONE-CLICK DEPLOYMENT PREPARATION COMPLETE!"
echo "=============================================="
echo ""

print_success "✅ Project builds successfully"
print_success "✅ Git repository is ready"
print_success "✅ All documentation created"
print_success "✅ Automated scripts prepared"
echo ""

echo "📋 NEXT STEPS:"
echo "=============="
echo ""

echo "1️⃣  Create GitHub repository:"
echo "   - Go to: https://github.com/new"
echo "   - Repository name: The-printer"
echo "   - Description: AI-powered business assistant built with Next.js"
echo "   - Make it Public"
echo "   - DON'T initialize with README"
echo "   - Click 'Create repository'"
echo ""

echo "2️⃣  Push to GitHub (automated):"
echo "   ./push-to-github.sh"
echo ""

echo "3️⃣  Deploy to Vercel:"
echo "   - Go to: https://vercel.com"
echo "   - Sign up/Login with GitHub"
echo "   - Click 'New Project'"
echo "   - Import your 'The-printer' repository"
echo "   - Add environment variables (see DEPLOYMENT_STEPS.md)"
echo "   - Click 'Deploy'"
echo ""

echo "4️⃣  Your app will be live on the internet! 🎉"
echo ""

# Show current git status
echo "📊 Current Git Status:"
git status --short

echo ""
echo "🌐 Local development server: http://localhost:3000"
echo "📚 Documentation: README.md, DEPLOYMENT.md"
echo "📋 Deployment steps: DEPLOYMENT_STEPS.md"
echo "🚀 Push script: push-to-github.sh"
echo ""

print_success "THE PRINTER is ready for one-click deployment! 🚀"
echo ""
echo "🎯 Next action: Create the GitHub repository, then run ./push-to-github.sh"
echo ""
echo "💡 Pro tip: Run ./verify-deployment.sh to check your setup status" 