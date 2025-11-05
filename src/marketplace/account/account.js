/**
 * User Account Management
 * Handles user profile, purchase history, and account settings
 */

class AccountManager {
  constructor() {
    this.user = null;
    this.purchaseHistory = [];
    this.accountSettings = {
      notifications: {
        email: true,
        marketing: false,
        updates: true
      },
      privacy: {
        profileVisible: true,
        showPurchases: false
      }
    };
    this.listeners = new Set();

    // Initialize from auth state
    this.init();
  }

  /**
   * Initialize account manager
   */
  init() {
    // Subscribe to auth changes
    if (typeof authManager !== 'undefined') {
      authManager.subscribe((authState) => {
        this.user = authState.user;
        if (authState.isAuthenticated) {
          this.loadAccountData();
        } else {
          this.clearAccountData();
        }
        this.notifyListeners();
      });
    }

    // Load initial state
    const authState = typeof authManager !== 'undefined' ? authManager.getState() : { isAuthenticated: false };
    this.user = authState.user;
    if (authState.isAuthenticated) {
      this.loadAccountData();
    }
  }

  /**
   * Load user account data
   */
  async loadAccountData() {
    if (!this.user) return;

    try {
      const [historyResponse, settingsResponse] = await Promise.all([
        this.makeRequest('/api/account/purchase-history'),
        this.makeRequest('/api/account/settings')
      ]);

      if (historyResponse.success) {
        this.purchaseHistory = historyResponse.purchases || [];
      }

      if (settingsResponse.success) {
        this.accountSettings = { ...this.accountSettings, ...settingsResponse.settings };
      }

      this.notifyListeners();
    } catch (error) {
      console.error('Error loading account data:', error);
      // Use mock data for development
      if (__IS_PRODUCTION__ !== true) {
        this.loadMockAccountData();
      }
    }
  }

  /**
   * Load mock account data for development
   */
  loadMockAccountData() {
    this.purchaseHistory = [
      {
        id: 'order-001',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        items: [
          {
            id: 'industry-restaurants',
            name: 'Restaurant Template',
            price: 79,
            downloadUrl: '#'
          }
        ],
        total: 79,
        status: 'completed'
      },
      {
        id: 'order-002',
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        items: [
          {
            id: 'kit-business',
            name: 'Business Kit',
            price: 59,
            downloadUrl: '#'
          }
        ],
        total: 59,
        status: 'completed'
      }
    ];

    this.notifyListeners();
  }

  /**
   * Clear account data on logout
   */
  clearAccountData() {
    this.purchaseHistory = [];
    this.accountSettings = {
      notifications: {
        email: true,
        marketing: false,
        updates: true
      },
      privacy: {
        profileVisible: true,
        showPurchases: false
      }
    };
    this.notifyListeners();
  }

  /**
   * Update user profile
   */
  async updateProfile(profileData) {
    if (!this.user) {
      throw new Error('User not authenticated');
    }

    try {
      const response = await this.makeRequest('/api/account/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });

      if (response.success && response.user) {
        this.user = { ...this.user, ...response.user };
        this.notifyListeners();
        return { success: true, user: response.user };
      }

      throw new Error(response.message || 'Profile update failed');
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }

  /**
   * Update account settings
   */
  async updateSettings(settings) {
    if (!this.user) {
      throw new Error('User not authenticated');
    }

    try {
      const response = await this.makeRequest('/api/account/settings', {
        method: 'PUT',
        body: JSON.stringify(settings)
      });

      if (response.success) {
        this.accountSettings = { ...this.accountSettings, ...settings };
        this.notifyListeners();
        return { success: true };
      }

      throw new Error(response.message || 'Settings update failed');
    } catch (error) {
      console.error('Settings update error:', error);
      throw error;
    }
  }

  /**
   * Change password
   */
  async changePassword(currentPassword, newPassword) {
    if (!this.user) {
      throw new Error('User not authenticated');
    }

    try {
      const response = await this.makeRequest('/api/account/change-password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      if (response.success) {
        return { success: true };
      }

      throw new Error(response.message || 'Password change failed');
    } catch (error) {
      console.error('Password change error:', error);
      throw error;
    }
  }

  /**
   * Delete account
   */
  async deleteAccount() {
    if (!this.user) {
      throw new Error('User not authenticated');
    }

    // Show confirmation dialog
    const confirmed = confirm(
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.'
    );

    if (!confirmed) {
      return { success: false, cancelled: true };
    }

    try {
      const response = await this.makeRequest('/api/account/delete', {
        method: 'DELETE'
      });

      if (response.success) {
        // Logout user after account deletion
        if (typeof authManager !== 'undefined') {
          authManager.logout();
        }
        return { success: true };
      }

      throw new Error(response.message || 'Account deletion failed');
    } catch (error) {
      console.error('Account deletion error:', error);
      throw error;
    }
  }

  /**
   * Get purchase history
   */
  getPurchaseHistory() {
    return [...this.purchaseHistory];
  }

  /**
   * Get purchased templates
   */
  getPurchasedTemplates() {
    const purchasedTemplateIds = new Set();

    this.purchaseHistory.forEach(order => {
      if (order.status === 'completed') {
        order.items.forEach(item => {
          purchasedTemplateIds.add(item.id);
        });
      }
    });

    return Array.from(purchasedTemplateIds);
  }

  /**
   * Check if user owns template
   */
  ownsTemplate(templateId) {
    return this.getPurchasedTemplates().includes(templateId);
  }

  /**
   * Download purchased template
   */
  async downloadPurchasedTemplate(templateId) {
    if (!this.ownsTemplate(templateId)) {
      throw new Error('Template not purchased');
    }

    try {
      const response = await this.makeRequest(`/api/account/download/${templateId}`, {
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
   * Get account statistics
   */
  getAccountStats() {
    const purchasedTemplates = this.getPurchasedTemplates();
    const totalSpent = this.purchaseHistory
      .filter(order => order.status === 'completed')
      .reduce((total, order) => total + order.total, 0);

    return {
      totalPurchases: this.purchaseHistory.length,
      completedPurchases: this.purchaseHistory.filter(order => order.status === 'completed').length,
      totalSpent: totalSpent,
      purchasedTemplates: purchasedTemplates.length,
      memberSince: this.user?.createdAt || null,
      lastPurchase: this.purchaseHistory.length > 0 ?
        this.purchaseHistory[0].date : null
    };
  }

  /**
   * Export account data
   */
  async exportAccountData() {
    if (!this.user) {
      throw new Error('User not authenticated');
    }

    try {
      const response = await this.makeRequest('/api/account/export', {
        method: 'GET'
      });

      if (response.success && response.data) {
        // Create and download JSON file
        const dataStr = JSON.stringify(response.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `account-data-${this.user.id}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
        return { success: true };
      }

      throw new Error(response.message || 'Export failed');
    } catch (error) {
      console.error('Export error:', error);
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
        if (url.includes('/account/purchase-history')) {
          resolve({
            success: true,
            purchases: this.purchaseHistory
          });
        } else if (url.includes('/account/settings') && options.method === 'PUT') {
          resolve({
            success: true,
            message: 'Settings updated'
          });
        } else if (url.includes('/account/settings')) {
          resolve({
            success: true,
            settings: this.accountSettings
          });
        } else if (url.includes('/account/profile')) {
          resolve({
            success: true,
            user: options.body ? JSON.parse(options.body) : this.user
          });
        } else if (url.includes('/account/change-password')) {
          resolve({
            success: true,
            message: 'Password changed'
          });
        } else if (url.includes('/account/delete')) {
          resolve({
            success: true,
            message: 'Account deleted'
          });
        } else if (url.includes('/account/download/')) {
          const templateId = url.split('/').pop();
          resolve({
            success: true,
            downloadUrl: `data:application/zip;base64,${btoa('mock-zip-content-for-' + templateId)}`
          });
        } else if (url.includes('/account/export')) {
          resolve({
            success: true,
            data: {
              user: this.user,
              purchaseHistory: this.purchaseHistory,
              settings: this.accountSettings,
              stats: this.getAccountStats(),
              exportedAt: new Date().toISOString()
            }
          });
        } else {
          resolve({ success: true });
        }
      }, 500);
    });
  }

  /**
   * Subscribe to account changes
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
          user: this.user,
          purchaseHistory: this.purchaseHistory,
          settings: this.accountSettings,
          stats: this.getAccountStats(),
          purchasedTemplates: this.getPurchasedTemplates()
        });
      } catch (error) {
        console.error('Error notifying account listener:', error);
      }
    });
  }

  /**
   * Get account state
   */
  getState() {
    return {
      user: this.user,
      purchaseHistory: this.purchaseHistory,
      settings: this.accountSettings,
      stats: this.getAccountStats(),
      purchasedTemplates: this.getPurchasedTemplates()
    };
  }
}

// Create singleton instance
const accountManager = new AccountManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = accountManager;
}

export default accountManager;
