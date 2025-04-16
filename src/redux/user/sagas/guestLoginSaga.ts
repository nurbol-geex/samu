import {takeEvery, call, put, select} from 'redux-saga/effects';
import {GUEST_LOGIN, REVERSE_GEOCODING_REQUEST} from '../constants';
import * as RootNavigation from '../../../routes/RootNavigation';
import {Route} from '../../../routes/Route';
import {checkMultiple, PERMISSIONS} from 'react-native-permissions';
import {Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {guestLoginAPI} from 'src/api/guestloginAPI';
import {loginSuccess, setCreateAccountForm} from '../slice';
import { OneSignal } from 'react-native-onesignal';
import { RootState } from 'src/redux';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
import * as Sentry from '@sentry/react-native'; // Import Sentry


// Permissions for location
const Permisions =
  Platform.OS === 'ios'
    ? [PERMISSIONS.IOS.LOCATION_ALWAYS, PERMISSIONS.IOS.LOCATION_WHEN_IN_USE]
    : [
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
      ];

// Check location permissions
const checkPermission = async () => {
  try {
    let res = await checkMultiple(Permisions);
    if (!Object.values(res).includes('granted')) {
      RootNavigation.navigate(Route.LocationScreen, {});
      return false;
    }
    return true;
  } catch (error: any) {
    console.error(
      '===========ERROR CHECKING PERMISSION FOR LOCATION===========',
      error.message,
    );
    return false;
  }
};

// Guest login saga worker
function* handleGuestLogin({payload}: {payload: {deviceId: string}}) {
  try {
    const {deviceId} = payload;
    const user = yield select((state: RootState) => state.user);
    const response: Awaited<ReturnType<typeof guestLoginAPI>> = yield call(
      guestLoginAPI,
      deviceId,
    );
    const json = yield response.json();

    // Show toast message if there's a "message" field in the response
    if (json?.message) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: json.message,
      });
    }

    // Check if location permission is granted
    if (
      'status' in response &&
      response.status >= 200 &&
      response.status < 300
    ) {
      OneSignal.login(json?.user?.id);
      Sentry.setUser({ id: json?.user?.id, phone:json?.user?.phone ,username: json?.user?.firstName + " " + json?.user?.lastName, email:json?.user?.email })
      if (json.user.addresses.length === 0) {
        put(
          loginSuccess({
            accessToken: json.accessToken,
            refreshToken: json?.refreshToken,
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
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: error?.message || 'Something went wrong.',
    });
  }
}


// Watcher saga
function* watchGuestLogin() {
  yield takeEvery(GUEST_LOGIN, handleGuestLogin);
}

export default watchGuestLogin;
