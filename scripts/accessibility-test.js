#!/usr/bin/env node

/**
 * Accessibility Testing Script
 * Uses axe-core to test WCAG compliance across all templates
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATES = [
  'healthcare/minimal-creative/index.html',
  'fitness/professional-enterprise/index.html',
  'contractors-trades/business-professional/index.html',
  'legal/business-professional/index.html',
  'restaurants/minimal-creative/index.html',
  'photography/business-professional/index.html',
  'retail-ecommerce/professional-enterprise/index.html',
  'roofing/minimal-creative/index.html'
];

const AXE_CONFIG = {
  rules: {
    // Enable all rules
    'color-contrast': { enabled: true },
    'image-alt': { enabled: true },
    'link-name': { enabled: true },
    'button-name': { enabled: true },
    'heading-order': { enabled: true },
    'keyboard': { enabled: true },
    'focus-visible': { enabled: true },
    'landmark-one-main': { enabled: true },
    'region': { enabled: true },
    'html-has-lang': { enabled: true },
    'valid-lang': { enabled: true },
    'dlitem': { enabled: true },
    'definition-list': { enabled: true },
    'list': { enabled: true },
    'listitem': { enabled: true },
    'frame-title': { enabled: true },
    'title': { enabled: true },
    'html-lang-valid': { enabled: true },
    'bypass': { enabled: true },
    'frame-title-unique': { enabled: true },
    'landmark-banner-is-top-level': { enabled: true },
    'landmark-complementary-is-top-level': { enabled: true },
    'landmark-contentinfo-is-top-level': { enabled: true },
    'landmark-main-is-top-level': { enabled: true },
    'landmark-navigation-is-top-level': { enabled: true },
    'landmark-no-duplicate-banner': { enabled: true },
    'landmark-no-duplicate-contentinfo': { enabled: true },
    'landmark-no-duplicate-main': { enabled: true },
    'landmark-unique': { enabled: true },
    'page-has-heading-one': { enabled: true },
    'area-alt': { enabled: true },
    'aria-allowed-role': { enabled: true },
    'aria-hidden-body': { enabled: true },
    'aria-hidden-focus': { enabled: true },
    'aria-input-field-name': { enabled: true },
    'aria-toggle-field-name': { enabled: true },
    'aria-tooltip-name': { enabled: true },
    'aria-treeitem-name': { enabled: true },
    'aria-required-attr': { enabled: true },
    'aria-required-children': { enabled: true },
    'aria-required-parent': { enabled: true },
    'aria-roledescription': { enabled: true },
    'aria-roles': { enabled: true },
    'aria-valid-attr-value': { enabled: true },
    'aria-valid-attr': { enabled: true },
    'audio-caption': { enabled: true },
    'blink': { enabled: true },
    'duplicate-id-active': { enabled: true },
    'duplicate-id-aria': { enabled: true },
    'form-field-multiple-labels': { enabled: true },
    'frame-tested': { enabled: true },
    'hidden-content': { enabled: false }, // Skip hidden content checks
    'identical-links-same-purpose': { enabled: true },
    'image-redundant-alt': { enabled: true },
    'input-button-name': { enabled: true },
    'input-image-alt': { enabled: true },
    'label': { enabled: true },
    'label-title-only': { enabled: true },
    'link-in-text-block': { enabled: true },
    'marquee': { enabled: true },
    'meta-refresh': { enabled: true },
    'meta-viewport': { enabled: true },
    'object-alt': { enabled: true },
    'role-img-alt': { enabled: true },
    'scrollable-region-focusable': { enabled: true },
    'select-name': { enabled: true },
    'server-side-image-map': { enabled: true },
    'svg-img-alt': { enabled: true },
    'td-has-header': { enabled: true },
    'td-headers-attr': { enabled: true },
    'th-has-data-cells': { enabled: true },
    'video-caption': { enabled: true },
    'video-description': { enabled: true }
  },
  disableOtherRules: false
};

class AccessibilityTester {
  constructor() {
    this.results = {
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        incomplete: 0,
        inapplicable: 0
      },
      templates: [],
      violations: [],
      recommendations: []
    };
  }

  async runTests() {
    console.log('🚀 Starting Accessibility Testing...\n');

    try {
      // Start preview server
      console.log('📡 Starting preview server...');
      const serverProcess = execSync('npm run preview', {
        cwd: path.resolve(__dirname, '..'),
        stdio: 'pipe',
        detached: true
      });

      // Wait for server to start
      await this.waitForServer();

      // Test each template
      for (const template of TEMPLATES) {
        console.log(`\n🔍 Testing: ${template}`);
        await this.testTemplate(template);
      }

      // Generate report
      this.generateReport();

      // Cleanup
      if (serverProcess) {
        process.kill(-serverProcess.pid);
      }

    } catch (error) {
      console.error('❌ Accessibility testing failed:', error.message);
      process.exit(1);
    }
  }

  async waitForServer(port = 4173, timeout = 30000) {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      try {
        execSync(`curl -f http://localhost:${port} > /dev/null 2>&1`, { stdio: 'pipe' });
        console.log('✅ Server ready');
        return;
      } catch (error) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    throw new Error('Server failed to start within timeout');
  }

  async testTemplate(templatePath) {
    const templateResult = {
      path: templatePath,
      url: `http://localhost:4173/${templatePath}`,
      violations: [],
      passes: [],
      incomplete: [],
      inapplicable: []
    };

    try {
      // Run axe-core test using puppeteer
      const testScript = `
        const { AxePuppeteer } = require('@axe-core/playwright');
        const { chromium } = require('playwright');

        async function runTest() {
          const browser = await chromium.launch();
          const page = await browser.newPage();

          try {
            await page.goto('${templateResult.url}', { waitUntil: 'networkidle' });

            const results = await new AxePuppeteer(page)
              .configure(${JSON.stringify(AXE_CONFIG)})
              .analyze();

            console.log(JSON.stringify(results));
          } catch (error) {
            console.error('Test failed:', error.message);
          } finally {
            await browser.close();
          }
        }

        runTest();
      `;

      const output = execSync(`node -e "${testScript}"`, {
        cwd: path.resolve(__dirname, '..'),
        encoding: 'utf8',
        stdio: 'pipe'
      });

      const axeResults = JSON.parse(output);

      // Process results
      templateResult.violations = axeResults.violations || [];
      templateResult.passes = axeResults.passes || [];
      templateResult.incomplete = axeResults.incomplete || [];
      templateResult.inapplicable = axeResults.inapplicable || [];

      // Update summary
      this.results.summary.total += axeResults.violations.length + axeResults.passes.length;
      this.results.summary.passed += axeResults.passes.length;
      this.results.summary.failed += axeResults.violations.length;
      this.results.summary.incomplete += axeResults.incomplete.length;
      this.results.summary.inapplicable += axeResults.inapplicable.length;

      // Collect violations for global report
      if (axeResults.violations.length > 0) {
        this.results.violations.push({
          template: templatePath,
          violations: axeResults.violations
        });
      }

      console.log(`  ✅ Passed: ${axeResults.passes.length}`);
      console.log(`  ❌ Failed: ${axeResults.violations.length}`);
      console.log(`  ⚠️  Incomplete: ${axeResults.incomplete.length}`);

    } catch (error) {
      console.error(`  ❌ Test failed for ${templatePath}:`, error.message);
      templateResult.error = error.message;
    }

    this.results.templates.push(templateResult);
  }

  generateReport() {
    console.log('\n📊 Accessibility Test Results\n');

    // Summary
    console.log('📈 Summary:');
    console.log(`  Total checks: ${this.results.summary.total}`);
    console.log(`  ✅ Passed: ${this.results.summary.passed}`);
    console.log(`  ❌ Failed: ${this.results.summary.failed}`);
    console.log(`  ⚠️  Incomplete: ${this.results.summary.incomplete}`);
    console.log(`  📋 Inapplicable: ${this.results.summary.inapplicable}`);

    const passRate = this.results.summary.total > 0
      ? ((this.results.summary.passed / this.results.summary.total) * 100).toFixed(1)
      : '0.0';

    console.log(`  📊 Pass Rate: ${passRate}%\n`);

    // Template results
    console.log('📋 Template Results:');
    this.results.templates.forEach(template => {
      const status = template.violations.length === 0 ? '✅' : '❌';
      console.log(`  ${status} ${template.path}: ${template.violations.length} violations`);
    });

    // Detailed violations
    if (this.results.violations.length > 0) {
      console.log('\n🚨 Critical Violations:');

      this.results.violations.forEach(templateViolation => {
        console.log(`\n📄 ${templateViolation.template}:`);

        // Group violations by impact
        const critical = templateViolation.violations.filter(v => v.impact === 'critical');
        const serious = templateViolation.violations.filter(v => v.impact === 'serious');
        const moderate = templateViolation.violations.filter(v => v.impact === 'moderate');
        const minor = templateViolation.violations.filter(v => v.impact === 'minor');

        if (critical.length > 0) {
          console.log(`  🔥 Critical (${critical.length}):`);
          critical.slice(0, 3).forEach(violation => {
            console.log(`    • ${violation.help}`);
          });
        }

        if (serious.length > 0) {
          console.log(`  ⚠️  Serious (${serious.length}):`);
          serious.slice(0, 3).forEach(violation => {
            console.log(`    • ${violation.help}`);
          });
        }
      });
    }

    // Generate recommendations
    this.generateRecommendations();

    // Save detailed report
    this.saveReport();

    // Exit with appropriate code
    if (this.results.summary.failed > 0) {
      console.log('\n❌ Accessibility test failed - violations found');
      process.exit(1);
    } else {
      console.log('\n✅ All accessibility tests passed!');
      process.exit(0);
    }
  }

  generateRecommendations() {
    console.log('\n💡 Recommendations:');

    const recommendations = [];

    // Check for common issues
    const hasAltIssues = this.results.violations.some(tv =>
      tv.violations.some(v => v.id === 'image-alt')
    );

    const hasColorContrast = this.results.violations.some(tv =>
      tv.violations.some(v => v.id === 'color-contrast')
    );

    const hasHeadingOrder = this.results.violations.some(tv =>
      tv.violations.some(v => v.id === 'heading-order')
    );

    const hasLandmarks = this.results.violations.some(tv =>
      tv.violations.some(v => v.id.includes('landmark'))
    );

    if (hasAltIssues) {
      recommendations.push('• Add descriptive alt text to all images');
    }

    if (hasColorContrast) {
      recommendations.push('• Ensure sufficient color contrast (4.5:1 minimum)');
    }

    if (hasHeadingOrder) {
      recommendations.push('• Fix heading hierarchy (h1 → h2 → h3, no skipping)');
    }

    if (hasLandmarks) {
      recommendations.push('• Add proper ARIA landmarks (main, nav, header, etc.)');
    }

    recommendations.push('• Test with keyboard navigation only');
    recommendations.push('• Test with screen readers (NVDA, JAWS, VoiceOver)');
    recommendations.push('• Ensure focus indicators are visible');

    recommendations.forEach(rec => console.log(rec));
  }

  saveReport() {
    const reportPath = path.resolve(__dirname, '../accessibility-report.json');
    const report = {
      timestamp: new Date().toISOString(),
      summary: this.results.summary,
      templates: this.results.templates.map(t => ({
        path: t.path,
        violations: t.violations.length,
        passes: t.passes.length,
        critical: t.violations.filter(v => v.impact === 'critical').length,
        serious: t.violations.filter(v => v.impact === 'serious').length
      })),
      violations: this.results.violations
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
  }
}

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new AccessibilityTester();
  tester.runTests().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export default AccessibilityTester;
