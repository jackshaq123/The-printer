# 🚀 PRODUCTION SETUP GUIDE FOR THE PRINTER

## Overview

This guide will help you configure THE PRINTER for production use with all APIs working properly.

## 🔑 **Required Environment Variables**

### **1. OpenAI Configuration**
```bash
OPENAI_API_KEY=sk-proj-your_actual_openai_key_here
OPENAI_MODEL=gpt-4o-mini
```

**How to get:**
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key (starts with `sk-`)

### **2. PayPal Configuration**
```bash
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here
PAYPAL_MODE=live  # Use 'sandbox' for testing
```

**How to get:**
1. Go to [PayPal Developer](https://developer.paypal.com/)
2. Log in with your PayPal account
3. Go to "My Apps & Credentials"
4. Create a new app or use existing
5. Copy `Client ID` and `Secret`

### **3. Authentication**
```bash
JWT_SECRET=your-super-secure-jwt-secret-key-here
ADMIN_KEY=your_admin_key_here
```

**How to generate JWT_SECRET:**
```bash
# Option 1: Use openssl
openssl rand -base64 64

# Option 2: Use node
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"

# Option 3: Use online generator
# https://generate-secret.vercel.app/64
```

### **4. Email Configuration (Optional but Recommended)**
```bash
RESEND_API_KEY=your_resend_api_key_here
```

**How to get:**
1. Go to [Resend](https://resend.com/)
2. Sign up/Login
3. Go to API Keys section
4. Create a new API key

### **5. Business Configuration**
```bash
AFFILIATE_DISCLOSURE_TEXT="As an affiliate, THE PRINTER may earn commissions from qualifying purchases."
LEAD_BUYER_WEBHOOK_URL=https://your-domain.com/api/webhooks/leads
```

## 🌐 **Setting Environment Variables in Vercel**

### **Step 1: Access Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Select your `The-printer` project

### **Step 2: Add Environment Variables**
1. Click "Settings" tab
2. Click "Environment Variables" in the left sidebar
3. Click "Add New" button
4. Add each variable from the list above
5. Make sure to set the correct environment (Production, Preview, Development)

### **Step 3: Redeploy**
1. Go to "Deployments" tab
2. Click "Redeploy" on your latest deployment
3. Wait for the deployment to complete

## 🔧 **API Configuration Updates Made**

### **1. PayPal API**
- ✅ Production/sandbox mode support
- ✅ Better error handling
- ✅ Proper environment variable validation
- ✅ Dynamic base URL selection

### **2. OpenAI Chat API**
- ✅ Production URL handling
- ✅ Better error messages
- ✅ Environment variable validation
- ✅ Improved error handling

### **3. Authentication API**
- ✅ JWT secret validation
- ✅ Better error messages
- ✅ Production-ready configuration
- ✅ Admin user support

## 🧪 **Testing Your APIs**

### **1. Test OpenAI Chat**
```bash
curl -X POST https://your-domain.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, can you help me with business strategy?"}'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "message": "AI response here...",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "model": "gpt-4o-mini"
  }
}
```

### **2. Test PayPal Checkout**
```bash
curl -X POST https://your-domain.vercel.app/api/paypal/checkout \
  -H "Content-Type: application/json" \
  -d '{"productId": "basic-plan", "quantity": 1}'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "paypal_order_id",
    "approvalUrl": "https://paypal.com/checkout/...",
    "amount": 29.99,
    "currency": "USD"
  }
}
```

### **3. Test User Authentication**
```bash
curl -X POST https://your-domain.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

## 🚨 **Common Issues and Solutions**

### **Issue 1: "OpenAI API key not configured"**
**Solution:** Set `OPENAI_API_KEY` in Vercel environment variables

### **Issue 2: "PayPal not configured"**
**Solution:** Set `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` in Vercel

### **Issue 3: "Authentication service not configured"**
**Solution:** Set `JWT_SECRET` in Vercel environment variables

### **Issue 4: PayPal checkout fails**
**Solution:** 
1. Check PayPal credentials are correct
2. Verify `PAYPAL_MODE` is set correctly
3. Check PayPal app is configured for production

### **Issue 5: Chat API returns errors**
**Solution:**
1. Verify OpenAI API key is valid
2. Check API key has sufficient credits
3. Verify `OPENAI_MODEL` is correct

## 📊 **Monitoring and Debugging**

### **1. Vercel Logs**
- Go to your deployment in Vercel
- Click "Functions" tab
- Check for any error logs

### **2. API Response Headers**
- Check response status codes
- Look for error details in response body
- Verify CORS headers are correct

### **3. Environment Variable Validation**
- Use the test endpoints above
- Check console logs for configuration errors
- Verify all required variables are set

## 🔒 **Security Best Practices**

### **1. Environment Variables**
- Never commit `.env` files to Git
- Use strong, unique JWT secrets
- Rotate API keys regularly
- Use different keys for dev/production

### **2. API Security**
- Implement rate limiting (future enhancement)
- Validate all inputs
- Use HTTPS everywhere
- Monitor API usage

### **3. Data Protection**
- Encrypt sensitive data
- Implement proper authentication
- Regular security audits
- Backup important data

## 🚀 **Next Steps After Configuration**

### **1. Test All Features**
- [ ] Landing page loads
- [ ] Chat functionality works
- [ ] User registration/login works
- [ ] Store checkout works
- [ ] Lead generation works
- [ ] Opportunities API works

### **2. Set Up Monitoring**
- [ ] Vercel Analytics
- [ ] Error tracking (optional)
- [ ] Performance monitoring
- [ ] API usage tracking

### **3. Business Configuration**
- [ ] Update store products
- [ ] Configure affiliate links
- [ ] Set up email templates
- [ ] Configure business policies

## 📞 **Need Help?**

### **1. Check These First**
- Environment variables are set correctly
- All required APIs are configured
- Vercel deployment is successful
- No errors in Vercel logs

### **2. Common Resources**
- [Vercel Documentation](https://vercel.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [PayPal Developer Documentation](https://developer.paypal.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

### **3. Debugging Steps**
1. Check environment variables in Vercel
2. Test APIs individually
3. Check Vercel function logs
4. Verify API credentials are valid
5. Test with simple requests first

---

## 🎯 **Success Checklist**

- [ ] All environment variables set in Vercel
- [ ] OpenAI chat API working
- [ ] PayPal checkout working
- [ ] User authentication working
- [ ] All pages loading correctly
- [ ] No errors in Vercel logs
- [ ] Production deployment successful

**🎉 Once all items are checked, THE PRINTER is ready for production use!**

---

**Next step**: Set your environment variables in Vercel and test the functionality! 🚀 