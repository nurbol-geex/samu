import {
  call,
  CallEffect,
  put,
  PutEffect,
  SelectEffect,
  takeLatest,
} from 'redux-saga/effects';
import {showToast} from '../../../components/shared/CustomToast/toastUtils';
import {
  ProductAddToCartFailure,
  ProductAddToCartRequest,
  ProductAddToCartSuccess,
  saveLocalCartRequest,
} from '../../cart/slice';
import {PRODUCT_ADD_TO_CART_REQUEST} from '../../cart/constants';
import {productAddToCartAPI} from 'src/api/CartPageAPI';
import {getError} from 'src/utils';
import * as Sentry from '@sentry/react-native'; // Import Sentry

function* productAddToCartSaga({
  payload,
  price,
  image,
  name,
  productExtraOptions,
  storeName,
  storeAddress,
  deliveryTime,
}: any): Generator<SelectEffect | PutEffect | CallEffect<any>, void, never> {
  try {
    yield put(ProductAddToCartRequest());
    const response: Awaited<ReturnType<typeof productAddToCartAPI>> =
      yield call(productAddToCartAPI, payload);
    const json = yield response.json();

    if (
      'status' in response &&
      response.status >= 200 &&
      response.status < 300
    ) {
      yield put(ProductAddToCartSuccess({productAddToCartData: json}));
      const selectedCartItem = json?.cart?.products.find(
        item => item?.product?.id === payload?.productId,
      );
      yield put(
        saveLocalCartRequest({
          storeId: payload.storeId,
          productId: payload?.productId,
          quantity: payload?.count,
          price: price,
          image: image,
          name: name,
          productOptionValueIds: payload?.productOptionValueIds,
          cartProductItemId: selectedCartItem.cartProductItemId,
          productExtraOptions: productExtraOptions,
          cartId: json?.cart?.id,
          deliveryAddress: payload?.deliveryAddress,
          storeName: storeName,
          storeAddress: storeAddress,
          deliveryTime: deliveryTime
        }),
      );
      // showToast('success', 'Success', json?.message);
      return;
    }
    yield put(ProductAddToCartFailure({message: json?.message}));
    getError(json);
  } catch (error) {
    Sentry.captureException(error?.message);
    yield put(ProductAddToCartFailure(error));
    getError(error);
  }
}

export function* watchAddToCartSection() {
  yield takeLatest(PRODUCT_ADD_TO_CART_REQUEST, productAddToCartSaga);
}
