/**
 * A/B Testing UI Components
 * Provides interface for managing experiments and viewing results
 */

class ABTestingUI {
  constructor(abTestingManager) {
    this.abTestingManager = abTestingManager;
    this.currentView = 'dashboard';
    this.selectedExperiment = null;
    this.listeners = new Set();

    // Initialize UI
    this.init();
  }

  /**
   * Initialize the UI
   */
  init() {
    // Subscribe to A/B testing events
    this.abTestingManager.subscribe((event) => {
      this.handleABTestingEvent(event);
    });

    // Create main UI container
    this.createUIContainer();

    // Set up event listeners
    this.setupEventListeners();
  }

  /**
   * Create main UI container
   */
  createUIContainer() {
    // Create overlay container
    this.overlay = document.createElement('div');
    this.overlay.id = 'ab-testing-overlay';
    this.overlay.className = 'ab-testing-overlay hidden';
    this.overlay.innerHTML = `
      <div class="ab-testing-panel">
        <div class="ab-testing-header">
          <h2>A/B Testing Dashboard</h2>
          <div class="ab-testing-controls">
            <button class="ab-testing-btn" id="ab-testing-close">×</button>
          </div>
        </div>
        <div class="ab-testing-nav">
          <button class="ab-testing-nav-btn active" data-view="dashboard">Dashboard</button>
          <button class="ab-testing-nav-btn" data-view="experiments">Experiments</button>
          <button class="ab-testing-nav-btn" data-view="create">Create Experiment</button>
        </div>
        <div class="ab-testing-content">
          <div id="ab-testing-dashboard" class="ab-testing-view active"></div>
          <div id="ab-testing-experiments" class="ab-testing-view"></div>
          <div id="ab-testing-create" class="ab-testing-view"></div>
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
      .ab-testing-overlay {
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
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .ab-testing-overlay.hidden {
        display: none;
      }

      .ab-testing-panel {
        background: white;
        border-radius: 8px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        max-width: 900px;
        width: 90%;
        max-height: 80vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }

      .ab-testing-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #e1e5e9;
        background: #f8f9fa;
      }

      .ab-testing-header h2 {
        margin: 0;
        color: #1a202c;
        font-size: 24px;
        font-weight: 600;
      }

      .ab-testing-controls {
        display: flex;
        gap: 10px;
      }

      .ab-testing-btn {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #718096;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: all 0.2s;
      }

      .ab-testing-btn:hover {
        background: #e2e8f0;
        color: #2d3748;
      }

      .ab-testing-nav {
        display: flex;
        border-bottom: 1px solid #e1e5e9;
        background: #f8f9fa;
      }

      .ab-testing-nav-btn {
        flex: 1;
        padding: 12px 20px;
        border: none;
        background: none;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        color: #718096;
        border-bottom: 2px solid transparent;
        transition: all 0.2s;
      }

      .ab-testing-nav-btn.active {
        color: #3182ce;
        border-bottom-color: #3182ce;
        background: white;
      }

      .ab-testing-nav-btn:hover {
        color: #2c5282;
        background: #edf2f7;
      }

      .ab-testing-content {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
      }

      .ab-testing-view {
        display: none;
      }

      .ab-testing-view.active {
        display: block;
      }

      .ab-testing-dashboard {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
      }

      .ab-testing-stat-card {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 20px;
        border: 1px solid #e1e5e9;
      }

      .ab-testing-stat-card h3 {
        margin: 0 0 10px 0;
        font-size: 14px;
        color: #718096;
        text-transform: uppercase;
        font-weight: 600;
        letter-spacing: 0.5px;
      }

      .ab-testing-stat-card .value {
        font-size: 32px;
        font-weight: 700;
        color: #1a202c;
        margin: 0;
      }

      .ab-testing-experiment-list {
        display: grid;
        gap: 15px;
      }

      .ab-testing-experiment-card {
        border: 1px solid #e1e5e9;
        border-radius: 8px;
        padding: 20px;
        background: white;
        transition: all 0.2s;
      }

      .ab-testing-experiment-card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        border-color: #cbd5e0;
      }

      .ab-testing-experiment-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 15px;
      }

      .ab-testing-experiment-title {
        font-size: 18px;
        font-weight: 600;
        color: #1a202c;
        margin: 0;
      }

      .ab-testing-experiment-status {
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
      }

      .ab-testing-status-draft { background: #fed7d7; color: #c53030; }
      .ab-testing-status-active { background: #c6f6d5; color: #276749; }
      .ab-testing-status-paused { background: #fef5e7; color: #d69e2e; }
      .ab-testing-status-completed { background: #bee3f8; color: #2c5282; }

      .ab-testing-experiment-meta {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        margin-bottom: 15px;
        font-size: 14px;
        color: #718096;
      }

      .ab-testing-experiment-results {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        margin-bottom: 15px;
      }

      .ab-testing-variant-result {
        text-align: center;
        padding: 10px;
        background: #f8f9fa;
        border-radius: 6px;
      }

      .ab-testing-variant-name {
        font-weight: 600;
        color: #1a202c;
        margin-bottom: 5px;
      }

      .ab-testing-variant-metric {
        font-size: 18px;
        font-weight: 700;
        color: #3182ce;
        margin: 0;
      }

      .ab-testing-experiment-actions {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
      }

      .ab-testing-action-btn {
        padding: 8px 16px;
        border: 1px solid #e1e5e9;
        border-radius: 6px;
        background: white;
        color: #4a5568;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .ab-testing-action-btn:hover {
        background: #f8f9fa;
        border-color: #cbd5e0;
      }

      .ab-testing-action-btn.primary {
        background: #3182ce;
        color: white;
        border-color: #3182ce;
      }

      .ab-testing-action-btn.primary:hover {
        background: #2c5282;
        border-color: #2c5282;
      }

      .ab-testing-form {
        max-width: 600px;
      }

      .ab-testing-form-group {
        margin-bottom: 20px;
      }

      .ab-testing-form-group label {
        display: block;
        margin-bottom: 5px;
        font-weight: 600;
        color: #2d3748;
      }

      .ab-testing-form-group input,
      .ab-testing-form-group select,
      .ab-testing-form-group textarea {
        width: 100%;
        padding: 10px;
        border: 1px solid #e1e5e9;
        border-radius: 6px;
        font-size: 14px;
        transition: border-color 0.2s;
      }

      .ab-testing-form-group input:focus,
      .ab-testing-form-group select:focus,
      .ab-testing-form-group textarea:focus {
        outline: none;
        border-color: #3182ce;
        box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
      }

      .ab-testing-form-group textarea {
        min-height: 80px;
        resize: vertical;
      }

      .ab-testing-variant-config {
        border: 1px solid #e1e5e9;
        border-radius: 6px;
        padding: 15px;
        margin-bottom: 15px;
        background: #f8f9fa;
      }

      .ab-testing-variant-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }

      .ab-testing-variant-title {
        font-weight: 600;
        color: #2d3748;
        margin: 0;
      }

      .ab-testing-variant-remove {
        background: none;
        border: none;
        color: #e53e3e;
        cursor: pointer;
        font-size: 18px;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: background 0.2s;
      }

      .ab-testing-variant-remove:hover {
        background: #fed7d7;
      }

      .ab-testing-add-variant {
        width: 100%;
        padding: 12px;
        border: 2px dashed #cbd5e0;
        border-radius: 6px;
        background: none;
        color: #718096;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .ab-testing-add-variant:hover {
        border-color: #3182ce;
        color: #3182ce;
        background: #ebf8ff;
      }

      .ab-testing-confidence-indicator {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-size: 12px;
        font-weight: 600;
        padding: 2px 8px;
        border-radius: 10px;
        text-transform: uppercase;
      }

      .ab-testing-confidence-high { background: #c6f6d5; color: #276749; }
      .ab-testing-confidence-medium { background: #fef5e7; color: #d69e2e; }
      .ab-testing-confidence-low { background: #fed7d7; color: #c53030; }

      .ab-testing-winner-badge {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        background: #3182ce;
        color: white;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
      }

      @media (max-width: 768px) {
        .ab-testing-panel {
          width: 95%;
          max-height: 90vh;
        }

        .ab-testing-dashboard {
          grid-template-columns: 1fr;
        }

        .ab-testing-experiment-meta {
          grid-template-columns: 1fr;
        }

        .ab-testing-experiment-results {
          grid-template-columns: 1fr;
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
    this.overlay.querySelector('#ab-testing-close').addEventListener('click', () => {
      this.hide();
    });

    // Navigation
    this.overlay.querySelectorAll('.ab-testing-nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.switchView(e.target.dataset.view);
      });
    });

    // Click outside to close
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.hide();
      }
    });
  }

  /**
   * Show the A/B testing UI
   */
  show(view = 'dashboard') {
    this.currentView = view;
    this.overlay.classList.remove('hidden');
    this.switchView(view);
    this.refreshData();
  }

  /**
   * Hide the A/B testing UI
   */
  hide() {
    this.overlay.classList.add('hidden');
  }

  /**
   * Switch between views
   */
  switchView(view) {
    this.currentView = view;

    // Update navigation
    this.overlay.querySelectorAll('.ab-testing-nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === view);
    });

    // Update content
    this.overlay.querySelectorAll('.ab-testing-view').forEach(content => {
      content.classList.toggle('active', content.id === `ab-testing-${view}`);
    });

    // Load view content
    switch (view) {
      case 'dashboard':
        this.renderDashboard();
        break;
      case 'experiments':
        this.renderExperiments();
        break;
      case 'create':
        this.renderCreateForm();
        break;
    }
  }

  /**
   * Render dashboard view
   */
  renderDashboard() {
    const dashboard = this.overlay.querySelector('#ab-testing-dashboard');
    const data = this.abTestingManager.getDashboardData();

    dashboard.innerHTML = `
      <div class="ab-testing-dashboard">
        <div class="ab-testing-stat-card">
          <h3>Total Experiments</h3>
          <p class="value">${data.totalExperiments}</p>
        </div>
        <div class="ab-testing-stat-card">
          <h3>Active Experiments</h3>
          <p class="value">${data.activeExperiments}</p>
        </div>
        <div class="ab-testing-stat-card">
          <h3>Completed Experiments</h3>
          <p class="value">${data.completedExperiments}</p>
        </div>
        <div class="ab-testing-stat-card">
          <h3>Conversion Rate</h3>
          <p class="value">${this.calculateOverallConversionRate(data.experiments)}%</p>
        </div>
      </div>

      <h3 style="margin-bottom: 15px; color: #1a202c;">Recent Experiments</h3>
      <div class="ab-testing-experiment-list">
        ${data.experiments.slice(0, 5).map(exp => this.renderExperimentCard(exp)).join('')}
      </div>
    `;
  }

  /**
   * Render experiments view
   */
  renderExperiments() {
    const experiments = this.overlay.querySelector('#ab-testing-experiments');
    const data = this.abTestingManager.getDashboardData();

    experiments.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h3 style="margin: 0; color: #1a202c;">All Experiments</h3>
        <button class="ab-testing-action-btn primary" id="create-experiment-btn">
          + Create Experiment
        </button>
      </div>

      <div class="ab-testing-experiment-list">
        ${data.experiments.length > 0 ?
          data.experiments.map(exp => this.renderExperimentCard(exp, true)).join('') :
          '<p style="text-align: center; color: #718096; padding: 40px;">No experiments created yet. Click "Create Experiment" to get started.</p>'
        }
      </div>
    `;

    // Add event listeners
    const createBtn = experiments.querySelector('#create-experiment-btn');
    if (createBtn) {
      createBtn.addEventListener('click', () => {
        this.switchView('create');
      });
    }
  }

  /**
   * Render experiment card
   */
  renderExperimentCard(experiment, showActions = false) {
    const statusClass = `ab-testing-status-${experiment.status}`;
    const results = experiment.results;

    return `
      <div class="ab-testing-experiment-card" data-experiment-id="${experiment.id}">
        <div class="ab-testing-experiment-header">
          <h4 class="ab-testing-experiment-title">${experiment.name}</h4>
          <span class="ab-testing-experiment-status ${statusClass}">${experiment.status}</span>
        </div>

        <div class="ab-testing-experiment-meta">
          <div>
            <strong>Traffic Split:</strong> ${experiment.trafficAllocation}% B / ${100 - experiment.trafficAllocation}% A
          </div>
          <div>
            <strong>Goals:</strong> ${experiment.goals.join(', ')}
          </div>
        </div>

        ${experiment.status !== 'draft' ? `
          <div class="ab-testing-experiment-results">
            <div class="ab-testing-variant-result">
              <div class="ab-testing-variant-name">Variant A</div>
              <div class="ab-testing-variant-metric">${results.variantA.visitors} visitors</div>
              <div class="ab-testing-variant-metric">${results.variantA.conversionRate.toFixed(1)}% conversion</div>
            </div>
            <div class="ab-testing-variant-result">
              <div class="ab-testing-variant-name">Variant B</div>
              <div class="ab-testing-variant-metric">${results.variantB.visitors} visitors</div>
              <div class="ab-testing-variant-metric">${results.variantB.conversionRate.toFixed(1)}% conversion</div>
            </div>
          </div>

          ${results.statisticalSignificance ? `
            <div style="margin-bottom: 15px; text-align: center;">
              ${results.winner ? `
                <span class="ab-testing-winner-badge">
                  Winner: ${results.winner === experiment.variants[0].id ? 'Variant A' : 'Variant B'}
                </span>
              ` : ''}
              <span class="ab-testing-confidence-indicator ab-testing-confidence-${this.getConfidenceLevel(results.confidence)}">
                ${results.confidence.toFixed(1)}% confidence
              </span>
            </div>
          ` : results.variantA.visitors >= 30 && results.variantB.visitors >= 30 ? `
            <div style="margin-bottom: 15px; text-align: center; color: #718096; font-size: 14px;">
              Not enough data for statistical significance
            </div>
          ` : ''}
        ` : ''}

        ${showActions ? `
          <div class="ab-testing-experiment-actions">
            ${experiment.status === 'draft' ? `
              <button class="ab-testing-action-btn primary" onclick="abTestingUI.startExperiment('${experiment.id}')">
                Start
              </button>
            ` : experiment.status === 'active' ? `
              <button class="ab-testing-action-btn" onclick="abTestingUI.pauseExperiment('${experiment.id}')">
                Pause
              </button>
              <button class="ab-testing-action-btn primary" onclick="abTestingUI.completeExperiment('${experiment.id}')">
                Complete
              </button>
            ` : experiment.status === 'paused' ? `
              <button class="ab-testing-action-btn primary" onclick="abTestingUI.startExperiment('${experiment.id}')">
                Resume
              </button>
            ` : `
              <button class="ab-testing-action-btn" onclick="abTestingUI.exportExperiment('${experiment.id}')">
                Export
              </button>
            `}
          </div>
        ` : ''}
      </div>
    `;
  }

  /**
   * Render create experiment form
   */
  renderCreateForm() {
    const create = this.overlay.querySelector('#ab-testing-create');

    create.innerHTML = `
      <h3 style="margin-bottom: 20px; color: #1a202c;">Create New Experiment</h3>

      <form class="ab-testing-form" id="create-experiment-form">
        <div class="ab-testing-form-group">
          <label for="experiment-name">Experiment Name *</label>
          <input type="text" id="experiment-name" required placeholder="e.g., Hero Button Color Test">
        </div>

        <div class="ab-testing-form-group">
          <label for="experiment-description">Description</label>
          <textarea id="experiment-description" placeholder="Describe what you're testing..."></textarea>
        </div>

        <div class="ab-testing-form-group">
          <label for="traffic-allocation">Traffic Allocation to Variant B (%)</label>
          <input type="number" id="traffic-allocation" value="50" min="1" max="99">
        </div>

        <div class="ab-testing-form-group">
          <label for="target-pages">Target Pages (one per line, leave empty for all pages)</label>
          <textarea id="target-pages" placeholder="e.g., /home&#10;/about&#10;/products/*"></textarea>
        </div>

        <div class="ab-testing-form-group">
          <label for="experiment-goals">Conversion Goals * (comma-separated)</label>
          <input type="text" id="experiment-goals" required placeholder="e.g., purchase_initiated, demo_requested">
        </div>

        <div id="variants-container">
          <h4 style="margin-bottom: 15px; color: #2d3748;">Variants</h4>

          <div class="ab-testing-variant-config">
            <div class="ab-testing-variant-header">
              <h5 class="ab-testing-variant-title">Variant A (Control)</h5>
            </div>
            <div class="ab-testing-form-group">
              <label>Name</label>
              <input type="text" class="variant-name" value="Control" required>
            </div>
            <div class="ab-testing-form-group">
              <label>Description</label>
              <textarea class="variant-description" placeholder="Describe the control variant..."></textarea>
            </div>
          </div>

          <div class="ab-testing-variant-config">
            <div class="ab-testing-variant-header">
              <h5 class="ab-testing-variant-title">Variant B (Test)</h5>
            </div>
            <div class="ab-testing-form-group">
              <label>Name</label>
              <input type="text" class="variant-name" value="Test Variant" required>
            </div>
            <div class="ab-testing-form-group">
              <label>Description</label>
              <textarea class="variant-description" placeholder="Describe the test variant..."></textarea>
            </div>
          </div>
        </div>

        <button type="button" class="ab-testing-add-variant" id="add-variant-btn">
          + Add Another Variant
        </button>

        <div style="margin-top: 30px; display: flex; gap: 10px; justify-content: flex-end;">
          <button type="button" class="ab-testing-action-btn" onclick="abTestingUI.switchView('experiments')">
            Cancel
          </button>
          <button type="submit" class="ab-testing-action-btn primary">
            Create Experiment
          </button>
        </div>
      </form>
    `;

    this.setupCreateFormListeners();
  }

  /**
   * Set up create form event listeners
   */
  setupCreateFormListeners() {
    const form = this.overlay.querySelector('#create-experiment-form');
    const addVariantBtn = this.overlay.querySelector('#add-variant-btn');

    // Add variant button
    addVariantBtn.addEventListener('click', () => {
      this.addVariantField();
    });

    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.createExperiment();
    });
  }

  /**
   * Add variant field to form
   */
  addVariantField() {
    const container = this.overlay.querySelector('#variants-container');
    const variantCount = container.querySelectorAll('.ab-testing-variant-config').length + 1;

    const variantHTML = `
      <div class="ab-testing-variant-config">
        <div class="ab-testing-variant-header">
          <h5 class="ab-testing-variant-title">Variant ${String.fromCharCode(65 + variantCount - 1)}</h5>
          <button type="button" class="ab-testing-variant-remove" onclick="this.closest('.ab-testing-variant-config').remove()">×</button>
        </div>
        <div class="ab-testing-form-group">
          <label>Name</label>
          <input type="text" class="variant-name" required>
        </div>
        <div class="ab-testing-form-group">
          <label>Description</label>
          <textarea class="variant-description"></textarea>
        </div>
      </div>
    `;

    // Insert before the add button
    const addBtn = container.querySelector('#add-variant-btn');
    addBtn.insertAdjacentHTML('beforebegin', variantHTML);
  }

  /**
   * Create experiment from form data
   */
  createExperiment() {
    const form = this.overlay.querySelector('#create-experiment-form');
    const formData = new FormData(form);

    const variants = [];
    const variantElements = form.querySelectorAll('.ab-testing-variant-config');

    variantElements.forEach((variantEl, index) => {
      const name = variantEl.querySelector('.variant-name').value;
      const description = variantEl.querySelector('.variant-description').value;

      variants.push({
        id: `variant_${index}`,
        name: name || `Variant ${String.fromCharCode(65 + index)}`,
        description
      });
    });

    const targetPages = form.querySelector('#target-pages').value
      .split('\n')
      .map(page => page.trim())
      .filter(page => page.length > 0);

    const goals = form.querySelector('#experiment-goals').value
      .split(',')
      .map(goal => goal.trim())
      .filter(goal => goal.length > 0);

    const experimentConfig = {
      name: form.querySelector('#experiment-name').value,
      description: form.querySelector('#experiment-description').value,
      trafficAllocation: parseInt(form.querySelector('#traffic-allocation').value),
      targetPages,
      goals,
      variants
    };

    try {
      const experiment = this.abTestingManager.createExperiment(experimentConfig);
      this.showNotification('Experiment created successfully!', 'success');
      this.switchView('experiments');
    } catch (error) {
      this.showNotification(error.message, 'error');
    }
  }

  /**
   * Handle A/B testing events
   */
  handleABTestingEvent(event) {
    // Refresh data when experiments change
    if (['experimentCreated', 'experimentStarted', 'experimentPaused', 'experimentCompleted'].includes(event.type)) {
      if (!this.overlay.classList.contains('hidden')) {
        this.refreshData();
      }
    }
  }

  /**
   * Refresh current view data
   */
  refreshData() {
    switch (this.currentView) {
      case 'dashboard':
        this.renderDashboard();
        break;
      case 'experiments':
        this.renderExperiments();
        break;
    }
  }

  /**
   * Calculate overall conversion rate
   */
  calculateOverallConversionRate(experiments) {
    const completedExperiments = experiments.filter(exp => exp.status === 'completed');
    if (completedExperiments.length === 0) return 0;

    const totalConversions = completedExperiments.reduce((sum, exp) => {
      return sum + exp.results.variantA.conversions + exp.results.variantB.conversions;
    }, 0);

    const totalVisitors = completedExperiments.reduce((sum, exp) => {
      return sum + exp.results.variantA.visitors + exp.results.variantB.visitors;
    }, 0);

    return totalVisitors > 0 ? ((totalConversions / totalVisitors) * 100).toFixed(1) : 0;
  }

  /**
   * Get confidence level class
   */
  getConfidenceLevel(confidence) {
    if (confidence >= 95) return 'high';
    if (confidence >= 90) return 'medium';
    return 'low';
  }

  /**
   * Show notification
   */
  showNotification(message, type = 'info') {
    // Simple notification - could be enhanced with a proper notification system
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

  // Public methods for external access
  startExperiment(id) {
    try {
      this.abTestingManager.startExperiment(id);
      this.showNotification('Experiment started successfully!', 'success');
    } catch (error) {
      this.showNotification(error.message, 'error');
    }
  }

  pauseExperiment(id) {
    try {
      this.abTestingManager.pauseExperiment(id);
      this.showNotification('Experiment paused successfully!', 'success');
    } catch (error) {
      this.showNotification(error.message, 'error');
    }
  }

  completeExperiment(id) {
    try {
      this.abTestingManager.completeExperiment(id);
      this.showNotification('Experiment completed successfully!', 'success');
    } catch (error) {
      this.showNotification(error.message, 'error');
    }
  }

  exportExperiment(id) {
    this.abTestingManager.exportExperimentData(id);
    this.showNotification('Experiment data exported!', 'success');
  }
}

// Export for global access
window.ABTestingUI = ABTestingUI;
