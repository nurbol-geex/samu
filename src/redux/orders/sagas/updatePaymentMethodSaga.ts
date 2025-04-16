import {
  call,
  CallEffect,
  put,
  PutEffect,
  SelectEffect,
  takeLatest,
} from 'redux-saga/effects';
import {showToast} from '../../../components/shared/CustomToast/toastUtils';
import {CHECK_ORDER_PAID, UPDATE_PAYMENT_METHOD} from '../constants';
import {updatePaymentMethodAPI} from 'src/api/OrderPageAPI/index';
import {
  updatePaymentMethodFailure,
  updatePaymentMethodRequest,
  updatePaymentMethodSuccess,
} from '../slice';
import {getError} from 'src/utils';
import * as Sentry from '@sentry/react-native'; // Import Sentry

function* updatePaymentMethodSaga({
  payload,
}: any): Generator<SelectEffect | PutEffect | CallEffect<any>, void, never> {
  try {
    yield put(updatePaymentMethodRequest());
    const response: Awaited<ReturnType<typeof updatePaymentMethodAPI>> =
      yield call(
        updatePaymentMethodAPI,
        payload?.orderId,
        payload?.paymentMethodId,
      );
    const json = yield response.json();
    if (
      'status' in response &&
      response.status >= 200 &&
      response.status < 300
    ) {
      yield put({
        type: CHECK_ORDER_PAID,
        payload: {
          orderId: payload?.orderId,
        },
      });
      yield put(
        updatePaymentMethodSuccess({
          upadtePaymentMethodData: json,
        }),
      );
      // showToast('success', json?.message);

      return;
    }
    yield put(updatePaymentMethodFailure({message: json?.message}));
    getError(json);
  } catch (error) {
    Sentry.captureException(error?.message);
    yield put(updatePaymentMethodFailure(error));
    getError(error);
  }
}

export function* watchUpdatePaymentMethodSections() {
  yield takeLatest(UPDATE_PAYMENT_METHOD, updatePaymentMethodSaga);
}
