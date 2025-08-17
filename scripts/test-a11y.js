const puppeteer = require('puppeteer');
const { AxePuppeteer } = require('@axe-core/puppeteer');

async function testAccessibility() {
  console.log('Starting accessibility tests...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Test configuration
  const baseUrl = process.env.TEST_URL || 'http://localhost:3000';
  const testPages = [
    `${baseUrl}/en`,
    `${baseUrl}/en/research`,
    `${baseUrl}/en/contact`,
    `${baseUrl}/en/vision`,
  ];
  
  let allTestsPassed = true;
  const results = [];
  
  for (const url of testPages) {
    try {
      console.log(`Testing: ${url}`);
      
      await page.goto(url, { waitUntil: 'networkidle0' });
      
      // Wait for any dynamic content to load
      await page.waitForTimeout(1000);
      
      const axeResults = await new AxePuppeteer(page)
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      
      if (axeResults.violations.length > 0) {
        allTestsPassed = false;
        console.error(`❌ Accessibility violations found on ${url}:`);
        
        axeResults.violations.forEach(violation => {
          console.error(`  - ${violation.id}: ${violation.description}`);
          console.error(`    Impact: ${violation.impact}`);
          console.error(`    Help: ${violation.helpUrl}`);
          
          violation.nodes.forEach(node => {
            console.error(`    Element: ${node.target.join(', ')}`);
            if (node.failureSummary) {
              console.error(`    Issue: ${node.failureSummary}`);
            }
          });
          console.error('');
        });
      } else {
        console.log(`✅ No accessibility violations found on ${url}`);
      }
      
      results.push({
        url,
        violations: axeResults.violations.length,
        passed: axeResults.violations.length === 0
      });
      
    } catch (error) {
      console.error(`❌ Error testing ${url}:`, error.message);
      allTestsPassed = false;
      results.push({
        url,
        error: error.message,
        passed: false
      });
    }
  }
  
  await browser.close();
  
  // Summary
  console.log('\n=== Accessibility Test Summary ===');
  results.forEach(result => {
    const status = result.passed ? '✅' : '❌';
    const info = result.error ? `Error: ${result.error}` : `${result.violations || 0} violations`;
    console.log(`${status} ${result.url} - ${info}`);
  });
  
  if (allTestsPassed) {
    console.log('\n🎉 All accessibility tests passed!');
    process.exit(0);
  } else {
    console.log('\n💥 Some accessibility tests failed. Please fix the issues above.');
    process.exit(1);
  }
}

// Handle uncaught errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the tests if this file is executed directly
if (require.main === module) {
  testAccessibility().catch(error => {
    console.error('Test suite failed:', error);
    process.exit(1);
  });
}

module.exports = testAccessibility;
