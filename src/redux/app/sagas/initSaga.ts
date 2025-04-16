import {select, SelectEffect, takeLatest} from 'redux-saga/effects';
import * as RootNavigation from '../../../routes/RootNavigation';
import {Route} from '../../../routes/Route';
import {INIT} from '../constants';
import {selectUserIsLoggedIn, selectUserIsOnboard} from '../../user/selectors';

function* initSaga(): Generator<SelectEffect, void, never> {
  const isUserOnboard = yield select(selectUserIsOnboard);
  const isUserLoggedIn = yield select(selectUserIsLoggedIn);
  if (isUserLoggedIn) {
    // RootNavigation.navigate(Route.BottomStack, {});
    RootNavigation.reset({
      index: 1,
      routes: [
        {
          name: Route.OnboardingScreen,
        },
        {
          name: Route.AuthStack,
        },
        {
          name: Route.BottomStack,
          state: {
            routes: [{name: Route.HomeScreen}],
          },
        },
      ],
    });
  } else if (isUserOnboard) {
    // RootNavigation.navigate(Route.AuthStack, {screen: Route.SignUpScreen});
    RootNavigation.reset({
      index: 1,
      routes: [
        {
          name: Route.OnboardingScreen,
        },
        {
          name: Route.AuthStack,
          state: {
            routes: [{name: Route.SignUpScreen}],
          },
        },
      ],
    });
  } else {
    // RootNavigation.navigate(Route.OnboardingScreen, {});
    RootNavigation.reset({
      index: 1,
      routes: [
        {
          name: Route.OnboardingScreen,
        },
      ],
    });
  }
}

export function* watchInit() {
  yield takeLatest(INIT, initSaga);
}
