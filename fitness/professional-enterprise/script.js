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

        // Header background on scroll using IntersectionObserver
        const header = document.querySelector('.header');

        // Create a sentinel element at the top of the page
        const scrollSentinel = document.createElement('div');
        scrollSentinel.style.cssText = `
            position: absolute;
            top: 100px;
            left: 0;
            right: 0;
            height: 1px;
            pointer-events: none;
        `;
        document.body.insertBefore(scrollSentinel, document.body.firstChild);

        // Use IntersectionObserver for header styling
        const headerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    header.classList.remove('header-scrolled');
                } else {
                    header.classList.add('header-scrolled');
                }
            });
        }, { threshold: 0 });

        headerObserver.observe(scrollSentinel);
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

        // Create modal content safely using DOM methods
        const closeBtn = document.createElement('button');
        closeBtn.className = 'modal-close';
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
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
        `;

        const headerDiv = document.createElement('div');
        headerDiv.style.cssText = 'text-align: center; margin-bottom: 2rem;';

        const iconDiv = document.createElement('div');
        iconDiv.textContent = '🏢';
        iconDiv.style.cssText = 'font-size: 3rem; margin-bottom: 1rem;';

        const titleH2 = document.createElement('h2');
        titleH2.textContent = 'Enterprise Corporate Portal';
        titleH2.style.cssText = 'color: #1e40af; margin-bottom: 0.5rem; font-size: 1.5rem;';

        const subtitleP = document.createElement('p');
        subtitleP.textContent = 'Secure access for enterprise clients';
        subtitleP.style.cssText = 'color: #6b7280; font-size: 0.9rem;';

        headerDiv.appendChild(iconDiv);
        headerDiv.appendChild(titleH2);
        headerDiv.appendChild(subtitleP);

        const featuresDiv = document.createElement('div');
        featuresDiv.style.cssText = 'margin-bottom: 2rem;';

        const featuresTitle = document.createElement('h3');
        featuresTitle.textContent = 'Portal Features Include:';
        featuresTitle.style.cssText = 'color: #1f2937; margin-bottom: 1rem; font-size: 1.1rem;';

        const featuresList = document.createElement('ul');
        featuresList.style.cssText = 'list-style: none; padding: 0;';

        const features = [
            'Advanced Analytics Dashboard',
            'User Management & Permissions',
            'Custom Reporting Tools',
            'Real-time Health Metrics',
            'API Integration Hub'
        ];

        features.forEach(feature => {
            const li = document.createElement('li');
            li.style.cssText = 'display: flex; align-items: center; margin-bottom: 0.75rem; color: #374151;';

            const checkSpan = document.createElement('span');
            checkSpan.textContent = '✓';
            checkSpan.style.cssText = 'color: #10b981; margin-right: 0.75rem; font-size: 1.2rem;';

            const textSpan = document.createTextNode(feature);

            li.appendChild(checkSpan);
            li.appendChild(textSpan);
            featuresList.appendChild(li);
        });

        featuresDiv.appendChild(featuresTitle);
        featuresDiv.appendChild(featuresList);

        const noticeDiv = document.createElement('div');
        noticeDiv.style.cssText = 'background: #f8fafc; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;';

        const noticeTitle = document.createElement('h4');
        noticeTitle.textContent = 'Enterprise Access Required';
        noticeTitle.style.cssText = 'color: #1e40af; margin-bottom: 0.5rem; font-size: 1rem;';

        const noticeText = document.createElement('p');
        noticeText.textContent = 'This portal is exclusively for existing Elite Fitness Pro enterprise clients. Contact our enterprise sales team to learn about implementation and access options.';
        noticeText.style.cssText = 'color: #6b7280; font-size: 0.85rem; margin: 0;';

        noticeDiv.appendChild(noticeTitle);
        noticeDiv.appendChild(noticeText);

        const buttonsDiv = document.createElement('div');
        buttonsDiv.style.cssText = 'display: flex; gap: 1rem; justify-content: center;';

        const contactBtn = document.createElement('button');
        contactBtn.className = 'modal-btn modal-btn-primary';
        contactBtn.textContent = 'Contact Sales';
        contactBtn.style.cssText = `
            background: #1e40af;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        `;

        const learnMoreBtn = document.createElement('button');
        learnMoreBtn.className = 'modal-btn modal-btn-secondary';
        learnMoreBtn.textContent = 'Learn More';
        learnMoreBtn.style.cssText = `
            background: white;
            color: #1e40af;
            border: 2px solid #1e40af;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        `;

        buttonsDiv.appendChild(contactBtn);
        buttonsDiv.appendChild(learnMoreBtn);

        modalContent.appendChild(closeBtn);
        modalContent.appendChild(headerDiv);
        modalContent.appendChild(featuresDiv);
        modalContent.appendChild(noticeDiv);
        modalContent.appendChild(buttonsDiv);

        // Add modal to page
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);

        // Event listeners
        const modalCloseBtn = modalContent.querySelector('.modal-close');
        const modalContactBtn = modalContent.querySelector('.modal-btn-primary');
        const modalLearnMoreBtn = modalContent.querySelector('.modal-btn-secondary');

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

    // Add accessibility features
    setupAccessibilityFeatures();
});

// Accessibility features for form validation
function setupAccessibilityFeatures() {
    // Add live region for dynamic content updates
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    `;
    document.body.appendChild(liveRegion);

    // Update live region when form validation occurs
    function updateLiveRegion(message) {
        liveRegion.textContent = message;
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    }

    // Override form validation to announce errors
    const originalValidateField = EnterpriseContactForm.prototype.validateField;
    EnterpriseContactForm.prototype.validateField = function(field) {
        const result = originalValidateField.call(this, field);
        if (!result) {
            const errorMsg = field.parentNode.querySelector('.field-error-message');
            if (errorMsg) {
                updateLiveRegion(`Error: ${errorMsg.textContent}`);
            }
        }
        return result;
    };
}
