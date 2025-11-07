// Business Professional Roofing Template - JavaScript
// Professional navigation, form handling, and smooth interactions

class ProfessionalRoofingApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupScrollEffects();
        this.setupFormValidation();
        this.setupNewsletterSignup();
    }

    // Mobile hamburger menu with professional animation
    setupMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';

                hamburger.setAttribute('aria-expanded', !isExpanded);
                navMenu.classList.toggle('nav-menu-open');

                // Professional hamburger animation
                const lines = hamburger.querySelectorAll('.hamburger-line');
                if (!isExpanded) {
                    lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                    lines[1].style.opacity = '0';
                    lines[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
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

                    const lines = hamburger.querySelectorAll('.hamburger-line');
                    lines[0].style.transform = 'none';
                    lines[1].style.opacity = '1';
                    lines[2].style.transform = 'none';
                }
            });
        }
    }

    // Smooth scrolling with offset for fixed header
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

    // Professional scroll effects and animations
    setupScrollEffects() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                }
            });
        }, observerOptions);

        // Observe elements for professional animations
        const animateElements = document.querySelectorAll('.service-card, .testimonial-card, .credential');
        animateElements.forEach(el => observer.observe(el));

        // Header background and shadow on scroll
        const header = document.querySelector('.header');
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > 50) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }

            lastScrollY = currentScrollY;
        });

        // Stats counter animation
        this.setupStatsAnimation();
    }

    // Animate statistics numbers
    setupStatsAnimation() {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateStats(entry.target);
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => statsObserver.observe(stat));
    }

    animateStats(statElement) {
        const target = parseInt(statElement.textContent.replace(/[^\d]/g, ''));
        const duration = 2000;
        const start = performance.now();
        const startValue = 0;

        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);

            statElement.textContent = currentValue.toLocaleString() + (statElement.textContent.includes('+') ? '+' : '');

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    // Professional form validation and handling
    setupFormValidation() {
        const forms = document.querySelectorAll('.contact-form, .newsletter-form');

        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, select, textarea');

            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });

            form.addEventListener('submit', (e) => this.handleFormSubmit(e, form));
        });
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
                    errorMessage = 'Name must be at least 2 characters';
                } else if (!/^[a-zA-Z\s\-']+$/.test(value)) {
                    isValid = false;
                    errorMessage = 'Name can only contain letters, spaces, hyphens, and apostrophes';
                }
                break;

            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    isValid = false;
                    errorMessage = 'Email address is required';
                } else if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;

            case 'phone':
                if (value && !/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-\(\)\.]/g, ''))) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number';
                }
                break;

            case 'serviceType':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Please select a service';
                }
                break;

            case 'message':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Message is required';
                } else if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Message must be at least 10 characters';
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

    handleFormSubmit(e, form) {
        e.preventDefault();

        const formData = new FormData(form);
        let isFormValid = true;

        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            this.submitForm(form, formData);
        } else {
            // Scroll to first error
            const firstError = form.querySelector('.field-error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }

    submitForm(form, formData) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        // Show loading state
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';

        // Simulate form submission
        setTimeout(() => {
            submitBtn.textContent = '✓ Message Sent Successfully!';
            submitBtn.style.backgroundColor = '#10b981';
            submitBtn.style.color = 'white';

            // Reset form after success
            setTimeout(() => {
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.backgroundColor = '';
                submitBtn.style.color = '';
                submitBtn.style.opacity = '';

                // Clear any remaining errors
                form.querySelectorAll('.field-error').forEach(field => {
                    this.clearFieldError(field);
                });
            }, 3000);
        }, 2000);
    }

    // Newsletter signup functionality
    setupNewsletterSignup() {
        const newsletterForm = document.querySelector('.newsletter-form');

        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const emailInput = newsletterForm.querySelector('.newsletter-input');
                const submitBtn = newsletterForm.querySelector('button[type="submit"]');

                if (emailInput.value && this.validateField(emailInput)) {
                    const originalText = submitBtn.textContent;

                    submitBtn.textContent = 'Subscribing...';
                    submitBtn.disabled = true;

                    setTimeout(() => {
                        submitBtn.textContent = '✓ Subscribed!';
                        submitBtn.style.backgroundColor = '#10b981';

                        setTimeout(() => {
                            submitBtn.textContent = originalText;
                            submitBtn.disabled = false;
                            submitBtn.style.backgroundColor = '';
                            emailInput.value = '';
                        }, 2000);
                    }, 1000);
                }
            });
        }
    }
}

// Initialize the professional application
document.addEventListener('DOMContentLoaded', () => {
    new ProfessionalRoofingApp();
});

// Add professional CSS enhancements
const professionalStyles = `
<style>
/* Professional Form Enhancements */
.form-section {
    background-color: var(--bg-light);
    padding: 1.5rem;
    border-radius: var(--border-radius);
    border: 1px solid var(--border-light);
    margin-bottom: 2rem;
}

.form-section h4 {
    margin-bottom: 1rem;
    color: var(--primary-color);
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 600;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.form-group {
    position: relative;
}

.form-input,
.form-select,
.form-textarea {
    transition: all 0.2s ease;
    background-color: white;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(30, 64, 175, 0.15);
}

/* Professional Button States */
.btn {
    position: relative;
    overflow: hidden;
    transition: all 0.2s ease;
}

.btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
}

.btn:hover::before {
    left: 100%;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
}

/* Professional Animations */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideInFromLeft {
    from {
        opacity: 0;
        transform: translateX(-30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slideInFromRight {
    from {
        opacity: 0;
        transform: translateX(30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out forwards;
}

.animate-slide-in-left {
    animation: slideInFromLeft 0.6s ease-out forwards;
}

.animate-slide-in-right {
    animation: slideInFromRight 0.6s ease-out forwards;
}

/* Professional Hover Effects */
.service-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.service-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
}

.testimonial-card {
    transition: all 0.3s ease;
}

.testimonial-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.credential {
    transition: all 0.3s ease;
}

.credential:hover {
    transform: translateX(4px);
    box-shadow: var(--shadow-md);
}

/* Professional Mobile Menu */
@media (max-width: 768px) {
    .nav-menu-open {
        animation: slideDown 0.3s ease-out;
    }
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Professional Loading States */
.loading {
    position: relative;
    pointer-events: none;
}

.loading::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    margin: -10px 0 0 -10px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Professional Focus States */
.form-input:focus,
.form-select:focus,
.form-textarea:focus,
.btn:focus {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
}

/* Professional Error States */
.field-error-message {
    color: #dc2626;
    font-size: 0.875rem;
    margin-top: 0.5rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.field-error-message::before {
    content: '⚠';
    font-size: 1rem;
}

/* Professional Success States */
.success-message {
    background-color: #d1fae5;
    color: #065f46;
    padding: 1rem;
    border-radius: var(--border-radius);
    border: 1px solid #a7f3d0;
    margin-top: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.success-message::before {
    content: '✓';
    font-size: 1.25rem;
    font-weight: bold;
}

/* Professional Scroll Indicator */
.scroll-indicator {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 50px;
    height: 50px;
    background-color: var(--primary-color);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    transform: translateY(100px);
    transition: all 0.3s ease;
    z-index: 100;
    box-shadow: var(--shadow-lg);
}

.scroll-indicator.visible {
    opacity: 1;
    transform: translateY(0);
}

.scroll-indicator:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-xl);
}

/* Professional Print Styles */
@media print {
    .header,
    .hero-visual,
    .footer {
        display: none !important;
    }

    .section {
        page-break-inside: avoid;
    }

    .contact-form,
    .newsletter-form {
        display: none !important;
    }
}
</style>
`;

// Inject professional styles
document.head.insertAdjacentHTML('beforeend', professionalStyles);

// Add scroll to top functionality
window.addEventListener('scroll', () => {
    const scrollIndicator = document.querySelector('.scroll-indicator') || createScrollIndicator();

    if (window.scrollY > 500) {
        scrollIndicator.classList.add('visible');
    } else {
        scrollIndicator.classList.remove('visible');
    }
});

function createScrollIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    indicator.innerHTML = '↑';
    indicator.setAttribute('aria-label', 'Scroll to top');
    indicator.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.body.appendChild(indicator);
    return indicator;
}

// Initialize scroll indicator
document.addEventListener('DOMContentLoaded', () => {
    createScrollIndicator();
});
