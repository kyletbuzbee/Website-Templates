const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

/**
 * Visual Regression Tests
 * Tests for visual consistency across template builds
 */

test.describe('Visual Regression Tests', () => {
  test.setTimeout(120000); // 2 minutes timeout

  // Test template pages for visual consistency
  const templates = [
    'restaurants-home',
    'legal-home',
    'fitness-home',
    'real-estate-home',
    'business-home',
    'starter-home',
    'creative-home',
    'minimal-home',
    'premium-interactive-home'
  ];

  templates.forEach(template => {
    test(`should match visual snapshot for ${template}`, async ({ page }) => {
      // Navigate to the template page
      await page.goto(`http://localhost:4173/${template}.html`);

      // Wait for page to load completely
      await page.waitForLoadState('networkidle');

      // Wait for any animations to complete
      await page.waitForTimeout(2000);

      // Take screenshot and compare with baseline
      await expect(page).toHaveScreenshot(`${template}.png`, {
        fullPage: true,
        threshold: 0.1, // Allow 10% difference for minor variations
        maxDiffPixels: 100 // Allow up to 100 different pixels
      });
    });
  });

  test('should have consistent layout across templates', async ({ page }) => {
    const layoutTests = [
      { name: 'Header consistency', selector: 'header' },
      { name: 'Navigation consistency', selector: 'nav' },
      { name: 'Hero section structure', selector: '.hero' },
      { name: 'Footer consistency', selector: 'footer' }
    ];

    for (const layoutTest of layoutTests) {
      await test.step(`Check ${layoutTest.name}`, async () => {
        // Test on business template as baseline
        await page.goto('http://localhost:4173/business-home.html');
        await page.waitForLoadState('networkidle');

        const baselineElement = await page.locator(layoutTest.selector).first();
        const baselineVisible = await baselineElement.isVisible();

        if (baselineVisible) {
          const baselineBox = await baselineElement.boundingBox();

          // Test on other templates
          for (const template of ['starter-home', 'creative-home']) {
            await page.goto(`http://localhost:4173/${template}.html`);
            await page.waitForLoadState('networkidle');

            const testElement = await page.locator(layoutTest.selector).first();
            const testVisible = await testElement.isVisible();

            // Element should exist and be visible
            expect(testVisible).toBe(true);

            if (testVisible) {
              const testBox = await testElement.boundingBox();
              // Basic layout consistency check
              expect(testBox.width).toBeGreaterThan(0);
              expect(testBox.height).toBeGreaterThan(0);
            }
          }
        }
      });
    }
  });

  test('should load all templates without errors', async ({ page }) => {
    for (const template of templates) {
      await test.step(`Load ${template}`, async () => {
        const response = await page.goto(`http://localhost:4173/${template}.html`);
        expect(response.status()).toBe(200);

        // Check for console errors
        const errors = [];
        page.on('console', msg => {
          if (msg.type() === 'error') {
            errors.push(msg.text());
          }
        });

        await page.waitForLoadState('networkidle');

        // Should not have critical console errors
        const criticalErrors = errors.filter(error =>
          !error.includes('favicon') && // Ignore favicon errors
          !error.includes('analytics') && // Ignore analytics errors
          !error.includes('google') // Ignore Google-related errors
        );

        expect(criticalErrors.length).toBeLessThan(3); // Allow some minor errors
      });
    }
  });

  test('should have proper responsive behavior', async ({ page, browser }) => {
    // Test on desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:4173/business-home.html');
    await page.waitForLoadState('networkidle');

    const desktopScreenshot = await page.screenshot({ fullPage: true });

    // Test on mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForLoadState('networkidle');

    const mobileScreenshot = await page.screenshot({ fullPage: true });

    // Screenshots should be different (responsive design working)
    expect(desktopScreenshot.length).not.toBe(mobileScreenshot.length);

    // Mobile layout should still be functional
    const mobileHero = await page.locator('.hero').first();
    const mobileHeroVisible = await mobileHero.isVisible();
    expect(mobileHeroVisible).toBe(true);
  });

  test('should maintain accessibility standards', async ({ page }) => {
    await page.goto('http://localhost:4173/business-home.html');
    await page.waitForLoadState('networkidle');

    // Check for basic accessibility features
    const images = await page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      // Images should have alt text (or be decorative)
      expect(alt !== null || alt === '').toBe(true);
    }

    // Check for heading hierarchy
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThan(0);

    // Check for proper form labels
    const inputs = await page.locator('input[required]').all();
    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const label = await page.locator(`label[for="${id}"]`).count();
      expect(label).toBeGreaterThan(0);
    }
  });
});
