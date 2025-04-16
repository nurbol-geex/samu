import {
  call,
  CallEffect,
  put,
  PutEffect,
  SelectEffect,
  takeLatest,
} from 'redux-saga/effects';
import {SETUP_PAYMENT_CHARGE} from '../constants';
import {setupPaymentChargeAPI} from 'src/api/OrderPageAPI/index';
import {
  setupPaymentChargeFailure,
  setupPaymentChargeRequest,
  setupPaymentChargeSuccess,
} from '../slice';
import {getError} from 'src/utils';

function* setupPaymentChargeSaga({
  payload,
}: any): Generator<SelectEffect | PutEffect | CallEffect<any>, void, never> {
  try {
    yield put(setupPaymentChargeRequest());

    const response: Awaited<ReturnType<typeof setupPaymentChargeAPI>> =
      yield call(setupPaymentChargeAPI, payload);
    const json = yield response.json();
    if (
      'status' in response &&
      response.status >= 200 &&
      response.status < 300
    ) {
      yield put(
        setupPaymentChargeSuccess({
          paymentChargeData: json,
        }),
      );
      return;
    }
    yield put(setupPaymentChargeFailure({message: json?.message}));

    getError(json);
  } catch (error) {
    yield put(setupPaymentChargeFailure(error));
    getError(error);
  }
}

export function* watchPaymentChargeSections() {
  yield takeLatest(SETUP_PAYMENT_CHARGE, setupPaymentChargeSaga);
}
