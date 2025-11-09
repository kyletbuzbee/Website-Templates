/**
 * Theme Toggle Web Component
 * Handles switching between light and dark themes
 */

interface ThemeConfig {
  light: string;
  dark: string;
}

class ThemeToggle extends HTMLElement {
  private storageKey: string;
  private themes: ThemeConfig;
  private button!: HTMLButtonElement;

  constructor() {
    super();
    this.storageKey = this.getAttribute('storage-key') || 'theme';
    this.themes = {
      light: 'light',
      dark: 'dark',
    };
  }

  connectedCallback(): void {
    this.createToggleButton();
    this.loadSavedTheme();
    this.bindEvents();
  }

  private createToggleButton(): void {
    this.button = document.createElement('button');
    this.button.className = 'theme-toggle';
    this.button.setAttribute('aria-label', 'Toggle theme');
    this.button.innerHTML = `
      <svg class="theme-icon theme-icon-light" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/>
        <line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>
      <svg class="theme-icon theme-icon-dark" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    `;

    // Add to this custom element
    this.appendChild(this.button);
  }

  private bindEvents(): void {
    this.button.addEventListener('click', () => this.toggleTheme());
  }

  private toggleTheme(): void {
    const currentTheme = this.getCurrentTheme();
    const newTheme = currentTheme === this.themes.light ? this.themes.dark : this.themes.light;

    this.setTheme(newTheme);
    this.saveTheme(newTheme);
  }

  private setTheme(theme: string): void {
    document.documentElement.setAttribute('data-theme', theme);
    this.updateButtonState(theme);
  }

  updateButtonState(theme: string) {
    const lightIcon = this.button.querySelector('.theme-icon-light') as HTMLElement;
    const darkIcon = this.button.querySelector('.theme-icon-dark') as HTMLElement;

    if (theme === this.themes.dark) {
      lightIcon.style.display = 'none';
      darkIcon.style.display = 'block';
    } else {
      lightIcon.style.display = 'block';
      darkIcon.style.display = 'none';
    }
  }

  getCurrentTheme(): string {
    return document.documentElement.getAttribute('data-theme') || this.themes.light;
  }

  saveTheme(theme: string): void {
    try {
      localStorage.setItem(this.storageKey, theme);
    } catch (error) {
      console.warn('Unable to save theme preference:', error);
    }
  }

  loadSavedTheme(): void {
    try {
      const savedTheme = localStorage.getItem(this.storageKey);
      if (savedTheme && Object.values(this.themes).includes(savedTheme)) {
        this.setTheme(savedTheme);
      } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const defaultTheme = prefersDark ? this.themes.dark : this.themes.light;
        this.setTheme(defaultTheme);
      }
    } catch (error) {
      console.warn('Unable to load theme preference:', error);
      this.setTheme(this.themes.light);
    }
  }

  destroy(): void {
    if (this.button && this.button.parentNode) {
      this.button.parentNode.removeChild(this.button);
    }
  }
}

// Register the custom element
customElements.define('theme-toggle', ThemeToggle);

export default ThemeToggle;
