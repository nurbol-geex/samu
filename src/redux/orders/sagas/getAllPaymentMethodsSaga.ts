import {
  call,
  CallEffect,
  put,
  PutEffect,
  SelectEffect,
  takeLatest,
} from 'redux-saga/effects';
import {
  getAllPaymentMethodsRequest,
  getAllPaymentMethodsSuccess,
  getAllPaymentMethodsFailure,
} from '../slice';
import {GET_ALL_PAYMENT_METHODS_REQUEST} from '../constants';
import {getAllPaymentMethodsAPI} from 'src/api/OrderPageAPI/index';
import {getError} from 'src/utils';

function* getAllPaymentMethodsSaga({
  payload,
}: any): Generator<SelectEffect | PutEffect | CallEffect<any>, void, never> {
  try {
    yield put(getAllPaymentMethodsRequest());
    const response: Awaited<ReturnType<typeof getAllPaymentMethodsAPI>> =
      yield call(getAllPaymentMethodsAPI);
    const json = yield response.json();
    if (
      'status' in response &&
      response.status >= 200 &&
      response.status < 300
    ) {
      yield put(
        getAllPaymentMethodsSuccess({
          getAllPaymentMethodsData: json?.paymentMethods,
        }),
      );
      return;
    }
    yield put(getAllPaymentMethodsFailure({message: json?.message}));
    getError(json);
  } catch (error) {
    yield put(getAllPaymentMethodsFailure(error));
    getError(error);
  }
}

export function* watchAllPaymentMethodsSections() {
  yield takeLatest(GET_ALL_PAYMENT_METHODS_REQUEST, getAllPaymentMethodsSaga);
}
