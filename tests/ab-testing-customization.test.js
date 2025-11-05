/**
 * A/B Testing and Template Customization Tests
 * Basic functionality tests for the new Phase 3 features
 */

describe('A/B Testing Framework', () => {
  let abTestingManager;
  let mockAnalytics;

  beforeEach(() => {
    // Mock localStorage
    global.localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn()
    };

    // Mock window.location
    global.window = {
      location: { pathname: '/home', href: 'http://localhost/home' },
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    };

    // Mock analytics manager
    mockAnalytics = {
      subscribe: jest.fn(),
      trackUserInteractions: jest.fn()
    };
    global.window.analyticsManager = mockAnalytics;

    // Import and initialize A/B testing manager
    const ABTestingManager = require('../src/ab-testing/ab-testing.js');
    abTestingManager = new ABTestingManager();
  });

  test('should create experiment successfully', () => {
    const config = {
      name: 'Test Experiment',
      description: 'A test A/B experiment',
      variants: [
        { id: 'variant_0', name: 'Control', description: 'Original version' },
        { id: 'variant_1', name: 'Test', description: 'New version' }
      ],
      trafficAllocation: 50,
      goals: ['purchase_initiated']
    };

    const experiment = abTestingManager.createExperiment(config);

    expect(experiment).toBeDefined();
    expect(experiment.name).toBe('Test Experiment');
    expect(experiment.variants).toHaveLength(2);
    expect(experiment.status).toBe('draft');
  });

  test('should start experiment and assign users', () => {
    const config = {
      name: 'Test Experiment',
      variants: [
        { id: 'variant_0', name: 'Control' },
        { id: 'variant_1', name: 'Test' }
      ],
      trafficAllocation: 50,
      goals: ['purchase_initiated']
    };

    const experiment = abTestingManager.createExperiment(config);
    const startedExperiment = abTestingManager.startExperiment(experiment.id);

    expect(startedExperiment.status).toBe('active');

    // Test user assignment
    const assignment = abTestingManager.assignUserToExperiment(experiment.id, 'test-user');
    expect(assignment).toBeDefined();
    expect(['variant_0', 'variant_1']).toContain(assignment.variantId);
  });

  test('should track conversions', () => {
    const config = {
      name: 'Test Experiment',
      variants: [
        { id: 'variant_0', name: 'Control' },
        { id: 'variant_1', name: 'Test' }
      ],
      trafficAllocation: 50,
      goals: ['purchase_initiated']
    };

    const experiment = abTestingManager.createExperiment(config);
    abTestingManager.startExperiment(experiment.id);

    // Assign user and track conversion
    const assignment = abTestingManager.assignUserToExperiment(experiment.id, 'test-user');
    abTestingManager.trackConversion(experiment.id, 'purchase_initiated', 'test-user');

    const results = abTestingManager.getExperimentResults(experiment.id);
    expect(results.variantA.conversions + results.variantB.conversions).toBe(1);
  });

  test('should calculate statistical significance', () => {
    const config = {
      name: 'Test Experiment',
      variants: [
        { id: 'variant_0', name: 'Control' },
        { id: 'variant_1', name: 'Test' }
      ],
      trafficAllocation: 50,
      goals: ['purchase_initiated']
    };

    const experiment = abTestingManager.createExperiment(config);
    abTestingManager.startExperiment(experiment.id);

    // Simulate traffic and conversions
    for (let i = 0; i < 100; i++) {
      const userId = `user_${i}`;
      abTestingManager.assignUserToExperiment(experiment.id, userId);

      // 10% conversion rate for control, 15% for test
      if (Math.random() < 0.1) {
        abTestingManager.trackConversion(experiment.id, 'purchase_initiated', userId);
      }
    }

    const results = abTestingManager.getExperimentResults(experiment.id);
    expect(results.variantA.visitors).toBeGreaterThan(0);
    expect(results.variantB.visitors).toBeGreaterThan(0);
    expect(typeof results.confidence).toBe('number');
  });
});

describe('Template Customization System', () => {
  let customizationManager;

  beforeEach(() => {
    // Mock localStorage
    global.localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn()
    };

    // Mock document and DOM elements
    global.document = {
      documentElement: {
        style: {
          setProperty: jest.fn(),
          getPropertyValue: jest.fn()
        }
      },
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      createElement: jest.fn(() => ({
        style: {},
        addEventListener: jest.fn(),
        setAttribute: jest.fn()
      })),
      head: {
        appendChild: jest.fn()
      },
      body: {
        appendChild: jest.fn()
      },
      querySelector: jest.fn(),
      querySelectorAll: jest.fn(() => [])
    };

    // Import and initialize customization manager
    const CustomizationManager = require('../src/customization/customization.js');
    customizationManager = new CustomizationManager();
  });

  test('should load template for customization', async () => {
    const templateData = {
      id: 'test-template',
      name: 'Test Template',
      category: 'business'
    };

    const template = await customizationManager.loadTemplate('test-template', templateData);

    expect(template).toBeDefined();
    expect(template.id).toBe('test-template');
    expect(template.name).toBe('Test Template');
  });

  test('should update CSS variables', () => {
    customizationManager.updateCSSVariable('--primary-color', '#ff0000');

    expect(document.documentElement.style.setProperty).toHaveBeenCalledWith('--primary-color', '#ff0000');
  });

  test('should update component configurations', () => {
    const mockElement = {
      dataset: { customizable: 'hero-1', componentType: 'hero' },
      querySelector: jest.fn(() => ({ textContent: 'Old Title' }))
    };

    global.document.querySelector = jest.fn(() => mockElement);

    customizationManager.updateComponent('hero-1', {
      title: 'New Title',
      subtitle: 'New Subtitle'
    });

    expect(customizationManager.componentConfigs.get('hero-1')).toEqual({
      title: 'New Title',
      subtitle: 'New Subtitle'
    });
  });

  test('should save and load customizations', () => {
    const customizations = {
      cssVariables: { '--primary-color': '#ff0000' },
      components: { 'hero-1': { title: 'New Title' } }
    };

    // Mock localStorage to return saved data
    global.localStorage.getItem = jest.fn(() => JSON.stringify({
      'test-template': customizations
    }));

    // Create new instance to test loading
    const newManager = new (require('../src/customization/customization.js'))();

    expect(newManager.customizations.get('test-template')).toEqual(customizations);
  });

  test('should export customizations', () => {
    const mockTemplate = {
      id: 'test-template',
      name: 'Test Template'
    };

    customizationManager.currentTemplate = mockTemplate;

    // Mock URL and document methods
    global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
    global.document.createElement = jest.fn(() => ({
      click: jest.fn(),
      href: '',
      download: ''
    }));

    const exportData = customizationManager.exportCustomizations();

    expect(exportData).toBeDefined();
    expect(exportData.templateId).toBe('test-template');
    expect(exportData.templateName).toBe('Test Template');
  });
});

describe('Integration Tests', () => {
  test('should integrate A/B testing with analytics', () => {
    // Mock analytics manager
    const mockAnalytics = {
      subscribe: jest.fn((callback) => {
        // Simulate conversion event
        callback({
          type: 'conversion',
          data: { type: 'purchase_initiated' }
        });
      })
    };

    global.window.analyticsManager = mockAnalytics;

    // Initialize A/B testing
    const ABTestingManager = require('../src/ab-testing/ab-testing.js');
    const abTesting = new ABTestingManager();

    // Create and start experiment
    const experiment = abTesting.createExperiment({
      name: 'Integration Test',
      variants: [
        { id: 'variant_0', name: 'Control' },
        { id: 'variant_1', name: 'Test' }
      ],
      goals: ['purchase_initiated']
    });

    abTesting.startExperiment(experiment.id);

    // Verify analytics integration was set up
    expect(mockAnalytics.subscribe).toHaveBeenCalled();
  });

  test('should integrate customization with marketplace', () => {
    // Mock template store
    const mockTemplateStore = {
      getTemplateById: jest.fn(() => ({
        id: 'test-template',
        name: 'Test Template'
      })),
      subscribe: jest.fn()
    };

    global.window.templateStore = mockTemplateStore;

    // Initialize customization integration
    const CustomizationIntegration = require('../src/customization/integration.js');
    const integration = new CustomizationIntegration();

    // Verify template store integration
    expect(mockTemplateStore.subscribe).toHaveBeenCalled();
  });
});

// Helper to run tests if Jest is available
if (typeof jest !== 'undefined') {
  // Tests will be run by Jest
  console.log('Running A/B Testing and Customization tests...');
} else {
  console.log('Jest not available - tests defined but not executed');
}
