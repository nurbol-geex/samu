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
  ProductUpdateCartFailure,
  ProductUpdateCartRequest,
  ProductUpdateCartSuccess,
} from '../../cart/slice';
import {
  GET_PRODUCT_GET_CART_REQUEST,
  PRODUCT_UPDATE_CART_REQUEST,
} from '../../cart/constants';
import {productRemoveCartAPI, productUpdateCartAPI} from 'src/api/CartPageAPI';
import {getError} from 'src/utils';
import * as Sentry from '@sentry/react-native'; // Import Sentry

function* productUpdateCartSaga({
  payload,
  productCartId,
  productRemove,
}: any): Generator<SelectEffect | PutEffect | CallEffect<any>, void, never> {
  try {
    yield put(ProductUpdateCartRequest());
    let response: Awaited<
      ReturnType<typeof productRemoveCartAPI | typeof productUpdateCartAPI>
    >;
    if (productRemove) {
      response = yield call(productRemoveCartAPI, productCartId);
      const json = yield response.json();
      if (
        'status' in response &&
        response.status >= 200 &&
        response.status < 300
      ) {
        // showToast('success', 'Success', json?.message);
        yield put(ProductUpdateCartSuccess({productUpdateCartData: json}));
      }
    } else {
      response = yield call(productUpdateCartAPI, payload, productCartId);
      const json = yield response.json();
      if (
        'status' in response &&
        response.status >= 200 &&
        response.status < 300
      ) {
        // showToast('success', 'Success', json?.message);
        yield put(ProductUpdateCartSuccess({productUpdateCartData: json}));
        return;
      }
      yield put(ProductUpdateCartFailure({message: json?.message}));
      yield put({type: GET_PRODUCT_GET_CART_REQUEST});
      getError(json);
    }
  } catch (error) {
    Sentry.captureException(error?.message);
    
    yield put(ProductUpdateCartFailure(error));
    yield put({type: GET_PRODUCT_GET_CART_REQUEST});
    getError(error);
  }
}

export function* watchUpdateCartSection() {
  yield takeLatest(PRODUCT_UPDATE_CART_REQUEST, productUpdateCartSaga);
}
