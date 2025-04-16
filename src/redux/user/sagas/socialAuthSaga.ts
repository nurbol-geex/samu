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
import {
  socialAuthFailure,
  socialAuthRequest,
  socialAuthSuccess,
  updateProfileRequest,
} from '../slice';
import * as RootNavigation from '../../../routes/RootNavigation';
import {Route} from '../../../routes/Route';
import {REVERSE_GEOCODING_REQUEST, SOCIAL_AUTH} from '../constants';
import {emailVerify, socialLoginAPI} from 'src/api/socialLoginAPI';
import {AuthenticationType} from '../initialState';
import {RootState} from 'src/redux';
import {OneSignal} from 'react-native-onesignal';
import {getError} from 'src/utils';
import {checkMultiple, PERMISSIONS} from 'react-native-permissions';
import {Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {getBaseUrlFromEmail} from 'src/utils/SetENV';
import * as Sentry from '@sentry/react-native'; // Import Sentry


function* socialAuthSaga({
  payload,
}): Generator<SelectEffect | PutEffect | CallEffect<any>, void, never> {
  const {email, signupType, appleUserId, authorizationCode} = payload;
  const Permisions =
    Platform.OS === 'ios'
      ? [PERMISSIONS.IOS.LOCATION_ALWAYS, PERMISSIONS.IOS.LOCATION_WHEN_IN_USE]
      : [
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
        ];

  const checkPermission = async () => {
    try {
      const res = await checkMultiple(Permisions);
      if (!Object.values(res).includes('granted')) {
        RootNavigation.navigate(Route.LocationScreen, {
          createFromAccount: true,
        });
        return false;
      }
      return true;
    } catch (error: any) {
      console.error('Error checking location permission:', error.message);
      return false;
    }
  };

  // Function to wrap Geolocation in a Promise
  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position: any) => {
          resolve(position);
        },
        (error: any) => {
          reject(error);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    });
  };
  if (!payload?.email) {
    delete payload.email;
  }

  try {

    yield put(updateProfileRequest());
    // First API call: socialLoginAPI
    const socialResponse = yield call(
      socialLoginAPI,
      email,
      signupType,
      authorizationCode,
      appleUserId,
    );
    const socialJson = yield socialResponse.json();

    if (
      'status' in socialResponse &&
      socialResponse.status >= 200 &&
      socialResponse.status < 300
    ) {
      // Second API call: emailVerify
      const emailResponse = yield call(emailVerify, email, appleUserId);
      const emailJson = yield emailResponse.json();
      getBaseUrlFromEmail(emailJson.user.email);

      if (
        'status' in emailResponse &&
        emailResponse.status >= 200 &&
        emailResponse.status < 300
      ) {
        OneSignal.login(emailJson?.user?.id);
        Sentry.setUser({ id: emailJson?.user?.id, phone:emailJson?.user?.phone ,username: emailJson?.user?.firstName + " " + emailJson?.user?.lastName, email:emailJson?.user?.email })

        // If user doesn't have any addresses, navigate to AddressScreen
        if (
          !emailJson.user.addresses ||
          emailJson.user.addresses.length === 0
        ) {
          yield put(socialAuthSuccess({accessToken: emailJson.accessToken}));

          const locationPermission = yield call(checkPermission);

          if (locationPermission) {
            try {
              // Use the Promise-based wrapper
              const position: any = yield call(getCurrentPosition);
              const {latitude: lat, longitude: lng} = position.coords;

              // Dispatch reverse geocoding request
              yield put({
                type: REVERSE_GEOCODING_REQUEST,
                payload: {lat, lng},
              });

              // Navigate to AddressScreen only if the address is empty
              RootNavigation.navigate(Route.AddressScreen, {});
            } catch (error: any) {
     
              RootNavigation.navigate(Route.AddressScreen, {});
            }
          }
        } else {
          yield put(
            socialAuthSuccess({
              accessToken: emailJson.accessToken,
              isGuest: false,
            }),
          );
          RootNavigation.reset({index: 1, routes: [{name: 'tab'}]});
        }
      }
    } else {
      console.log('1st failure');
      yield put(socialAuthFailure({message: socialJson.message}));
      getError(socialJson);
    }
  } catch (error: any) {
    // Global error handling for both API calls
    console.log('2nd Failure', error);
    yield put(socialAuthFailure({message: error.message}));
    getError(error);
  }
}

export function* watchSocial() {
  yield takeLatest(SOCIAL_AUTH, socialAuthSaga);
}
