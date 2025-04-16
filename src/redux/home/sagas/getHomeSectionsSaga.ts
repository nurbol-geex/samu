import {
  call,
  CallEffect,
  put,
  PutEffect,
  SelectEffect,
  takeLatest,
} from 'redux-saga/effects';
import {
  getHomeSectionsSuccess,
  getHomeSectionsFailure,
  getHomeSectionsRequest,
} from '../slice';
import {GET_HOME_SECTIONS_REQUEST} from '../constants';
import {getHomeSectionsAPI} from 'src/api/homePageAPI';
import {getError} from 'src/utils';

function* getHomeSectionsSaga({
  payload,
}: any): Generator<
SelectEffect | PutEffect | CallEffect<GetHomeResponse>,
void,
never
> {
  try {
    yield put(getHomeSectionsRequest());
    const response: Awaited<ReturnType<typeof getHomeSectionsAPI>> = yield call(
      getHomeSectionsAPI,
      payload,
    );
    const json = yield response.json();
    if (
      'status' in response &&
      response.status >= 200 &&
      response.status < 300
    ) {
      yield put(getHomeSectionsSuccess({sections: json?.sections || []}));
      return;
    }
    yield put(getHomeSectionsFailure({message: json.message}));
    getError(json);
  } catch (error) {
    yield put(getHomeSectionsFailure({error: error?.message}));
    getError(error);
  }
}

export function* watchGetHomeSections() {
  yield takeLatest(GET_HOME_SECTIONS_REQUEST, getHomeSectionsSaga);
}
