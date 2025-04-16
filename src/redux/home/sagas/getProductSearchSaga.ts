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
import {
  getProductSearchSuccess,
  getProductSearchFailure,
  getProductSearchRequest,
  getRecentSearchDataRequest,
} from '../slice';
import {GET_PRODUCT_SEARCH_REQUEST} from '../constants';
import {getUniversalSearchAPI} from 'src/api/getProductSearchAPI';

function* getProductSearchSaga({
  payload,
}: any): Generator<
  SelectEffect | PutEffect | CallEffect<GetSearchResponse>,
  void,
  never
> {

  try {
    yield put(getProductSearchRequest());
    const response: Awaited<ReturnType<typeof getUniversalSearchAPI>> =
      yield call(
        getUniversalSearchAPI,
        payload.keyword,
        payload?.longitude,
        payload?.latitude,
      );
    const json = yield response.json();

    if (
      'status' in response &&
      response.status >= 200 &&
      response.status < 300
    ) {
      yield put(getProductSearchSuccess({productSearchData: json || []}));
      if (json?.length) {
        yield put(
          getRecentSearchDataRequest({recentSearchData: payload.keyword || []}),
        );
      }
      return;
    }
    yield put(getProductSearchFailure({message: json.message}));
    // showToast('error', 'Error', json.message);
  } catch (error) {
    console.log('catch eror===========', error);

    yield put(getProductSearchFailure(error));
    showToast('error', 'Error', 'An error has occurred');
  }
}

export function* watchGetProductSearchSections() {
  yield takeLatest(GET_PRODUCT_SEARCH_REQUEST, getProductSearchSaga);
}
