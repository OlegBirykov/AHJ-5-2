/* eslint no-underscore-dangle: 0 */

import puppetteer from 'puppeteer';
import { fork } from 'child_process';

jest.setTimeout(30000); // default puppeteer timeout

describe('Product List Editor', () => {
  let browser = null;
  let page = null;
  let server = null;
  const baseUrl = 'http://localhost:9000';

  let priceListWidget = null;
  let addButton = null;
  let productList = null;

  let editForm = null;
  let nameInput = null;
  let priceInput = null;
  let saveButton = null;
  let cancelSaveButton = null;

  let deleteForm = null;
  let deleteButton = null;
  let cancelDeleteButton = null;

  let errorTooltips = null;

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
    await page.goto(baseUrl);

    priceListWidget = await page.$('[data-widget=price-list-form]');
    addButton = await priceListWidget.$('[data-id=command-create]');
    productList = await priceListWidget.$('[data-id=product-list]');

    editForm = await page.$('[data-widget=edit-form]');
    nameInput = await editForm.$('[data-id=name]');
    priceInput = await editForm.$('[data-id=price]');
    saveButton = await editForm.$('[data-id=save]');
    cancelSaveButton = await editForm.$('[data-id=cancel]');

    deleteForm = await page.$('[data-widget=delete-form]');
    deleteButton = await deleteForm.$('[data-id=delete]');
    cancelDeleteButton = await deleteForm.$('[data-id=cancel]');

    errorTooltips = await page.$$('[data-widget=tooltip]');
  });

  afterAll(async () => {
    await browser.close();
    server.kill();
  });

  test('the product should be added', async () => {
    await addButton.click();
    let status = await editForm.getProperty('className');
    expect(status._remoteObject.value.includes('active')).toBe(true);

    await cancelSaveButton.click();
    status = await editForm.getProperty('className');
    expect(status._remoteObject.value.includes('active')).toBe(false);

    await addButton.click();
    await saveButton.click();
    status = await errorTooltips[0].getProperty('className');
    expect(status._remoteObject.value.includes('active')).toBe(true);
    status = await errorTooltips[1].getProperty('className');
    expect(status._remoteObject.value.includes('active')).toBe(false);

    await nameInput.type('Пылесос');
    await saveButton.click();
    status = await errorTooltips[0].getProperty('className');
    expect(status._remoteObject.value.includes('active')).toBe(false);
    status = await errorTooltips[1].getProperty('className');
    expect(status._remoteObject.value.includes('active')).toBe(true);

    await priceInput.type('8 500');
    await saveButton.click();
    status = await errorTooltips[0].getProperty('className');
    expect(status._remoteObject.value.includes('active')).toBe(false);
    status = await errorTooltips[1].getProperty('className');
    expect(status._remoteObject.value.includes('active')).toBe(false);
    const rows = await productList.$$('tr');
    const cols = await rows[0].$$('td');
    status = await cols[0].getProperty('innerText');
    expect(status._remoteObject.value).toBe('Пылесос');
    status = await cols[1].getProperty('innerText');
    expect(status._remoteObject.value).toBe('8 500');
  });

  test('the product should be updated', async () => {
    const editButtons = await productList.$$('[data-id=command-edit]');

    await editButtons[0].click();
    let status = await editForm.getProperty('className');
    expect(status._remoteObject.value.includes('active')).toBe(true);

    await priceInput.press('Backspace');
    await priceInput.press('Backspace');
    await priceInput.press('Backspace');
    await priceInput.type('200');
    await saveButton.click();
    const rows = await productList.$$('tr');
    const cols = await rows[0].$$('td');
    status = await cols[0].getProperty('innerText');
    expect(status._remoteObject.value).toBe('Пылесос');
    status = await cols[1].getProperty('innerText');
    expect(status._remoteObject.value).toBe('8 200');
  });

  test('the product should be deleted', async () => {
    const delButtons = await productList.$$('[data-id=command-delete]');

    await delButtons[0].click();
    let status = await deleteForm.getProperty('className');
    expect(status._remoteObject.value.includes('active')).toBe(true);

    await cancelDeleteButton.click();
    status = await deleteForm.getProperty('className');
    expect(status._remoteObject.value.includes('active')).toBe(false);

    let rows = await productList.$$('tr');
    expect(rows.length).toBe(1);
    await delButtons[0].click();
    await deleteButton.click();
    rows = await productList.$$('tr');
    expect(rows.length).toBe(0);
  });
});
