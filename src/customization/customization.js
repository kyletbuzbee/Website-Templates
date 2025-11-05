/**
 * Template Customization System
 * Manages live preview, theme editing, and component configuration
 */

class CustomizationManager {
  constructor() {
    this.currentTemplate = null;
    this.customizations = new Map();
    this.previewMode = false;
    this.listeners = new Set();
    this.cssVariables = new Map();
    this.componentConfigs = new Map();
    this.history = [];
    this.historyIndex = -1;

    // Initialize
    this.init();
  }

  /**
   * Initialize customization system
   */
  init() {
    // Load saved customizations
    this.loadCustomizations();

    // Set up CSS variable tracking
    this.setupCSSVariableTracking();

    // Set up component configuration
    this.setupComponentTracking();

    // Set up keyboard shortcuts
    this.setupKeyboardShortcuts();

    // Set up auto-save
    this.setupAutoSave();
  }

  /**
   * Load a template for customization
   */
  async loadTemplate(templateId, templateData = null) {
    try {
      let template;

      if (templateData) {
        template = templateData;
      } else {
        // Load template from store or API
        template = await this.fetchTemplate(templateId);
      }

      this.currentTemplate = {
        id: templateId,
        ...template,
        originalCSS: this.extractCSSVariables(),
        originalComponents: this.extractComponentConfigs()
      };

      // Load existing customizations for this template
      const savedCustomizations = this.customizations.get(templateId);
      if (savedCustomizations) {
        this.applyCustomizations(savedCustomizations);
      }

      this.notifyListeners('templateLoaded', this.currentTemplate);
      return this.currentTemplate;
    } catch (error) {
      console.error('Failed to load template:', error);
      throw error;
    }
  }

  /**
   * Fetch template data
   */
  async fetchTemplate(templateId) {
    // Try to get from template store first
    if (window.templateStore) {
      const template = window.templateStore.getTemplateById(templateId);
      if (template) {
        return template;
      }
    }

    // Fallback to API
    const response = await fetch(`/api/templates/${templateId}`);
    if (!response.ok) {
      throw new Error('Template not found');
    }
    return await response.json();
  }

  /**
   * Extract CSS variables from current page
   */
  extractCSSVariables() {
    const variables = {};
    const stylesheets = document.styleSheets;

    for (let i = 0; i < stylesheets.length; i++) {
      try {
        const rules = stylesheets[i].cssRules;
        for (let j = 0; j < rules.length; j++) {
          const rule = rules[j];
          if (rule.type === CSSRule.STYLE_RULE) {
            const style = rule.style;
            for (let k = 0; k < style.length; k++) {
              const property = style[k];
              if (property.startsWith('--')) {
                variables[property] = style.getPropertyValue(property);
              }
            }
          }
        }
      } catch (error) {
        // Skip cross-origin stylesheets
        continue;
      }
    }

    return variables;
  }

  /**
   * Extract component configurations
   */
  extractComponentConfigs() {
    const components = {};

    // Find customizable components
    const customizableElements = document.querySelectorAll('[data-customizable]');

    customizableElements.forEach(element => {
      const componentId = element.dataset.customizable;
      const componentType = element.dataset.componentType || 'generic';

      components[componentId] = {
        type: componentType,
        element: element,
        originalHTML: element.innerHTML,
        originalClasses: element.className,
        config: this.extractComponentConfig(element, componentType)
      };
    });

    return components;
  }

  /**
   * Extract configuration for specific component type
   */
  extractComponentConfig(element, componentType) {
    const config = {};

    switch (componentType) {
      case 'hero':
        config.title = element.querySelector('h1')?.textContent || '';
        config.subtitle = element.querySelector('p')?.textContent || '';
        config.buttonText = element.querySelector('a, button')?.textContent || '';
        config.buttonUrl = element.querySelector('a')?.href || '';
        config.backgroundImage = element.style.backgroundImage || '';
        break;

      case 'button':
        config.text = element.textContent || '';
        config.url = element.href || element.dataset.url || '';
        config.style = element.className;
        config.size = element.dataset.size || 'medium';
        break;

      case 'text':
        config.content = element.innerHTML;
        config.alignment = element.style.textAlign || 'left';
        break;

      case 'image':
        config.src = element.src || element.dataset.src || '';
        config.alt = element.alt || '';
        config.caption = element.dataset.caption || '';
        break;

      default:
        // Generic component - extract common properties
        config.content = element.innerHTML;
        config.classes = element.className;
        break;
    }

    return config;
  }

  /**
   * Apply customizations to current template
   */
  applyCustomizations(customizations) {
    if (!customizations) return;

    // Apply CSS variable changes
    if (customizations.cssVariables) {
      this.applyCSSVariables(customizations.cssVariables);
    }

    // Apply component changes
    if (customizations.components) {
      this.applyComponentChanges(customizations.components);
    }

    // Apply layout changes
    if (customizations.layout) {
      this.applyLayoutChanges(customizations.layout);
    }
  }

  /**
   * Apply CSS variable changes
   */
  applyCSSVariables(variables) {
    const root = document.documentElement;

    Object.entries(variables).forEach(([property, value]) => {
      root.style.setProperty(property, value);
      this.cssVariables.set(property, value);
    });

    this.notifyListeners('cssVariablesChanged', variables);
  }

  /**
   * Apply component configuration changes
   */
  applyComponentChanges(components) {
    Object.entries(components).forEach(([componentId, config]) => {
      const element = document.querySelector(`[data-customizable="${componentId}"]`);
      if (!element) return;

      this.applyComponentConfig(element, config);
      this.componentConfigs.set(componentId, config);
    });

    this.notifyListeners('componentsChanged', components);
  }

  /**
   * Apply configuration to specific component
   */
  applyComponentConfig(element, config) {
    const componentType = element.dataset.componentType || 'generic';

    switch (componentType) {
      case 'hero':
        if (config.title !== undefined) {
          const titleEl = element.querySelector('h1');
          if (titleEl) titleEl.textContent = config.title;
        }
        if (config.subtitle !== undefined) {
          const subtitleEl = element.querySelector('p');
          if (subtitleEl) subtitleEl.textContent = config.subtitle;
        }
        if (config.buttonText !== undefined) {
          const buttonEl = element.querySelector('a, button');
          if (buttonEl) buttonEl.textContent = config.buttonText;
        }
        if (config.buttonUrl !== undefined) {
          const buttonEl = element.querySelector('a');
          if (buttonEl) buttonEl.href = config.buttonUrl;
        }
        if (config.backgroundImage !== undefined) {
          element.style.backgroundImage = config.backgroundImage;
        }
        break;

      case 'button':
        if (config.text !== undefined) element.textContent = config.text;
        if (config.url !== undefined && element.tagName === 'A') element.href = config.url;
        if (config.style !== undefined) element.className = config.style;
        if (config.size !== undefined) element.dataset.size = config.size;
        break;

      case 'text':
        if (config.content !== undefined) element.innerHTML = config.content;
        if (config.alignment !== undefined) element.style.textAlign = config.alignment;
        break;

      case 'image':
        if (config.src !== undefined) element.src = config.src;
        if (config.alt !== undefined) element.alt = config.alt;
        if (config.caption !== undefined) element.dataset.caption = config.caption;
        break;

      default:
        if (config.content !== undefined) element.innerHTML = config.content;
        if (config.classes !== undefined) element.className = config.classes;
        break;
    }
  }

  /**
   * Apply layout changes
   */
  applyLayoutChanges(layout) {
    // Apply layout-specific changes like grid adjustments, spacing, etc.
    if (layout.gridColumns !== undefined) {
      document.documentElement.style.setProperty('--grid-columns', layout.gridColumns);
    }
    if (layout.spacing !== undefined) {
      document.documentElement.style.setProperty('--base-spacing', layout.spacing);
    }
    if (layout.maxWidth !== undefined) {
      document.documentElement.style.setProperty('--max-width', layout.maxWidth);
    }
  }

  /**
   * Update CSS variable
   */
  updateCSSVariable(property, value) {
    this.saveToHistory();

    const variables = { [property]: value };
    this.applyCSSVariables(variables);

    // Save to current template customizations
    if (this.currentTemplate) {
      const customizations = this.customizations.get(this.currentTemplate.id) || {};
      customizations.cssVariables = customizations.cssVariables || {};
      customizations.cssVariables[property] = value;
      this.customizations.set(this.currentTemplate.id, customizations);
      this.saveCustomizations();
    }

    this.notifyListeners('cssVariableUpdated', { property, value });
  }

  /**
   * Update component configuration
   */
  updateComponent(componentId, config) {
    this.saveToHistory();

    const components = { [componentId]: config };
    this.applyComponentChanges(components);

    // Save to current template customizations
    if (this.currentTemplate) {
      const customizations = this.customizations.get(this.currentTemplate.id) || {};
      customizations.components = customizations.components || {};
      customizations.components[componentId] = config;
      this.customizations.set(this.currentTemplate.id, customizations);
      this.saveCustomizations();
    }

    this.notifyListeners('componentUpdated', { componentId, config });
  }

  /**
   * Update layout settings
   */
  updateLayout(layout) {
    this.saveToHistory();

    this.applyLayoutChanges(layout);

    // Save to current template customizations
    if (this.currentTemplate) {
      const customizations = this.customizations.get(this.currentTemplate.id) || {};
      customizations.layout = { ...customizations.layout, ...layout };
      this.customizations.set(this.currentTemplate.id, customizations);
      this.saveCustomizations();
    }

    this.notifyListeners('layoutUpdated', layout);
  }

  /**
   * Enable preview mode
   */
  enablePreviewMode() {
    this.previewMode = true;
    document.body.classList.add('customization-preview');

    // Add visual indicators for customizable elements
    const customizableElements = document.querySelectorAll('[data-customizable]');
    customizableElements.forEach(element => {
      element.classList.add('customization-preview-element');
      element.title = 'Click to customize this element';
    });

    this.notifyListeners('previewModeEnabled');
  }

  /**
   * Disable preview mode
   */
  disablePreviewMode() {
    this.previewMode = false;
    document.body.classList.remove('customization-preview');

    // Remove visual indicators
    const customizableElements = document.querySelectorAll('.customization-preview-element');
    customizableElements.forEach(element => {
      element.classList.remove('customization-preview-element');
      element.removeAttribute('title');
    });

    this.notifyListeners('previewModeDisabled');
  }

  /**
   * Get current customization state
   */
  getCurrentCustomizations() {
    if (!this.currentTemplate) return null;

    return this.customizations.get(this.currentTemplate.id) || {
      cssVariables: {},
      components: {},
      layout: {}
    };
  }

  /**
   * Reset customizations to original state
   */
  resetCustomizations() {
    if (!this.currentTemplate) return;

    this.saveToHistory();

    // Reset CSS variables
    const root = document.documentElement;
    Object.keys(this.currentTemplate.originalCSS).forEach(property => {
      const originalValue = this.currentTemplate.originalCSS[property];
      root.style.setProperty(property, originalValue);
    });

    // Reset components
    Object.entries(this.currentTemplate.originalComponents).forEach(([componentId, original]) => {
      this.applyComponentConfig(original.element, original.config);
    });

    // Clear saved customizations
    this.customizations.delete(this.currentTemplate.id);
    this.saveCustomizations();

    // Clear current state
    this.cssVariables.clear();
    this.componentConfigs.clear();

    this.notifyListeners('customizationsReset');
  }

  /**
   * Save current state to history for undo/redo
   */
  saveToHistory() {
    const state = {
      cssVariables: new Map(this.cssVariables),
      componentConfigs: new Map(this.componentConfigs),
      timestamp: Date.now()
    };

    // Remove any history after current index (for redo functionality)
    this.history = this.history.slice(0, this.historyIndex + 1);

    // Add new state
    this.history.push(state);
    this.historyIndex = this.history.length - 1;

    // Limit history to 50 states
    if (this.history.length > 50) {
      this.history.shift();
      this.historyIndex--;
    }
  }

  /**
   * Undo last change
   */
  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.restoreFromHistory(this.history[this.historyIndex]);
      this.notifyListeners('undo');
      return true;
    }
    return false;
  }

  /**
   * Redo last undone change
   */
  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.restoreFromHistory(this.history[this.historyIndex]);
      this.notifyListeners('redo');
      return true;
    }
    return false;
  }

  /**
   * Restore state from history
   */
  restoreFromHistory(state) {
    // Restore CSS variables
    const root = document.documentElement;
    // First reset to original
    if (this.currentTemplate) {
      Object.entries(this.currentTemplate.originalCSS).forEach(([property, value]) => {
        root.style.setProperty(property, value);
      });
    }
    // Then apply historical state
    state.cssVariables.forEach((value, property) => {
      root.style.setProperty(property, value);
    });

    // Restore component configs
    if (this.currentTemplate) {
      Object.entries(this.currentTemplate.originalComponents).forEach(([componentId, original]) => {
        this.applyComponentConfig(original.element, original.config);
      });
    }
    state.componentConfigs.forEach((config, componentId) => {
      const element = document.querySelector(`[data-customizable="${componentId}"]`);
      if (element) {
        this.applyComponentConfig(element, config);
      }
    });

    // Update current state
    this.cssVariables = new Map(state.cssVariables);
    this.componentConfigs = new Map(state.componentConfigs);
  }

  /**
   * Export customizations
   */
  exportCustomizations() {
    if (!this.currentTemplate) return null;

    const customizations = this.getCurrentCustomizations();
    const exportData = {
      templateId: this.currentTemplate.id,
      templateName: this.currentTemplate.name,
      customizations,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customizations-${this.currentTemplate.id}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return exportData;
  }

  /**
   * Import customizations
   */
  importCustomizations(importData) {
    try {
      if (!importData.templateId || !importData.customizations) {
        throw new Error('Invalid customization data');
      }

      this.customizations.set(importData.templateId, importData.customizations);
      this.saveCustomizations();

      // Apply if it's the current template
      if (this.currentTemplate && this.currentTemplate.id === importData.templateId) {
        this.applyCustomizations(importData.customizations);
      }

      this.notifyListeners('customizationsImported', importData);
      return true;
    } catch (error) {
      console.error('Failed to import customizations:', error);
      return false;
    }
  }

  /**
   * Set up CSS variable tracking
   */
  setupCSSVariableTracking() {
    // Monitor changes to CSS variables
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          // Check if any CSS variables changed
          const newVariables = this.extractCSSVariables();
          const changedVariables = {};

          Object.entries(newVariables).forEach(([property, value]) => {
            if (this.cssVariables.get(property) !== value) {
              changedVariables[property] = value;
              this.cssVariables.set(property, value);
            }
          });

          if (Object.keys(changedVariables).length > 0) {
            this.notifyListeners('cssVariablesChangedExternally', changedVariables);
          }
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style']
    });
  }

  /**
   * Set up component tracking
   */
  setupComponentTracking() {
    // Monitor changes to customizable components
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          const target = mutation.target.closest('[data-customizable]');
          if (target) {
            const componentId = target.dataset.customizable;
            this.notifyListeners('componentChangedExternally', {
              componentId,
              element: target
            });
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  /**
   * Set up keyboard shortcuts
   */
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
      // Ctrl+Z for undo
      if (event.ctrlKey && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        this.undo();
      }

      // Ctrl+Y or Ctrl+Shift+Z for redo
      if ((event.ctrlKey && event.key === 'y') ||
          (event.ctrlKey && event.shiftKey && event.key === 'Z')) {
        event.preventDefault();
        this.redo();
      }

      // Ctrl+S for save (if in customization mode)
      if (event.ctrlKey && event.key === 's' && this.previewMode) {
        event.preventDefault();
        this.saveCustomizations();
        this.notifyListeners('customizationsSaved');
      }
    });
  }

  /**
   * Set up auto-save functionality
   */
  setupAutoSave() {
    // Auto-save every 30 seconds if there are unsaved changes
    setInterval(() => {
      if (this.currentTemplate && this.hasUnsavedChanges()) {
        this.saveCustomizations();
      }
    }, 30000);
  }

  /**
   * Check if there are unsaved changes
   */
  hasUnsavedChanges() {
    if (!this.currentTemplate) return false;

    const saved = this.customizations.get(this.currentTemplate.id);
    const current = this.getCurrentCustomizations();

    return JSON.stringify(saved) !== JSON.stringify(current);
  }

  /**
   * Load saved customizations from localStorage
   */
  loadCustomizations() {
    try {
      const saved = localStorage.getItem('template_customizations');
      if (saved) {
        const customizations = JSON.parse(saved);
        Object.entries(customizations).forEach(([templateId, customization]) => {
          this.customizations.set(templateId, customization);
        });
      }
    } catch (error) {
      console.warn('Failed to load customizations:', error);
    }
  }

  /**
   * Save customizations to localStorage
   */
  saveCustomizations() {
    try {
      const customizations = {};
      this.customizations.forEach((customization, templateId) => {
        customizations[templateId] = customization;
      });
      localStorage.setItem('template_customizations', JSON.stringify(customizations));
    } catch (error) {
      console.warn('Failed to save customizations:', error);
    }
  }

  /**
   * Subscribe to customization events
   */
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify listeners of events
   */
  notifyListeners(eventType, data) {
    this.listeners.forEach(listener => {
      try {
        listener({
          type: eventType,
          data,
          timestamp: Date.now()
        });
      } catch (error) {
        console.error('Error notifying customization listener:', error);
      }
    });
  }

  /**
   * Get customization dashboard data
   */
  getDashboardData() {
    return {
      currentTemplate: this.currentTemplate,
      previewMode: this.previewMode,
      customizationsCount: this.customizations.size,
      hasUnsavedChanges: this.hasUnsavedChanges(),
      historyLength: this.history.length,
      currentHistoryIndex: this.historyIndex,
      cssVariables: Object.fromEntries(this.cssVariables),
      componentConfigs: Object.fromEntries(this.componentConfigs)
    };
  }
}

// Create singleton instance
const customizationManager = new CustomizationManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = customizationManager;
}

export default customizationManager;
