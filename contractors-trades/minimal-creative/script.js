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

    // Sticky header using IntersectionObserver
    const headerSentinel = document.createElement('div');
    headerSentinel.style.cssText = `
        position: absolute;
        top: 100px;
        left: 0;
        right: 0;
        height: 1px;
        pointer-events: none;
    `;
    document.body.insertBefore(headerSentinel, document.body.firstChild);

    const headerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                header.classList.remove('sticky');
            } else {
                header.classList.add('sticky');
            }
        });
    }, { threshold: 0 });

    headerObserver.observe(headerSentinel);

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

    // Create notification element safely
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'notification-content';

    const messageSpan = document.createElement('span');
    messageSpan.className = 'notification-message';
    messageSpan.textContent = message;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'notification-close';
    closeBtn.setAttribute('aria-label', 'Close notification');
    closeBtn.textContent = '×';

    contentDiv.appendChild(messageSpan);
    contentDiv.appendChild(closeBtn);
    notification.appendChild(contentDiv);

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
    const notificationCloseBtn = notification.querySelector('.notification-close');
    notificationCloseBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
}



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

                    const noticeDiv = document.createElement('div');
                    noticeDiv.style.cssText = 'background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 1rem; margin-top: 1rem;';

                    const headerDiv = document.createElement('div');
                    headerDiv.style.cssText = 'display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;';

                    const emojiSpan = document.createElement('span');
                    emojiSpan.style.cssText = 'color: #d97706; font-size: 1.25rem;';
                    emojiSpan.textContent = '💡';

                    const titleStrong = document.createElement('strong');
                    titleStrong.style.cssText = 'color: #d97706;';
                    titleStrong.textContent = 'Beginner-Friendly Support';

                    const messageP = document.createElement('p');
                    messageP.style.cssText = 'color: #92400e; font-size: 0.875rem; margin: 0;';
                    messageP.textContent = 'As a beginner, we\'ll provide extra guidance and educational resources to help you understand your fitness journey.';

                    headerDiv.appendChild(emojiSpan);
                    headerDiv.appendChild(titleStrong);
                    noticeDiv.appendChild(headerDiv);
                    noticeDiv.appendChild(messageP);
                    notice.appendChild(noticeDiv);

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
