import {
  call,
  CallEffect,
  put,
  PutEffect,
  SelectEffect,
  takeLatest,
} from 'redux-saga/effects';
import {
  getExploreSectionsRequest,
  getExploreSectionsSuccess,
  getExploreSectionsFailure,
} from '../slice';
import {GET_EXPLORE_SECTIONS_REQUEST} from '../constants';
import {getExploreSectionsAPI} from 'src/api/explorePageAPI';
import {getError} from 'src/utils';

function* getExploreSectionsSaga(): Generator<
  SelectEffect | PutEffect | CallEffect<GetExploreResponse>,
  void,
  never
> {
  try {
    yield put(getExploreSectionsRequest());
    const response: Awaited<ReturnType<typeof getExploreSectionsAPI>> =
      yield call(getExploreSectionsAPI);
    const json = yield response.json();
    if (
      'status' in response &&
      response.status >= 200 &&
      response.status < 300
    ) {
      yield put(getExploreSectionsSuccess({sections: json?.sections || []}));
      return;
    }
    yield put(getExploreSectionsFailure({message: json.message}));
    getError(json);
  } catch (error) {
    yield put(getExploreSectionsFailure(error));
    getError(error);
  }
}

export function* watchGetExploreSections() {
  yield takeLatest(GET_EXPLORE_SECTIONS_REQUEST, getExploreSectionsSaga);
}
