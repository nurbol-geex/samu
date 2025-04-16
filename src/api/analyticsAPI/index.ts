import store from 'src/redux';
import {APIMethods} from '../APIMethods';
import {APIRoutes} from '../APIRoutes';
import {apiHandler} from '../apiHandler';

export function pageOpened(
  pageName: string,
  userId: string,
  sessionId: string,
) {
  return apiHandler<GetHomeResponse>({
    method: APIMethods.POST,
    url: APIRoutes.User.pageOpened(),
    body: {pageName, userId, sessionId},
    headers: {
      Authorization: `Bearer ${store.getState().user.accessToken}`,
    },
  });
}

export function searchPlaced(
  searchQuery: string,
  userId: string,
  sessionId: string,
) {
  return apiHandler<GetHomeResponse>({
      method: APIMethods.POST,
    url: APIRoutes.User.searchPlaced(),
    body: {searchQuery, userId, sessionId},
    headers: {
      Authorization: `Bearer ${store.getState().user.accessToken}`,
    },
  });
}

export function searchResult(
  searchQuery: string,
  userId: string,
  sessionId: string,
  itemsShown: string,
  selectedItem: string,
) {
  return apiHandler<GetHomeResponse>({
    method: APIMethods.POST,
    url: APIRoutes.User.searchResult(),
    body: {searchQuery, userId, sessionId, itemsShown, selectedItem},
    headers: {
      Authorization: `Bearer ${store.getState().user.accessToken}`,
    },
  });
}
export function viewProduct(
  productId: string,
  userId: string,
  sessionId: string,
) {
  return apiHandler<GetHomeResponse>({
    method: APIMethods.POST,
    url: APIRoutes.User.viewProduct(),
    body: {productId, userId, sessionId},
    headers: {
      Authorization: `Bearer ${store.getState().user.accessToken}`,
    },
  });
}
export function addToCart(
  productId: string,
  userId: string,
  sessionId: string,
  quantity: string,
) {
  return apiHandler<GetHomeResponse>({
    method: APIMethods.POST,
    url: APIRoutes.User.addToCart(),
    body: {quantity, productId, userId, sessionId},
    headers: {
      Authorization: `Bearer ${store.getState().user.accessToken}`,
    },
  });
}
export function cartPage(cartItems: string, userId: string, sessionId: string) {
  return apiHandler<GetHomeResponse>({
    method: APIMethods.POST,
    url: APIRoutes.User.cartPage(),
    body: {cartItems, userId, sessionId},
    headers: {
      Authorization: `Bearer ${store.getState().user.accessToken}`,
    },
  });
}
export function beginAddingPaymentMethod(userId: string, sessionId: string) {
  return apiHandler<GetHomeResponse>({
    method: APIMethods.POST,
    url: APIRoutes.User.beginAddingPaymentMethod(),
    body: {userId, sessionId},
    headers: {
      Authorization: `Bearer ${store.getState().user.accessToken}`,
    },
  });
}
export function paymentMethodAdded(
  paymentMethodType: string,
  userId: string,
  sessionId: string,
) {
  return apiHandler<GetHomeResponse>({
    method: APIMethods.POST,
    url: APIRoutes.User.paymentMethodAdded(),
    body: {paymentMethodType, userId, sessionId},
    headers: {
      Authorization: `Bearer ${store.getState().user.accessToken}`,
    },
  });
}
export function tipSet(tipAmount: number, userId: string, sessionId: string) {
  return apiHandler<GetHomeResponse>({
    method: APIMethods.POST,
    url: APIRoutes.User.tipSet(),
    body: {tipAmount, userId, sessionId},
    headers: {
      Authorization: `Bearer ${store.getState().user.accessToken}`,
    },
  });
}
export function checkoutStarted(
  cartTotal: number,
  items: string,
  userId: string,
  sessionId: string,
) {
  return apiHandler<GetHomeResponse>({
    method: APIMethods.POST,
    url: APIRoutes.User.checkoutStarted(),
    body: {cartTotal, items, userId, sessionId},
    headers: {
      Authorization: `Bearer ${store.getState().user.accessToken}`,
    },
  });
}
export function checkoutFailed(
  reason: string,
  userId: string,
  sessionId: string,
) {
  return apiHandler<GetHomeResponse>({
    method: APIMethods.POST,
    url: APIRoutes.User.checkoutFailed(),
    body: {reason, userId, sessionId},
    headers: {
      Authorization: `Bearer ${store.getState().user.accessToken}`,
    },
  });
}
export function storePageView(
  storeId: string,
  userId: string,
  sessionId: string,
) {
  return apiHandler<GetHomeResponse>({
    method: APIMethods.POST,
    url: APIRoutes.User.storePageView(),
    body: {storeId, userId, sessionId},
    headers: {
      Authorization: `Bearer ${store.getState().user.accessToken}`,
    },
  });
}
export function checkoutCompleted(
  orderId: string,
  total: number,
  userId: string,
  sessionId: string,
) {
  return apiHandler<GetHomeResponse>({
    method: APIMethods.POST,
    url: APIRoutes.User.checkoutCompleted(),
    body: {orderId, total, userId, sessionId},
    headers: {
      Authorization: `Bearer ${store.getState().user.accessToken}`,
    },
  });
}
