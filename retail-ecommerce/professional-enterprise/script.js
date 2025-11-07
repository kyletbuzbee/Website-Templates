// Enterprise Commerce Pro - Advanced B2B E-commerce Template - JavaScript
// Handles mobile navigation, analytics simulation, and enterprise features

class EnterpriseCommerceApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupScrollEffects();
        this.setupAnalyticsDemo();
        this.setupEnterpriseFeatures();
    }

    // Mobile hamburger menu toggle
    setupMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';

                // Toggle aria-expanded
                hamburger.setAttribute('aria-expanded', !isExpanded);

                // Toggle menu visibility
                navMenu.classList.toggle('nav-menu-open');

                // Animate hamburger lines
                const lines = hamburger.querySelectorAll('.hamburger-line');
                if (!isExpanded) {
                    // Transform to X
                    lines[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                    lines[1].style.opacity = '0';
                    lines[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
                } else {
                    // Reset to hamburger
                    lines[0].style.transform = 'none';
                    lines[1].style.opacity = '1';
                    lines[2].style.transform = 'none';
                }
            });

            // Close menu when clicking on a link
            navMenu.addEventListener('click', (e) => {
                if (e.target.classList.contains('nav-link')) {
                    hamburger.setAttribute('aria-expanded', 'false');
                    navMenu.classList.remove('nav-menu-open');

                    // Reset hamburger animation
                    const lines = hamburger.querySelectorAll('.hamburger-line');
                    lines[0].style.transform = 'none';
                    lines[1].style.opacity = '1';
                    lines[2].style.transform = 'none';
                }
            });
        }
    }

    // Smooth scrolling for navigation links
    setupSmoothScrolling() {
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();

                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Add scroll effects and animations
    setupScrollEffects() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll('.service-card, .metric-card, .about-image');
        animateElements.forEach(el => observer.observe(el));

        // Header background on scroll
        const header = document.querySelector('.header');
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > 100) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }

            lastScrollY = currentScrollY;
        });
    }

    // Simulate analytics dashboard updates
    setupAnalyticsDemo() {
        const metrics = document.querySelectorAll('.metric-card');

        // Simulate real-time updates every 5 seconds
        setInterval(() => {
            metrics.forEach(metric => {
                const valueElement = metric.querySelector('.metric-value');
                const changeElement = metric.querySelector('.metric-change');

                if (valueElement && changeElement) {
                    // Simulate small fluctuations
                    const currentValue = parseFloat(valueElement.textContent.replace(/[$,%]/g, ''));
                    const change = (Math.random() - 0.5) * 0.1; // +/- 5%
                    const newValue = currentValue * (1 + change);

                    // Update display based on metric type
                    if (valueElement.textContent.includes('$')) {
                        valueElement.textContent = `$${(newValue / 1000000).toFixed(1)}M`;
                    } else if (valueElement.textContent.includes('%')) {
                        valueElement.textContent = `${newValue.toFixed(1)}%`;
                    } else {
                        valueElement.textContent = Math.round(newValue);
                    }

                    // Update change indicator
                    if (change > 0) {
                        changeElement.className = 'metric-change positive';
                        changeElement.textContent = `+${(change * 100).toFixed(1)}%`;
                    } else {
                        changeElement.className = 'metric-change negative';
                        changeElement.textContent = `${(change * 100).toFixed(1)}%`;
                    }
                }
            });
        }, 5000);
    }

    // Enterprise-specific features
    setupEnterpriseFeatures() {
        this.setupClientPortal();
        this.setupDemoRequest();
    }

    setupClientPortal() {
        const portalBtn = document.querySelector('.btn-secondary');
        if (portalBtn && portalBtn.textContent.includes('Client Portal')) {
            portalBtn.addEventListener('click', () => {
                alert('Enterprise Client Portal - This would redirect to a secure login page for existing clients.');
            });
        }
    }

    setupDemoRequest() {
        // Demo request button already handled by form submission
        // Additional enterprise-specific logic can be added here
    }
}

// Form handling with enterprise validation
class EnterpriseContactForm {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            this.setupFormValidation();
            this.setupEnterpriseValidation();
        }
    }

    setupFormValidation() {
        const inputs = this.form.querySelectorAll('input, select, textarea');

        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    setupEnterpriseValidation() {
        // Additional enterprise-specific validation
        const emailInput = this.form.querySelector('#email');
        const companyInput = this.form.querySelector('#company');

        if (emailInput) {
            emailInput.addEventListener('blur', () => this.validateBusinessEmail(emailInput));
        }

        if (companyInput) {
            companyInput.addEventListener('blur', () => this.validateCompanyName(companyInput));
        }
    }

    validateBusinessEmail(field) {
        const value = field.value.trim();
        const businessEmailRegex = /^[a-zA-Z0-9._%+-]+@(?!gmail\.com|yahoo\.com|hotmail\.com|outlook\.com)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (value && !businessEmailRegex.test(value)) {
            this.showFieldError(field, 'Please use a business email address');
            return false;
        }

        return true;
    }

    validateCompanyName(field) {
        const value = field.value.trim();

        if (value && value.length < 2) {
            this.showFieldError(field, 'Company name must be at least 2 characters');
            return false;
        }

        return true;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch (field.name) {
            case 'firstName':
            case 'lastName':
                if (!value) {
                    isValid = false;
                    errorMessage = `${field.name === 'firstName' ? 'First' : 'Last'} name is required`;
                } else if (value.length < 2) {
                    isValid = false;
                    errorMessage = `${field.name === 'firstName' ? 'First' : 'Last'} name must be at least 2 characters`;
                }
                break;

            case 'company':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Company name is required';
                }
                break;

            case 'jobTitle':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Job title is required';
                }
                break;

            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    isValid = false;
                    errorMessage = 'Business email is required';
                } else if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                } else if (!this.validateBusinessEmail(field)) {
                    isValid = false;
                }
                break;

            case 'phone':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Phone number is required';
                } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-\(\)]/g, ''))) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number';
                }
                break;
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('field-error');

        let errorElement = field.parentNode.querySelector('.field-error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error-message';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    clearFieldError(field) {
        field.classList.remove('field-error');

        const errorElement = field.parentNode.querySelector('.field-error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(this.form);
        let isFormValid = true;

        // Validate all fields
        const inputs = this.form.querySelectorAll('input[required], select[required], textarea[required]');
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            // Simulate enterprise demo request
            const submitBtn = this.form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = 'Processing Enterprise Demo Request...';
            submitBtn.disabled = true;

            // Simulate API call with enterprise processing time
            setTimeout(() => {
                submitBtn.textContent = 'Demo Request Submitted!';
                submitBtn.style.backgroundColor = '#10b981';

                // Show enterprise follow-up message
                setTimeout(() => {
                    alert('Thank you for your interest in Enterprise Commerce Pro! Our enterprise solutions team will contact you within 2 business hours to schedule your personalized demo.');

                    this.form.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.backgroundColor = '';

                    // Clear any remaining errors
                    this.form.querySelectorAll('.field-error').forEach(field => {
                        this.clearFieldError(field);
                    });
                }, 2000);
            }, 3000);
        }
    }
}

// Enterprise Analytics Dashboard
class EnterpriseAnalytics {
    constructor() {
        this.init();
    }

    init() {
        this.setupMetricAnimations();
        this.setupRealTimeUpdates();
    }

    setupMetricAnimations() {
        const metricCards = document.querySelectorAll('.metric-card');

        metricCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.2}s`;
            card.classList.add('animate-in');
        });
    }

    setupRealTimeUpdates() {
        // Simulate real-time data updates for enterprise dashboard
        setInterval(() => {
            this.updateRandomMetric();
        }, 8000);
    }

    updateRandomMetric() {
        const metrics = document.querySelectorAll('.metric-card');
        if (metrics.length === 0) return;

        const randomMetric = metrics[Math.floor(Math.random() * metrics.length)];
        const valueElement = randomMetric.querySelector('.metric-value');

        if (valueElement) {
            // Add a subtle glow effect for updated metrics
            randomMetric.style.boxShadow = '0 0 20px rgba(37, 99, 235, 0.3)';
            setTimeout(() => {
                randomMetric.style.boxShadow = '';
            }, 1000);
        }
    }
}

// Initialize the enterprise application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EnterpriseCommerceApp();
    new EnterpriseContactForm();
    new EnterpriseAnalytics();
});

// Add CSS for mobile menu and enterprise animations
const additionalStyles = `
<style>
/* Mobile Navigation */
@media (max-width: 768px) {
    .hamburger {
        display: flex;
    }

    .nav-menu {
        position: fixed;
        top: 100%;
        left: 0;
        right: 0;
        background-color: white;
        flex-direction: column;
        padding: 2rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        transform: translateY(-100%);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
    }

    .nav-menu-open {
        transform: translateY(0);
        opacity: 1;
        visibility: visible;
    }

    .nav-link {
        padding: 1rem 0;
        border-bottom: 1px solid #e2e8f0;
        font-size: 1.125rem;
    }

    .nav-link:last-child {
        border-bottom: none;
    }
}

/* Header scroll effect */
.header-scrolled {
    background-color: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

/* Enterprise Analytics Styles */
.analytics-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 3rem;
    margin-top: 3rem;
}

.analytics-metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
}

.metric-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
    opacity: 0;
    transform: translateY(20px);
}

.metric-card.animate-in {
    opacity: 1;
    transform: translateY(0);
}

.metric-value {
    font-size: 2.5rem;
    font-weight: 700;
    display: block;
    margin-bottom: 0.5rem;
}

.metric-label {
    font-size: 1rem;
    opacity: 0.9;
    margin-bottom: 1rem;
}

.metric-change {
    font-size: 0.875rem;
    font-weight: 600;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
}

.metric-change.positive {
    background-color: rgba(16, 185, 129, 0.2);
    color: #10b981;
}

.metric-change.negative {
    background-color: rgba(239, 68, 68, 0.2);
    color: #ef4444;
}

.metric-change.neutral {
    background-color: rgba(156, 163, 175, 0.2);
    color: #9ca3af;
}

.analytics-features {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.analytics-features .feature-item h4 {
    color: var(--text-color);
    margin-bottom: 0.5rem;
}

.analytics-features .feature-item p {
    color: var(--text-light);
    line-height: 1.6;
}

/* Enterprise Features */
.enterprise-features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.enterprise-features .feature-item {
    background-color: var(--bg-light);
    padding: 1.5rem;
    border-radius: 8px;
    border-left: 4px solid var(--primary-color);
}

.enterprise-features .feature-item h4 {
    color: var(--primary-color);
    margin-bottom: 0.5rem;
    font-size: 1.125rem;
}

.enterprise-features .feature-item p {
    color: var(--text-light);
    margin: 0;
}

/* Form validation styles */
.field-error {
    border-color: #ef4444 !important;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
}

.field-error-message {
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: 0.5rem;
    font-weight: 500;
}

/* Animation classes */
@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(50px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.animate-in {
    animation: slideInRight 0.6s ease-out forwards;
}

/* Service card hover effects */
.service-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.service-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.service-card:hover .service-icon {
    transform: scale(1.1);
}

/* Button hover effects */
.btn {
    position: relative;
    overflow: hidden;
}

.btn::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
}

.btn:hover::before {
    width: 300px;
    height: 300px;
}

/* Loading animation for form submission */
.btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

/* Footer certifications */
.footer-certifications {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
    flex-wrap: wrap;
}

.certification {
    background-color: rgba(255, 255, 255, 0.1);
    color: #94a3b8;
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* Form row layout for responsive design */
.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

@media (max-width: 640px) {
    .form-row {
        grid-template-columns: 1fr;
    }
}

/* Enterprise-specific responsive adjustments */
@media (max-width: 1024px) {
    .analytics-content {
        grid-template-columns: 1fr;
        gap: 2rem;
    }

    .enterprise-features {
        grid-template-columns: 1fr;
    }
}
</style>
`;

// Inject additional styles
document.head.insertAdjacentHTML('beforeend', additionalStyles);
