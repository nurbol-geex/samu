import {
  call,
  CallEffect,
  put,
  PutEffect,
  SelectEffect,
  takeLatest,
} from 'redux-saga/effects';
import {reverseGeocodingAPI} from '../../../api/reverseGeocodingAPI';
import * as RootNavigation from '../../../routes/RootNavigation';
import {Route} from '../../../routes/Route';
import {REVERSE_GEOCODING_REQUEST} from '../constants';
import {
  resetCreateAddressForm,
  reverseGeocodingFailure,
  reverseGeocodingSuccess,
} from '../slice';
import {getError} from 'src/utils';

function* reverseGeocodingSaga({
  payload: {lat, lng},
}): Generator<
  SelectEffect | PutEffect | CallEffect<ReverseGeocodingResponseBody>,
  void | boolean,
  never
> {
  try {
    yield put(resetCreateAddressForm());
    const response: Awaited<ReturnType<typeof reverseGeocodingAPI>> =
      yield call(reverseGeocodingAPI, lat, lng);
    const json: any = yield response.json();
    if (json.status === 'OK') {
      yield put(reverseGeocodingSuccess({...json.results[0]}));
      // RootNavigation.push(Route.AddressScreen, {createFromAccount: false});
      return true;
    }
    yield put(
      reverseGeocodingFailure({
        message: `Geocoding failed: ${json.status}`,
      }),
    );
    console.error('Geocoding failed:', json.status);
    // RootNavigation.push(Route.AddressScreen, {payload: {}});
  } catch (error) {
    getError(error);
    yield put(reverseGeocodingFailure({message: `Geocoding failed: ${error}`}));
    // RootNavigation.push(Route.AddressScreen, {payload: {}});
  }
}

export function* watchReverseGeocoding() {
  yield takeLatest(REVERSE_GEOCODING_REQUEST, reverseGeocodingSaga);
}
