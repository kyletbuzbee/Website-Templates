// Demo Content Importer Tool
// Handles template loading, preview, and demo content application

class DemoImporter {
  constructor() {
    this.templates = [];
    this.currentTemplate = null;
    this.currentDevice = 'desktop';
    this.init();
  }

  async init() {
    await this.loadTemplates();
    this.renderTemplates();
    this.bindEvents();
  }

  async loadTemplates() {
    // Define all available templates
    const templateConfigs = [
      {
        id: 'starter',
        name: 'Starter',
        description: 'Perfect for small businesses and startups. Clean, professional design with essential features.',
        type: 'kit',
        path: '../kits/starter/pages/home.html',
        demoPath: '../kits/starter/assets/demo-content.json',
        features: ['Lead Capture', 'Blog Integration', 'Contact Forms', 'Mobile Optimized'],
        badge: 'Popular',
        icon: '🚀'
      },
      {
        id: 'business',
        name: 'Business',
        description: 'Professional template for consulting firms and service businesses with advanced features.',
        type: 'kit',
        path: '../kits/business/pages/home.html',
        demoPath: '../kits/business/assets/demo-content.json',
        features: ['Pricing Tables', 'Case Studies', 'Team Profiles', 'Lead Generation'],
        badge: 'Professional',
        icon: '💼'
      },
      {
        id: 'creative',
        name: 'Creative',
        description: 'Stunning portfolio template for designers, agencies, and creative professionals.',
        type: 'kit',
        path: '../kits/creative/pages/home.html',
        demoPath: '../kits/creative/assets/demo-content.json',
        features: ['Portfolio Gallery', 'Animations', 'Interactive Elements', 'Creative Layout'],
        badge: 'Creative',
        icon: '🎨'
      },
      {
        id: 'premium-interactive',
        name: 'Premium Interactive',
        description: 'Enterprise-grade template with advanced configurator, multi-language support, and gated content.',
        type: 'kit',
        path: '../kits/premium-interactive/pages/home.html',
        demoPath: '../kits/premium-interactive/assets/demo-content.json',
        features: ['Product Configurator', 'Multi-language', 'Gated Resources', 'Enterprise Features'],
        badge: 'Enterprise',
        icon: '⭐'
      },
      {
        id: 'contractors-trades',
        name: 'Contractors & Trades',
        description: 'Specialized template for construction, remodeling, and trade professionals.',
        type: 'industry',
        path: '../industries/contractors-trades/pages/home.html',
        demoPath: '../industries/contractors-trades/assets/demo-content.json',
        features: ['Project Gallery', 'Trust Badges', 'Quote Forms', 'Industry Specific'],
        badge: 'Industry',
        icon: '🏗️'
      },
      {
        id: 'roofers-exterior',
        name: 'Roofers & Exterior',
        description: 'Complete roofing and exterior services template with emergency response features.',
        type: 'industry',
        path: '../industries/roofers-exterior/pages/home.html',
        demoPath: '../industries/roofers-exterior/assets/demo-content.json',
        features: ['Before/After Gallery', 'Seasonal Promotions', 'Pricing Tables', 'Emergency Response'],
        badge: 'Industry',
        icon: '🏠'
      }
    ];

    // Load demo content for each template
    for (const config of templateConfigs) {
      try {
        const demoResponse = await fetch(config.demoPath);
        if (demoResponse.ok) {
          const demoData = await demoResponse.json();
          this.templates.push({
            ...config,
            demoData
          });
        }
      } catch (error) {
        console.warn(`Failed to load demo data for ${config.name}:`, error);
        // Still add template without demo data
        this.templates.push(config);
      }
    }
  }

  renderTemplates() {
    const grid = document.getElementById('template-grid');

    this.templates.forEach(template => {
      const card = this.createTemplateCard(template);
      grid.appendChild(card);
    });
  }

  createTemplateCard(template) {
    const card = document.createElement('div');
    card.className = 'template-card';
    card.onclick = () => this.selectTemplate(template);

    card.innerHTML = `
      <div class="template-image">
        <div class="template-placeholder">${template.icon}</div>
        ${template.badge ? `<div class="template-badge">${template.badge}</div>` : ''}
      </div>
      <div class="template-content">
        <h3 class="template-title">${template.name}</h3>
        <p class="template-description">${template.description}</p>
        <div class="template-features">
          ${template.features.map(feature => `<span class="template-feature">${feature}</span>`).join('')}
        </div>
        <div class="template-actions">
          <button class="btn btn-primary" onclick="event.stopPropagation(); demoImporter.previewTemplate('${template.id}')">Preview</button>
          <button class="btn btn-secondary" onclick="event.stopPropagation(); demoImporter.downloadTemplate('${template.id}')">Download</button>
        </div>
      </div>
    `;

    return card;
  }

  async selectTemplate(template) {
    this.currentTemplate = template;

    // Update UI
    document.querySelectorAll('.template-card').forEach(card => {
      card.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');

    // Show preview section
    document.getElementById('preview-section').style.display = 'block';
    document.getElementById('preview-title').textContent = `${template.name} Template Preview`;

    // Load preview
    await this.previewTemplate(template.id);
  }

  async previewTemplate(templateId) {
    const template = this.templates.find(t => t.id === templateId);
    if (!template) return;

    const loading = document.getElementById('preview-loading');
    const iframe = document.getElementById('preview-iframe');

    // Show loading
    loading.style.display = 'flex';
    iframe.style.display = 'none';

    try {
      // Load template HTML
      const templateResponse = await fetch(template.path);
      if (!templateResponse.ok) throw new Error('Failed to load template');

      let html = await templateResponse.text();

      // Apply demo content if available
      if (template.demoData) {
        html = this.applyDemoContent(html, template.demoData);
      }

      // Set iframe content
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(html);
      iframeDoc.close();

      // Wait for content to load
      await new Promise(resolve => {
        iframe.onload = resolve;
        setTimeout(resolve, 1000); // Fallback timeout
      });

      // Apply responsive styles based on device
      this.updateDevicePreview();

      // Hide loading, show iframe
      loading.style.display = 'none';
      iframe.style.display = 'block';

    } catch (error) {
      console.error('Preview failed:', error);
      loading.innerHTML = '<div>Error loading preview. Please try again.</div>';
    }
  }

  applyDemoContent(html, demoData) {
    // Simple mustache-style template replacement
    // Replace {{variable}} with demoData values
    Object.keys(demoData).forEach(section => {
      if (typeof demoData[section] === 'object') {
        Object.keys(demoData[section]).forEach(key => {
          const value = demoData[section][key];
          if (typeof value === 'string') {
            const regex = new RegExp(`{{${section}\\.${key}}}`, 'g');
            html = html.replace(regex, this.escapeHtml(value));
          }
        });
      } else if (typeof demoData[section] === 'string') {
        const regex = new RegExp(`{{${section}}}`, 'g');
        html = html.replace(regex, this.escapeHtml(demoData[section]));
      }
    });

    // Handle array replacements (services, testimonials, etc.)
    this.applyArrayContent(html, demoData);

    return html;
  }

  applyArrayContent(html, demoData) {
    // Handle complex array replacements
    const arrayPatterns = {
      services: /{{#services}}(.*?){\{\/services}}/gs,
      testimonials: /{{#testimonials}}(.*?){\{\/testimonials}}/gs,
      projects: /{{#projects}}(.*?){\{\/projects}}/gs,
      features: /{{#features}}(.*?){\{\/features}}/gs,
      pricing_plans: /{{#pricing_plans}}(.*?){\{\/pricing_plans}}/gs
    };

    Object.keys(arrayPatterns).forEach(arrayKey => {
      const pattern = arrayPatterns[arrayKey];
      const match = html.match(pattern);

      if (match && demoData[arrayKey]) {
        const template = match[1];
        const items = demoData[arrayKey];
        let replacement = '';

        items.forEach(item => {
          let itemHtml = template;
          Object.keys(item).forEach(key => {
            const value = item[key];
            if (typeof value === 'string') {
              itemHtml = itemHtml.replace(new RegExp(`{{${key}}}`, 'g'), this.escapeHtml(value));
            } else if (typeof value === 'object' && value !== null) {
              // Handle nested objects
              Object.keys(value).forEach(nestedKey => {
                itemHtml = itemHtml.replace(new RegExp(`{{${key}\\.${nestedKey}}}`, 'g'), this.escapeHtml(value[nestedKey]));
              });
            }
          });
          replacement += itemHtml;
        });

        html = html.replace(pattern, replacement);
      }
    });

    return html;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  updateDevicePreview() {
    const iframe = document.getElementById('preview-iframe');
    if (!iframe.contentDocument) return;

    const iframeDoc = iframe.contentDocument;
    const viewport = iframeDoc.querySelector('meta[name="viewport"]');

    // Update viewport for different devices
    switch (this.currentDevice) {
      case 'mobile':
        iframe.style.width = '375px';
        iframe.style.height = '667px';
        if (viewport) viewport.content = 'width=375, initial-scale=1';
        break;
      case 'tablet':
        iframe.style.width = '768px';
        iframe.style.height = '1024px';
        if (viewport) viewport.content = 'width=768, initial-scale=1';
        break;
      case 'desktop':
      default:
        iframe.style.width = '100%';
        iframe.style.height = '600px';
        if (viewport) viewport.content = 'width=device-width, initial-scale=1';
        break;
    }
  }

  downloadTemplate(templateId) {
    const template = this.templates.find(t => t.id === templateId);
    if (!template) return;

    // Create download link
    const link = document.createElement('a');
    link.href = template.path;
    link.download = `${template.name.toLowerCase().replace(/\s+/g, '-')}-template.html`;
    link.click();
  }

  customizeTemplate() {
    if (!this.currentTemplate) return;

    // Open customization interface (could link to external tool)
    window.open(`templates/customizer.html?template=${this.currentTemplate.id}`, '_blank');
  }

  bindEvents() {
    // Device toggle buttons
    document.querySelectorAll('.device-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.device-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentDevice = btn.dataset.device;
        this.updateDevicePreview();
      });
    });
  }
}

// Global instance
const demoImporter = new DemoImporter();

// Global functions for HTML onclick handlers
function previewTemplate(templateId) {
  demoImporter.previewTemplate(templateId);
}

function downloadTemplate(templateId) {
  demoImporter.downloadTemplate(templateId);
}

function customizeTemplate() {
  demoImporter.customizeTemplate();
}
