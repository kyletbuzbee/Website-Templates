/**
 * Navigation Component
 * Handles site navigation with mobile responsiveness
 */

class Navigation {
  constructor(options = {}) {
    this.container = options.container || document.body;
    this.links = options.links || [];
    this.isOpen = false;

    this.init();
  }

  init() {
    this.createNavigation();
    this.bindEvents();
  }

  createNavigation() {
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

    this.container.appendChild(this.nav);
    this.toggleButton = this.nav.querySelector('.nav-toggle');
    this.menu = this.nav.querySelector('.nav-menu');
  }

  bindEvents() {
    this.toggleButton.addEventListener('click', () => this.toggleMenu());

    // Close menu when clicking outside
    document.addEventListener('click', event => {
      if (!this.nav.contains(event.target)) {
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

  destroy() {
    if (this.nav && this.nav.parentNode) {
      this.nav.parentNode.removeChild(this.nav);
    }
  }
}

export default Navigation;
