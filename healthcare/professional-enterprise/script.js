// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links a');
const contactForm = document.querySelector('#appointmentForm');
const formInputs = document.querySelectorAll('#appointmentForm input, #appointmentForm select, #appointmentForm textarea');

// Navigation functionality
function toggleMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', hamburger.classList.contains('active'));
}

function closeMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
}

// Smooth scrolling for navigation links
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        const headerOffset = 80;
        const elementPosition = element.offsetTop;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Form validation
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
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
    switch (fieldName) {
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
            if (!value) {
                isValid = false;
                errorMessage = 'Email is required';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
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

        case 'service':
            if (!value) {
                isValid = false;
                errorMessage = 'Please select a service';
            }
            break;

        case 'message':
            if (!value) {
                isValid = false;
                errorMessage = 'Please describe your health concern';
            } else if (value.length < 10) {
                isValid = false;
                errorMessage = 'Please provide more details (at least 10 characters)';
            }
            break;
    }

    // Show error if validation failed
    if (!isValid) {
        field.classList.add('error');

        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = errorMessage;
        errorElement.style.cssText = `
            color: #dc2626;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            font-weight: 500;
        `;

        field.parentNode.appendChild(errorElement);
    }

    return isValid;
}

function validateForm() {
    let isFormValid = true;
    const requiredFields = contactForm.querySelectorAll('[required]');

    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isFormValid = false;
        }
    });

    return isFormValid;
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();

    if (validateForm()) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Scheduling...';

        // Simulate form submission (replace with actual submission logic)
        setTimeout(() => {
            // Reset form
            contactForm.reset();

            // Show success message
            showNotification('Thank you! Your appointment request has been submitted. Our patient coordinator will contact you within 24 hours to confirm your appointment.', 'success');

            // Reset button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;

            // Remove error states
            formInputs.forEach(input => {
                input.classList.remove('error');
                const errorMsg = input.parentNode.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.remove();
                }
            });
        }, 2000);
    } else {
        showNotification('Please correct the errors below and try again.', 'error');
    }
}

// Notification system
function showNotification(message, type = 'info') {
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
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#0ea5e9'};
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



// Intersection Observer for animations
function createIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements that should animate in
    const animateElements = document.querySelectorAll('.service-card, .doctor-card, .department-card, .testimonial-card');
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// Emergency contact functionality
function initializeEmergencyContact() {
    const serviceSelect = document.querySelector('#service');
    if (serviceSelect) {
        serviceSelect.addEventListener('change', function() {
            const emergencyNotice = document.querySelector('.emergency-notice');
            if (this.value === 'emergency') {
                if (!emergencyNotice) {
                    const notice = document.createElement('div');
                    notice.className = 'emergency-notice';

                    const noticeDiv = document.createElement('div');
                    noticeDiv.style.cssText = 'background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 1rem; margin-top: 1rem;';

                    const headerDiv = document.createElement('div');
                    headerDiv.style.cssText = 'display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;';

                    const emojiSpan = document.createElement('span');
                    emojiSpan.style.cssText = 'color: #dc2626; font-size: 1.25rem;';
                    emojiSpan.textContent = '🚨';

                    const titleStrong = document.createElement('strong');
                    titleStrong.style.cssText = 'color: #dc2626;';
                    titleStrong.textContent = 'Emergency Care Notice';

                    const messageP = document.createElement('p');
                    messageP.style.cssText = 'color: #991b1b; font-size: 0.875rem; margin: 0;';
                    messageP.textContent = 'For life-threatening emergencies, please call 911 immediately or go to the nearest emergency room. This form is for non-emergency medical appointments only.';

                    headerDiv.appendChild(emojiSpan);
                    headerDiv.appendChild(titleStrong);
                    noticeDiv.appendChild(headerDiv);
                    noticeDiv.appendChild(messageP);
                    notice.appendChild(noticeDiv);

                    this.closest('.form-group').appendChild(notice);
                }
            } else {
                if (emergencyNotice) {
                    emergencyNotice.remove();
                }
            }
        });
    }
}

// Newsletter subscription
function handleNewsletterSubmit(e) {
    e.preventDefault();
    const emailInput = e.target.querySelector('.newsletter-input');
    const email = emailInput.value.trim();

    if (!email) {
        showNotification('Please enter your email address.', 'error');
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }

    // Simulate subscription
    emailInput.value = '';
    showNotification('Thank you for subscribing! You\'ll receive our latest health updates and tips.', 'success');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Create hamburger menu if it doesn't exist
    if (!hamburger) {
        const nav = document.querySelector('.nav');
        if (nav) {
            const hamburgerBtn = document.createElement('button');
            hamburgerBtn.className = 'hamburger';
            hamburgerBtn.innerHTML = '<span></span><span></span><span></span>';
            hamburgerBtn.setAttribute('aria-label', 'Toggle menu');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
            nav.appendChild(hamburgerBtn);

            // Re-select elements
            const newHamburger = document.querySelector('.hamburger');
            const newNavMenu = document.querySelector('.nav-links');

            if (newHamburger && newNavMenu) {
                newHamburger.addEventListener('click', function() {
                    this.classList.toggle('active');
                    newNavMenu.classList.toggle('active');
                    this.setAttribute('aria-expanded', this.classList.contains('active'));
                });
            }
        }
    }

    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            smoothScroll(target);
            closeMenu();
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (hamburger && navMenu && !hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            closeMenu();
        }
    });

    // Use IntersectionObserver for active navigation highlighting
    const navObserverOptions = {
        threshold: 0.5,
        rootMargin: '-50% 0px -50% 0px'
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, navObserverOptions);

    // Observe sections for navigation highlighting
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
        navObserver.observe(section);
    });

    // Form validation on blur
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        // Real-time validation for better UX
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });

    // Form submission
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    // Newsletter subscription
    const newsletterForm = document.querySelector('.newsletter');
    if (newsletterForm) {
        const newsletterBtn = newsletterForm.querySelector('.newsletter-button');
        if (newsletterBtn) {
            newsletterBtn.addEventListener('click', handleNewsletterSubmit);
        }
    }

    // Initialize intersection observer for animations
    createIntersectionObserver();

    // Initialize healthcare-specific features
    initializeEmergencyContact();

    // Set initial active nav link
    updateActiveNavLink();
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Close menu with Escape key
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
        closeMenu();
    }

    // Hamburger menu keyboard support
    if (e.key === 'Enter' || e.key === ' ') {
        if (document.activeElement.classList.contains('hamburger')) {
            e.preventDefault();
            toggleMenu();
        }
    }
});

// Performance optimization: Debounce scroll events
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



// Add loading states for better UX
function addLoadingState(element) {
    element.classList.add('loading');
    element.disabled = true;
}

function removeLoadingState(element) {
    element.classList.remove('loading');
    element.disabled = false;
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // Could send error to analytics service here
});

// Service Worker registration (if needed for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}

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
