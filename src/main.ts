/**
 * Main application entry point
 * Initializes components and sets up the application
 */

import './styles/main.css';

// Import and register custom elements
import './components/ThemeToggle';
import './components/ContactForm';
import './components/Navigation';
import './components/Hero';

// Custom elements are automatically registered when imported
// They will be initialized when their tags are found in the DOM

// Add sophisticated styling for the professional homepage (scoped to .homepage)
const style = document.createElement('style');
style.textContent = `
  /* ===== HOMEPAGE-SPECIFIC STYLES ===== */
  /* Only apply these styles when body has .homepage class */

  .homepage *,
  .homepage *::before,
  .homepage *::after {
    box-sizing: border-box;
  }

  .homepage html {
    scroll-behavior: smooth;
  }

  .homepage body {
    font-family: 'Inter', var(--font-family-primary);
    line-height: var(--line-height-normal);
    color: var(--color-gray-900);
    background: var(--color-white);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* ===== HOMEPAGE TYPOGRAPHY ===== */
  .homepage h1, .homepage h2, .homepage h3, .homepage h4, .homepage h5, .homepage h6 {
    font-family: 'Poppins', var(--font-family-secondary);
    font-weight: var(--font-weight-semibold);
    line-height: 1.2;
    margin: 0 0 var(--spacing-md) 0;
  }

  .homepage h1 { font-size: var(--font-size-5xl); font-weight: var(--font-weight-bold); }
  .homepage h2 { font-size: var(--font-size-4xl); }
  .homepage h3 { font-size: var(--font-size-2xl); }
  .homepage h4 { font-size: var(--font-size-xl); }

  .homepage p {
    margin: 0 0 var(--spacing-md) 0;
    line-height: var(--line-height-relaxed);
  }

  /* ===== HOMEPAGE HEADER & NAVIGATION ===== */
  .homepage .header {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    padding: var(--spacing-lg) 0;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    transition: all var(--transition-normal);
  }

  .homepage .nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: var(--max-width-7xl);
    margin: 0 auto;
    padding: 0 var(--spacing-md);
  }

  .homepage .brand-logo {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    text-decoration: none;
  }

  .homepage .brand-text h1 {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-gray-900);
    margin: 0;
    line-height: 1;
  }

  .homepage .brand-subtitle {
    font-size: var(--font-size-sm);
    color: var(--color-primary);
    font-weight: var(--font-weight-medium);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .homepage .nav-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
  }

  .homepage .btn-nav {
    background: var(--color-primary);
    color: var(--color-white);
    padding: var(--spacing-sm) var(--spacing-lg);
    border-radius: var(--border-radius-full);
    text-decoration: none;
    font-weight: var(--font-weight-medium);
    font-size: var(--font-size-sm);
    transition: all var(--transition-normal);
    box-shadow: var(--shadow-sm);
  }

  .homepage .btn-nav:hover {
    background: var(--color-primary-dark);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  /* ===== HOMEPAGE HERO SECTION ===== */
  .homepage .hero-section {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    overflow: hidden;
    padding: calc(var(--spacing-3xl) + 80px) 0 var(--spacing-3xl) 0;
  }

  .homepage .hero-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
  }

  .homepage .hero-pattern {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(30, 41, 59, 0.1) 0%, transparent 50%);
  }

  .homepage .hero-gradient {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg,
      rgba(59, 130, 246, 0.05) 0%,
      rgba(30, 41, 59, 0.1) 50%,
      rgba(59, 130, 246, 0.05) 100%);
  }

  .homepage .hero-content {
    max-width: var(--max-width-5xl);
    margin: 0 auto;
    text-align: center;
    padding: 0 var(--spacing-md);
  }

  .homepage .hero-badge {
    display: inline-block;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    padding: var(--spacing-sm) var(--spacing-lg);
    border-radius: var(--border-radius-full);
    margin-bottom: var(--spacing-xl);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: var(--shadow-lg);
  }

  .homepage .badge-text {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-gray-700);
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .homepage .hero-title {
    font-size: clamp(var(--font-size-4xl), 5vw, var(--font-size-6xl));
    font-weight: var(--font-weight-bold);
    color: var(--color-gray-900);
    margin-bottom: var(--spacing-lg);
    line-height: 1.1;
  }

  .homepage .hero-accent {
    background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .homepage .hero-subtitle {
    font-size: var(--font-size-xl);
    color: var(--color-gray-600);
    margin-bottom: var(--spacing-2xl);
    max-width: var(--max-width-3xl);
    margin-left: auto;
    margin-right: auto;
    line-height: 1.6;
  }

  .homepage .hero-stats {
    display: flex;
    justify-content: center;
    gap: var(--spacing-2xl);
    margin-bottom: var(--spacing-3xl);
    flex-wrap: wrap;
  }

  .homepage .stat-item {
    text-align: center;
  }

  .homepage .stat-number {
    font-size: var(--font-size-3xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-primary);
    display: block;
    line-height: 1;
  }

  .homepage .stat-label {
    font-size: var(--font-size-sm);
    color: var(--color-gray-500);
    font-weight: var(--font-weight-medium);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: var(--spacing-xs);
  }

  .homepage .hero-actions {
    display: flex;
    gap: var(--spacing-lg);
    justify-content: center;
    margin-bottom: var(--spacing-3xl);
    flex-wrap: wrap;
  }

  .homepage .btn {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-lg) var(--spacing-2xl);
    border-radius: var(--border-radius-lg);
    text-decoration: none;
    font-weight: var(--font-weight-semibold);
    font-size: var(--font-size-base);
    transition: all var(--transition-normal);
    cursor: pointer;
    border: 2px solid transparent;
    position: relative;
    overflow: hidden;
  }

  .homepage .btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  .homepage .btn:hover::before {
    left: 100%;
  }

  .homepage .btn-primary {
    background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
    color: var(--color-white);
    box-shadow: var(--shadow-lg);
  }

  .homepage .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-xl);
  }

  .homepage .btn-secondary {
    background: var(--color-white);
    color: var(--color-gray-900);
    border-color: var(--color-gray-200);
    box-shadow: var(--shadow-md);
  }

  .homepage .btn-secondary:hover {
    background: var(--color-gray-50);
    border-color: var(--color-gray-300);
    transform: translateY(-1px);
    box-shadow: var(--shadow-lg);
  }

  .homepage .btn-large {
    padding: var(--spacing-xl) var(--spacing-3xl);
    font-size: var(--font-size-lg);
  }

  .homepage .btn-xl {
    padding: var(--spacing-2xl) var(--spacing-3xl);
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
  }

  .homepage .hero-trust {
    margin-top: var(--spacing-2xl);
  }

  .homepage .trust-logos {
    display: flex;
    justify-content: center;
    gap: var(--spacing-xl);
    flex-wrap: wrap;
    opacity: 0.8;
  }

  .homepage .trust-item {
    font-size: var(--font-size-sm);
    color: var(--color-gray-500);
    font-weight: var(--font-weight-medium);
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  /* ===== HOMEPAGE SECTIONS ===== */
  .homepage .features-section,
  .homepage .testimonials-section,
  .homepage .templates-section,
  .homepage .cta-section {
    padding: var(--spacing-3xl) 0;
  }

  .homepage .section-header {
    text-align: center;
    margin-bottom: var(--spacing-3xl);
  }

  .homepage .section-title {
    font-size: clamp(var(--font-size-3xl), 4vw, var(--font-size-5xl));
    font-weight: var(--font-weight-bold);
    color: var(--color-gray-900);
    margin-bottom: var(--spacing-lg);
    line-height: 1.2;
  }

  .homepage .section-subtitle {
    font-size: var(--font-size-lg);
    color: var(--color-gray-600);
    max-width: var(--max-width-2xl);
    margin: 0 auto;
    line-height: 1.6;
  }

  /* ===== HOMEPAGE FEATURES ===== */
  .homepage .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: var(--spacing-2xl);
    margin-top: var(--spacing-3xl);
  }

  .homepage .feature-card {
    background: var(--color-white);
    padding: var(--spacing-2xl);
    border-radius: var(--border-radius-xl);
    box-shadow: var(--shadow-lg);
    border: 1px solid rgba(255, 255, 255, 0.8);
    transition: all var(--transition-normal);
    position: relative;
    overflow: hidden;
  }

  .homepage .feature-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--color-primary), var(--color-primary-light));
    opacity: 0;
    transition: opacity var(--transition-normal);
  }

  .homepage .feature-card:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-2xl);
  }

  .homepage .feature-card:hover::before {
    opacity: 1;
  }

  .homepage .feature-card-premium {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(30, 41, 59, 0.05));
    border-color: rgba(59, 130, 246, 0.2);
  }

  .homepage .feature-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--spacing-lg);
  }

  .homepage .feature-icon {
    font-size: var(--font-size-4xl);
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--color-primary-light), var(--color-primary));
    border-radius: var(--border-radius-xl);
    color: var(--color-white);
    box-shadow: var(--shadow-lg);
  }

  .homepage .feature-badge {
    background: linear-gradient(135deg, var(--color-accent), var(--color-accent-dark));
    color: var(--color-white);
    padding: var(--spacing-xs) var(--spacing-md);
    border-radius: var(--border-radius-full);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-bold);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .homepage .feature-card h3 {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-gray-900);
    margin-bottom: var(--spacing-md);
  }

  .homepage .feature-card p {
    color: var(--color-gray-600);
    line-height: 1.6;
    margin-bottom: var(--spacing-lg);
  }

  .homepage .feature-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .homepage .feature-list li {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
    color: var(--color-gray-700);
    font-size: var(--font-size-sm);
  }

  /* ===== HOMEPAGE TESTIMONIALS ===== */
  .homepage .testimonials-section {
    background: linear-gradient(135deg, var(--color-gray-50) 0%, var(--color-white) 100%);
  }

  .homepage .testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: var(--spacing-2xl);
    margin-top: var(--spacing-3xl);
  }

  .homepage .testimonial-card {
    background: var(--color-white);
    padding: var(--spacing-2xl);
    border-radius: var(--border-radius-xl);
    box-shadow: var(--shadow-md);
    border: 1px solid var(--color-gray-100);
    position: relative;
  }

  .homepage .testimonial-content {
    margin-bottom: var(--spacing-lg);
  }

  .homepage .testimonial-stars {
    color: var(--color-accent);
    font-size: var(--font-size-lg);
    margin-bottom: var(--spacing-md);
  }

  .homepage .testimonial-card p {
    font-size: var(--font-size-lg);
    font-style: italic;
    color: var(--color-gray-700);
    margin-bottom: var(--spacing-lg);
    position: relative;
  }

  .homepage .testimonial-card p::before {
    content: '"';
    font-size: var(--font-size-4xl);
    color: var(--color-primary);
    position: absolute;
    top: -10px;
    left: -20px;
    font-family: serif;
  }

  .homepage .testimonial-author {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }

  .homepage .author-avatar {
    width: 50px;
    height: 50px;
    border-radius: var(--border-radius-full);
    background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
    color: var(--color-white);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: var(--font-weight-bold);
    font-size: var(--font-size-lg);
  }

  .homepage .author-info h4 {
    margin: 0;
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-semibold);
    color: var(--color-gray-900);
  }

  .homepage .author-title {
    font-size: var(--font-size-sm);
    color: var(--color-gray-500);
    margin: 0;
    font-weight: var(--font-weight-medium);
  }

  /* ===== HOMEPAGE TEMPLATES ===== */
  .homepage .templates-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: var(--spacing-xl);
    margin-top: var(--spacing-3xl);
  }

  .homepage .template-card {
    background: var(--color-white);
    border-radius: var(--border-radius-xl);
    box-shadow: var(--shadow-md);
    border: 1px solid var(--color-gray-100);
    overflow: hidden;
    transition: all var(--transition-normal);
    position: relative;
  }

  .homepage .template-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl);
    border-color: var(--color-primary-light);
  }

  .homepage .template-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-lg);
    background: linear-gradient(135deg, var(--color-gray-50), var(--color-white));
    border-bottom: 1px solid var(--color-gray-100);
  }

  .homepage .template-icon {
    font-size: var(--font-size-2xl);
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-white);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-sm);
  }

  .homepage .template-badge {
    background: linear-gradient(135deg, var(--color-success), var(--color-success));
    color: var(--color-white);
    padding: var(--spacing-xs) var(--spacing-md);
    border-radius: var(--border-radius-full);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-bold);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .homepage .template-card-premium .template-badge {
    background: linear-gradient(135deg, var(--color-accent), var(--color-accent-dark));
  }

  .homepage .template-card-specialized .template-badge {
    background: linear-gradient(135deg, var(--color-warning), var(--color-warning));
  }

  .homepage .template-card h3 {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold);
    color: var(--color-gray-900);
    margin-bottom: var(--spacing-md);
    padding: var(--spacing-lg);
  }

  .homepage .template-card p {
    color: var(--color-gray-600);
    line-height: 1.6;
    padding: 0 var(--spacing-lg);
    margin-bottom: var(--spacing-lg);
  }

  .homepage .template-features {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
    padding: 0 var(--spacing-lg);
    margin-bottom: var(--spacing-lg);
  }

  .homepage .feature-tag {
    background: var(--color-gray-100);
    color: var(--color-gray-700);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--border-radius-md);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
  }

  .homepage .template-actions {
    padding: var(--spacing-lg);
    border-top: 1px solid var(--color-gray-100);
    display: flex;
    gap: var(--spacing-sm);
    flex-wrap: wrap;
  }

  .homepage .template-actions .btn-outline {
    flex: 1;
    min-width: 120px;
    text-align: center;
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--font-size-sm);
    border-color: var(--color-gray-200);
    color: var(--color-gray-700);
    transition: all var(--transition-normal);
  }

  .homepage .template-actions .btn-outline:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
    background: rgba(59, 130, 246, 0.05);
  }

  /* ===== HOMEPAGE CTA SECTION ===== */
  .homepage .cta-section {
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
    color: var(--color-white);
    text-align: center;
    padding: var(--spacing-3xl) 0;
  }

  .homepage .cta-content h2 {
    font-size: clamp(var(--font-size-3xl), 4vw, var(--font-size-5xl));
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--spacing-lg);
    color: var(--color-white);
  }

  .homepage .cta-content p {
    font-size: var(--font-size-xl);
    margin-bottom: var(--spacing-2xl);
    opacity: 0.9;
    max-width: var(--max-width-2xl);
    margin-left: auto;
    margin-right: auto;
  }

  .homepage .cta-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-xl);
  }

  .homepage .cta-features {
    display: flex;
    gap: var(--spacing-xl);
    justify-content: center;
    flex-wrap: wrap;
    margin-top: var(--spacing-xl);
  }

  .homepage .cta-feature {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    font-size: var(--font-size-sm);
    opacity: 0.9;
  }

  /* ===== HOMEPAGE FOOTER ===== */
  .homepage .footer {
    background: var(--color-gray-900);
    color: var(--color-white);
    padding: var(--spacing-3xl) 0 var(--spacing-xl) 0;
  }

  .homepage .footer-content {
    display: grid;
    grid-template-columns: 2fr 3fr;
    gap: var(--spacing-3xl);
    margin-bottom: var(--spacing-2xl);
  }

  .homepage .footer-brand {
    max-width: 300px;
  }

  .homepage .footer-brand .brand-logo {
    margin-bottom: var(--spacing-lg);
  }

  .homepage .footer-brand .brand-title {
    color: var(--color-white);
    font-size: var(--font-size-lg);
  }

  .homepage .footer-description {
    color: var(--color-gray-400);
    line-height: 1.6;
    margin-bottom: var(--spacing-lg);
  }

  .homepage .footer-social {
    display: flex;
    gap: var(--spacing-md);
  }

  .homepage .social-link {
    width: 40px;
    height: 40px;
    border-radius: var(--border-radius-full);
    background: var(--color-gray-800);
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    transition: all var(--transition-normal);
    font-size: var(--font-size-lg);
  }

  .homepage .social-link:hover {
    background: var(--color-primary);
    transform: translateY(-2px);
  }

  .homepage .footer-links {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-xl);
  }

  .homepage .footer-section h4 {
    color: var(--color-white);
    margin-bottom: var(--spacing-lg);
    font-size: var(--font-size-base);
  }

  .homepage .footer-section a {
    color: var(--color-gray-400);
    text-decoration: none;
    display: block;
    margin-bottom: var(--spacing-sm);
    transition: color var(--transition-normal);
  }

  .homepage .footer-section a:hover {
    color: var(--color-primary);
  }

  .homepage .footer-bottom {
    border-top: 1px solid var(--color-gray-800);
    padding-top: var(--spacing-xl);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--spacing-md);
  }

  .homepage .footer-legal {
    display: flex;
    gap: var(--spacing-lg);
  }

  .homepage .footer-legal a {
    color: var(--color-gray-500);
    text-decoration: none;
    font-size: var(--font-size-sm);
    transition: color var(--transition-normal);
  }

  .homepage .footer-legal a:hover {
    color: var(--color-gray-300);
  }

  /* ===== DARK THEME ===== */
  [data-theme="dark"] {
    --color-gray-50: #0f172a;
    --color-gray-100: #1e293b;
    --color-gray-900: #f8fafc;
  }

  [data-theme="dark"] .header {
    background: rgba(15, 23, 42, 0.95);
    border-color: rgba(255, 255, 255, 0.1);
  }

  [data-theme="dark"] .feature-card,
  [data-theme="dark"] .testimonial-card,
  [data-theme="dark"] .template-card {
    background: var(--color-gray-800);
    border-color: var(--color-gray-700);
    color: var(--color-white);
  }

  [data-theme="dark"] .feature-card h3,
  [data-theme="dark"] .template-card h3 {
    color: var(--color-white);
  }

  [data-theme="dark"] .feature-card p,
  [data-theme="dark"] .template-card p {
    color: var(--color-gray-300);
  }

  /* ===== RESPONSIVE DESIGN ===== */
  @media (max-width: 1024px) {
    .nav-container {
      padding: 0 var(--spacing-lg);
    }

    .features-grid,
    .testimonials-grid {
      grid-template-columns: 1fr;
    }

    .footer-content {
      grid-template-columns: 1fr;
      gap: var(--spacing-xl);
    }

    .footer-links {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .hero-stats {
      gap: var(--spacing-lg);
    }

    .hero-actions {
      flex-direction: column;
      align-items: center;
    }

    .templates-grid {
      grid-template-columns: 1fr;
    }

    .cta-features {
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .footer-bottom {
      flex-direction: column;
      text-align: center;
      gap: var(--spacing-lg);
    }

    .footer-legal {
      justify-content: center;
    }
  }

  @media (max-width: 640px) {
    .hero-title {
      font-size: var(--font-size-4xl);
    }

    .section-title {
      font-size: var(--font-size-3xl);
    }

    .trust-logos {
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .feature-card,
    .testimonial-card {
      padding: var(--spacing-lg);
    }

    .btn {
      padding: var(--spacing-md) var(--spacing-lg);
      font-size: var(--font-size-sm);
    }
  }

  /* ===== ANIMATIONS ===== */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .fade-in-up {
    animation: fadeInUp 0.6s ease-out;
  }

  /* Stagger animations */
  .feature-card:nth-child(1) { animation-delay: 0.1s; }
  .feature-card:nth-child(2) { animation-delay: 0.2s; }
  .feature-card:nth-child(3) { animation-delay: 0.3s; }
  .feature-card:nth-child(4) { animation-delay: 0.4s; }
  .feature-card:nth-child(5) { animation-delay: 0.5s; }
  .feature-card:nth-child(6) { animation-delay: 0.6s; }

  /* ===== UTILITIES ===== */
  .container {
    width: 100%;
    max-width: var(--max-width-7xl);
    margin: 0 auto;
    padding: 0 var(--spacing-md);
  }

  @media (min-width: 640px) {
    .container {
      padding: 0 var(--spacing-lg);
    }
  }

  @media (min-width: 1024px) {
    .container {
      padding: 0 var(--spacing-xl);
    }
  }
`;

document.head.appendChild(style);

// Smooth scrolling for anchor links
document.addEventListener('click', event => {
  const link = (event.target as Element)?.closest('a[href^="#"]');
  if (link) {
    event.preventDefault();
    const target = document.querySelector(link.getAttribute('href')!);
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
  const templateLink = (event.target as Element)?.closest('a[href*="templates"]') as HTMLElement;
  if (templateLink) {
    templateLink.style.opacity = '0.7';
    templateLink.textContent += ' (Loading...)';
  }
});

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('✅ Service Worker registered:', registration.scope);

        // Handle service worker updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available, notify user
                if (confirm('New content is available. Reload to get the latest version?')) {
                  window.location.reload();
                }
              }
            });
          }
        });
      })
      .catch(error => {
        console.error('❌ Service Worker registration failed:', error);
      });
  });
}

// Performance monitoring in development
if (import.meta.env?.DEV) {
  console.log('🚀 Production Ready Templates initialized');
  console.log('📊 Performance monitoring enabled');

  // Log page load performance
  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    console.log(`⚡ Page loaded in ${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`);
  });
}
