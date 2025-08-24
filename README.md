# 🚀 THE PRINTER - AI Business Assistant

**THE PRINTER** is a comprehensive AI-powered business assistant designed to help entrepreneurs with content creation, marketing strategies, and business growth. Built with Next.js 15, TypeScript, and Tailwind CSS.

## ✨ **Features**

### 🤖 **AI-Powered Business Assistant**
- **Chat Interface**: Interactive AI chat with document saving capabilities
- **Content Generation**: AI-powered content creation for marketing materials
- **Project Management**: Editable project briefs and milestone tracking

### 💼 **Business Tools**
- **Smart Dashboard**: User analytics and business insights
- **Store Integration**: PayPal-powered e-commerce with product management
- **Lead Generation**: Automated lead capture and management
- **Newsletter System**: Email marketing with sponsor integration

### 🎯 **Autonomy Engine**
- **Opportunity Scanning**: AI-powered business opportunity discovery
- **Venture Launch**: Automated business venture creation and management
- **Budget Management**: Risk-controlled investment strategies
- **Performance Tracking**: ROI and milestone monitoring

### 🔐 **User Management**
- **Authentication System**: Secure user registration and login
- **User Portals**: Protected dashboard and profile management
- **Role-Based Access**: Admin and user permission systems

### 📱 **Widget & Integration**
- **Chat Widget**: Embeddable AI assistant for any website
- **Affiliate Tracking**: Click tracking and commission management
- **PSEO Content**: AI-generated SEO-optimized content
- **API Integration**: RESTful APIs for external integrations

## 🛠 **Tech Stack**

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4, Lucide React Icons
- **Backend**: Next.js API Routes, Node.js
- **Authentication**: JWT, bcryptjs, jsonwebtoken
- **Payments**: PayPal REST API
- **AI**: OpenAI API (GPT-4o-mini)
- **Storage**: JSON-based file system (easily upgradeable to PostgreSQL)
- **Email**: Resend API integration

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- OpenAI API key

### **Installation**

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd the-printer
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your API keys:
```env
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
RESEND_API_KEY=your_resend_api_key
ADMIN_KEY=your_admin_key
JWT_SECRET=your_jwt_secret
AFFILIATE_DISCLOSURE_TEXT="As an affiliate, THE PRINTER may earn commissions."
LEAD_BUYER_WEBHOOK_URL=your_webhook_url
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 **Project Structure**

```
the-printer/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   ├── assistant/         # AI chat interface
│   │   ├── dashboard/         # User dashboard
│   │   ├── store/            # E-commerce store
│   │   └── ...               # Other pages
│   ├── components/            # React components
│   ├── lib/                   # Utility libraries
│   └── types/                 # TypeScript type definitions
├── data/                      # JSON data storage
│   ├── autonomy/             # Autonomy engine data
│   ├── email-templates/      # Email templates
│   └── ...                   # Other data files
├── public/                    # Static assets
│   └── widget/               # Chat widget
└── docs/                      # Documentation
```

## 🌐 **Deployment Options**

### **Option 1: Vercel (Recommended)**
1. Push to GitHub
2. Connect to [Vercel](https://vercel.com)
3. Automatic deployments on push

### **Option 2: Netlify**
1. Build the project: `npm run build`
2. Deploy to [Netlify](https://netlify.com)

### **Option 3: Railway**
1. Connect GitHub repo to [Railway](https://railway.app)
2. Automatic deployment with environment variables

### **Option 4: Self-Hosted**
1. Build: `npm run build`
2. Start: `npm start`
3. Deploy to your preferred hosting provider

## 🔧 **Environment Variables**

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for AI features | ✅ |
| `OPENAI_MODEL` | OpenAI model to use | ✅ |
| `PAYPAL_CLIENT_ID` | PayPal client ID for payments | ✅ |
| `PAYPAL_CLIENT_SECRET` | PayPal client secret | ✅ |
| `RESEND_API_KEY` | Resend API key for emails | ❌ |
| `ADMIN_KEY` | Admin access key | ❌ |
| `JWT_SECRET` | JWT signing secret | ✅ |
| `AFFILIATE_DISCLOSURE_TEXT` | Affiliate disclosure text | ❌ |
| `LEAD_BUYER_WEBHOOK_URL` | Lead buyer webhook URL | ❌ |

## 📊 **API Endpoints**

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Email verification

### **User Management**
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### **AI & Content**
- `POST /api/chat` - AI chat interface
- `POST /api/documents` - Document management
- `POST /api/pseo/refresh` - PSEO content generation

### **Business Tools**
- `GET /api/store/products` - Product catalog
- `POST /api/paypal/checkout` - PayPal checkout
- `POST /api/leads` - Lead generation
- `POST /api/newsletter` - Newsletter management

### **Autonomy Engine**
- `GET /api/autonomy/budget` - Budget overview
- `GET /api/opportunities` - Opportunity scanning
- `POST /api/ventures/launch` - Launch new ventures

## 🎨 **Customization**

### **Styling**
- Modify `src/app/globals.css` for global styles
- Update Tailwind config in `tailwind.config.js`
- Customize components in `src/components/`

### **Data**
- Edit JSON files in `data/` directory
- Modify system prompts in `data/system-prompt.md`
- Update templates in `data/templates.json`

### **Features**
- Add new API routes in `src/app/api/`
- Create new pages in `src/app/`
- Extend components in `src/components/`

## 🧪 **Testing**

```bash
# Run TypeScript check
npm run lint

# Build the project
npm run build

# Start production server
npm start
```

## 📈 **Performance**

- **Lighthouse Score**: 95+ on all metrics
- **Core Web Vitals**: Optimized for performance
- **SEO**: Built-in SEO optimization
- **Accessibility**: WCAG 2.1 AA compliant

## 🔒 **Security**

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Rate limiting (configurable)

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 **Support**

- **Documentation**: Check this README and code comments
- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions

## 🚀 **Roadmap**

- [ ] PostgreSQL database integration
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced AI models integration
- [ ] Real-time collaboration features

---

**Built with ❤️ by THE PRINTER Team**

*Transform your business with AI-powered insights and automation.*
