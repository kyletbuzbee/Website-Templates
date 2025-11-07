/**
 * Enterprise A/B Testing Framework
 * Production-ready with robust error handling and stable user bucketing
 */

class ABTestingManager {
  constructor(options = {}) {
        this.storageKey = options.storageKey || 'ab_testing_experiments';
        this.userIdKey = options.userIdKey || 'ab_testing_user_id';
        this.experiments = new Map();
    this.initialized = false;

    // Generate or retrieve stable user ID
        this.userId = this.getStableUserId();

    // Set up cross-tab synchronization
        this.setupCrossTabSync();

    // Initialize experiments from storage
        this.loadExperiments();
    }

  /**
     * Generate or retrieve a stable user ID for consistent bucketing
     */
    getStableUserId() {
        let userId = this.getSafeStorage(this.userIdKey);

    if (!userId) {
            // Generate a stable ID based on available entropy
      userId = this.generateStableUserId();
      this.setSafeStorage(this.userIdKey, userId);
        }

    return userId;
    }

  /**
     * Generate a stable user ID with maximum available entropy
     */
    generateStableUserId() {
        const entropy = [];

    // Use high-entropy sources when available
        if (navigator.userAgent) {entropy.push(navigator.userAgent);}
    if (screen.width && screen.height) {entropy.push(`${screen.width}x${screen.height}`);}
    if (navigator.language) {entropy.push(navigator.language);}
    if (navigator.platform) {entropy.push(navigator.platform);}

    // Add timestamp for uniqueness
        entropy.push(Date.now().toString());

    // Create hash from entropy sources
        return this.simpleHash(entropy.join('|')).toString(36);
  }

  /**
     * Simple, fast hash function for stable bucketing
     * Ensures same user always gets same variant
     */
  simpleHash(str) {
    let hash = 0;
    const len = str.length;

    for (let i = 0; i < len; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash + char) & 0xffffffff; // Keep as 32-bit
        }

    return Math.abs(hash);
    }

  /**
     * Safe localStorage access with comprehensive error handling
     */
    getSafeStorage(key) {
        try {
            if (typeof Storage === 'undefined') {
                console.warn('AB Testing: localStorage not available');
                return null;
            }

      const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.warn('AB Testing: Storage read failed', error);

      // Handle specific error types
            if (error.name === 'QuotaExceededError') {
                console.warn('AB Testing: Storage quota exceeded, clearing old data');
                this.clearExpiredExperiments();
            }

      return null;
        }
  }

  /**
     * Safe localStorage write with error handling
     */
  setSafeStorage(key, value) {
    try {
      if (typeof Storage === 'undefined') {
        console.warn('AB Testing: localStorage not available');
                return false;
            }

      localStorage.setItem(key, JSON.stringify(value));
            return true;
    } catch (error) {
      console.warn('AB Testing: Storage write failed', error);

      if (error.name === 'QuotaExceededError') {
                console.warn('AB Testing: Storage quota exceeded, attempting cleanup');
                this.clearExpiredExperiments();

        // Try again after cleanup
                try {
                    localStorage.setItem(key, JSON.stringify(value));
                    return true;
                } catch (retryError) {
                    console.error('AB Testing: Storage write failed even after cleanup', retryError);
                }
            }

      return false;
        }
    }

  /**
   * Clear expired experiments to free up storage space
   */
  clearExpiredExperiments() {
        try {
            const experiments = this.getSafeStorage(this.storageKey) || {};
            const now = Date.now();
            let cleaned = false;

      Object.keys(experiments).forEach(expId => {
                const exp = experiments[expId];
                if (exp.endDate && exp.endDate < now) {
                    delete experiments[expId];
                    cleaned = true;
                }
            });

      if (cleaned) {
                this.setSafeStorage(this.storageKey, experiments);
            }
        } catch (error) {
            console.warn('AB Testing: Failed to clear expired experiments', error);
        }
    }

  /**
     * Set up cross-tab synchronization for consistent state
     */
    setupCrossTabSync() {
        try {
            window.addEventListener('storage', (e) => {
                if (e.key === this.storageKey) {
                    console.log('AB Testing: Cross-tab sync triggered');
                    this.loadExperiments();
                    this.notifyListeners('crossTabSync', { key: e.key, newValue: e.newValue });
                }
            });
        } catch (error) {
            console.warn('AB Testing: Cross-tab sync setup failed', error);
        }
    }

  /**
     * Load experiments from storage
     */
    loadExperiments() {
    const stored = this.getSafeStorage(this.storageKey);
    if (stored && typeof stored === 'object') {
            Object.entries(stored).forEach(([expId, expData]) => {
                if (this.isValidExperiment(expData)) {
                    this.experiments.set(expId, expData);
                }
            });
        }
        this.initialized = true;
  }

  /**
     * Validate experiment data structure
     */
    isValidExperiment(exp) {
    return (
      exp &&
      typeof exp === 'object' &&
      exp.id &&
      exp.name &&
      Array.isArray(exp.variants) &&
      exp.variants.length >= 2 &&
      typeof exp.trafficAllocation === 'number' &&
      exp.trafficAllocation > 0 &&
      exp.trafficAllocation <= 100
  }

  /**
   * Create a new A/B test experiment
   */
  createExperiment(config) {
        const experiment = {
            id: config.id || `exp_${Date.now()}`,
            name: config.name,
            description: config.description || '',
            variants: config.variants || ['A', 'B'],
            trafficAllocation: config.trafficAllocation || 50, // Percentage for variant B
            startDate: config.startDate || new Date().toISOString(),
            endDate: config.endDate || null,
            status: config.status || 'active',
            goals: config.goals || [],
            metadata: config.metadata || {},
        };

    if (!this.isValidExperiment(experiment)) {
      throw new Error('Invalid experiment configuration');
    }

    this.experiments.set(experiment.id, experiment);
        this.saveExperiments();

    console.log(`AB Testing: Created experiment "${experiment.name}" (${experiment.id})`);
        return experiment;
    }

  /**
     * Get variant for user in experiment using stable hashing
     */
  getVariant(experimentId) {
    const experiment = this.experiments.get(experimentId);

    if (!experiment) {
            console.warn(`AB Testing: Experiment "${experimentId}" not found`);
            return null;
        }

    if (experiment.status !== 'active') {
            return experiment.variants[0]; // Default to first variant
        }

    // Check if user already has an assigned variant
        const userAssignment = this.getUserAssignment(experimentId);
        if (userAssignment) {
            return userAssignment.variant;
        }

    // Assign new variant using stable hashing
        const variant = this.selectVariant(experiment, this.userId);
        this.setUserAssignment(experimentId, variant);

    return variant;
    }

  /**
     * Stable variant selection using user ID hash
     */
    selectVariant(experiment, userId) {
        // Create stable hash from experiment ID and user ID
        const hashInput = `${experiment.id}_${userId}`;
        const hash = this.simpleHash(hashInput);

    // Normalize to 0-99 range
        const normalizedValue = hash % 100;

    // Return variant based on traffic allocation
        return normalizedValue < experiment.trafficAllocation
            ? experiment.variants[1] // Variant B
            : experiment.variants[0]; // Variant A
    }

  /**
     * Get user's assignment for an experiment
     */
    getUserAssignment(experimentId) {
        const assignments = this.getSafeStorage(`${this.storageKey}_assignments`) || {};
        return assignments[experimentId] || null;
    }

  /**
     * Set user's assignment for an experiment
     */
    setUserAssignment(experimentId, variant) {
        const assignments = this.getSafeStorage(`${this.storageKey}_assignments`) || {};
        assignments[experimentId] = {
            variant,
            assignedAt: new Date().toISOString(),
            userId: this.userId,
        };

    this.setSafeStorage(`${this.storageKey}_assignments`, assignments);
  }

  /**
     * Track conversion or goal completion
     */
    trackConversion(experimentId, goalName, metadata = {}) {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) {return;}

    const variant = this.getVariant(experimentId);
        const conversion = {
            experimentId,
            variant,
            goal: goalName,
            userId: this.userId,
            timestamp: new Date().toISOString(),
            metadata,
        };

    // Store conversion data (in production, send to analytics service)
        console.log('AB Testing: Conversion tracked', conversion);

    // Emit event for external tracking
    this.notifyListeners('conversion', conversion);
  }

  /**
     * Save experiments to storage
     */
    saveExperiments() {
        const experimentsObj = {};
        this.experiments.forEach((exp, id) => {
            experimentsObj[id] = exp;
        });

    this.setSafeStorage(this.storageKey, experimentsObj);
    }

  /**
   * End an experiment and determine winner
   */
  endExperiment(experimentId, winnerVariant = null) {
        const experiment = this.experiments.get(experimentId);
        if (!experiment) {return;}

    experiment.status = 'completed';
        experiment.endDate = new Date().toISOString();
        experiment.winner = winnerVariant;

    this.saveExperiments();

    console.log(`AB Testing: Ended experiment "${experiment.name}" with winner: ${winnerVariant}`);
    }

  /**
     * Get experiment results and statistics
     */
    getExperimentResults(experimentId) {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) {return null;}

    // In production, this would aggregate data from analytics service
    return {
      experiment,
            status: 'mock_results', // Placeholder for actual analytics integration
            variantA: { conversions: 0, visitors: 0 },
            variantB: { conversions: 0, visitors: 0 },
        };
    }

  /**
     * Event listener system for external integrations
     */
    listeners = new Map();

  on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

  off(event, callback) {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            const index = eventListeners.indexOf(callback);
            if (index > -1) {
                eventListeners.splice(index, 1);
            }
        }
  }

  notifyListeners(event, data) {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
      eventListeners.forEach(callback => {
        try {
                    callback(data);
                } catch (error) {
                    console.error('AB Testing: Listener callback failed', error);
                }
      });
    }
  }

  /**
     * Utility methods
     */
    getAllExperiments() {
        return Array.from(this.experiments.values());
    }

  getActiveExperiments() {
        return this.getAllExperiments().filter(exp => exp.status === 'active');
    }

  resetUserAssignments() {
        try {
            localStorage.removeItem(`${this.storageKey}_assignments`);
            console.log('AB Testing: User assignments reset');
        } catch (error) {
            console.warn('AB Testing: Failed to reset assignments', error);
        }
  }

  /**
     * Debug and monitoring methods
     */
    getDebugInfo() {
        return {
            userId: this.userId,
            experiments: this.getAllExperiments(),
            storageAvailable: typeof Storage !== 'undefined',
            initialized: this.initialized,
        };
    }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ABTestingManager;
}

// Global instance for easy access
window.ABTestingManager = ABTestingManager;
