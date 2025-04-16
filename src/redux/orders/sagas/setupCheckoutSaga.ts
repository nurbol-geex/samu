import {
  call,
  CallEffect,
  put,
  PutEffect,
  SelectEffect,
  takeLatest,
} from 'redux-saga/effects';
import {showToast} from '../../../components/shared/CustomToast/toastUtils';
import {SETUP_CHECKOUT} from '../constants';
import {setupCheckoutAPI} from 'src/api/OrderPageAPI/index';
import {
  setupCheckoutFailure,
  setupCheckoutRequest,
  setupCheckoutSuccess,
  setOrderId,
} from '../slice';
import {getError} from 'src/utils';
import * as Sentry from '@sentry/react-native'; // Import Sentry

function* setupCheckoutSaga({
  payload,
}: any): Generator<SelectEffect | PutEffect | CallEffect<any>, void, never> {
  try {
    yield put(setupCheckoutRequest());

    const response: Awaited<ReturnType<typeof setupCheckoutAPI>> = yield call(
      setupCheckoutAPI,
      payload,
    );
    const json: any = yield call([response, 'json']);
    if (
      'status' in response &&
      response.status >= 200 &&
      response.status < 300
    ) {
      yield put(
        setOrderId({
          orderId: json?.orderId,
        }),
      );
      yield put(
        setupCheckoutSuccess({
          checkoutData: json,
        }),
      );
      // showToast('success', json?.message);

      return;
    }
    yield put(setupCheckoutFailure({message: json?.message}));
    getError(json);
  } catch (error) {
    Sentry.captureException(error?.message);
    yield put(setupCheckoutFailure(error));
    getError(error);
  }
}

export function* watchCheckoutSections() {
  yield takeLatest(SETUP_CHECKOUT, setupCheckoutSaga);
}
