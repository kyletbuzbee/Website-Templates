/**
 * Performance Monitoring and Analytics System
 * Tracks Core Web Vitals, user interactions, and template performance
 */

class AnalyticsManager {
  constructor() {
    this.metrics = {
      coreWebVitals: {},
      userInteractions: [],
      templatePerformance: {},
      pageViews: {},
      conversions: []
    };

    this.listeners = new Set();
    this.sessionId = this.generateSessionId();

    // Initialize tracking
    this.init();
  }

  /**
   * Initialize analytics tracking
   */
  init() {
    // Track Core Web Vitals
    this.trackCoreWebVitals();

    // Track user interactions
    this.trackUserInteractions();

    // Track page performance
    this.trackPagePerformance();

    // Track template-specific metrics
    this.trackTemplateMetrics();

    // Set up periodic reporting
    this.setupPeriodicReporting();
  }

  /**
   * Generate unique session ID
   */
  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Track Core Web Vitals
   */
  trackCoreWebVitals() {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];

          this.metrics.coreWebVitals.lcp = {
            value: lastEntry.startTime,
            rating: this.getCWVRating('lcp', lastEntry.startTime),
            timestamp: Date.now()
          };

          this.notifyListeners('coreWebVitals', this.metrics.coreWebVitals);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            this.metrics.coreWebVitals.fid = {
              value: entry.processingStart - entry.startTime,
              rating: this.getCWVRating('fid', entry.processingStart - entry.startTime),
              timestamp: Date.now()
            };
          });

          this.notifyListeners('coreWebVitals', this.metrics.coreWebVitals);
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });

          this.metrics.coreWebVitals.cls = {
            value: clsValue,
            rating: this.getCWVRating('cls', clsValue),
            timestamp: Date.now()
          };

          this.notifyListeners('coreWebVitals', this.metrics.coreWebVitals);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

      } catch (error) {
        console.warn('Core Web Vitals tracking not fully supported:', error);
      }
    }
  }

  /**
   * Get Core Web Vitals rating
   */
  getCWVRating(metric, value) {
    const thresholds = {
      lcp: { good: 2500, needsImprovement: 4000 },
      fid: { good: 100, needsImprovement: 300 },
      cls: { good: 0.1, needsImprovement: 0.25 }
    };

    const threshold = thresholds[metric];
    if (value <= threshold.good) return 'good';
    if (value <= threshold.needsImprovement) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Track user interactions
   */
  trackUserInteractions() {
    // Track clicks
    document.addEventListener('click', (event) => {
      const target = event.target;
      const interaction = {
        type: 'click',
        element: target.tagName.toLowerCase(),
        className: target.className,
        id: target.id,
        text: target.textContent?.substring(0, 50),
        timestamp: Date.now(),
        url: window.location.href,
        sessionId: this.sessionId
      };

      this.metrics.userInteractions.push(interaction);
      this.notifyListeners('userInteraction', interaction);
    });

    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target;
      const interaction = {
        type: 'form_submit',
        formId: form.id,
        formClass: form.className,
        inputs: Array.from(form.elements).map(el => ({
          name: el.name,
          type: el.type,
          value: el.type === 'password' ? '[REDACTED]' : el.value?.substring(0, 100)
        })),
        timestamp: Date.now(),
        url: window.location.href,
        sessionId: this.sessionId
      };

      this.metrics.userInteractions.push(interaction);
      this.notifyListeners('userInteraction', interaction);
    });

    // Track scroll depth
    let maxScrollDepth = 0;
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;

        const interaction = {
          type: 'scroll_depth',
          depth: Math.round(scrollPercent),
          maxDepth: Math.round(maxScrollDepth),
          timestamp: Date.now(),
          url: window.location.href,
          sessionId: this.sessionId
        };

        this.notifyListeners('scrollDepth', interaction);
      }
    });

    // Track time on page
    const pageStartTime = Date.now();
    window.addEventListener('beforeunload', () => {
      const timeOnPage = Date.now() - pageStartTime;

      const interaction = {
        type: 'time_on_page',
        duration: timeOnPage,
        timestamp: Date.now(),
        url: window.location.href,
        sessionId: this.sessionId
      };

      this.metrics.userInteractions.push(interaction);
      this.notifyListeners('timeOnPage', interaction);
    });
  }

  /**
   * Track page performance
   */
  trackPagePerformance() {
    // Track navigation timing
    window.addEventListener('load', () => {
      setTimeout(() => {
        if ('performance' in window && 'timing' in window.performance) {
          const timing = window.performance.timing;
          const navigation = window.performance.navigation;

          const pagePerformance = {
            url: window.location.href,
            sessionId: this.sessionId,
            timestamp: Date.now(),
            navigation: {
              type: navigation.type,
              redirectCount: navigation.redirectCount
            },
            timing: {
              dnsLookup: timing.domainLookupEnd - timing.domainLookupStart,
              tcpConnect: timing.connectEnd - timing.connectStart,
              serverResponse: timing.responseStart - timing.requestStart,
              pageLoad: timing.loadEventEnd - timing.navigationStart,
              domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
              firstPaint: this.getFirstPaintTime(),
              firstContentfulPaint: this.getFirstContentfulPaintTime()
            }
          };

          this.metrics.templatePerformance[window.location.pathname] = pagePerformance;
          this.notifyListeners('pagePerformance', pagePerformance);
        }
      }, 0);
    });
  }

  /**
   * Get First Paint time
   */
  getFirstPaintTime() {
    if ('performance' in window) {
      const paintEntries = performance.getEntriesByType('paint');
      const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
      return firstPaint ? firstPaint.startTime : null;
    }
    return null;
  }

  /**
   * Get First Contentful Paint time
   */
  getFirstContentfulPaintTime() {
    if ('performance' in window) {
      const paintEntries = performance.getEntriesByType('paint');
      const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      return firstContentfulPaint ? firstContentfulPaint.startTime : null;
    }
    return null;
  }

  /**
   * Track template-specific metrics
   */
  trackTemplateMetrics() {
    // Track template loads
    const templatePath = window.location.pathname;
    if (!this.metrics.pageViews[templatePath]) {
      this.metrics.pageViews[templatePath] = {
        count: 0,
        uniqueVisitors: new Set(),
        averageLoadTime: 0,
        bounceRate: 0
      };
    }

    this.metrics.pageViews[templatePath].count++;
    this.metrics.pageViews[templatePath].uniqueVisitors.add(this.sessionId);

    // Track template conversions (purchases, signups, etc.)
    this.trackTemplateConversions();
  }

  /**
   * Track template conversions
   */
  trackTemplateConversions() {
    // Track purchase conversions
    const purchaseButtons = document.querySelectorAll('[data-action="purchase"], .purchase-btn, .buy-now');
    purchaseButtons.forEach(button => {
      button.addEventListener('click', () => {
        const conversion = {
          type: 'purchase_initiated',
          template: window.location.pathname,
          value: button.dataset.price || null,
          timestamp: Date.now(),
          sessionId: this.sessionId
        };

        this.metrics.conversions.push(conversion);
        this.notifyListeners('conversion', conversion);
      });
    });

    // Track demo requests
    const demoButtons = document.querySelectorAll('[data-action="demo"], .demo-btn, .try-demo');
    demoButtons.forEach(button => {
      button.addEventListener('click', () => {
        const conversion = {
          type: 'demo_requested',
          template: window.location.pathname,
          timestamp: Date.now(),
          sessionId: this.sessionId
        };

        this.metrics.conversions.push(conversion);
        this.notifyListeners('conversion', conversion);
      });
    });
  }

  /**
   * Set up periodic reporting
   */
  setupPeriodicReporting() {
    // Send analytics data every 30 seconds
    setInterval(() => {
      this.sendAnalyticsData();
    }, 30000);

    // Send data on page unload
    window.addEventListener('beforeunload', () => {
      this.sendAnalyticsData(true);
    });
  }

  /**
   * Send analytics data to server
   */
  async sendAnalyticsData(immediate = false) {
    if (Object.keys(this.metrics.coreWebVitals).length === 0 &&
        this.metrics.userInteractions.length === 0 &&
        !immediate) {
      return; // Don't send empty data
    }

    try {
      const payload = {
        sessionId: this.sessionId,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        metrics: this.metrics
      };

      // Send to analytics endpoint
      const response = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        // Clear sent data to avoid duplicates
        if (!immediate) {
          this.metrics.userInteractions = [];
        }
      }
    } catch (error) {
      console.warn('Failed to send analytics data:', error);
      // Store locally for retry
      this.storeAnalyticsLocally(this.metrics);
    }
  }

  /**
   * Store analytics data locally for retry
   */
  storeAnalyticsLocally(data) {
    try {
      const stored = localStorage.getItem('analytics_queue') || '[]';
      const queue = JSON.parse(stored);
      queue.push({
        data,
        timestamp: Date.now(),
        retryCount: 0
      });

      // Keep only last 10 entries
      if (queue.length > 10) {
        queue.shift();
      }

      localStorage.setItem('analytics_queue', JSON.stringify(queue));
    } catch (error) {
      console.warn('Failed to store analytics locally:', error);
    }
  }

  /**
   * Get analytics dashboard data
   */
  getAnalyticsDashboard() {
    return {
      coreWebVitals: this.metrics.coreWebVitals,
      pageViews: Object.entries(this.metrics.pageViews).map(([path, data]) => ({
        path,
        ...data,
        uniqueVisitors: data.uniqueVisitors.size
      })),
      conversions: this.metrics.conversions,
      templatePerformance: this.metrics.templatePerformance,
      summary: {
        totalPageViews: Object.values(this.metrics.pageViews).reduce((sum, page) => sum + page.count, 0),
        totalConversions: this.metrics.conversions.length,
        averageLoadTime: this.calculateAverageLoadTime(),
        topPages: this.getTopPages()
      }
    };
  }

  /**
   * Calculate average load time
   */
  calculateAverageLoadTime() {
    const performances = Object.values(this.metrics.templatePerformance);
    if (performances.length === 0) return 0;

    const totalLoadTime = performances.reduce((sum, perf) => sum + perf.timing.pageLoad, 0);
    return totalLoadTime / performances.length;
  }

  /**
   * Get top performing pages
   */
  getTopPages() {
    return Object.entries(this.metrics.pageViews)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 5)
      .map(([path, data]) => ({
        path,
        views: data.count,
        uniqueVisitors: data.uniqueVisitors.size
      }));
  }

  /**
   * Export analytics data
   */
  exportAnalyticsData() {
    const data = {
      exportDate: new Date().toISOString(),
      sessionId: this.sessionId,
      metrics: this.metrics,
      dashboard: this.getAnalyticsDashboard()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Subscribe to analytics events
   */
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify listeners of analytics events
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
        console.error('Error notifying analytics listener:', error);
      }
    });
  }

  /**
   * Get current analytics state
   */
  getState() {
    return {
      metrics: this.metrics,
      dashboard: this.getAnalyticsDashboard(),
      sessionId: this.sessionId
    };
  }
}

// Create singleton instance
const analyticsManager = new AnalyticsManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = analyticsManager;
}

export default analyticsManager;
