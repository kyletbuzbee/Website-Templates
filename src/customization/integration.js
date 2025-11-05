/**
 * Template Customization Integration
 * Integrates customization tools with the template marketplace
 */

class CustomizationIntegration {
  constructor() {
    this.customizationManager = null;
    this.customizationUI = null;
    this.initialized = false;
  }

  /**
   * Initialize customization integration
   */
  async init() {
    if (this.initialized) return;

    try {
      // Wait for required dependencies
      await this.waitForDependencies();

      // Initialize customization manager
      this.customizationManager = new CustomizationManager();

      // Initialize UI
      this.customizationUI = new CustomizationUI(this.customizationManager);

      // Set up marketplace integration
      this.setupMarketplaceIntegration();

      // Set up template preview integration
      this.setupTemplatePreviewIntegration();

      // Add customization controls to templates
      this.addTemplateCustomizationControls();

      this.initialized = true;
      console.log('Template customization integration initialized successfully');
    } catch (error) {
      console.error('Failed to initialize customization integration:', error);
    }
  }

  /**
   * Wait for required dependencies to load
   */
  async waitForDependencies() {
    const dependencies = [
      { name: 'CustomizationManager', global: 'CustomizationManager' },
      { name: 'CustomizationUI', global: 'CustomizationUI' },
      { name: 'templateStore', global: 'templateStore' }
    ];

    for (const dep of dependencies) {
      await this.waitForGlobal(dep.name, dep.global);
    }
  }

  /**
   * Wait for a global variable to be available
   */
  waitForGlobal(name, globalName) {
    return new Promise((resolve) => {
      const checkGlobal = () => {
        if (window[globalName] || (window.src && window.src[name])) {
          resolve();
        } else {
          setTimeout(checkGlobal, 100);
        }
      };
      checkGlobal();
    });
  }

  /**
   * Set up marketplace integration
   */
  setupMarketplaceIntegration() {
    if (!window.templateStore) return;

    // Add customization option to template cards
    this.addCustomizationToTemplateCards();

    // Track customization events
    this.trackCustomizationEvents();

    // Integrate with purchase flow
    this.integrateWithPurchaseFlow();
  }

  /**
   * Add customization option to template cards
   */
  addCustomizationToTemplateCards() {
    // Watch for template cards to be rendered
    const observer = new MutationObserver(() => {
      const templateCards = document.querySelectorAll('.template-card, [data-template-id]');
      templateCards.forEach(card => {
        this.addCustomizationButtonToCard(card);
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Also check immediately
    setTimeout(() => {
      const templateCards = document.querySelectorAll('.template-card, [data-template-id]');
      templateCards.forEach(card => {
        this.addCustomizationButtonToCard(card);
      });
    }, 1000);
  }

  /**
   * Add customization button to template card
   */
  addCustomizationButtonToCard(card) {
    // Check if button already exists
    if (card.querySelector('.customization-btn')) return;

    const templateId = card.dataset.templateId || card.dataset.id;
    if (!templateId) return;

    const customizeBtn = document.createElement('button');
    customizeBtn.className = 'customization-btn';
    customizeBtn.innerHTML = '🎨 Customize';
    customizeBtn.style.cssText = `
      background: #38a169;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      margin-top: 8px;
      transition: background 0.2s;
    `;

    customizeBtn.addEventListener('mouseenter', () => {
      customizeBtn.style.background = '#2f855a';
    });

    customizeBtn.addEventListener('mouseleave', () => {
      customizeBtn.style.background = '#38a169';
    });

    customizeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.launchCustomization(templateId);
    });

    // Add to card
    const cardActions = card.querySelector('.card-actions, .template-actions');
    if (cardActions) {
      cardActions.appendChild(customizeBtn);
    } else {
      card.appendChild(customizeBtn);
    }
  }

  /**
   * Launch customization for a template
   */
  async launchCustomization(templateId) {
    try {
      // Get template data from store
      const template = window.templateStore.getTemplateById(templateId);
      if (!template) {
        console.warn('Template not found:', templateId);
        return;
      }

      // Load template for customization
      await this.customizationManager.loadTemplate(templateId, template);

      // Show customization UI
      this.customizationUI.show(templateId);

      // Track customization launch
      if (window.analyticsManager) {
        window.analyticsManager.trackUserInteractions({
          type: 'customization_launched',
          templateId: templateId,
          timestamp: Date.now()
        });
      }
    } catch (error) {
      console.error('Failed to launch customization:', error);
      this.showNotification('Failed to load template for customization', 'error');
    }
  }

  /**
   * Track customization events
   */
  trackCustomizationEvents() {
    // Subscribe to customization events
    this.customizationManager.subscribe((event) => {
      if (window.analyticsManager) {
        switch (event.type) {
          case 'templateLoaded':
            window.analyticsManager.trackUserInteractions({
              type: 'customization_template_loaded',
              templateId: event.data.id,
              timestamp: Date.now()
            });
            break;
          case 'cssVariableUpdated':
            window.analyticsManager.trackUserInteractions({
              type: 'customization_css_updated',
              property: event.data.property,
              value: event.data.value,
              timestamp: Date.now()
            });
            break;
          case 'componentUpdated':
            window.analyticsManager.trackUserInteractions({
              type: 'customization_component_updated',
              componentId: event.data.componentId,
              timestamp: Date.now()
            });
            break;
          case 'customizationsSaved':
            window.analyticsManager.trackUserInteractions({
              type: 'customization_saved',
              templateId: this.customizationManager.currentTemplate?.id,
              timestamp: Date.now()
            });
            break;
        }
      }
    });
  }

  /**
   * Integrate with purchase flow
   */
  integrateWithPurchaseFlow() {
    // Modify purchase flow to include customizations
    const originalPurchaseCart = window.templateStore.purchaseCart;
    window.templateStore.purchaseCart = async (paymentMethod) => {
      const cartItems = window.templateStore.getCartItems();

      // Check if any items have customizations
      const customizedItems = cartItems.filter(item => {
        const customizations = this.customizationManager.customizations.get(item.id);
        return customizations && Object.keys(customizations).length > 0;
      });

      if (customizedItems.length > 0) {
        // Include customizations in purchase data
        const purchaseData = {
          items: cartItems.map(item => ({
            id: item.id,
            price: item.price,
            customizations: this.customizationManager.customizations.get(item.id) || {}
          })),
          total: window.templateStore.getCartTotal(),
          paymentMethod: paymentMethod,
          currency: 'USD',
          hasCustomizations: true
        };

        // Call original purchase with customizations
        return this.makePurchaseRequest('/api/store/purchase', purchaseData);
      } else {
        // No customizations, use original flow
        return originalPurchaseCart.call(window.templateStore, paymentMethod);
      }
    };
  }

  /**
   * Make purchase request with customizations
   */
  async makePurchaseRequest(url, data) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `HTTP ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error('Purchase error:', error);
      throw error;
    }
  }

  /**
   * Set up template preview integration
   */
  setupTemplatePreviewIntegration() {
    // Add preview mode indicators
    this.addPreviewModeIndicators();

    // Handle template switching in customization
    this.handleTemplateSwitching();
  }

  /**
   * Add preview mode indicators
   */
  addPreviewModeIndicators() {
    // Listen for preview mode changes
    this.customizationManager.subscribe((event) => {
      if (event.type === 'previewModeEnabled') {
        this.showPreviewIndicator();
      } else if (event.type === 'previewModeDisabled') {
        this.hidePreviewIndicator();
      }
    });
  }

  /**
   * Show preview mode indicator
   */
  showPreviewIndicator() {
    let indicator = document.querySelector('.customization-preview-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'customization-preview-indicator';
      indicator.innerHTML = `
        <div style="
          position: fixed;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          background: #3182ce;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
          z-index: 9999;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        ">
          🎨 Customization Preview Mode
          <button onclick="customizationManager.disablePreviewMode()" style="
            background: none;
            border: none;
            color: white;
            margin-left: 8px;
            cursor: pointer;
            font-size: 16px;
          ">×</button>
        </div>
      `;
      document.body.appendChild(indicator);
    }
    indicator.style.display = 'block';
  }

  /**
   * Hide preview mode indicator
   */
  hidePreviewIndicator() {
    const indicator = document.querySelector('.customization-preview-indicator');
    if (indicator) {
      indicator.style.display = 'none';
    }
  }

  /**
   * Handle template switching in customization
   */
  handleTemplateSwitching() {
    // Allow switching between templates while customizing
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 't' && this.customizationUI.overlay.classList.contains('hidden') === false) {
        e.preventDefault();
        this.showTemplateSwitcher();
      }
    });
  }

  /**
   * Show template switcher
   */
  showTemplateSwitcher() {
    const switcher = document.createElement('div');
    switcher.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    switcher.innerHTML = `
      <div style="
        background: white;
        border-radius: 8px;
        padding: 20px;
        max-width: 500px;
        width: 90%;
        max-height: 70vh;
        overflow-y: auto;
      ">
        <h3 style="margin-top: 0; color: #1a202c;">Switch Template</h3>
        <p style="color: #718096; margin-bottom: 20px;">Choose a different template to customize:</p>
        <div id="template-switcher-list" style="display: grid; gap: 10px;">
          <!-- Templates will be loaded here -->
        </div>
        <div style="margin-top: 20px; text-align: right;">
          <button onclick="this.closest('.customization-overlay').remove()" style="
            background: #e2e8f0;
            color: #4a5568;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
          ">Cancel</button>
        </div>
      </div>
    `;

    // Load available templates
    const templateList = switcher.querySelector('#template-switcher-list');
    const templates = window.templateStore.getFilteredTemplates().slice(0, 10); // Limit to 10

    templates.forEach(template => {
      const templateItem = document.createElement('div');
      templateItem.style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        border: 1px solid #e1e5e9;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
      `;

      templateItem.innerHTML = `
        <img src="${template.image}" alt="${template.name}" style="
          width: 40px;
          height: 40px;
          object-fit: cover;
          border-radius: 4px;
        ">
        <div style="flex: 1;">
          <div style="font-weight: 500; color: #1a202c;">${template.name}</div>
          <div style="font-size: 12px; color: #718096;">${template.category}</div>
        </div>
        <div style="color: #38a169; font-weight: 600;">$${template.price}</div>
      `;

      templateItem.addEventListener('mouseenter', () => {
        templateItem.style.borderColor = '#3182ce';
        templateItem.style.background = '#f7fafc';
      });

      templateItem.addEventListener('mouseleave', () => {
        templateItem.style.borderColor = '#e1e5e9';
        templateItem.style.background = 'white';
      });

      templateItem.addEventListener('click', () => {
        document.body.removeChild(switcher);
        this.launchCustomization(template.id);
      });

      templateList.appendChild(templateItem);
    });

    document.body.appendChild(switcher);

    // Close on background click
    switcher.addEventListener('click', (e) => {
      if (e.target === switcher) {
        document.body.removeChild(switcher);
      }
    });
  }

  /**
   * Add customization controls to templates
   */
  addTemplateCustomizationControls() {
    // Add floating customization button for template pages
    const addCustomizationButton = () => {
      if (document.querySelector('.floating-customization-btn')) return;

      // Check if we're on a template page
      const isTemplatePage = window.location.pathname.includes('/templates/') ||
                            window.location.pathname.includes('/kits/') ||
                            window.location.pathname.includes('/industries/');

      if (!isTemplatePage) return;

      const customizeBtn = document.createElement('button');
      customizeBtn.className = 'floating-customization-btn';
      customizeBtn.innerHTML = '🎨 Customize This Template';
      customizeBtn.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 50px;
        padding: 12px 24px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
        z-index: 1000;
        transition: all 0.3s;
        animation: slideIn 0.5s ease-out;
      `;

      customizeBtn.addEventListener('mouseenter', () => {
        customizeBtn.style.transform = 'scale(1.05)';
        customizeBtn.style.boxShadow = '0 6px 25px rgba(102, 126, 234, 0.5)';
      });

      customizeBtn.addEventListener('mouseleave', () => {
        customizeBtn.style.transform = 'scale(1)';
        customizeBtn.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.4)';
      });

      customizeBtn.addEventListener('click', () => {
        // Extract template ID from URL
        const pathParts = window.location.pathname.split('/');
        const templateType = pathParts[1]; // kits, industries, etc.
        const templateName = pathParts[2];
        const templateId = `${templateType}-${templateName}`;

        this.launchCustomization(templateId);
      });

      document.body.appendChild(customizeBtn);

      // Add slide-in animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes slideIn {
          from {
            transform: translateX(100px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(style);
    };

    // Add button after page load
    setTimeout(addCustomizationButton, 1500);

    // Also add on navigation
    window.addEventListener('popstate', () => {
      setTimeout(addCustomizationButton, 500);
    });
  }

  /**
   * Show notification
   */
  showNotification(message, type = 'info') {
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

  /**
   * Get current customization state
   */
  getCurrentCustomizationState() {
    return {
      currentTemplate: this.customizationManager.currentTemplate,
      customizations: this.customizationManager.getCurrentCustomizations(),
      previewMode: this.customizationManager.previewMode,
      hasUnsavedChanges: this.customizationManager.hasUnsavedChanges()
    };
  }

  /**
   * Apply saved customizations to current page
   */
  applySavedCustomizations(templateId) {
    const customizations = this.customizationManager.customizations.get(templateId);
    if (customizations) {
      this.customizationManager.applyCustomizations(customizations);
    }
  }

  /**
   * Export current customizations
   */
  exportCurrentCustomizations() {
    this.customizationManager.exportCustomizations();
  }

  /**
   * Import customizations from file
   */
  importCustomizations(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target.result);
        const success = this.customizationManager.importCustomizations(importData);
        if (success) {
          this.showNotification('Customizations imported successfully!', 'success');
        } else {
          this.showNotification('Failed to import customizations', 'error');
        }
      } catch (error) {
        console.error('Failed to parse customization file:', error);
        this.showNotification('Invalid customization file', 'error');
      }
    };
    reader.readAsText(file);
  }
}

// Create singleton instance
const customizationIntegration = new CustomizationIntegration();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = customizationIntegration;
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    customizationIntegration.init();
  });
} else {
  customizationIntegration.init();
}

// Export for global access
window.customizationIntegration = customizationIntegration;
