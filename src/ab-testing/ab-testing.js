/**
 * A/B Testing Framework
 * Manages experiments, variants, traffic splitting, and conversion tracking
 */

class ABTestingManager {
  constructor() {
    this.experiments = new Map();
    this.activeExperiments = new Map();
    this.userAssignments = new Map();
    this.listeners = new Set();
    this.analyticsIntegration = null;

    // Initialize
    this.init();
  }

  /**
   * Initialize A/B testing framework
   */
  init() {
    // Load experiments from storage
    this.loadExperiments();

    // Set up user assignment persistence
    this.setupUserPersistence();

    // Integrate with analytics
    this.setupAnalyticsIntegration();

    // Start active experiments
    this.startActiveExperiments();
  }

  /**
   * Create a new A/B test experiment
   */
  createExperiment(config) {
    const experiment = {
      id: config.id || this.generateExperimentId(),
      name: config.name,
      description: config.description,
      status: 'draft', // draft, active, paused, completed
      variants: config.variants || [],
      trafficAllocation: config.trafficAllocation || 50, // percentage for variant B (A gets remainder)
      targetPages: config.targetPages || [],
      goals: config.goals || [], // conversion goals to track
      startDate: config.startDate || null,
      endDate: config.endDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      results: {
        variantA: { visitors: 0, conversions: 0, conversionRate: 0 },
        variantB: { visitors: 0, conversions: 0, conversionRate: 0 },
        confidence: 0,
        winner: null,
        statisticalSignificance: false
      }
    };

    // Validate experiment configuration
    this.validateExperiment(experiment);

    this.experiments.set(experiment.id, experiment);
    this.saveExperiments();

    this.notifyListeners('experimentCreated', experiment);
    return experiment;
  }

  /**
   * Generate unique experiment ID
   */
  generateExperimentId() {
    return 'exp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Validate experiment configuration
   */
  validateExperiment(experiment) {
    if (!experiment.name) {
      throw new Error('Experiment name is required');
    }

    if (experiment.variants.length < 2) {
      throw new Error('Experiment must have at least 2 variants');
    }

    if (experiment.trafficAllocation < 1 || experiment.trafficAllocation > 99) {
      throw new Error('Traffic allocation must be between 1 and 99');
    }

    if (experiment.goals.length === 0) {
      throw new Error('At least one goal must be defined');
    }

    // Validate variant configurations
    experiment.variants.forEach((variant, index) => {
      if (!variant.name) {
        throw new Error(`Variant ${index + 1} must have a name`);
      }
      if (!variant.id) {
        variant.id = `variant_${index}`;
      }
    });
  }

  /**
   * Start an experiment
   */
  startExperiment(experimentId) {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) {
      throw new Error('Experiment not found');
    }

    if (experiment.status !== 'draft' && experiment.status !== 'paused') {
      throw new Error('Experiment must be in draft or paused status to start');
    }

    experiment.status = 'active';
    experiment.startDate = new Date().toISOString();
    experiment.updatedAt = new Date().toISOString();

    this.activeExperiments.set(experimentId, experiment);
    this.saveExperiments();

    this.notifyListeners('experimentStarted', experiment);
    return experiment;
  }

  /**
   * Pause an experiment
   */
  pauseExperiment(experimentId) {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) {
      throw new Error('Experiment not found');
    }

    experiment.status = 'paused';
    experiment.updatedAt = new Date().toISOString();

    this.activeExperiments.delete(experimentId);
    this.saveExperiments();

    this.notifyListeners('experimentPaused', experiment);
    return experiment;
  }

  /**
   * Complete an experiment
   */
  completeExperiment(experimentId) {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) {
      throw new Error('Experiment not found');
    }

    experiment.status = 'completed';
    experiment.endDate = new Date().toISOString();
    experiment.updatedAt = new Date().toISOString();

    // Calculate final results
    this.calculateExperimentResults(experiment);

    this.activeExperiments.delete(experimentId);
    this.saveExperiments();

    this.notifyListeners('experimentCompleted', experiment);
    return experiment;
  }

  /**
   * Assign user to experiment variant
   */
  assignUserToExperiment(experimentId, userId = null) {
    const userKey = userId || this.getUserId();
    const experiment = this.experiments.get(experimentId);

    if (!experiment || experiment.status !== 'active') {
      return null;
    }

    // Check if user is already assigned
    const assignmentKey = `${experimentId}_${userKey}`;
    if (this.userAssignments.has(assignmentKey)) {
      return this.userAssignments.get(assignmentKey);
    }

    // Check if user should be included in experiment (based on target pages)
    if (!this.shouldIncludeUserInExperiment(experiment, window.location.pathname)) {
      return null;
    }

    // Assign variant based on traffic allocation
    const variant = this.selectVariant(experiment);
    const assignment = {
      experimentId,
      userId: userKey,
      variantId: variant.id,
      assignedAt: new Date().toISOString(),
      converted: false,
      conversionEvents: []
    };

    this.userAssignments.set(assignmentKey, assignment);

    // Track visitor for this variant
    this.trackVisitor(experimentId, variant.id);

    // Save assignments
    this.saveUserAssignments();

    return assignment;
  }

  /**
   * Check if user should be included in experiment
   */
  shouldIncludeUserInExperiment(experiment, currentPath) {
    if (experiment.targetPages.length === 0) {
      return true; // Include on all pages if no specific targets
    }

    return experiment.targetPages.some(page => {
      if (page.startsWith('*')) {
        // Wildcard matching
        const pattern = page.slice(1);
        return currentPath.includes(pattern);
      }
      return currentPath === page;
    });
  }

  /**
   * Select variant based on traffic allocation
   */
  selectVariant(experiment) {
    const trafficPercent = experiment.trafficAllocation;
    const randomValue = Math.random() * 100;

    if (randomValue <= trafficPercent) {
      return experiment.variants[1]; // Variant B
    } else {
      return experiment.variants[0]; // Variant A
    }
  }

  /**
   * Track visitor for experiment variant
   */
  trackVisitor(experimentId, variantId) {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) return;

    const variantKey = variantId === experiment.variants[0].id ? 'variantA' : 'variantB';
    experiment.results[variantKey].visitors++;

    this.saveExperiments();
  }

  /**
   * Track conversion for user in experiment
   */
  trackConversion(experimentId, goalName, userId = null, metadata = {}) {
    const userKey = userId || this.getUserId();
    const assignmentKey = `${experimentId}_${userKey}`;
    const assignment = this.userAssignments.get(assignmentKey);

    if (!assignment) return;

    const experiment = this.experiments.get(experimentId);
    if (!experiment) return;

    // Check if this goal is tracked for this experiment
    if (!experiment.goals.includes(goalName)) return;

    // Record conversion if not already converted for this goal
    if (!assignment.conversionEvents.some(event => event.goal === goalName)) {
      assignment.conversionEvents.push({
        goal: goalName,
        timestamp: new Date().toISOString(),
        metadata
      });

      assignment.converted = true;

      // Update experiment results
      const variantKey = assignment.variantId === experiment.variants[0].id ? 'variantA' : 'variantB';
      experiment.results[variantKey].conversions++;
      this.updateConversionRates(experiment);

      this.saveUserAssignments();
      this.saveExperiments();

      this.notifyListeners('conversion', {
        experimentId,
        userId: userKey,
        variantId: assignment.variantId,
        goal: goalName,
        metadata
      });
    }
  }

  /**
   * Update conversion rates for experiment
   */
  updateConversionRates(experiment) {
    ['variantA', 'variantB'].forEach(variantKey => {
      const variant = experiment.results[variantKey];
      variant.conversionRate = variant.visitors > 0 ?
        (variant.conversions / variant.visitors) * 100 : 0;
    });

    // Calculate statistical significance
    this.calculateStatisticalSignificance(experiment);
  }

  /**
   * Calculate statistical significance using chi-square test
   */
  calculateStatisticalSignificance(experiment) {
    const a = experiment.results.variantA;
    const b = experiment.results.variantB;

    if (a.visitors < 30 || b.visitors < 30) {
      // Need minimum sample size for statistical significance
      experiment.results.confidence = 0;
      experiment.results.statisticalSignificance = false;
      return;
    }

    // Chi-square test for conversion rates
    const totalConversions = a.conversions + b.conversions;
    const totalVisitors = a.visitors + b.visitors;
    const expectedA = (a.visitors / totalVisitors) * totalConversions;
    const expectedB = (b.visitors / totalVisitors) * totalConversions;

    const chiSquare = Math.pow(a.conversions - expectedA, 2) / expectedA +
                      Math.pow(b.conversions - expectedB, 2) / expectedB;

    // Chi-square critical value for 95% confidence (1 degree of freedom)
    const criticalValue = 3.841;
    const isSignificant = chiSquare > criticalValue;

    experiment.results.statisticalSignificance = isSignificant;
    experiment.results.confidence = Math.min(chiSquare / criticalValue * 95, 99);

    // Determine winner if significant
    if (isSignificant) {
      if (a.conversionRate > b.conversionRate) {
        experiment.results.winner = experiment.variants[0].id;
      } else {
        experiment.results.winner = experiment.variants[1].id;
      }
    }
  }

  /**
   * Calculate final experiment results
   */
  calculateExperimentResults(experiment) {
    this.updateConversionRates(experiment);
  }

  /**
   * Get user's assigned variant for experiment
   */
  getUserVariant(experimentId, userId = null) {
    const userKey = userId || this.getUserId();
    const assignmentKey = `${experimentId}_${userKey}`;
    const assignment = this.userAssignments.get(assignmentKey);

    if (!assignment) return null;

    const experiment = this.experiments.get(experimentId);
    if (!experiment) return null;

    return experiment.variants.find(v => v.id === assignment.variantId);
  }

  /**
   * Get experiment results
   */
  getExperimentResults(experimentId) {
    const experiment = this.experiments.get(experimentId);
    return experiment ? experiment.results : null;
  }

  /**
   * Get all experiments
   */
  getExperiments(status = null) {
    const experiments = Array.from(this.experiments.values());

    if (status) {
      return experiments.filter(exp => exp.status === status);
    }

    return experiments;
  }

  /**
   * Get active experiments for current page
   */
  getActiveExperimentsForPage(pagePath = window.location.pathname) {
    return Array.from(this.activeExperiments.values())
      .filter(exp => this.shouldIncludeUserInExperiment(exp, pagePath));
  }

  /**
   * Generate unique user ID
   */
  getUserId() {
    let userId = localStorage.getItem('abtesting_user_id');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('abtesting_user_id', userId);
    }
    return userId;
  }

  /**
   * Set up user assignment persistence
   */
  setupUserPersistence() {
    try {
      const saved = localStorage.getItem('abtesting_assignments');
      if (saved) {
        const assignments = JSON.parse(saved);
        Object.entries(assignments).forEach(([key, assignment]) => {
          this.userAssignments.set(key, assignment);
        });
      }
    } catch (error) {
      console.warn('Failed to load user assignments:', error);
    }
  }

  /**
   * Save user assignments to localStorage
   */
  saveUserAssignments() {
    try {
      const assignments = {};
      this.userAssignments.forEach((assignment, key) => {
        assignments[key] = assignment;
      });
      localStorage.setItem('abtesting_assignments', JSON.stringify(assignments));
    } catch (error) {
      console.warn('Failed to save user assignments:', error);
    }
  }

  /**
   * Load experiments from storage
   */
  loadExperiments() {
    try {
      const saved = localStorage.getItem('abtesting_experiments');
      if (saved) {
        const experiments = JSON.parse(saved);
        Object.entries(experiments).forEach(([id, experiment]) => {
          this.experiments.set(id, experiment);
          if (experiment.status === 'active') {
            this.activeExperiments.set(id, experiment);
          }
        });
      }
    } catch (error) {
      console.warn('Failed to load experiments:', error);
    }
  }

  /**
   * Save experiments to localStorage
   */
  saveExperiments() {
    try {
      const experiments = {};
      this.experiments.forEach((experiment, id) => {
        experiments[id] = experiment;
      });
      localStorage.setItem('abtesting_experiments', JSON.stringify(experiments));
    } catch (error) {
      console.warn('Failed to save experiments:', error);
    }
  }

  /**
   * Set up analytics integration
   */
  setupAnalyticsIntegration() {
    // Try to integrate with existing analytics system
    if (window.analyticsManager) {
      this.analyticsIntegration = window.analyticsManager;

      // Listen for conversion events from analytics
      this.analyticsIntegration.subscribe((event) => {
        if (event.type === 'conversion') {
          // Track conversion in active experiments
          this.activeExperiments.forEach((experiment) => {
            if (experiment.goals.includes(event.data.type)) {
              this.trackConversion(experiment.id, event.data.type, null, event.data);
            }
          });
        }
      });
    }
  }

  /**
   * Start active experiments
   */
  startActiveExperiments() {
    this.activeExperiments.forEach((experiment) => {
      // Assign current user to experiment if not already assigned
      this.assignUserToExperiment(experiment.id);
    });
  }

  /**
   * Subscribe to A/B testing events
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
        console.error('Error notifying A/B testing listener:', error);
      }
    });
  }

  /**
   * Get A/B testing dashboard data
   */
  getDashboardData() {
    const experiments = this.getExperiments();
    const activeExperiments = this.getActiveExperimentsForPage();

    return {
      totalExperiments: experiments.length,
      activeExperiments: activeExperiments.length,
      completedExperiments: experiments.filter(e => e.status === 'completed').length,
      experiments: experiments.map(exp => ({
        id: exp.id,
        name: exp.name,
        status: exp.status,
        variants: exp.variants.length,
        trafficAllocation: exp.trafficAllocation,
        results: exp.results,
        startDate: exp.startDate,
        endDate: exp.endDate
      }))
    };
  }

  /**
   * Export experiment data
   */
  exportExperimentData(experimentId) {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) return null;

    const data = {
      experiment,
      assignments: Array.from(this.userAssignments.entries())
        .filter(([key]) => key.startsWith(`${experimentId}_`))
        .map(([key, assignment]) => assignment),
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ab-test-${experimentId}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Create singleton instance
const abTestingManager = new ABTestingManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = abTestingManager;
}

export default abTestingManager;
