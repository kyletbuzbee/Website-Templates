// Minimal Creative Healthcare Template - JavaScript
// Handles navigation, form validation, and interactive elements

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initHamburgerMenu();
    initSmoothScrolling();
    initFormValidation();
    initScrollAnimations();
});

/**
 * Hamburger Menu Toggle Functionality
 */
function initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', function() {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';

        // Toggle aria-expanded attribute
        hamburger.setAttribute('aria-expanded', !isExpanded);

        // Toggle menu visibility
        navMenu.classList.toggle('active');

        // Toggle hamburger animation
        hamburger.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
            hamburger.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && navMenu.classList.contains('active')) {
            hamburger.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
}

/**
 * Smooth Scrolling for Navigation Links
 */
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu after navigation
                const hamburger = document.querySelector('.hamburger');
                const navMenu = document.querySelector('.nav-menu');

                if (hamburger && navMenu) {
                    hamburger.setAttribute('aria-expanded', 'false');
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            }
        });
    });
}

/**
 * Form Validation and Submission
 */
function initFormValidation() {
    const form = document.querySelector('.contact-form');

    if (!form) return;

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        if (validateForm(form)) {
            // Simulate form submission
            handleFormSubmission(form);
        }
    });

    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });

    // Special handling for checkbox
    const privacyCheckbox = document.getElementById('privacy');
    if (privacyCheckbox) {
        privacyCheckbox.addEventListener('change', function() {
            validatePrivacyCheckbox(this);
        });
    }
}

/**
 * Validate individual form field
 */
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Remove existing error messages
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Remove error class
    field.classList.remove('error');

    // Validation rules
    switch (field.id) {
        case 'firstName':
        case 'lastName':
            if (!value) {
                isValid = false;
                errorMessage = 'This field is required';
            } else if (value.length < 2) {
                isValid = false;
                errorMessage = 'Must be at least 2 characters';
            } else if (!/^[a-zA-Z\s\-']+$/.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid name';
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
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!value) {
                isValid = false;
                errorMessage = 'Phone number is required';
            } else if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
            break;

        case 'serviceType':
            if (!value) {
                isValid = false;
                errorMessage = 'Please select a service type';
            }
            break;

        case 'insurance':
            if (!value) {
                isValid = false;
                errorMessage = 'Please select your insurance provider';
            }
            break;
    }

    // Show error if invalid
    if (!isValid) {
        field.classList.add('error');

        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = errorMessage;
        field.parentNode.appendChild(errorElement);
    }

    return isValid;
}

/**
 * Validate privacy checkbox
 */
function validatePrivacyCheckbox(checkbox) {
    const checkboxContainer = checkbox.closest('.form-checkbox');
    const existingError = checkboxContainer.querySelector('.error-message');

    if (existingError) {
        existingError.remove();
    }

    if (!checkbox.checked) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = 'You must agree to the privacy policy and HIPAA terms';
        checkboxContainer.appendChild(errorElement);
        return false;
    }

    return true;
}

/**
 * Validate entire form
 */
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    // Special validation for privacy checkbox
    const privacyCheckbox = document.getElementById('privacy');
    if (privacyCheckbox && !validatePrivacyCheckbox(privacyCheckbox)) {
        isValid = false;
    }

    return isValid;
}

/**
 * Handle form submission
 */
function handleFormSubmission(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    // Show loading state
    submitButton.textContent = 'Scheduling...';
    submitButton.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Show success message
        showNotification('Thank you for choosing CarePlus! We will contact you within 24 hours to confirm your appointment details.', 'success');

        // Reset form
        form.reset();

        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;

        // Remove error classes
        form.querySelectorAll('.error').forEach(field => {
            field.classList.remove('error');
        });

        // Remove error messages
        form.querySelectorAll('.error-message').forEach(error => {
            error.remove();
        });

        // Reset checkbox styling
        const checkmark = form.querySelector('.checkmark');
        if (checkmark) {
            checkmark.classList.remove('checked');
        }
    }, 2000);
}

/**
 * Show notification messages
 */
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
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
}

/**
 * Scroll-based animations and effects
 */
function initScrollAnimations() {
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
    const animateElements = document.querySelectorAll('.service-card, .testimonial-card, .contact-card');
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Utility function for debouncing
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Handle window resize events
 */
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Close mobile menu on desktop resize
        if (window.innerWidth > 768) {
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.nav-menu');

            if (hamburger && navMenu) {
                hamburger.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        }
    }, 250);
});

/**
 * Healthcare-specific functionality
 */
function initHealthcareFeatures() {
    // Service type change handler
    const serviceSelect = document.getElementById('serviceType');
    if (serviceSelect) {
        serviceSelect.addEventListener('change', function() {
            const selectedService = this.value;
            updateFormBasedOnService(selectedService);
        });
    }

    // Insurance provider change handler
    const insuranceSelect = document.getElementById('insurance');
    if (insuranceSelect) {
        insuranceSelect.addEventListener('change', function() {
            const selectedInsurance = this.value;
            handleInsuranceSelection(selectedInsurance);
        });
    }
}

/**
 * Update form fields based on selected service
 */
function updateFormBasedOnService(serviceType) {
    const messageTextarea = document.getElementById('message');
    if (!messageTextarea) return;

    let placeholder = '';

    switch (serviceType) {
        case 'primary':
            placeholder = 'Please describe your primary care needs, current symptoms, or reason for visit...';
            break;
        case 'specialist':
            placeholder = 'Please specify which specialist you need and describe your symptoms or condition...';
            break;
        case 'diagnostic':
            placeholder = 'Please describe what type of diagnostic testing you need or your symptoms...';
            break;
        case 'wellness':
            placeholder = 'Please describe your wellness goals or which program interests you...';
            break;
        case 'urgent':
            placeholder = 'Please describe your urgent medical concern and how long symptoms have been present...';
            break;
        default:
            placeholder = 'Please provide details about your health concern...';
    }

    messageTextarea.placeholder = placeholder;
}

/**
 * Handle insurance provider selection
 */
function handleInsuranceSelection(insuranceType) {
    // Could add logic to show/hide additional insurance fields
    // or provide information about accepted insurance
    console.log('Insurance selected:', insuranceType);

    // For now, just log the selection
    // In a real implementation, this could:
    // - Show additional fields for insurance ID, group number, etc.
    // - Display co-pay information
    // - Update available services based on coverage
}

// Initialize healthcare-specific features
initHealthcareFeatures();

// Healthcare-specific accessibility features
document.addEventListener('DOMContentLoaded', function() {
    // Add skip link for screen readers
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
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Focus management for skip link
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });

    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });

    // Add main content landmark
    const mainElement = document.querySelector('main') || document.querySelector('.container');
    if (mainElement) {
        mainElement.id = 'main-content';
        mainElement.setAttribute('role', 'main');
    }

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
    const originalValidateField = validateField;
    validateField = function(field) {
        const result = originalValidateField.call(this, field);
        if (!result) {
            const errorMsg = field.parentNode.querySelector('.error-message');
            if (errorMsg) {
                updateFormLiveRegion(`Error: ${errorMsg.textContent}`);
            }
        }
        return result;
    };
});
