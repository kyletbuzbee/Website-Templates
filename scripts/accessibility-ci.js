#!/usr/bin/env node

/**
 * Accessibility CI Script
 * Lightweight accessibility testing for CI environments
 * Tests static HTML files without requiring a running server
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATES = [
  'healthcare/minimal-creative/index.html',
  'fitness/professional-enterprise/index.html',
  'contractors-trades/business-professional/index.html',
  'legal/business-professional/index.html'
];

class AccessibilityCI {
  constructor() {
    this.results = {
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        warnings: 0
      },
      templates: [],
      violations: []
    };
  }

  async runTests() {
    console.log('🚀 Running Accessibility CI Tests...\n');

    for (const template of TEMPLATES) {
      console.log(`🔍 Testing: ${template}`);
      await this.testTemplate(template);
    }

    this.generateReport();
  }

  async testTemplate(templatePath) {
    const fullPath = path.resolve(__dirname, '..', templatePath);
    const templateResult = {
      path: templatePath,
      violations: [],
      warnings: [],
      passed: []
    };

    try {
      const html = fs.readFileSync(fullPath, 'utf8');

      // Basic HTML accessibility checks
      const checks = [
        {
          name: 'html-lang',
          test: () => {
            const langMatch = html.match(/<html[^>]*lang=["']([^"']+)["']/i);
            return langMatch && langMatch[1] ? { passed: true } : {
              passed: false,
              message: 'Missing or empty lang attribute on html element'
            };
          }
        },
        {
          name: 'title-tag',
          test: () => {
            const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
            return titleMatch && titleMatch[1].trim() ? { passed: true } : {
              passed: false,
              message: 'Missing or empty title tag'
            };
          }
        },
        {
          name: 'heading-hierarchy',
          test: () => {
            const headings = html.match(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi) || [];
            const hasH1 = headings.some(h => h.startsWith('<h1'));
            return hasH1 ? { passed: true } : {
              passed: false,
              message: 'Missing h1 heading'
            };
          }
        },
        {
          name: 'alt-attributes',
          test: () => {
            const images = html.match(/<img[^>]+>/gi) || [];
            const missingAlt = images.filter(img => !img.includes('alt='));
            if (missingAlt.length > 0) {
              return {
                passed: false,
                message: `${missingAlt.length} images missing alt attributes`
              };
            }
            return { passed: true };
          }
        },
        {
          name: 'form-labels',
          test: () => {
            const inputs = html.match(/<input[^>]+>/gi) || [];
            const labels = html.match(/<label[^>]*>.*?<\/label>/gi) || [];
            const unlabeled = inputs.filter(input => {
              const id = input.match(/id=["']([^"']+)["']/);
              if (!id) return true; // Input without id
              return !labels.some(label => label.includes(`for="${id[1]}"`));
            });

            if (unlabeled.length > 0) {
              return {
                passed: false,
                message: `${unlabeled.length} form inputs missing labels`
              };
            }
            return { passed: true };
          }
        },
        {
          name: 'button-accessibility',
          test: () => {
            const buttons = html.match(/<button[^>]*>(.*?)<\/button>/gi) || [];
            const emptyButtons = buttons.filter(btn => {
              const content = btn.replace(/<button[^>]*>/, '').replace(/<\/button>/, '').trim();
              return !content && !btn.includes('aria-label=') && !btn.includes('aria-labelledby=');
            });

            if (emptyButtons.length > 0) {
              return {
                passed: false,
                message: `${emptyButtons.length} buttons missing accessible names`
              };
            }
            return { passed: true };
          }
        },
        {
          name: 'color-contrast-warning',
          test: () => {
            // Simple check for potential contrast issues
            const hasInlineColors = html.includes('color:') || html.includes('background-color:');
            return {
              passed: true,
              warning: hasInlineColors ? 'Inline colors detected - verify contrast ratios manually' : null
            };
          }
        }
      ];

      // Run all checks
      for (const check of checks) {
        const result = check.test();

        if (result.passed) {
          templateResult.passed.push(check.name);
          if (result.warning) {
            templateResult.warnings.push(`${check.name}: ${result.warning}`);
          }
        } else {
          templateResult.violations.push(`${check.name}: ${result.message}`);
        }
      }

      // Update summary
      this.results.summary.total += checks.length;
      this.results.summary.passed += templateResult.passed.length;
      this.results.summary.failed += templateResult.violations.length;
      this.results.summary.warnings += templateResult.warnings.length;

      console.log(`  ✅ Passed: ${templateResult.passed.length}`);
      console.log(`  ❌ Failed: ${templateResult.violations.length}`);
      console.log(`  ⚠️  Warnings: ${templateResult.warnings.length}`);

    } catch (error) {
      console.error(`  ❌ Test failed for ${templatePath}:`, error.message);
      templateResult.error = error.message;
    }

    this.results.templates.push(templateResult);
  }

  generateReport() {
    console.log('\n📊 Accessibility CI Results\n');

    // Summary
    console.log('📈 Summary:');
    console.log(`  Total checks: ${this.results.summary.total}`);
    console.log(`  ✅ Passed: ${this.results.summary.passed}`);
    console.log(`  ❌ Failed: ${this.results.summary.failed}`);
    console.log(`  ⚠️  Warnings: ${this.results.summary.warnings}`);

    const passRate = this.results.summary.total > 0
      ? ((this.results.summary.passed / this.results.summary.total) * 100).toFixed(1)
      : '0.0';

    console.log(`  📊 Pass Rate: ${passRate}%\n`);

    // Template results
    console.log('📋 Template Results:');
    this.results.templates.forEach(template => {
      const violations = template.violations.length;
      const warnings = template.warnings.length;
      const status = violations === 0 ? '✅' : '❌';
      console.log(`  ${status} ${template.path}: ${violations} violations, ${warnings} warnings`);
    });

    // Detailed violations
    if (this.results.summary.failed > 0) {
      console.log('\n🚨 Violations:');

      this.results.templates.forEach(template => {
        if (template.violations.length > 0) {
          console.log(`\n📄 ${template.path}:`);
          template.violations.forEach(violation => {
            console.log(`  ❌ ${violation}`);
          });
        }
      });
    }

    // Warnings
    if (this.results.summary.warnings > 0) {
      console.log('\n⚠️  Warnings:');

      this.results.templates.forEach(template => {
        if (template.warnings.length > 0) {
          console.log(`\n📄 ${template.path}:`);
          template.warnings.forEach(warning => {
            console.log(`  ⚠️  ${warning}`);
          });
        }
      });
    }

    // Recommendations
    this.generateRecommendations();

    // Save report
    this.saveReport();

    // Exit with appropriate code
    if (this.results.summary.failed > 0) {
      console.log('\n❌ Accessibility CI failed - violations found');
      process.exit(1);
    } else {
      console.log('\n✅ Accessibility CI passed!');
      process.exit(0);
    }
  }

  generateRecommendations() {
    console.log('\n💡 Recommendations:');

    const recommendations = [
      '• Run full axe-core tests locally: npm run accessibility:full',
      '• Test with keyboard navigation (Tab key)',
      '• Verify color contrast ratios (4.5:1 minimum)',
      '• Test with screen readers (NVDA, JAWS, VoiceOver)',
      '• Ensure focus indicators are visible and obvious'
    ];

    recommendations.forEach(rec => console.log(rec));
  }

  saveReport() {
    const reportPath = path.resolve(__dirname, '../accessibility-ci-report.json');
    const report = {
      timestamp: new Date().toISOString(),
      summary: this.results.summary,
      templates: this.results.templates
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Report saved to: ${reportPath}`);
  }
}

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new AccessibilityCI();
  tester.runTests().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export default AccessibilityCI;
