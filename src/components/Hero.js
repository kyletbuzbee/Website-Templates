/**
 * Hero Component
 * Displays main hero section with title, subtitle, and CTA
 */

class Hero {
  constructor(options = {}) {
    this.container = options.container || document.body;
    this.title = options.title || 'Welcome';
    this.subtitle = options.subtitle || 'Your success story starts here';
    this.ctaText = options.ctaText || 'Get Started';
    this.ctaHref = options.ctaHref || '#contact';
    this.backgroundImage = options.backgroundImage || '';

    this.init();
  }

  init() {
    this.createHero();
  }

  createHero() {
    this.hero = document.createElement('section');
    this.hero.className = 'hero';
    this.hero.style.backgroundImage = this.backgroundImage ? `url(${this.backgroundImage})` : '';

    this.hero.innerHTML = `
      <div class="hero-container">
        <div class="hero-content">
          <h1 class="hero-title">${this.title}</h1>
          <p class="hero-subtitle">${this.subtitle}</p>
          <a href="${this.ctaHref}" class="hero-cta">${this.ctaText}</a>
        </div>
      </div>
    `;

    this.container.appendChild(this.hero);
  }

  destroy() {
    if (this.hero && this.hero.parentNode) {
      this.hero.parentNode.removeChild(this.hero);
    }
  }
}

export default Hero;
