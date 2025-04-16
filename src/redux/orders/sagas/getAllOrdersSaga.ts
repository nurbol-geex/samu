import {
  call,
  CallEffect,
  put,
  PutEffect,
  SelectEffect,
  takeLatest,
} from 'redux-saga/effects';
import {GET_ALL_ORDERS} from '../constants';
import {getAllOrdersAPI} from 'src/api/OrderPageAPI/index';
import {getError} from 'src/utils';
import {
  getAllOrdersFailure,
  getAllOrdersRequest,
  getAllOrdersSuccess,
} from '../slice';

function* getAllOrdersSaga(
  payload: any,
): Generator<SelectEffect | PutEffect | CallEffect<any>, void, never> {
  try {

    yield put(getAllOrdersRequest());
    const response: Awaited<ReturnType<typeof getAllOrdersAPI>> = yield call(
      getAllOrdersAPI,
      payload?.page,
      payload?.pageSize,
      payload?.status,
      payload?.sortBy,
    );
    const json = yield response.json();

    if (
      'status' in response &&
      response.status >= 200 &&
      response.status < 300
    ) {
      yield put(
        getAllOrdersSuccess({
          getAllOrdersData: json?.orders,
        }),
      );
      return;
    }
    yield put(getAllOrdersFailure({message: json?.message}));
    getError(json);
  } catch (error) {
    yield put(getAllOrdersFailure(error));
    getError(error);
  }
}

export function* watchAllOrdersSections() {
  yield takeLatest(GET_ALL_ORDERS, getAllOrdersSaga);
}
