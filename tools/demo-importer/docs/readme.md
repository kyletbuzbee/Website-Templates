# Demo Content Importer Tool

The Demo Content Importer is a web-based tool that allows non-technical users to preview and download website templates with realistic demo content applied instantly.

## Features

- **Instant Preview**: Preview any template with demo content applied without setup
- **Responsive Testing**: Test templates across desktop, tablet, and mobile viewports
- **One-Click Download**: Download templates with demo content pre-populated
- **Template Library**: Access to all 8 available templates (4 kits + 4 industry variants)
- **Real Demo Data**: Professional-quality placeholder content for realistic previews

## How It Works

### Template Loading
The tool loads template configurations from a predefined list, including:
- Template metadata (name, description, features)
- File paths for HTML templates and demo content JSON
- Template categorization (kit vs industry-specific)

### Demo Content Application
Templates use mustache-style variable replacement (`{{variable}}`) to inject demo content:

```html
<!-- Template with variables -->
<h1>{{hero.title}}</h1>
<p>{{hero.subtitle}}</p>

<!-- Becomes with demo content -->
<h1>Welcome to Our Business</h1>
<p>We provide exceptional services...</p>
```

### Array Content Handling
Complex content like services, testimonials, and pricing plans use block helpers:

```html
{{#services}}
<div class="service">
  <h3>{{title}}</h3>
  <p>{{description}}</p>
</div>
{{/services}}
```

## File Structure

```
tools/demo-importer/
├── index.html              # Main interface
├── scripts/
│   └── demo-importer.js    # Core functionality
└── docs/
    └── readme.md          # This documentation
```

## Usage

### For End Users

1. **Select Template**: Click on any template card to select it
2. **Preview**: Click "Preview" to see the template with demo content
3. **Test Responsiveness**: Use device toggle buttons (Desktop/Tablet/Mobile)
4. **Download**: Click "Download" to get the HTML file with demo content applied

### For Developers

#### Adding New Templates

1. Add template configuration to `templateConfigs` array in `demo-importer.js`:

```javascript
{
  id: 'new-template',
  name: 'New Template',
  description: 'Description of the template',
  type: 'kit', // or 'industry'
  path: '../path/to/template.html',
  demoPath: '../path/to/demo-content.json',
  features: ['Feature 1', 'Feature 2'],
  badge: 'Optional Badge',
  icon: '🚀'
}
```

2. Create demo content JSON file following the template's variable structure
3. Update template HTML to use mustache-style variables

#### Demo Content Format

Demo content should be structured JSON matching template variables:

```json
{
  "hero": {
    "title": "Welcome Message",
    "subtitle": "Tagline here",
    "cta_text": "Call to Action"
  },
  "services": [
    {
      "title": "Service 1",
      "description": "Description",
      "icon": "icon-class"
    }
  ],
  "contact": {
    "phone": "(555) 123-4567",
    "email": "info@company.com"
  }
}
```

## Technical Details

### Browser Compatibility
- Modern browsers with ES6+ support
- Requires `fetch` API for loading templates
- Uses iframe for template preview

### Security Considerations
- Templates loaded via same-origin or CORS-enabled sources
- Demo content sanitized through `escapeHtml()` function
- No server-side processing required

### Performance
- Templates cached in memory after first load
- Lazy loading of demo content
- Efficient DOM manipulation for previews

## Customization Options

### Styling
The interface uses embedded CSS that can be customized by modifying the `<style>` block in `index.html`.

### Device Viewports
Device dimensions can be adjusted in the `updateDevicePreview()` method:

```javascript
case 'mobile':
  iframe.style.width = '375px';  // iPhone width
  iframe.style.height = '667px'; // iPhone height
```

### Template Variables
Extend the `applyDemoContent()` method to support additional template syntax or complex logic.

## Troubleshooting

### Template Not Loading
- Check file paths in template configuration
- Ensure templates are accessible via HTTP/HTTPS
- Verify CORS headers if loading from different domain

### Demo Content Not Applying
- Check JSON syntax in demo content files
- Verify variable names match template placeholders
- Ensure mustache syntax is correct (`{{variable}}`)

### Preview Issues
- Clear browser cache
- Check console for JavaScript errors
- Verify iframe content security policy

## Future Enhancements

- Template customization interface
- Batch download multiple templates
- Export with different demo content sets
- Integration with CMS platforms
- Template comparison view
- Search and filtering capabilities
