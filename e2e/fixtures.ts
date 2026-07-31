import { test as testBase } from '@playwright/test';
import { addCoverageReport } from 'monocart-reporter';

export const test = testBase.extend({
  page: async ({ page, browserName }, use) => {
    const isChromium = browserName === 'chromium';
    if (isChromium) {
      await Promise.all([
        page.coverage.startJSCoverage({ resetOnNavigation: false }),
        page.coverage.startCSSCoverage({ resetOnNavigation: false })
      ]);
    }

    await use(page);

    if (isChromium) {
      const [jsCoverage, cssCoverage] = await Promise.all([
        page.coverage.stopJSCoverage(),
        page.coverage.stopCSSCoverage()
      ]);
      const coverageData = [...jsCoverage, ...cssCoverage];
      await addCoverageReport(coverageData, test.info());
    }
  },
});

export { expect } from '@playwright/test';
