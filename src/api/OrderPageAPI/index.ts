import store from 'src/redux';
import {apiHandler} from '../apiHandler';
import {APIMethods} from '../APIMethods';
import {APIRoutes} from '../APIRoutes';
import {injectIdToURL, injectParamsToURL} from 'src/utils';

export function getAllPaymentMethodsAPI() {
  return apiHandler<any>({
    method: APIMethods.GET,
    url: APIRoutes.User.getAllPaymentMethods(),
    headers: {
      Authorization: `Bearer ${store.getState().user.accessToken}`,
    },
  });
}

export function getInitiatePaymentAPI(cartId: string) {
  return apiHandler<any>({
    method: APIMethods.GET,
    url: injectIdToURL(APIRoutes.User.getInitiatePayment(), {cartId}),
    headers: {
      Authorization: `Bearer ${store.getState().user.accessToken}`,
    },
  });
}

export function setupPaymentChargeAPI(payload: {
  cartId: string;
  authorization_code: string;
}) {
  return apiHandler<any>({
    method: APIMethods.POST,
    url: APIRoutes.User.setupPaymentCharge(),
    headers: {
      Authorization: `Bearer ${store.getState().user.accessToken}`,
    },
    body: payload,
  });
}

export function setupCheckoutAPI(payload: {
  cartId: string;
  paymentMethodId: string;
  pickUpTime: string;
  storeNotes: string;
  driverNotes: string;
  tip: number;
  isBankTransfer:boolean;
  promoCode: string;
}) {
  return apiHandler<any>({
    method: APIMethods.POST,
    url: APIRoutes.User.setupCheckout(),
    headers: {
      Authorization: `Bearer ${store.getState().user.accessToken}`,
    },
    body: payload,
  });
}

export function addNewPaymentMethodAPI(payload: {
  name: string;
  bin: string;
  last4: string;
  expMonth: string;
  expYear: string;
  firstName: string;
  lastName: string;
  isDefault: boolean;
}) {
  return apiHandler<any>({
    method: APIMethods.POST,
    url: APIRoutes.User.addNewPaymentMethod(),
    headers: {
      Authorization: `Bearer ${store.getState().user.accessToken}`,
    },
    body: payload,
  });
}

export function setupPaymentDefaultAPI(paymentMethodId: string) {
  return apiHandler<any>({
    method: APIMethods.PUT,
    url: injectIdToURL(APIRoutes.User.setupPaymentDefault(), {paymentMethodId}),
    headers: {
      Authorization: `Bearer ${store.getState().user.accessToken}`,
    },
  });
}

export function updatePaymentMethodAPI(
  orderId: string,
  paymentMethodId: string,
) {
  return apiHandler<any>({
    method: APIMethods.POST,
    url: injectIdToURL(APIRoutes.User.updatePaymentMethod(), {orderId}),
    headers: {
      Authorization: `Bearer ${store.getState().user.accessToken}`,
    },
    body: {
      paymentMethodId,
    },
  });
}

export function checkOrderPaidAPI(orderId: string) {
  return apiHandler<any>({
    method: APIMethods.GET,
    url: injectIdToURL(APIRoutes.User.checkOrderPaid(), {orderId}),
    headers: {
      Authorization: `Bearer ${store.getState().user.accessToken}`,
    },
  });
}

export function paymentCalculateAPI(data: {cartId: string; tip: number,isBankTransfer:boolean, promoCode: string}) {
  return apiHandler<any>({
    method: APIMethods.POST,
    url: APIRoutes.User.paymentCalculated(),
    headers: {
      Authorization: `Bearer ${store.getState().user.accessToken}`,
    },
    body: data,
  });
}

export function getOrderDetailsAPI(orderId: string) {
  return apiHandler<any>({
    method: APIMethods.GET,
    url: injectIdToURL(APIRoutes.User.getOrderDetails(), {orderId}),
    headers: {
      Authorization: `Bearer ${store.getState().user.accessToken}`,
    },
  });
}

export function getAllOrdersAPI(
  page: number,
  pageSize: number,
  status: string,
  sortBy: string,
) {
  return apiHandler<any>({
    method: APIMethods.GET,
    url: injectParamsToURL(APIRoutes.User.getAllOrders(), {
      page,
      pageSize,
      status,
      sortBy,
    }),
    headers: {
      Authorization: `Bearer ${store.getState().user.accessToken}`,
    },
  });
}

export function cancelOrderAPI(orderId: string) {
  return apiHandler<any>({
    method: APIMethods.PUT,
    url: injectIdToURL(APIRoutes.User.cancelOrder(), {orderId}),
    headers: {
      Authorization: `Bearer ${store.getState().user.accessToken}`,
    },
  });
}
