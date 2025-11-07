// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.querySelector('.contact-form');
const formInputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');

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

        case 'serviceType':
            if (!value) {
                isValid = false;
                errorMessage = 'Please select a service type';
            }
            break;

        case 'insurance':
            // Insurance is optional, so no validation required
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

    // Check privacy checkbox
    const privacyCheckbox = contactForm.querySelector('#privacy');
    if (privacyCheckbox && !privacyCheckbox.checked) {
        isFormValid = false;

        // Remove existing error
        const existingError = privacyCheckbox.closest('.form-checkbox').querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = 'You must agree to the HIPAA privacy policy';
        errorElement.style.cssText = `
            color: #dc2626;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            font-weight: 500;
        `;

        privacyCheckbox.closest('.form-checkbox').appendChild(errorElement);
    }

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

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
            <span class="notification-message">${message}</span>
        </div>
        <button class="notification-close" aria-label="Close notification">×</button>
    `;

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
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
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

// Add notification animations
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.25rem;
        cursor: pointer;
        padding: 0;
        margin-left: 0.5rem;
        opacity: 0.8;
        transition: opacity 0.2s;
    }

    .notification-close:hover {
        opacity: 1;
    }
`;
document.head.appendChild(notificationStyles);

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
    const animateElements = document.querySelectorAll('.service-card, .testimonial-card, .stat-item');
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// Emergency contact functionality (healthcare specific)
function initializeEmergencyContact() {
    const serviceSelect = document.querySelector('#serviceType');
    if (serviceSelect) {
        serviceSelect.addEventListener('change', function() {
            const emergencyNotice = document.querySelector('.emergency-notice');
            if (this.value === 'urgent') {
                if (!emergencyNotice) {
                    const notice = document.createElement('div');
                    notice.className = 'emergency-notice';
                    notice.innerHTML = `
                        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 1rem; margin-top: 1rem;">
                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                                <span style="color: #dc2626; font-size: 1.25rem;">🚨</span>
                                <strong style="color: #dc2626;">Emergency Care Notice</strong>
                            </div>
                            <p style="color: #991b1b; font-size: 0.875rem; margin: 0;">
                                For life-threatening emergencies, please call 911 immediately or go to the nearest emergency room.
                                This form is for non-emergency medical appointments only.
                            </p>
                        </div>
                    `;
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

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Hamburger menu
    if (hamburger) {
        hamburger.addEventListener('click', toggleMenu);
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
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            closeMenu();
        }
    });

    // Scroll event for active navigation
    window.addEventListener('scroll', updateActiveNavLink);

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
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMenu();
    }

    // Hamburger menu keyboard support
    if (e.key === 'Enter' || e.key === ' ') {
        if (document.activeElement === hamburger) {
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

// Use debounced scroll handler
window.addEventListener('scroll', debounce(updateActiveNavLink, 10));

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
    const mainElement = document.querySelector('main');
    if (mainElement) {
        mainElement.id = 'main-content';
        mainElement.setAttribute('role', 'main');
    }
});
