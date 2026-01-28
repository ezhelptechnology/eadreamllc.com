import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Etheleen & Alma's Dream/i);
});

test('can navigate to login', async ({ page }) => {
    await page.goto('/');
    const adminLink = page.getByRole('link', { name: /Admin Access/i });
    await adminLink.click();
    await expect(page).toHaveURL(/\/admin\/login/);
});
