/**
 * DOM utility functions
 */

/**
 * Create an element with attributes and children
 */
export function createElement(tag, attributes = {}, ...children) {
  const element = document.createElement(tag);

  // Set attributes
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(element.style, value);
    } else if (key.startsWith('on') && typeof value === 'function') {
      element.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      element.setAttribute(key, value);
    }
  });

  // Append children
  children.forEach(child => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      element.appendChild(child);
    }
  });

  return element;
}

/**
 * Query selector with optional context
 */
export function $(selector, context = document) {
  return context.querySelector(selector);
}

/**
 * Query selector all with optional context
 */
export function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

/**
 * Add event listener with automatic cleanup tracking
 */
export function on(element, event, handler, options = {}) {
  element.addEventListener(event, handler, options);

  // Return cleanup function
  return () => element.removeEventListener(event, handler, options);
}

/**
 * Add multiple event listeners
 */
export function onMultiple(element, events, handler, options = {}) {
  const eventArray = events.split(' ').filter(Boolean);
  const cleanups = eventArray.map(event => on(element, event, handler, options));

  return () => cleanups.forEach(cleanup => cleanup());
}

/**
 * Toggle class on element
 */
export function toggleClass(element, className, force) {
  return element.classList.toggle(className, force);
}

/**
 * Check if element has class
 */
export function hasClass(element, className) {
  return element.classList.contains(className);
}

/**
 * Add class to element
 */
export function addClass(element, ...classNames) {
  element.classList.add(...classNames);
}

/**
 * Remove class from element
 */
export function removeClass(element, ...classNames) {
  element.classList.remove(...classNames);
}

/**
 * Get element's computed style
 */
export function getComputedStyle(element, property) {
  return window.getComputedStyle(element).getPropertyValue(property);
}

/**
 * Check if element is visible in viewport
 */
export function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Smooth scroll to element
 */
export function scrollTo(element, options = {}) {
  const defaultOptions = {
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest',
  };

  element.scrollIntoView({ ...defaultOptions, ...options });
}

/**
 * Get element's offset from document
 */
export function getOffset(element) {
  const rect = element.getBoundingClientRect();
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft,
  };
}

export default {
  createElement,
  $,
  $$,
  on,
  onMultiple,
  toggleClass,
  hasClass,
  addClass,
  removeClass,
  getComputedStyle,
  isInViewport,
  scrollTo,
  getOffset,
};
