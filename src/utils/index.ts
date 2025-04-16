import DeviceInfo from 'react-native-device-info';
import {
  fetch as netinfoFetch,
  NetInfoStateType,
} from '@react-native-community/netinfo';
import {showToast} from 'src/components/shared/CustomToast/toastUtils';
import {firebase} from '@react-native-firebase/auth';
import firebaseAnalytics from '@react-native-firebase/analytics'; // Alias the analytics import
import appsFlyer from 'react-native-appsflyer';

export function formatPhoneNumber(phoneNumberString: string) {
  const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  const formatted = cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  return `${formatted}`;
}

export const appsFlyerTrackEvent = (eventName: any, eventValues = {}) => {
  appsFlyer.logEvent(
    eventName,
    eventValues,
    result => {
      console.log(`Event '${eventName}' logged successfully:`, result);
    },
    error => {
      console.error(`Error logging event '${eventName}':`, error);
    },
  );
};

export async function logAnalyticsEvent(eventKey: string, eventParams: object) {
  try {
    await firebaseAnalytics().logEvent(eventKey, eventParams); // Using the aliased analytics import
    console.log('Analytics event sent:', eventKey);
  } catch (error) {
    console.error('Analytics event failed to send', error);
  }
}
export function checkObjIsEmpty(obj: Record<string, unknown>): boolean {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function injectParamsToURL(
  url: string,
  params: Record<string, unknown> = {},
): string {
  Object.keys(params).map(item => {
    url = url.replace(`{${item}}`, <string>params[item]);
  });
  return url;
}

export function injectIdToURL(
  url: string,
  params: Record<string, unknown> = {},
): string {
  Object.keys(params).map(item => {
    url = url.replace(`:${item}`, <string>params[item]);
  });
  return url;
}

export function uid() {
  return `id${Math.random().toString(36).slice(-6)}`;
}

export function getUniqueId(): Promise<string> {
  return DeviceInfo.getUniqueId();
}

export async function getIpAddress() {
  const {type, details} = await netinfoFetch();
  if (type === NetInfoStateType.wifi) {
    return details.ipAddress as string;
  }
  return '';
}

export async function getUserAgent() {
  return DeviceInfo.getUserAgent();
}

export async function getDeviceObj(): Promise<Device> {
  const uuid = await getUniqueId();
  const ip = await getIpAddress();
  const ua = await getUserAgent();
  return {
    uuid,
    ip,
    ua,
  };
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

type Menu = {
  id: string;
  name: string;
};

type StoreProduct = {
  id: string;
  menu: Menu;
};

export const removeDuplicates = (data: StoreProduct[]): StoreProduct[] => {
  const seen = new Set<string>();
  return data.filter(item => {
    if (!seen.has(item.menu.name)) {
      seen.add(item.menu.name);
      return true; // Keep the item if it's not a duplicate
    }
    return false; // Skip if it's a duplicate
  });
};

const convert24HourTo12Hour = (time: number): string => {
  const hours = Math.floor(time / 100);
  const mins = time % 100;
  const period = hours >= 12 ? 'PM' : 'AM';
  const readableHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format

  return `${readableHours}:${mins.toString().padStart(2, '0')} ${period}`;
};

export const getCurrentDayHours = (hours: any): string => {
  const days = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  const currentDay = days[new Date().getDay()];

  if (hours[currentDay]?.opensAt === 0 && hours[currentDay]?.closesAt === 0) {
    return '12:00 AM - 12:00 AM';
  } else {
    return `${convert24HourTo12Hour(
      hours[currentDay]?.opensAt,
    )} - ${convert24HourTo12Hour(hours[currentDay]?.closesAt)}`;
  }
};

// Function to convert time from military format to AM/PM
export const convertToAmPm = (time: number) => {
  if (time === undefined) return ''; // Handle undefined time
  if (time === 0) return '12:00 AM'; // Handle midnight
  const hours = Math.floor(time / 100);
  const minutes = time % 100;
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12; // Convert 0 or 12 to 12
  const formattedMinutes = minutes.toString().padStart(2, '0'); // Ensure two digits for minutes
  return `${formattedHours}:${formattedMinutes} ${period}`;
};

export const transformDataToSections = (data: any) => {
  const sections = {};

  data.forEach((item: any) => {
    const sectionName = item.menu ? item.menu.name : item?.name;

    if (!sections[sectionName]) {
      sections[sectionName] = {
        title: sectionName,
        data: [],
      };
    }
    sections[sectionName].data.push(item);
  });

  return Object.values(sections);
};

export const formatPrice = (price: number): string => {
  if (isNaN(price) || price === null || price === undefined) {
    return '₦0.00';
  }

  return `₦${price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

export const metersToMiles = (meters: number): string => {
  const miles = meters / 1609.344;
  return miles.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const roundOffToNearestFive = (num: any) => {
  return Math.ceil(num / 5) * 5;
};

export default roundOffToNearestFive;

export interface CardFields {
  name: string;
  cardNumber: string;
  expDate: string;
  cvc: string;
  billingAddress: string;
}

export interface Errors {
  name?: string;
  cardNumber?: string;
  expDate?: string;
  cvc?: string;
  billingAddress?: string;
}

export const formatCardNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  const length = Math.min(cleaned.length, 19);
  const limitedValue = cleaned.slice(0, length);
  if (length <= 16) {
    return limitedValue.replace(/(\d{4})(?=\d)/g, '$1-');
  }
  return limitedValue.replace(/(\d{4})(?=\d{4})/g, '$1-');
};

export const formatExpiryDate = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length <= 2) {
    return cleaned;
  }
  return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 6);
};

export const validateCardNumber = (number: string): boolean => {
  const regex =
    /^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|(6(?:011|5[0-9]{2})[0-9]{12})|(62[0-9]{14,17})|((?:5018|5020|5038|6304|6759|6761|6763)[0-9]{8,15})|((?:2131|1800|35[0-9]{3})[0-9]{11})|((?:6304|6706|6709|6771)[0-9]{12,15})|((?:6334|6767)[0-9]{12,15})|((?:4903|4905|4911|4936|6333|6759)[0-9]{12,15})|(9[0-9]{15})|([0-9]{12,19}))$/;
  // const regex = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12}|5060[0-9]{15})$/;
  return regex.test(number.replace(/[-\s]/g, ''));
};

export const validateExpiryDate = (date: string): boolean => {
  const regex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
  return regex.test(date);
};

export const validateFields = (fields: CardFields): Errors => {
  const errors: Errors = {};
  if (!fields.name) {
    errors.name = 'Name is required';
  }
  if (!fields.cardNumber) {
    errors.cardNumber = 'Card number is required';
  } else if (!validateCardNumber(fields.cardNumber)) {
    errors.cardNumber = 'Invalid card number';
  }
  if (!fields.expDate) {
    errors.expDate = 'Expiry date is required';
  } else if (!validateExpiryDate(fields.expDate)) {
    errors.expDate = 'Invalid expiry date';
  }
  if (!fields.cvc) {
    errors.cvc = 'CVC is required';
  }
  if (!fields.billingAddress) {
    errors.billingAddress = 'Billing address is required';
  }
  return errors;
};

export const extractBin = (cardNumber: string): string => {
  return cardNumber.replace(/-/g, '').substring(0, 6);
};

export const extractLast4 = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/-/g, '');
  return cleaned.substring(cleaned.length - 4);
};
export const extractAllDash = (cardNumber: string): string => {
  return cardNumber.replace(/-/g, '');
};
export const extractExpMonth = (expDate: string): string => {
  return expDate.split('/')[0];
};

export const extractExpYear = (expDate: string): string => {
  return expDate.split('/')[1]?.slice(-2);
};

export const extractFirstName = (name: string): string => {
  return name.split(' ')[0];
};

export const extractLastName = (name: string): string => {
  const parts = name.split(' ');
  return parts.length > 1 ? parts.slice(1).join(' ') : '';
};

export const getError = (error: any) => {
  showToast(
    'error',
    'Error',

    error.message ||
      error.response.data ||
      error.response.data.message ||
      'An error has occurred',
  );
};

export const dateFormater = dateString => {
  const date = new Date(dateString);

  const options = {
    month: 'long',
    year: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };

  return date.toLocaleString('en-US', options);
};

export enum APIMethods {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}
export enum OrderStatus {
  pending = 'pending',
  processed = 'processed',
  accepted = 'accepted',
  ready = 'ready',
  pickedUp = 'pickedUp',
  onDelivery = 'onDelivery',
  completed = 'completed',
  failed = 'failed',
  cancelled = 'cancelled',
}

export enum OrderStatusText {
  pending = 'Order Pending',
  processed = 'Order Processed',
  accepted = 'Order Accepted',
  ready = 'Order Packed',
  pickedUp = 'Order Picked Up',
  onDelivery = 'On Delivery',
  completed = 'Order Completed',
  failed = 'Order Failed',
  cancelled = 'Order Cancelled',
}

export const keyMappings: any = {
  subTotal: 'Subtotal',
  deliveryFee: 'Delivery Fee',
  serviceFee: 'Service Fee',
  taxes: 'Taxes',
  tip: 'Tip',
  total: 'Total',
  discount: 'Discount',
};
