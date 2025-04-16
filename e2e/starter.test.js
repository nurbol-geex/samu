import {testIDs} from '../src/assets/testIDs';

describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should have onboarding screen', async () => {
    await expect(element(by.id(testIDs.onboardingScreen.id))).toBeVisible();
  });

  it('should show sign-up screen after tap', async () => {
    await element(by.id(testIDs.onboardingScreen.getStartedButton.id)).tap();
    await expect(element(by.id(testIDs.signUpScreen.id))).toBeVisible();
  });
});
