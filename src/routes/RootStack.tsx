import React from 'react';
import {useReduxSelector} from 'src/redux';
import AuthStack from './AuthStack';
import BottomStack from './BottomStack';
import {Route} from './Route';
import { storage } from 'src/redux/MMKVStorage';

export type RootStackParamList = {
  [Route.SplashScreen]: NonNullable<object>;
  [Route.OnboardingScreen]: NonNullable<object>;
  [Route.AuthStack]: NonNullable<object>;
  [Route.BottomStack]: NonNullable<object>;
  [Route.PhoneVerificationStack]: NonNullable<object>;
};

export default function RootStack() {
  if(storage.getBoolean("setOnboard") === undefined){
    storage.set("setOnboard", true)
  }

  const {
    user: {accessToken, isGuest},
  } = useReduxSelector(store => ({user: store.user}));

  return accessToken || isGuest ? <BottomStack /> : <AuthStack />;
}
