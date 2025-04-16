import {
  call,
  CallEffect,
  put,
  PutEffect,
  SelectEffect,
  takeLatest,
} from 'redux-saga/effects';
import {getAllCollectionsAPI} from '../../../api/getAllCollectionsAPI';
import {getAllCollectionsFailure, getAllCollectionsSuccess} from '../slice';
import {GET_ALL_COLLECTIONS_REQUEST} from '../constants';
import {getError} from 'src/utils';

function* getAllCollectionsSaga(): Generator<
  SelectEffect | PutEffect | CallEffect<GetAllCollectionsResponse>,
  void,
  never
> {
  try {
    const response: Awaited<ReturnType<typeof getAllCollectionsAPI>> =
      yield call(getAllCollectionsAPI);
    const json = yield response.json();
    if (
      'status' in response &&
      response.status >= 200 &&
      response.status < 300
    ) {
      yield put(
        getAllCollectionsSuccess({collections: json?.collections || []}),
      );
      return;
    }
    yield put(getAllCollectionsFailure({message: json.message}));
    getError(json);
  } catch (error) {
    yield put(getAllCollectionsFailure(error));
    getError(error);
  }
}

export function* watchGetCollections() {
  yield takeLatest(GET_ALL_COLLECTIONS_REQUEST, getAllCollectionsSaga);
}
