/**
 * Media Selector Component
 * Allows users to select and replace images and icons in templates
 */

interface MediaItem {
  id: string;
  type: 'image' | 'icon';
  name: string;
  src: string;
  category: string;
  tags: string[];
  alt?: string;
  thumbnail?: string;
}

interface MediaLibrary {
  images: MediaItem[];
  icons: MediaItem[];
}

interface MediaSelectorOptions {
  type: 'images' | 'icons' | 'both';
  categories: string[];
  onSelect: ((item: MediaItem) => void) | undefined;
  targetElements: string[] | undefined;
}

class MediaSelector extends HTMLElement {
  private options: MediaSelectorOptions;
  private mediaLibrary: MediaLibrary;
  private selectedType: 'images' | 'icons' = 'images';
  private selectedCategory: string = 'all';
  private searchQuery: string = '';
  private onSelectCallback?: (item: MediaItem) => void;

  // Professional media libraries
  private defaultMediaLibrary: MediaLibrary = {
    images: [
      // Hero Images
      {
        id: 'hero-business-1',
        type: 'image',
        name: 'Business Meeting',
        src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=150&fit=crop',
        category: 'hero',
        tags: ['business', 'meeting', 'professional', 'team'],
        alt: 'Professional business meeting',
      },
      {
        id: 'hero-healthcare-1',
        type: 'image',
        name: 'Medical Equipment',
        src: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=150&fit=crop',
        category: 'hero',
        tags: ['healthcare', 'medical', 'equipment', 'professional'],
        alt: 'Medical equipment in healthcare setting',
      },
      {
        id: 'hero-fitness-1',
        type: 'image',
        name: 'Strength Training',
        src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=150&fit=crop',
        category: 'hero',
        tags: ['fitness', 'gym', 'strength', 'training'],
        alt: 'Person doing strength training',
      },

      // Service Images
      {
        id: 'service-consultation',
        type: 'image',
        name: 'Business Consultation',
        src: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=400&h=300&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=200&h=150&fit=crop',
        category: 'services',
        tags: ['consultation', 'business', 'meeting', 'professional'],
        alt: 'Business consultation meeting',
      },
      {
        id: 'service-team',
        type: 'image',
        name: 'Team Collaboration',
        src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&h=150&fit=crop',
        category: 'services',
        tags: ['team', 'collaboration', 'business', 'group'],
        alt: 'Team working together',
      },

      // Background Images
      {
        id: 'bg-abstract-1',
        type: 'image',
        name: 'Abstract Pattern',
        src: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200&h=150&fit=crop',
        category: 'backgrounds',
        tags: ['abstract', 'pattern', 'background', 'modern'],
        alt: 'Abstract geometric pattern',
      },
      {
        id: 'bg-gradient-1',
        type: 'image',
        name: 'Blue Gradient',
        src: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=300&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=200&h=150&fit=crop',
        category: 'backgrounds',
        tags: ['gradient', 'blue', 'background', 'modern'],
        alt: 'Blue gradient background',
      },

      // Nature Images
      {
        id: 'nature-mountain',
        type: 'image',
        name: 'Mountain Landscape',
        src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop',
        category: 'nature',
        tags: ['mountain', 'landscape', 'nature', 'scenic'],
        alt: 'Beautiful mountain landscape',
      },
      {
        id: 'nature-ocean',
        type: 'image',
        name: 'Ocean Waves',
        src: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=300&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=200&h=150&fit=crop',
        category: 'nature',
        tags: ['ocean', 'waves', 'water', 'beach'],
        alt: 'Ocean waves crashing on beach',
      },

      // Technology Images
      {
        id: 'tech-workspace',
        type: 'image',
        name: 'Modern Workspace',
        src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&h=150&fit=crop',
        category: 'technology',
        tags: ['workspace', 'computer', 'technology', 'modern'],
        alt: 'Modern workspace with computer',
      },
      {
        id: 'tech-coding',
        type: 'image',
        name: 'Coding Setup',
        src: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=200&h=150&fit=crop',
        category: 'technology',
        tags: ['coding', 'programming', 'computer', 'development'],
        alt: 'Person coding on computer',
      },
    ],

    icons: [
      // Business Icons
      {
        id: 'icon-briefcase',
        type: 'icon',
        name: 'Briefcase',
        src: 'briefcase',
        category: 'business',
        tags: ['business', 'work', 'professional', 'case'],
        alt: 'Briefcase icon',
      },
      {
        id: 'icon-building',
        type: 'icon',
        name: 'Building',
        src: 'building',
        category: 'business',
        tags: ['building', 'office', 'business', 'company'],
        alt: 'Building icon',
      },
      {
        id: 'icon-cog',
        type: 'icon',
        name: 'Settings',
        src: 'cog',
        category: 'business',
        tags: ['settings', 'gear', 'configuration', 'tools'],
        alt: 'Settings cog icon',
      },

      // Contact Icons
      {
        id: 'icon-phone',
        type: 'icon',
        name: 'Phone',
        src: 'phone',
        category: 'contact',
        tags: ['phone', 'call', 'contact', 'communication'],
        alt: 'Phone icon',
      },
      {
        id: 'icon-envelope',
        type: 'icon',
        name: 'Email',
        src: 'envelope',
        category: 'contact',
        tags: ['email', 'mail', 'contact', 'communication'],
        alt: 'Envelope email icon',
      },
      {
        id: 'icon-map-pin',
        type: 'icon',
        name: 'Location',
        src: 'map-pin',
        category: 'contact',
        tags: ['location', 'map', 'pin', 'address'],
        alt: 'Map pin location icon',
      },

      // Social Media Icons
      {
        id: 'icon-facebook',
        type: 'icon',
        name: 'Facebook',
        src: 'facebook',
        category: 'social',
        tags: ['facebook', 'social', 'media', 'network'],
        alt: 'Facebook social media icon',
      },
      {
        id: 'icon-twitter',
        type: 'icon',
        name: 'Twitter',
        src: 'twitter',
        category: 'social',
        tags: ['twitter', 'social', 'media', 'network'],
        alt: 'Twitter social media icon',
      },
      {
        id: 'icon-instagram',
        type: 'icon',
        name: 'Instagram',
        src: 'instagram',
        category: 'social',
        tags: ['instagram', 'social', 'media', 'network'],
        alt: 'Instagram social media icon',
      },
      {
        id: 'icon-linkedin',
        type: 'icon',
        name: 'LinkedIn',
        src: 'linkedin',
        category: 'social',
        tags: ['linkedin', 'social', 'media', 'network'],
        alt: 'LinkedIn social media icon',
      },

      // Navigation Icons
      {
        id: 'icon-home',
        type: 'icon',
        name: 'Home',
        src: 'home',
        category: 'navigation',
        tags: ['home', 'house', 'navigation', 'main'],
        alt: 'Home icon',
      },
      {
        id: 'icon-menu',
        type: 'icon',
        name: 'Menu',
        src: 'menu',
        category: 'navigation',
        tags: ['menu', 'hamburger', 'navigation', 'list'],
        alt: 'Menu hamburger icon',
      },
      {
        id: 'icon-search',
        type: 'icon',
        name: 'Search',
        src: 'search',
        category: 'navigation',
        tags: ['search', 'magnifier', 'find', 'navigation'],
        alt: 'Search magnifying glass icon',
      },

      // Action Icons
      {
        id: 'icon-check',
        type: 'icon',
        name: 'Check',
        src: 'check',
        category: 'actions',
        tags: ['check', 'checkmark', 'success', 'done'],
        alt: 'Check mark icon',
      },
      {
        id: 'icon-star',
        type: 'icon',
        name: 'Star',
        src: 'star',
        category: 'actions',
        tags: ['star', 'favorite', 'rating', 'bookmark'],
        alt: 'Star icon',
      },
      {
        id: 'icon-heart',
        type: 'icon',
        name: 'Heart',
        src: 'heart',
        category: 'actions',
        tags: ['heart', 'love', 'favorite', 'like'],
        alt: 'Heart icon',
      },
    ],
  };

  constructor() {
    super();
    this.options = {
      type: 'both',
      categories: [],
      onSelect: undefined,
      targetElements: undefined,
    };
    this.mediaLibrary = { ...this.defaultMediaLibrary };
  }

  connectedCallback(): void {
    this.options = this.getOptions();
    this.render();
    this.bindEvents();
    this.loadUserUploads();
  }

  private render(): void {
    const showImages = this.options.type === 'images' || this.options.type === 'both';
    const showIcons = this.options.type === 'icons' || this.options.type === 'both';

    this.innerHTML = `
      <div class="media-selector">
        <div class="media-selector-header">
          <h3 class="media-selector-title">🖼️ Media Library</h3>
          <div class="media-selector-controls">
            <input type="text" class="media-search" placeholder="Search media..." value="${this.searchQuery}">
            <button class="media-upload-btn">📤 Upload</button>
          </div>
        </div>

        ${
  showImages && showIcons
    ? `
          <div class="media-type-tabs">
            <button class="media-type-tab ${this.selectedType === 'images' ? 'active' : ''}" data-type="images">
              📸 Images
            </button>
            <button class="media-type-tab ${this.selectedType === 'icons' ? 'active' : ''}" data-type="icons">
              🎯 Icons
            </button>
          </div>
        `
    : ''
}

        <div class="media-categories">
          <button class="media-category-btn ${this.selectedCategory === 'all' ? 'active' : ''}" data-category="all">
            All
          </button>
          ${this.getCategoriesForType()
    .map(
      category => `
            <button class="media-category-btn ${this.selectedCategory === category ? 'active' : ''}" data-category="${category}">
              ${this.capitalizeFirst(category)}
            </button>
          `,
    )
    .join('')}
        </div>

        <div class="media-grid">
          ${this.getFilteredMedia()
    .map(item => this.renderMediaItem(item))
    .join('')}
        </div>

        <div class="media-upload-area" style="display: none;">
          <div class="upload-drop-zone">
            <div class="upload-icon">📤</div>
            <p>Drop files here or click to browse</p>
            <input type="file" multiple accept="${this.getAcceptTypes()}" style="display: none;">
            <button class="upload-browse-btn">Browse Files</button>
          </div>
          <div class="upload-progress" style="display: none;">
            <div class="progress-bar">
              <div class="progress-fill"></div>
            </div>
            <p>Uploading...</p>
          </div>
        </div>
      </div>
    `;
  }

  private renderMediaItem(item: MediaItem): string {
    if (item.type === 'image') {
      return `
        <div class="media-item" data-media-id="${item.id}" data-media-type="image">
          <div class="media-preview">
            <img src="${item.thumbnail || item.src}" alt="${item.alt || item.name}" loading="lazy">
            <div class="media-overlay">
              <button class="media-select-btn" data-media-id="${item.id}">Select</button>
            </div>
          </div>
          <div class="media-info">
            <div class="media-name">${item.name}</div>
            <div class="media-tags">${item.tags.slice(0, 2).join(', ')}</div>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="media-item" data-media-id="${item.id}" data-media-type="icon">
          <div class="media-preview">
            <icon-element name="${item.src}" size="48" color="var(--color-primary)"></icon-element>
            <div class="media-overlay">
              <button class="media-select-btn" data-media-id="${item.id}">Select</button>
            </div>
          </div>
          <div class="media-info">
            <div class="media-name">${item.name}</div>
            <div class="media-tags">${item.tags.slice(0, 2).join(', ')}</div>
          </div>
        </div>
      `;
    }
  }

  private bindEvents(): void {
    // Search input
    const searchInput = this.querySelector('.media-search') as HTMLInputElement;
    if (searchInput) {
      searchInput.addEventListener('input', e => {
        this.searchQuery = (e.target as HTMLInputElement).value;
        this.updateGrid();
      });
    }

    // Type tabs
    this.querySelectorAll('.media-type-tab').forEach(tab => {
      tab.addEventListener('click', e => {
        const type = (e.currentTarget as HTMLElement).dataset.type as 'images' | 'icons';
        this.selectedType = type;
        this.selectedCategory = 'all';
        this.render();
        this.bindEvents();
      });
    });

    // Category buttons
    this.querySelectorAll('.media-category-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const category = (e.currentTarget as HTMLElement).dataset.category!;
        this.selectedCategory = category;
        this.updateGrid();
      });
    });

    // Media selection
    this.querySelectorAll('.media-select-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const mediaId = (e.currentTarget as HTMLElement).dataset.mediaId!;
        const mediaItem = this.findMediaItem(mediaId);
        if (mediaItem) {
          this.selectMedia(mediaItem);
        }
      });
    });

    // Upload functionality
    const uploadBtn = this.querySelector('.media-upload-btn');
    if (uploadBtn) {
      uploadBtn.addEventListener('click', () => this.toggleUploadArea());
    }

    const browseBtn = this.querySelector('.upload-browse-btn');
    const fileInput = this.querySelector('input[type="file"]') as HTMLInputElement;

    if (browseBtn && fileInput) {
      browseBtn.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', e => this.handleFileUpload(e));
    }

    // Drag and drop
    const dropZone = this.querySelector('.upload-drop-zone');
    if (dropZone) {
      dropZone.addEventListener('dragover', e => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
      });
      dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
      });
      dropZone.addEventListener('drop', e => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        this.handleFileDrop(e);
      });
    }
  }

  private getFilteredMedia(): MediaItem[] {
    const mediaArray =
      this.selectedType === 'images' ? this.mediaLibrary.images : this.mediaLibrary.icons;

    return mediaArray.filter(item => {
      // Category filter
      if (this.selectedCategory !== 'all' && item.category !== this.selectedCategory) {
        return false;
      }

      // Search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(query) ||
          item.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }

      return true;
    });
  }

  private getCategoriesForType(): string[] {
    const mediaArray =
      this.selectedType === 'images' ? this.mediaLibrary.images : this.mediaLibrary.icons;
    const categories = new Set(mediaArray.map(item => item.category));
    return Array.from(categories).sort();
  }

  private findMediaItem(id: string): MediaItem | undefined {
    return [...this.mediaLibrary.images, ...this.mediaLibrary.icons].find(item => item.id === id);
  }

  private selectMedia(item: MediaItem): void {
    // Trigger callback
    this.onSelectCallback?.(item);

    // Visual feedback
    this.querySelectorAll('.media-item').forEach(el => {
      el.classList.remove('selected');
    });
    const selectedItem = this.querySelector(`[data-media-id="${item.id}"]`);
    if (selectedItem) {
      selectedItem.classList.add('selected');
      setTimeout(() => selectedItem.classList.remove('selected'), 1000);
    }

    // Replace in template if target elements specified
    if (this.options.targetElements) {
      this.replaceInTemplate(item);
    }
  }

  private replaceInTemplate(item: MediaItem): void {
    this.options.targetElements?.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (item.type === 'image') {
          if (element.tagName === 'IMG') {
            (element as HTMLImageElement).src = item.src;
            (element as HTMLImageElement).alt = item.alt || item.name;
          } else {
            // Replace background image
            (element as HTMLElement).style.backgroundImage = `url(${item.src})`;
          }
        } else {
          // Replace icon
          if (element.tagName === 'ICON-ELEMENT') {
            element.setAttribute('name', item.src);
          }
        }
      });
    });
  }

  private updateGrid(): void {
    const grid = this.querySelector('.media-grid');
    if (grid) {
      grid.innerHTML = this.getFilteredMedia()
        .map(item => this.renderMediaItem(item))
        .join('');
      this.bindGridEvents();
    }
  }

  private bindGridEvents(): void {
    this.querySelectorAll('.media-select-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const mediaId = (e.currentTarget as HTMLElement).dataset.mediaId!;
        const mediaItem = this.findMediaItem(mediaId);
        if (mediaItem) {
          this.selectMedia(mediaItem);
        }
      });
    });
  }

  private toggleUploadArea(): void {
    const uploadArea = this.querySelector('.media-upload-area') as HTMLElement;
    const grid = this.querySelector('.media-grid') as HTMLElement;

    if (uploadArea.style.display === 'none') {
      uploadArea.style.display = 'block';
      grid.style.display = 'none';
    } else {
      uploadArea.style.display = 'none';
      grid.style.display = 'grid';
    }
  }

  private getAcceptTypes(): string {
    if (this.selectedType === 'images') {
      return 'image/*';
    } else {
      return 'image/svg+xml,image/png,image/jpeg,image/gif';
    }
  }

  private async handleFileUpload(e: Event): Promise<void> {
    const files = (e.target as HTMLInputElement).files;
    if (files) {
      await this.processFiles(files);
    }
  }

  private async handleFileDrop(e: Event): Promise<void> {
    const dragEvent = e as DragEvent;
    const files = dragEvent.dataTransfer?.files;
    if (files) {
      await this.processFiles(files);
    }
  }

  private async processFiles(files: FileList): Promise<void> {
    const progressArea = this.querySelector('.upload-progress') as HTMLElement;
    const progressFill = this.querySelector('.progress-fill') as HTMLElement;

    if (progressArea && progressFill) {
      progressArea.style.display = 'block';

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file) {
          continue;
        }
        const progress = ((i + 1) / files.length) * 100;
        progressFill.style.width = `${progress}%`;

        await this.uploadFile(file);
      }

      progressArea.style.display = 'none';
      this.toggleUploadArea(); // Hide upload area
      this.render(); // Re-render to show new items
      this.bindEvents();
    }
  }

  private async uploadFile(file: File): Promise<void> {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => {
        const result = e.target?.result as string;
        const newItem: MediaItem = {
          id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: file.type.startsWith('image/') ? 'image' : 'icon',
          name: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
          src: result,
          category: 'user-uploaded',
          tags: ['uploaded', 'custom'],
          alt: file.name,
        };

        if (newItem.type === 'image') {
          this.mediaLibrary.images.push(newItem);
        } else {
          this.mediaLibrary.icons.push(newItem);
        }

        this.saveUserUploads();
        resolve();
      };
      reader.readAsDataURL(file);
    });
  }

  private saveUserUploads(): void {
    try {
      const userUploads = {
        images: this.mediaLibrary.images.filter(img => img.category === 'user-uploaded'),
        icons: this.mediaLibrary.icons.filter(icon => icon.category === 'user-uploaded'),
      };
      localStorage.setItem('user-media-uploads', JSON.stringify(userUploads));
    } catch (error) {
      console.warn('Failed to save user uploads:', error);
    }
  }

  private loadUserUploads(): void {
    try {
      const saved = localStorage.getItem('user-media-uploads');
      if (saved) {
        const userUploads = JSON.parse(saved);
        if (userUploads.images) {
          this.mediaLibrary.images.push(...userUploads.images);
        }
        if (userUploads.icons) {
          this.mediaLibrary.icons.push(...userUploads.icons);
        }
      }
    } catch (error) {
      console.warn('Failed to load user uploads:', error);
    }
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private getOptions(): MediaSelectorOptions {
    return {
      type: (this.getAttribute('type') as MediaSelectorOptions['type']) || 'both',
      categories: this.getAttribute('categories')?.split(',') || [],
      onSelect: undefined,
      targetElements: this.getAttribute('target-elements')?.split(',') || undefined,
    };
  }

  // Public API
  setType(type: 'images' | 'icons' | 'both'): void {
    this.options.type = type;
    this.render();
    this.bindEvents();
  }

  addMediaItem(item: MediaItem): void {
    if (item.type === 'image') {
      this.mediaLibrary.images.push(item);
    } else {
      this.mediaLibrary.icons.push(item);
    }
    this.render();
    this.bindEvents();
  }

  onSelect(callback: (item: MediaItem) => void): void {
    this.onSelectCallback = callback;
  }

  setTargetElements(selectors: string[]): void {
    this.options.targetElements = selectors;
  }
}

// Register the custom element
customElements.define('media-selector', MediaSelector);

export default MediaSelector;
