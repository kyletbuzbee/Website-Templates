/**
 * Template Customization UI Components
 * Provides interface for customizing templates with live preview
 */

class CustomizationUI {
  constructor(customizationManager) {
    this.customizationManager = customizationManager;
    this.currentPanel = 'theme';
    this.selectedElement = null;
    this.colorPicker = null;
    this.draggedElement = null;
    this.listeners = new Set();

    // Initialize UI
    this.init();
  }

  /**
   * Initialize the UI
   */
  init() {
    // Subscribe to customization events
    this.customizationManager.subscribe((event) => {
      this.handleCustomizationEvent(event);
    });

    // Create main UI container
    this.createUIContainer();

    // Set up event listeners
    this.setupEventListeners();

    // Initialize color picker
    this.initColorPicker();
  }

  /**
   * Create main UI container
   */
  createUIContainer() {
    // Create overlay container
    this.overlay = document.createElement('div');
    this.overlay.id = 'customization-overlay';
    this.overlay.className = 'customization-overlay hidden';
    this.overlay.innerHTML = `
      <div class="customization-panel">
        <div class="customization-header">
          <h2>Template Customization</h2>
          <div class="customization-controls">
            <button class="customization-btn" id="customization-preview-toggle">
              <span id="preview-icon">👁️</span> Preview
            </button>
            <button class="customization-btn" id="customization-undo">↶ Undo</button>
            <button class="customization-btn" id="customization-redo">↷ Redo</button>
            <button class="customization-btn" id="customization-reset">🔄 Reset</button>
            <button class="customization-btn" id="customization-export">💾 Export</button>
            <button class="customization-btn" id="customization-close">×</button>
          </div>
        </div>

        <div class="customization-nav">
          <button class="customization-nav-btn active" data-panel="theme">🎨 Theme</button>
          <button class="customization-nav-btn" data-panel="components">🧩 Components</button>
          <button class="customization-nav-btn" data-panel="layout">📐 Layout</button>
          <button class="customization-nav-btn" data-panel="content">📝 Content</button>
        </div>

        <div class="customization-content">
          <div id="customization-theme" class="customization-panel-view active">
            <div class="customization-section">
              <h3>Color Palette</h3>
              <div class="color-grid" id="color-variables"></div>
            </div>

            <div class="customization-section">
              <h3>Typography</h3>
              <div class="typography-controls" id="typography-controls"></div>
            </div>

            <div class="customization-section">
              <h3>Spacing & Sizing</h3>
              <div class="spacing-controls" id="spacing-controls"></div>
            </div>
          </div>

          <div id="customization-components" class="customization-panel-view">
            <div class="customization-section">
              <h3>Component Library</h3>
              <div class="component-palette" id="component-palette"></div>
            </div>

            <div class="customization-section">
              <h3>Selected Component</h3>
              <div class="component-editor" id="component-editor">
                <p class="no-selection">Click on a customizable element in the preview to edit it.</p>
              </div>
            </div>
          </div>

          <div id="customization-layout" class="customization-panel-view">
            <div class="customization-section">
              <h3>Grid & Layout</h3>
              <div class="layout-controls" id="layout-controls"></div>
            </div>

            <div class="customization-section">
              <h3>Responsive Settings</h3>
              <div class="responsive-controls" id="responsive-controls"></div>
            </div>
          </div>

          <div id="customization-content" class="customization-panel-view">
            <div class="customization-section">
              <h3>Global Content</h3>
              <div class="content-controls" id="content-controls"></div>
            </div>

            <div class="customization-section">
              <h3>SEO & Meta</h3>
              <div class="seo-controls" id="seo-controls"></div>
            </div>
          </div>
        </div>

        <div class="customization-footer">
          <div class="customization-status">
            <span id="customization-status-text">Ready</span>
            <span id="customization-unsaved-indicator" class="unsaved-indicator hidden">•</span>
          </div>
          <div class="customization-actions">
            <button class="customization-action-btn secondary" id="customization-save-draft">
              Save Draft
            </button>
            <button class="customization-action-btn primary" id="customization-publish">
              Publish Changes
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.overlay);

    // Add CSS styles
    this.addStyles();
  }

  /**
   * Add CSS styles for the UI
   */
  addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .customization-overlay {
        position: fixed;
        top: 0;
        right: 0;
        width: 400px;
        height: 100vh;
        background: white;
        box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .customization-overlay:not(.hidden) {
        transform: translateX(0);
      }

      .customization-panel {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .customization-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        border-bottom: 1px solid #e1e5e9;
        background: #f8f9fa;
      }

      .customization-header h2 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #1a202c;
      }

      .customization-controls {
        display: flex;
        gap: 8px;
      }

      .customization-btn {
        background: none;
        border: none;
        padding: 6px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        color: #718096;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .customization-btn:hover {
        background: #e2e8f0;
        color: #2d3748;
      }

      .customization-nav {
        display: flex;
        border-bottom: 1px solid #e1e5e9;
        background: #f8f9fa;
      }

      .customization-nav-btn {
        flex: 1;
        padding: 10px 16px;
        border: none;
        background: none;
        cursor: pointer;
        font-size: 13px;
        font-weight: 500;
        color: #718096;
        border-bottom: 2px solid transparent;
        transition: all 0.2s;
      }

      .customization-nav-btn.active {
        color: #3182ce;
        border-bottom-color: #3182ce;
        background: white;
      }

      .customization-nav-btn:hover {
        color: #2c5282;
        background: #edf2f7;
      }

      .customization-content {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
      }

      .customization-panel-view {
        display: none;
      }

      .customization-panel-view.active {
        display: block;
      }

      .customization-section {
        margin-bottom: 24px;
      }

      .customization-section h3 {
        margin: 0 0 12px 0;
        font-size: 14px;
        font-weight: 600;
        color: #2d3748;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .color-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 12px;
      }

      .color-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 12px;
        border-radius: 8px;
        background: #f8f9fa;
        border: 1px solid #e1e5e9;
        transition: all 0.2s;
        cursor: pointer;
      }

      .color-item:hover {
        border-color: #cbd5e0;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .color-preview {
        width: 40px;
        height: 40px;
        border-radius: 6px;
        border: 2px solid #e1e5e9;
        position: relative;
        overflow: hidden;
      }

      .color-value {
        font-size: 11px;
        color: #718096;
        font-family: monospace;
        text-align: center;
        word-break: break-all;
      }

      .control-group {
        margin-bottom: 16px;
      }

      .control-group label {
        display: block;
        margin-bottom: 4px;
        font-size: 13px;
        font-weight: 500;
        color: #4a5568;
      }

      .control-input {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #e1e5e9;
        border-radius: 6px;
        font-size: 14px;
        transition: border-color 0.2s;
      }

      .control-input:focus {
        outline: none;
        border-color: #3182ce;
        box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
      }

      .control-range {
        width: 100%;
        -webkit-appearance: none;
        height: 6px;
        border-radius: 3px;
        background: #e1e5e9;
        outline: none;
      }

      .control-range::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #3182ce;
        cursor: pointer;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }

      .control-range::-moz-range-thumb {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #3182ce;
        cursor: pointer;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }

      .component-palette {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }

      .component-item {
        padding: 12px;
        border: 2px dashed #cbd5e0;
        border-radius: 6px;
        background: #f8f9fa;
        text-align: center;
        cursor: grab;
        transition: all 0.2s;
        font-size: 12px;
        color: #718096;
      }

      .component-item:hover {
        border-color: #3182ce;
        background: #ebf8ff;
        color: #2c5282;
      }

      .component-item:active {
        cursor: grabbing;
        transform: scale(0.95);
      }

      .component-editor {
        border: 1px solid #e1e5e9;
        border-radius: 6px;
        padding: 16px;
        background: #f8f9fa;
        min-height: 200px;
      }

      .no-selection {
        text-align: center;
        color: #a0aec0;
        font-style: italic;
        margin: 0;
      }

      .customization-preview-element {
        position: relative;
        outline: 2px dashed #3182ce !important;
        outline-offset: 2px;
      }

      .customization-preview-element::after {
        content: attr(data-customizable);
        position: absolute;
        top: -24px;
        left: 0;
        background: #3182ce;
        color: white;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        z-index: 1000;
      }

      .customization-footer {
        border-top: 1px solid #e1e5e9;
        padding: 16px 20px;
        background: #f8f9fa;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .customization-status {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        color: #718096;
      }

      .unsaved-indicator {
        color: #d69e2e;
        font-size: 18px;
      }

      .unsaved-indicator:not(.hidden) {
        animation: pulse 2s infinite;
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }

      .customization-actions {
        display: flex;
        gap: 8px;
      }

      .customization-action-btn {
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        border: 1px solid #e1e5e9;
      }

      .customization-action-btn.secondary {
        background: white;
        color: #4a5568;
      }

      .customization-action-btn.secondary:hover {
        background: #f8f9fa;
        border-color: #cbd5e0;
      }

      .customization-action-btn.primary {
        background: #3182ce;
        color: white;
        border-color: #3182ce;
      }

      .customization-action-btn.primary:hover {
        background: #2c5282;
        border-color: #2c5282;
      }

      .customization-preview {
        pointer-events: none !important;
      }

      .customization-preview * {
        pointer-events: auto !important;
      }

      @media (max-width: 768px) {
        .customization-overlay {
          width: 100vw;
        }

        .customization-controls {
          flex-wrap: wrap;
        }

        .color-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Close button
    this.overlay.querySelector('#customization-close').addEventListener('click', () => {
      this.hide();
    });

    // Preview toggle
    this.overlay.querySelector('#customization-preview-toggle').addEventListener('click', () => {
      this.togglePreviewMode();
    });

    // Undo/Redo
    this.overlay.querySelector('#customization-undo').addEventListener('click', () => {
      this.customizationManager.undo();
    });

    this.overlay.querySelector('#customization-redo').addEventListener('click', () => {
      this.customizationManager.redo();
    });

    // Reset
    this.overlay.querySelector('#customization-reset').addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all customizations?')) {
        this.customizationManager.resetCustomizations();
      }
    });

    // Export
    this.overlay.querySelector('#customization-export').addEventListener('click', () => {
      this.customizationManager.exportCustomizations();
    });

    // Navigation
    this.overlay.querySelectorAll('.customization-nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.switchPanel(e.target.dataset.panel);
      });
    });

    // Footer actions
    this.overlay.querySelector('#customization-save-draft').addEventListener('click', () => {
      this.saveDraft();
    });

    this.overlay.querySelector('#customization-publish').addEventListener('click', () => {
      this.publishChanges();
    });

    // Click outside to close (on mobile)
    this.overlay.addEventListener('click', (e) => {
      if (window.innerWidth <= 768 && e.target === this.overlay) {
        this.hide();
      }
    });
  }

  /**
   * Initialize color picker
   */
  initColorPicker() {
    // Simple color picker - could be enhanced with a proper color picker library
    this.colorPicker = {
      show: (element, currentColor, onChange) => {
        // Create a simple color input
        const input = document.createElement('input');
        input.type = 'color';
        input.value = currentColor;
        input.style.position = 'absolute';
        input.style.left = '-9999px';

        input.addEventListener('change', (e) => {
          onChange(e.target.value);
          document.body.removeChild(input);
        });

        input.addEventListener('blur', () => {
          document.body.removeChild(input);
        });

        document.body.appendChild(input);
        input.click();
      }
    };
  }

  /**
   * Show the customization UI
   */
  show(templateId = null) {
    this.overlay.classList.remove('hidden');

    if (templateId) {
      this.loadTemplateForCustomization(templateId);
    }

    this.refreshUI();
  }

  /**
   * Hide the customization UI
   */
  hide() {
    this.overlay.classList.add('hidden');
    this.customizationManager.disablePreviewMode();
  }

  /**
   * Toggle preview mode
   */
  togglePreviewMode() {
    const isPreview = this.customizationManager.previewMode;
    const btn = this.overlay.querySelector('#customization-preview-toggle');
    const icon = btn.querySelector('#preview-icon');

    if (isPreview) {
      this.customizationManager.disablePreviewMode();
      icon.textContent = '👁️';
      btn.innerHTML = '<span id="preview-icon">👁️</span> Preview';
    } else {
      this.customizationManager.enablePreviewMode();
      icon.textContent = '👁️‍🗨️';
      btn.innerHTML = '<span id="preview-icon">👁️‍🗨️</span> Exit Preview';
    }
  }

  /**
   * Switch between panels
   */
  switchPanel(panel) {
    this.currentPanel = panel;

    // Update navigation
    this.overlay.querySelectorAll('.customization-nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.panel === panel);
    });

    // Update content
    this.overlay.querySelectorAll('.customization-panel-view').forEach(view => {
      view.classList.toggle('active', view.id === `customization-${panel}`);
    });

    // Load panel content
    this.loadPanelContent(panel);
  }

  /**
   * Load template for customization
   */
  async loadTemplateForCustomization(templateId) {
    try {
      await this.customizationManager.loadTemplate(templateId);
      this.refreshUI();
    } catch (error) {
      console.error('Failed to load template:', error);
      this.showNotification('Failed to load template', 'error');
    }
  }

  /**
   * Load panel content
   */
  loadPanelContent(panel) {
    switch (panel) {
      case 'theme':
        this.loadThemePanel();
        break;
      case 'components':
        this.loadComponentsPanel();
        break;
      case 'layout':
        this.loadLayoutPanel();
        break;
      case 'content':
        this.loadContentPanel();
        break;
    }
  }

  /**
   * Load theme panel
   */
  loadThemePanel() {
    const colorGrid = this.overlay.querySelector('#color-variables');
    const typographyControls = this.overlay.querySelector('#typography-controls');
    const spacingControls = this.overlay.querySelector('#spacing-controls');

    // Load color variables
    this.loadColorVariables(colorGrid);

    // Load typography controls
    this.loadTypographyControls(typographyControls);

    // Load spacing controls
    this.loadSpacingControls(spacingControls);
  }

  /**
   * Load color variables
   */
  loadColorVariables(container) {
    const cssVars = this.customizationManager.cssVariables;
    const commonVars = [
      '--primary-color', '--secondary-color', '--accent-color',
      '--text-color', '--background-color', '--surface-color',
      '--border-color', '--shadow-color'
    ];

    container.innerHTML = commonVars.map(varName => {
      const value = cssVars.get(varName) || this.getComputedCSSVariable(varName);
      return `
        <div class="color-item" data-variable="${varName}">
          <div class="color-preview" style="background-color: ${value}"></div>
          <div class="color-value">${varName}</div>
        </div>
      `;
    }).join('');

    // Add click handlers
    container.querySelectorAll('.color-item').forEach(item => {
      item.addEventListener('click', () => {
        const variable = item.dataset.variable;
        const currentColor = cssVars.get(variable) || this.getComputedCSSVariable(variable);

        this.colorPicker.show(item, currentColor, (newColor) => {
          this.customizationManager.updateCSSVariable(variable, newColor);
          item.querySelector('.color-preview').style.backgroundColor = newColor;
        });
      });
    });
  }

  /**
   * Load typography controls
   */
  loadTypographyControls(container) {
    container.innerHTML = `
      <div class="control-group">
        <label>Font Family</label>
        <select class="control-input" id="font-family">
          <option value="Inter, sans-serif">Inter</option>
          <option value="Roboto, sans-serif">Roboto</option>
          <option value="Open Sans, sans-serif">Open Sans</option>
          <option value="Lato, sans-serif">Lato</option>
          <option value="Poppins, sans-serif">Poppins</option>
          <option value="Montserrat, sans-serif">Montserrat</option>
        </select>
      </div>

      <div class="control-group">
        <label>Base Font Size</label>
        <input type="range" class="control-range" id="base-font-size" min="14" max="20" value="16">
        <div style="display: flex; justify-content: space-between; font-size: 12px; color: #718096; margin-top: 4px;">
          <span>14px</span>
          <span id="font-size-value">16px</span>
          <span>20px</span>
        </div>
      </div>

      <div class="control-group">
        <label>Line Height</label>
        <input type="range" class="control-range" id="line-height" min="1.2" max="1.8" step="0.1" value="1.5">
        <div style="display: flex; justify-content: space-between; font-size: 12px; color: #718096; margin-top: 4px;">
          <span>1.2</span>
          <span id="line-height-value">1.5</span>
          <span>1.8</span>
        </div>
      </div>
    `;

    // Add event listeners
    const fontFamily = container.querySelector('#font-family');
    const fontSize = container.querySelector('#base-font-size');
    const fontSizeValue = container.querySelector('#font-size-value');
    const lineHeight = container.querySelector('#line-height');
    const lineHeightValue = container.querySelector('#line-height-value');

    fontFamily.addEventListener('change', (e) => {
      this.customizationManager.updateCSSVariable('--font-family', e.target.value);
    });

    fontSize.addEventListener('input', (e) => {
      const value = e.target.value + 'px';
      fontSizeValue.textContent = value;
      this.customizationManager.updateCSSVariable('--base-font-size', value);
    });

    lineHeight.addEventListener('input', (e) => {
      const value = e.target.value;
      lineHeightValue.textContent = value;
      this.customizationManager.updateCSSVariable('--line-height', value);
    });
  }

  /**
   * Load spacing controls
   */
  loadSpacingControls(container) {
    container.innerHTML = `
      <div class="control-group">
        <label>Base Spacing</label>
        <input type="range" class="control-range" id="base-spacing" min="8" max="24" value="16">
        <div style="display: flex; justify-content: space-between; font-size: 12px; color: #718096; margin-top: 4px;">
          <span>8px</span>
          <span id="spacing-value">16px</span>
          <span>24px</span>
        </div>
      </div>

      <div class="control-group">
        <label>Border Radius</label>
        <input type="range" class="control-range" id="border-radius" min="0" max="16" value="6">
        <div style="display: flex; justify-content: space-between; font-size: 12px; color: #718096; margin-top: 4px;">
          <span>0px</span>
          <span id="border-radius-value">6px</span>
          <span>16px</span>
        </div>
      </div>
    `;

    // Add event listeners
    const spacing = container.querySelector('#base-spacing');
    const spacingValue = container.querySelector('#spacing-value');
    const borderRadius = container.querySelector('#border-radius');
    const borderRadiusValue = container.querySelector('#border-radius-value');

    spacing.addEventListener('input', (e) => {
      const value = e.target.value + 'px';
      spacingValue.textContent = value;
      this.customizationManager.updateCSSVariable('--base-spacing', value);
    });

    borderRadius.addEventListener('input', (e) => {
      const value = e.target.value + 'px';
      borderRadiusValue.textContent = value;
      this.customizationManager.updateCSSVariable('--border-radius', value);
    });
  }

  /**
   * Load components panel
   */
  loadComponentsPanel() {
    const palette = this.overlay.querySelector('#component-palette');

    // Component types available for customization
    const components = [
      { type: 'hero', name: 'Hero Section', icon: '🎯' },
      { type: 'text', name: 'Text Block', icon: '📝' },
      { type: 'button', name: 'Button', icon: '🔘' },
      { type: 'image', name: 'Image', icon: '🖼️' },
      { type: 'card', name: 'Card', icon: '📋' },
      { type: 'form', name: 'Form', icon: '📋' }
    ];

    palette.innerHTML = components.map(comp => `
      <div class="component-item" data-component-type="${comp.type}" draggable="true">
        ${comp.icon} ${comp.name}
      </div>
    `).join('');

    // Add drag handlers
    palette.querySelectorAll('.component-item').forEach(item => {
      item.addEventListener('dragstart', (e) => {
        this.draggedElement = {
          type: e.target.dataset.componentType,
          name: e.target.textContent.trim()
        };
        e.dataTransfer.effectAllowed = 'copy';
      });
    });

    // Set up drop zones in preview mode
    this.setupDropZones();
  }

  /**
   * Load layout panel
   */
  loadLayoutPanel() {
    const layoutControls = this.overlay.querySelector('#layout-controls');
    const responsiveControls = this.overlay.querySelector('#responsive-controls');

    layoutControls.innerHTML = `
      <div class="control-group">
        <label>Grid Columns</label>
        <input type="range" class="control-range" id="grid-columns" min="1" max="12" value="12">
        <div style="display: flex; justify-content: space-between; font-size: 12px; color: #718096; margin-top: 4px;">
          <span>1</span>
          <span id="grid-value">12</span>
          <span>12</span>
        </div>
      </div>

      <div class="control-group">
        <label>Max Width</label>
        <select class="control-input" id="max-width">
          <option value="1200px">1200px (Standard)</option>
          <option value="1440px">1440px (Wide)</option>
          <option value="100%">100% (Full Width)</option>
        </select>
      </div>
    `;

    responsiveControls.innerHTML = `
      <div class="control-group">
        <label>Mobile Breakpoint</label>
        <input type="range" class="control-range" id="mobile-breakpoint" min="320" max="480" value="375">
        <div style="display: flex; justify-content: space-between; font-size: 12px; color: #718096; margin-top: 4px;">
          <span>320px</span>
          <span id="mobile-value">375px</span>
          <span>480px</span>
        </div>
      </div>

      <div class="control-group">
        <label>Tablet Breakpoint</label>
        <input type="range" class="control-range" id="tablet-breakpoint" min="768" max="1024" value="768">
        <div style="display: flex; justify-content: space-between; font-size: 12px; color: #718096; margin-top: 4px;">
          <span>768px</span>
          <span id="tablet-value">768px</span>
          <span>1024px</span>
        </div>
      </div>
    `;

    // Add event listeners
    const gridColumns = layoutControls.querySelector('#grid-columns');
    const gridValue = layoutControls.querySelector('#grid-value');
    const maxWidth = layoutControls.querySelector('#max-width');

    gridColumns.addEventListener('input', (e) => {
      const value = e.target.value;
      gridValue.textContent = value;
      this.customizationManager.updateLayout({ gridColumns: value });
    });

    maxWidth.addEventListener('change', (e) => {
      this.customizationManager.updateLayout({ maxWidth: e.target.value });
    });
  }

  /**
   * Load content panel
   */
  loadContentPanel() {
    const contentControls = this.overlay.querySelector('#content-controls');
    const seoControls = this.overlay.querySelector('#seo-controls');

    contentControls.innerHTML = `
      <div class="control-group">
        <label>Site Title</label>
        <input type="text" class="control-input" id="site-title" placeholder="Your Website Name">
      </div>

      <div class="control-group">
        <label>Site Description</label>
        <textarea class="control-input" id="site-description" rows="3" placeholder="Brief description of your website..."></textarea>
      </div>

      <div class="control-group">
        <label>Contact Email</label>
        <input type="email" class="control-input" id="contact-email" placeholder="contact@yourwebsite.com">
      </div>
    `;

    seoControls.innerHTML = `
      <div class="control-group">
        <label>Meta Title</label>
        <input type="text" class="control-input" id="meta-title" placeholder="Page title for search engines">
      </div>

      <div class="control-group">
        <label>Meta Description</label>
        <textarea class="control-input" id="meta-description" rows="2" placeholder="Page description for search engines..."></textarea>
      </div>

      <div class="control-group">
        <label>Keywords</label>
        <input type="text" class="control-input" id="meta-keywords" placeholder="keyword1, keyword2, keyword3">
      </div>
    `;
  }

  /**
   * Set up drop zones for component dragging
   */
  setupDropZones() {
    if (!this.customizationManager.previewMode) return;

    // Add drop zone indicators to customizable areas
    const customizableElements = document.querySelectorAll('[data-customizable]');
    customizableElements.forEach(element => {
      element.addEventListener('dragover', (e) => {
        e.preventDefault();
        element.classList.add('drop-zone-active');
      });

      element.addEventListener('dragleave', () => {
        element.classList.remove('drop-zone-active');
      });

      element.addEventListener('drop', (e) => {
        e.preventDefault();
        element.classList.remove('drop-zone-active');

        if (this.draggedElement) {
          // Handle component drop
          this.handleComponentDrop(element, this.draggedElement);
        }
      });

      // Click to edit
      element.addEventListener('click', () => {
        if (this.customizationManager.previewMode) {
          this.selectElementForEditing(element);
        }
      });
    });
  }

  /**
   * Handle component drop
   */
  handleComponentDrop(targetElement, draggedComponent) {
    // This would implement component replacement/addition logic
    console.log('Dropped component:', draggedComponent, 'on element:', targetElement);
    // Implementation would depend on the specific component system
  }

  /**
   * Select element for editing
   */
  selectElementForEditing(element) {
    // Remove previous selection
    if (this.selectedElement) {
      this.selectedElement.classList.remove('selected-for-editing');
    }

    this.selectedElement = element;
    element.classList.add('selected-for-editing');

    // Load component editor
    this.loadComponentEditor(element);
  }

  /**
   * Load component editor
   */
  loadComponentEditor(element) {
    const editor = this.overlay.querySelector('#component-editor');
    const componentId = element.dataset.customizable;
    const componentType = element.dataset.componentType || 'generic';

    let editorHTML = '';

    switch (componentType) {
      case 'hero':
        editorHTML = this.getHeroEditorHTML(componentId);
        break;
      case 'button':
        editorHTML = this.getButtonEditorHTML(componentId);
        break;
      case 'text':
        editorHTML = this.getTextEditorHTML(componentId);
        break;
      case 'image':
        editorHTML = this.getImageEditorHTML(componentId);
        break;
      default:
        editorHTML = `<p>Component type "${componentType}" editor not implemented yet.</p>`;
    }

    editor.innerHTML = `
      <div style="margin-bottom: 12px;">
        <strong>Editing: ${componentType} (${componentId})</strong>
      </div>
      ${editorHTML}
    `;
  }

  /**
   * Get hero component editor HTML
   */
  getHeroEditorHTML(componentId) {
    const currentConfig = this.customizationManager.componentConfigs.get(componentId) || {};

    return `
      <div class="control-group">
        <label>Title</label>
        <input type="text" class="control-input component-input" data-property="title" value="${currentConfig.title || ''}">
      </div>

      <div class="control-group">
        <label>Subtitle</label>
        <textarea class="control-input component-input" data-property="subtitle" rows="2">${currentConfig.subtitle || ''}</textarea>
      </div>

      <div class="control-group">
        <label>Button Text</label>
        <input type="text" class="control-input component-input" data-property="buttonText" value="${currentConfig.buttonText || ''}">
      </div>

      <div class="control-group">
        <label>Button URL</label>
        <input type="url" class="control-input component-input" data-property="buttonUrl" value="${currentConfig.buttonUrl || ''}">
      </div>

      <div class="control-group">
        <label>Background Image URL</label>
        <input type="url" class="control-input component-input" data-property="backgroundImage" value="${currentConfig.backgroundImage || ''}">
      </div>

      <button class="customization-action-btn primary" style="margin-top: 12px;" onclick="customizationUI.saveComponentChanges('${componentId}')">
        Save Changes
      </button>
    `;
  }

  /**
   * Get button component editor HTML
   */
  getButtonEditorHTML(componentId) {
    const currentConfig = this.customizationManager.componentConfigs.get(componentId) || {};

    return `
      <div class="control-group">
        <label>Button Text</label>
        <input type="text" class="control-input component-input" data-property="text" value="${currentConfig.text || ''}">
      </div>

      <div class="control-group">
        <label>Button URL</label>
        <input type="url" class="control-input component-input" data-property="url" value="${currentConfig.url || ''}">
      </div>

      <div class="control-group">
        <label>Button Style</label>
        <select class="control-input component-input" data-property="style">
          <option value="primary" ${currentConfig.style === 'primary' ? 'selected' : ''}>Primary</option>
          <option value="secondary" ${currentConfig.style === 'secondary' ? 'selected' : ''}>Secondary</option>
          <option value="outline" ${currentConfig.style === 'outline' ? 'selected' : ''}>Outline</option>
        </select>
      </div>

      <div class="control-group">
        <label>Button Size</label>
        <select class="control-input component-input" data-property="size">
          <option value="small" ${currentConfig.size === 'small' ? 'selected' : ''}>Small</option>
          <option value="medium" ${currentConfig.size === 'medium' ? 'selected' : ''}>Medium</option>
          <option value="large" ${currentConfig.size === 'large' ? 'selected' : ''}>Large</option>
        </select>
      </div>

      <button class="customization-action-btn primary" style="margin-top: 12px;" onclick="customizationUI.saveComponentChanges('${componentId}')">
        Save Changes
      </button>
    `;
  }

  /**
   * Get text component editor HTML
   */
  getTextEditorHTML(componentId) {
    const currentConfig = this.customizationManager.componentConfigs.get(componentId) || {};

    return `
      <div class="control-group">
        <label>Content</label>
        <textarea class="control-input component-input" data-property="content" rows="6">${currentConfig.content || ''}</textarea>
      </div>

      <div class="control-group">
        <label>Text Alignment</label>
        <select class="control-input component-input" data-property="alignment">
          <option value="left" ${currentConfig.alignment === 'left' ? 'selected' : ''}>Left</option>
          <option value="center" ${currentConfig.alignment === 'center' ? 'selected' : ''}>Center</option>
          <option value="right" ${currentConfig.alignment === 'right' ? 'selected' : ''}>Right</option>
          <option value="justify" ${currentConfig.alignment === 'justify' ? 'selected' : ''}>Justify</option>
        </select>
      </div>

      <button class="customization-action-btn primary" style="margin-top: 12px;" onclick="customizationUI.saveComponentChanges('${componentId}')">
        Save Changes
      </button>
    `;
  }

  /**
   * Get image component editor HTML
   */
  getImageEditorHTML(componentId) {
    const currentConfig = this.customizationManager.componentConfigs.get(componentId) || {};

    return `
      <div class="control-group">
        <label>Image URL</label>
        <input type="url" class="control-input component-input" data-property="src" value="${currentConfig.src || ''}">
      </div>

      <div class="control-group">
        <label>Alt Text</label>
        <input type="text" class="control-input component-input" data-property="alt" value="${currentConfig.alt || ''}">
      </div>

      <div class="control-group">
        <label>Caption</label>
        <input type="text" class="control-input component-input" data-property="caption" value="${currentConfig.caption || ''}">
      </div>

      <button class="customization-action-btn primary" style="margin-top: 12px;" onclick="customizationUI.saveComponentChanges('${componentId}')">
        Save Changes
      </button>
    `;
  }

  /**
   * Save component changes
   */
  saveComponentChanges(componentId) {
    const inputs = this.overlay.querySelectorAll('.component-input');
    const config = {};

    inputs.forEach(input => {
      const property = input.dataset.property;
      config[property] = input.value;
    });

    this.customizationManager.updateComponent(componentId, config);
    this.showNotification('Component updated successfully!', 'success');
  }

  /**
   * Get computed CSS variable value
   */
  getComputedCSSVariable(variableName) {
    return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim() || '#000000';
  }

  /**
   * Handle customization events
   */
  handleCustomizationEvent(event) {
    switch (event.type) {
      case 'templateLoaded':
        this.refreshUI();
        break;
      case 'cssVariablesChanged':
      case 'componentsChanged':
      case 'layoutUpdated':
        this.updateUnsavedIndicator();
        break;
      case 'customizationsReset':
        this.refreshUI();
        this.showNotification('Customizations reset to original state', 'info');
        break;
      case 'undo':
      case 'redo':
        this.refreshUI();
        break;
    }
  }

  /**
   * Refresh UI
   */
  refreshUI() {
    // Refresh current panel
    this.loadPanelContent(this.currentPanel);

    // Update status
    this.updateStatus();

    // Update unsaved indicator
    this.updateUnsavedIndicator();
  }

  /**
   * Update status display
   */
  updateStatus() {
    const statusText = this.overlay.querySelector('#customization-status-text');
    const template = this.customizationManager.currentTemplate;

    if (template) {
      statusText.textContent = `Editing: ${template.name}`;
    } else {
      statusText.textContent = 'No template loaded';
    }
  }

  /**
   * Update unsaved changes indicator
   */
  updateUnsavedIndicator() {
    const indicator = this.overlay.querySelector('#customization-unsaved-indicator');
    const hasUnsaved = this.customizationManager.hasUnsavedChanges();

    indicator.classList.toggle('hidden', !hasUnsaved);
  }

  /**
   * Save draft
   */
  saveDraft() {
    // In a real implementation, this would save to a backend
    this.showNotification('Draft saved successfully!', 'success');
  }

  /**
   * Publish changes
   */
  publishChanges() {
    // In a real implementation, this would publish to production
    this.showNotification('Changes published successfully!', 'success');
  }

  /**
   * Show notification
   */
  showNotification(message, type = 'info') {
    // Simple notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#c6f6d5' : type === 'error' ? '#fed7d7' : '#bee3f8'};
      color: ${type === 'success' ? '#276749' : type === 'error' ? '#c53030' : '#2c5282'};
      padding: 12px 20px;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      z-index: 10001;
      font-weight: 500;
      max-width: 300px;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}

// Export for global access
window.CustomizationUI = CustomizationUI;
