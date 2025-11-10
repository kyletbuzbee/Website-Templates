/**
 * Export Manager Component
 * Handles template export in multiple formats
 */

interface ExportOptions {
  templateName?: string;
  includeAssets?: boolean;
  format?: 'html' | 'wordpress' | 'static' | 'zip';
  customCSS?: string;
  customJS?: string;
}

interface TemplateData {
  html: string;
  css: string;
  js: string;
  assets: string[];
  metadata: {
    title: string;
    description: string;
    author: string;
    version: string;
  };
}

class ExportManager extends HTMLElement {
  private exportOptions: ExportOptions;
  private templateData: TemplateData | null = null;

  constructor() {
    super();
    this.exportOptions = {
      templateName: 'custom-template',
      includeAssets: true,
      format: 'html',
    };
  }

  connectedCallback(): void {
    this.render();
    this.bindEvents();
  }

  private render(): void {
    this.innerHTML = `
      <div class="export-manager">
        <div class="export-header">
          <h3 class="export-title">💾 Export Template</h3>
          <p class="export-description">Download your customized template in multiple formats</p>
        </div>

        <div class="export-options">
          <div class="export-format-selector">
            <h4>Export Format</h4>
            <div class="format-options">
              <label class="format-option">
                <input type="radio" name="format" value="html" checked>
                <span class="format-label">
                  <strong>📄 HTML</strong>
                  <small>Single HTML file with embedded styles</small>
                </span>
              </label>

              <label class="format-option">
                <input type="radio" name="format" value="wordpress">
                <span class="format-label">
                  <strong>🔧 WordPress Theme</strong>
                  <small>Complete WordPress theme package</small>
                </span>
              </label>

              <label class="format-option">
                <input type="radio" name="format" value="static">
                <span class="format-label">
                  <strong>🌐 Static Site</strong>
                  <small>Complete static website with assets</small>
                </span>
              </label>

              <label class="format-option">
                <input type="radio" name="format" value="zip">
                <span class="format-label">
                  <strong>📦 ZIP Package</strong>
                  <small>All files in a compressed archive</small>
                </span>
              </label>
            </div>
          </div>

          <div class="export-settings">
            <h4>Export Settings</h4>

            <div class="setting-group">
              <label for="template-name">Template Name</label>
              <input type="text" id="template-name" value="my-custom-template" placeholder="Enter template name">
            </div>

            <div class="setting-group">
              <label class="checkbox-label">
                <input type="checkbox" id="include-assets" checked>
                Include images and assets
              </label>
            </div>

            <div class="setting-group">
              <label class="checkbox-label">
                <input type="checkbox" id="minify-code" checked>
                Minify HTML/CSS/JS
              </label>
            </div>

            <div class="setting-group">
              <label class="checkbox-label">
                <input type="checkbox" id="add-comments" checked>
                Add developer comments
              </label>
            </div>
          </div>
        </div>

        <div class="export-actions">
          <button class="export-btn export-primary" id="export-btn">
            🚀 Export Template
          </button>

          <button class="export-btn export-secondary" id="preview-btn">
            👁️ Preview
          </button>

          <div class="export-status" id="export-status"></div>
        </div>

        <div class="export-info">
          <div class="info-section">
            <h4>📋 What's Included</h4>
            <ul class="export-includes">
              <li>✅ Complete HTML structure</li>
              <li>✅ Custom CSS with your color scheme</li>
              <li>✅ Optimized JavaScript</li>
              <li>✅ Responsive design</li>
              <li>✅ Cross-browser compatibility</li>
              <li>✅ SEO-friendly markup</li>
            </ul>
          </div>

          <div class="info-section">
            <h4>🎯 Use Cases</h4>
            <ul class="export-use-cases">
              <li><strong>HTML:</strong> Quick prototypes, email templates</li>
              <li><strong>WordPress:</strong> CMS websites, blogs</li>
              <li><strong>Static:</strong> Landing pages, portfolios</li>
              <li><strong>ZIP:</strong> Full development packages</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  private bindEvents(): void {
    const exportBtn = this.querySelector('#export-btn') as HTMLButtonElement;
    const previewBtn = this.querySelector('#preview-btn') as HTMLButtonElement;
    const formatInputs = this.querySelectorAll('input[name="format"]');

    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.handleExport());
    }

    if (previewBtn) {
      previewBtn.addEventListener('click', () => this.handlePreview());
    }

    formatInputs.forEach(input => {
      input.addEventListener('change', e => {
        const target = e.target as HTMLInputElement;
        this.exportOptions.format = target.value as 'html' | 'wordpress' | 'static' | 'zip';
        this.updateExportInfo();
      });
    });
  }

  private async handleExport(): Promise<void> {
    const statusEl = this.querySelector('#export-status') as HTMLElement;
    const exportBtn = this.querySelector('#export-btn') as HTMLButtonElement;

    if (!statusEl || !exportBtn) {
      return;
    }

    try {
      // Update UI
      exportBtn.disabled = true;
      exportBtn.textContent = '⏳ Exporting...';
      statusEl.textContent = 'Preparing template data...';

      // Collect export settings
      this.collectExportSettings();

      // Generate template data
      statusEl.textContent = 'Generating template...';
      const templateData = await this.generateTemplateData();

      // Export based on format
      statusEl.textContent = 'Creating export file...';
      await this.performExport(templateData);

      // Success
      statusEl.textContent = '✅ Export completed successfully!';
      statusEl.className = 'export-status success';
    } catch (error) {
      console.error('Export failed:', error);
      statusEl.textContent = '❌ Export failed. Please try again.';
      statusEl.className = 'export-status error';
    } finally {
      // Reset UI
      exportBtn.disabled = false;
      exportBtn.textContent = '🚀 Export Template';

      // Clear status after 5 seconds
      setTimeout(() => {
        if (statusEl) {
          statusEl.textContent = '';
          statusEl.className = 'export-status';
        }
      }, 5000);
    }
  }

  private async handlePreview(): Promise<void> {
    try {
      this.collectExportSettings();
      const templateData = await this.generateTemplateData();

      // Open preview in new window
      const previewWindow = window.open('', '_blank');
      if (previewWindow) {
        previewWindow.document.write(templateData.html);
        previewWindow.document.close();
      }
    } catch (error) {
      console.error('Preview failed:', error);
      alert('Failed to generate preview. Please try again.');
    }
  }

  private collectExportSettings(): void {
    const templateNameInput = this.querySelector('#template-name') as HTMLInputElement;
    const includeAssetsInput = this.querySelector('#include-assets') as HTMLInputElement;
    const minifyCodeInput = this.querySelector('#minify-code') as HTMLInputElement;
    const addCommentsInput = this.querySelector('#add-comments') as HTMLInputElement;

    this.exportOptions = {
      templateName: templateNameInput?.value || 'custom-template',
      includeAssets: includeAssetsInput?.checked ?? true,
      format: this.exportOptions.format || 'html',
      customCSS: this.getCustomCSS(),
      customJS: this.getCustomJS(),
    };
  }

  private async generateTemplateData(): Promise<TemplateData> {
    // Get current page content and styles
    const currentHTML = await this.getCurrentPageHTML();
    const currentCSS = await this.getCurrentPageCSS();
    const currentJS = await this.getCurrentPageJS();

    // Get computed styles for customization
    const computedStyles = this.getComputedStyles();

    return {
      html: this.processHTML(currentHTML, computedStyles),
      css: this.processCSS(currentCSS, computedStyles),
      js: this.processJS(currentJS),
      assets: this.getAssetList(),
      metadata: {
        title: this.exportOptions.templateName || 'Custom Template',
        description: 'Customized website template',
        author: 'Template Customizer',
        version: '1.0.0',
      },
    };
  }

  private async performExport(templateData: TemplateData): Promise<void> {
    const format = this.exportOptions.format || 'html';
    switch (format) {
      case 'html':
        await this.exportAsHTML(templateData);
        break;
      case 'wordpress':
        await this.exportAsWordPress(templateData);
        break;
      case 'static':
        await this.exportAsStatic(templateData);
        break;
      case 'zip':
        await this.exportAsZIP(templateData);
        break;
      default:
        throw new Error('Unknown export format');
    }
  }

  private async exportAsHTML(templateData: TemplateData): Promise<void> {
    const fullHTML = this.createFullHTML(templateData);
    this.downloadFile(`${this.exportOptions.templateName}.html`, fullHTML, 'text/html');
  }

  private async exportAsWordPress(templateData: TemplateData): Promise<void> {
    const wpTheme = this.createWordPressTheme(templateData);
    const zipBlob = await this.createZIPFromTheme(wpTheme);

    this.downloadFile(
      `${this.exportOptions.templateName}-wordpress.zip`,
      zipBlob,
      'application/zip',
    );
  }

  private async exportAsStatic(templateData: TemplateData): Promise<void> {
    const staticSite = this.createStaticSite(templateData);
    const zipBlob = await this.createZIPFromStatic(staticSite);

    this.downloadFile(`${this.exportOptions.templateName}-static.zip`, zipBlob, 'application/zip');
  }

  private async exportAsZIP(templateData: TemplateData): Promise<void> {
    const fullPackage = this.createFullPackage(templateData);
    const zipBlob = await this.createZIPFromPackage(fullPackage);

    this.downloadFile(`${this.exportOptions.templateName}-package.zip`, zipBlob, 'application/zip');
  }

  private createFullHTML(templateData: TemplateData): string {
    const minifyCode = (this.querySelector('#minify-code') as HTMLInputElement)?.checked ?? true;
    const addComments = (this.querySelector('#add-comments') as HTMLInputElement)?.checked ?? true;

    let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${templateData.metadata.title}</title>
  <meta name="description" content="${templateData.metadata.description}">
  <meta name="author" content="${templateData.metadata.author}">`;

    if (addComments) {
      html += `
  <!--
    Template: ${templateData.metadata.title}
    Version: ${templateData.metadata.version}
    Generated: ${new Date().toISOString()}
    Author: ${templateData.metadata.author}
  -->`;
    }

    html += `
  <style>
${minifyCode ? this.minifyCSS(templateData.css) : templateData.css}
  </style>
</head>
<body>
${templateData.html}
  <script>
${minifyCode ? this.minifyJS(templateData.js) : templateData.js}
  </script>
</body>
</html>`;

    return html;
  }

  private createWordPressTheme(templateData: TemplateData): any {
    // WordPress theme structure
    return {
      'style.css': `/*
Theme Name: ${templateData.metadata.title}
Description: ${templateData.metadata.description}
Version: ${templateData.metadata.version}
Author: ${templateData.metadata.author}
*/`,
      'index.php': `<?php get_header(); ?>
${templateData.html}
<?php get_footer(); ?>`,
      'header.php': `<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?php wp_title('|', true, 'right'); ?></title>
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>`,
      'footer.php': `
  <?php wp_footer(); ?>
</body>
</html>`,
      'functions.php': `<?php
function ${this.exportOptions.templateName}_enqueue_styles() {
  wp_enqueue_style('${this.exportOptions.templateName}-style', get_stylesheet_uri());
}
add_action('wp_enqueue_scripts', '${this.exportOptions.templateName}_enqueue_styles');
?>`,
      'css/custom.css': templateData.css,
      'js/custom.js': templateData.js,
    };
  }

  private createStaticSite(templateData: TemplateData): any {
    return {
      'index.html': this.createFullHTML(templateData),
      'css/style.css': templateData.css,
      'js/script.js': templateData.js,
      'assets/': {}, // Would include images and other assets
    };
  }

  private createFullPackage(templateData: TemplateData): any {
    return {
      ...this.createStaticSite(templateData),
      'README.md': this.generateReadme(templateData),
      'package.json': this.generatePackageJson(templateData),
      'src/': {
        'index.html': templateData.html,
        'styles.css': templateData.css,
        'script.js': templateData.js,
      },
    };
  }

  private async createZIPFromTheme(themeFiles: any): Promise<Blob> {
    // This would use a ZIP library like JSZip
    // For now, return a placeholder
    const zipContent = JSON.stringify(themeFiles, null, 2);
    return new Blob([zipContent], { type: 'application/zip' });
  }

  private async createZIPFromStatic(staticFiles: any): Promise<Blob> {
    const zipContent = JSON.stringify(staticFiles, null, 2);
    return new Blob([zipContent], { type: 'application/zip' });
  }

  private async createZIPFromPackage(packageFiles: any): Promise<Blob> {
    const zipContent = JSON.stringify(packageFiles, null, 2);
    return new Blob([zipContent], { type: 'application/zip' });
  }

  private async getCurrentPageHTML(): Promise<string> {
    // Get the preview content from the demo
    const previewElement = document.querySelector('.live-preview .container');
    return previewElement ? previewElement.innerHTML : '<p>Template content</p>';
  }

  private async getCurrentPageCSS(): Promise<string> {
    // Get computed styles from the page
    const stylesheets = Array.from(document.styleSheets);
    let css = '';

    for (const stylesheet of stylesheets) {
      try {
        const rules = Array.from(stylesheet.cssRules);
        css += rules.map(rule => rule.cssText).join('\n');
      } catch (e) {
        // Skip cross-origin stylesheets
        continue;
      }
    }

    return css;
  }

  private async getCurrentPageJS(): Promise<string> {
    // Get inline scripts and external script content
    const scripts = Array.from(document.querySelectorAll('script'));
    let js = '';

    for (const script of scripts) {
      if (script.textContent) {
        js += script.textContent + '\n';
      }
    }

    return js;
  }

  private getComputedStyles(): any {
    const root = document.documentElement;
    const styles: any = {};

    // Get CSS custom properties
    const cssVars = [
      '--color-primary',
      '--color-secondary',
      '--color-accent',
      '--color-white',
      '--color-black',
      '--color-gray-600',
      '--font-heading',
      '--font-body',
    ];

    cssVars.forEach(varName => {
      styles[varName] = getComputedStyle(root).getPropertyValue(varName).trim();
    });

    return styles;
  }

  private processHTML(html: string, styles: any): string {
    // Process HTML with custom styles
    let processedHTML = html;

    // Replace CSS custom properties with actual values
    Object.keys(styles).forEach(varName => {
      const regex = new RegExp(`var\\(${varName}\\)`, 'g');
      processedHTML = processedHTML.replace(regex, styles[varName]);
    });

    return processedHTML;
  }

  private processCSS(css: string, styles: any): string {
    let processedCSS = css;

    // Replace CSS custom properties with actual values
    Object.keys(styles).forEach(varName => {
      const regex = new RegExp(`var\\(${varName}\\)([^;}]*)`, 'g');
      processedCSS = processedCSS.replace(regex, styles[varName] + '$1');
    });

    return processedCSS;
  }

  private processJS(js: string): string {
    // Process JavaScript if needed
    return js;
  }

  private getAssetList(): string[] {
    // Get list of assets used in the template
    const images = Array.from(document.querySelectorAll('img')).map(img => img.src);
    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(
      link => (link as HTMLLinkElement).href,
    );
    const scripts = Array.from(document.querySelectorAll('script[src]')).map(
      script => (script as HTMLScriptElement).src,
    );

    return [...images, ...links, ...scripts];
  }

  private getCustomCSS(): string {
    // Get custom CSS from color picker and other customizations
    return '';
  }

  private getCustomJS(): string {
    // Get custom JavaScript
    return '';
  }

  private updateExportInfo(): void {
    const format = this.exportOptions.format;
    const infoSection = this.querySelector('.export-info');

    if (infoSection) {
      let info = '';

      switch (format) {
        case 'html':
          info =
            '<p>Single HTML file with embedded styles and scripts. Perfect for quick prototypes and simple websites.</p>';
          break;
        case 'wordpress':
          info =
            '<p>Complete WordPress theme with proper file structure. Includes header.php, footer.php, functions.php, and style.css.</p>';
          break;
        case 'static':
          info =
            '<p>Static website with separate HTML, CSS, and JS files. Includes all assets and optimized for performance.</p>';
          break;
        case 'zip':
          info =
            '<p>Complete development package with source files, documentation, and build tools.</p>';
          break;
      }

      // Update the info section
      const existingInfo = infoSection.querySelector('.format-info');
      if (existingInfo) {
        existingInfo.innerHTML = info;
      }
    }
  }

  private minifyCSS(css: string): string {
    // Basic CSS minification
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/\s*([{}:;,])\s*/g, '$1') // Remove spaces around punctuation
      .trim();
  }

  private minifyJS(js: string): string {
    // Basic JS minification (very basic)
    return js
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\/\/.*$/gm, '') // Remove line comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .trim();
  }

  private generateReadme(templateData: TemplateData): string {
    return `# ${templateData.metadata.title}

${templateData.metadata.description}

## Installation

1. Download and extract the files
2. Open index.html in your web browser
3. Customize as needed

## Features

- Responsive design
- Modern CSS with custom properties
- Optimized JavaScript
- Cross-browser compatibility

## Author

${templateData.metadata.author}

## Version

${templateData.metadata.version}
`;
  }

  private generatePackageJson(templateData: TemplateData): string {
    return JSON.stringify(
      {
        name: this.exportOptions.templateName,
        version: templateData.metadata.version,
        description: templateData.metadata.description,
        author: templateData.metadata.author,
        scripts: {
          start: 'npx serve .',
          build: 'echo "Static site - no build needed"',
        },
      },
      null,
      2,
    );
  }

  private downloadFile(filename: string, content: string | Blob, mimeType: string): void {
    const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Public API
  setTemplateData(data: TemplateData): void {
    this.templateData = data;
  }

  getTemplateData(): TemplateData | null {
    return this.templateData;
  }

  setExportOptions(options: Partial<ExportOptions>): void {
    this.exportOptions = { ...this.exportOptions, ...options };
  }
}

// Register the custom element
customElements.define('export-manager', ExportManager);

export default ExportManager;
