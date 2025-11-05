/**
 * A/B Testing Integration
 * Integrates A/B testing with the template marketplace and analytics
 */

class ABTestingIntegration {
  constructor() {
    this.abTestingManager = null;
    this.abTestingUI = null;
    this.initialized = false;
  }

  /**
   * Initialize A/B testing integration
   */
  async init() {
    if (this.initialized) return;

    try {
      // Wait for required dependencies
      await this.waitForDependencies();

      // Initialize A/B testing manager
      this.abTestingManager = new ABTestingManager();

      // Initialize UI
      this.abTestingUI = new ABTestingUI(this.abTestingManager);

      // Set up marketplace integration
      this.setupMarketplaceIntegration();

      // Set up analytics integration
      this.setupAnalyticsIntegration();

      // Set up global event handlers
      this.setupGlobalEventHandlers();

      // Create sample experiments for demonstration
      this.createSampleExperiments();

      this.initialized = true;
      console.log('A/B Testing integration initialized successfully');
    } catch (error) {
      console.error('Failed to initialize A/B testing integration:', error);
    }
  }

  /**
   * Wait for required dependencies to load
   */
  async waitForDependencies() {
    const dependencies = [
      { name: 'ABTestingManager', global: 'ABTestingManager' },
      { name: 'ABTestingUI', global: 'ABTestingUI' },
      { name: 'analyticsManager', global: 'analyticsManager' },
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

    // Track template views for A/B testing
    this.trackTemplateViews();

    // Track purchases for conversion goals
    this.trackPurchases();

    // Add A/B testing controls to marketplace
    this.addMarketplaceControls();
  }

  /**
   * Track template views for experiments
   */
  trackTemplateViews() {
    // Track when templates are viewed
    const originalGetTemplateById = window.templateStore.getTemplateById;
    window.templateStore.getTemplateById = (id) => {
      const template = originalGetTemplateById.call(window.templateStore, id);
      if (template) {
        // Check for active experiments on template pages
        const activeExperiments = this.abTestingManager.getActiveExperimentsForPage();
        activeExperiments.forEach(experiment => {
          // Assign user to experiment and track view
          const assignment = this.abTestingManager.assignUserToExperiment(experiment.id);
          if (assignment) {
            // Track template view as interaction
            window.analyticsManager.trackUserInteractions({
              type: 'template_view',
              templateId: id,
              experimentId: experiment.id,
              variantId: assignment.variantId,
              timestamp: Date.now()
            });
          }
        });
      }
      return template;
    };
  }

  /**
   * Track purchases for conversion goals
   */
  trackPurchases() {
    // Listen for purchase events
    window.templateStore.subscribe((event) => {
      if (event.type === 'purchase' || event.type === 'purchase_success') {
        // Track conversion for active experiments
        const activeExperiments = this.abTestingManager.getActiveExperimentsForPage();
        activeExperiments.forEach(experiment => {
          if (experiment.goals.includes('purchase_initiated') || experiment.goals.includes('purchase_completed')) {
            this.abTestingManager.trackConversion(experiment.id, 'purchase_initiated', null, {
              templateId: event.data?.templateId,
              amount: event.data?.amount
            });
          }
        });
      }
    });
  }

  /**
   * Add A/B testing controls to marketplace
   */
  addMarketplaceControls() {
    // Add A/B testing button to marketplace interface
    const addABTestingButton = () => {
      const marketplaceContainer = document.querySelector('.marketplace-container, #marketplace, .template-store');
      if (!marketplaceContainer) return;

      // Check if button already exists
      if (document.querySelector('.ab-testing-launch-btn')) return;

      const abButton = document.createElement('button');
      abButton.className = 'ab-testing-launch-btn';
      abButton.innerHTML = '🧪 A/B Tests';
      abButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #3182ce;
        color: white;
        border: none;
        border-radius: 50px;
        padding: 12px 20px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(49, 130, 206, 0.3);
        z-index: 1000;
        transition: all 0.2s;
      `;

      abButton.addEventListener('mouseenter', () => {
        abButton.style.transform = 'scale(1.05)';
        abButton.style.boxShadow = '0 6px 20px rgba(49, 130, 206, 0.4)';
      });

      abButton.addEventListener('mouseleave', () => {
        abButton.style.transform = 'scale(1)';
        abButton.style.boxShadow = '0 4px 12px rgba(49, 130, 206, 0.3)';
      });

      abButton.addEventListener('click', () => {
        this.abTestingUI.show();
      });

      document.body.appendChild(abButton);
    };

    // Try to add button immediately and after DOM changes
    addABTestingButton();
    setTimeout(addABTestingButton, 1000);

    // Watch for DOM changes
    const observer = new MutationObserver(() => {
      addABTestingButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  /**
   * Set up analytics integration
   */
  setupAnalyticsIntegration() {
    if (!window.analyticsManager) return;

    // Subscribe to analytics events for conversion tracking
    window.analyticsManager.subscribe((event) => {
      if (event.type === 'conversion') {
        // Track conversion in active experiments
        const activeExperiments = this.abTestingManager.getActiveExperimentsForPage();
        activeExperiments.forEach(experiment => {
          if (experiment.goals.includes(event.data.type)) {
            this.abTestingManager.trackConversion(experiment.id, event.data.type, null, event.data);
          }
        });
      }
    });
  }

  /**
   * Set up global event handlers
   */
  setupGlobalEventHandlers() {
    // Handle page navigation for experiment targeting
    window.addEventListener('popstate', () => {
      this.handlePageChange();
    });

    // Handle programmatic navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = (...args) => {
      originalPushState.apply(history, args);
      this.handlePageChange();
    };

    history.replaceState = (...args) => {
      originalReplaceState.apply(history, args);
      this.handlePageChange();
    };

    // Handle initial page load
    this.handlePageChange();
  }

  /**
   * Handle page changes for experiment targeting
   */
  handlePageChange() {
    setTimeout(() => {
      const activeExperiments = this.abTestingManager.getActiveExperimentsForPage();
      activeExperiments.forEach(experiment => {
        // Assign user to experiment if not already assigned
        this.abTestingManager.assignUserToExperiment(experiment.id);
      });
    }, 100);
  }

  /**
   * Create sample experiments for demonstration
   */
  createSampleExperiments() {
    const sampleExperiments = [
      {
        id: 'hero-button-color-test',
        name: 'Hero Button Color Test',
        description: 'Testing different button colors on hero sections to improve conversion rates',
        variants: [
          { id: 'variant_0', name: 'Blue Button (Control)', description: 'Standard blue button' },
          { id: 'variant_1', name: 'Green Button (Test)', description: 'Green button for better conversion' }
        ],
        trafficAllocation: 50,
        targetPages: ['/home', '/'],
        goals: ['purchase_initiated', 'demo_requested']
      },
      {
        id: 'pricing-display-test',
        name: 'Pricing Display Test',
        description: 'Testing different ways to display pricing information',
        variants: [
          { id: 'variant_0', name: 'Show Prices (Control)', description: 'Display prices prominently' },
          { id: 'variant_1', name: 'Contact for Pricing (Test)', description: 'Hide prices, show contact button' }
        ],
        trafficAllocation: 50,
        targetPages: ['/pricing', '/templates'],
        goals: ['contact_initiated', 'purchase_initiated']
      },
      {
        id: 'hero-headline-test',
        name: 'Hero Headline Test',
        description: 'Testing different hero headline messaging',
        variants: [
          { id: 'variant_0', name: 'Feature-focused (Control)', description: 'Focus on features and capabilities' },
          { id: 'variant_1', name: 'Benefit-focused (Test)', description: 'Focus on benefits and outcomes' }
        ],
        trafficAllocation: 50,
        targetPages: ['/home', '/'],
        goals: ['demo_requested', 'signup_initiated']
      }
    ];

    // Create experiments if they don't exist
    sampleExperiments.forEach(expConfig => {
      try {
        // Check if experiment already exists
        const existing = this.abTestingManager.experiments.get(expConfig.id);
        if (!existing) {
          this.abTestingManager.createExperiment(expConfig);
          console.log(`Created sample experiment: ${expConfig.name}`);
        }
      } catch (error) {
        console.warn(`Failed to create sample experiment ${expConfig.id}:`, error);
      }
    });
  }

  /**
   * Get A/B testing status for current page
   */
  getPageExperimentStatus() {
    const activeExperiments = this.abTestingManager.getActiveExperimentsForPage();
    const userAssignments = activeExperiments.map(exp => {
      const assignment = this.abTestingManager.getUserVariant(exp.id);
      return {
        experiment: exp,
        assignment: assignment
      };
    });

    return {
      activeExperiments: activeExperiments.length,
      userAssignments,
      pagePath: window.location.pathname
    };
  }

  /**
   * Manually trigger conversion for testing
   */
  triggerConversion(experimentId, goalName, metadata = {}) {
    this.abTestingManager.trackConversion(experimentId, goalName, null, metadata);
  }

  /**
   * Get experiment results for a specific experiment
   */
  getExperimentResults(experimentId) {
    return this.abTestingManager.getExperimentResults(experimentId);
  }

  /**
   * Export all experiment data
   */
  exportAllExperiments() {
    const experiments = this.abTestingManager.getExperiments();
    const exportData = {
      experiments,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ab-testing-experiments-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Create singleton instance
const abTestingIntegration = new ABTestingIntegration();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = abTestingIntegration;
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    abTestingIntegration.init();
  });
} else {
  abTestingIntegration.init();
}

// Export for global access
window.abTestingIntegration = abTestingIntegration;
