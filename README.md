# GrowPlantGrow

<div align="center">

![GrowPlantGrow Logo](https://via.placeholder.com/200x200/2d5016/ffffff?text=GPG)

**A modern e-commerce platform for botanical digital printables and ebooks**

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.39-green?logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](LICENSE)

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Contributing](#-contributing) • [License](#-license)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Development](#-development)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 Overview

GrowPlantGrow is a full-featured e-commerce platform built with Next.js 14, designed for selling botanical digital products including guides, workbooks, printables, and ebooks. The platform features a modern admin panel, user authentication, shopping cart functionality, and integration capabilities with payment processors and marketplaces.

### Key Highlights

- **Modern Stack**: Built with Next.js 14 App Router, TypeScript, and Tailwind CSS
- **Scalable Architecture**: Server-side rendering, API routes, and database integration
- **Admin Panel**: Comprehensive product management with analytics and AI integration capabilities
- **User Experience**: Responsive design, fast performance, and intuitive navigation
- **Enterprise Ready**: Security best practices, role-based access control, and audit logging

## ✨ Features

### Core Features

- 🛍️ **Product Catalog**: Advanced product browsing with category filters and search
- 🔐 **Authentication**: Secure user authentication via Supabase Auth
- 🛒 **Shopping Cart**: Persistent cart with localStorage and database sync
- ❤️ **Favorites**: Wishlist functionality for users
- 👤 **User Accounts**: Profile management, order history, and downloads
- 📱 **Responsive Design**: Mobile-first approach with beautiful botanical theme

### Admin Features

- 📊 **Admin Dashboard**: Analytics, sales tracking, and performance metrics
- 🎨 **Product Management**: Full CRUD operations for products
- 🔍 **SEO Tools**: Meta tags, descriptions, and keyword optimization
- 📈 **Analytics**: View counts, sales tracking, and revenue analytics
- 👥 **User Management**: Role-based access control (RBAC)
- 🤖 **AI Integration**: Product description generation and SEO optimization (planned)

### Integration Ready

- 💳 **Payment Processors**: Lemon Squeezy, Stripe integration ready
- 🛒 **Marketplaces**: Etsy API integration support
- 📦 **Print Services**: Printify webhook handlers
- 🔗 **Social Media**: Pinterest, Instagram, Facebook, YouTube links

## 🛠 Tech Stack

### Frontend

- **Framework**: [Next.js 14.2](https://nextjs.org/) (App Router)
- **Language**: [TypeScript 5.5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/)
- **UI Components**: Custom components with botanical theme
- **State Management**: React Context API

### Backend

- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (for product files)
- **API**: Next.js API Routes

### Development Tools

- **Package Manager**: npm
- **Linting**: ESLint with Next.js config
- **Type Checking**: TypeScript compiler
- **Version Control**: Git

## 🏗 Architecture

### Project Structure

```
gpg-web/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (routes)/          # Public routes
│   │   ├── admin/             # Admin panel routes
│   │   ├── api/               # API endpoints
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── admin/             # Admin-specific components
│   │   └── (shared)/          # Shared components
│   ├── contexts/              # React Context providers
│   ├── lib/                   # Utility functions
│   │   ├── admin/             # Admin utilities
│   │   ├── supabase/          # Supabase clients
│   │   └── (helpers)/         # Helper functions
│   └── middleware.ts          # Next.js middleware
├── data/                      # Static data files
├── supabase/
│   └── migrations/            # Database migrations
├── scripts/                   # Utility scripts
├── public/                    # Static assets
└── docs/                      # Documentation
```

### Key Architectural Decisions

1. **App Router**: Using Next.js 14 App Router for better performance and developer experience
2. **Server Components**: Leveraging React Server Components for optimal performance
3. **Type Safety**: Full TypeScript coverage for type safety
4. **Component Composition**: Reusable, composable components
5. **Context API**: Global state management via React Context
6. **Database-First**: Supabase for database, auth, and storage

## 🚀 Quick Start

### Prerequisites

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher (or yarn/pnpm)
- **Git**: For version control
- **Supabase Account**: For database and authentication (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/growplantgrow.git
   cd growplantgrow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run database migrations**
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Run the migration from `supabase/migrations/20241202000000_create_admin_tables.sql`

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 💻 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run migrate      # Run database migrations (if configured)
```

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the [Contributing Guidelines](CONTRIBUTING.md)
   - Write tests for new features
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm run build      # Ensure build succeeds
   npm run lint       # Check for linting errors
   ```

4. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```
   Follow [Conventional Commits](https://www.conventionalcommits.org/) format.

5. **Push and create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js recommended rules
- **Formatting**: Prettier (recommended)
- **Naming**: camelCase for variables, PascalCase for components

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-side only) | Optional |

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy automatically on push

For deployment instructions, see your hosting provider's documentation or set up your own deployment process.

## 📚 API Documentation

### Public API Routes

- `GET /api/products` - List products
- `GET /api/products/[id]` - Get product details

### Admin API Routes

- `GET /api/admin/products` - List all products (admin only)
- `POST /api/admin/products` - Create product (admin only)
- `PUT /api/admin/products/[id]` - Update product (admin only)
- `DELETE /api/admin/products/[id]` - Delete product (admin only)

### Authentication

All admin routes require authentication and appropriate role permissions.

## 🧪 Testing

### Running Tests

```bash
# Unit tests (when implemented)
npm run test

# E2E tests (when implemented)
npm run test:e2e
```

### Test Coverage

- Unit tests for utility functions
- Integration tests for API routes
- E2E tests for critical user flows

## 🔒 Security

### Security Features

- **Authentication**: Supabase Auth with secure session management
- **Authorization**: Role-based access control (RBAC)
- **Data Protection**: Row Level Security (RLS) in Supabase
- **Input Validation**: Type-safe input handling
- **CSRF Protection**: Built into Next.js
- **XSS Prevention**: React's built-in escaping
- **Secure Headers**: Configured in Next.js config

### Security Best Practices

- Never commit `.env.local` files
- Use environment variables for secrets
- Regularly update dependencies
- Follow OWASP guidelines
- Implement rate limiting for API routes
- Audit logs for admin actions

See [SECURITY_SETUP.md](SECURITY_SETUP.md) for detailed security configuration.

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Quick Contribution Guide

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Documentation**: See `/docs` directory
- **Issues**: [GitHub Issues](https://github.com/yourusername/growplantgrow/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/growplantgrow/discussions)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Supabase](https://supabase.com/) for backend infrastructure
- [Tailwind CSS](https://tailwindcss.com/) for styling
- All contributors and users of this project

---

<div align="center">

**Built with ❤️ for plant lovers everywhere**

[Website](https://growplantgrow.com) • [Documentation](docs/) • [Changelog](CHANGELOG.md)

</div>
