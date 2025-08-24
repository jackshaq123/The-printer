# 🚀 DEPLOYMENT GUIDE FOR THE PRINTER

## Overview

This guide covers deploying THE PRINTER to various platforms. THE PRINTER is an AI-powered business assistant built with Next.js 15, TypeScript, and Tailwind CSS.

## Pre-Deployment Checklist

- [ ] Project builds successfully (`npm run build`)
- [ ] Environment variables configured
- [ ] Git repository initialized
- [ ] All dependencies installed

## Environment Variables

Create a `.env.local` file with:

```bash
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_secret_here
RESEND_API_KEY=your_resend_api_key_here
ADMIN_KEY=your_admin_key_here
AFFILIATE_DISCLOSURE_TEXT="As an affiliate, THE PRINTER may earn commissions."
LEAD_BUYER_WEBHOOK_URL=your_webhook_url_here
JWT_SECRET=your_jwt_secret_here
```

## Deployment Options

### 1. Vercel (Recommended)

**Pros:**
- Zero configuration
- Automatic deployments
- Built-in analytics
- Global CDN
- Free tier available

**Steps:**
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts
4. Set environment variables in Vercel dashboard

**Manual Deployment:**
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure environment variables
4. Deploy

### 2. Railway

**Pros:**
- Simple deployment
- Good free tier
- Automatic HTTPS

**Steps:**
1. Go to [railway.app](https://railway.app)
2. Connect GitHub repository
3. Set environment variables
4. Deploy

### 3. Netlify

**Pros:**
- Great for static sites
- Form handling
- Good free tier

**Steps:**
1. Go to [netlify.com](https://netlify.com)
2. Connect GitHub repository
3. Set build command: `npm run build`
4. Set publish directory: `.next`
5. Configure environment variables

### 4. Docker Deployment

**Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

**Deploy:**
```bash
docker build -t the-printer .
docker run -p 3000:3000 the-printer
```

### 5. Self-Hosted (VPS)

**Requirements:**
- Node.js 18+
- PM2 or similar process manager
- Nginx for reverse proxy
- SSL certificate

**Steps:**
1. Upload code to server
2. Install dependencies: `npm install`
3. Build project: `npm run build`
4. Start with PM2: `pm2 start npm --name "the-printer" -- start`
5. Configure Nginx reverse proxy
6. Set up SSL with Let's Encrypt

## Post-Deployment

### Health Checks

Verify these endpoints work:
- `/` - Landing page
- `/api/chat` - Chat API
- `/api/opportunities` - Opportunities API
- `/api/leads` - Leads API

### Monitoring

- Set up uptime monitoring
- Configure error tracking
- Monitor performance metrics
- Set up logging

### SSL/HTTPS

- Vercel, Railway, Netlify: Automatic
- Self-hosted: Use Let's Encrypt
- Docker: Configure in reverse proxy

## Troubleshooting

### Build Failures

```bash
# Clear cache
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### Runtime Errors

- Check environment variables
- Verify API keys are valid
- Check server logs
- Ensure all dependencies are installed

### Performance Issues

- Enable Next.js optimizations
- Use CDN for static assets
- Implement caching strategies
- Monitor bundle sizes

## Security Considerations

- Never commit `.env` files
- Use strong JWT secrets
- Implement rate limiting
- Validate all inputs
- Use HTTPS everywhere
- Regular dependency updates

## Scaling

### Horizontal Scaling

- Use load balancers
- Implement session sharing
- Database connection pooling
- Cache with Redis

### Vertical Scaling

- Increase server resources
- Optimize database queries
- Implement lazy loading
- Use CDN for assets

## Maintenance

### Regular Tasks

- Update dependencies
- Monitor performance
- Backup data
- Review logs
- Security audits

### Updates

1. Pull latest changes
2. Install new dependencies
3. Test locally
4. Deploy to staging
5. Deploy to production

## Support

For deployment issues:
1. Check this guide
2. Review platform documentation
3. Check GitHub issues
4. Contact platform support

---

**Happy Deploying! 🚀** 