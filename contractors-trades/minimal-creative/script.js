// Minimal Creative Contractors & Trades Template JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    initializeNavigation();
    initializeContactForm();
    initializeScrollEffects();
});

// Navigation functionality
function initializeNavigation() {
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Sticky header on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Contact form handling
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactSubmit(this);
        });
    }
}

function handleContactSubmit(form) {
    const formData = new FormData(form);
    const contactData = Object.fromEntries(formData);

    // Basic validation
    if (!contactData.name || !contactData.email || !contactData.message) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactData.email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        showNotification('Thank you for your message! We will get back to you within 24 hours.', 'success');
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Scroll effects and animations
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements that should animate in
    const animateElements = document.querySelectorAll('.service-card, .about-content, .contact-content');
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// Utility functions
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Auto-hide after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
}

// Add notification styles dynamically
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        max-width: 400px;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    }

    .notification.show {
        transform: translateX(0);
    }

    .notification-content {
        background: white;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        padding: 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-left: 4px solid;
    }

    .notification.success .notification-content {
        border-left-color: #10b981;
    }

    .notification.error .notification-content {
        border-left-color: #ef4444;
    }

    .notification.info .notification-content {
        border-left-color: #3b82f6;
    }

    .notification-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #6b7280;
        padding: 0;
        margin-left: 1rem;
    }

    .notification-close:hover {
        color: #374151;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Form validation enhancement
function enhanceFormValidation() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                if (this.classList.contains('invalid')) {
                    validateField(this);
                }
            });
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Remove existing error messages
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }

    // Validation rules
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    } else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }

    // Update field styling
    field.classList.toggle('invalid', !isValid);
    field.classList.toggle('valid', isValid && value);

    // Show error message
    if (!isValid && errorMessage) {
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = errorMessage;
        field.parentNode.appendChild(errorElement);
    }
}

// Initialize form validation
document.addEventListener('DOMContentLoaded', function() {
    enhanceFormValidation();
    setupSkipLink();
    initializeConstructionFeatures();
});

// Construction-specific features
function initializeConstructionFeatures() {
    // Service type change handler for dynamic form updates
    const serviceSelect = document.querySelector('#serviceType');
    if (serviceSelect) {
        serviceSelect.addEventListener('change', function() {
            const messageTextarea = document.querySelector('#message');
            const messageLabel = messageTextarea.closest('.form-group').querySelector('.form-label');

            // Update message field based on service type
            switch (this.value) {
                case 'electrical':
                    messageLabel.textContent = 'Electrical Project Description (include current issues, desired work) *';
                    break;
                case 'plumbing':
                    messageLabel.textContent = 'Plumbing Project Description (include current issues, desired work) *';
                    break;
                case 'hvac':
                    messageLabel.textContent = 'HVAC Project Description (include current system, desired work) *';
                    break;
                case 'construction':
                    messageLabel.textContent = 'Construction Project Description (include scope, materials, timeline) *';
                    break;
                case 'renovation':
                    messageLabel.textContent = 'Renovation Project Description (include rooms, changes, materials) *';
                    break;
                case 'maintenance':
                    messageLabel.textContent = 'Maintenance Project Description (include current issues, frequency) *';
                    break;
                default:
                    messageLabel.textContent = 'Project Description *';
            }
        });
    }

    // Timeline change handler for urgency indication
    const timelineSelect = document.querySelector('#experience');
    if (timelineSelect) {
        timelineSelect.addEventListener('change', function() {
            const urgencyNotice = document.querySelector('.urgency-notice');
            if (this.value === 'beginner') {
                if (!urgencyNotice) {
                    const notice = document.createElement('div');
                    notice.className = 'urgency-notice';
                    notice.innerHTML = `
                        <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 1rem; margin-top: 1rem;">
                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                                <span style="color: #d97706; font-size: 1.25rem;">💡</span>
                                <strong style="color: #d97706;">Beginner-Friendly Support</strong>
                            </div>
                            <p style="color: #92400e; font-size: 0.875rem; margin: 0;">
                                As a beginner, we'll provide extra guidance and educational resources to help you understand your fitness journey.
                            </p>
                        </div>
                    `;
                    this.closest('.form-group').appendChild(notice);
                }
            } else {
                if (urgencyNotice) {
                    urgencyNotice.remove();
                }
            }
        });
    }
}

// Skip to main content accessibility
function setupSkipLink() {
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

// Add form validation styles
const formValidationStyles = `
    .field-error {
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.25rem;
    }

    input.invalid, textarea.invalid, select.invalid {
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }

    input.valid, textarea.valid, select.valid {
        border-color: #10b981;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }
`;

const validationStyleSheet = document.createElement('style');
validationStyleSheet.textContent = formValidationStyles;
document.head.appendChild(validationStyleSheet);
