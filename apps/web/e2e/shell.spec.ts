import {expect, test} from '@playwright/test';

test('web shell loads in English, toggles to Dutch and is captured as a screenshot', async ({page}, info) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', {level: 1})).toHaveText('Squad room');
  await expect(page.getByRole('navigation', {name: 'Main navigation'})).toContainText('My learning coach');
  await page.screenshot({path: info.outputPath('shell-en.png'), fullPage: true});

  await page.getByRole('button', {name: 'NL'}).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'nl');
  await expect(page.getByRole('heading', {level: 1})).toHaveText('Squad-room');
  await expect(page.getByRole('navigation', {name: 'Hoofdnavigatie'})).toContainText('Mijn leercoach');
  await page.screenshot({path: info.outputPath('shell-nl.png'), fullPage: true});

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'nl');
});

test('direct navigation to /connection-status serves the frontend shell, not the API proxy', async ({page}) => {
  const response = await page.goto('/connection-status');
  expect(response?.status()).toBe(200);
  expect(response?.headers()['content-type'] ?? '').toContain('text/html');
  await expect(page.getByRole('heading', {level: 1})).toHaveText('Connection status');
  await expect(page.getByRole('navigation', {name: 'Main navigation'})).toBeVisible();
  const panel = page.locator('section.panel');
  await expect(panel).toBeVisible();
  await expect(panel).not.toContainText('Room connected');
  await expect(panel.locator('.status, table.connection').first()).toBeVisible();
});
