/**
 * SEO Optimizer Component
 * Handles dynamic meta tags, schema.org markup, and SEO optimization
 */

interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  author: string;
  image: string;
  url: string;
  type: 'website' | 'article' | 'product' | 'business';
  siteName: string;
  locale: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

interface BusinessData {
  name: string;
  description: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo: {
    latitude: number;
    longitude: number;
  };
  telephone: string;
  email: string;
  url: string;
  openingHours: string[];
  priceRange: string;
  image: string;
  logo: string;
}

interface SchemaMarkup {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

class SEOOptimizer extends HTMLElement {
  private seoData: SEOData;
  private businessData: BusinessData | null = null;
  private schemaMarkup: SchemaMarkup[] = [];

  constructor() {
    super();
    this.seoData = {
      title: 'Professional Business Website',
      description: 'High-quality services and solutions for your business needs',
      keywords: ['business', 'services', 'professional', 'quality'],
      author: 'Business Owner',
      image: '/assets/og-image.jpg',
      url: window.location.href,
      type: 'website',
      siteName: 'Business Website',
      locale: 'en_US',
    };
  }

  connectedCallback(): void {
    this.render();
    this.bindEvents();
    this.initializeSEO();
  }

  private render(): void {
    this.innerHTML = `
      <div class="seo-optimizer">
        <div class="seo-header">
          <h3 class="seo-title">🔍 SEO Optimizer</h3>
          <p class="seo-description">Optimize your template for search engines and social media</p>
        </div>

        <div class="seo-tabs">
          <button class="seo-tab active" data-tab="basic">Basic SEO</button>
          <button class="seo-tab" data-tab="social">Social Media</button>
          <button class="seo-tab" data-tab="schema">Schema Markup</button>
          <button class="seo-tab" data-tab="business">Business Info</button>
        </div>

        <div class="seo-content">
          <!-- Basic SEO Tab -->
          <div class="seo-tab-content active" data-tab="basic">
            <div class="seo-section">
              <h4>📄 Page Information</h4>

              <div class="seo-field">
                <label for="page-title">Page Title (50-60 characters)</label>
                <input type="text" id="page-title" value="Professional Business Website" maxlength="60">
                <div class="char-counter">
                  <span id="title-counter">28</span>/60 characters
                </div>
              </div>

              <div class="seo-field">
                <label for="page-description">Meta Description (120-160 characters)</label>
                <textarea id="page-description" rows="3" maxlength="160">High-quality services and solutions for your business needs. Professional expertise with proven results.</textarea>
                <div class="char-counter">
                  <span id="description-counter">98</span>/160 characters
                </div>
              </div>

              <div class="seo-field">
                <label for="page-keywords">Keywords (comma-separated)</label>
                <input type="text" id="page-keywords" value="business, services, professional, quality" placeholder="keyword1, keyword2, keyword3">
              </div>

              <div class="seo-field">
                <label for="page-author">Author</label>
                <input type="text" id="page-author" value="Business Owner">
              </div>
            </div>

            <div class="seo-section">
              <h4>🎯 SEO Score</h4>
              <div class="seo-score">
                <div class="score-circle" id="seo-score">
                  <span class="score-number">85</span>
                  <span class="score-label">Good</span>
                </div>
                <div class="score-details">
                  <div class="score-item good">
                    ✅ Title length optimized
                  </div>
                  <div class="score-item good">
                    ✅ Meta description present
                  </div>
                  <div class="score-item warning">
                    ⚠️ Add more keywords
                  </div>
                  <div class="score-item good">
                    ✅ Author specified
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Social Media Tab -->
          <div class="seo-tab-content" data-tab="social">
            <div class="seo-section">
              <h4>📱 Social Media Optimization</h4>

              <div class="social-preview">
                <h5>Facebook/Open Graph Preview</h5>
                <div class="social-card facebook">
                  <div class="social-image">
                    <img id="og-image-preview" src="/assets/og-image.jpg" alt="Preview">
                  </div>
                  <div class="social-content">
                    <div class="social-title" id="og-title-preview">Professional Business Website</div>
                    <div class="social-description" id="og-description-preview">High-quality services and solutions for your business needs.</div>
                    <div class="social-url">yourwebsite.com</div>
                  </div>
                </div>
              </div>

              <div class="social-preview">
                <h5>Twitter Card Preview</h5>
                <div class="social-card twitter">
                  <div class="social-image">
                    <img id="twitter-image-preview" src="/assets/og-image.jpg" alt="Preview">
                  </div>
                  <div class="social-content">
                    <div class="social-title" id="twitter-title-preview">Professional Business Website</div>
                    <div class="social-description" id="twitter-description-preview">High-quality services and solutions for your business needs.</div>
                    <div class="social-url">yourwebsite.com</div>
                  </div>
                </div>
              </div>

              <div class="seo-field">
                <label for="og-image">Open Graph Image URL</label>
                <input type="url" id="og-image" value="/assets/og-image.jpg">
              </div>

              <div class="seo-field">
                <label for="twitter-handle">Twitter Handle (optional)</label>
                <input type="text" id="twitter-handle" placeholder="@yourhandle">
              </div>
            </div>
          </div>

          <!-- Schema Markup Tab -->
          <div class="seo-tab-content" data-tab="schema">
            <div class="seo-section">
              <h4>🏷️ Schema.org Markup</h4>

              <div class="schema-options">
                <label class="schema-option">
                  <input type="checkbox" id="schema-webpage" checked>
                  <span>WebPage</span>
                  <small>Basic webpage markup</small>
                </label>

                <label class="schema-option">
                  <input type="checkbox" id="schema-organization">
                  <span>Organization</span>
                  <small>Business/organization info</small>
                </label>

                <label class="schema-option">
                  <input type="checkbox" id="schema-local-business">
                  <span>LocalBusiness</span>
                  <small>Local business information</small>
                </label>

                <label class="schema-option">
                  <input type="checkbox" id="schema-breadcrumb">
                  <span>BreadcrumbList</span>
                  <small>Navigation breadcrumbs</small>
                </label>
              </div>

              <div class="schema-preview">
                <h5>Generated Schema Markup</h5>
                <pre id="schema-json" class="schema-code"><code>{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Professional Business Website",
  "description": "High-quality services and solutions for your business needs",
  "url": "https://yourwebsite.com"
}</code></pre>
              </div>
            </div>
          </div>

          <!-- Business Info Tab -->
          <div class="seo-tab-content" data-tab="business">
            <div class="seo-section">
              <h4>🏢 Business Information</h4>

              <div class="business-fields">
                <div class="seo-field">
                  <label for="business-name">Business Name</label>
                  <input type="text" id="business-name" value="Your Business Name">
                </div>

                <div class="seo-field">
                  <label for="business-description">Business Description</label>
                  <textarea id="business-description" rows="3">Professional services and solutions for businesses</textarea>
                </div>

                <div class="address-fields">
                  <h5>📍 Address</h5>
                  <div class="field-row">
                    <div class="seo-field">
                      <label for="street-address">Street Address</label>
                      <input type="text" id="street-address" value="123 Business St">
                    </div>
                    <div class="seo-field">
                      <label for="city">City</label>
                      <input type="text" id="city" value="Business City">
                    </div>
                  </div>
                  <div class="field-row">
                    <div class="seo-field">
                      <label for="state">State/Province</label>
                      <input type="text" id="state" value="State">
                    </div>
                    <div class="seo-field">
                      <label for="zip">ZIP/Postal Code</label>
                      <input type="text" id="zip" value="12345">
                    </div>
                  </div>
                  <div class="seo-field">
                    <label for="country">Country</label>
                    <input type="text" id="country" value="United States">
                  </div>
                </div>

                <div class="contact-fields">
                  <h5>📞 Contact Information</h5>
                  <div class="field-row">
                    <div class="seo-field">
                      <label for="business-phone">Phone</label>
                      <input type="tel" id="business-phone" value="(555) 123-4567">
                    </div>
                    <div class="seo-field">
                      <label for="business-email">Email</label>
                      <input type="email" id="business-email" value="info@yourbusiness.com">
                    </div>
                  </div>
                </div>

                <div class="seo-field">
                  <label for="business-hours">Opening Hours (JSON format)</label>
                  <input type="text" id="business-hours" value='["Mo-Fr 09:00-17:00", "Sa 09:00-12:00"]' placeholder='["Mo-Fr 09:00-17:00"]'>
                </div>

                <div class="seo-field">
                  <label for="price-range">Price Range</label>
                  <select id="price-range">
                    <option value="$$">$$ (Moderate)</option>
                    <option value="$$$">$$$ (Expensive)</option>
                    <option value="$$$$">$$$$ (Very Expensive)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="seo-actions">
          <button class="seo-btn seo-generate" id="generate-seo">
            ⚡ Generate SEO Tags
          </button>

          <button class="seo-btn seo-preview" id="preview-seo">
            👁️ Preview Meta Tags
          </button>

          <div class="seo-status" id="seo-status"></div>
        </div>
      </div>
    `;
  }

  private bindEvents(): void {
    // Tab switching
    const tabs = this.querySelectorAll('.seo-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', e => {
        const target = e.target as HTMLElement;
        const tabName = target.dataset.tab;
        this.switchTab(tabName!);
      });
    });

    // Real-time updates
    const titleInput = this.querySelector('#page-title') as HTMLInputElement;
    const descriptionInput = this.querySelector('#page-description') as HTMLTextAreaElement;

    if (titleInput) {
      titleInput.addEventListener('input', () => {
        this.updateTitleCounter();
        this.updateSEO();
      });
    }

    if (descriptionInput) {
      descriptionInput.addEventListener('input', () => {
        this.updateDescriptionCounter();
        this.updateSEO();
      });
    }

    // Generate SEO button
    const generateBtn = this.querySelector('#generate-seo') as HTMLButtonElement;
    if (generateBtn) {
      generateBtn.addEventListener('click', () => this.generateSEOTags());
    }

    // Preview button
    const previewBtn = this.querySelector('#preview-seo') as HTMLButtonElement;
    if (previewBtn) {
      previewBtn.addEventListener('click', () => this.previewMetaTags());
    }

    // Schema checkboxes
    const schemaCheckboxes = this.querySelectorAll('input[type="checkbox"][id^="schema-"]');
    schemaCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => this.updateSchemaPreview());
    });
  }

  private switchTab(tabName: string): void {
    // Update tab buttons
    const tabs = this.querySelectorAll('.seo-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    const activeTab = this.querySelector(`[data-tab="${tabName}"]`);
    if (activeTab) {
      activeTab.classList.add('active');
    }

    // Update tab content
    const contents = this.querySelectorAll('.seo-tab-content');
    contents.forEach(content => content.classList.remove('active'));
    const activeContent = this.querySelector(`[data-tab="${tabName}"]`);
    if (activeContent) {
      activeContent.classList.add('active');
    }
  }

  private updateTitleCounter(): void {
    const titleInput = this.querySelector('#page-title') as HTMLInputElement;
    const counter = this.querySelector('#title-counter');
    if (titleInput && counter) {
      counter.textContent = titleInput.value.length.toString();
    }
  }

  private updateDescriptionCounter(): void {
    const descInput = this.querySelector('#page-description') as HTMLTextAreaElement;
    const counter = this.querySelector('#description-counter');
    if (descInput && counter) {
      counter.textContent = descInput.value.length.toString();
    }
  }

  private updateSEO(): void {
    // Collect form data
    const titleInput = this.querySelector('#page-title') as HTMLInputElement;
    const descInput = this.querySelector('#page-description') as HTMLTextAreaElement;
    const keywordsInput = this.querySelector('#page-keywords') as HTMLInputElement;
    const authorInput = this.querySelector('#page-author') as HTMLInputElement;
    const ogImageInput = this.querySelector('#og-image') as HTMLInputElement;

    this.seoData = {
      ...this.seoData,
      title: titleInput?.value || this.seoData.title,
      description: descInput?.value || this.seoData.description,
      keywords: keywordsInput?.value.split(',').map(k => k.trim()) || this.seoData.keywords,
      author: authorInput?.value || this.seoData.author,
      image: ogImageInput?.value || this.seoData.image,
    };

    // Update social previews
    this.updateSocialPreviews();

    // Update SEO score
    this.updateSEOScore();
  }

  private updateSocialPreviews(): void {
    const ogTitle = this.querySelector('#og-title-preview');
    const ogDesc = this.querySelector('#og-description-preview');
    const twitterTitle = this.querySelector('#twitter-title-preview');
    const twitterDesc = this.querySelector('#twitter-description-preview');

    if (ogTitle) {
      ogTitle.textContent = this.seoData.title;
    }
    if (ogDesc) {
      ogDesc.textContent = this.seoData.description;
    }
    if (twitterTitle) {
      twitterTitle.textContent = this.seoData.title;
    }
    if (twitterDesc) {
      twitterDesc.textContent = this.seoData.description;
    }
  }

  private updateSEOScore(): void {
    let score = 0;
    const checks = [];

    // Title length check (30-60 chars)
    if (this.seoData.title.length >= 30 && this.seoData.title.length <= 60) {
      score += 25;
      checks.push({ type: 'good', text: '✅ Title length optimized' });
    } else {
      checks.push({ type: 'warning', text: '⚠️ Title length should be 30-60 characters' });
    }

    // Description length check (120-160 chars)
    if (this.seoData.description.length >= 120 && this.seoData.description.length <= 160) {
      score += 25;
      checks.push({ type: 'good', text: '✅ Meta description length optimized' });
    } else {
      checks.push({ type: 'warning', text: '⚠️ Meta description should be 120-160 characters' });
    }

    // Keywords check
    if (this.seoData.keywords.length >= 3) {
      score += 25;
      checks.push({ type: 'good', text: '✅ Keywords specified' });
    } else {
      checks.push({ type: 'warning', text: '⚠️ Add more keywords (3+ recommended)' });
    }

    // Author check
    if (this.seoData.author) {
      score += 25;
      checks.push({ type: 'good', text: '✅ Author specified' });
    } else {
      checks.push({ type: 'warning', text: '⚠️ Add author information' });
    }

    // Update score display
    const scoreElement = this.querySelector('#seo-score .score-number');
    const scoreLabel = this.querySelector('#seo-score .score-label');
    const scoreDetails = this.querySelector('.score-details');

    if (scoreElement) {
      scoreElement.textContent = score.toString();
    }
    if (scoreLabel) {
      if (score >= 80) {
        scoreLabel.textContent = 'Excellent';
      } else if (score >= 60) {
        scoreLabel.textContent = 'Good';
      } else if (score >= 40) {
        scoreLabel.textContent = 'Fair';
      } else {
        scoreLabel.textContent = 'Poor';
      }
    }

    if (scoreDetails) {
      scoreDetails.innerHTML = checks
        .map(check => `<div class="score-item ${check.type}">${check.text}</div>`)
        .join('');
    }
  }

  private updateSchemaPreview(): void {
    const schemaJson = this.querySelector('#schema-json code');
    if (!schemaJson) {
      return;
    }

    const schemas = this.generateSchemaMarkup();
    const jsonString = JSON.stringify(schemas[0] || {}, null, 2);
    schemaJson.textContent = jsonString;
  }

  private generateSchemaMarkup(): SchemaMarkup[] {
    const schemas: SchemaMarkup[] = [];

    // WebPage schema (always included)
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: this.seoData.title,
      description: this.seoData.description,
      url: this.seoData.url,
      inLanguage: this.seoData.locale,
      datePublished: this.seoData.publishedTime,
      dateModified: this.seoData.modifiedTime,
    });

    // Organization schema
    if ((this.querySelector('#schema-organization') as HTMLInputElement)?.checked) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: this.businessData?.name || this.seoData.siteName,
        description: this.businessData?.description || this.seoData.description,
        url: this.businessData?.url || this.seoData.url,
        logo: this.businessData?.logo || this.seoData.image,
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: this.businessData?.telephone,
          email: this.businessData?.email,
          contactType: 'customer service',
        },
      });
    }

    // LocalBusiness schema
    if (
      (this.querySelector('#schema-local-business') as HTMLInputElement)?.checked &&
      this.businessData
    ) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: this.businessData.name,
        description: this.businessData.description,
        address: {
          '@type': 'PostalAddress',
          ...this.businessData.address,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: this.businessData.geo.latitude,
          longitude: this.businessData.geo.longitude,
        },
        telephone: this.businessData.telephone,
        email: this.businessData.email,
        url: this.businessData.url,
        openingHours: this.businessData.openingHours,
        priceRange: this.businessData.priceRange,
        image: this.businessData.image,
      });
    }

    return schemas;
  }

  private async generateSEOTags(): Promise<void> {
    const statusEl = this.querySelector('#seo-status') as HTMLElement;
    const generateBtn = this.querySelector('#generate-seo') as HTMLButtonElement;

    if (!statusEl || !generateBtn) {
      return;
    }

    try {
      // Update UI
      generateBtn.disabled = true;
      generateBtn.textContent = '⏳ Generating...';
      statusEl.textContent = 'Generating SEO meta tags...';

      // Collect all form data
      this.collectSEOData();

      // Generate meta tags
      const metaTags = this.generateMetaTagsHTML();

      // Generate schema markup
      const schemaMarkup = this.generateSchemaMarkup();

      // Apply to document head
      this.applyMetaTags(metaTags);
      this.applySchemaMarkup(schemaMarkup);

      // Success
      statusEl.textContent = '✅ SEO tags generated successfully!';
      statusEl.className = 'seo-status success';
    } catch (error) {
      console.error('SEO generation failed:', error);
      statusEl.textContent = '❌ SEO generation failed. Please try again.';
      statusEl.className = 'seo-status error';
    } finally {
      // Reset UI
      generateBtn.disabled = false;
      generateBtn.textContent = '⚡ Generate SEO Tags';

      // Clear status after 5 seconds
      setTimeout(() => {
        if (statusEl) {
          statusEl.textContent = '';
          statusEl.className = 'seo-status';
        }
      }, 5000);
    }
  }

  private collectSEOData(): void {
    // Collect basic SEO data
    const titleInput = this.querySelector('#page-title') as HTMLInputElement;
    const descInput = this.querySelector('#page-description') as HTMLTextAreaElement;
    const keywordsInput = this.querySelector('#page-keywords') as HTMLInputElement;
    const authorInput = this.querySelector('#page-author') as HTMLInputElement;
    const ogImageInput = this.querySelector('#og-image') as HTMLInputElement;
    // const twitterHandleInput = this.querySelector('#twitter-handle') as HTMLInputElement;

    this.seoData = {
      ...this.seoData,
      title: titleInput?.value || this.seoData.title,
      description: descInput?.value || this.seoData.description,
      keywords: keywordsInput?.value.split(',').map(k => k.trim()) || this.seoData.keywords,
      author: authorInput?.value || this.seoData.author,
      image: ogImageInput?.value || this.seoData.image,
    };

    // Collect business data
    const businessNameInput = this.querySelector('#business-name') as HTMLInputElement;
    const businessDescInput = this.querySelector('#business-description') as HTMLTextAreaElement;
    const businessPhoneInput = this.querySelector('#business-phone') as HTMLInputElement;
    const businessEmailInput = this.querySelector('#business-email') as HTMLInputElement;
    const businessHoursInput = this.querySelector('#business-hours') as HTMLInputElement;
    const priceRangeSelect = this.querySelector('#price-range') as HTMLSelectElement;

    const streetInput = this.querySelector('#street-address') as HTMLInputElement;
    const cityInput = this.querySelector('#city') as HTMLInputElement;
    const stateInput = this.querySelector('#state') as HTMLInputElement;
    const zipInput = this.querySelector('#zip') as HTMLInputElement;
    const countryInput = this.querySelector('#country') as HTMLInputElement;

    this.businessData = {
      name: businessNameInput?.value || 'Business Name',
      description: businessDescInput?.value || 'Business description',
      address: {
        streetAddress: streetInput?.value || '',
        addressLocality: cityInput?.value || '',
        addressRegion: stateInput?.value || '',
        postalCode: zipInput?.value || '',
        addressCountry: countryInput?.value || '',
      },
      geo: {
        latitude: 40.7128, // Default to NYC
        longitude: -74.006,
      },
      telephone: businessPhoneInput?.value || '',
      email: businessEmailInput?.value || '',
      url: window.location.origin,
      openingHours: JSON.parse(businessHoursInput?.value || '["Mo-Fr 09:00-17:00"]'),
      priceRange: priceRangeSelect?.value || '$$',
      image: this.seoData.image,
      logo: this.seoData.image,
    };
  }

  private generateMetaTagsHTML(): string {
    const twitterHandle = (this.querySelector('#twitter-handle') as HTMLInputElement)?.value;

    return `
      <!-- Basic Meta Tags -->
      <title>${this.seoData.title}</title>
      <meta name="description" content="${this.seoData.description}">
      <meta name="keywords" content="${this.seoData.keywords.join(', ')}">
      <meta name="author" content="${this.seoData.author}">

      <!-- Open Graph / Facebook -->
      <meta property="og:type" content="${this.seoData.type}">
      <meta property="og:url" content="${this.seoData.url}">
      <meta property="og:title" content="${this.seoData.title}">
      <meta property="og:description" content="${this.seoData.description}">
      <meta property="og:image" content="${this.seoData.image}">
      <meta property="og:site_name" content="${this.seoData.siteName}">
      <meta property="og:locale" content="${this.seoData.locale}">

      <!-- Twitter -->
      <meta property="twitter:card" content="summary_large_image">
      <meta property="twitter:url" content="${this.seoData.url}">
      <meta property="twitter:title" content="${this.seoData.title}">
      <meta property="twitter:description" content="${this.seoData.description}">
      <meta property="twitter:image" content="${this.seoData.image}">
      ${twitterHandle ? `<meta property="twitter:site" content="${twitterHandle}">` : ''}

      <!-- Additional SEO -->
      <meta name="robots" content="index, follow">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="canonical" href="${this.seoData.url}">
    `;
  }

  private applyMetaTags(metaTagsHTML: string): void {
    // Remove existing meta tags
    const existingMeta = document.querySelectorAll(
      'meta[name], meta[property], title, link[rel="canonical"]',
    );
    existingMeta.forEach(tag => tag.remove());

    // Create temporary element to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = metaTagsHTML;

    // Move meta tags to head
    const head = document.head;
    Array.from(tempDiv.children).forEach(tag => {
      head.appendChild(tag);
    });
  }

  private applySchemaMarkup(schemas: SchemaMarkup[]): void {
    // Remove existing schema markup
    const existingSchema = document.querySelectorAll('script[type="application/ld+json"]');
    existingSchema.forEach(script => script.remove());

    // Add new schema markup
    schemas.forEach(schema => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema, null, 2);
      document.head.appendChild(script);
    });
  }

  private previewMetaTags(): void {
    const metaTags = this.generateMetaTagsHTML();
    const schemas = this.generateSchemaMarkup();

    // Create preview modal
    const modal = document.createElement('div');
    modal.className = 'seo-preview-modal';
    modal.innerHTML = `
      <div class="seo-modal-overlay">
        <div class="seo-modal-content">
          <div class="seo-modal-header">
            <h3>🔍 SEO Meta Tags Preview</h3>
            <button class="seo-modal-close">&times;</button>
          </div>
          <div class="seo-modal-body">
            <div class="preview-section">
              <h4>Meta Tags</h4>
              <pre class="code-preview">${this.escapeHtml(metaTags)}</pre>
            </div>
            <div class="preview-section">
              <h4>Schema.org Markup</h4>
              <pre class="code-preview">${JSON.stringify(schemas, null, 2)}</pre>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
      .seo-preview-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 10000; }
      .seo-modal-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; }
      .seo-modal-content { background: white; border-radius: 12px; max-width: 800px; max-height: 80vh; overflow-y: auto; width: 90%; }
      .seo-modal-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-bottom: 1px solid #e5e7eb; }
      .seo-modal-close { background: none; border: none; font-size: 1.5rem; cursor: pointer; }
      .seo-modal-body { padding: 1rem; }
      .preview-section { margin-bottom: 1.5rem; }
      .preview-section h4 { margin-bottom: 0.5rem; color: #374151; }
      .code-preview { background: #f3f4f6; padding: 1rem; border-radius: 6px; font-family: monospace; font-size: 0.875rem; overflow-x: auto; white-space: pre-wrap; }
    `;
    modal.appendChild(style);

    // Add close functionality
    const closeBtn = modal.querySelector('.seo-modal-close');
    const overlay = modal.querySelector('.seo-modal-overlay');
    const closeModal = () => modal.remove();

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }
    if (overlay) {
      overlay.addEventListener('click', e => {
        if (e.target === overlay) closeModal();
      });
    }

    document.body.appendChild(modal);
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  private initializeSEO(): void {
    // Set initial counters
    this.updateTitleCounter();
    this.updateDescriptionCounter();
    this.updateSEOScore();
    this.updateSchemaPreview();
  }

  // Public API
  setSEOData(data: Partial<SEOData>): void {
    this.seoData = { ...this.seoData, ...data };
    this.initializeSEO();
  }

  getSEOData(): SEOData {
    return this.seoData;
  }

  setBusinessData(data: BusinessData): void {
    this.businessData = data;
  }

  getBusinessData(): BusinessData | null {
    return this.businessData;
  }

  generateSEOMetaTags(): string {
    return this.generateMetaTagsHTML();
  }

  generateSEOSchema(): SchemaMarkup[] {
    return this.generateSchemaMarkup();
  }
}

// Register the custom element
customElements.define('seo-optimizer', SEOOptimizer);

export default SEOOptimizer;
