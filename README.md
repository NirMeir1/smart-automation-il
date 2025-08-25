# אוטומציה חכמה - Smart Automation IL

Production-grade website showcasing automation solutions for Israeli businesses.

## 🎯 Features
- ✅ **RTL Hebrew Support** – Fully optimized for Hebrew language and RTL layout
- ✅ **Accessibility** – WCAG 2.1 compliant with screen reader support
- ✅ **Performance** – Optimized Core Web Vitals and fast loading
- ✅ **Responsive Design** – Mobile-first approach across breakpoints
- ✅ **Admin Panel** – Data management and analytics dashboard
- ✅ **Event Logging** – Comprehensive user interaction tracking
- ✅ **Error Handling** – Graceful error boundaries and recovery
- ✅ **Testing** – Unit and integration tests with Vitest

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

Create a `.env.local` file to configure the admin password:
```bash
NEXT_PUBLIC_ADMIN_PASSWORD=your_password
```

## 📁 Project Structure
```
src/
├── app/                    # Next.js app router pages
│   ├── about/             # About page
│   ├── admin/             # Admin panel
│   ├── contact/           # Contact form
│   ├── legal/             # Terms & Privacy pages
│   └── testimonials/      # Testimonials page
├── components/
│   ├── admin/             # Admin components
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

## 🧪 Testing
```bash
npm run lint
npm run test:run
```
