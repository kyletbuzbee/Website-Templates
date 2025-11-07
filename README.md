# Production Ready Templates

A modern collection of professional website templates built with Vite, featuring automated asset distribution, PWA capabilities, and a comprehensive component system.

## ✨ Features

- 🚀 **Modern Build System**: Vite-powered development with hot reload
- 📱 **PWA Ready**: Progressive Web App with offline capabilities
- 🎨 **Component Architecture**: Reusable UI components with vanilla JavaScript
- 🖼️ **Automated Asset Pipeline**: Smart image optimization and distribution
- 🎯 **A/B Testing Framework**: Built-in experimentation capabilities
- 🌙 **Theme System**: Light/dark mode with CSS custom properties
- 📊 **Analytics Ready**: Structured for easy analytics integration
- ♿ **Accessibility**: WCAG compliant components and markup

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd production-ready-templates

# Install dependencies
npm install
```

### Development

```bash
# Start development server with hot reload
npm run dev

# Open http://localhost:3000 in your browser
```

### Building for Production

```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
├── public/                     # Static assets (favicons, PWA icons)
├── src/                        # Source code
│   ├── ab-testing/            # A/B testing framework
│   ├── components/            # Reusable UI components
│   ├── styles/                # Global styles and CSS variables
│   ├── utils/                 # Utility functions
│   ├── assets/                # Source assets
│   └── test/                  # Test configuration
├── scripts/                    # Build and utility scripts
│   ├── distribute-assets.js   # Asset distribution pipeline
│   ├── optimize-assets.js     # Advanced asset optimization
│   └── test-pipeline.js       # Pipeline testing
├── _raw_assets/               # Raw asset drop zone
├── [industries]/              # Industry-specific templates
│   └── [industry]/
│       └── [variant]/
│           ├── index.html
│           ├── style.css
│           ├── script.js
│           └── assets/
├── dist/                      # Production build output
└── package.json
```

## 🎨 Asset Management

### Automated Asset Pipeline

The project includes an intelligent asset pipeline that automatically processes and distributes images.

#### Naming Convention

Name your source images using this format:
```
[industry]-[section]-[description].[extension]
```

**Examples:**
- `roofing-hero-professional-crew.jpg` → `roofing/assets/images/`
- `fitness-about-trainer-team.png` → `fitness/assets/images/`
- `legal-hero-courtroom.webp` → `legal/assets/images/`

#### Usage

```bash
# Place images in the drop zone
# (copy images to _raw_assets/ folder)

# Run asset distribution
npm run distribute-assets

# Or run advanced optimization
npm run optimize-assets
```

### Manual Asset Optimization

For advanced optimization with WebP/AVIF conversion:

```bash
npm run optimize-assets -- --input _raw_assets --output assets --quality 80
```

## 🧩 Component System

### Available Components

- **ThemeToggle**: Light/dark theme switching
- **Navigation**: Responsive mobile-first navigation
- **Hero**: Hero section with customizable content
- **ContactForm**: Form with validation and submission

### Usage Example

```javascript
import { ThemeToggle, Navigation, Hero } from './src/components';

// Initialize components
const themeToggle = new ThemeToggle();
const navigation = new Navigation({
  links: [
    { text: 'Home', href: '#home' },
    { text: 'About', href: '#about' },
    { text: 'Contact', href: '#contact' }
  ]
});
const hero = new Hero({
  title: 'Welcome to Our Platform',
  subtitle: 'Build something amazing',
  ctaText: 'Get Started'
});
```

## 🎯 A/B Testing

The built-in A/B testing framework allows you to run experiments:

```javascript
import { ABTesting } from './src/ab-testing/ab-testing.js';

const abTest = new ABTesting();
abTest.createExperiment('hero-cta', [
  { name: 'blue-button', weight: 50 },
  { name: 'green-button', weight: 50 }
]);

// Get variant for current user
const variant = abTest.getVariant('hero-cta');
```

## 🛠️ Development Tools

### Code Quality

```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Run tests
npm run test

# Run tests with UI
npm run test:ui
```

### Build Optimization

The build system includes:
- **Code Splitting**: Automatic chunking for optimal loading
- **Asset Optimization**: Image compression and format conversion
- **CSS Optimization**: PostCSS processing with autoprefixing
- **PWA Generation**: Service worker and manifest creation
- **Legacy Support**: ES5 builds for older browsers

## 🌐 Progressive Web App

The project is PWA-ready with:
- Service worker for offline functionality
- Web app manifest
- Install prompts
- Background sync capabilities

## 📱 Responsive Design

All templates are built mobile-first with:
- Fluid typography using CSS custom properties
- Flexible grid systems
- Touch-friendly interactions
- Optimized performance across devices

## 🔧 Customization

### CSS Variables

The design system uses CSS custom properties for easy theming:

```css
:root {
  --color-primary: #2563eb;
  --spacing-lg: 2rem;
  --font-size-xl: 1.25rem;
  /* ... */
}
```

### Component Configuration

Components accept options objects for customization:

```javascript
const navigation = new Navigation({
  container: document.getElementById('nav'),
  links: [...],
  theme: 'dark'
});
```

## 📊 Analytics Integration

The architecture supports easy analytics integration:

```javascript
// Analytics utility
import { trackEvent } from './src/utils/analytics.js';

trackEvent('page_view', { page: window.location.pathname });
trackEvent('button_click', { button: 'cta', variant: 'primary' });
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

ISC License - see LICENSE file for details
