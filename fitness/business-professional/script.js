// Business Professional Fitness Template JavaScript

document.addEventListener('DOMContentLoaded', function() {
// Initialize all interactive features
    initializeNavigation();
    initializeTrainers();
    initializeTestimonials();
    initializeContactForm();
    initializeScrollEffects();
    initializeLiveStats();
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

// Trainers section functionality
function initializeTrainers() {
    const trainerCards = document.querySelectorAll('.trainer-card');

    trainerCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Testimonials carousel
function initializeTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dot');
    let currentIndex = 0;
    let autoplayInterval;

    function showTestimonial(index) {
        testimonials.forEach(testimonial => testimonial.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
        currentIndex = index;
    }

    function nextTestimonial() {
        const nextIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(nextIndex);
    }

    function startAutoplay() {
        autoplayInterval = setInterval(nextTestimonial, 5000);
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showTestimonial(index);
            stopAutoplay();
            startAutoplay();
        });
    });

    // Pause autoplay on hover
    const testimonialsSection = document.querySelector('.testimonials');
    if (testimonialsSection) {
        testimonialsSection.addEventListener('mouseenter', stopAutoplay);
        testimonialsSection.addEventListener('mouseleave', startAutoplay);
    }

    // Start autoplay
    startAutoplay();
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

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .trainer-card, .testimonial-card');
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
});

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

// Live stats simulation for premium gym experience
function initializeLiveStats() {
    // Create stats display in hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const statsContainer = document.createElement('div');
        statsContainer.className = 'live-stats';
        statsContainer.innerHTML = `
            <div class="stat-item">
                <div class="stat-number" id="memberCount">1,247</div>
                <div class="stat-label">Active Members</div>
            </div>
            <div class="stat-item">
                <div class="stat-number" id="classAttendance">89%</div>
                <div class="stat-label">Class Attendance</div>
            </div>
            <div class="stat-item">
                <div class="stat-number" id="equipmentUtilization">94%</div>
                <div class="stat-label">Equipment Usage</div>
            </div>
        `;

        // Insert before hero actions
        const heroActions = heroSection.querySelector('.hero-actions');
        if (heroActions) {
            heroSection.querySelector('.hero-content').insertBefore(statsContainer, heroActions);
        }

        // Start live updates
        startLiveStatsUpdates();
    }
}

function startLiveStatsUpdates() {
    // Update stats every 8 seconds with subtle changes
    setInterval(() => {
        updateMemberCount();
        updateClassAttendance();
        updateEquipmentUtilization();
    }, 8000);
}

function updateMemberCount() {
    const memberElement = document.getElementById('memberCount');
    if (memberElement) {
        const currentCount = parseInt(memberElement.textContent.replace(',', ''));
        const change = Math.floor(Math.random() * 6) - 3; // -3 to +2
        const newCount = Math.max(1200, currentCount + change);

        // Animate the change
        animateNumberChange(memberElement, currentCount, newCount, 2000);
    }
}

function updateClassAttendance() {
    const attendanceElement = document.getElementById('classAttendance');
    if (attendanceElement) {
        const currentPercent = parseInt(attendanceElement.textContent);
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const newPercent = Math.max(80, Math.min(98, currentPercent + change));

        animateNumberChange(attendanceElement, currentPercent, newPercent, 1500, '%');
    }
}

function updateEquipmentUtilization() {
    const utilizationElement = document.getElementById('equipmentUtilization');
    if (utilizationElement) {
        const currentPercent = parseInt(utilizationElement.textContent);
        const change = Math.floor(Math.random() * 4) - 2; // -2 to +1
        const newPercent = Math.max(85, Math.min(98, currentPercent + change));

        animateNumberChange(utilizationElement, currentPercent, newPercent, 1800, '%');
    }
}

function animateNumberChange(element, from, to, duration, suffix = '') {
    const startTime = Date.now();
    const isFormatted = element.id === 'memberCount';

    function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(from + (to - from) * easeOut);

        if (isFormatted) {
            element.textContent = current.toLocaleString();
        } else {
            element.textContent = current + suffix;
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// Add live stats styles
const liveStatsStyles = `
    .live-stats {
        display: flex;
        justify-content: center;
        gap: 2rem;
        margin: 2rem 0;
        flex-wrap: wrap;
    }

    .stat-item {
        text-align: center;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 12px;
        padding: 1.5rem;
        min-width: 120px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        transition: all 0.3s ease;
    }

    .stat-item:hover {
        transform: translateY(-3px);
        background: rgba(255, 255, 255, 0.15);
    }

    .stat-number {
        font-size: 2rem;
        font-weight: 800;
        color: #fbbf24;
        margin-bottom: 0.5rem;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .stat-label {
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.9);
        font-weight: 500;
    }

    @media (max-width: 768px) {
        .live-stats {
            gap: 1rem;
        }

        .stat-item {
            min-width: 100px;
            padding: 1rem;
        }

        .stat-number {
            font-size: 1.5rem;
        }
    }
`;

const liveStatsStyleSheet = document.createElement('style');
liveStatsStyleSheet.textContent = liveStatsStyles;
document.head.appendChild(liveStatsStyleSheet);
