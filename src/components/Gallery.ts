/**
 * Gallery Component
 * Professional image gallery with lightbox, carousel, and grid display modes
 */

import Swiper from 'swiper';
import { Fancybox } from '@fancyapps/ui';
import 'swiper/css';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

export interface GalleryOptions {
  type: 'lightbox' | 'carousel' | 'grid';
  images: GalleryImage[];
  autoplay?: boolean;
  loop?: boolean;
  navigation?: boolean;
  pagination?: boolean;
}

export interface GalleryImage {
  src: string;
  thumbnail?: string;
  alt: string;
  title?: string;
  description?: string;
}

class Gallery extends HTMLElement {
  private options: GalleryOptions;
  private galleryInstance: any = null;

  constructor() {
    super();
    this.options = {
      type: 'lightbox',
      images: [],
    };
  }

  connectedCallback(): void {
    this.initializeGallery();
  }

  disconnectedCallback(): void {
    this.destroy();
  }

  setOptions(options: Partial<GalleryOptions>): void {
    this.options = { ...this.options, ...options };
    this.reinitialize();
  }

  setImages(images: GalleryImage[]): void {
    this.options.images = images;
    this.reinitialize();
  }

  private initializeGallery(): void {
    const { type, images } = this.options;

    if (!images || images.length === 0) {
      this.renderEmptyState();
      return;
    }

    switch (type) {
      case 'lightbox':
        this.initializeLightbox();
        break;
      case 'carousel':
        this.initializeCarousel();
        break;
      case 'grid':
        this.initializeGrid();
        break;
      default:
        this.initializeLightbox();
    }
  }

  private initializeLightbox(): void {
    this.renderLightboxHTML();
    // Fancybox will be initialized when images are clicked
  }

  private initializeCarousel(): void {
    this.renderCarouselHTML();

    // Initialize Swiper carousel
    const swiperElement = this.querySelector('.swiper') as HTMLElement;
    if (swiperElement) {
      this.galleryInstance = new Swiper(swiperElement, {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: this.options.loop || true,
        autoplay: this.options.autoplay
          ? {
            delay: 3000,
            disableOnInteraction: false,
          }
          : false,
        navigation:
          this.options.navigation !== false
            ? {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }
            : false,
        pagination:
          this.options.pagination !== false
            ? {
              el: '.swiper-pagination',
              clickable: true,
            }
            : false,
        breakpoints: {
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        },
      });
    }
  }

  private initializeGrid(): void {
    this.renderGridHTML();
    // Simple CSS Grid - no JavaScript needed for basic grid
  }

  private renderLightboxHTML(): void {
    this.innerHTML = `
      <div class="gallery gallery-lightbox">
        <div class="gallery-grid">
          ${this.options.images
    .map(
      (image, index) => `
            <div class="gallery-item">
              <a href="${image.src}" data-fancybox="gallery" data-caption="${image.title || image.alt}">
                <img src="${image.thumbnail || image.src}" alt="${image.alt}" loading="lazy">
                ${image.title ? `<div class="gallery-overlay"><h3>${image.title}</h3></div>` : ''}
              </a>
            </div>
          `,
    )
    .join('')}
        </div>
      </div>
    `;
  }

  private renderCarouselHTML(): void {
    this.innerHTML = `
      <div class="gallery gallery-carousel">
        <div class="swiper">
          <div class="swiper-wrapper">
            ${this.options.images
    .map(
      image => `
              <div class="swiper-slide">
                <div class="gallery-item">
                  <img src="${image.src}" alt="${image.alt}" loading="lazy">
                  ${image.title ? `<div class="gallery-caption"><h3>${image.title}</h3></div>` : ''}
                </div>
              </div>
            `,
    )
    .join('')}
          </div>
          ${
  this.options.navigation !== false
    ? `
            <div class="swiper-button-next"></div>
            <div class="swiper-button-prev"></div>
          `
    : ''
}
          ${
  this.options.pagination !== false
    ? `
            <div class="swiper-pagination"></div>
          `
    : ''
}
        </div>
      </div>
    `;
  }

  private renderGridHTML(): void {
    this.innerHTML = `
      <div class="gallery gallery-grid">
        ${this.options.images
    .map(
      image => `
          <div class="gallery-item">
            <img src="${image.src}" alt="${image.alt}" loading="lazy">
            ${image.title ? `<div class="gallery-overlay"><h3>${image.title}</h3></div>` : ''}
          </div>
        `,
    )
    .join('')}
      </div>
    `;
  }

  private renderEmptyState(): void {
    this.innerHTML = `
      <div class="gallery-empty">
        <div class="empty-icon">🖼️</div>
        <h3>No Images Available</h3>
        <p>Add some images to display in this gallery</p>
      </div>
    `;
  }

  private reinitialize(): void {
    this.destroy();
    this.initializeGallery();
  }

  private destroy(): void {
    if (this.galleryInstance) {
      if (this.galleryInstance.destroy) {
        this.galleryInstance.destroy();
      }
      this.galleryInstance = null;
    }
  }

  // Public API methods
  next(): void {
    if (this.galleryInstance && this.galleryInstance.slideNext) {
      this.galleryInstance.slideNext();
    }
  }

  prev(): void {
    if (this.galleryInstance && this.galleryInstance.slidePrev) {
      this.galleryInstance.slidePrev();
    }
  }

  goTo(index: number): void {
    if (this.galleryInstance && this.galleryInstance.slideTo) {
      this.galleryInstance.slideTo(index);
    }
  }
}

// Register the custom element
customElements.define('image-gallery', Gallery);

// Export types and utilities
export { Gallery };
export default Gallery;
