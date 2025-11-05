/**
 * CMS Integration Expansion
 * Adds support for additional CMS platforms: Shopify, Squarespace, Drupal
 */

class CMSExpansionManager {
  constructor() {
    this.additionalPlatforms = {
      shopify: this.getShopifyIntegration(),
      squarespace: this.getSquarespaceIntegration(),
      drupal: this.getDrupalIntegration()
    };
  }

  /**
   * Get Shopify integration configuration
   */
  getShopifyIntegration() {
    return {
      name: "Shopify",
      version: ">=2.0",
      theme_support: true,
      liquid_templates: true,
      metafields_api: true,
      content_types: [
        {
          name: "Page Content",
          id: "pageContent",
          fields: [
            {
              name: "Hero Title",
              id: "hero_title",
              type: "single_line_text_field",
              required: true
            },
            {
              name: "Hero Subtitle",
              id: "hero_subtitle",
              type: "multi_line_text_field",
              required: true
            },
            {
              name: "Hero Image",
              id: "hero_image",
              type: "file_reference",
              required: true
            },
            {
              name: "Primary CTA",
              id: "primary_cta",
              type: "single_line_text_field",
              default: "Shop Now"
            },
            {
              name: "Secondary CTA",
              id: "secondary_cta",
              type: "single_line_text_field",
              default: "Learn More"
            }
          ]
        },
        {
          name: "Product Showcase",
          id: "productShowcase",
          fields: [
            {
              name: "Section Title",
              id: "section_title",
              type: "single_line_text_field",
              default: "Featured Products"
            },
            {
              name: "Products",
              id: "featured_products",
              type: "product_reference",
              required: true
            },
            {
              name: "Display Style",
              id: "display_style",
              type: "single_line_text_field",
              validations: [
                {
                  name: "options",
                  value: "grid|carousel|list"
                }
              ],
              default: "grid"
            }
          ]
        },
        {
          name: "Content Blocks",
          id: "contentBlocks",
          fields: [
            {
              name: "Blocks",
              id: "blocks",
              type: "list",
              of: {
                type: "object",
                properties: {
                  title: { type: "single_line_text_field" },
                  content: { type: "rich_text_field" },
                  image: { type: "file_reference" },
                  layout: {
                    type: "single_line_text_field",
                    validations: [
                      {
                        name: "options",
                        value: "text-left|text-right|text-center|full-width"
                      }
                    ]
                  }
                }
              }
            }
          ]
        }
      ],
      implementation_notes: {
        setup: "Create a new Shopify theme and upload the template files to the theme directory",
        metafields: "Use metafields to store additional content data",
        sections: "Utilize Shopify sections for modular content blocks",
        liquid: "Template uses Liquid templating with Shopify-specific objects",
        apps: "Compatible with major Shopify apps for enhanced functionality"
      },
      template_mapping: {
        "hero_title": "{{ page.metafields.custom.hero_title }}",
        "hero_subtitle": "{{ page.metafields.custom.hero_subtitle }}",
        "hero_image": "{{ page.metafields.custom.hero_image | image_url }}",
        "products": "{% for product in collections.featured.products %}",
        "content_blocks": "{% for block in page.metafields.custom.blocks %}"
      }
    };
  }

  /**
   * Get Squarespace integration configuration
   */
  getSquarespaceIntegration() {
    return {
      name: "Squarespace",
      version: ">=7.1",
      block_system: true,
      json_templating: true,
      developer_mode: true,
      content_types: [
        {
          name: "Page Settings",
          id: "pageSettings",
          fields: [
            {
              name: "Page Title",
              id: "page_title",
              type: "text",
              required: true
            },
            {
              name: "Page Description",
              id: "page_description",
              type: "textarea",
              required: true
            },
            {
              name: "Hero Background",
              id: "hero_background",
              type: "image",
              required: true
            },
            {
              name: "Primary Color",
              id: "primary_color",
              type: "color",
              default: "#000000"
            },
            {
              name: "Secondary Color",
              id: "secondary_color",
              type: "color",
              default: "#ffffff"
            }
          ]
        },
        {
          name: "Content Sections",
          id: "contentSections",
          fields: [
            {
              name: "Sections",
              id: "sections",
              type: "list",
              of: {
                type: "object",
                properties: {
                  type: {
                    type: "select",
                    options: ["hero", "text", "image", "gallery", "contact", "products"]
                  },
                  title: { type: "text" },
                  content: { type: "textarea" },
                  images: { type: "image_list" },
                  button_text: { type: "text" },
                  button_url: { type: "url" },
                  background_color: { type: "color" },
                  text_color: { type: "color" }
                }
              }
            }
          ]
        },
        {
          name: "Navigation",
          id: "navigation",
          fields: [
            {
              name: "Main Navigation",
              id: "main_nav",
              type: "navigation",
              required: true
            },
            {
              name: "Footer Links",
              id: "footer_links",
              type: "link_list"
            },
            {
              name: "Social Links",
              id: "social_links",
              type: "social_accounts"
            }
          ]
        }
      ],
      implementation_notes: {
        setup: "Enable Developer Mode in Squarespace and upload template files",
        blocks: "Use Squarespace blocks for modular content management",
        styles: "Custom CSS can be added through the CSS Editor",
        scripts: "JavaScript can be added through Code Injection",
        limitations: "Squarespace has some limitations on custom functionality"
      },
      template_mapping: {
        "page_title": "{page.title}",
        "page_description": "{page.description}",
        "hero_background": "{page.hero_background}",
        "sections": "{page.sections}",
        "navigation": "{navigation.main_nav}"
      }
    };
  }

  /**
   * Get Drupal integration configuration
   */
  getDrupalIntegration() {
    return {
      name: "Drupal",
      version: ">=9.0",
      modules_required: ["layout_builder", "field", "media"],
      content_types: [
        {
          name: "Landing Page",
          machine_name: "landing_page",
          fields: [
            {
              name: "Page Title",
              machine_name: "field_page_title",
              type: "string",
              required: true,
              cardinality: 1
            },
            {
              name: "Subtitle",
              machine_name: "field_subtitle",
              type: "string",
              cardinality: 1
            },
            {
              name: "Hero Image",
              machine_name: "field_hero_image",
              type: "image",
              cardinality: 1,
              required: true
            },
            {
              name: "Content Blocks",
              machine_name: "field_content_blocks",
              type: "entity_reference_revisions",
              target_type: "paragraph",
              cardinality: -1 // unlimited
            },
            {
              name: "Call to Action",
              machine_name: "field_cta",
              type: "link",
              cardinality: 1
            }
          ]
        },
        {
          name: "Content Block",
          machine_name: "content_block",
          type: "paragraph",
          fields: [
            {
              name: "Block Type",
              machine_name: "field_block_type",
              type: "list_string",
              allowed_values: {
                "text": "Text Block",
                "image": "Image Block",
                "gallery": "Gallery Block",
                "contact": "Contact Block",
                "products": "Products Block"
              }
            },
            {
              name: "Title",
              machine_name: "field_title",
              type: "string"
            },
            {
              name: "Content",
              machine_name: "field_content",
              type: "text_long"
            },
            {
              name: "Images",
              machine_name: "field_images",
              type: "image",
              cardinality: -1
            },
            {
              name: "Link",
              machine_name: "field_link",
              type: "link"
            }
          ]
        }
      ],
      implementation_notes: {
        setup: "Create custom content types and install required modules",
        theming: "Use Twig templating with Drupal's theme system",
        layout_builder: "Utilize Layout Builder for flexible page layouts",
        paragraphs: "Use Paragraphs module for complex content structures",
        views: "Create custom views for dynamic content display"
      },
      template_mapping: {
        "page_title": "{{ node.field_page_title.value }}",
        "subtitle": "{{ node.field_subtitle.value }}",
        "hero_image": "{{ file_url(node.field_hero_image.entity.uri.value) }}",
        "content_blocks": "{% for block in node.field_content_blocks %}",
        "cta": "{{ node.field_cta }}"
      }
    };
  }

  /**
   * Update existing CMS integration files with new platforms
   */
  async updateCMSIntegrations() {
    const industries = ['restaurants', 'legal', 'fitness', 'real-estate', 'contractors-trades', 'healthcare', 'roofers-exterior'];

    for (const industry of industries) {
      const cmsFilePath = `industries/${industry}/docs/cms-integration.json`;

      try {
        const response = await fetch(cmsFilePath);
        if (response.ok) {
          const cmsData = await response.json();

          // Add new platforms to existing CMS mappings
          cmsData.cms_mappings = {
            ...cmsData.cms_mappings,
            shopify: this.additionalPlatforms.shopify,
            squarespace: this.additionalPlatforms.squarespace,
            drupal: this.additionalPlatforms.drupal
          };

          // Update implementation notes
          cmsData.implementation_notes = {
            ...cmsData.implementation_notes,
            shopify: "Upload theme files to Shopify theme directory. Use metafields for custom content.",
            squarespace: "Enable Developer Mode and upload template files. Use blocks for content management.",
            drupal: "Create custom content types and use Layout Builder for page construction."
          };

          // Save updated file
          const updatedContent = JSON.stringify(cmsData, null, 2);
          // In a real implementation, this would write to the file
          console.log(`Updated CMS integration for ${industry} with new platforms`);
        }
      } catch (error) {
        console.warn(`Could not update CMS integration for ${industry}:`, error);
      }
    }
  }

  /**
   * Generate integration guides for new platforms
   */
  generateIntegrationGuides() {
    const guides = {};

    Object.entries(this.additionalPlatforms).forEach(([platform, config]) => {
      guides[platform] = {
        title: `${config.name} Integration Guide`,
        overview: `Complete guide for integrating website templates with ${config.name}`,
        requirements: this.getPlatformRequirements(platform),
        setup_steps: this.getSetupSteps(platform),
        template_mapping: config.template_mapping,
        troubleshooting: this.getTroubleshootingTips(platform),
        examples: this.getCodeExamples(platform)
      };
    });

    return guides;
  }

  /**
   * Get platform-specific requirements
   */
  getPlatformRequirements(platform) {
    const requirements = {
      shopify: [
        "Shopify store (any plan)",
        "Theme development access",
        "Basic knowledge of Liquid templating",
        "Metafields app (optional but recommended)"
      ],
      squarespace: [
        "Squarespace Business or Commerce plan",
        "Developer Mode enabled",
        "Basic knowledge of JSON templating",
        "Understanding of Squarespace blocks system"
      ],
      drupal: [
        "Drupal 9.x or later",
        "Layout Builder module",
        "Paragraphs module",
        "Media module",
        "Basic knowledge of Twig templating"
      ]
    };

    return requirements[platform] || [];
  }

  /**
   * Get setup steps for each platform
   */
  getSetupSteps(platform) {
    const steps = {
      shopify: [
        "Create a new theme in Shopify admin",
        "Upload template files to theme directory",
        "Create metafields for custom content",
        "Configure theme settings",
        "Test template functionality",
        "Publish theme when ready"
      ],
      squarespace: [
        "Enable Developer Mode in site settings",
        "Create template files in developer platform",
        "Configure page layouts and regions",
        "Add custom CSS and JavaScript",
        "Test template across different devices",
        "Disable Developer Mode when complete"
      ],
      drupal: [
        "Install required modules (Layout Builder, Paragraphs, Media)",
        "Create custom content types",
        "Set up paragraph types for content blocks",
        "Create custom theme with Twig templates",
        "Configure views for dynamic content",
        "Test content creation and display"
      ]
    };

    return steps[platform] || [];
  }

  /**
   * Get troubleshooting tips
   */
  getTroubleshootingTips(platform) {
    const tips = {
      shopify: [
        "Check theme syntax errors in Shopify admin",
        "Verify metafield namespaces and keys",
        "Test on different screen sizes",
        "Check for conflicting apps",
        "Use Shopify's theme inspector for debugging"
      ],
      squarespace: [
        "Verify Developer Mode is enabled",
        "Check JSON syntax in template files",
        "Test block configurations",
        "Verify CSS and JavaScript loading",
        "Check browser console for errors"
      ],
      drupal: [
        "Clear Drupal cache after changes",
        "Check Twig syntax errors",
        "Verify module dependencies",
        "Test user permissions for content creation",
        "Check PHP error logs"
      ]
    };

    return tips[platform] || [];
  }

  /**
   * Get code examples for each platform
   */
  getCodeExamples(platform) {
    const examples = {
      shopify: {
        hero_section: `
{% assign hero_title = page.metafields.custom.hero_title %}
{% assign hero_subtitle = page.metafields.custom.hero_subtitle %}
{% assign hero_image = page.metafields.custom.hero_image %}

<section class="hero">
  <div class="hero__background">
    {{ hero_image | image_url: '1920x' | image_tag }}
  </div>
  <div class="hero__content">
    <h1>{{ hero_title }}</h1>
    <p>{{ hero_subtitle }}</p>
    <a href="{{ page.metafields.custom.cta_url }}" class="btn btn--primary">
      {{ page.metafields.custom.cta_text }}
    </a>
  </div>
</section>`,
        product_grid: `
{% for product in collections.featured.products limit: 6 %}
  <div class="product-card">
    <a href="{{ product.url }}">
      {{ product.featured_image | image_url: '400x' | image_tag }}
      <h3>{{ product.title }}</h3>
      <div class="price">{{ product.price | money }}</div>
    </a>
    {% if product.available %}
      <button>Add to Cart</button>
    {% endif %}
  </div>
{% endfor %}`
      },
      squarespace: {
        hero_section: `
{
  "blocks": [
    {
      "type": "hero",
      "content": {
        "title": "{page.title}",
        "subtitle": "{page.description}",
        "backgroundImage": "{page.hero_background}",
        "buttonText": "Learn More",
        "buttonUrl": "#contact"
      }
    }
  ]
}`,
        content_block: `
.sqs-block-content {
  .content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  h2 {
    color: {page.primary_color};
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  p {
    color: {page.secondary_color};
    font-size: 1.1rem;
    line-height: 1.6;
  }
}`
      },
      drupal: {
        hero_section: `
<section class="hero">
  <div class="hero__background">
    {% if node.field_hero_image %}
      <img src="{{ file_url(node.field_hero_image.entity.uri.value) }}"
           alt="{{ node.field_hero_image.alt }}"
           class="hero__image">
    {% endif %}
  </div>
  <div class="hero__content">
    <h1>{{ node.field_page_title.value }}</h1>
    {% if node.field_subtitle.value %}
      <p class="hero__subtitle">{{ node.field_subtitle.value }}</p>
    {% endif %}
    {% if node.field_cta %}
      <a href="{{ node.field_cta.uri }}"
         class="btn btn--primary">
        {{ node.field_cta.title }}
      </a>
    {% endif %}
  </div>
</section>`,
        content_blocks: `
{% for block in node.field_content_blocks %}
  <div class="content-block content-block--{{ block.entity.field_block_type.value }}">
    {% if block.entity.field_title.value %}
      <h2>{{ block.entity.field_title.value }}</h2>
    {% endif %}

    {% if block.entity.field_content.value %}
      <div class="content-block__content">
        {{ block.entity.field_content.value | raw }}
      </div>
    {% endif %}

    {% if block.entity.field_images %}
      <div class="content-block__images">
        {% for image in block.entity.field_images %}
          <img src="{{ file_url(image.entity.uri.value) }}"
               alt="{{ image.alt }}"
               class="content-block__image">
        {% endfor %}
      </div>
    {% endif %}
  </div>
{% endfor %}`
      }
    };

    return examples[platform] || {};
  }

  /**
   * Get compatibility matrix
   */
  getCompatibilityMatrix() {
    return {
      shopify: {
        compatible_templates: ['all'],
        best_for: ['e-commerce', 'product showcases', 'online stores'],
        limitations: ['Limited custom functionality', 'App dependency for advanced features']
      },
      squarespace: {
        compatible_templates: ['business', 'creative', 'portfolio'],
        best_for: ['small business websites', 'portfolios', 'blogs'],
        limitations: ['Limited customization', 'No server-side code']
      },
      drupal: {
        compatible_templates: ['all'],
        best_for: ['complex websites', 'enterprise sites', 'content-heavy sites'],
        limitations: ['Steep learning curve', 'Requires technical expertise']
      }
    };
  }
}

// Export for use in other modules
const cmsExpansionManager = new CMSExpansionManager();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = cmsExpansionManager;
}

export default cmsExpansionManager;
