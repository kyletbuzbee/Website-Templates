/**
 * Color Picker Component
 * Allows real-time customization of template color schemes
 */

interface ColorScheme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  muted: string;
}

interface ColorPickerOptions {
  target: string | undefined;
  schemes: ColorScheme[] | undefined;
  onChange: ((scheme: ColorScheme) => void) | undefined;
}

class ColorPicker extends HTMLElement {
  private colorSchemes: ColorScheme[];
  private currentScheme: ColorScheme | null = null;
  private targetElement: HTMLElement | null = null;
  private onChangeCallback?: (scheme: ColorScheme) => void;

  // Default professional color schemes
  private defaultSchemes: ColorScheme[] = [
    {
      name: 'Professional Blue',
      primary: '#2563eb',
      secondary: '#64748b',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#0f172a',
      muted: '#64748b',
    },
    {
      name: 'Modern Green',
      primary: '#10b981',
      secondary: '#6b7280',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#111827',
      muted: '#6b7280',
    },
    {
      name: 'Elegant Purple',
      primary: '#8b5cf6',
      secondary: '#64748b',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#0f172a',
      muted: '#64748b',
    },
    {
      name: 'Warm Orange',
      primary: '#f97316',
      secondary: '#64748b',
      accent: '#10b981',
      background: '#ffffff',
      text: '#0f172a',
      muted: '#64748b',
    },
    {
      name: 'Dark Professional',
      primary: '#3b82f6',
      secondary: '#94a3b8',
      accent: '#f59e0b',
      background: '#0f172a',
      text: '#f8fafc',
      muted: '#94a3b8',
    },
  ];

  constructor() {
    super();
    this.colorSchemes = [...this.defaultSchemes];
  }

  connectedCallback(): void {
    this.render();
    this.bindEvents();
    this.loadSavedScheme();
  }

  private render(): void {
    const options = this.getOptions();

    this.innerHTML = `
      <div class="color-picker">
        <div class="color-picker-header">
          <h3 class="color-picker-title">🎨 Color Scheme</h3>
          <button class="color-picker-reset" title="Reset to default">↻</button>
        </div>

        <div class="color-schemes">
          ${this.colorSchemes
    .map(
      (scheme, index) => `
            <div class="color-scheme-card ${this.currentScheme?.name === scheme.name ? 'active' : ''}"
                 data-scheme-index="${index}">
              <div class="color-scheme-preview">
                <div class="color-swatch primary" style="background-color: ${scheme.primary}"></div>
                <div class="color-swatch secondary" style="background-color: ${scheme.secondary}"></div>
                <div class="color-swatch accent" style="background-color: ${scheme.accent}"></div>
                <div class="color-swatch background" style="background-color: ${scheme.background}"></div>
              </div>
              <div class="color-scheme-name">${scheme.name}</div>
            </div>
          `,
    )
    .join('')}
        </div>

        <div class="color-customization">
          <h4>Custom Colors</h4>
          <div class="color-inputs">
            <div class="color-input-group">
              <label for="primary-color">Primary</label>
              <input type="color" id="primary-color" value="${this.currentScheme?.primary || '#2563eb'}">
            </div>
            <div class="color-input-group">
              <label for="secondary-color">Secondary</label>
              <input type="color" id="secondary-color" value="${this.currentScheme?.secondary || '#64748b'}">
            </div>
            <div class="color-input-group">
              <label for="accent-color">Accent</label>
              <input type="color" id="accent-color" value="${this.currentScheme?.accent || '#f59e0b'}">
            </div>
            <div class="color-input-group">
              <label for="background-color">Background</label>
              <input type="color" id="background-color" value="${this.currentScheme?.background || '#ffffff'}">
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private bindEvents(): void {
    // Scheme selection
    this.querySelectorAll('.color-scheme-card').forEach(card => {
      card.addEventListener('click', e => {
        const index = parseInt((e.currentTarget as HTMLElement).dataset.schemeIndex || '0');
        const scheme = this.colorSchemes[index];
        if (scheme) {
          this.applyScheme(scheme);
        }
      });
    });

    // Custom color inputs
    this.querySelectorAll('input[type="color"]').forEach(input => {
      input.addEventListener('input', () => {
        this.applyCustomColors();
      });
    });

    // Reset button
    const resetBtn = this.querySelector('.color-picker-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.resetToDefault();
      });
    }
  }

  private applyScheme(scheme: ColorScheme): void {
    this.currentScheme = scheme;
    this.updateCSSVariables(scheme);
    this.updateActiveState();
    this.saveScheme(scheme);
    this.onChangeCallback?.(scheme);
  }

  private applyCustomColors(): void {
    const primary = (this.querySelector('#primary-color') as HTMLInputElement)?.value || '#2563eb';
    const secondary =
      (this.querySelector('#secondary-color') as HTMLInputElement)?.value || '#64748b';
    const accent = (this.querySelector('#accent-color') as HTMLInputElement)?.value || '#f59e0b';
    const background =
      (this.querySelector('#background-color') as HTMLInputElement)?.value || '#ffffff';

    const customScheme: ColorScheme = {
      name: 'Custom',
      primary,
      secondary,
      accent,
      background,
      text: this.getContrastColor(background),
      muted: this.adjustBrightness(secondary, -20),
    };

    this.currentScheme = customScheme;
    this.updateCSSVariables(customScheme);
    this.onChangeCallback?.(customScheme);
  }

  private updateCSSVariables(scheme: ColorScheme): void {
    const target = this.targetElement || document.documentElement;

    target.style.setProperty('--color-primary', scheme.primary);
    target.style.setProperty('--color-primary-dark', this.adjustBrightness(scheme.primary, -20));
    target.style.setProperty('--color-primary-light', this.adjustBrightness(scheme.primary, 20));

    target.style.setProperty('--color-secondary', scheme.secondary);
    target.style.setProperty(
      '--color-secondary-dark',
      this.adjustBrightness(scheme.secondary, -20),
    );
    target.style.setProperty(
      '--color-secondary-light',
      this.adjustBrightness(scheme.secondary, 20),
    );

    target.style.setProperty('--color-accent', scheme.accent);
    target.style.setProperty('--color-accent-dark', this.adjustBrightness(scheme.accent, -20));
    target.style.setProperty('--color-accent-light', this.adjustBrightness(scheme.accent, 20));

    target.style.setProperty('--color-white', scheme.background);
    target.style.setProperty('--color-black', scheme.text);
    target.style.setProperty('--color-gray-900', scheme.text);
    target.style.setProperty('--color-gray-600', scheme.muted);
    target.style.setProperty('--color-gray-500', scheme.muted);
  }

  private updateActiveState(): void {
    this.querySelectorAll('.color-scheme-card').forEach(card => {
      card.classList.remove('active');
    });

    if (this.currentScheme) {
      const index = this.colorSchemes.findIndex(s => s.name === this.currentScheme?.name);
      if (index !== -1) {
        const activeCard = this.querySelector(`[data-scheme-index="${index}"]`);
        if (activeCard) {
          activeCard.classList.add('active');
        }
      }
    }
  }

  private resetToDefault(): void {
    const defaultScheme = this.defaultSchemes[0];
    if (defaultScheme) {
      this.applyScheme(defaultScheme);
    }
  }

  private getContrastColor(backgroundColor: string): string {
    // Simple contrast calculation - return dark text for light backgrounds
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#0f172a' : '#f8fafc';
  }

  private adjustBrightness(color: string, amount: number): string {
    const hex = color.replace('#', '');
    const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
    const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
    const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  private saveScheme(scheme: ColorScheme): void {
    try {
      localStorage.setItem('template-color-scheme', JSON.stringify(scheme));
    } catch (error) {
      console.warn('Failed to save color scheme:', error);
    }
  }

  private loadSavedScheme(): void {
    try {
      const saved = localStorage.getItem('template-color-scheme');
      if (saved) {
        const scheme = JSON.parse(saved) as ColorScheme;
        // Validate that it's a proper ColorScheme object
        if (scheme && typeof scheme === 'object' && scheme.name && scheme.primary) {
          this.applyScheme(scheme);
        } else {
          this.resetToDefault();
        }
      } else {
        this.resetToDefault();
      }
    } catch (error) {
      console.warn('Failed to load saved color scheme:', error);
      this.resetToDefault();
    }
  }

  private getOptions(): ColorPickerOptions {
    return {
      target: this.getAttribute('target') || undefined,
      schemes: undefined, // Not using attribute-based schemes for now
      onChange: undefined, // Not using attribute-based callbacks for now
    };
  }

  // Public API
  setTarget(element: HTMLElement): void {
    this.targetElement = element;
  }

  addScheme(scheme: ColorScheme): void {
    this.colorSchemes.push(scheme);
    this.render();
    this.bindEvents();
  }

  getCurrentScheme(): ColorScheme | null {
    return this.currentScheme;
  }

  onChange(callback: (scheme: ColorScheme) => void): void {
    this.onChangeCallback = callback;
  }
}

// Register the custom element
customElements.define('color-picker', ColorPicker);

export default ColorPicker;
