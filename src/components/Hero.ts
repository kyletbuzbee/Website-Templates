/**
 * Hero Component
 * Displays main hero section with title, subtitle, and CTA
 */

interface HeroOptions {
  container?: HTMLElement;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  backgroundImage?: string;
}

class Hero extends HTMLElement {
  private heroTitle: string;
  private subtitle: string;
  private ctaText: string;
  private ctaHref: string;
  private backgroundImage: string;
  private hero!: HTMLElement;

  constructor() {
    super();
    this.heroTitle = this.getAttribute('title') || 'Welcome';
    this.subtitle = this.getAttribute('subtitle') || 'Your success story starts here';
    this.ctaText = this.getAttribute('cta-text') || 'Get Started';
    this.ctaHref = this.getAttribute('cta-href') || '#contact';
    this.backgroundImage = this.getAttribute('background-image') || '';
  }

  connectedCallback(): void {
    this.createHero();
  }

  private createHero(): void {
    this.hero = document.createElement('section');
    this.hero.className = 'hero';
    this.hero.style.backgroundImage = this.backgroundImage ? `url(${this.backgroundImage})` : '';

    this.hero.innerHTML = `
      <div class="hero-container">
        <div class="hero-content">
          <h1 class="hero-title">${this.heroTitle}</h1>
          <p class="hero-subtitle">${this.subtitle}</p>
          <a href="${this.ctaHref}" class="hero-cta">${this.ctaText}</a>
        </div>
      </div>
    `;

    this.appendChild(this.hero);
  }

  destroy(): void {
    if (this.hero && this.hero.parentNode) {
      this.hero.parentNode.removeChild(this.hero);
    }
  }
}

// Register the custom element
customElements.define('hero-section', Hero);

export default Hero;
