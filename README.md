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

### Comprehensive Asset Pipeline

The project features an **enterprise-grade automated asset pipeline** with intelligent processing, manifest generation, and template auto-updates.

#### 🚀 Key Features

- **9 Industry Auto-Detection** - Automatically recognizes all industry folders
- **Intelligent Format Selection** - SVG for icons, WebP/AVIF/JPEG for photos
- **Duplicate Prevention** - Skips processing of existing optimized assets
- **Asset Manifests** - JSON metadata for all optimized images
- **Template Auto-Update** - Converts `<img>` tags to modern `<picture>` elements
- **Build Integration** - Assets processed automatically during builds

#### 📁 Asset Organization

Images are automatically organized by industry:
```
├── contractors-trades/assets/
│   ├── manifest.json          # Asset metadata
│   └── images/               # Optimized images
│       ├── contractors-trades-hero-1.webp
│       ├── contractors-trades-hero-1.jpeg
│       └── contractors-trades-hero-1.avif
├── fitness/assets/
│   ├── manifest.json
│   └── images/
└── [other industries...]
```

### 🎯 Asset Distribution System

#### Naming Convention

Name your source images using this format:
```
[industry]-[section]-[description].[extension]
```

**Examples:**
- `roofing-hero-professional-crew.jpg` → `roofing/assets/images/`
- `fitness-about-trainer-team.png` → `fitness/assets/images/`
- `legal-hero-courtroom.webp` → `legal/assets/images/`

#### Quick Start

```bash
# 1. Place images in the drop zone
cp your-images/* _raw_assets/

# 2. Process and distribute assets
npm run distribute-assets

# 3. Update templates with optimized images
npm run update-templates

# Or do everything at once
npm run build:full
```

#### Advanced Usage

```bash
# Process specific industry only
npm run distribute-assets -- --industry roofing

# Rename icons from subfolders first
npm run assets:rename-icons

# Full asset pipeline
npm run assets:build

# Manual optimization with custom settings
npm run optimize-assets -- --quality 90 --concurrency 2
```

### 📋 Asset Manifests

Each industry gets a comprehensive manifest file:

```json
{
  "version": "1.0.0",
  "industry": "healthcare",
  "generated": "2025-11-08T22:57:39.000Z",
  "images": {
    "hero-1": {
      "original": "healthcare-hero-1.jpg",
      "formats": ["webp", "jpeg", "avif"],
      "sizes": {
        "webp": 245680,
        "jpeg": 312450,
        "avif": 198320
      },
      "dimensions": {"width": 1920, "height": 1080}
    }
  },
  "stats": {
    "totalImages": 45,
    "totalSize": "12.3MB",
    "spaceSaved": "34%"
  }
}
```

### 🎨 Template Auto-Update

Templates are automatically updated to use modern `<picture>` elements:

**Before:**
```html
<img src="assets/images/hero-1.jpg" alt="Hero">
```

**After:**
```html
<picture>
  <source srcset="assets/images/healthcare-hero-1.avif" type="image/avif">
  <source srcset="assets/images/healthcare-hero-1.webp" type="image/webp">
  <img src="assets/images/healthcare-hero-1.jpeg" alt="Hero" loading="lazy">
</picture>
```

### 🏗️ Build Integration

Assets are automatically processed during builds:

```bash
# Standard build (includes asset processing)
npm run build

# Full build with template updates
npm run build:full

# Deploy preparation (includes all quality checks)
npm run deploy:prepare
```

### 📊 Performance Benefits

- **Modern Formats**: AVIF/WebP for 30-50% smaller file sizes
- **Lazy Loading**: Automatic `loading="lazy"` attributes
- **Responsive Images**: Multiple formats for optimal delivery
- **Duplicate Prevention**: No wasted processing time
- **Build Optimization**: Assets processed once, reused everywhere

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
