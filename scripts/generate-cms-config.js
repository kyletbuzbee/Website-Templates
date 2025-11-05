const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * CMS Configuration Generator
 * Generates CMS integration configurations for all templates
 */

function generateCmsConfigs() {
  console.log('🔧 Generating CMS configurations...');

  const cmsPlatforms = [
    'wordpress-acf',
    'contentful',
    'strapi',
    'webflow',
    'shopify',
    'squarespace',
    'drupal'
  ];

  // Process industry templates
  const industriesDir = path.join(__dirname, '..', 'industries');
  if (fs.existsSync(industriesDir)) {
    const industries = fs.readdirSync(industriesDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    industries.forEach(industry => {
      const docsDir = path.join(industriesDir, industry, 'docs');
      if (!fs.existsSync(docsDir)) {
        fs.mkdirSync(docsDir, { recursive: true });
      }

      cmsPlatforms.forEach(platform => {
        const configFile = path.join(docsDir, `cms-integration-${platform}.json`);

        // Read demo content to understand structure
        const demoContentPath = path.join(industriesDir, industry, 'assets', 'demo-content.json');
        let fieldMappings = {};

        if (fs.existsSync(demoContentPath)) {
          try {
            const demoContent = JSON.parse(fs.readFileSync(demoContentPath, 'utf8'));
            fieldMappings = generateFieldMappings(demoContent, platform);
          } catch (e) {
            console.warn(`Could not read demo content for ${industry}: ${e.message}`);
          }
        }

        const cmsConfig = {
          template: industry,
          cms_platform: platform,
          version: '1.0.0',
          description: `CMS integration configuration for ${industry} template with ${platform}`,
          field_mappings: fieldMappings,
          setup_instructions: generateSetupInstructions(platform),
          api_endpoints: generateApiEndpoints(platform),
          webhooks: generateWebhooks(platform),
          deployment: {
            build_command: 'npm run build',
            output_directory: 'dist',
            asset_optimization: true,
            cdn_integration: platform === 'webflow' || platform === 'squarespace'
          },
          last_updated: new Date().toISOString()
        };

        fs.writeFileSync(configFile, JSON.stringify(cmsConfig, null, 2));
        console.log(`✅ Generated ${platform} config for ${industry}`);
      });
    });
  }

  // Process kit templates
  const kitsDir = path.join(__dirname, '..', 'kits');
  if (fs.existsSync(kitsDir)) {
    const kits = fs.readdirSync(kitsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    kits.forEach(kit => {
      const docsDir = path.join(kitsDir, kit, 'docs');
      if (!fs.existsSync(docsDir)) {
        fs.mkdirSync(docsDir, { recursive: true });
      }

      cmsPlatforms.forEach(platform => {
        const configFile = path.join(docsDir, `cms-integration-${platform}.json`);

        // Read demo content to understand structure
        const demoContentPath = path.join(kitsDir, kit, 'assets', 'demo-content.json');
        let fieldMappings = {};

        if (fs.existsSync(demoContentPath)) {
          try {
            const demoContent = JSON.parse(fs.readFileSync(demoContentPath, 'utf8'));
            fieldMappings = generateFieldMappings(demoContent, platform);
          } catch (e) {
            console.warn(`Could not read demo content for kit ${kit}: ${e.message}`);
          }
        }

        const cmsConfig = {
          template: kit,
          template_type: 'kit',
          cms_platform: platform,
          version: '1.0.0',
          description: `CMS integration configuration for ${kit} kit with ${platform}`,
          field_mappings: fieldMappings,
          setup_instructions: generateSetupInstructions(platform),
          api_endpoints: generateApiEndpoints(platform),
          webhooks: generateWebhooks(platform),
          deployment: {
            build_command: 'npm run build',
            output_directory: 'dist',
            asset_optimization: true,
            cdn_integration: platform === 'webflow' || platform === 'squarespace'
          },
          last_updated: new Date().toISOString()
        };

        fs.writeFileSync(configFile, JSON.stringify(cmsConfig, null, 2));
        console.log(`✅ Generated ${platform} config for kit ${kit}`);
      });
    });
  }

  console.log('\n🎉 CMS configuration generation completed!');
}

function generateFieldMappings(demoContent, platform) {
  const mappings = {};

  // Generate field mappings based on demo content structure
  if (demoContent.company) {
    mappings.company = {
      name: mapField('company.name', platform),
      tagline: mapField('company.tagline', platform),
      description: mapField('company.description', platform),
      phone: mapField('company.phone', platform),
      email: mapField('company.email', platform),
      address: mapField('company.address', platform)
    };
  }

  if (demoContent.hero) {
    mappings.hero = {
      title: mapField('hero.title', platform),
      subtitle: mapField('hero.subtitle', platform),
      image: mapField('hero.image', platform),
      primary_cta: mapField('hero.primary_cta', platform),
      secondary_cta: mapField('hero.secondary_cta', platform)
    };
  }

  if (demoContent.services && demoContent.services.items) {
    mappings.services = demoContent.services.items.map((service, index) => ({
      title: mapField(`services.items[${index}].title`, platform),
      description: mapField(`services.items[${index}].description`, platform),
      icon: mapField(`services.items[${index}].icon`, platform)
    }));
  }

  return mappings;
}

function mapField(fieldPath, platform) {
  const fieldMappings = {
    'wordpress-acf': {
      type: 'acf_field',
      key: fieldPath.replace(/\./g, '_').replace(/\[/g, '_').replace(/\]/g, ''),
      return_format: 'value'
    },
    'contentful': {
      type: 'contentful_field',
      field_id: fieldPath.replace(/\./g, '/').replace(/\[/g, '/').replace(/\]/g, ''),
      locale: 'en-US'
    },
    'strapi': {
      type: 'strapi_field',
      api_path: fieldPath.replace(/\./g, '/').replace(/\[/g, '/').replace(/\]/g, ''),
      populate: true
    },
    'webflow': {
      type: 'webflow_field',
      field_slug: fieldPath.replace(/\./g, '-').replace(/\[/g, '-').replace(/\]/g, '').toLowerCase(),
      collection_id: 'auto-generated'
    },
    'shopify': {
      type: 'shopify_metafield',
      namespace: 'website_templates',
      key: fieldPath.replace(/\./g, '_').replace(/\[/g, '_').replace(/\]/g, ''),
      value_type: 'string'
    },
    'squarespace': {
      type: 'squarespace_field',
      field_id: fieldPath.replace(/\./g, '_').replace(/\[/g, '_').replace(/\]/g, ''),
      collection_type: 'page'
    },
    'drupal': {
      type: 'drupal_field',
      field_name: fieldPath.replace(/\./g, '_').replace(/\[/g, '_').replace(/\]/g, ''),
      entity_type: 'node',
      bundle: 'page'
    }
  };

  return fieldMappings[platform] || { type: 'generic', path: fieldPath };
}

function generateSetupInstructions(platform) {
  const instructions = {
    'wordpress-acf': [
      'Install Advanced Custom Fields plugin',
      'Create custom field groups for template data',
      'Configure field mappings in WordPress admin',
      'Use REST API to fetch content'
    ],
    'contentful': [
      'Create content model in Contentful',
      'Define fields matching template structure',
      'Set up content delivery API',
      'Configure webhooks for real-time updates'
    ],
    'strapi': [
      'Create content types in Strapi admin',
      'Define fields and relationships',
      'Configure API permissions',
      'Set up deployment webhooks'
    ],
    'webflow': [
      'Create CMS collections in Webflow',
      'Define custom fields for template data',
      'Set up collection pages',
      'Configure site deployment'
    ],
    'shopify': [
      'Create metafields in Shopify admin',
      'Configure theme customizations',
      'Set up content sync',
      'Enable headless commerce APIs'
    ],
    'squarespace': [
      'Create page sections in Squarespace',
      'Configure custom CSS and JavaScript',
      'Set up content blocks',
      'Enable developer mode for advanced customization'
    ],
    'drupal': [
      'Create content types in Drupal',
      'Configure fields and display modes',
      'Set up REST API endpoints',
      'Configure content workflows'
    ]
  };

  return instructions[platform] || ['Configure CMS integration', 'Set up API endpoints', 'Test content delivery'];
}

function generateApiEndpoints(platform) {
  const endpoints = {
    'wordpress-acf': {
      content: '/wp-json/wp/v2/pages',
      acf: '/wp-json/acf/v3/pages/{id}',
      media: '/wp-json/wp/v2/media'
    },
    'contentful': {
      content: 'https://cdn.contentful.com/spaces/{space_id}/environments/{environment}/entries',
      assets: 'https://cdn.contentful.com/spaces/{space_id}/environments/{environment}/assets'
    },
    'strapi': {
      content: '/api/pages',
      media: '/api/upload/files',
      single: '/api/pages/{id}'
    },
    'webflow': {
      content: 'https://api.webflow.com/v2/sites/{site_id}/collections/{collection_id}/items',
      assets: 'https://api.webflow.com/v2/sites/{site_id}/assets'
    },
    'shopify': {
      content: '/admin/api/2023-10/pages.json',
      metafields: '/admin/api/2023-10/metafields.json',
      assets: '/admin/api/2023-10/themes/{theme_id}/assets.json'
    },
    'squarespace': {
      content: '/api/v1/commerce/products',
      pages: '/api/v1/commerce/pages',
      assets: '/api/v1/commerce/assets'
    },
    'drupal': {
      content: '/jsonapi/node/page',
      media: '/jsonapi/file/file',
      taxonomy: '/jsonapi/taxonomy_term/tags'
    }
  };

  return endpoints[platform] || { content: '/api/content', assets: '/api/assets' };
}

function generateWebhooks(platform) {
  const webhooks = {
    'wordpress-acf': [
      { event: 'post_updated', url: '/webhooks/wordpress/content-update' },
      { event: 'acf/save_post', url: '/webhooks/wordpress/acf-update' }
    ],
    'contentful': [
      { event: 'Entry.publish', url: '/webhooks/contentful/entry-publish' },
      { event: 'Asset.publish', url: '/webhooks/contentful/asset-publish' }
    ],
    'strapi': [
      { event: 'entry.update', url: '/webhooks/strapi/entry-update' },
      { event: 'media.update', url: '/webhooks/strapi/media-update' }
    ],
    'webflow': [
      { event: 'site_publish', url: '/webhooks/webflow/site-publish' },
      { event: 'collection_item_saved', url: '/webhooks/webflow/content-update' }
    ],
    'shopify': [
      { event: 'products/update', url: '/webhooks/shopify/product-update' },
      { event: 'content/update', url: '/webhooks/shopify/content-update' }
    ]
  };

  return webhooks[platform] || [];
}

// Run the generator
generateCmsConfigs();
