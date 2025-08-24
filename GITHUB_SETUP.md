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
