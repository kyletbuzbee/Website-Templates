/**
 * Template Marketplace Store
 * Manages template catalog, search, filtering, and purchase functionality
 */

class TemplateStore {
  constructor() {
    this.templates = [];
    this.categories = [];
    this.filters = {
      category: 'all',
      price: 'all',
      search: '',
      sort: 'popular'
    };
    this.cart = new Set();
    this.listeners = new Set();

    // Initialize store
    this.init();
  }

  /**
   * Initialize the template store
   */
  async init() {
    await this.loadTemplates();
    await this.loadCategories();
    this.notifyListeners();
  }

  /**
   * Load templates from API or local data
   */
  async loadTemplates() {
    try {
      // In production, this would fetch from API
      // For now, we'll scan the local template directories
      const templates = await this.scanLocalTemplates();
      this.templates = templates;
    } catch (error) {
      console.error('Error loading templates:', error);
      this.templates = [];
    }
  }

  /**
   * Scan local template directories to build catalog
   */
  async scanLocalTemplates() {
    const templates = [];

    // Scan industry templates
    const industries = ['restaurants', 'legal', 'fitness', 'real-estate', 'contractors-trades', 'healthcare', 'roofers-exterior'];

    for (const industry of industries) {
      try {
        const demoContentPath = `industries/${industry}/assets/demo-content.json`;
        const response = await fetch(demoContentPath);

        if (response.ok) {
          const demoContent = await response.json();

          templates.push({
            id: `industry-${industry}`,
            type: 'industry',
            category: industry,
            name: demoContent.company?.name || `${industry.charAt(0).toUpperCase() + industry.slice(1)} Template`,
            description: demoContent.company?.description || `Professional template for ${industry} businesses`,
            price: this.getTemplatePrice(industry),
            currency: 'USD',
            image: demoContent.hero?.image || '/assets/images/template-placeholder.jpg',
            demoUrl: `/industries/${industry}/pages/home.html`,
            features: this.getTemplateFeatures(industry),
            tags: [industry, 'responsive', 'cms-ready'],
            rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
            reviews: Math.floor(Math.random() * 50) + 10,
            downloads: Math.floor(Math.random() * 1000) + 100,
            lastUpdated: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
            cmsCompatible: ['wordpress', 'contentful', 'strapi', 'webflow'],
            isPopular: Math.random() > 0.7,
            isNew: Math.random() > 0.8
          });
        }
      } catch (error) {
        console.warn(`Could not load template for ${industry}:`, error);
      }
    }

    // Scan kit templates
    const kits = ['starter', 'business', 'creative', 'premium-interactive', 'minimal'];

    for (const kit of kits) {
      try {
        const demoContentPath = `kits/${kit}/assets/demo-content.json`;
        const response = await fetch(demoContentPath);

        if (response.ok) {
          const demoContent = await response.json();

          templates.push({
            id: `kit-${kit}`,
            type: 'kit',
            category: kit,
            name: demoContent.company?.name || `${kit.charAt(0).toUpperCase() + kit.slice(1)} Kit`,
            description: demoContent.company?.description || `Complete ${kit} website kit`,
            price: this.getKitPrice(kit),
            currency: 'USD',
            image: demoContent.hero?.image || '/assets/images/kit-placeholder.jpg',
            demoUrl: `/kits/${kit}/pages/home.html`,
            features: this.getKitFeatures(kit),
            tags: [kit, 'kit', 'complete'],
            rating: 4.3 + Math.random() * 0.7,
            reviews: Math.floor(Math.random() * 30) + 5,
            downloads: Math.floor(Math.random() * 500) + 50,
            lastUpdated: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
            cmsCompatible: ['wordpress', 'contentful', 'strapi', 'webflow'],
            isPopular: Math.random() > 0.6,
            isNew: Math.random() > 0.9
          });
        }
      } catch (error) {
        console.warn(`Could not load kit for ${kit}:`, error);
      }
    }

    return templates;
  }

  /**
   * Get template pricing based on industry
   */
  getTemplatePrice(industry) {
    const prices = {
      'restaurants': 79,
      'legal': 89,
      'fitness': 69,
      'real-estate': 99,
      'contractors-trades': 79,
      'healthcare': 109,
      'roofers-exterior': 79
    };
    return prices[industry] || 79;
  }

  /**
   * Get kit pricing based on kit type
   */
  getKitPrice(kit) {
    const prices = {
      'starter': 29,
      'minimal': 39,
      'business': 59,
      'creative': 79,
      'premium-interactive': 129
    };
    return prices[kit] || 59;
  }

  /**
   * Get template features based on industry
   */
  getTemplateFeatures(industry) {
    const baseFeatures = [
      'Responsive Design',
      'SEO Optimized',
      'Fast Loading',
      'Mobile Friendly',
      'CMS Integration Ready'
    ];

    const industryFeatures = {
      'restaurants': ['Menu Management', 'Reservation System', 'Online Ordering Ready'],
      'legal': ['Practice Areas', 'Attorney Profiles', 'Contact Forms'],
      'fitness': ['Class Schedule', 'Trainer Profiles', 'Membership Integration'],
      'real-estate': ['Property Search', 'Agent Profiles', 'MLS Integration Ready'],
      'contractors-trades': ['Service Areas', 'Project Gallery', 'Lead Capture Forms'],
      'healthcare': ['Appointment Booking', 'Staff Profiles', 'Patient Portal Ready'],
      'roofers-exterior': ['Service Calculator', 'Project Gallery', 'Lead Generation']
    };

    return [...baseFeatures, ...(industryFeatures[industry] || [])];
  }

  /**
   * Get kit features based on kit type
   */
  getKitFeatures(kit) {
    const baseFeatures = [
      'Multiple Pages',
      'Responsive Design',
      'SEO Optimized',
      'Fast Loading',
      'CMS Integration Ready'
    ];

    const kitFeatures = {
      'starter': ['Basic Pages', 'Contact Forms', 'Social Media Integration'],
      'minimal': ['Clean Design', 'Fast Loading', 'Essential Pages'],
      'business': ['Business Pages', 'Team Section', 'Services Showcase'],
      'creative': ['Portfolio Gallery', 'Creative Layouts', 'Advanced Animations'],
      'premium-interactive': ['Interactive Elements', 'Advanced Features', 'Premium Components']
    };

    return [...baseFeatures, ...(kitFeatures[kit] || [])];
  }

  /**
   * Load categories from templates
   */
  async loadCategories() {
    const categories = new Set();

    this.templates.forEach(template => {
      categories.add(template.category);
    });

    this.categories = Array.from(categories).sort();
  }

  /**
   * Get filtered and sorted templates
   */
  getFilteredTemplates() {
    let filtered = [...this.templates];

    // Apply category filter
    if (this.filters.category !== 'all') {
      filtered = filtered.filter(template => template.category === this.filters.category);
    }

    // Apply price filter
    if (this.filters.price !== 'all') {
      switch (this.filters.price) {
        case 'free':
          filtered = filtered.filter(template => template.price === 0);
          break;
        case 'under-50':
          filtered = filtered.filter(template => template.price < 50);
          break;
        case '50-100':
          filtered = filtered.filter(template => template.price >= 50 && template.price <= 100);
          break;
        case 'over-100':
          filtered = filtered.filter(template => template.price > 100);
          break;
      }
    }

    // Apply search filter
    if (this.filters.search) {
      const searchTerm = this.filters.search.toLowerCase();
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchTerm) ||
        template.description.toLowerCase().includes(searchTerm) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Apply sorting
    switch (this.filters.sort) {
      case 'popular':
        filtered.sort((a, b) => b.downloads - a.downloads);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
        break;
      default:
        break;
    }

    return filtered;
  }

  /**
   * Update filters
   */
  setFilters(newFilters) {
    this.filters = { ...this.filters, ...newFilters };
    this.notifyListeners();
  }

  /**
   * Get template by ID
   */
  getTemplateById(id) {
    return this.templates.find(template => template.id === id);
  }

  /**
   * Add template to cart
   */
  addToCart(templateId) {
    this.cart.add(templateId);
    this.notifyListeners();
  }

  /**
   * Remove template from cart
   */
  removeFromCart(templateId) {
    this.cart.delete(templateId);
    this.notifyListeners();
  }

  /**
   * Check if template is in cart
   */
  isInCart(templateId) {
    return this.cart.has(templateId);
  }

  /**
   * Get cart items
   */
  getCartItems() {
    return Array.from(this.cart).map(id => this.getTemplateById(id)).filter(Boolean);
  }

  /**
   * Get cart total
   */
  getCartTotal() {
    return this.getCartItems().reduce((total, item) => total + item.price, 0);
  }

  /**
   * Clear cart
   */
  clearCart() {
    this.cart.clear();
    this.notifyListeners();
  }

  /**
   * Purchase templates in cart
   */
  async purchaseCart(paymentMethod) {
    if (this.cart.size === 0) {
      throw new Error('Cart is empty');
    }

    try {
      const cartItems = this.getCartItems();
      const total = this.getCartTotal();

      const response = await this.makeRequest('/api/store/purchase', {
        method: 'POST',
        body: JSON.stringify({
          items: cartItems.map(item => ({ id: item.id, price: item.price })),
          total: total,
          paymentMethod: paymentMethod,
          currency: 'USD'
        })
      });

      if (response.success) {
        // Clear cart after successful purchase
        this.clearCart();
        return { success: true, orderId: response.orderId };
      }

      throw new Error(response.message || 'Purchase failed');
    } catch (error) {
      console.error('Purchase error:', error);
      throw error;
    }
  }

  /**
   * Download purchased template
   */
  async downloadTemplate(templateId) {
    try {
      const response = await this.makeRequest(`/api/store/download/${templateId}`, {
        method: 'GET'
      });

      if (response.success && response.downloadUrl) {
        // Trigger download
        const link = document.createElement('a');
        link.href = response.downloadUrl;
        link.download = `${templateId}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        return { success: true };
      }

      throw new Error(response.message || 'Download failed');
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  }

  /**
   * Make API request
   */
  async makeRequest(url, options = {}) {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      // Mock API responses for development
      if (__IS_PRODUCTION__ !== true) {
        return this.mockApiResponse(url, options);
      }
      throw error;
    }
  }

  /**
   * Mock API responses for development
   */
  mockApiResponse(url, options) {
    return new Promise(resolve => {
      setTimeout(() => {
        if (url.includes('/store/purchase')) {
          resolve({
            success: true,
            orderId: 'order-' + Date.now(),
            message: 'Purchase successful'
          });
        } else if (url.includes('/store/download/')) {
          const templateId = url.split('/').pop();
          resolve({
            success: true,
            downloadUrl: `data:application/zip;base64,${btoa('mock-zip-content-for-' + templateId)}`
          });
        } else {
          resolve({ success: true });
        }
      }, 1000);
    });
  }

  /**
   * Subscribe to store changes
   */
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify listeners of changes
   */
  notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener({
          templates: this.getFilteredTemplates(),
          categories: this.categories,
          filters: this.filters,
          cart: {
            items: this.getCartItems(),
            total: this.getCartTotal(),
            count: this.cart.size
          }
        });
      } catch (error) {
        console.error('Error notifying store listener:', error);
      }
    });
  }

  /**
   * Get store state
   */
  getState() {
    return {
      templates: this.getFilteredTemplates(),
      categories: this.categories,
      filters: this.filters,
      cart: {
        items: this.getCartItems(),
        total: this.getCartTotal(),
        count: this.cart.size
      }
    };
  }
}

// Create singleton instance
const templateStore = new TemplateStore();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = templateStore;
}

export default templateStore;
