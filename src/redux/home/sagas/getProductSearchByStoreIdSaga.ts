import {
  call,
  CallEffect,
  put,
  PutEffect,
  SelectEffect,
  takeLatest,
} from 'redux-saga/effects';
import {
  getProductByStoreIdRequest,
  getProductByStoreIdSuccess,
  getProductByStoreIdFailure,
} from '../slice';
import {GET_PRODUCT_SEARCH_BY_STORE_ID_REQUEST} from '../constants';
import {getError} from 'src/utils';
import { getProductSearchByStoreIdAPI } from 'src/api/getProductSearchByStoreIdAPI';

function* getProductSearchByStoreIdSaga({
  payload,
}: any): Generator<

  SelectEffect | PutEffect | CallEffect<GetSearchResponse>,
  void,
  never
> {
  let {searchValue, storeId} = payload;
  try {
    yield put(getProductByStoreIdRequest());
    const response: Awaited<ReturnType<typeof getProductSearchByStoreIdAPI>> =
    
      yield call(getProductSearchByStoreIdAPI, storeId,searchValue);
    const json = yield response.json();

    if (
      'status' in response &&
      response.status >= 200 &&
      response.status < 300
    ) {
      yield put(getProductByStoreIdSuccess({productByStoreIdData: json || []}));
      return;
    }

    yield put(getProductByStoreIdFailure({message: json.message}));
    getError(json);
  } catch (error) {
    yield put(getProductByStoreIdFailure(error));
    getError(error);
  }
}

export function* watchGetProductSearchByStoreIdSections() {
  yield takeLatest(
    GET_PRODUCT_SEARCH_BY_STORE_ID_REQUEST,
    getProductSearchByStoreIdSaga,
  );
}
