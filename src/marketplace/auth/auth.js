/**
 * User Authentication Module
 * Handles user login, registration, session management, and authentication state
 */

class AuthManager {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.listeners = new Set();

    // Initialize from localStorage
    this.init();

    // Set up periodic token refresh
    this.setupTokenRefresh();
  }

  /**
   * Initialize authentication state from localStorage
   */
  init() {
    try {
      const storedUser = localStorage.getItem('marketplace_user');
      const storedToken = localStorage.getItem('marketplace_token');
      const tokenExpiry = localStorage.getItem('marketplace_token_expiry');

      if (storedUser && storedToken && tokenExpiry) {
        const expiryTime = new Date(tokenExpiry);
        if (expiryTime > new Date()) {
          this.currentUser = JSON.parse(storedUser);
          this.isAuthenticated = true;
          this.notifyListeners();
        } else {
          // Token expired, clear storage
          this.logout();
        }
      }
    } catch (error) {
      console.error('Error initializing auth state:', error);
      this.logout();
    }
  }

  /**
   * Set up periodic token refresh
   */
  setupTokenRefresh() {
    // Refresh token 5 minutes before expiry
    setInterval(() => {
      if (this.isAuthenticated) {
        const tokenExpiry = localStorage.getItem('marketplace_token_expiry');
        if (tokenExpiry) {
          const expiryTime = new Date(tokenExpiry);
          const refreshTime = new Date(expiryTime.getTime() - 5 * 60 * 1000); // 5 minutes before

          if (new Date() >= refreshTime) {
            this.refreshToken();
          }
        }
      }
    }, 60000); // Check every minute
  }

  /**
   * Register a new user
   */
  async register(userData) {
    try {
      const response = await this.makeRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });

      if (response.success) {
        // Auto-login after successful registration
        return await this.login({
          email: userData.email,
          password: userData.password
        });
      }

      throw new Error(response.message || 'Registration failed');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Log in user
   */
  async login(credentials) {
    try {
      const response = await this.makeRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });

      if (response.success && response.user && response.token) {
        this.currentUser = response.user;
        this.isAuthenticated = true;

        // Store in localStorage
        localStorage.setItem('marketplace_user', JSON.stringify(response.user));
        localStorage.setItem('marketplace_token', response.token);

        // Calculate and store token expiry (assuming 24 hours)
        const expiryTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
        localStorage.setItem('marketplace_token_expiry', expiryTime.toISOString());

        this.notifyListeners();
        return { success: true, user: response.user };
      }

      throw new Error(response.message || 'Login failed');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Log out user
   */
  logout() {
    this.currentUser = null;
    this.isAuthenticated = false;

    // Clear localStorage
    localStorage.removeItem('marketplace_user');
    localStorage.removeItem('marketplace_token');
    localStorage.removeItem('marketplace_token_expiry');

    this.notifyListeners();
  }

  /**
   * Refresh authentication token
   */
  async refreshToken() {
    try {
      const response = await this.makeRequest('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('marketplace_token')}`
        }
      });

      if (response.success && response.token) {
        localStorage.setItem('marketplace_token', response.token);

        // Update expiry time
        const expiryTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
        localStorage.setItem('marketplace_token_expiry', expiryTime.toISOString());

        return { success: true };
      }

      throw new Error('Token refresh failed');
    } catch (error) {
      console.error('Token refresh error:', error);
      // If refresh fails, logout user
      this.logout();
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userData) {
    if (!this.isAuthenticated) {
      throw new Error('User not authenticated');
    }

    try {
      const response = await this.makeRequest('/api/user/profile', {
        method: 'PUT',
        body: JSON.stringify(userData)
      });

      if (response.success && response.user) {
        this.currentUser = { ...this.currentUser, ...response.user };
        localStorage.setItem('marketplace_user', JSON.stringify(this.currentUser));
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
   * Change user password
   */
  async changePassword(passwordData) {
    if (!this.isAuthenticated) {
      throw new Error('User not authenticated');
    }

    try {
      const response = await this.makeRequest('/api/user/change-password', {
        method: 'POST',
        body: JSON.stringify(passwordData)
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
   * Make authenticated API request
   */
  async makeRequest(url, options = {}) {
    const token = localStorage.getItem('marketplace_token');

    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      // For demo purposes, simulate API responses
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
    const body = options.body ? JSON.parse(options.body) : {};

    // Simulate network delay
    return new Promise(resolve => {
      setTimeout(() => {
        if (url.includes('/auth/register')) {
          resolve({
            success: true,
            message: 'Registration successful',
            user: {
              id: Date.now(),
              email: body.email,
              name: body.name,
              role: 'user',
              createdAt: new Date().toISOString()
            }
          });
        } else if (url.includes('/auth/login')) {
          resolve({
            success: true,
            user: {
              id: 1,
              email: body.email,
              name: 'Demo User',
              role: 'user',
              avatar: '/assets/images/avatar-demo.jpg',
              purchasedTemplates: [],
              createdAt: '2024-01-01T00:00:00Z'
            },
            token: 'demo-jwt-token-' + Date.now()
          });
        } else if (url.includes('/user/profile')) {
          resolve({
            success: true,
            user: body
          });
        } else {
          resolve({ success: true });
        }
      }, 500); // 500ms delay
    });
  }

  /**
   * Subscribe to authentication state changes
   */
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all listeners of state changes
   */
  notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener({
          isAuthenticated: this.isAuthenticated,
          user: this.currentUser
        });
      } catch (error) {
        console.error('Error notifying auth listener:', error);
      }
    });
  }

  /**
   * Get current authentication state
   */
  getState() {
    return {
      isAuthenticated: this.isAuthenticated,
      user: this.currentUser
    };
  }

  /**
   * Check if user has specific role
   */
  hasRole(role) {
    return this.currentUser && this.currentUser.role === role;
  }

  /**
   * Check if user owns specific template
   */
  ownsTemplate(templateId) {
    return this.currentUser &&
           this.currentUser.purchasedTemplates &&
           this.currentUser.purchasedTemplates.includes(templateId);
  }
}

// Create singleton instance
const authManager = new AuthManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = authManager;
}

export default authManager;
