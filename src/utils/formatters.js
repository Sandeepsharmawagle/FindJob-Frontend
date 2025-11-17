/**
 * Format utilities for displaying data
 */

/**
 * Format date to localized string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  return new Date(date).toLocaleDateString('en-US', defaultOptions);
};

/**
 * Format date to short format
 */
export const formatShortDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US');
};

/**
 * Format currency
 */
export const formatCurrency = (amount, currency = 'USD') => {
  if (!amount && amount !== 0) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format salary range
 */
export const formatSalary = (salary) => {
  if (!salary) return '';
  return `$${salary.toLocaleString()}`;
};

/**
 * Truncate text with ellipsis
 */
export const truncate = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Format phone number
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

/**
 * Get relative time (e.g., "2 days ago")
 */
export const getRelativeTime = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const past = new Date(date);
  const diffInMs = now - past;
  const diffInSec = Math.floor(diffInMs / 1000);
  const diffInMin = Math.floor(diffInSec / 60);
  const diffInHour = Math.floor(diffInMin / 60);
  const diffInDay = Math.floor(diffInHour / 24);
  const diffInWeek = Math.floor(diffInDay / 7);
  const diffInMonth = Math.floor(diffInDay / 30);
  
  if (diffInSec < 60) return 'just now';
  if (diffInMin < 60) return `${diffInMin} minute${diffInMin > 1 ? 's' : ''} ago`;
  if (diffInHour < 24) return `${diffInHour} hour${diffInHour > 1 ? 's' : ''} ago`;
  if (diffInDay < 7) return `${diffInDay} day${diffInDay > 1 ? 's' : ''} ago`;
  if (diffInWeek < 4) return `${diffInWeek} week${diffInWeek > 1 ? 's' : ''} ago`;
  if (diffInMonth < 12) return `${diffInMonth} month${diffInMonth > 1 ? 's' : ''} ago`;
  
  return formatDate(date);
};
