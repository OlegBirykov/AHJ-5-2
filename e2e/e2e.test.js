import puppetteer from 'puppeteer';
import { fork } from 'child_process';

jest.setTimeout(30000); // default puppeteer timeout

describe('Product List Editor', () => {
  let browser = null;
  let page = null;
  let server = null;
  const baseUrl = 'http://localhost:9000';

  beforeAll(async () => {
    server = fork(`${__dirname}/e2e.server.js`);
    await new Promise((resolve, reject) => {
      server.on('error', reject);
      server.on('message', (message) => {
        if (message === 'ok') {
          resolve();
        }
      });
    });

    browser = await puppetteer.launch({
      // headless: false, // show gui
      // slowMo: 250,
      // devtools: true, // show devTools
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
    server.kill();
  });

  test('should add do something', async () => {
    await page.goto(baseUrl);
  });
/*
  test('should add .valid class for valid number', async () => {
    const widget = await page.$('[data-widget=card-validator-widget]');
    const input = await widget.$('[data-id=input]');
    const result = await widget.$('[data-id=result]');

    await input.type('3540123456789016');
    await input.press('Enter');
    const status = await result.getProperty('className');
    // eslint-disable-next-line no-underscore-dangle
    expect(status._remoteObject.value).toBe('result valid');
  });

  test('should not add .valid class for invalid number', async () => {
    const widget = await page.$('[data-widget=card-validator-widget]');
    const input = await widget.$('[data-id=input]');
    const result = await widget.$('[data-id=result]');

    await input.type('3540123456789015');
    await input.press('Enter');
    const status = await result.getProperty('className');
    // eslint-disable-next-line no-underscore-dangle
    expect(status._remoteObject.value).toBe('result');
  });
  */
});
