import {
  call,
  CallEffect,
  put,
  PutEffect,
  SelectEffect,
  takeLatest,
} from 'redux-saga/effects';
import {showToast} from '../../../components/shared/CustomToast/toastUtils';
import {CHECK_ORDER_PAID} from '../constants';
import {checkOrderPaidAPI} from 'src/api/OrderPageAPI/index';
import {clearCart} from 'src/redux/cart/slice';
import {
  clearAddNewCard,
  clearCheckout,
  orderVerifiedFailure,
  orderVerifiedRequest,
  orderVerifiedSuccess,
} from '../slice';
import {getError} from 'src/utils';
function* checkOrderPaidSaga({
  payload,
}: any): Generator<SelectEffect | PutEffect | CallEffect<any>, void, never> {
  try {
    yield put(orderVerifiedRequest());
    const response: Awaited<ReturnType<typeof checkOrderPaidAPI>> = yield call(
      checkOrderPaidAPI,
      payload?.orderId,
    );
    const json = yield response.json();
    if (
      'status' in response &&
      response.status >= 200 &&
      response.status < 300
    ) {
      // showToast('success', json?.message);
      yield put(orderVerifiedSuccess({orderVerifiedData: json}));
      yield put(clearCart({}));
      yield put(clearCheckout({}));
      yield put(clearAddNewCard({}));
      return;
    }

    yield put(orderVerifiedFailure({orderVerifiedData: json?.message}));
    getError(json);
  } catch (error) {
    yield put(orderVerifiedFailure({orderVerifiedFailure: error}));
    getError(error);
  }
}

export function* watchCheckOrderPaidSections() {
  yield takeLatest(CHECK_ORDER_PAID, checkOrderPaidSaga);
}
