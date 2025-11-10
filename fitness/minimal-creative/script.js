// Minimal Creative Fitness Template - JavaScript
// Handles navigation, form validation, and interactive elements

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initHamburgerMenu();
    initSmoothScrolling();
    initFormValidation();
    initScrollAnimations();
    initGallery();
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

    return isValid;
}

/**
 * Handle form submission
 */
function handleFormSubmission(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    // Show loading state
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Show success message
        showNotification('Thank you for your interest! We\'ll contact you within 24 hours to set up your free trial.', 'success');

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
 * Initialize Gallery Component
 */
function initGallery() {
    const galleryElement = document.getElementById('fitness-gallery');
    const filterButtons = document.querySelectorAll('.gallery-filter');

    if (!galleryElement) return;

    // Gallery images data - using optimized gallery images
    const galleryImages = [
        {
            src: '../assets/images/fitness-classes-pilates_gallery.webp',
            alt: 'Pilates Class in Action',
            title: 'Pilates Classes',
            description: 'Strengthen your core with our expert-led Pilates sessions'
        },
        {
            src: '../assets/images/fitness-equipment-cable-machine_gallery.webp',
            alt: 'Modern Cable Machine Equipment',
            title: 'State-of-the-Art Equipment',
            description: 'Train with the latest fitness technology and equipment'
        },
        {
            src: '../assets/images/fitness-trainers-certified-crossfit_gallery.webp',
            alt: 'Certified CrossFit Trainer',
            title: 'Certified Trainers',
            description: 'Learn from experienced, certified fitness professionals'
        },
        {
            src: '../assets/images/fitness-hero-group-class_gallery.webp',
            alt: 'Group Fitness Class',
            title: 'Group Classes',
            description: 'Join our energetic group fitness classes for all levels'
        }
    ];

    // Initialize gallery with lightbox mode by default
    galleryElement.setOptions({
        type: 'lightbox',
        images: galleryImages
    });

    // Set up filter button functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterType = this.getAttribute('data-filter');

            // Update active button state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Update gallery type
            let galleryType = 'lightbox';
            switch (filterType) {
                case 'lightbox':
                    galleryType = 'lightbox';
                    break;
                case 'carousel':
                    galleryType = 'carousel';
                    break;
                case 'grid':
                    galleryType = 'grid';
                    break;
            }

            galleryElement.setOptions({
                type: galleryType,
                images: galleryImages
            });
        });
    });
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

// Accessibility features for form validation
document.addEventListener('DOMContentLoaded', function() {
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
    const originalValidateField = validateField;
    validateField = function(field) {
        const result = originalValidateField.call(this, field);
        if (!result) {
            const errorMsg = field.parentNode.querySelector('.error-message');
            if (errorMsg) {
                updateLiveRegion(`Error: ${errorMsg.textContent}`);
            }
        }
        return result;
    };
});
