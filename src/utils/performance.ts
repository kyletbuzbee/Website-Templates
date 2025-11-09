/**
 * Performance optimization utilities
 */

/**
 * Debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Call immediately on first invocation
 * @returns {Function} Debounced function
 */
export function debounce(func: any, wait: any, immediate: boolean = false) {
  let timeout: any;

  return function executedFunction(this: any, ...args: any[]) {
    const later = () => {
      timeout = null;
      if (!immediate) {
        func.apply(this, args);
      }
    };

    const callNow = immediate && !timeout;

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) {
      func.apply(this, args);
    }
  };
}

/**
 * Throttle function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func: any, limit: any) {
  let inThrottle: any;

  return function executedFunction(this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Create a memoized version of a function
 * @param {Function} func - Function to memoize
 * @param {Function} getKey - Function to generate cache key from arguments
 * @returns {Function} Memoized function
 */
export function memoize(func: any, getKey: any = (...args: any[]) => JSON.stringify(args)) {
  const cache = new Map();

  return function memoizedFunction(this: any, ...args: any[]) {
    const key = getKey(...args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = func.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

/**
 * Lazy load an image
 * @param {HTMLImageElement} img - Image element to lazy load
 * @param {string} src - Image source URL
 */
export function lazyLoadImage(img: any, src: any) {
  const image = new Image();

  image.onload = () => {
    img.src = src;
    img.classList.remove('loading');
    img.classList.add('loaded');
  };

  image.onerror = () => {
    img.classList.remove('loading');
    img.classList.add('error');
  };

  img.classList.add('loading');
  image.src = src;
}

/**
 * Intersection Observer for lazy loading
 * @param {Function} callback - Callback function when element enters viewport
 * @param {Object} options - IntersectionObserver options
 * @returns {IntersectionObserver} Observer instance
 */
export function createIntersectionObserver(callback: any, options: any = {}) {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  };

  return new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry.target);
      }
    });
  }, defaultOptions);
}

/**
 * Preload resources
 * @param {string[]} urls - Array of URLs to preload
 * @param {string} as - Resource type (script, style, image, etc.)
 */
export function preloadResources(urls: any, as: string = 'image') {
  urls.forEach((url: any) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = as;
    link.href = url;
    document.head.appendChild(link);
  });
}

/**
 * Request idle callback with fallback
 * @param {Function} callback - Function to call when idle
 * @param {Object} options - Options for requestIdleCallback
 */
export function requestIdleCallback(callback: any, options: any = {}) {
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, options);
  } else {
    // Fallback for browsers that don't support requestIdleCallback
    return setTimeout(() => callback({ timeRemaining: () => 50 }), 1);
  }
}

/**
 * Cancel idle callback with fallback
 * @param {number} id - Callback ID to cancel
 */
export function cancelIdleCallback(id: any) {
  if ('cancelIdleCallback' in window) {
    window.cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
}

/**
 * Measure performance
 * @param {string} name - Performance mark name
 * @param {Function} fn - Function to measure
 * @returns {*} Function result
 */
export function measurePerformance(name: any, fn: any) {
  if (!performance.mark) {
    return fn();
  }

  performance.mark(`${name}-start`);
  const result = fn();
  performance.mark(`${name}-end`);
  performance.measure(name, `${name}-start`, `${name}-end`);

  const measure = performance.getEntriesByName(name)[0];
  console.log(`${name} took ${measure?.duration || 0}ms`);

  return result;
}

/**
 * Create a simple FPS counter
 * @returns {Object} FPS counter with tick method
 */
export function createFPSCounter() {
  let lastTime = performance.now();
  let frameCount = 0;
  let fps = 0;

  return {
    tick() {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime - lastTime >= 1000) {
        fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;
      }

      return fps;
    },

    getFPS() {
      return fps;
    },
  };
}
