import {
  call,
  CallEffect,
  put,
  PutEffect,
  select,
  SelectEffect,
  takeLatest,
} from 'redux-saga/effects';
import {showToast} from '../../../components/shared/CustomToast/toastUtils';
import {ADD_NEW_PAYMENT_METHOD, SETUP_CHECKOUT} from '../constants';
import {addNewPaymentMethodAPI} from 'src/api/OrderPageAPI/index';
import {
  addNewPaymentMethodRequest,
  addNewPaymentMethodSuccess,
  addNewPaymentMethodFailure,
  cardDetails,
} from '../slice';
import {selectCheckout} from '../selectors';
import {getError} from 'src/utils';
import * as Sentry from '@sentry/react-native'; // Import Sentry



function* addNewPaymentMethodSaga({
  payload,
}: any): Generator<SelectEffect | PutEffect | CallEffect<any>, void, never> {
  try {
    const checkoutData = yield select(selectCheckout);
    yield put(addNewPaymentMethodRequest());

    const response: Awaited<ReturnType<typeof addNewPaymentMethodAPI>> =
      yield call(addNewPaymentMethodAPI, payload.cardDetails);
    const json = yield response.json();
    if (
      'status' in response &&
      response.status >= 200 &&
      response.status < 300
    ) {
      // save card details in redux
      yield put(cardDetails({cardDetails: payload.cardDetailsPaystack}));
      // checkout api
      if ( !payload?.changeCard) {
        yield put({
          type: SETUP_CHECKOUT,
          payload: {
            ...payload.orderData,
            paymentMethodId: json?.paymentMethodId,
          },
        });
      }
      yield put(
        addNewPaymentMethodSuccess({
          addNewPaymentMethodData: json,
        }),
      );
      // showToast('success', json?.message);
      return;
    }

    yield put(addNewPaymentMethodFailure({message: json?.message}));

    getError(json);
  } catch (error) {
    Sentry.captureException(error?.message);
    yield put(addNewPaymentMethodFailure(error));
    getError(error);
  }
}

export function* watchAddNewPaymentMethodSections() {
  yield takeLatest(ADD_NEW_PAYMENT_METHOD, addNewPaymentMethodSaga);
}
