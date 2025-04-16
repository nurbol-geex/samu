import {
  call,
  CallEffect,
  put,
  PutEffect,
  SelectEffect,
  takeLatest,
} from 'redux-saga/effects';
import {CANCEL_ORDER} from '../constants';
import {cancelOrderAPI} from 'src/api/OrderPageAPI/index';
import {
  cancelOrderFailure,
  cancelOrderRequest,
  cancelOrderSuccess,
} from '../slice';
import {getError} from 'src/utils';
import {showToast} from 'src/components/shared/CustomToast/toastUtils';

function* cancelOrderSaga({
  payload,
}: any): Generator<SelectEffect | PutEffect | CallEffect<any>, void, never> {
  try {
    yield put(cancelOrderRequest());

    const response: Awaited<ReturnType<typeof cancelOrderAPI>> = yield call(
      cancelOrderAPI,
      payload?.orderId,
    );
    const json = yield response?.json();
    showToast('success', json?.message);
    if (
      'status' in response &&
      response.status >= 200 &&
      response.status < 300
    ) {
      yield put(cancelOrderSuccess({getOrderDetailsData: json?.order}));
      return;
    }
    yield put(cancelOrderFailure({message: json?.message}));
    getError(json);
  } catch (error) {
    yield put(cancelOrderFailure(error));
    getError(error);
  }
}

export function* watchCancelOrderSections() {
  yield takeLatest(CANCEL_ORDER, cancelOrderSaga);
}
