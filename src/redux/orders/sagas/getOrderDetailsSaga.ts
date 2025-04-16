import {
  call,
  CallEffect,
  put,
  PutEffect,
  SelectEffect,
  takeLatest,
} from 'redux-saga/effects';
import {GET_ORDER_DETAILS} from '../constants';
import {getOrderDetailsAPI} from 'src/api/OrderPageAPI/index';
import {
  getOrderDetailsFailure,
  getOrderDetailsRequest,
  getOrderDetailsSuccess,
} from '../slice';
import {getError} from 'src/utils';
function* getOrderDetailsSaga({
  payload,
}: any): Generator<SelectEffect | PutEffect | CallEffect<any>, void, never> {
  try {
    yield put(getOrderDetailsRequest());

    const response: Awaited<ReturnType<typeof getOrderDetailsAPI>> = yield call(
      getOrderDetailsAPI,
      payload?.orderId,
    );
    const json = yield response.json();
    if (
      'status' in response &&
      response.status >= 200 &&
      response.status < 300
    ) {
      yield put(getOrderDetailsSuccess({getOrderDetailsData: json?.order}));
      return;
    }
    yield put(getOrderDetailsFailure({message: json?.message}));
    getError(json);
  } catch (error) {
    yield put(getOrderDetailsFailure(error));
    getError(error);
  }
}

export function* watchGetOrderDetailsSections() {
  yield takeLatest(GET_ORDER_DETAILS, getOrderDetailsSaga);
}
