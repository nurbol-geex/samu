import {
  call,
  CallEffect,
  put,
  PutEffect,
  SelectEffect,
  takeLatest,
} from 'redux-saga/effects';
import {GET_INITIATE_PAYMENT} from '../constants';
import {getInitiatePaymentAPI} from 'src/api/OrderPageAPI/index';
import {getError} from 'src/utils';

function* getInitiatePaymentSaga({
  payload,
}: any): Generator<SelectEffect | PutEffect | CallEffect<any>, void, never> {
  try {
    const response: Awaited<ReturnType<typeof getInitiatePaymentAPI>> =
      yield call(getInitiatePaymentAPI, payload?.cartId);
    const json = yield response.json();
    if (
      'status' in response &&
      response.status >= 200 &&
      response.status < 300
    ) {
      return;
    }
    getError(json);
  } catch (error) {
    getError(error);
  }
}

export function* watchInitiatePaymentSections() {
  yield takeLatest(GET_INITIATE_PAYMENT, getInitiatePaymentSaga);
}
