import DOMPurify from 'dompurify';

/**
 * ReLoop Security & Data Sanitization Suite
 * Protects against XSS, injection, open redirects, and spam abuse.
 */

// Rate Limiter Memory Store
const rateLimitStore = new Map();

/**
 * Rate Limiter
 * Enforces sliding window rate limits on client-side actions (login, forms, posting).
 * @param {string} actionKey - Unique key for the action (e.g. 'login', 'create_resource')
 * @param {Object} options - { maxAttempts: number, windowMs: number }
 * @returns {{ allowed: boolean, remaining: number, retryAfterSec: number }}
 */
export function checkRateLimit(actionKey, { maxAttempts = 5, windowMs = 60000 } = {}) {
  const now = Date.now();
  const record = rateLimitStore.get(actionKey) || { timestamps: [] };

  // Filter timestamps within the sliding window
  const activeTimestamps = record.timestamps.filter(ts => now - ts < windowMs);

  if (activeTimestamps.length >= maxAttempts) {
    const oldestTimestamp = activeTimestamps[0];
    const retryAfterSec = Math.ceil((oldestTimestamp + windowMs - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSec: Math.max(1, retryAfterSec)
    };
  }

  // Record new attempt
  activeTimestamps.push(now);
  rateLimitStore.set(actionKey, { timestamps: activeTimestamps });

  return {
    allowed: true,
    remaining: maxAttempts - activeTimestamps.length,
    retryAfterSec: 0
  };
}

/**
 * Sanitizes plain text input to remove potential script tags, control chars, and HTML.
 * @param {string} input - Untrusted user input
 * @param {number} [maxLength=2000] - Maximum allowable length
 * @returns {string} Sanitized string
 */
export function sanitizeText(input, maxLength = 2000) {
  if (typeof input !== 'string') return '';
  const trimmed = input.trim();
  if (!trimmed) return '';

  // Limit length to avoid memory denial-of-service
  const truncated = trimmed.slice(0, maxLength);

  // Strip dangerous HTML/script tags and normalize
  const clean = DOMPurify.sanitize(truncated, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });

  return clean;
}

/**
 * Sanitizes rich HTML content allowing only safe structural tags.
 * @param {string} dirtyHtml - Untrusted rich text
 * @returns {string} Clean HTML
 */
export function sanitizeHtml(dirtyHtml) {
  if (typeof dirtyHtml !== 'string') return '';
  return DOMPurify.sanitize(dirtyHtml, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'span'],
    ALLOWED_ATTR: ['href', 'title', 'target', 'rel'],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  });
}

/**
 * Validates and sanitizes URLs to prevent 'javascript:' or malicious schemes.
 * @param {string} url - Target URL
 * @returns {string|null} Safe URL or null
 */
export function sanitizeUrl(url) {
  if (typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  try {
    // Relative safe paths
    if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
      return trimmed;
    }

    const parsed = new URL(trimmed);
    if (['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol)) {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Validates password strength
 * @param {string} password 
 * @returns {{ valid: boolean, message: string }}
 */
export function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return { valid: false, message: 'Password is required.' };
  }
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long.' };
  }
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain both letters and numbers.' };
  }
  return { valid: true, message: '' };
}
