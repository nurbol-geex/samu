import {injectIdToURL} from 'src/utils';
import {APIMethods} from '../APIMethods';
import {APIRoutes} from '../APIRoutes';
import {apiHandler} from '../apiHandler';

interface Options {
  categories: [];
}

export function getStoreDetailsAPI(
  storeId: string,
  longitude: string,
  latitude: string,
) {
  return apiHandler<any>({
    method: APIMethods.POST,
    url: APIRoutes.User.storeDetails(),
    body: {
      storeId: storeId,
      longitude: longitude,
      latitude: latitude,
    },
  });
}

export function getStoreMenuAPI(storeId: string) {
  return apiHandler<any>({
    method: APIMethods.GET,
    url: injectIdToURL(APIRoutes.User.storeMenu(), {storeId}),
  });
}

export function getStoreProductAPI(storeId: string) {
  return apiHandler<any>({
    method: APIMethods.GET,
    url: injectIdToURL(APIRoutes.User.storeProduct(), {storeId}),
  });
}

export function getStoreProductDetailsAPI(productId: string) {
  return apiHandler<any>({
    method: APIMethods.GET,
    url: injectIdToURL(APIRoutes.User.storeProductDetails(), {productId}),
  });
}

export function searchStoresAPI(
  searchKey: string,
  longitude: string,
  latitude: string,
  options: Options,
) {
  return apiHandler<any>({
    method: APIMethods.POST,
    url: `${APIRoutes.User.searchStores()}`,
    body: {
      keyword: searchKey,
      longitude: longitude,
      latitude: latitude,
      options: options,
    },
  });
}
