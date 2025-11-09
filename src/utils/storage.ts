/**
 * Local storage utilities with error handling
 */

/**
 * Safely get item from localStorage
 */
export function get(key: string, defaultValue: any = null) {
  try {
    const item = localStorage.getItem(key);
    return item !== null ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Failed to get item "${key}" from localStorage:`, error);
    return defaultValue;
  }
}

/**
 * Safely set item in localStorage
 */
export function set(key: string, value: any) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Failed to set item "${key}" in localStorage:`, error);
    return false;
  }
}

/**
 * Safely remove item from localStorage
 */
export function remove(key: string) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`Failed to remove item "${key}" from localStorage:`, error);
    return false;
  }
}

/**
 * Clear all localStorage
 */
export function clear() {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.warn('Failed to clear localStorage:', error);
    return false;
  }
}

/**
 * Check if localStorage is available
 */
export function isAvailable() {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get storage size in bytes
 */
export function getSize() {
  if (!isAvailable()) {
    return 0;
  }

  let total = 0;
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += key.length + localStorage[key].length;
    }
  }
  return total * 2; // UTF-16 uses 2 bytes per character
}

/**
 * Get all keys
 */
export function getKeys() {
  if (!isAvailable()) {
    return [];
  }

  const keys = [];
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      keys.push(key);
    }
  }
  return keys;
}

/**
 * Check if key exists
 */
export function has(key: string) {
  if (!isAvailable()) {
    return false;
  }
  return localStorage.getItem(key) !== null;
}

export default {
  get,
  set,
  remove,
  clear,
  isAvailable,
  getSize,
  getKeys,
  has,
};
