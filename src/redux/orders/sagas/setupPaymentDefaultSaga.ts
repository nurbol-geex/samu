import {
  call,
  CallEffect,
  put,
  PutEffect,
  SelectEffect,
  takeLatest,
} from 'redux-saga/effects';
import {showToast} from '../../../components/shared/CustomToast/toastUtils';
import {SETUP_PAYMENT_DEFAULT} from '../constants';
import {setupPaymentDefaultAPI} from 'src/api/OrderPageAPI/index';
import {
  setupPaymentDefaultFailure,
  setupPaymentDefaultRequest,
  setupPaymentDefaultSuccess,
} from '../slice';
import {getError} from 'src/utils';

function* setupPaymentDefaultSaga({
  payload,
}: any): Generator<SelectEffect | PutEffect | CallEffect<any>, void, never> {
  try {
    yield put(setupPaymentDefaultRequest());

    const response: Awaited<ReturnType<typeof setupPaymentDefaultAPI>> =
      yield call(setupPaymentDefaultAPI, payload);
    const json = yield response.json();
    if (
      'status' in response &&
      response.status >= 200 &&
      response.status < 300
    ) {
      yield put(
        setupPaymentDefaultSuccess({
          paymentDefaultData: json,
        }),
      );
      // showToast('success', json?.message);

      return;
    }
    yield put(setupPaymentDefaultFailure({message: json?.message}));
    getError(json);
  } catch (error) {
    yield put(setupPaymentDefaultFailure(error));
    getError(error);
  }
}

export function* watchPaymentDefaultSections() {
  yield takeLatest(SETUP_PAYMENT_DEFAULT, setupPaymentDefaultSaga);
}
