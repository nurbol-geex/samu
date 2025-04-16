import {
  call,
  CallEffect,
  put,
  PutEffect,
  SelectEffect,
  takeLatest,
} from 'redux-saga/effects';
import {
  getStoreMenuRequest,
  getStoreMenuSuccess,
  getStoreMenuFailure,
} from '../slice';
import {GET_STORE_MENU_REQUEST} from '../constants';
import {getStoreMenuAPI} from 'src/api/Stores';
import {getError} from 'src/utils';

function* getStoreMenuSaga({
  payload,
}: any): Generator<SelectEffect | PutEffect | CallEffect<any>, void, never> {
  try {
    yield put(getStoreMenuRequest());
    const response: Awaited<ReturnType<typeof getStoreMenuAPI>> = yield call(
      getStoreMenuAPI,
      payload.storeId,
    );
    const json = yield response.json();

    if (
      'status' in response &&
      response.status >= 200 &&
      response.status < 300
    ) {
      yield put(getStoreMenuSuccess({storeMenuData: json?.menus || []}));
      return;
    }
    yield put(getStoreMenuFailure({message: json?.message}));
    getError(json);
  } catch (error) {
    yield put(getStoreMenuFailure(error));
    getError(error);
  }
}

export function* watchGetStoreMenuSections() {
  yield takeLatest(GET_STORE_MENU_REQUEST, getStoreMenuSaga);
}
