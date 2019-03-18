
const webdriver = require('selenium-webdriver');

/**
 * Helper function to provide browser object for our test cases. Usage
 *  desribeWithBrowser(
 *    'name'
 *  )
 * 
 * @param {string} name 
 * @param {function} callback 
 * @param {code} body 
 */
module.exports = function describeWithBrowser(name, callback, body) {
  let browser;
  describe(name, () => {
    // as we using beforeEach here, new browser will be received for every test case
    beforeEach(async () => {
      browser = new webdriver.Builder()
          .usingServer('http://172.31.1.113:4444/wd/hub')
          .withCapabilities({ browserName: 'chrome' })
          .build();
      await browser.get('http://moskva.beeline.ru/shop/');
      await browser.manage().addCookie({ name: 'BasketABTest', value: 'new' });
      await browser.manage().addCookie({ name: 'CatalogABTest', value: 'old' });

      callback(browser);
    });


    body();
    
    // we should shut down browser when we don't need it anymore, in order to avoid
    // dead sessions. Always ensure that you are ending your session in the test end!
    afterEach(() => {
      return browser.quit();
    });
  });
};
