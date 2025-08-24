# 🚀 PRODUCTION CONFIGURATION GUIDE

## Environment Variables for Production

Create a `.env.local` file in your project root with these variables:

### **Required Environment Variables**

```bash
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini

# PayPal Configuration (for payments)
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here
PAYPAL_MODE=live  # Use 'sandbox' for testing, 'live' for production

# Email Configuration (Resend)
RESEND_API_KEY=your_resend_api_key_here

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-key-here
ADMIN_KEY=your_admin_key_here

# Business Configuration
AFFILIATE_DISCLOSURE_TEXT="As an affiliate, THE PRINTER may earn commissions from qualifying purchases."
LEAD_BUYER_WEBHOOK_URL=https://your-domain.com/api/webhooks/leads
```

### **Optional Environment Variables**

```bash
# Analytics and Monitoring
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id_here
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here

# Database Configuration (if using external database later)
# DATABASE_URL=your_database_connection_string_here

# Redis Configuration (if using Redis for caching)
# REDIS_URL=your_redis_connection_string_here
```

## 🔑 **API Key Setup Instructions**

### **1. OpenAI API Key**
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key (starts with `sk-`)
4. Set `OPENAI_API_KEY` in your environment

### **2. PayPal API Keys**
1. Go to [PayPal Developer](https://developer.paypal.com/)
2. Log in with your PayPal account
3. Go to "My Apps & Credentials"
4. Create a new app or use existing
5. Copy `Client ID` and `Secret`
6. Set `PAYPAL_MODE=live` for production

### **3. Resend API Key (Email)**
1. Go to [Resend](https://resend.com/)
2. Sign up/Login
3. Go to API Keys section
4. Create a new API key
5. Copy the key

### **4. JWT Secret**
Generate a secure random string:
```bash
# Option 1: Use openssl
openssl rand -base64 64

# Option 2: Use node
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"

# Option 3: Use online generator
# https://generate-secret.vercel.app/64
```

## 🌐 **Production Deployment Checklist**

### **Vercel Environment Variables**
1. Go to your Vercel project dashboard
2. Click "Settings" → "Environment Variables"
3. Add each variable from the list above
4. Make sure to set the correct environment (Production, Preview, Development)

### **Domain Configuration**
1. Add your custom domain in Vercel
2. Update DNS records as instructed
3. Wait for SSL certificate to be issued

### **API Endpoints to Test**
- `/` - Landing page
- `/api/chat` - Chat functionality
- `/api/opportunities` - Opportunities API
- `/api/leads` - Lead generation
- `/api/store/products` - Store products
- `/api/auth/login` - User authentication

## 🔧 **Configuration Updates Needed**

### **1. Update PayPal Configuration**
The app currently uses PayPal for payments. Make sure to:
- Set production PayPal keys
- Test checkout flow
- Verify webhook handling

### **2. Update Email Configuration**
For user registration and notifications:
- Set Resend API key
- Test email sending
- Verify email templates

### **3. Update OpenAI Configuration**
For AI chat and content generation:
- Set your OpenAI API key
- Test chat functionality
- Monitor API usage

## 🚨 **Security Considerations**

### **Environment Variables**
- Never commit `.env` files to Git
- Use strong, unique JWT secrets
- Rotate API keys regularly
- Use different keys for development/production

### **API Security**
- Implement rate limiting
- Validate all inputs
- Use HTTPS everywhere
- Monitor API usage

### **Data Protection**
- Encrypt sensitive data
- Implement proper authentication
- Regular security audits
- Backup important data

## 📊 **Monitoring and Analytics**

### **Performance Monitoring**
- Vercel Analytics (built-in)
- Core Web Vitals
- API response times
- Error rates

### **Business Metrics**
- User registrations
- Chat interactions
- Store purchases
- Lead generation

## 🔄 **Update Process**

1. **Set Environment Variables** in Vercel
2. **Test All Features** on production
3. **Monitor Performance** and errors
4. **Update Configuration** as needed
5. **Scale Resources** based on usage

## 📞 **Need Help?**

- Check Vercel deployment logs
- Monitor API response times
- Test all features thoroughly
- Review error logs regularly

---

**🎯 Goal: Get all APIs working in production with proper security!**

**Next step**: Set your environment variables in Vercel and test the functionality! 🚀 