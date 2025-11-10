// Professional Enterprise Contractors & Trades Template JavaScript
// Handles mobile navigation, form validation, animations, and enterprise features

class ProContractApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupScrollEffects();
        this.setupFormValidation();
        this.setupSkipLink();
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
        const animateElements = document.querySelectorAll('.service-card, .project-card, .testimonial-card, .about-image');
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

    // Form validation and submission
    setupFormValidation() {
        const form = document.getElementById('contactForm');

        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));

            // Real-time validation
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => {
                    if (input.classList.contains('error')) {
                        this.validateField(input);
                    }
                });
            });
        }
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error messages
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }

        // Validation rules
        switch (field.name) {
            case 'firstName':
            case 'lastName':
                if (!value) {
                    isValid = false;
                    errorMessage = `${field.name === 'firstName' ? 'First' : 'Last'} name is required`;
                } else if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters';
                }
                break;

            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    isValid = false;
                    errorMessage = 'Email is required';
                } else if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;

            case 'phone':
                if (value && !/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-\(\)]/g, ''))) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number';
                }
                break;

            case 'message':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Project details are required';
                } else if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Please provide more details about your project';
                }
                break;
        }

        // Update field styling
        field.classList.toggle('error', !isValid);
        field.classList.toggle('valid', isValid && value);

        // Show error message
        if (!isValid && errorMessage) {
            const errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.textContent = errorMessage;
            field.parentNode.appendChild(errorElement);
        }

        return isValid;
    }

    handleFormSubmit(e) {
        e.preventDefault();

        const form = e.target;
        let isFormValid = true;

        // Validate all required fields
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                this.showNotification('Thank you! Your quote request has been submitted. We will contact you within 24 hours.', 'success');

                // Reset form
                form.reset();

                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;

                // Clear validation states
                form.querySelectorAll('.error, .valid').forEach(field => {
                    field.classList.remove('error', 'valid');
                });

                const errorMessages = form.querySelectorAll('.field-error');
                errorMessages.forEach(error => error.remove());
            }, 2000);
        } else {
            this.showNotification('Please correct the errors above and try again.', 'error');
        }
    }

    // Skip to main content accessibility
    setupSkipLink() {
        // Add skip link to header
        const header = document.querySelector('.header');
        if (header) {
            const skipLink = document.createElement('a');
            skipLink.href = '#main-content';
            skipLink.className = 'skip-link';
            skipLink.textContent = 'Skip to main content';
            skipLink.style.cssText = `
                position: absolute;
                top: -40px;
                left: 6px;
                background: #000;
                color: white;
                padding: 8px;
                text-decoration: none;
                z-index: 1000;
                border-radius: 4px;
                font-size: 14px;
            `;

            header.insertBefore(skipLink, header.firstChild);

            // Focus management for skip link
            skipLink.addEventListener('focus', function() {
                this.style.top = '6px';
            });

            skipLink.addEventListener('blur', function() {
                this.style.top = '-40px';
            });

            // Add main content landmark
            const mainElement = document.querySelector('main') || document.body;
            mainElement.id = 'main-content';
            mainElement.setAttribute('role', 'main');
        }
    }

    // Notification system
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element safely
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'notification-content';

        const iconSpan = document.createElement('span');
        iconSpan.className = 'notification-icon';
        iconSpan.textContent = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';

        const messageSpan = document.createElement('span');
        messageSpan.className = 'notification-message';
        messageSpan.textContent = message;

        const closeBtn = document.createElement('button');
        closeBtn.className = 'notification-close';
        closeBtn.setAttribute('aria-label', 'Close notification');
        closeBtn.textContent = '×';

        contentDiv.appendChild(iconSpan);
        contentDiv.appendChild(messageSpan);
        notification.appendChild(contentDiv);
        notification.appendChild(closeBtn);

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#ea580c'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            max-width: 400px;
            font-family: 'Inter', sans-serif;
            animation: slideInRight 0.3s ease-out;
        `;

        // Add to page
        document.body.appendChild(notification);

        // Handle close button
        const notificationCloseBtn = notification.querySelector('.notification-close');
        notificationCloseBtn.addEventListener('click', () => {
            notification.remove();
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
}



// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProContractApp();

    // Add live region for form validation errors
    const formLiveRegion = document.createElement('div');
    formLiveRegion.setAttribute('aria-live', 'polite');
    formLiveRegion.setAttribute('aria-atomic', 'true');
    formLiveRegion.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    `;
    document.body.appendChild(formLiveRegion);

    // Update live region when form validation occurs
    function updateFormLiveRegion(message) {
        formLiveRegion.textContent = message;
        setTimeout(() => {
            formLiveRegion.textContent = '';
        }, 1000);
    }

    // Override form validation to announce errors
    const originalValidateField = ProContractApp.prototype.validateField;
    ProContractApp.prototype.validateField = function(field) {
        const result = originalValidateField.call(this, field);
        if (!result) {
            const errorMsg = field.parentNode.querySelector('.field-error');
            if (errorMsg) {
                updateFormLiveRegion(`Error: ${errorMsg.textContent}`);
            }
        }
        return result;
    };
});
