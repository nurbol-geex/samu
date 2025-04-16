import {
  call,
  CallEffect,
  PutEffect,
  SelectEffect,
  takeLatest,
} from 'redux-saga/effects';
import {PAYMENT_CALCULATED} from '../constants';
import {paymentCalculateAPI} from 'src/api/OrderPageAPI/index';
import {getError} from 'src/utils';

function* paymentCalculateSaga({
  payload,
  getResponse,
}: any): Generator<SelectEffect | PutEffect | CallEffect<any>, void, never> {
  try {
    const response: Awaited<ReturnType<typeof paymentCalculateAPI>> =
      yield call(paymentCalculateAPI, payload);
    const json = yield response.json();
    if (
      'status' in response &&
      response.status >= 200 &&
      response.status < 300
    ) {
      return getResponse(json);
    }
    getError(json);
    getResponse(json);
  } catch (error) {
    getError(error);
    getResponse(error);
  }
}

export function* watchPaymentCalculateSections() {
  yield takeLatest(PAYMENT_CALCULATED, paymentCalculateSaga);
}
