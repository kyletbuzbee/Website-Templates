# Photography Template - Quick Start Guide

## Overview
The Photography template is designed for professional photographers, photography studios, and photography service providers. It showcases portfolios, services, pricing, and booking functionality.

## Features
- **Portfolio Gallery**: Showcase featured work with categories
- **Service Packages**: Wedding, portrait, event, and commercial photography
- **Pricing Display**: Transparent pricing with package options
- **Booking System**: Availability calendar and contact forms
- **Testimonials**: Client reviews and ratings
- **Process Steps**: 4-step photography workflow explanation

## Quick Setup

### 1. Content Customization
Edit `industries/photography/assets/demo-content.json`:
```json
{
  "company": {
    "name": "Your Photography Business",
    "tagline": "Your Unique Tagline",
    "specialties": "Your Photography Specialties"
  }
}
```

### 2. Branding
Update the branding section:
```json
{
  "branding": {
    "primary_color": "#your-brand-color",
    "secondary_color": "#your-secondary-color",
    "logo": "/path/to/your/logo.png"
  }
}
```

### 3. Portfolio
Replace portfolio images and descriptions:
```json
{
  "featured_work": [
    {
      "title": "Your Best Work",
      "image": "/path/to/your/portfolio/image.jpg",
      "category": "Weddings"
    }
  ]
}
```

### 4. Services & Pricing
Customize service offerings:
```json
{
  "services": [
    {
      "name": "Your Service",
      "price": "Starting at $XXX",
      "features": ["Feature 1", "Feature 2"]
    }
  ]
}
```

## Template Structure
```
industries/photography/
├── assets/
│   └── demo-content.json    # All template content
├── components/              # Custom components (if needed)
├── docs/
│   ├── quick-start.md       # This guide
│   └── cms-integration.json # CMS integration config
└── pages/                   # Template pages (future)
```

## Customization Options

### Hero Section
- Main headline and subtitle
- Hero background image
- Call-to-action buttons

### Portfolio Section
- Featured work gallery
- Category filtering
- Image descriptions

### Services Section
- Service packages
- Pricing information
- Feature lists

### About Section
- Photographer bio
- Experience highlights
- Photography philosophy

### Testimonials
- Client reviews
- Star ratings
- Service categories

### Contact/Booking
- Contact information
- Availability calendar
- Booking forms

## A/B Testing Ready
This template includes A/B testing hooks for:
- Hero button colors
- Pricing display formats
- Call-to-action text
- Portfolio layouts

## Live Customization
Use the customization panel to:
- Change colors and fonts
- Modify button text
- Update pricing
- Add/remove sections

## Deployment
1. Customize content in `demo-content.json`
2. Test with `npm run dev`
3. Build with `npm run build`
4. Deploy `dist/` folder to hosting

## Support
- Template validation: `npm run templates:validate`
- Build testing: `npm run build`
- Performance audit: `npm run performance:audit`

## Next Steps
1. Replace demo images with your actual photography
2. Update contact information and social links
3. Customize pricing and service packages
4. Add your real testimonials
5. Configure booking system integration
