/**
 * Navigation Component
 * Handles site navigation with mobile responsiveness
 */

interface NavigationOptions {
  container?: HTMLElement;
  links?: Array<{ text: string; href: string }>;
}

class Navigation extends HTMLElement {
  private links: Array<{ text: string; href: string }>;
  private isOpen: boolean;
  private nav!: HTMLElement;
  private toggleButton!: HTMLButtonElement;
  private menu!: HTMLElement;

  constructor() {
    super();
    this.links = this.parseLinks();
    this.isOpen = false;
  }

  connectedCallback(): void {
    this.createNavigation();
    this.bindEvents();
  }

  private parseLinks(): Array<{ text: string; href: string }> {
    const linksAttr = this.getAttribute('links');
    if (!linksAttr) return [];

    try {
      return JSON.parse(linksAttr);
    } catch {
      // Fallback: try to parse simple format like "Home:/,About:/about"
      return linksAttr.split(',').map(link => {
        const [text, href] = link.split(':');
        return { text: text?.trim() || '', href: href?.trim() || '#' };
      });
    }
  }

  private createNavigation(): void {
    this.nav = document.createElement('nav');
    this.nav.className = 'navigation';
    this.nav.innerHTML = `
      <div class="nav-container">
        <div class="nav-brand">
          <a href="/" class="nav-logo">Logo</a>
        </div>

        <button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">
          <span class="nav-toggle-line"></span>
          <span class="nav-toggle-line"></span>
          <span class="nav-toggle-line"></span>
        </button>

        <div class="nav-menu">
          ${this.links
            .map(
              link => `
            <a href="${link.href}" class="nav-link">${link.text}</a>
          `,
            )
            .join('')}
        </div>
      </div>
    `;

    this.appendChild(this.nav);
    this.toggleButton = this.nav.querySelector('.nav-toggle')!;
    this.menu = this.nav.querySelector('.nav-menu')!;
  }

  bindEvents() {
    this.toggleButton.addEventListener('click', () => this.toggleMenu());

    // Close menu when clicking outside
    document.addEventListener('click', event => {
      if (event.target && !this.nav.contains(event.target as Node)) {
        this.closeMenu();
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    this.isOpen ? this.closeMenu() : this.openMenu();
  }

  openMenu() {
    this.isOpen = true;
    this.menu.classList.add('nav-menu-open');
    this.toggleButton.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  closeMenu() {
    this.isOpen = false;
    this.menu.classList.remove('nav-menu-open');
    this.toggleButton.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  destroy(): void {
    if (this.nav && this.nav.parentNode) {
      this.nav.parentNode.removeChild(this.nav);
    }
  }
}

// Register the custom element
customElements.define('site-navigation', Navigation);

export default Navigation;
