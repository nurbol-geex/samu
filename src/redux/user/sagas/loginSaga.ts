import {
  call,
  CallEffect,
  put,
  PutEffect,
  select,
  SelectEffect,
  takeLatest,
} from 'redux-saga/effects';
import {selectCreateAccountForm, selectAuthenticationType} from '../selectors';
import {loginFailure, loginSuccess, setUser} from '../slice';
import * as RootNavigation from '../../../routes/RootNavigation';
import {Route} from '../../../routes/Route';
import {LOGIN_REQUEST, REVERSE_GEOCODING_REQUEST} from '../constants';
import {loginWithPhoneAPI} from '../../../api/loginWithPhoneAPI';
import {AuthenticationType} from '../initialState';
import {loginWithEmailAPI} from '../../../api/loginWithEmailAPI';
import {RootState} from 'src/redux';
import {checkMultiple, PERMISSIONS} from 'react-native-permissions';
import {Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {getError} from 'src/utils';
import {OneSignal} from 'react-native-onesignal';
import * as Sentry from '@sentry/react-native'; // Import Sentry
import {reduxPersistStorage, storage} from 'src/redux/MMKVStorage';

const Permisions =
  Platform.OS === 'ios'
    ? [PERMISSIONS.IOS.LOCATION_ALWAYS, PERMISSIONS.IOS.LOCATION_WHEN_IN_USE]
    : [
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
      ];

const checkPermission = async () => {
  try {
    let res = await checkMultiple(Permisions);
    if (!Object.values(res).includes('granted')) {
      RootNavigation.navigate(Route.LocationScreen, {createFromAccount: true});
      return false;
    }
    return true;
  } catch (error: any) {
    Sentry.captureException(error?.message);

    console.log(
      '===========ERROR checkMultipleING PERMISSION FOR LOCATION===========',
      error.message,
    );
  }
};

function* loginSaga(): Generator<
  | SelectEffect
  | PutEffect
  | CallEffect<LoginWithPhoneResponse | LoginWithEmailResponse>,
  void,
  never
> {
  const loginRequestedType = yield select(selectAuthenticationType);
  const {phone, email, password, firstName, lastName} = yield select(
    selectCreateAccountForm,
  );
  const user = yield select((state: RootState) => state.user);
  if (loginRequestedType === AuthenticationType.PhoneLogin) {
    try {
      const response: Awaited<ReturnType<typeof loginWithPhoneAPI>> =
        yield call(loginWithPhoneAPI, phone);
      const json = yield response.json();
      if (
        'status' in response &&
        response.status >= 200 &&
        response.status < 300
      ) {
        const userId = json?.user?.id;
        if (userId) {
          Sentry.setUser({
            id: userId,
            phone,
            username: firstName + ' ' + lastName,
            email,
          });
          OneSignal.login(userId);
        } else {
          console.warn(
            'User ID is null or undefined, unable to call OneSignal.login',
          );
        }
        yield put(setUser({uuid: json?.uuid || ''}));
        RootNavigation.navigate(Route.PhoneVerificationStack, {
          screen: Route.PhoneNumberVerificationScreen,
          params: {
            phone: json?.phone,
          },
        });
        return;
      }
      // yield put(loginFailure({message: json.message}));
      getError(json);
      return;
    } catch (error) {
      // yield put(loginFailure(error));
      Sentry.captureException(error?.message);

      getError(error);
      return;
    }
  }
  try {
    const response: Awaited<ReturnType<typeof loginWithEmailAPI>> = yield call(
      loginWithEmailAPI,
      email,
      password,
    );
    const json = yield response.json();
    if (json?.code && json?.code === 'verify-phone') {
      yield put(setUser({phone: json?.phone, uuid: json?.uuid || ''}));
      RootNavigation.navigate(Route.PhoneVerificationStack, {
        screen: Route.PhoneNumberVerificationScreen,
        params: {
          phone: json?.phone,
        },
      });
    }
    if (
      'status' in response &&
      response.status >= 200 &&
      response.status < 300
    ) {
      OneSignal.login(json?.user?.id);
      Sentry.setUser({
        id: json?.user?.id,
        phone: json?.user?.phone,
        username: json?.user?.firstName + ' ' + json?.user?.lastName,
        email: json?.user?.email,
      });
      storage.set('accessToken', json?.accessToken);
      storage.set('refreshToken', json?.refreshToken);
      if (json.user.addresses.length === 0) {
        put(
          loginSuccess({
            accessToken: json.accessToken,
            refreshToken: json.refreshToken,
          }),
        );

        let locationPermission = checkPermission().then(res => res);
        if (locationPermission) {
          Geolocation.getCurrentPosition(
            async (position: any) => {
              const {latitude: lat, longitude: lng} = position.coords;
              put({
                type: REVERSE_GEOCODING_REQUEST,
                payload: {
                  lat,
                  lng,
                },
              });
              RootNavigation.navigate(Route.AddressScreen, {});
            },
            (error: any) => {
              console.error(error);
              RootNavigation.navigate(Route.AddressScreen, {});
            },
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
          );
        }
      }

      if (!user?.accessToken && user?.isGuest) {
        yield put(
          loginSuccess({
            accessToken: json.accessToken,
            isGuest: false,
            refreshToken: json?.refreshToken,
          }),
        );

        RootNavigation.reset({
          index: 1,
          routes: [{name: 'tab'}],
        });
      } else {
        yield put(
          loginSuccess({
            accessToken: json.accessToken,
            isGuest: false,
            refreshToken: json?.refreshToken,
          }),
        );
      }

      return;
    }
    yield put(loginFailure({message: json.message}));
    getError(json);
  } catch (error) {
    Sentry.captureException(error?.message);
    yield put(loginFailure(error));
    getError(error);
  }
}

export function* watchLogin() {
  yield takeLatest(LOGIN_REQUEST, loginSaga);
}
