import store from 'src/redux';
import {apiHandler} from '../apiHandler';
import {APIMethods} from '../APIMethods';
import {APIRoutes} from '../APIRoutes';
import {injectIdToURL} from 'src/utils';

export function productAddToCartAPI(data: any) {
  return apiHandler<any>({
    method: APIMethods.POST,
    url: APIRoutes.User.productAddToCart(),
    body: data,
    headers: {
      Authorization: `Bearer ${store.getState().user.accessToken}`,
    },
  });
}
export function productGetCartAPI() {
  return apiHandler<any>({
    method: APIMethods.GET,
    url: APIRoutes.User.productGetCart(),
    headers: {
      Authorization: `Bearer ${store.getState().user.accessToken}`,
    },
  });
}

export function productUpdateCartAPI(data: any, productCartId: string) {
  return apiHandler<any>({
    method: APIMethods.PUT,
    url: injectIdToURL(APIRoutes.User.productUpdateCart(), {productCartId}),
    body: data,
    headers: {
      Authorization: `Bearer ${store.getState().user.accessToken}`,
    },
  });
}

export function productRemoveCartAPI(productCartId: string) {
  return apiHandler<any>({
    method: APIMethods.DELETE,
    url: injectIdToURL(APIRoutes.User.productRemoveCart(), {productCartId}),
    headers: {
      Authorization: `Bearer ${store.getState().user.accessToken}`,
    },
  });
}

export function productClearCartAPI(cartId: string) {
  return apiHandler<any>({
    method: APIMethods.DELETE,
    url: injectIdToURL(APIRoutes.User.productClearCart(), {cartId}),
    headers: {
      Authorization: `Bearer ${store.getState().user.accessToken}`,
    },
  });
}

export function updateCartAddressAPI(data: any, cartId: string) {
  return apiHandler<any>({
    method: APIMethods.PUT,
    url: injectIdToURL(APIRoutes.User.updateCartAddress(), {cartId}),
    body: data,
    headers: {
      Authorization: `Bearer ${store.getState().user.accessToken}`,
    },
  });
}
