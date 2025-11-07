// Elite Fitness Pro - Enterprise Wellness Template - JavaScript
// Handles mobile navigation, analytics simulation, and enterprise features

class EliteFitnessApp {
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

    // Simulate enterprise analytics dashboard updates
    setupAnalyticsDemo() {
        const metrics = document.querySelectorAll('.metric-card');

        // Simulate real-time updates every 5 seconds
        setInterval(() => {
            metrics.forEach(metric => {
                const valueElement = metric.querySelector('.metric-value');
                const changeElement = metric.querySelector('.metric-change');

                if (valueElement && changeElement) {
                    // Simulate small fluctuations for enterprise metrics
                    const currentValue = parseFloat(valueElement.textContent.replace(/[$,%]/g, ''));
                    const change = (Math.random() - 0.5) * 0.05; // +/- 2.5% for stability
                    const newValue = Math.max(0, currentValue * (1 + change));

                    // Update display based on metric type
                    if (valueElement.textContent.includes('$')) {
                        valueElement.textContent = `$${(newValue / 1000000).toFixed(1)}M`;
                    } else if (valueElement.textContent.includes('%')) {
                        valueElement.textContent = `${newValue.toFixed(1)}%`;
                    } else {
                        valueElement.textContent = newValue.toFixed(1);
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
        this.setupCorporatePortal();
        this.setupDemoRequest();
        this.setupMetricAnimations();
    }

    setupCorporatePortal() {
        const portalBtn = document.querySelector('.btn-secondary');
        if (portalBtn && portalBtn.textContent.includes('Corporate Portal')) {
            portalBtn.addEventListener('click', () => {
                this.showCorporatePortalModal();
            });
        }
    }

    showCorporatePortalModal() {
        // Create modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease-out;
        `;

        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.style.cssText = `
            background: white;
            border-radius: 16px;
            padding: 2.5rem;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease-out;
            position: relative;
        `;

        modalContent.innerHTML = `
            <button class="modal-close" style="
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #6b7280;
                padding: 0.5rem;
                border-radius: 50%;
                transition: all 0.2s;
            ">&times;</button>

            <div style="text-align: center; margin-bottom: 2rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🏢</div>
                <h2 style="color: #1e40af; margin-bottom: 0.5rem; font-size: 1.5rem;">Enterprise Corporate Portal</h2>
                <p style="color: #6b7280; font-size: 0.9rem;">Secure access for enterprise clients</p>
            </div>

            <div style="margin-bottom: 2rem;">
                <h3 style="color: #1f2937; margin-bottom: 1rem; font-size: 1.1rem;">Portal Features Include:</h3>
                <ul style="list-style: none; padding: 0;">
                    <li style="display: flex; align-items: center; margin-bottom: 0.75rem; color: #374151;">
                        <span style="color: #10b981; margin-right: 0.75rem; font-size: 1.2rem;">✓</span>
                        Advanced Analytics Dashboard
                    </li>
                    <li style="display: flex; align-items: center; margin-bottom: 0.75rem; color: #374151;">
                        <span style="color: #10b981; margin-right: 0.75rem; font-size: 1.2rem;">✓</span>
                        User Management & Permissions
                    </li>
                    <li style="display: flex; align-items: center; margin-bottom: 0.75rem; color: #374151;">
                        <span style="color: #10b981; margin-right: 0.75rem; font-size: 1.2rem;">✓</span>
                        Custom Reporting Tools
                    </li>
                    <li style="display: flex; align-items: center; margin-bottom: 0.75rem; color: #374151;">
                        <span style="color: #10b981; margin-right: 0.75rem; font-size: 1.2rem;">✓</span>
                        Real-time Health Metrics
                    </li>
                    <li style="display: flex; align-items: center; margin-bottom: 0.75rem; color: #374151;">
                        <span style="color: #10b981; margin-right: 0.75rem; font-size: 1.2rem;">✓</span>
                        API Integration Hub
                    </li>
                </ul>
            </div>

            <div style="background: #f8fafc; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
                <h4 style="color: #1e40af; margin-bottom: 0.5rem; font-size: 1rem;">Enterprise Access Required</h4>
                <p style="color: #6b7280; font-size: 0.85rem; margin: 0;">
                    This portal is exclusively for existing Elite Fitness Pro enterprise clients. Contact our enterprise sales team to learn about implementation and access options.
                </p>
            </div>

            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button class="modal-btn modal-btn-primary" style="
                    background: #1e40af;
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                ">Contact Sales</button>
                <button class="modal-btn modal-btn-secondary" style="
                    background: white;
                    color: #1e40af;
                    border: 2px solid #1e40af;
                    padding: 0.75rem 1.5rem;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                ">Learn More</button>
            </div>
        `;

        // Add modal to page
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);

        // Event listeners
        const closeBtn = modalContent.querySelector('.modal-close');
        const contactBtn = modalContent.querySelector('.modal-btn-primary');
        const learnMoreBtn = modalContent.querySelector('.modal-btn-secondary');

        const closeModal = () => {
            modalOverlay.style.animation = 'fadeOut 0.3s ease-in';
            modalContent.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(modalOverlay);
            }, 300);
        };

        closeBtn.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });

        contactBtn.addEventListener('click', () => {
            closeModal();
            // Scroll to contact section
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });

        learnMoreBtn.addEventListener('click', () => {
            closeModal();
            // Could redirect to enterprise page or show more info
        });

        // Add modal animations
        const modalStyles = document.createElement('style');
        modalStyles.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(-50px) scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }

            @keyframes slideOut {
                from {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
                to {
                    opacity: 0;
                    transform: translateY(-50px) scale(0.9);
                }
            }

            .modal-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }

            .modal-btn-primary:hover {
                background: #1d4ed8;
            }

            .modal-btn-secondary:hover {
                background: #f8fafc;
            }
        `;
        document.head.appendChild(modalStyles);
    }

    setupDemoRequest() {
        // Demo request button already handled by form submission
        // Additional enterprise-specific logic can be added here
    }

    setupMetricAnimations() {
        const metricCards = document.querySelectorAll('.metric-card');

        metricCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.3}s`;
            card.classList.add('animate-in');
        });
    }
}

// Enterprise Contact Form with advanced validation
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
        const businessEmailRegex = /^[a-zA-Z0-9._%+-]+@(?!gmail\.com|yahoo\.com|hotmail\.com|outlook\.com|icloud\.com|aol\.com)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (value && !businessEmailRegex.test(value)) {
            this.showFieldError(field, 'Please use a business email address (Gmail, Yahoo, etc. not accepted for enterprise accounts)');
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

        // Check for common non-business entries
        const nonBusinessTerms = ['home', 'personal', 'individual', 'self', 'n/a', 'none'];
        if (nonBusinessTerms.some(term => value.toLowerCase().includes(term))) {
            this.showFieldError(field, 'Please enter a valid company or organization name');
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
                    errorMessage = 'Company name is required for enterprise solutions';
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
                    errorMessage = 'Phone number is required for enterprise consultations';
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
            // Simulate enterprise consultation request
            const submitBtn = this.form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = 'Processing Enterprise Consultation Request...';
            submitBtn.disabled = true;

            // Simulate enterprise processing time
            setTimeout(() => {
                submitBtn.textContent = 'Consultation Request Submitted!';
                submitBtn.style.backgroundColor = '#10b981';

                // Show enterprise follow-up message
                setTimeout(() => {
                    alert('Thank you for your interest in Elite Fitness Pro enterprise solutions! Our enterprise wellness specialists will contact you within 4 business hours to schedule your personalized consultation. You will receive a confirmation email with next steps and preliminary ROI analysis.');

                    this.form.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.backgroundColor = '';

                    // Clear any remaining errors
                    this.form.querySelectorAll('.field-error').forEach(field => {
                        this.clearFieldError(field);
                    });
                }, 2000);
            }, 4000);
        }
    }
}

// Enterprise Analytics Dashboard
class EnterpriseAnalytics {
    constructor() {
        this.init();
    }

    init() {
        this.setupRealTimeUpdates();
        this.setupInteractiveMetrics();
    }

    setupRealTimeUpdates() {
        // Simulate real-time data updates for enterprise dashboard
        setInterval(() => {
            this.updateRandomMetric();
        }, 10000);
    }

    updateRandomMetric() {
        const metrics = document.querySelectorAll('.metric-card');
        if (metrics.length === 0) return;

        const randomMetric = metrics[Math.floor(Math.random() * metrics.length)];
        const valueElement = randomMetric.querySelector('.metric-value');

        if (valueElement) {
            // Add a subtle enterprise-style glow effect for updated metrics
            randomMetric.style.boxShadow = '0 0 30px rgba(30, 64, 175, 0.4)';
            setTimeout(() => {
                randomMetric.style.boxShadow = '';
            }, 2000);
        }
    }

    setupInteractiveMetrics() {
        const metricCards = document.querySelectorAll('.metric-card');

        metricCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px) scale(1.02)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
}

// Initialize the enterprise application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EliteFitnessApp();
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
    backdrop-filter: blur(20px);
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

/* Enterprise Analytics Styles */
.analytics-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 4rem;
    margin-top: 4rem;
}

.analytics-metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
}

.metric-card {
    background: linear-gradient(135deg, #1e40af 0%, #3730a3 100%);
    color: white;
    padding: 2.5rem 2rem;
    border-radius: 16px;
    text-align: center;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
    opacity: 0;
    transform: translateY(30px);
    position: relative;
    overflow: hidden;
    cursor: pointer;
}

.metric-card::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    opacity: 0;
    transition: var(--transition);
}

.metric-card:hover::before {
    opacity: 1;
}

.metric-card.animate-in {
    opacity: 1;
    transform: translateY(0);
}

.metric-value {
    font-size: 3rem;
    font-weight: 800;
    display: block;
    margin-bottom: 0.75rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.metric-label {
    font-size: 1.125rem;
    opacity: 0.9;
    margin-bottom: 1.5rem;
    font-weight: 500;
}

.metric-change {
    font-size: 0.875rem;
    font-weight: 700;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    display: inline-block;
}

.metric-change.positive {
    background-color: rgba(34, 197, 94, 0.2);
    color: #22c55e;
    border: 1px solid rgba(34, 197, 94, 0.3);
}

.metric-change.negative {
    background-color: rgba(239, 68, 68, 0.2);
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.3);
}

.metric-change.neutral {
    background-color: rgba(156, 163, 175, 0.2);
    color: #9ca3af;
    border: 1px solid rgba(156, 163, 175, 0.3);
}

.analytics-features {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
}

.analytics-features .feature-item h4 {
    color: var(--text-color);
    margin-bottom: 1rem;
    font-size: 1.25rem;
    font-weight: 700;
}

.analytics-features .feature-item p {
    color: var(--text-light);
    line-height: 1.7;
    font-size: 1rem;
}

/* Enterprise Features */
.enterprise-features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
}

.enterprise-features .feature-item {
    background-color: white;
    padding: 2rem;
    border-radius: 12px;
    border-left: 5px solid var(--primary-color);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    transition: var(--transition);
}

.enterprise-features .feature-item:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.enterprise-features .feature-item h4 {
    color: var(--primary-color);
    margin-bottom: 1rem;
    font-size: 1.25rem;
    font-weight: 700;
}

.enterprise-features .feature-item p {
    color: var(--text-light);
    margin: 0;
    line-height: 1.6;
}

/* Form validation styles */
.field-error {
    border-color: #ef4444 !important;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
}

.field-error-message {
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: 0.75rem;
    font-weight: 600;
    display: block;
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
    animation: slideInRight 0.8s ease-out forwards;
}

/* Service card hover effects */
.service-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.service-card:hover {
    transform: translateY(-8px);
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
    gap: 1.5rem;
    margin-top: 2rem;
    flex-wrap: wrap;
}

.certification {
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    color: #e2e8f0;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Form row layout for responsive design */
.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
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
        gap: 3rem;
    }

    .enterprise-features {
        grid-template-columns: 1fr;
    }
}

/* Enterprise-specific enhancements */
.hero-accent {
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.service-features {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 2rem;
}

.feature-tag {
    background: linear-gradient(135deg, var(--primary-color), #3730a3);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 600;
    display: inline-block;
    margin: 0.25rem;
}
</style>
`;

// Inject additional styles
document.head.insertAdjacentHTML('beforeend', additionalStyles);
