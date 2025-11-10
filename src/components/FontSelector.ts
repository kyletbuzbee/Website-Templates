/**
 * Font Selector Component
 * Allows real-time customization of template typography
 */

interface FontFamily {
  name: string;
  family: string;
  weights: number[];
  category: 'serif' | 'sans-serif' | 'monospace' | 'display';
  googleFonts?: boolean;
}

interface FontScheme {
  name: string;
  heading: FontFamily;
  body: FontFamily;
  accent?: FontFamily;
}

interface FontSelectorOptions {
  target: string | undefined;
  schemes: FontScheme[] | undefined;
  onChange: ((scheme: FontScheme) => void) | undefined;
}

class FontSelector extends HTMLElement {
  private fontSchemes: FontScheme[];
  private currentScheme: FontScheme | null = null;
  private targetElement: HTMLElement | null = null;
  private onChangeCallback?: (scheme: FontScheme) => void;

  // Professional font families
  private fontFamilies: FontFamily[] = [
    // Sans-serif fonts
    {
      name: 'Inter',
      family: 'Inter, sans-serif',
      weights: [400, 500, 600, 700],
      category: 'sans-serif',
      googleFonts: true,
    },
    {
      name: 'Roboto',
      family: 'Roboto, sans-serif',
      weights: [300, 400, 500, 700],
      category: 'sans-serif',
      googleFonts: true,
    },
    {
      name: 'Open Sans',
      family: 'Open Sans, sans-serif',
      weights: [300, 400, 600, 700],
      category: 'sans-serif',
      googleFonts: true,
    },
    {
      name: 'Lato',
      family: 'Lato, sans-serif',
      weights: [300, 400, 700, 900],
      category: 'sans-serif',
      googleFonts: true,
    },
    {
      name: 'Poppins',
      family: 'Poppins, sans-serif',
      weights: [300, 400, 500, 600, 700],
      category: 'sans-serif',
      googleFonts: true,
    },
    {
      name: 'Nunito',
      family: 'Nunito, sans-serif',
      weights: [300, 400, 600, 700],
      category: 'sans-serif',
      googleFonts: true,
    },

    // Serif fonts
    {
      name: 'Playfair Display',
      family: 'Playfair Display, serif',
      weights: [400, 700],
      category: 'serif',
      googleFonts: true,
    },
    {
      name: 'Crimson Text',
      family: 'Crimson Text, serif',
      weights: [400, 600],
      category: 'serif',
      googleFonts: true,
    },
    {
      name: 'Merriweather',
      family: 'Merriweather, serif',
      weights: [300, 400, 700],
      category: 'serif',
      googleFonts: true,
    },
    {
      name: 'Lora',
      family: 'Lora, serif',
      weights: [400, 500, 600, 700],
      category: 'serif',
      googleFonts: true,
    },

    // Display fonts
    {
      name: 'Montserrat',
      family: 'Montserrat, sans-serif',
      weights: [300, 400, 500, 600, 700],
      category: 'display',
      googleFonts: true,
    },
    {
      name: 'Oswald',
      family: 'Oswald, sans-serif',
      weights: [300, 400, 500, 600, 700],
      category: 'display',
      googleFonts: true,
    },
    {
      name: 'Bebas Neue',
      family: 'Bebas Neue, cursive',
      weights: [400],
      category: 'display',
      googleFonts: true,
    },

    // System fonts (fallback)
    {
      name: 'System Sans',
      family: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      weights: [400, 500, 600, 700],
      category: 'sans-serif',
    },
    {
      name: 'System Serif',
      family: 'Georgia, "Times New Roman", serif',
      weights: [400, 700],
      category: 'serif',
    },
    {
      name: 'System Mono',
      family: '"SF Mono", Monaco, "Cascadia Code", monospace',
      weights: [400, 500, 600, 700],
      category: 'monospace',
    },
  ];

  // Default professional font schemes
  private defaultSchemes: FontScheme[] = [
    {
      name: 'Modern Professional',
      heading: this.fontFamilies.find(f => f.name === 'Inter')!,
      body: this.fontFamilies.find(f => f.name === 'Inter')!,
    },
    {
      name: 'Classic Serif',
      heading: this.fontFamilies.find(f => f.name === 'Playfair Display')!,
      body: this.fontFamilies.find(f => f.name === 'Lora')!,
    },
    {
      name: 'Clean Sans',
      heading: this.fontFamilies.find(f => f.name === 'Poppins')!,
      body: this.fontFamilies.find(f => f.name === 'Open Sans')!,
    },
    {
      name: 'Tech Modern',
      heading: this.fontFamilies.find(f => f.name === 'Montserrat')!,
      body: this.fontFamilies.find(f => f.name === 'Roboto')!,
    },
    {
      name: 'Elegant Display',
      heading: this.fontFamilies.find(f => f.name === 'Crimson Text')!,
      body: this.fontFamilies.find(f => f.name === 'Nunito')!,
    },
  ];

  constructor() {
    super();
    this.fontSchemes = [...this.defaultSchemes];
  }

  connectedCallback(): void {
    this.loadGoogleFonts();
    this.render();
    this.bindEvents();
    this.loadSavedScheme();
  }

  private loadGoogleFonts(): void {
    // Load Google Fonts for all schemes that need them
    const googleFonts = new Set<string>();

    this.fontSchemes.forEach(scheme => {
      if (scheme.heading.googleFonts) {
        googleFonts.add(`${scheme.heading.name}:wght@${scheme.heading.weights.join(',')}`);
      }
      if (scheme.body.googleFonts) {
        googleFonts.add(`${scheme.body.name}:wght@${scheme.body.weights.join(',')}`);
      }
      if (scheme.accent?.googleFonts) {
        googleFonts.add(`${scheme.accent.name}:wght@${scheme.accent.weights.join(',')}`);
      }
    });

    if (googleFonts.size > 0) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?${Array.from(googleFonts)
        .map(f => `family=${encodeURIComponent(f)}`)
        .join('&')}&display=swap`;
      document.head.appendChild(link);
    }
  }

  private render(): void {
    const categories = ['sans-serif', 'serif', 'display', 'monospace'] as const;

    this.innerHTML = `
      <div class="font-selector">
        <div class="font-selector-header">
          <h3 class="font-selector-title">🔤 Typography</h3>
          <button class="font-selector-reset" title="Reset to default">↻</button>
        </div>

        <div class="font-schemes">
          ${this.fontSchemes
    .map(
      (scheme, index) => `
            <div class="font-scheme-card ${this.currentScheme?.name === scheme.name ? 'active' : ''}"
                 data-scheme-index="${index}">
              <div class="font-scheme-preview">
                <div class="font-heading-sample" style="font-family: ${scheme.heading.family}">
                  Heading
                </div>
                <div class="font-body-sample" style="font-family: ${scheme.body.family}">
                  Body text sample
                </div>
              </div>
              <div class="font-scheme-name">${scheme.name}</div>
            </div>
          `,
    )
    .join('')}
        </div>

        <div class="font-customization">
          <h4>Custom Fonts</h4>

          <div class="font-category-tabs">
            ${categories
    .map(
      category => `
              <button class="font-category-tab ${category === 'sans-serif' ? 'active' : ''}"
                      data-category="${category}">
                ${category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            `,
    )
    .join('')}
          </div>

          <div class="font-selection">
            <div class="font-group">
              <label for="heading-font">Heading Font</label>
              <select id="heading-font">
                ${this.fontFamilies
    .map(
      font => `
                  <option value="${font.name}" ${this.currentScheme?.heading.name === font.name ? 'selected' : ''}>
                    ${font.name}
                  </option>
                `,
    )
    .join('')}
              </select>
            </div>

            <div class="font-group">
              <label for="body-font">Body Font</label>
              <select id="body-font">
                ${this.fontFamilies
    .map(
      font => `
                  <option value="${font.name}" ${this.currentScheme?.body.name === font.name ? 'selected' : ''}>
                    ${font.name}
                  </option>
                `,
    )
    .join('')}
              </select>
            </div>
          </div>

          <div class="font-preview">
            <div class="font-preview-heading" id="preview-heading">
              Your Heading Here
            </div>
            <div class="font-preview-body" id="preview-body">
              This is how your body text will look. It should be readable and professional.
              The font pairing should create a harmonious visual hierarchy.
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private bindEvents(): void {
    // Scheme selection
    this.querySelectorAll('.font-scheme-card').forEach(card => {
      card.addEventListener('click', e => {
        const index = parseInt((e.currentTarget as HTMLElement).dataset.schemeIndex || '0');
        const scheme = this.fontSchemes[index];
        if (scheme) {
          this.applyScheme(scheme);
        }
      });
    });

    // Font selection
    const headingSelect = this.querySelector('#heading-font') as HTMLSelectElement;
    const bodySelect = this.querySelector('#body-font') as HTMLSelectElement;

    if (headingSelect) {
      headingSelect.addEventListener('change', () => {
        this.applyCustomFonts();
      });
    }

    if (bodySelect) {
      bodySelect.addEventListener('change', () => {
        this.applyCustomFonts();
      });
    }

    // Category tabs
    this.querySelectorAll('.font-category-tab').forEach(tab => {
      tab.addEventListener('click', e => {
        const category = (e.currentTarget as HTMLElement).dataset
          .category as FontFamily['category'];
        this.filterFontsByCategory(category);
      });
    });

    // Reset button
    const resetBtn = this.querySelector('.font-selector-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.resetToDefault();
      });
    }
  }

  private applyScheme(scheme: FontScheme): void {
    this.currentScheme = scheme;
    this.updateCSSVariables(scheme);
    this.updateActiveState();
    this.updatePreview(scheme);
    this.saveScheme(scheme);
    this.onChangeCallback?.(scheme);
  }

  private applyCustomFonts(): void {
    const headingSelect = this.querySelector('#heading-font') as HTMLSelectElement;
    const bodySelect = this.querySelector('#body-font') as HTMLSelectElement;

    const headingFont = this.fontFamilies.find(f => f.name === headingSelect?.value);
    const bodyFont = this.fontFamilies.find(f => f.name === bodySelect?.value);

    if (headingFont && bodyFont) {
      const customScheme: FontScheme = {
        name: 'Custom',
        heading: headingFont,
        body: bodyFont,
      };

      this.currentScheme = customScheme;
      this.updateCSSVariables(customScheme);
      this.updatePreview(customScheme);
      this.onChangeCallback?.(customScheme);
    }
  }

  private updateCSSVariables(scheme: FontScheme): void {
    const target = this.targetElement || document.documentElement;

    target.style.setProperty('--font-heading', scheme.heading.family);
    target.style.setProperty('--font-body', scheme.body.family);
    target.style.setProperty('--font-accent', scheme.accent?.family || scheme.heading.family);
  }

  private updateActiveState(): void {
    this.querySelectorAll('.font-scheme-card').forEach(card => {
      card.classList.remove('active');
    });

    if (this.currentScheme) {
      const index = this.fontSchemes.findIndex(s => s.name === this.currentScheme?.name);
      if (index !== -1) {
        const activeCard = this.querySelector(`[data-scheme-index="${index}"]`);
        if (activeCard) {
          activeCard.classList.add('active');
        }
      }
    }
  }

  private updatePreview(scheme: FontScheme): void {
    const headingPreview = this.querySelector('#preview-heading') as HTMLElement;
    const bodyPreview = this.querySelector('#preview-body') as HTMLElement;

    if (headingPreview) {
      headingPreview.style.fontFamily = scheme.heading.family;
    }
    if (bodyPreview) {
      bodyPreview.style.fontFamily = scheme.body.family;
    }
  }

  private filterFontsByCategory(category: FontFamily['category']): void {
    // Update tab active state
    this.querySelectorAll('.font-category-tab').forEach(tab => {
      tab.classList.remove('active');
    });
    const activeTab = this.querySelector(`[data-category="${category}"]`);
    if (activeTab) {
      activeTab.classList.add('active');
    }

    // Filter font options
    const headingSelect = this.querySelector('#heading-font') as HTMLSelectElement;
    const bodySelect = this.querySelector('#body-font') as HTMLSelectElement;

    const filteredFonts = this.fontFamilies.filter(f => f.category === category);

    const updateSelect = (select: HTMLSelectElement) => {
      const currentValue = select.value;
      select.innerHTML = filteredFonts
        .map(
          font => `
        <option value="${font.name}" ${currentValue === font.name ? 'selected' : ''}>
          ${font.name}
        </option>
      `,
        )
        .join('');
    };

    if (headingSelect) {
      updateSelect(headingSelect);
    }
    if (bodySelect) {
      updateSelect(bodySelect);
    }
  }

  private resetToDefault(): void {
    const defaultScheme = this.defaultSchemes[0];
    if (defaultScheme) {
      this.applyScheme(defaultScheme);
    }
  }

  private saveScheme(scheme: FontScheme): void {
    try {
      localStorage.setItem('template-font-scheme', JSON.stringify(scheme));
    } catch (error) {
      console.warn('Failed to save font scheme:', error);
    }
  }

  private loadSavedScheme(): void {
    try {
      const saved = localStorage.getItem('template-font-scheme');
      if (saved) {
        const scheme = JSON.parse(saved) as FontScheme;
        // Validate that it's a proper FontScheme object
        if (scheme && typeof scheme === 'object' && scheme.name && scheme.heading && scheme.body) {
          this.applyScheme(scheme);
          return;
        }
      }
      this.resetToDefault();
    } catch (error) {
      console.warn('Failed to load saved font scheme:', error);
      this.resetToDefault();
    }
  }

  private getOptions(): FontSelectorOptions {
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

  addScheme(scheme: FontScheme): void {
    this.fontSchemes.push(scheme);
    this.render();
    this.bindEvents();
  }

  getCurrentScheme(): FontScheme | null {
    return this.currentScheme;
  }

  onChange(callback: (scheme: FontScheme) => void): void {
    this.onChangeCallback = callback;
  }
}

// Register the custom element
customElements.define('font-selector', FontSelector);

export default FontSelector;
