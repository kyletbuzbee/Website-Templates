// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links a');
const contactForm = document.querySelector('#valuationForm');
const formInputs = document.querySelectorAll('#valuationForm input, #valuationForm select, #valuationForm textarea');
const filterButtons = document.querySelectorAll('.filter-btn');
const propertyCards = document.querySelectorAll('.property-card');

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

// Property filtering functionality
function initializePropertyFilters() {
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            propertyCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px) scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
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

        case 'propertyType':
        case 'serviceType':
            if (!value) {
                isValid = false;
                errorMessage = 'Please make a selection';
            }
            break;

        case 'message':
            if (!value) {
                isValid = false;
                errorMessage = 'Please provide additional information';
            } else if (value.length < 10) {
                isValid = false;
                errorMessage = 'Please provide more details (at least 10 characters)';
            }
            break;

        case 'consent':
            if (!field.checked) {
                isValid = false;
                errorMessage = 'You must agree to receive communications';
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
        submitBtn.textContent = 'Submitting...';

        // Simulate form submission (replace with actual submission logic)
        setTimeout(() => {
            // Reset form
            contactForm.reset();

            // Show success message
            showNotification('Thank you! Your property valuation request has been submitted. One of our agents will contact you within 24 hours with a comprehensive market analysis.', 'success');

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
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
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
    const animateElements = document.querySelectorAll('.service-card, .property-card, .agent-card, .market-card, .testimonial-card');
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// Property card interactions
function initializePropertyInteractions() {
    propertyCards.forEach(card => {
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
        });

        // Add click tracking (for analytics)
        card.addEventListener('click', function() {
            const propertyTitle = this.querySelector('h3').textContent;
            console.log(`Property clicked: ${propertyTitle}`);
            // Could send to analytics service here
        });
    });
}

// Agent contact functionality
function initializeAgentContact() {
    const agentCards = document.querySelectorAll('.agent-card');
    agentCards.forEach(card => {
        const contactLinks = card.querySelectorAll('.agent-contact a');
        contactLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const agentName = card.querySelector('h3').textContent;
                const contactType = this.textContent.toLowerCase();
                showNotification(`Contacting ${agentName} via ${contactType}...`, 'info');
            });
        });
    });
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
    showNotification('Thank you for subscribing! You\'ll receive our latest market updates and property listings.', 'success');
}

// Service type handling
function initializeServiceTypeHandling() {
    const serviceSelect = document.querySelector('#serviceType');
    if (serviceSelect) {
        serviceSelect.addEventListener('change', function() {
            const propertyAddressField = document.querySelector('#propertyAddress').closest('.form-group');
            const messageField = document.querySelector('#message').closest('.form-group');

            if (this.value === 'valuation' || this.value === 'selling') {
                // Show property address for valuation and selling
                propertyAddressField.style.display = 'block';
                messageField.querySelector('label').textContent = 'Additional Property Details';
                messageField.querySelector('textarea').placeholder = 'Please provide details about your property (square footage, condition, upgrades, etc.)...';
            } else if (this.value === 'buying') {
                // Hide property address for buying
                propertyAddressField.style.display = 'none';
                messageField.querySelector('label').textContent = 'Buying Preferences';
                messageField.querySelector('textarea').placeholder = 'Please describe your ideal property (location, budget, size, features, etc.)...';
            } else {
                // Show for other services
                propertyAddressField.style.display = 'block';
                messageField.querySelector('label').textContent = 'Additional Information';
                messageField.querySelector('textarea').placeholder = 'Please provide any additional details about your real estate needs...';
            }
        });
    }
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

    // Newsletter subscription
    const newsletterForm = document.querySelector('.newsletter');
    if (newsletterForm) {
        const newsletterBtn = newsletterForm.querySelector('.newsletter-button');
        if (newsletterBtn) {
            newsletterBtn.addEventListener('click', handleNewsletterSubmit);
        }
    }

    // Initialize property filtering
    initializePropertyFilters();

    // Initialize property interactions
    initializePropertyInteractions();

    // Initialize agent contact
    initializeAgentContact();

    // Initialize service type handling
    initializeServiceTypeHandling();

    // Initialize intersection observer for animations
    createIntersectionObserver();

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
            func();
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

// Real estate-specific accessibility features
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

    // Add property filter accessibility
    filterButtons.forEach(button => {
        button.setAttribute('aria-pressed', button.classList.contains('active'));
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.setAttribute('aria-pressed', 'false'));
            this.setAttribute('aria-pressed', 'true');
        });
    });
});
