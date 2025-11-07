/**
 * Validation utility functions
 */

/**
 * Email validation
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Phone number validation (basic)
 */
export function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string') {
    return false;
  }

  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');

  // Check for valid length (10-15 digits for international)
  return digitsOnly.length >= 10 && digitsOnly.length <= 15;
}

/**
 * URL validation
 */
export function isValidUrl(url) {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Required field validation
 */
export function isRequired(value) {
  if (value === null || value === undefined) {
    return false;
  }
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return true;
}

/**
 * Minimum length validation
 */
export function hasMinLength(value, minLength) {
  if (!value || typeof value !== 'string') {
    return false;
  }
  return value.trim().length >= minLength;
}

/**
 * Maximum length validation
 */
export function hasMaxLength(value, maxLength) {
  if (!value || typeof value !== 'string') {
    return true;
  } // Allow empty values
  return value.trim().length <= maxLength;
}

/**
 * Numeric validation
 */
export function isNumeric(value) {
  if (value === null || value === undefined || value === '') {
    return false;
  }
  return !isNaN(value) && !isNaN(parseFloat(value));
}

/**
 * Integer validation
 */
export function isInteger(value) {
  return isNumeric(value) && Number.isInteger(Number(value));
}

/**
 * Range validation
 */
export function isInRange(value, min, max) {
  if (!isNumeric(value)) {
    return false;
  }
  const num = Number(value);
  return num >= min && num <= max;
}

/**
 * Pattern validation
 */
export function matchesPattern(value, pattern) {
  if (!value || typeof value !== 'string') {
    return false;
  }
  return pattern.test(value);
}

/**
 * Credit card number validation (basic Luhn algorithm)
 */
export function isValidCreditCard(number) {
  if (!number || typeof number !== 'string') {
    return false;
  }

  // Remove spaces and dashes
  const cleanNumber = number.replace(/[\s-]/g, '');

  // Check if all digits
  if (!/^\d+$/.test(cleanNumber)) {
    return false;
  }

  // Luhn algorithm
  let sum = 0;
  let shouldDouble = false;

  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i), 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

/**
 * Postal code validation (US)
 */
export function isValidUSPostalCode(code) {
  if (!code || typeof code !== 'string') {
    return false;
  }

  const postalCodeRegex = /^\d{5}(-\d{4})?$/;
  return postalCodeRegex.test(code.trim());
}

/**
 * Strong password validation
 */
export function isStrongPassword(password) {
  if (!password || typeof password !== 'string') {
    return false;
  }

  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
}

/**
 * Date validation
 */
export function isValidDate(date) {
  if (!date) {
    return false;
  }

  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
}

/**
 * Future date validation
 */
export function isFutureDate(date) {
  if (!isValidDate(date)) {
    return false;
  }
  return new Date(date) > new Date();
}

/**
 * Past date validation
 */
export function isPastDate(date) {
  if (!isValidDate(date)) {
    return false;
  }
  return new Date(date) < new Date();
}

export default {
  isValidEmail,
  isValidPhone,
  isValidUrl,
  isRequired,
  hasMinLength,
  hasMaxLength,
  isNumeric,
  isInteger,
  isInRange,
  matchesPattern,
  isValidCreditCard,
  isValidUSPostalCode,
  isStrongPassword,
  isValidDate,
  isFutureDate,
  isPastDate,
};
