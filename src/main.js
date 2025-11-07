/**
 * Main application entry point
 * Initializes components and sets up the application
 */

import './styles/main.css';
import { ThemeToggle } from './components';

// Initialize theme toggle
const themeToggleContainer = document.getElementById('theme-toggle');
if (themeToggleContainer) {
  const themeToggle = new ThemeToggle({
    container: themeToggleContainer,
  });
}

// Add some basic styling for the template gallery
const style = document.createElement('style');
style.textContent = `
  /* Template Gallery Styles */
  .header {
    background: var(--color-white);
    border-bottom: 1px solid var(--color-gray-200);
    padding: var(--spacing-md) 0;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .nav-logo {
    margin: 0;
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-primary);
  }

  .main {
    min-height: calc(100vh - 200px);
  }

  .hero-section {
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
    color: var(--color-white);
    padding: var(--spacing-3xl) 0;
  }

  .hero-content {
    text-align: center;
    max-width: var(--max-width-4xl);
    margin: 0 auto;
  }

  .hero-title {
    font-size: var(--font-size-5xl);
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--spacing-lg);
    line-height: 1.1;
  }

  .hero-subtitle {
    font-size: var(--font-size-xl);
    margin-bottom: var(--spacing-2xl);
    opacity: 0.9;
    line-height: var(--line-height-relaxed);
  }

  .hero-actions {
    display: flex;
    gap: var(--spacing-md);
    justify-content: center;
    flex-wrap: wrap;
  }

  .btn {
    display: inline-block;
    padding: var(--spacing-md) var(--spacing-xl);
    border-radius: var(--border-radius-md);
    text-decoration: none;
    font-weight: var(--font-weight-medium);
    transition: all var(--transition-normal);
    cursor: pointer;
    border: 2px solid transparent;
  }

  .btn-primary {
    background: var(--color-white);
    color: var(--color-primary);
    border-color: var(--color-white);
  }

  .btn-primary:hover {
    background: transparent;
    color: var(--color-white);
  }

  .btn-secondary {
    background: transparent;
    color: var(--color-white);
    border-color: var(--color-white);
  }

  .btn-secondary:hover {
    background: var(--color-white);
    color: var(--color-primary);
  }

  .btn-outline {
    background: transparent;
    color: var(--color-primary);
    border-color: var(--color-primary);
    margin: var(--spacing-xs);
  }

  .btn-outline:hover {
    background: var(--color-primary);
    color: var(--color-white);
  }

  .features-section,
  .templates-section,
  .docs-section {
    padding: var(--spacing-3xl) 0;
  }

  .section-title {
    font-size: var(--font-size-4xl);
    font-weight: var(--font-weight-bold);
    text-align: center;
    margin-bottom: var(--spacing-2xl);
    color: var(--color-gray-900);
  }

  .features-grid,
  .templates-grid,
  .docs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--spacing-xl);
    margin-top: var(--spacing-xl);
  }

  .feature-card,
  .template-card,
  .doc-card {
    background: var(--color-white);
    padding: var(--spacing-xl);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-md);
    transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  }

  .feature-card:hover,
  .template-card:hover,
  .doc-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }

  .feature-icon {
    font-size: var(--font-size-3xl);
    margin-bottom: var(--spacing-md);
  }

  .feature-card h3,
  .template-card h3,
  .doc-card h3 {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-semibold);
    margin-bottom: var(--spacing-md);
    color: var(--color-gray-900);
  }

  .feature-card p,
  .template-card p,
  .doc-card p {
    color: var(--color-gray-600);
    line-height: var(--line-height-relaxed);
    margin-bottom: var(--spacing-md);
  }

  .template-card {
    text-align: center;
  }

  .doc-card pre {
    background: var(--color-gray-100);
    padding: var(--spacing-md);
    border-radius: var(--border-radius-md);
    overflow-x: auto;
    margin-top: var(--spacing-md);
  }

  .doc-card code {
    font-family: var(--font-family-mono);
    font-size: var(--font-size-sm);
    color: var(--color-gray-800);
  }

  .footer {
    background: var(--color-gray-900);
    color: var(--color-white);
    padding: var(--spacing-xl) 0;
    text-align: center;
    margin-top: var(--spacing-3xl);
  }

  .footer p {
    margin: 0;
    opacity: 0.8;
  }

  /* Dark theme adjustments */
  [data-theme="dark"] .feature-card,
  [data-theme="dark"] .template-card,
  [data-theme="dark"] .doc-card {
    background: var(--color-gray-800);
    color: var(--color-white);
  }

  [data-theme="dark"] .feature-card h3,
  [data-theme="dark"] .template-card h3,
  [data-theme="dark"] .doc-card h3 {
    color: var(--color-white);
  }

  [data-theme="dark"] .feature-card p,
  [data-theme="dark"] .template-card p,
  [data-theme="dark"] .doc-card p {
    color: var(--color-gray-300);
  }

  [data-theme="dark"] .doc-card pre {
    background: var(--color-gray-700);
  }

  [data-theme="dark"] .doc-card code {
    color: var(--color-gray-200);
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .hero-title {
      font-size: var(--font-size-4xl);
    }

    .hero-actions {
      flex-direction: column;
      align-items: center;
    }

    .features-grid,
    .templates-grid,
    .docs-grid {
      grid-template-columns: 1fr;
      gap: var(--spacing-lg);
    }

    .section-title {
      font-size: var(--font-size-3xl);
    }
  }
`;

document.head.appendChild(style);

// Smooth scrolling for anchor links
document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (link) {
    event.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }
});

// Add loading animation for template links
document.addEventListener('click', event => {
  const templateLink = event.target.closest('a[href*="templates"]');
  if (templateLink) {
    templateLink.style.opacity = '0.7';
    templateLink.textContent += ' (Loading...)';
  }
});

// Performance monitoring in development
if (import.meta.env.DEV) {
  console.log('🚀 Production Ready Templates initialized');
  console.log('📊 Performance monitoring enabled');

  // Log page load performance
  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0];
    console.log(`⚡ Page loaded in ${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`);
  });
}
