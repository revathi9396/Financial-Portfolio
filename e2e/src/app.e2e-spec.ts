import { browser, by, element } from 'protractor';

describe('My Angular App E2E Tests', () => {
  it('should display the header', () => {
    browser.get('/');
    const header = element(by.css('app-header'));
    expect(header.isPresent()).toBe(true);
  });

  it('should navigate to dashboard', () => {
    browser.get('/');
    const dashboardLink = element(by.css('a[href="/dashboard"]'));
    dashboardLink.click();
    const dashboardTitle = element(by.css('app-dashboard h1'));
    expect(dashboardTitle.getText()).toEqual('Dashboard');
  });
});