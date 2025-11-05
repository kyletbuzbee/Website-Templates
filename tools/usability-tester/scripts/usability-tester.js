// Usability Testing Framework
// Handles template testing, feedback collection, and results analysis

class UsabilityTester {
  constructor() {
    this.templates = [];
    this.currentTemplate = null;
    this.testSession = null;
    this.feedbackData = [];
    this.selectedScenarios = [];
    this.init();
  }

  async init() {
    await this.loadTemplates();
    this.renderTemplates();
    this.bindEvents();
    this.loadExistingData();
  }

  async loadTemplates() {
    // Define all available templates
    const templateConfigs = [
      {
        id: 'starter',
        name: 'Starter',
        type: 'kit',
        path: '../../kits/starter/pages/home.html',
        demoPath: '../../kits/starter/assets/demo-content.json'
      },
      {
        id: 'business',
        name: 'Business',
        type: 'kit',
        path: '../../kits/business/pages/home.html',
        demoPath: '../../kits/business/assets/demo-content.json'
      },
      {
        id: 'creative',
        name: 'Creative',
        type: 'kit',
        path: '../../kits/creative/pages/home.html',
        demoPath: '../../kits/creative/assets/demo-content.json'
      },
      {
        id: 'premium-interactive',
        name: 'Premium Interactive',
        type: 'kit',
        path: '../../kits/premium-interactive/pages/home.html',
        demoPath: '../../kits/premium-interactive/assets/demo-content.json'
      },
      {
        id: 'contractors-trades',
        name: 'Contractors & Trades',
        type: 'industry',
        path: '../../industries/contractors-trades/pages/home.html',
        demoPath: '../../industries/contractors-trades/assets/demo-content.json'
      },
      {
        id: 'roofers-exterior',
        name: 'Roofers & Exterior',
        type: 'industry',
        path: '../../industries/roofers-exterior/pages/home.html',
        demoPath: '../../industries/roofers-exterior/assets/demo-content.json'
      }
    ];

    // Load demo content for each template
    for (const config of templateConfigs) {
      try {
        const demoResponse = await fetch(config.demoPath);
        if (demoResponse.ok) {
          const demoData = await demoResponse.json();
          this.templates.push({
            ...config,
            demoData
          });
        }
      } catch (error) {
        console.warn(`Failed to load demo data for ${config.name}:`, error);
        // Still add template without demo data
        this.templates.push(config);
      }
    }
  }

  renderTemplates() {
    const grid = document.getElementById('template-grid');

    this.templates.forEach(template => {
      const option = this.createTemplateOption(template);
      grid.appendChild(option);
    });
  }

  createTemplateOption(template) {
    const option = document.createElement('div');
    option.className = 'template-option';
    option.onclick = () => this.selectTemplate(template);

    option.innerHTML = `
      <div class="template-name">${template.name}</div>
      <div class="template-type">${template.type}</div>
    `;

    return option;
  }

  selectTemplate(template) {
    this.currentTemplate = template;

    // Update UI
    document.querySelectorAll('.template-option').forEach(opt => {
      opt.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
  }

  getSelectedScenarios() {
    const scenarios = [];
    document.querySelectorAll('.scenario-checkbox:checked').forEach(checkbox => {
      const label = document.querySelector(`label[for="${checkbox.id}"]`);
      if (label) {
        scenarios.push(label.textContent);
      }
    });
    return scenarios;
  }

  async startTest() {
    if (!this.currentTemplate) {
      alert('Please select a template first.');
      return;
    }

    this.selectedScenarios = this.getSelectedScenarios();
    if (this.selectedScenarios.length === 0) {
      alert('Please select at least one test scenario.');
      return;
    }

    // Create test session
    this.testSession = {
      template: this.currentTemplate,
      scenarios: this.selectedScenarios,
      startTime: new Date().toISOString(),
      participants: []
    };

    // Load template in iframe
    await this.loadTemplateInIframe();

    // Update UI
    document.getElementById('test-setup').classList.add('hidden');
    document.getElementById('test-iframe').classList.remove('hidden');
    document.getElementById('feedback-panel').classList.remove('hidden');

    // Update button
    const startBtn = document.querySelector('.btn-primary[onclick="startTest()"]');
    startBtn.innerHTML = '<span id="start-icon">⏸️</span> End Test Session';
    startBtn.onclick = () => this.endTest();
  }

  async loadTemplateInIframe() {
    const iframe = document.getElementById('test-iframe');

    try {
      // Load template HTML
      const templateResponse = await fetch(this.currentTemplate.path);
      if (!templateResponse.ok) throw new Error('Failed to load template');

      let html = await templateResponse.text();

      // Apply demo content if available
      if (this.currentTemplate.demoData) {
        html = this.applyDemoContent(html, this.currentTemplate.demoData);
      }

      // Set iframe content
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(html);
      iframeDoc.close();

    } catch (error) {
      console.error('Failed to load template:', error);
      alert('Failed to load template. Please try again.');
    }
  }

  applyDemoContent(html, demoData) {
    // Simple mustache-style template replacement
    Object.keys(demoData).forEach(section => {
      if (typeof demoData[section] === 'object' && demoData[section] !== null) {
        Object.keys(demoData[section]).forEach(key => {
          const value = demoData[section][key];
          if (typeof value === 'string') {
            const regex = new RegExp(`{{${section}\\.${key}}}`, 'g');
            html = html.replace(regex, this.escapeHtml(value));
          }
        });
      } else if (typeof demoData[section] === 'string') {
        const regex = new RegExp(`{{${section}}}`, 'g');
        html = html.replace(regex, this.escapeHtml(demoData[section]));
      }
    });

    return html;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  submitFeedback(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const rating = this.getSelectedRating();

    const feedback = {
      participant: formData.get('participant-name'),
      rating: rating,
      completion: formData.get('task-completion'),
      positive: formData.get('feedback-positive'),
      improvements: formData.get('feedback-improvements'),
      comments: formData.get('feedback-comments'),
      timestamp: new Date().toISOString(),
      template: this.currentTemplate.id,
      scenarios: this.selectedScenarios
    };

    // Add to feedback data
    this.feedbackData.push(feedback);

    // Save to localStorage
    this.saveFeedbackData();

    // Update results
    this.updateResults();

    // Show results section
    document.getElementById('test-results').classList.remove('hidden');

    // Reset form
    event.target.reset();
    this.resetRatingStars();

    alert('Thank you for your feedback! Results have been updated.');
  }

  getSelectedRating() {
    const activeStars = document.querySelectorAll('.star.active');
    return activeStars.length;
  }

  resetRatingStars() {
    document.querySelectorAll('.star').forEach(star => {
      star.classList.remove('active');
    });
  }

  endTest() {
    // Reset UI
    document.getElementById('test-setup').classList.remove('hidden');
    document.getElementById('test-iframe').classList.add('hidden');
    document.getElementById('feedback-panel').classList.add('hidden');

    // Reset button
    const startBtn = document.querySelector('.btn-primary[onclick*="endTest"]');
    startBtn.innerHTML = '<span id="start-icon">▶️</span> Start Test Session';
    startBtn.onclick = () => this.startTest();

    // Clear iframe
    const iframe = document.getElementById('test-iframe');
    iframe.src = 'about:blank';

    this.testSession = null;
  }

  resetTest() {
    if (confirm('Are you sure you want to reset all test data? This cannot be undone.')) {
      this.feedbackData = [];
      this.testSession = null;
      this.currentTemplate = null;

      // Clear localStorage
      localStorage.removeItem('usabilityTesterData');

      // Reset UI
      document.querySelectorAll('.template-option').forEach(opt => {
        opt.classList.remove('selected');
      });

      document.getElementById('test-setup').classList.remove('hidden');
      document.getElementById('test-iframe').classList.add('hidden');
      document.getElementById('feedback-panel').classList.add('hidden');
      document.getElementById('test-results').classList.add('hidden');

      // Reset button
      const startBtn = document.querySelector('.btn-primary');
      startBtn.innerHTML = '<span id="start-icon">▶️</span> Start Test Session';
      startBtn.onclick = () => this.startTest();

      // Reset stats
      this.updateResults();
    }
  }

  updateResults() {
    const totalParticipants = this.feedbackData.length;
    const avgRating = totalParticipants > 0
      ? (this.feedbackData.reduce((sum, item) => sum + item.rating, 0) / totalParticipants).toFixed(1)
      : '0.0';

    const completedTasks = this.feedbackData.filter(item => item.completion === 'completed').length;
    const completionRate = totalParticipants > 0
      ? Math.round((completedTasks / totalParticipants) * 100)
      : 0;

    // Update stats
    document.getElementById('total-participants').textContent = totalParticipants;
    document.getElementById('avg-rating').textContent = avgRating;
    document.getElementById('completion-rate').textContent = `${completionRate}%`;

    // Update feedback list
    this.renderFeedbackList();
  }

  renderFeedbackList() {
    const feedbackList = document.getElementById('feedback-list');
    feedbackList.innerHTML = '';

    // Sort by timestamp (newest first)
    const sortedFeedback = [...this.feedbackData].sort((a, b) =>
      new Date(b.timestamp) - new Date(a.timestamp)
    );

    sortedFeedback.forEach(feedback => {
      const feedbackItem = this.createFeedbackItem(feedback);
      feedbackList.appendChild(feedbackItem);
    });
  }

  createFeedbackItem(feedback) {
    const item = document.createElement('div');
    item.className = 'feedback-item';

    const ratingStars = '★'.repeat(feedback.rating) + '☆'.repeat(5 - feedback.rating);

    item.innerHTML = `
      <div class="feedback-header">
        <div class="feedback-user">${this.escapeHtml(feedback.participant)}</div>
        <div class="feedback-rating">${ratingStars}</div>
      </div>
      <div class="feedback-text">
        <strong>Template:</strong> ${this.escapeHtml(feedback.template)}<br>
        <strong>Task Completion:</strong> ${this.escapeHtml(feedback.completion)}<br>
        ${feedback.positive ? `<strong>Positive:</strong> ${this.escapeHtml(feedback.positive)}<br>` : ''}
        ${feedback.improvements ? `<strong>Improvements:</strong> ${this.escapeHtml(feedback.improvements)}<br>` : ''}
        ${feedback.comments ? `<strong>Comments:</strong> ${this.escapeHtml(feedback.comments)}` : ''}
      </div>
    `;

    return item;
  }

  exportResults() {
    const data = {
      testSession: this.testSession,
      feedbackData: this.feedbackData,
      exportDate: new Date().toISOString(),
      summary: {
        totalParticipants: this.feedbackData.length,
        averageRating: this.feedbackData.length > 0
          ? this.feedbackData.reduce((sum, item) => sum + item.rating, 0) / this.feedbackData.length
          : 0,
        completionRate: this.feedbackData.length > 0
          ? this.feedbackData.filter(item => item.completion === 'completed').length / this.feedbackData.length
          : 0
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `usability-test-results-${new Date().toISOString().split('T')[0]}.json`;
    a.click();

    URL.revokeObjectURL(url);
  }

  saveFeedbackData() {
    const data = {
      feedbackData: this.feedbackData,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('usabilityTesterData', JSON.stringify(data));
  }

  loadExistingData() {
    const savedData = localStorage.getItem('usabilityTesterData');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        this.feedbackData = data.feedbackData || [];
        this.updateResults();
        document.getElementById('test-results').classList.remove('hidden');
      } catch (error) {
        console.error('Failed to load saved data:', error);
      }
    }
  }

  bindEvents() {
    // Rating stars
    document.getElementById('rating-stars').addEventListener('click', (e) => {
      if (e.target.classList.contains('star')) {
        const rating = parseInt(e.target.dataset.rating);
        this.setRating(rating);
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'r':
            e.preventDefault();
            this.resetTest();
            break;
          case 'e':
            e.preventDefault();
            this.exportResults();
            break;
        }
      }
    });
  }

  setRating(rating) {
    document.querySelectorAll('.star').forEach((star, index) => {
      if (index < rating) {
        star.classList.add('active');
      } else {
        star.classList.remove('active');
      }
    });
  }
}

// Global functions for HTML onclick handlers
function startTest() {
  usabilityTester.startTest();
}

function submitFeedback(event) {
  usabilityTester.submitFeedback(event);
}

function resetTest() {
  usabilityTester.resetTest();
}

function exportResults() {
  usabilityTester.exportResults();
}

// Initialize
const usabilityTester = new UsabilityTester();
