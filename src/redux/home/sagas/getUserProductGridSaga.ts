import {
  call,
  CallEffect,
  put,
  PutEffect,
  SelectEffect,
  takeLatest,
} from 'redux-saga/effects';
import {
  getProductGridFailure,
  getProductGridSuccess,
  getProductGridRequest,
} from '../slice';
import {GET_USER_PRODUCT_COLLECTIONS} from '../constants';
import { getBrowseGrid } from 'src/api/UserProductCollections';
import {getError} from 'src/utils';

function* getUserProductGridSaga({
  payload,
}: any) {
  try {
    
    yield put(getProductGridRequest());
    const response: Awaited<ReturnType<typeof getBrowseGrid>> = yield call(
      getBrowseGrid,
    );

    const json = yield response.json();
    if (
      'status' in response &&
      response.status >= 200 &&
      response.status < 300
    ) {
      yield put(getProductGridSuccess({sections: json?.productCollections || []}));
      return;
    }
    yield put(getProductGridFailure({message: json.message}));
    getError(json);
  } catch (error) {
    yield put(getProductGridFailure({error: error?.message}));
    getError(error);
  }
}

export function* watchUserProductGridSections() {
  yield takeLatest(GET_USER_PRODUCT_COLLECTIONS, getUserProductGridSaga);
}
