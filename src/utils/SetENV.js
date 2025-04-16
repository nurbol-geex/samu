import {DEV_BASE_URL, PROD_BASE_URL, STAGING_BASE_URL} from '@env';

let storedBaseUrl = null;

export let domainUrl;

// Function to get the base URL from email and store it in a local variable
export const getBaseUrlFromEmail = email => {
  // domainUrl = email?.split('@')[1];
  let baseUrl;
  if (email?.includes('dev')) {
    baseUrl = DEV_BASE_URL;
  } else if (email?.includes('staging')) {
    baseUrl = DEV_BASE_URL;
  } else {
    baseUrl = PROD_BASE_URL; // Default to production if no match
  }

  // Store the base URL in a local variable
  storedBaseUrl = baseUrl;

  return baseUrl;
};

// Function to retrieve the base URL from the local variable
export const getBaseUrlFromStorage = () => {
  console.log('storedBaseUrl======', storedBaseUrl);

  return storedBaseUrl ? storedBaseUrl : PROD_BASE_URL; // Default to production if no stored URL
};
