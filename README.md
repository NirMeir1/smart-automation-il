# אוטומציה חכמה - Smart Automation IL

Production-grade website showcasing automation solutions for Israeli businesses with three interactive demo systems.

## 🎯 Features

### Interactive Demos
1. **Smart Israeli Tax & Invoice Assistant** - VAT calculation and payment reminders
2. **Appointment Scheduler & Reminder Bot** - Automated booking and notifications  
3. **Lead Capture & Follow-Up Automation** - Contact form with automated responses

### Core Features
- ✅ **RTL Hebrew Support** - Fully optimized for Hebrew language and RTL layout
- ✅ **Accessibility** - WCAG 2.1 compliant with screen reader support
- ✅ **Performance** - Optimized Core Web Vitals and fast loading
- ✅ **Responsive Design** - Mobile-first approach with all breakpoints
- ✅ **Admin Panel** - Data management and analytics dashboard
- ✅ **Event Logging** - Comprehensive user interaction tracking
- ✅ **Error Handling** - Graceful error boundaries and recovery
- ✅ **Testing** - Unit and integration tests with Vitest

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd smart-automation-il

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── about/             # About page
│   ├── admin/             # Admin panel (password: demo2024!)
│   ├── contact/           # Contact form
│   ├── demos/             # Interactive demos
│   ├── legal/             # Terms & Privacy pages
│   ├── pricing/           # Pricing page
│   └── testimonials/      # Testimonials page
├── components/
│   ├── admin/             # Admin components
│   ├── demos/             # Demo implementations
│   ├── layout/            # Navigation, footer
│   ├── providers/         # Context providers
│   └── ui/                # Reusable UI components
├── lib/
│   ├── accessibility.ts   # A11y utilities
│   ├── auth.ts            # Admin authentication
│   ├── error-handling.ts  # Error utilities
│   ├── performance.ts     # Performance monitoring
│   ├── storage.ts         # LocalStorage management
│   ├── types.ts           # TypeScript types
│   └── utils.ts           # General utilities
└── test/                  # Test files
```

## 🎮 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:coverage # Run tests with coverage
npm run type-check   # TypeScript type checking
```

## 📊 Demo Data Management

### Local Storage
- Demo data is stored locally in browser storage
- Automatically seeded on first visit
- No real data is transmitted to servers

### Admin Panel Access
1. Navigate to `/admin`
2. Enter password: `demo2024!`
3. View analytics, manage data, reset demos

### Reset Instructions
- **Admin Reset**: Restores seeded demo data
- **Clear All**: Completely removes all data
- **Auto-Reset**: Demos reset after browser cache clear

## 🎯 Core Demos

### 1. Tax & Invoice Assistant (`/demos`)
- Add income and expenses with VAT calculation
- Real-time VAT computation (17% Israel rate)
- Monthly payment reminders with due dates
- Hebrew WhatsApp message preview

**Key Features:**
- Automatic VAT-included/excluded calculations
- Current month summary with totals
- Payment due date (15th of following month)
- Simulated reminder notifications

### 2. Appointment Scheduler (`/demos`) 
- 7-day availability calendar
- Real-time slot booking and management
- Client information capture
- Automated confirmation and reminders

**Key Features:**
- Conflict prevention (no double-booking)
- Hebrew confirmation messages
- Calendar integration simulation
- SMS/Email reminder previews

### 3. Lead Capture & Follow-up (`/demos`)
- Contact form with validation
- Source tracking (Google, Facebook, referral, etc.)
- Automatic follow-up scheduling (+3 days)
- Status management pipeline

**Key Features:**
- Instant auto-reply preview
- Lead qualification workflow
- Follow-up date automation
- Pipeline status tracking

## 🌐 Internationalization

### Hebrew (RTL) Support
- Complete RTL layout with proper text alignment
- Hebrew fonts (Heebo) optimized for web
- Currency formatting (₪) and date formats (DD/MM/YYYY)
- Right-to-left navigation and form layouts

### Date & Currency
```typescript
// Currency formatting
formatCurrency(1000) // "₪1,000.00"

// Date formatting  
formatDate(new Date()) // "15/01/2024"

// VAT calculations (Israel 17% rate)
calculateVAT(117, true) // { net: 100, vat: 17, gross: 117 }
```

## ♿ Accessibility Features

### Keyboard Navigation
- Skip links to main content
- Full keyboard navigation support
- Focus management in modals
- Tab trapping in dialogs

### Screen Reader Support
- Semantic HTML structure
- ARIA labels and descriptions
- Live regions for dynamic content
- Screen reader announcements

### Visual Accessibility
- High contrast mode support
- Sufficient color contrast ratios
- Focus indicators on all interactive elements
- Reduced motion preference support

## 🚀 Performance Optimizations

### Core Web Vitals
- **FCP**: First Contentful Paint monitoring
- **LCP**: Largest Contentful Paint tracking
- **FID**: First Input Delay measurement
- **CLS**: Cumulative Layout Shift prevention

### Optimization Techniques
- Component lazy loading
- Image optimization with Next.js
- Bundle size monitoring
- Performance metrics collection

## 🧪 Testing

### Test Coverage
- ✅ Utility functions (VAT calculations, formatting)
- ✅ Validation logic and error handling
- ✅ Component rendering and interactions
- ✅ Accessibility compliance
- ✅ Performance metrics

### Running Tests
```bash
# Watch mode during development
npm run test

# Single run for CI/CD
npm run test:run

# With coverage report
npm run test:coverage
```

## 🔐 Security

### Data Protection
- No sensitive data transmission
- Demo data clearly marked as simulation
- Input sanitization and validation
- XSS prevention measures

### Admin Security
- Session-based authentication
- Password-protected admin access
- Event logging for audit trails
- Safe error messages (no internal details)

## 📈 Analytics & Monitoring

### Event Tracking
- Page views with performance metrics
- Demo interactions and usage patterns
- Form submissions and conversions
- Error logging and debugging

### Admin Analytics
- Real-time usage statistics
- Demo performance metrics
- User interaction patterns
- System health monitoring

## 🛠️ Development

### Code Quality
- TypeScript for type safety
- ESLint for code consistency
- Prettier for formatting
- Vitest for testing

### Git Workflow
- Feature branch development
- Conventional commit messages
- Pre-commit hooks for quality
- Automated testing on PR

## 🚀 Deployment

### Build Process
```bash
npm run build    # Production build
npm run start    # Start production server
```

### Environment Variables
No environment variables required for demo functionality.

### Hosting Recommendations
- **Vercel**: Optimal for Next.js (recommended)
- **Netlify**: Static export compatible
- **Docker**: Container deployment ready

## 📞 Support

### Demo Issues
- Check browser localStorage is enabled
- Try incognito mode for fresh demo data
- Use admin panel to reset if needed

### Technical Support
- Review error logs in admin panel
- Check browser console for client errors
- Verify network requests in DevTools

## 📄 License

This project is licensed for demonstration purposes. All rights reserved.

---

**Built with ❤️ for the Israeli business community**

*אוטומציה חכמה - פתרונות מתקדמים לעסקים ישראליים*
