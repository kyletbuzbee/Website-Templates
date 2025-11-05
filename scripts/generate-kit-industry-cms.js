#!/usr/bin/env node

/**
 * Generate Kit-Industry CMS Integration Configurations
 * Creates industry-specific CMS integration files for each kit
 */

const fs = require('fs');
const path = require('path');

// Define kits and industries
const kits = ['business', 'creative', 'minimal', 'premium-interactive', 'starter'];
const industries = [
  'contractors-trades',
  'fitness',
  'healthcare',
  'legal',
  'real-estate',
  'restaurants',
  'retail-ecommerce',
  'roofers-exterior'
];

// Industry-specific configurations
const industryConfigs = {
  'contractors-trades': {
    name: 'Contractors & Trades',
    description: 'Construction, plumbing, electrical, and home improvement services',
    entityName: 'Company',
    services: ['Plumbing', 'Electrical', 'HVAC', 'Roofing', 'Flooring', 'Painting'],
    features: ['Licensed & Insured', 'Free Estimates', 'Warranty', 'Emergency Services'],
    cta: 'Get Free Quote'
  },
  'fitness': {
    name: 'Fitness & Wellness',
    description: 'Gyms, personal training, yoga studios, and wellness centers',
    entityName: 'Studio',
    services: ['Personal Training', 'Group Classes', 'Yoga', 'Pilates', 'Nutrition'],
    features: ['Certified Trainers', 'Modern Equipment', 'Flexible Scheduling', 'Results Guarantee'],
    cta: 'Start Your Journey'
  },
  'healthcare': {
    name: 'Healthcare',
    description: 'Medical practices, clinics, dental offices, and healthcare providers',
    entityName: 'Practice',
    services: ['Primary Care', 'Specialty Care', 'Preventive Care', 'Telemedicine'],
    features: ['Board Certified', 'Insurance Accepted', 'Extended Hours', 'Patient Portal'],
    cta: 'Schedule Appointment'
  },
  'legal': {
    name: 'Legal Services',
    description: 'Law firms, attorneys, legal consultants, and legal services',
    entityName: 'Law Firm',
    services: ['Business Law', 'Family Law', 'Criminal Defense', 'Estate Planning'],
    features: ['Experienced Attorneys', 'Free Consultation', 'Proven Results', 'Client Focused'],
    cta: 'Free Consultation'
  },
  'real-estate': {
    name: 'Real Estate',
    description: 'Real estate agencies, property management, and real estate services',
    entityName: 'Agency',
    services: ['Property Sales', 'Rentals', 'Property Management', 'Market Analysis'],
    features: ['Local Experts', 'Market Knowledge', 'Professional Photos', 'Virtual Tours'],
    cta: 'Find Your Home'
  },
  'restaurants': {
    name: 'Restaurants',
    description: 'Restaurants, cafes, dining establishments, and food services',
    entityName: 'Restaurant',
    services: ['Dining', 'Catering', 'Private Events', 'Takeout'],
    features: ['Fresh Ingredients', 'Local Sourcing', 'Award Winning', 'Family Friendly'],
    cta: 'Make Reservation'
  },
  'retail-ecommerce': {
    name: 'Retail & E-commerce',
    description: 'Retail stores, online shops, and e-commerce businesses',
    entityName: 'Store',
    services: ['Online Shopping', 'In-Store Shopping', 'Custom Orders', 'Gift Cards'],
    features: ['Quality Products', 'Competitive Prices', 'Fast Shipping', 'Customer Service'],
    cta: 'Shop Now'
  },
  'roofers-exterior': {
    name: 'Roofing & Exterior',
    description: 'Roofing, siding, gutters, and exterior home improvement',
    entityName: 'Company',
    services: ['Roofing', 'Siding', 'Gutters', 'Windows', 'Exterior Painting'],
    features: ['Licensed Contractors', 'Insurance', 'Warranties', 'Free Estimates'],
    cta: 'Get Estimate'
  }
};

// Kit-specific configurations
const kitConfigs = {
  'business': {
    name: 'Business',
    description: 'Professional business template with advanced features',
    complexity: 'advanced',
    sections: ['hero', 'services', 'case-studies', 'pricing', 'team', 'contact']
  },
  'creative': {
    name: 'Creative',
    description: 'Modern creative portfolio and agency template',
    complexity: 'intermediate',
    sections: ['hero', 'portfolio', 'services', 'about', 'team', 'contact']
  },
  'minimal': {
    name: 'Minimal',
    description: 'Clean and simple template for getting online quickly',
    complexity: 'basic',
    sections: ['hero', 'services', 'about', 'contact']
  },
  'premium-interactive': {
    name: 'Premium Interactive',
    description: 'Feature-rich interactive template with advanced animations',
    complexity: 'advanced',
    sections: ['hero', 'features', 'portfolio', 'pricing', 'testimonials', 'contact']
  },
  'starter': {
    name: 'Starter',
    description: 'Beginner-friendly template to get started online',
    complexity: 'basic',
    sections: ['hero', 'about', 'services', 'contact']
  }
};

/**
 * Generate CMS integration configuration for a specific kit-industry combination
 */
function generateKitIndustryCMS(kit, industry) {
  const kitConfig = kitConfigs[kit];
  const industryConfig = industryConfigs[industry];

  const config = {
    version: "1.0.0",
    template: `${kit}-${industry}`,
    kit: kit,
    industry: industry,
    description: `CMS field mapping for ${kitConfig.name} kit configured for ${industryConfig.name} industry`,
    cms_mappings: {
      wordpress: generateWordPressConfig(kitConfig, industryConfig),
      contentful: generateContentfulConfig(kitConfig, industryConfig),
      strapi: generateStrapiConfig(kitConfig, industryConfig),
      webflow: generateWebflowConfig(kitConfig, industryConfig)
    },
    field_mapping_guide: generateFieldMappingGuide(kitConfig, industryConfig),
    implementation_notes: {
      wordpress: "Use ACF plugin for advanced custom fields. Create field groups as shown above.",
      contentful: "Create content types in Contentful dashboard. Use the GraphQL API for data fetching.",
      strapi: "Create content types in Strapi admin panel. Use REST or GraphQL API.",
      webflow: "Create collections in Webflow designer. Use Webflow's CMS API for dynamic content."
    }
  };

  return config;
}

/**
 * Generate WordPress ACF configuration
 */
function generateWordPressConfig(kitConfig, industryConfig) {
  const fields = [];

  // Company/Entity Information
  fields.push({
    title: `${industryConfig.entityName} Information`,
    location: [
      {
        param: "page_template",
        operator: "==",
        value: "page-home.php"
      }
    ],
    fields: [
      {
        key: "entity_name",
        label: `${industryConfig.entityName} Name`,
        name: "entity_name",
        type: "text",
        required: 1,
        default_value: `Your ${industryConfig.entityName} Name`
      },
      {
        key: "entity_tagline",
        label: `${industryConfig.entityName} Tagline`,
        name: "entity_tagline",
        type: "text",
        default_value: industryConfig.description.split(',')[0]
      },
      {
        key: "phone",
        label: "Phone Number",
        name: "phone",
        type: "text",
        required: 1
      },
      {
        key: "email",
        label: "Email Address",
        name: "email",
        type: "email",
        required: 1
      },
      {
        key: "address",
        label: "Business Address",
        name: "address",
        type: "textarea",
        rows: 3,
        required: 1
      }
    ]
  });

  // Branding
  fields.push({
    title: "Branding",
    fields: [
      {
        key: "logo",
        label: "Logo",
        name: "logo",
        type: "image",
        return_format: "url"
      },
      {
        key: "favicon",
        label: "Favicon",
        name: "favicon",
        type: "image",
        return_format: "url"
      }
    ]
  });

  // Social Media
  fields.push({
    title: "Social Media",
    fields: [
      {
        key: "facebook_url",
        label: "Facebook URL",
        name: "facebook_url",
        type: "url"
      },
      {
        key: "instagram_url",
        label: "Instagram URL",
        name: "instagram_url",
        type: "url"
      },
      {
        key: "linkedin_url",
        label: "LinkedIn URL",
        name: "linkedin_url",
        type: "url"
      },
      {
        key: "twitter_url",
        label: "Twitter URL",
        name: "twitter_url",
        type: "url"
      }
    ]
  });

  // Hero Section
  if (kitConfig.sections.includes('hero')) {
    fields.push({
      title: "Hero Section",
      fields: [
        {
          key: "hero_title",
          label: "Hero Title",
          name: "hero_title",
          type: "text",
          required: 1,
          default_value: `Welcome to ${industryConfig.entityName}`
        },
        {
          key: "hero_subtitle",
          label: "Hero Subtitle",
          name: "hero_subtitle",
          type: "textarea",
          rows: 3,
          required: 1
        },
        {
          key: "hero_image",
          label: "Hero Image",
          name: "hero_image",
          type: "image",
          required: 1,
          return_format: "url"
        },
        {
          key: "hero_primary_cta",
          label: "Primary CTA Text",
          name: "hero_primary_cta",
          type: "text",
          default_value: industryConfig.cta
        },
        {
          key: "hero_secondary_cta",
          label: "Secondary CTA Text",
          name: "hero_secondary_cta",
          type: "text",
          default_value: "Learn More"
        }
      ]
    });
  }

  // Services Section
  if (kitConfig.sections.includes('services')) {
    fields.push({
      title: "Services Section",
      fields: [
        {
          key: "services_title",
          label: "Services Section Title",
          name: "services_title",
          type: "text",
          default_value: "Our Services"
        },
        {
          key: "services_subtitle",
          label: "Services Section Subtitle",
          name: "services_subtitle",
          type: "textarea",
          rows: 2
        },
        {
          key: "services",
          label: "Services",
          name: "services",
          type: "repeater",
          required: 1,
          min: 3,
          layout: "block",
          sub_fields: [
            {
              key: "service_title",
              label: "Service Title",
              name: "title",
              type: "text",
              required: 1
            },
            {
              key: "service_description",
              label: "Service Description",
              name: "description",
              type: "textarea",
              rows: 3,
              required: 1
            },
            {
              key: "service_icon",
              label: "Service Icon",
              name: "icon",
              type: "image",
              return_format: "url"
            },
            {
              key: "service_link",
              label: "Service Page Link",
              name: "link",
              type: "url"
            }
          ]
        }
      ]
    });
  }

  return {
    name: "WordPress",
    acf_version: ">=5.0",
    field_groups: fields
  };
}

/**
 * Generate Contentful configuration
 */
function generateContentfulConfig(kitConfig, industryConfig) {
  const contentTypes = [];

  // Entity Info
  contentTypes.push({
    name: `${industryConfig.entityName} Info`,
    id: "entityInfo",
    fields: [
      {
        name: `${industryConfig.entityName} Name`,
        id: "entityName",
        type: "Symbol",
        required: true
      },
      {
        name: "Tagline",
        id: "tagline",
        type: "Symbol"
      },
      {
        name: "Phone",
        id: "phone",
        type: "Symbol",
        required: true
      },
      {
        name: "Email",
        id: "email",
        type: "Symbol",
        required: true
      },
      {
        name: "Address",
        id: "address",
        type: "Text",
        required: true
      }
    ]
  });

  // Service
  if (kitConfig.sections.includes('services')) {
    contentTypes.push({
      name: "Service",
      id: "service",
      fields: [
        {
          name: "Title",
          id: "title",
          type: "Symbol",
          required: true
        },
        {
          name: "Description",
          id: "description",
          type: "Text",
          required: true
        },
        {
          name: "Icon",
          id: "icon",
          type: "Link",
          linkType: "Asset"
        },
        {
          name: "Link",
          id: "link",
          type: "Symbol"
        }
      ]
    });
  }

  return {
    name: "Contentful",
    content_types: contentTypes
  };
}

/**
 * Generate Strapi configuration
 */
function generateStrapiConfig(kitConfig, industryConfig) {
  const contentTypes = [];

  // Entity Info
  contentTypes.push({
    name: "entity-info",
    attributes: {
      entityName: {
        type: "string",
        required: true
      },
      tagline: {
        type: "string"
      },
      phone: {
        type: "string",
        required: true
      },
      email: {
        type: "email",
        required: true
      },
      address: {
        type: "text",
        required: true
      }
    }
  });

  // Service
  if (kitConfig.sections.includes('services')) {
    contentTypes.push({
      name: "service",
      attributes: {
        title: {
          type: "string",
          required: true
        },
        description: {
          type: "text",
          required: true
        },
        icon: {
          type: "media",
          multiple: false
        },
        link: {
          type: "string"
        }
      }
    });
  }

  return {
    name: "Strapi",
    content_types: contentTypes
  };
}

/**
 * Generate Webflow configuration
 */
function generateWebflowConfig(kitConfig, industryConfig) {
  const collections = [];

  // Entity Info
  collections.push({
    name: `${industryConfig.entityName} Info`,
    fields: [
      {
        name: `${industryConfig.entityName} Name`,
        type: "Plain text",
        required: true
      },
      {
        name: "Tagline",
        type: "Plain text"
      },
      {
        name: "Phone",
        type: "Plain text",
        required: true
      },
      {
        name: "Email",
        type: "Plain text",
        required: true
      },
      {
        name: "Address",
        type: "Multi-line text",
        required: true
      }
    ]
  });

  // Services
  if (kitConfig.sections.includes('services')) {
    collections.push({
      name: "Services",
      fields: [
        {
          name: "Service Title",
          type: "Plain text",
          required: true
        },
        {
          name: "Description",
          type: "Multi-line text",
          required: true
        },
        {
          name: "Service Icon",
          type: "Image"
        },
        {
          name: "Service Link",
          type: "Link"
        }
      ]
    });
  }

  return {
    name: "Webflow",
    collections: collections
  };
}

/**
 * Generate field mapping guide
 */
function generateFieldMappingGuide(kitConfig, industryConfig) {
  return {
    template_variables: {
      entity_name: `Entity Info/entityName/entity_name`,
      hero_title: `Hero/hero_title/heroTitle`,
      services: `Services/services/services (array)`
    },
    data_transformation: {
      services_array: "Map each service object to template service structure",
      image_urls: "Convert CMS image references to full URLs",
      social_links: "Convert social media fields to social object"
    }
  };
}

/**
 * Generate all kit-industry combinations
 */
function generateAllCombinations() {
  console.log('Generating kit-industry CMS integration configurations...\n');

  let totalGenerated = 0;

  for (const kit of kits) {
    for (const industry of industries) {
      const config = generateKitIndustryCMS(kit, industry);

      // Create directory if it doesn't exist
      const dirPath = path.join('kits', kit, 'docs', 'industries');
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      // Write configuration file
      const filePath = path.join(dirPath, `${industry}-cms-integration.json`);
      fs.writeFileSync(filePath, JSON.stringify(config, null, 2));

      console.log(`✓ Generated ${kit}/${industry} configuration`);
      totalGenerated++;
    }
  }

  console.log(`\n🎉 Generated ${totalGenerated} kit-industry CMS integration configurations!`);
  console.log('Each kit now has industry-specific CMS configurations.');
}

/**
 * Main execution
 */
if (require.main === module) {
  generateAllCombinations();
}

module.exports = {
  generateKitIndustryCMS,
  generateWordPressConfig,
  generateContentfulConfig,
  generateStrapiConfig,
  generateWebflowConfig
};
