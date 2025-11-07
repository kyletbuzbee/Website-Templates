// Enterprise Real Estate Solutions - Advanced JavaScript
// Enterprise-grade functionality with cutting-edge features

class EnterpriseRealEstateApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupLoadingScreen();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupScrollEffects();
        this.setupFormValidation();
        this.setupAnimations();
        this.setupMetricsAnimation();
        this.setupParallaxEffects();
        this.setupScrollProgress();
        this.setupPropertySearch();
        this.setupMortgageCalculator();
    }

    // Enterprise loading screen with smooth transitions
    setupLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');

        if (loadingScreen) {
            // Simulate loading time for premium experience
            setTimeout(() => {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    this.startEnterpriseExperience();
                }, 500);
            }, 2000);
        } else {
            this.startEnterpriseExperience();
        }
    }

    startEnterpriseExperience() {
        // Initialize all enterprise features
        document.body.classList.add('enterprise-loaded');

        // Trigger entrance animations
        setTimeout(() => {
            this.triggerEntranceAnimations();
        }, 100);
    }

    // Advanced mobile menu with enterprise animations
    setupMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';

                hamburger.setAttribute('aria-expanded', !isExpanded);
                navMenu.classList.toggle('nav-menu-open');

                // Enterprise hamburger animation
                const lines = hamburger.querySelectorAll('.hamburger-line');
                if (!isExpanded) {
                    lines[0].style.transform = 'rotate(45deg) translate(6px, 6px) scaleX(0.8)';
                    lines[1].style.transform = 'scaleX(0)';
                    lines[2].style.transform = 'rotate(-45deg) translate(6px, -6px) scaleX(0.8)';
                } else {
                    lines[0].style.transform = 'none';
                    lines[1].style.transform = 'none';
                    lines[2].style.transform = 'none';
                }
            });

            // Enterprise menu item animations
            navMenu.addEventListener('click', (e) => {
                if (e.target.classList.contains('nav-link')) {
                    hamburger.setAttribute('aria-expanded', 'false');
                    navMenu.classList.remove('nav-menu-open');

                    const lines = hamburger.querySelectorAll('.hamburger-line');
                    lines[0].style.transform = 'none';
                    lines[1].style.transform = 'none';
                    lines[2].style.transform = 'none';
                }
            });
        }
    }

    // Smooth scrolling with enterprise precision
    setupSmoothScrolling() {
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();

                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight - 30;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth',
                        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
                    });
                }
            });
        });
    }

    // Advanced scroll effects with intersection observer
    setupScrollEffects() {
        const observerOptions = {
            threshold: [0.1, 0.3, 0.6],
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const ratio = entry.intersectionRatio;

                    if (ratio > 0.3) {
                        entry.target.classList.add('animate-fade-in-up');
                    }

                    // Stagger animations for multiple elements
                    if (entry.target.classList.contains('service-card')) {
                        this.staggerAnimation(entry.target, '.service-card', 200);
                    }

                    if (entry.target.classList.contains('property-card')) {
                        this.staggerAnimation(entry.target, '.property-card', 150);
                    }

                    if (entry.target.classList.contains('testimonial-card')) {
                        this.staggerAnimation(entry.target, '.testimonial-card', 150);
                    }
                }
            });
        }, observerOptions);

        // Observe enterprise elements
        const animateElements = document.querySelectorAll(
            '.service-card, .property-card, .testimonial-card, .market-stat, .contact-method'
        );
        animateElements.forEach(el => observer.observe(el));

        // Header scroll effects
        const header = document.querySelector('.header');
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > 100) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }

            lastScrollY = currentScrollY;
        }, { passive: true });
    }

    // Stagger animations for multiple elements
    staggerAnimation(element, selector, delay) {
        const elements = document.querySelectorAll(selector);
        const index = Array.from(elements).indexOf(element);

        if (index >= 0) {
            element.style.animationDelay = `${index * delay}ms`;
        }
    }

    // Advanced animations system
    setupAnimations() {
        this.setupHeroAnimations();
        this.setupScrollTriggeredAnimations();
    }

    setupHeroAnimations() {
        // Hero elements entrance animations
        const heroElements = [
            { selector: '.hero-pretitle', delay: 200 },
            { selector: '.hero-title', delay: 400 },
            { selector: '.hero-subtitle', delay: 600 },
            { selector: '.hero-metrics', delay: 800 },
            { selector: '.hero-actions', delay: 1000 },
            { selector: '.hero-trust', delay: 1200 }
        ];

        heroElements.forEach(item => {
            const element = document.querySelector(item.selector);
            if (element) {
                element.style.animationDelay = `${item.delay}ms`;
                element.classList.add('animate-fade-in-up');
            }
        });
    }

    setupScrollTriggeredAnimations() {
        // Advanced scroll-triggered animations
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;

                    if (element.classList.contains('metric-number')) {
                        this.animateMetricNumber(element);
                    }

                    if (element.classList.contains('market-stats')) {
                        this.animateMarketStats(element);
                    }

                    scrollObserver.unobserve(element);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe metric numbers and stats
        const metricNumbers = document.querySelectorAll('.metric-number[data-target]');
        const marketStats = document.querySelector('.market-stats');

        metricNumbers.forEach(num => scrollObserver.observe(num));
        if (marketStats) scrollObserver.observe(marketStats);
    }

    // Animated metric counters
    setupMetricsAnimation() {
        const metricNumbers = document.querySelectorAll('.metric-number[data-target]');

        metricNumbers.forEach(number => {
            const target = parseInt(number.getAttribute('data-target'));
            const isPercentage = number.textContent.includes('%');

            // Reset to 0 for animation
            number.textContent = '0' + (isPercentage ? '%' : '');

            // Store target for later animation
            number.setAttribute('data-original-target', target);
        });
    }

    animateMetricNumber(element) {
        const target = parseInt(element.getAttribute('data-original-target') || element.getAttribute('data-target'));
        const duration = 2500;
        const start = performance.now();
        const startValue = 0;
        const isPercentage = element.textContent.includes('%');

        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);

            // Advanced easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);

            element.textContent = this.formatNumber(currentValue) + (isPercentage ? '%' : '');

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    animateMarketStats(container) {
        const statItems = container.querySelectorAll('.stat-item .stat-number');

        statItems.forEach((stat, index) => {
            setTimeout(() => {
                this.animateMetricNumber(stat);
            }, index * 300);
        });
    }

    formatNumber(num) {
        if (num >= 1000) {
            return num.toLocaleString();
        }
        return num.toString();
    }

    // Parallax effects for enterprise feel
    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.hero-bg-shape');

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;

            parallaxElements.forEach((element, index) => {
                const speed = (index + 1) * 0.1;
                element.style.transform = `translateY(${rate * speed}px) rotate(${scrolled * 0.01}deg)`;
            });
        }, { passive: true });
    }

    // Scroll progress indicator
    setupScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
        document.body.appendChild(progressBar);

        const progressBarInner = progressBar.querySelector('.scroll-progress-bar');

        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            progressBarInner.style.width = scrolled + '%';
        }, { passive: true });
    }

    // Property search functionality
    setupPropertySearch() {
        const searchForm = document.querySelector('.property-search-form');
        const searchResults = document.querySelector('.search-results');

        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.performPropertySearch(searchForm, searchResults);
            });

            // Real-time search suggestions
            const searchInput = searchForm.querySelector('input[name="location"]');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    this.showSearchSuggestions(e.target.value);
                });
            }
        }
    }

    performPropertySearch(form, resultsContainer) {
        const formData = new FormData(form);
        const searchCriteria = Object.fromEntries(formData);

        // Show loading state
        resultsContainer.innerHTML = '<div class="search-loading">Finding your perfect property...</div>';

        // Simulate search (replace with actual API call)
        setTimeout(() => {
            const mockResults = this.generateMockProperties(searchCriteria);
            this.displaySearchResults(mockResults, resultsContainer);
        }, 2000);
    }

    generateMockProperties(criteria) {
        // Generate mock property results based on search criteria
        const properties = [];
        const propertyTypes = ['Single Family Home', 'Condominium', 'Townhouse', 'Luxury Estate'];
        const neighborhoods = ['Downtown', 'Suburban Heights', 'Waterfront District', 'Historic District'];

        for (let i = 0; i < 6; i++) {
            properties.push({
                id: i + 1,
                price: Math.floor(Math.random() * 2000000) + 200000,
                beds: Math.floor(Math.random() * 5) + 1,
                baths: Math.floor(Math.random() * 4) + 1,
                sqft: Math.floor(Math.random() * 3000) + 800,
                type: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
                neighborhood: neighborhoods[Math.floor(Math.random() * neighborhoods.length)],
                image: `https://images.unsplash.com/photo-${1500000000000 + i}?w=400&h=300&fit=crop`
            });
        }

        return properties;
    }

    displaySearchResults(properties, container) {
        const resultsHTML = properties.map(property => `
            <div class="property-result-card">
                <div class="property-image">
                    <img src="${property.image}" alt="${property.type} in ${property.neighborhood}" loading="lazy">
                    <div class="property-price">$${property.price.toLocaleString()}</div>
                </div>
                <div class="property-details">
                    <h4>${property.type}</h4>
                    <p class="property-location">${property.neighborhood}</p>
                    <div class="property-specs">
                        <span>${property.beds} beds</span>
                        <span>${property.baths} baths</span>
                        <span>${property.sqft.toLocaleString()} sqft</span>
                    </div>
                    <button class="btn btn-primary btn-sm">View Details</button>
                </div>
            </div>
        `).join('');

        container.innerHTML = `<div class="search-results-grid">${resultsHTML}</div>`;
    }

    showSearchSuggestions(query) {
        // Mock search suggestions
        const suggestions = [
            'Downtown District',
            'Suburban Heights',
            'Waterfront Properties',
            'Historic District',
            'Luxury Estates'
        ].filter(suggestion =>
            suggestion.toLowerCase().includes(query.toLowerCase())
        );

        // Display suggestions (implementation would show dropdown)
        console.log('Search suggestions:', suggestions);
    }

    // Mortgage calculator functionality
    setupMortgageCalculator() {
        const calculatorForm = document.querySelector('.mortgage-calculator-form');

        if (calculatorForm) {
            calculatorForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.calculateMortgage(calculatorForm);
            });

            // Real-time calculation on input change
            const inputs = calculatorForm.querySelectorAll('input');
            inputs.forEach(input => {
                input.addEventListener('input', () => {
                    this.calculateMortgage(calculatorForm, false);
                });
            });
        }
    }

    calculateMortgage(form, showResults = true) {
        const formData = new FormData(form);
        const loanAmount = parseFloat(formData.get('loanAmount')) || 0;
        const interestRate = parseFloat(formData.get('interestRate')) || 0;
        const loanTerm = parseInt(formData.get('loanTerm')) || 30;
        const downPayment = parseFloat(formData.get('downPayment')) || 0;

        if (loanAmount <= 0 || interestRate <= 0) {
            return;
        }

        const principal = loanAmount - downPayment;
        const monthlyRate = interestRate / 100 / 12;
        const numberOfPayments = loanTerm * 12;

        const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
                              (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

        const totalPayment = monthlyPayment * numberOfPayments;
        const totalInterest = totalPayment - principal;

        if (showResults) {
            this.displayMortgageResults(monthlyPayment, totalPayment, totalInterest);
        } else {
            // Update real-time display
            const monthlyDisplay = form.querySelector('.monthly-payment-display');
            if (monthlyDisplay) {
                monthlyDisplay.textContent = `$${monthlyPayment.toFixed(2)}`;
            }
        }
    }

    displayMortgageResults(monthlyPayment, totalPayment, totalInterest) {
        const resultsContainer = document.querySelector('.mortgage-results');

        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="mortgage-result-card">
                    <h4>Mortgage Summary</h4>
                    <div class="result-item">
                        <span class="result-label">Monthly Payment:</span>
                        <span class="result-value">$${monthlyPayment.toFixed(2)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Total Payments:</span>
                        <span class="result-value">$${totalPayment.toLocaleString()}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Total Interest:</span>
                        <span class="result-value">$${totalInterest.toLocaleString()}</span>
                    </div>
                    <div class="result-disclaimer">
                        *Results are estimates. Actual rates and terms may vary.
                    </div>
                </div>
            `;

            resultsContainer.classList.add('visible');
        }
    }

    // Enterprise form validation and handling
    setupFormValidation() {
        const forms = document.querySelectorAll('.contact-form, .property-inquiry-form');

        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, select, textarea');

            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
                input.addEventListener('focus', () => this.addFocusEffects(input));
            });

            form.addEventListener('submit', (e) => this.handleEnterpriseFormSubmit(e, form));
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
                } else if (!/^[a-zA-Z\s\-'\.]+$/.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid name';
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

            case 'loanAmount':
                if (!value || parseFloat(value) <= 0) {
                    isValid = false;
                    errorMessage = 'Please enter a valid loan amount';
                }
                break;

            case 'message':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Message is required';
                } else if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Please provide more details (minimum 10 characters)';
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

    addFocusEffects(field) {
        field.parentNode.classList.add('field-focused');

        // Remove focus effect after animation
        setTimeout(() => {
            field.parentNode.classList.remove('field-focused');
        }, 300);
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

        // Shake animation for errors
        field.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            field.style.animation = '';
        }, 500);
    }

    clearFieldError(field) {
        field.classList.remove('field-error');

        const errorElement = field.parentNode.querySelector('.field-error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    handleEnterpriseFormSubmit(e, form) {
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
            this.submitEnterpriseForm(form, formData);
        } else {
            // Scroll to first error with smooth animation
            const firstError = form.querySelector('.field-error');
            if (firstError) {
                firstError.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest'
                });
            }

            // Show enterprise error notification
            this.showEnterpriseNotification('Please correct the highlighted fields', 'error');
        }
    }

    submitEnterpriseForm(form, formData) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        // Enterprise loading state
        submitBtn.textContent = 'Processing Enterprise Inquiry...';
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');

        // Simulate enterprise processing time
        setTimeout(() => {
            submitBtn.textContent = '✓ Enterprise Inquiry Submitted Successfully!';
            submitBtn.classList.remove('loading');
            submitBtn.classList.add('success');

            // Show success notification
            this.showEnterpriseNotification(
                'Thank you for your enterprise real estate inquiry. Our team will contact you within 2 business hours.',
                'success'
            );

            // Reset form after success
            setTimeout(() => {
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('success');

                // Clear any remaining errors
                form.querySelectorAll('.field-error').forEach(field => {
                    this.clearFieldError(field);
                });
            }, 5000);
        }, 3000);
    }

    showEnterpriseNotification(message, type) {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.enterprise-notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create enterprise notification
        const notification = document.createElement('div');
        notification.className = `enterprise-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">${type === 'success' ? '✓' : '⚠'}</div>
                <div class="notification-message">${message}</div>
                <button class="notification-close" aria-label="Close notification">×</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('visible'), 100);

        // Auto remove after 8 seconds
        setTimeout(() => {
            notification.classList.remove('visible');
            setTimeout(() => notification.remove(), 300);
        }, 8000);

        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('visible');
            setTimeout(() => notification.remove(), 300);
        });
    }

    // Trigger entrance animations
    triggerEntranceAnimations() {
        const entranceElements = document.querySelectorAll('.hero-content > *, .service-featured, .about-content > *');

        entranceElements.forEach((element, index) => {
            element.style.animationDelay = `${index * 150}ms`;
            element.classList.add('animate-fade-in-up');
        });
    }
}

// Enterprise notification styles and additional CSS
const enterpriseStyles = `
<style>
/* Enterprise Loading Screen */
.loading-screen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    transition: opacity 0.5s ease, visibility 0.5s ease;
}

.loading-screen.fade-out {
    opacity: 0;
    visibility: hidden;
}

.loading-content {
    text-align: center;
    color: white;
}

.loading-logo h1 {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 1rem;
    letter-spacing: -0.025em;
    background: linear-gradient(135deg, #059669, #047857);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.loading-spinner {
    width: 50px;
    height: 50px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top: 3px solid #059669;
    border-radius: 50%;
    animation: enterprise-spin 1s linear infinite;
    margin: 0 auto 1rem;
}

@keyframes enterprise-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Enterprise Notifications */
.enterprise-notification {
    position: fixed;
    top: 100px;
    right: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    border: 1px solid #e5e7eb;
    min-width: 300px;
    max-width: 400px;
    z-index: 10000;
    transform: translateX(100%);
    opacity: 0;
    transition: all 0.3s ease;
}

.enterprise-notification.visible {
    transform: translateX(0);
    opacity: 1;
}

.enterprise-notification.success {
    border-left: 4px solid #10b981;
}

.enterprise-notification.success .notification-icon {
    color: #10b981;
}

.enterprise-notification.error {
    border-left: 4px solid #ef4444;
}

.enterprise-notification.error .notification-icon {
    color: #ef4444;
}

.notification-content {
    padding: 1rem 1.5rem;
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
}

.notification-icon {
    font-size: 1.25rem;
    font-weight: bold;
    margin-top: 0.125rem;
    flex-shrink: 0;
}

.notification-message {
    flex: 1;
    font-size: 0.875rem;
    line-height: 1.5;
    color: #374151;
}

.notification-close {
    background: none;
    border: none;
    font-size: 1.25rem;
    color: #9ca3af;
    cursor: pointer;
    padding: 0;
    margin-left: 0.5rem;
    transition: color 0.2s ease;
}

.notification-close:hover {
    color: #6b7280;
}

/* Scroll Progress Bar */
.scroll-progress {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: rgba(255, 255, 255, 0.8);
    z-index: 1000;
    backdrop-filter: blur(10px);
}

.scroll-progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #059669, #047857);
    width: 0%;
    transition: width 0.1s ease;
}

/* Property Search Results */
.search-results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
}

.property-result-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.property-result-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
}

.property-image {
    position: relative;
    height: 200px;
    overflow: hidden;
}

.property-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.property-result-card:hover .property-image img {
    transform: scale(1.05);
}

.property-price {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(5, 150, 105, 0.9);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-weight: 600;
    font-size: 0.875rem;
}

.property-details {
    padding: 1.5rem;
}

.property-details h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
}

.property-location {
    color: #6b7280;
    margin-bottom: 1rem;
    font-size: 0.875rem;
}

.property-specs {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    font-size: 0.875rem;
    color: #374151;
}

.property-specs span {
    background: #f3f4f6;
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
}

/* Mortgage Calculator Results */
.mortgage-results {
    margin-top: 2rem;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s ease;
}

.mortgage-results.visible {
    opacity: 1;
    transform: translateY(0);
}

.mortgage-result-card {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
}

.mortgage-result-card h4 {
    margin: 0 0 1.5rem 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
}

.result-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
    border-bottom: 1px solid #f3f4f6;
}

.result-item:last-child {
    border-bottom: none;
}

.result-label {
    font-weight: 500;
    color: #374151;
}

.result-value {
    font-weight: 600;
    font-size: 1.125rem;
    color: #059669;
}

.result-disclaimer {
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid #f3f4f6;
    font-size: 0.875rem;
    color: #6b7280;
    font-style: italic;
}

/* Enterprise Animations */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInLeft {
    from {
        opacity: 0;
        transform: translateX(-30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes fadeInRight {
    from {
        opacity: 0;
        transform: translateX(30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes scaleIn {
    from {
        opacity: 0;
        transform: scale(0.9);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}

/* Animation Classes */
.animate-fade-in-up {
    animation: fadeInUp 0.8s ease-out forwards;
    opacity: 0;
}

.animate-fade-in-left {
    animation: fadeInLeft 0.8s ease-out forwards;
    opacity: 0;
}

.animate-fade-in-right {
    animation: fadeInRight 0.8s ease-out forwards;
    opacity: 0;
}

.animate-scale-in {
    animation: scaleIn 0.6s ease-out forwards;
    opacity: 0;
}

/* Enterprise Form Enhancements */
.field-focused {
    position: relative;
}

.field-focused::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(135deg, #059669, #047857);
    border-radius: 6px;
    z-index: -1;
    opacity: 0.1;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 0.1; }
    50% { opacity: 0.2; }
}

.field-error-message {
    color: #ef4444;
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

/* Enterprise Button States */
.btn.success {
    background: linear-gradient(135deg, #10b981, #059669) !important;
    color: white !important;
}

.btn.loading {
    position: relative;
    color: transparent !important;
}

.btn.loading::after {
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
    animation: enterprise-spin 1s linear infinite;
}

/* Enterprise Mobile Menu */
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

/* Enterprise Focus States */
.form-input:focus,
.form-select:focus,
.form-textarea:focus,
.btn:focus {
    outline: 2px solid #059669;
    outline-offset: 2px;
}

/* Enterprise Print Styles */
@media print {
    .header,
    .hero-visual,
    .footer,
    .loading-screen,
    .enterprise-notification,
    .scroll-progress {
        display: none !important;
    }

    .section {
        page-break-inside: avoid;
    }

    .contact-form {
        display: none !important;
    }

    body {
        font-size: 12px;
    }

    .container {
        max-width: none;
        padding: 0;
    }
}

/* Enterprise Utility Classes */
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

.enterprise-loaded {
    opacity: 1;
    visibility: visible;
}

/* Performance optimizations */
.service-card,
.property-card,
.testimonial-card,
.market-stat,
.contact-method {
    will-change: transform;
}

.service-card:hover,
.property-card:hover,
.testimonial-card:hover,
.market-stat:hover,
.contact-method:hover {
    will-change: transform, box-shadow;
}

/* Search Loading State */
.search-loading {
    text-align: center;
    padding: 3rem;
    color: #6b7280;
    font-size: 1.125rem;
}

.search-loading::after {
    content: '';
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 2px solid #e5e7eb;
    border-top: 2px solid #059669;
    border-radius: 50%;
    animation: enterprise-spin 1s linear infinite;
    margin-left: 1rem;
}
</style>
`;

// Inject enterprise styles
document.head.insertAdjacentHTML('beforeend', enterpriseStyles);

// Initialize the enterprise application
document.addEventListener('DOMContentLoaded', () => {
    new EnterpriseRealEstateApp();
});
