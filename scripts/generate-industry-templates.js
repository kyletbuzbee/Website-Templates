#!/usr/bin/env node

/**
 * Industry Template Generator
 * Generates complete website templates for different industries with 3 style variants
 * Usage: node scripts/generate-industry-templates.js [industry] [style]
 */

const fs = require('fs');
const path = require('path');

// Industry configurations with specific content and branding
const INDUSTRY_CONFIGS = {
    'roofing': {
        name: 'RoofMaster Pro',
        tagline: 'Premium Roofing Services',
        businessModel: 'Local Service Business',
        services: [
            { icon: '🔧', title: 'Roof Repair', desc: 'Expert repair services for leaks, damaged shingles, and structural issues' },
            { icon: '🏠', title: 'Roof Replacement', desc: 'Complete roof replacement with premium materials and warranty protection' },
            { icon: '🔍', title: 'Roof Inspection', desc: 'Thorough roof inspections to identify potential issues before they become major problems' },
            { icon: '🚨', title: 'Emergency Services', desc: '24/7 emergency roof repair services for storm damage and urgent roofing needs' }
        ],
        colors: {
            primary: '#1E40AF',
            secondary: '#64748B',
            accent: '#F59E0B'
        },
        heroTitle: 'Protecting Homes, One Roof at a Time',
        heroSubtitle: 'Expert roofing services with over 15 years of experience. Quality craftsmanship, reliable service, and lasting protection for your home.',
        stats: [
            { number: '5000', label: 'Roofs Completed' },
            { number: '15', label: 'Years Experience' },
            { number: '100', label: 'Satisfaction Rate' },
            { number: '50', label: 'Year Warranty' }
        ]
    },
    'restaurants': {
        name: 'Bella Vista Bistro',
        tagline: 'Authentic Italian Cuisine',
        businessModel: 'Local Service Business',
        services: [
            { icon: '🍽️', title: 'Fine Dining', desc: 'Exquisite Italian dishes prepared with the finest ingredients and traditional recipes' },
            { icon: '🍷', title: 'Wine Selection', desc: 'Curated selection of premium wines from Italy\'s finest vineyards' },
            { icon: '🎉', title: 'Private Events', desc: 'Elegant venue for weddings, corporate events, and special celebrations' },
            { icon: '🚚', title: 'Catering Services', desc: 'Professional catering for events, parties, and corporate functions' }
        ],
        colors: {
            primary: '#DC2626',
            secondary: '#7F1D1D',
            accent: '#F59E0B'
        },
        heroTitle: 'Experience Authentic Italian Cuisine',
        heroSubtitle: 'Indulge in the flavors of Italy with our handcrafted dishes, made with love and the finest ingredients.',
        stats: [
            { number: '15000', label: 'Happy Customers' },
            { number: '25', label: 'Years of Tradition' },
            { number: '500', label: 'Events Hosted' },
            { number: '98', label: 'Customer Satisfaction' }
        ]
    },
    'fitness': {
        name: 'Peak Performance Gym',
        tagline: 'Transform Your Body, Transform Your Life',
        businessModel: 'Local Service Business',
        services: [
            { icon: '💪', title: 'Personal Training', desc: 'One-on-one training sessions tailored to your fitness goals and needs' },
            { icon: '🏋️', title: 'Strength Training', desc: 'State-of-the-art equipment and programs for building strength and muscle' },
            { icon: '🧘', title: 'Yoga & Wellness', desc: 'Mind-body wellness classes including yoga, meditation, and stress relief' },
            { icon: '🏃', title: 'Group Classes', desc: 'High-energy group fitness classes for all skill levels and interests' }
        ],
        colors: {
            primary: '#059669',
            secondary: '#047857',
            accent: '#F59E0B'
        },
        heroTitle: 'Unleash Your Potential',
        heroSubtitle: 'Join our community of fitness enthusiasts and achieve your health and wellness goals with expert guidance.',
        stats: [
            { number: '5000', label: 'Active Members' },
            { number: '50', label: 'Certified Trainers' },
            { number: '100', label: 'Fitness Classes' },
            { number: '95', label: 'Goal Achievement' }
        ]
    },
    'real-estate': {
        name: 'Prime Properties Realty',
        tagline: 'Your Dream Home Awaits',
        businessModel: 'Local Service Business',
        services: [
            { icon: '🏠', title: 'Property Sales', desc: 'Expert guidance through the home buying process with access to exclusive listings' },
            { icon: '📋', title: 'Property Management', desc: 'Comprehensive property management services for landlords and investors' },
            { icon: '🔍', title: 'Market Analysis', desc: 'In-depth market analysis and investment opportunities in your area' },
            { icon: '📊', title: 'Consultation Services', desc: 'Free consultation to help you understand your real estate options' }
        ],
        colors: {
            primary: '#1E40AF',
            secondary: '#1E3A8A',
            accent: '#F59E0B'
        },
        heroTitle: 'Find Your Perfect Property',
        heroSubtitle: 'Trusted real estate professionals helping you find the home of your dreams with personalized service.',
        stats: [
            { number: '2000', label: 'Homes Sold' },
            { number: '15', label: 'Years Experience' },
            { number: '500', label: 'Properties Managed' },
            { number: '98', label: 'Client Satisfaction' }
        ]
    }
};

// Style configurations for the 3 different template styles
const STYLE_CONFIGS = {
    'minimal-creative': {
        name: 'Minimal Creative',
        description: 'Clean, modern design with creative typography and subtle animations',
        cssVariables: {
            primary: '#2563EB',
            secondary: '#64748B',
            accent: '#F59E0B',
            text: '#2D3748',
            light: '#64748B',
            muted: '#9CA3AF',
            bg: '#FFFFFF',
            lightBg: '#F8FAFC',
            darkBg: '#1E293B'
        },
        features: ['creative-typography', 'subtle-animations', 'minimal-layout', 'accent-colors']
    },

    'business-professional': {
        name: 'Business Professional',
        description: 'Corporate, trustworthy appearance with structured layouts',
        cssVariables: {
            primary: '#1E40AF',
            secondary: '#6B7280',
            accent: '#059669',
            text: '#1F2937',
            light: '#6B7280',
            muted: '#9CA3AF',
            bg: '#FFFFFF',
            lightBg: '#F9FAFB',
            darkBg: '#111827'
        },
        features: ['corporate-design', 'structured-layout', 'trust-badges', 'professional-typography']
    },

    'professional-enterprise': {
        name: 'Professional Enterprise',
        description: 'Enterprise-grade features with advanced animations and premium styling',
        cssVariables: {
            primary: '#0F172A',
            secondary: '#64748B',
            accent: '#3B82F6',
            text: '#0F172A',
            light: '#64748B',
            muted: '#94A3B8',
            bg: '#FFFFFF',
            lightBg: '#F8FAFC',
            darkBg: '#0F172A'
        },
        features: ['enterprise-features', 'advanced-animations', 'premium-styling', 'loading-screen']
    }
};

// Template generation functions
class IndustryTemplateGenerator {
    constructor() {
        this.templatesDir = path.join(__dirname, '..', 'ProductionReadyTemplates');
    }

    async generateAllIndustries() {
        const industries = Object.keys(INDUSTRY_CONFIGS);
        const styles = Object.keys(STYLE_CONFIGS);

        console.log(`🚀 Generating templates for ${industries.length} industries with ${styles.length} styles each...`);
        console.log(`📊 Total templates to generate: ${industries.length * styles.length}`);

        for (const industry of industries) {
            console.log(`\n🏭 Processing industry: ${industry}`);

            for (const style of styles) {
                console.log(`  🎨 Generating ${style} template...`);
                await this.generateTemplate(industry, style);
            }
        }

        console.log('\n✅ All templates generated successfully!');
        this.printSummary();
    }

    async generateTemplate(industry, style) {
        const industryConfig = INDUSTRY_CONFIGS[industry];
        const styleConfig = STYLE_CONFIGS[style];

        // Merge colors from industry config with style defaults
        const colors = { ...styleConfig.cssVariables, ...industryConfig.colors };

        const templateDir = path.join(this.templatesDir, industry, style);

        // Create directory structure
        await this.ensureDirectory(templateDir);

        // Generate files
        const html = this.generateHTML(industryConfig, styleConfig, colors);
        const css = this.generateCSS(industryConfig, styleConfig, colors);
        const js = this.generateJS(industryConfig, styleConfig, colors);

        // Write files
        await fs.promises.writeFile(path.join(templateDir, 'index.html'), html);
        await fs.promises.writeFile(path.join(templateDir, 'style.css'), css);
        await fs.promises.writeFile(path.join(templateDir, 'script.js'), js);
    }

    async ensureDirectory(dirPath) {
        try {
            await fs.promises.access(dirPath);
        } catch {
            await fs.promises.mkdir(dirPath, { recursive: true });
        }
    }

    generateHTML(industryConfig, styleConfig, colors) {
        const isEnterprise = styleConfig.name === 'Professional Enterprise';
        const isCreative = styleConfig.name === 'Minimal Creative';

        let serviceOptions = '';
        industryConfig.services.forEach(service => {
            const value = service.title.toLowerCase().replace(/\s+/g, '-');
            serviceOptions += `<option value="${value}">${service.title}</option>`;
        });

        let serviceLinks = '';
        industryConfig.services.forEach(service => {
            serviceLinks += `<li><a href="#services">${service.title}</a></li>`;
        });

        let heroMetrics = '';
        industryConfig.stats.forEach(stat => {
            heroMetrics += `
                        <div class="metric">
                            <div class="metric-number" data-target="${stat.number}">${isEnterprise ? '0' : stat.number}</div>
                            <div class="metric-label">${stat.label}</div>
                        </div>`;
        });

        let servicesGrid = '';
        industryConfig.services.forEach(service => {
            servicesGrid += `
                    <div class="service-card${isEnterprise ? ' premium' : ''}">
                        ${!isCreative ? '<div class="service-header">' : ''}
                        <div class="service-icon">${service.icon}</div>
                        <h3 class="service-title">${service.title}</h3>
                        ${!isCreative ? '</div>' : ''}
                        <p class="service-description">${service.desc}</p>
                        ${!isCreative ? `
                        <ul class="service-features">
                            <li>✓ Professional Service</li>
                            <li>✓ Quality Guarantee</li>
                            <li>✓ Expert Team</li>
                        </ul>
                        ` : ''}
                    </div>`;
        });

        let aboutStats = '';
        industryConfig.stats.forEach(stat => {
            aboutStats += `
                            <div class="stat-item">
                                <div class="stat-number" data-target="${stat.number}">${isEnterprise ? '0' : stat.number}</div>
                                <div class="stat-label">${stat.label}</div>
                            </div>`;
        });

        let showcaseStats = '';
        industryConfig.stats.slice(0, 3).forEach(stat => {
            showcaseStats += `
                            <div class="stat-card">
                                <div class="stat-value">${stat.number}</div>
                                <div class="stat-desc">${stat.label}</div>
                            </div>`;
        });

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${industryConfig.name} - ${industryConfig.tagline}</title>
    <meta name="description" content="${industryConfig.heroSubtitle}">
    <meta property="og:title" content="${industryConfig.name} - ${industryConfig.tagline}">
    <meta property="og:description" content="${industryConfig.heroSubtitle}">
    <meta property="og:image" content="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=630&fit=crop">
    <meta property="og:url" content="https://${industryConfig.name.toLowerCase().replace(/\s+/g, '')}.com">
    <meta property="og:type" content="website">
    <link rel="stylesheet" href="style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700${isCreative ? '&family=Playfair+Display:wght@400;500;600' : '&family=Poppins:wght@400;500;600;700'}${isEnterprise ? ';800' : ''}&display=swap" rel="stylesheet">
    ${isEnterprise ? '<link rel="icon" type="image/x-icon" href="data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><text y=\'.9em\' font-size=\'90\'>🏢</text></svg>">' : ''}
</head>
<body>
    ${isEnterprise ? `
    <!-- Loading Screen -->
    <div class="loading-screen" id="loadingScreen">
        <div class="loading-content">
            <div class="loading-logo">
            <h1>${industryConfig.name}</h1>
            <div class="loading-spinner"></div>
        </div>
        <p>Loading premium experience...</p>
    </div>
    ` : ''}

    <header class="header">
        <nav class="nav">
            <div class="nav-container">
                <div class="logo">
                    <h1>${industryConfig.name}</h1>
                    <span class="logo-tagline">${industryConfig.tagline}</span>
                </div>
                <div class="nav-actions">
                    ${!isCreative ? '<a href="tel:+15551234567" class="nav-cta">📞 Call Now</a>' : ''}
                    <button class="hamburger" aria-label="Toggle navigation menu" aria-expanded="false">
                        <span class="hamburger-line"></span>
                        <span class="hamburger-line"></span>
                        <span class="hamburger-line"></span>
                    </button>
                </div>
                <ul class="nav-menu">
                    <li><a href="#home" class="nav-link">Home</a></li>
                    <li><a href="#services" class="nav-link">Services</a></li>
                    <li><a href="#about" class="nav-link">About</a></li>
                    <li><a href="#testimonials" class="nav-link">Testimonials</a></li>
                    <li><a href="#contact" class="nav-link">Contact</a></li>
                    ${isEnterprise ? '<li><a href="#technology" class="nav-link">Technology</a></li>' : ''}
                </ul>
            </div>
        </nav>
    </header>

    <main>
        <section id="home" class="hero">
            ${isEnterprise ? `
            <div class="hero-background">
                <div class="hero-bg-shape shape-1"></div>
                <div class="hero-bg-shape shape-2"></div>
                <div class="hero-bg-shape shape-3"></div>
            </div>
            ` : ''}
            <div class="hero-container">
                <div class="hero-content">
                    ${!isCreative ? '<div class="hero-pretitle"><span class="pretitle-badge">🏆 Industry Leader</span></div>' : ''}
                    <h2 class="hero-title">
                        ${industryConfig.heroTitle.split(',')[0]}
                        ${isCreative ? '<span class="hero-accent">' + industryConfig.heroTitle.split(',')[1] + '</span>' : ''}
                    </h2>
                    <p class="hero-subtitle">${industryConfig.heroSubtitle}</p>

                    ${!isCreative ? `
                    <div class="hero-metrics">
                        ${heroMetrics}
                    </div>
                    ` : ''}

                    <div class="hero-actions">
                        <a href="#contact" class="btn btn-primary">Get Started</a>
                        <a href="#services" class="btn btn-secondary">Our Services</a>
                    </div>

                    ${!isCreative ? `
                    <div class="hero-trust">
                        <div class="trust-badges">
                            <span class="badge">Licensed & Certified</span>
                            <span class="badge">Insured & Bonded</span>
                            <span class="badge">5-Star Service</span>
                        </div>
                    </div>
                    ` : ''}
                </div>

                ${isEnterprise ? `
                <div class="hero-visual">
                    <div class="hero-showcase">
                        <div class="showcase-stats">
                            ${showcaseStats}
                        </div>
                    </div>
                </div>
                ` : ''}
            </div>
        </section>

        <section id="services" class="services">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">Our Services</h2>
                    <p class="section-subtitle">Professional solutions tailored to your needs</p>
                </div>
                <div class="services-grid">
                    ${servicesGrid}
                </div>
            </div>
        </section>

        ${isEnterprise ? `
        <section id="technology" class="technology">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">Advanced Technology</h2>
                    <p class="section-subtitle">Cutting-edge solutions for modern service delivery</p>
                </div>
                <div class="technology-grid">
                    <div class="tech-card">
                        <div class="tech-visual"><div class="tech-icon">📱</div></div>
                        <div class="tech-content">
                            <h3>Digital Solutions</h3>
                            <p>Advanced digital platforms for seamless service delivery and client communication.</p>
                        </div>
                    </div>
                    <div class="tech-card">
                        <div class="tech-visual"><div class="tech-icon">🤖</div></div>
                        <div class="tech-content">
                            <h3>Smart Automation</h3>
                            <p>AI-powered automation for efficient scheduling, billing, and service optimization.</p>
                        </div>
                    </div>
                    <div class="tech-card">
                        <div class="tech-visual"><div class="tech-icon">📊</div></div>
                        <div class="tech-content">
                            <h3>Data Analytics</h3>
                            <p>Comprehensive analytics and reporting for continuous improvement and insights.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        ` : ''}

        <section id="about" class="about">
            <div class="container">
                <div class="about-content">
                    <div class="about-text">
                        <h2 class="section-title">About ${industryConfig.name}</h2>
                        <p class="about-description">${industryConfig.heroSubtitle}</p>
                        <p class="about-description">We are committed to delivering exceptional service with integrity, professionalism, and attention to detail. Our experienced team combines traditional expertise with modern innovation to provide solutions that exceed expectations.</p>

                        ${!isCreative ? `
                        <div class="about-stats">
                            ${aboutStats}
                        </div>
                        ` : ''}

                        ${isEnterprise ? `
                        <div class="about-values">
                            <div class="value-card">
                                <div class="value-icon">🎯</div>
                                <h4>Excellence</h4>
                                <p>Committed to delivering the highest quality service and results.</p>
                            </div>
                            <div class="value-card">
                                <div class="value-icon">🤝</div>
                                <h4>Integrity</h4>
                                <p>Building trust through honest communication and ethical practices.</p>
                            </div>
                            <div class="value-card">
                                <div class="value-icon">🚀</div>
                                <h4>Innovation</h4>
                                <p>Leveraging cutting-edge technology and modern methodologies.</p>
                            </div>
                        </div>
                        ` : ''}
                    </div>

                    ${!isCreative ? '<div class="about-image"><div class="about-image-placeholder"></div></div>' : ''}
                </div>
            </div>
        </section>

        <section id="testimonials" class="testimonials">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">Client Testimonials</h2>
                    <p class="section-subtitle">What our satisfied clients say</p>
                </div>
                <div class="testimonials-grid">
                    <div class="testimonial-card${isEnterprise ? ' enterprise' : ''}">
                        <div class="testimonial-content">
                            <p class="testimonial-text">"Outstanding service and exceptional results. The team delivered exactly what was promised with professional excellence."</p>
                        </div>
                        <div class="testimonial-author">
                            <div class="author-name">Sarah Johnson</div>
                            <div class="author-title">Satisfied Client</div>
                            ${!isCreative ? '<div class="testimonial-rating">' + '★'.repeat(5) + '</div>' : ''}
                        </div>
                    </div>

                    <div class="testimonial-card${isEnterprise ? ' enterprise' : ''}">
                        <div class="testimonial-content">
                            <p class="testimonial-text">"Professional, reliable, and highly skilled. I would definitely recommend their services to anyone looking for quality work."</p>
                        </div>
                        <div class="testimonial-author">
                            <div class="author-name">Mike Chen</div>
                            <div class="author-title">Happy Customer</div>
                            ${!isCreative ? '<div class="testimonial-rating">' + '★'.repeat(5) + '</div>' : ''}
                        </div>
                    </div>

                    <div class="testimonial-card${isEnterprise ? ' enterprise' : ''}">
                        <div class="testimonial-content">
                            <p class="testimonial-text">"Exceeded all expectations with their attention to detail and commitment to customer satisfaction. Truly exceptional service."</p>
                        </div>
                        <div class="testimonial-author">
                            <div class="author-name">Jennifer Davis</div>
                            <div class="author-title">Valued Client</div>
                            ${!isCreative ? '<div class="testimonial-rating">' + '★'.repeat(5) + '</div>' : ''}
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="contact" class="contact">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">Contact Us Today</h2>
                    <p class="section-subtitle">Ready to experience exceptional service?</p>
                </div>
                <div class="contact-content">
                    <div class="contact-info">
                        <div class="contact-card">
                            <h3>Get Started Today</h3>
                            <p>Contact us for a consultation and discover how we can help you achieve your goals.</p>
                            <div class="contact-details">
                                <div class="contact-item">
                                    <div class="contact-icon">📞</div>
                                    <div class="contact-text">
                                        <div class="contact-label">Phone</div>
                                        <div class="contact-value">(555) 123-4567</div>
                                    </div>
                                </div>
                                <div class="contact-item">
                                    <div class="contact-icon">📧</div>
                                    <div class="contact-text">
                                        <div class="contact-label">Email</div>
                                        <div class="contact-value">info@${industryConfig.name.toLowerCase().replace(/\s+/g, '')}.com</div>
                                    </div>
                                </div>
                                <div class="contact-item">
                                    <div class="contact-icon">📍</div>
                                    <div class="contact-text">
                                        <div class="contact-label">Location</div>
                                        <div class="contact-value">Greater Metropolitan Area</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="contact-form-container">
                        <form class="contact-form" action="#" method="POST">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="firstName" class="form-label">First Name *</label>
                                    <input type="text" id="firstName" name="firstName" class="form-input" required>
                                </div>
                                <div class="form-group">
                                    <label for="lastName" class="form-label">Last Name *</label>
                                    <input type="text" id="lastName" name="lastName" class="form-input" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="email" class="form-label">Email Address *</label>
                                <input type="email" id="email" name="email" class="form-input" required>
                            </div>
                            <div class="form-group">
                                <label for="phone" class="form-label">Phone Number</label>
                                <input type="tel" id="phone" name="phone" class="form-input">
                            </div>
                            <div class="form-group">
                                <label for="service" class="form-label">Service Interested In</label>
                                <select id="service" name="service" class="form-select">
                                    <option value="">Select a service</option>
                                    ${serviceOptions}
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="message" class="form-label">Message</label>
                                <textarea id="message" name="message" class="form-textarea" rows="4" placeholder="Tell us about your needs..."></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary btn-full">Send Message</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand">
                    <h3>${industryConfig.name}</h3>
                    <p>${industryConfig.heroSubtitle}</p>
                    ${!isCreative ? `
                    <div class="footer-certifications">
                        <span class="certification">Licensed Professional</span>
                        <span class="certification">Certified Service</span>
                        <span class="certification">Quality Guarantee</span>
                    </div>
                    ` : ''}
                </div>
                <div class="footer-links">
                    <div class="footer-section">
                        <h4>Services</h4>
                        <ul>
                            ${serviceLinks}
                        </ul>
                    </div>
                    <div class="footer-section">
                        <h4>Company</h4>
                        <ul>
                            <li><a href="#about">About Us</a></li>
                            <li><a href="#testimonials">Testimonials</a></li>
                            <li><a href="#contact">Contact</a></li>
                        </ul>
                    </div>
                    <div class="footer-section">
                        <h4>Connect</h4>
                        <div class="social-links">
                            <a href="#" aria-label="Facebook" class="social-link">📘</a>
                            <a href="#" aria-label="Twitter" class="social-link">🐦</a>
                            <a href="#" aria-label="Instagram" class="social-link">📷</a>
                            <a href="#" aria-label="LinkedIn" class="social-link">💼</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 ${industryConfig.name}. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script src="script.js" defer></script>
</body>
</html>`;
    }

    generateCSS(industryConfig, styleConfig, colors) {
        const isEnterprise = styleConfig.name === 'Professional Enterprise';
        const isCreative = styleConfig.name === 'Minimal Creative';

        let css = `/* --- CSS Reset --- */
*,
*::before,
*::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

html {
    scroll-behavior: smooth;
}

body {
    font-family: ${isCreative ? "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" : "'Poppins', sans-serif"};
    line-height: 1.6;
    color: ${colors.text};
    background-color: ${colors.bg};
    font-size: 16px;
    font-weight: 400;
    ${isEnterprise ? '-webkit-font-smoothing: antialiased;\n    -moz-osx-font-smoothing: grayscale;' : ''}
}

/* --- CSS Variables --- */
:root {
    --primary-color: ${colors.primary};
    --primary-hover: ${colors.primary}dd;
    --secondary-color: ${colors.secondary};
    --accent-color: ${colors.accent};
    --accent-hover: ${colors.accent}dd;
    --text-color: ${colors.text};
    --text-light: ${colors.light};
    --text-muted: ${colors.muted};
    --bg-color: ${colors.bg};
    --bg-light: ${colors.lightBg};
    --bg-dark: ${colors.darkBg};
    --border-color: #e5e7eb;
    --border-light: #f3f4f6;
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    --border-radius: ${isEnterprise ? '8px' : '6px'};
    --border-radius-lg: ${isEnterprise ? '12px' : '8px'};
    --border-radius-xl: ${isEnterprise ? '16px' : '12px'};
    --border-radius-2xl: ${isEnterprise ? '24px' : '16px'};
    --transition-fast: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    --transition-slow: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    ${isEnterprise ? '--z-fixed: 1030;\n    --z-modal: 1050;' : ''}
}

/* --- Loading Screen --- */`;

        if (isEnterprise) {
            css += `
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
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.loading-spinner {
    width: 50px;
    height: 50px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top: 3px solid #3b82f6;
    border-radius: 50%;
    animation: enterprise-spin 1s linear infinite;
    margin: 0 auto 1rem;
}

@keyframes enterprise-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}`;
        }

        css += `
/* --- Typography --- */
h1, h2, h3, h4, h5, h6 {
    font-family: ${isCreative ? "'Playfair Display', serif" : "'Poppins', sans-serif"};
    font-weight: 700;
    line-height: 1.2;
    color: var(--text-color);
    letter-spacing: -0.025em;
}

h1 { font-size: clamp(2.5rem, 5vw, ${isEnterprise ? '5rem' : '4rem'}); ${isEnterprise ? 'font-weight: 800;' : ''} }
h2 { font-size: clamp(2rem, 4vw, ${isEnterprise ? '3.5rem' : '3rem'}); }
h3 { font-size: clamp(1.5rem, 3vw, ${isEnterprise ? '2.5rem' : '2.25rem'}); }
h4 { font-size: clamp(1.25rem, 2.5vw, ${isEnterprise ? '2rem' : '1.875rem'}); }

p {
    margin-bottom: 1rem;
    color: var(--text-light);
    line-height: 1.7;
    font-weight: 400;
}

/* --- Layout Utilities --- */
.container {
    max-width: ${isEnterprise ? '1280px' : '1200px'};
    margin: 0 auto;
    padding: 0 1rem;
}

.section {
    padding: ${isEnterprise ? '6rem' : '5rem'} 0;
    position: relative;
}

/* --- Header & Navigation --- */
.header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(${isEnterprise ? '20px' : '10px'});
    border-bottom: 1px solid var(--border-light);
    z-index: ${isEnterprise ? 'var(--z-fixed)' : '1000'};
    transition: var(--transition);
    ${isEnterprise ? 'box-shadow: var(--shadow-sm);' : ''}
}

.nav {
    padding: ${isEnterprise ? '1.25rem' : '1rem'} 0;
}

.nav-container {
    max-width: ${isEnterprise ? '1280px' : '1200px'};
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.logo h1 {
    font-size: ${isEnterprise ? '1.75rem' : '1.5rem'};
    font-weight: ${isEnterprise ? '800' : '700'};
    color: var(--primary-color);
    margin: 0;
    letter-spacing: -0.025em;
}

.logo-tagline {
    display: block;
    font-size: 0.75rem;
    color: ${isEnterprise ? 'var(--accent-color)' : 'var(--text-muted)'};
    font-weight: ${isEnterprise ? '600' : '500'};
    margin-top: 0.25rem;
    font-family: 'Inter', sans-serif;
    ${isEnterprise ? "text-transform: uppercase;\n    letter-spacing: 0.1em;" : ''}
}

.nav-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.nav-cta {
    background-color: var(--accent-color);
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: var(--border-radius);
    text-decoration: none;
    font-weight: 600;
    font-size: 0.875rem;
    transition: var(--transition);
    border: 2px solid var(--accent-color);
}

.nav-cta:hover {
    background-color: var(--accent-hover);
    border-color: var(--accent-hover);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
}

.hamburger {
    display: none;
    flex-direction: column;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    gap: 4px;
}

.hamburger-line {
    width: 24px;
    height: 2px;
    background-color: var(--text-color);
    transition: var(--transition);
    transform-origin: center;
}

.nav-menu {
    display: flex;
    list-style: none;
    gap: ${isEnterprise ? '3rem' : '2.5rem'};
    margin: 0;
}

.nav-link {
    text-decoration: none;
    color: var(--text-color);
    font-weight: 500;
    font-size: 0.95rem;
    transition: var(--transition);
    position: relative;
    padding: 0.5rem 0;
    font-family: 'Inter', sans-serif;
}

.nav-link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--accent-color), var(--primary-color));
    transition: var(--transition);
}

.nav-link:hover::after,
.nav-link:focus::after {
    width: 100%;
}

/* --- Hero Section --- */
.hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    background: linear-gradient(135deg, var(--bg-light) 0%, #ffffff 100%);
    position: relative;
    overflow: hidden;
    padding-top: ${isEnterprise ? '100px' : '80px'};
    ${isEnterprise ? 'color: white;' : ''}
}`;

        if (isEnterprise) {
            css += `
.hero-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
}

.hero-bg-shape {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(40px);
}

.shape-1 {
    width: 300px;
    height: 300px;
    top: 10%;
    left: -5%;
    animation: float 6s ease-in-out infinite;
}

.shape-2 {
    width: 200px;
    height: 200px;
    top: 60%;
    right: -3%;
    animation: float 8s ease-in-out infinite reverse;
}

.shape-3 {
    width: 150px;
    height: 150px;
    bottom: 20%;
    left: 50%;
    animation: float 7s ease-in-out infinite;
}

@keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
}`;
        }

        css += `
.hero-container {
    max-width: ${isEnterprise ? '1280px' : '1200px'};
    margin: 0 auto;
    padding: 0 1rem;
    display: grid;
    grid-template-columns: 1fr;
    gap: 3rem;
    align-items: center;
    position: relative;
    z-index: 2;
}

.hero-content {
    text-align: center;
    ${isEnterprise ? 'text-align: left;' : ''}
}

.hero-pretitle {
    margin-bottom: 1.5rem;
}

.pretitle-badge {
    background: linear-gradient(135deg, var(--accent-color), var(--primary-color));
    color: white;
    padding: 0.5rem 1rem;
    border-radius: var(--border-radius-2xl);
    font-size: 0.875rem;
    font-weight: 600;
    display: inline-block;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    box-shadow: var(--shadow-md);
}

.hero-title {
    font-size: clamp(2.5rem, 6vw, ${isEnterprise ? '5rem' : '4rem'});
    font-weight: ${isEnterprise ? '800' : '700'};
    margin-bottom: 1.5rem;
    line-height: 1.1;
    ${isCreative ? 'color: var(--text-color);' : ''}
}

.hero-accent {
    background: linear-gradient(135deg, var(--accent-color), var(--primary-color));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: block;
}

.hero-subtitle {
    font-size: clamp(1.125rem, 2.5vw, 1.5rem);
    color: ${isEnterprise ? 'rgba(255, 255, 255, 0.9)' : 'var(--text-light)'};
    margin-bottom: 2rem;
    max-width: ${isEnterprise ? '600px' : '700px'};
    margin-left: auto;
    margin-right: auto;
    line-height: 1.6;
    font-weight: 400;
}

.hero-metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 2rem;
    margin: 3rem 0;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: var(--border-radius-xl);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.metric {
    text-align: center;
}

.metric-number {
    font-size: 2.5rem;
    font-weight: 800;
    color: ${isEnterprise ? 'white' : 'var(--primary-color)'};
    margin-bottom: 0.5rem;
    display: block;
}

.metric-label {
    font-size: 0.875rem;
    color: ${isEnterprise ? 'rgba(255, 255, 255, 0.8)' : 'var(--text-light)'};
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.1em;
}

.hero-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    margin: 2rem 0;
}

.hero-trust {
    margin-top: 2rem;
}

.trust-badges {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

.badge {
    background: rgba(255, 255, 255, 0.1);
    color: ${isEnterprise ? 'white' : 'var(--text-color)'};
    padding: 0.5rem 1rem;
    border-radius: var(--border-radius);
    font-size: 0.75rem;
    font-weight: 600;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.hero-visual {
    display: none;
    ${isEnterprise ? 'display: block;' : ''}
}

.hero-showcase {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border-radius: var(--border-radius-xl);
    padding: 2rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.showcase-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
}

.stat-card {
    text-align: center;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: var(--border-radius-lg);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-value {
    font-size: 2rem;
    font-weight: 800;
    color: white;
    display: block;
    margin-bottom: 0.25rem;
}

.stat-desc {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.1em;
}

/* --- Services Section --- */
.services {
    background-color: var(--bg-light);
    padding: ${isEnterprise ? '6rem' : '5rem'} 0;
}

.section-header {
    text-align: center;
    margin-bottom: ${isEnterprise ? '4rem' : '3rem'};
}

.section-title {
    font-size: clamp(2rem, 4vw, ${isEnterprise ? '3.5rem' : '3rem'});
    font-weight: ${isEnterprise ? '800' : '700'};
    margin-bottom: 1rem;
    color: var(--text-color);
}

.section-subtitle {
    font-size: 1.125rem;
    color: var(--text-light);
    max-width: 600px;
    margin: 0 auto;
    font-weight: 400;
}

.services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(${isEnterprise ? '350px' : '300px'}, 1fr));
    gap: ${isEnterprise ? '2rem' : '1.5rem'};
    margin-top: 3rem;
}

.service-card {
    background: white;
    padding: ${isEnterprise ? '2.5rem' : '2rem'};
    border-radius: var(--border-radius-xl);
    box-shadow: var(--shadow-md);
    transition: var(--transition);
    border: 1px solid var(--border-light);
    position: relative;
    overflow: hidden;
}

.service-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-xl);
    border-color: var(--primary-color);
}

.service-card.premium {
    background: linear-gradient(135deg, white 0%, var(--bg-light) 100%);
    border: 2px solid transparent;
    background-clip: padding-box;
    position: relative;
}

.service-card.premium::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
    border-radius: var(--border-radius-xl);
    padding: 2px;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    z-index: -1;
}

.service-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
}

.service-icon {
    font-size: 2.5rem;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
    color: white;
    border-radius: var(--border-radius-lg);
    flex-shrink: 0;
}

.service-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-color);
    margin-bottom: 1rem;
}

.service-description {
    color: var(--text-light);
    line-height: 1.6;
    margin-bottom: 1.5rem;
}

.service-features {
    list-style: none;
    padding: 0;
    margin: 0;
}

.service-features li {
    color: var(--text-light);
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

/* --- Technology Section --- */`;

        if (isEnterprise) {
            css += `
.technology {
    background: linear-gradient(135deg, var(--bg-dark) 0%, #1e293b 100%);
    color: white;
    padding: 6rem 0;
}

.technology-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    margin-top: 4rem;
}

.tech-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border-radius: var(--border-radius-xl);
    padding: 2rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: var(--transition);
}

.tech-card:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.15);
}

.tech-visual {
    margin-bottom: 1.5rem;
}

.tech-icon {
    font-size: 3rem;
    display: block;
    text-align: center;
}

.tech-content h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: white;
}

.tech-content p {
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.6;
}
` : ''}

/* --- About Section --- */
.about {
    background-color: var(--bg-color);
    padding: ${isEnterprise ? '6rem' : '5rem'} 0;
}

.about-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 3rem;
    align-items: center;
}

.about-text {
    ${isEnterprise ? 'max-width: 600px;' : ''}
}

.about-description {
    font-size: 1.125rem;
    line-height: 1.7;
    margin-bottom: 2rem;
}

.about-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
}

.stat-item {
    text-align: center;
    padding: 1.5rem;
    background: var(--bg-light);
    border-radius: var(--border-radius-lg);
    border: 1px solid var(--border-light);
}

.stat-number {
    font-size: 2rem;
    font-weight: 800;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
    display: block;
}

.stat-label {
    font-size: 0.875rem;
    color: var(--text-light);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.1em;
}

.about-values {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
}

.value-card {
    text-align: center;
    padding: 2rem;
    background: white;
    border-radius: var(--border-radius-xl);
    box-shadow: var(--shadow-md);
    border: 1px solid var(--border-light);
}

.value-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    display: block;
}

.value-card h4 {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--text-color);
}

.value-card p {
    color: var(--text-light);
    line-height: 1.6;
}

.about-image {
    position: relative;
}

.about-image-placeholder {
    width: 100%;
    height: 400px;
    background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
    border-radius: var(--border-radius-xl);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.5rem;
    font-weight: 600;
}

/* --- Testimonials Section --- */
.testimonials {
    background-color: var(--bg-light);
    padding: ${isEnterprise ? '6rem' : '5rem'} 0;
}

.testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
}

.testimonial-card {
    background: white;
    padding: 2rem;
    border-radius: var(--border-radius-xl);
    box-shadow: var(--shadow-md);
    border: 1px solid var(--border-light);
    transition: var(--transition);
}

.testimonial-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-xl);
}

.testimonial-card.enterprise {
    background: linear-gradient(135deg, white 0%, var(--bg-light) 100%);
    border: 2px solid transparent;
    background-clip: padding-box;
    position: relative;
}

.testimonial-card.enterprise::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
    border-radius: var(--border-radius-xl);
    padding: 2px;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    z-index: -1;
}

.testimonial-content {
    margin-bottom: 1.5rem;
}

.testimonial-text {
    font-size: 1.125rem;
    line-height: 1.6;
    color: var(--text-light);
    font-style: italic;
}

.testimonial-author {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
}

.author-name {
    font-weight: 600;
    color: var(--text-color);
}

.author-title {
    color: var(--text-light);
    font-size: 0.875rem;
}

.testimonial-rating {
    color: #fbbf24;
    font-size: 1.125rem;
}

/* --- Contact Section --- */
.contact {
    background-color: var(--bg-color);
    padding: ${isEnterprise ? '6rem' : '5rem'} 0;
}

.contact-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 3rem;
}

.contact-info {
    ${isEnterprise ? 'max-width: 500px;' : ''}
}

.contact-card {
    background: var(--bg-light);
    padding: 2rem;
    border-radius: var(--border-radius-xl);
    border: 1px solid var(--border-light);
}

.contact-card h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--text-color);
}

.contact-card p {
    color: var(--text-light);
    margin-bottom: 2rem;
    line-height: 1.6;
}

.contact-details {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.contact-item {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.contact-icon {
    font-size: 1.5rem;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--primary-color);
    color: white;
    border-radius: var(--border-radius);
    flex-shrink: 0;
}

.contact-text {
    flex: 1;
}

.contact-label {
    font-size: 0.75rem;
    color: var(--text-light);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 600;
    margin-bottom: 0.25rem;
}

.contact-value {
    color: var(--text-color);
    font-weight: 500;
}

.contact-form-container {
    background: white;
    padding: 2rem;
    border-radius: var(--border-radius-xl);
    box-shadow: var(--shadow-md);
    border: 1px solid var(--border-light);
}

.contact-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-color);
    margin-bottom: 0.5rem;
}

.form-input,
.form-select,
.form-textarea {
    padding: 0.75rem 1rem;
    border: 2px solid var(--border-light);
    border-radius: var(--border-radius);
    font-size: 1rem;
    font-family: inherit;
    transition: var(--transition);
    background: var(--bg-color);
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea {
    resize: vertical;
    min-height: 120px;
}

.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 2rem;
    border-radius: var(--border-radius);
    font-size: 1rem;
    font-weight: 600;
    text-decoration: none;
    border: 2px solid transparent;
    cursor: pointer;
    transition: var(--transition);
    font-family: inherit;
}

.btn-primary {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.btn-primary:hover {
    background: var(--primary-hover);
    border-color: var(--primary-hover);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
}

.btn-secondary {
    background: transparent;
    color: var(--primary-color);
    border-color: var(--primary-color);
}

.btn-secondary:hover {
    background: var(--primary-color);
    color: white;
}

.btn-full {
    width: 100%;
}

/* --- Footer --- */
.footer {
    background: var(--bg-dark);
    color: white;
    padding: 3rem 0 1rem;
}

.footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 3rem;
    margin-bottom: 2rem;
}

.footer-brand h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: white;
}

.footer-brand p {
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.6;
    margin-bottom: 1.5rem;
}

.footer-certifications {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.certification {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: var(--border-radius);
    font-size: 0.75rem;
    font-weight: 600;
    border: 1px solid rgba(255, 255, 255, 0.2);
    display: inline-block;
    width: fit-content;
}

.footer-links {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.footer-section h4 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: white;
}

.footer-section ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.footer-section li {
    margin-bottom: 0.5rem;
}

.footer-section a {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    transition: var(--transition);
}

.footer-section a:hover {
    color: white;
}

.social-links {
    display: flex;
    gap: 1rem;
}

.social-link {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border-radius: var(--border-radius);
    text-decoration: none;
    transition: var(--transition);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.social-link:hover {
    background: white;
    color: var(--primary-color);
    transform: translateY(-2px);
}

.footer-bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 2rem;
    text-align: center;
}

.footer-bottom p {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.875rem;
}

/* --- Mobile Navigation --- */
@media (max-width: 768px) {
    .nav-menu {
        position: fixed;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        flex-direction: column;
        padding: 2rem;
        gap: 1.5rem;
        box-shadow: var(--shadow-xl);
        transform: translateY(-100%);
        opacity: 0;
        visibility: hidden;
        transition: var(--transition);
        border-top: 1px solid var(--border-light);
    }

    .nav-menu.active {
        transform: translateY(0);
        opacity: 1;
        visibility: visible;
    }

    .hamburger {
        display: flex;
    }

    .hamburger.active .hamburger-line:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }

    .hamburger.active .hamburger-line:nth-child(2) {
        opacity: 0;
    }

    .hamburger.active .hamburger-line:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }

    .hero-container {
        text-align: center;
    }

    .hero-actions {
        flex-direction: column;
        align-items: center;
    }

    .hero-metrics {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        padding: 1.5rem;
    }

    .form-row {
        grid-template-columns: 1fr;
    }

    .contact-content {
        grid-template-columns: 1fr;
    }

    .about-content {
        grid-template-columns: 1fr;
    }

    .showcase-stats {
        grid-template-columns: 1fr;
    }
}

/* --- Animations --- */
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

@keyframes countUp {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.fade-in-up {
    animation: fadeInUp 0.6s ease-out forwards;
}

${isCreative ? `
/* --- Creative Specific Styles --- */
.hero-title {
    position: relative;
}

.hero-title::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, var(--accent-color), var(--primary-color));
    border-radius: 2px;
}

.service-card {
    position: relative;
    overflow: hidden;
}

.service-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
}

.service-card:hover::before {
    left: 100%;
}
` : ''}

${isEnterprise ? `
/* --- Enterprise Specific Styles --- */
.hero {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
}

.metric-number,
.stat-number {
    animation: countUp 2s ease-out forwards;
}

.testimonial-card,
.service-card {
    animation: fadeInUp 0.6s ease-out forwards;
    animation-fill-mode: both;
}

.testimonial-card:nth-child(1) { animation-delay: 0.1s; }
.testimonial-card:nth-child(2) { animation-delay: 0.2s; }
.testimonial-card:nth-child(3) { animation-delay: 0.3s; }

.service-card:nth-child(1) { animation-delay: 0.1s; }
.service-card:nth-child(2) { animation-delay: 0.2s; }
.service-card:nth-child(3) { animation-delay: 0.3s; }
.service-card:nth-child(4) { animation-delay: 0.4s; }
` : ''}
`;

        return css;
    }

    generateJS(industryConfig, styleConfig, colors) {
        const isEnterprise = styleConfig.name === 'Professional Enterprise';

        return `// ${styleConfig.name} Template JavaScript
// Industry: ${industryConfig.name}

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');

            // Update aria-expanded
            const isExpanded = this.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);
        });
    }

    // Smooth Scrolling for Navigation Links
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (hamburger && hamburger.classList.contains('active')) {
                    hamburger.click();
                }
            }
        });
    });

    // Header Background on Scroll
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
    });

    ${isEnterprise ? `
// Enterprise Features: Loading Screen
    const loadingScreen = document.getElementById('loadingScreen');

    if (loadingScreen) {
        // Hide loading screen after page loads
        setTimeout(function() {
            loadingScreen.classList.add('fade-out');
            setTimeout(function() {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 2000);
    }

    // Enterprise Features: Animated Counters
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;

        const timer = setInterval(function() {
            current += step;
            if (current >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    }

    // Intersection Observer for counters
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('[data-target]');
                counters.forEach(counter => {
                    if (!counter.classList.contains('animated')) {
                        counter.classList.add('animated');
                        animateCounter(counter);
                    }
                });
            }
        });
    }, observerOptions);

    // Observe sections with counters
    const sectionsWithCounters = document.querySelectorAll('.hero-metrics, .about-stats');
    sectionsWithCounters.forEach(section => {
        observer.observe(section);
    });
` : ''}

    // Form Validation
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Basic form validation
            const requiredFields = contactForm.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = '#ef4444';
                    isValid = false;
                } else {
                    field.style.borderColor = '#10b981';
                }
            });

            if (isValid) {
                // Simulate form submission
                const submitBtn = contactForm.querySelector('.btn-primary');
                const originalText = submitBtn.textContent;

                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;

                setTimeout(function() {
                    submitBtn.textContent = 'Message Sent!';
                    submitBtn.style.backgroundColor = '#10b981';
                    submitBtn.style.borderColor = '#10b981';

                    setTimeout(function() {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.backgroundColor = '';
                        submitBtn.style.borderColor = '';
                        contactForm.reset();
                    }, 2000);
                }, 1500);
            }
        });
    }

    // Add fade-in animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe sections for fade-in animations
    const sections = document.querySelectorAll('.service-card, .testimonial-card, .contact-card');
    sections.forEach(section => {
        fadeObserver.observe(section);
    });

    // Service card hover effects
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    console.log('${styleConfig.name} template initialized for ${industryConfig.name}');
});
`;
    }

    printSummary() {
        console.log('\n🎉 Template Generation Summary:');
        console.log('================================');

        const industries = Object.keys(INDUSTRY_CONFIGS);
        const styles = Object.keys(STYLE_CONFIGS);

        industries.forEach(industry => {
            console.log(`\n🏭 ${industry.toUpperCase()}:`);
            styles.forEach(style => {
                const templatePath = path.join(this.templatesDir, industry, style);
                console.log(`  ✅ ${style}: ${templatePath}`);
            });
        });

        console.log(`\n📊 Total: ${industries.length} industries × ${styles.length} styles = ${industries.length * styles.length} templates`);
        console.log('\n🚀 Ready to use! Open any index.html file in your browser to preview.');
    }
}

// CLI Interface
async function main() {
    const args = process.argv.slice(2);
    const generator = new IndustryTemplateGenerator();

    if (args.length === 0) {
        // Generate all templates
        await generator.generateAllIndustries();
    } else if (args.length === 1) {
        // Generate all styles for specific industry
        const [industry] = args;
        if (!INDUSTRY_CONFIGS[industry]) {
            console.error(`❌ Industry "${industry}" not found. Available: ${Object.keys(INDUSTRY_CONFIGS).join(', ')}`);
            process.exit(1);
        }

        console.log(`🏭 Generating all styles for ${industry}...`);
        const styles = Object.keys(STYLE_CONFIGS);

        for (const style of styles) {
            console.log(`  🎨 Generating ${style} template...`);
            await generator.generateTemplate(industry, style);
        }

        console.log('✅ Industry templates generated successfully!');
    } else if (args.length === 2) {
        // Generate specific industry and style
        const [industry, style] = args;

        if (!INDUSTRY_CONFIGS[industry]) {
            console.error(`❌ Industry "${industry}" not found. Available: ${Object.keys(INDUSTRY_CONFIGS).join(', ')}`);
            process.exit(1);
        }

        if (!STYLE_CONFIGS[style]) {
            console.error(`❌ Style "${style}" not found. Available: ${Object.keys(STYLE_CONFIGS).join(', ')}`);
            process.exit(1);
        }

        console.log(`🎨 Generating ${style} template for ${industry}...`);
        await generator.generateTemplate(industry, style);
        console.log('✅ Template generated successfully!');
    } else {
        console.log('Usage:');
        console.log('  node generate-industry-templates.js                    # Generate all templates');
        console.log('  node generate-industry-templates.js <industry>        # Generate all styles for industry');
        console.log('  node generate-industry-templates.js <industry> <style> # Generate specific template');
        console.log('');
        console.log('Available industries:', Object.keys(INDUSTRY_CONFIGS).join(', '));
        console.log('Available styles:', Object.keys(STYLE_CONFIGS).join(', '));
        process.exit(1);
    }
}

// Run the generator
main().catch(console.error);
