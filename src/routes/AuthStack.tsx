import React, { useEffect } from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {Route} from './Route';
import {SignUpScreen} from '../screens/AuthStack/SignUpScreen';
import {LoginScreen} from '../screens/AuthStack/LoginScreen';
import {LocationScreen} from 'src/screens/AuthStack/LocationScreen';
import {AddressScreen} from 'src/screens/AuthStack/AddressScreen';
import {AccountSetUpScreen} from '../screens/AuthStack/AccountSetUpScreen';
import ResetPasswordScreen from 'src/screens/AuthStack/ResetPasswordScreen/ResetPasswordScreen';
import PhoneVerificationStack from './PhoneVerificationStack';
import OnboardingScreen from '../screens/OnboardingScreen/OnboardingScreen';
import {useReduxSelector} from 'src/redux';
import { storage } from 'src/redux/MMKVStorage';

export type AuthStackParamList = {
  [Route.SignUpScreen]: NonNullable<object>;
  [Route.OnboardingScreen]: NonNullable<object>;
  [Route.LoginScreen]: NonNullable<object>;
  [Route.AccountSetUpScreen]: NonNullable<object>;
  [Route.LocationScreen]: NonNullable<object>;
  [Route.AddressScreen]: AddressScreenParams;
  [Route.ResetPasswordScreen]: NonNullable<object>;
  [Route.PhoneVerificationStack]: NonNullable<object>;
};

export type AuthStackNavigation = NavigationProp<AuthStackParamList>;

export type AuthStackRouteProps<RouteName extends keyof AuthStackParamList> =
  RouteProp<AuthStackParamList, RouteName>;

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  const isOnboard = useReduxSelector(store => store.settings.isOnBoard);
  return (
    <Stack.Navigator
      initialRouteName={storage.getBoolean('setOnboard') ? Route.OnboardingScreen : Route.SignUpScreen}
      screenOptions={{
        headerShown: false,
        animation: 'ios',
      }}>
      <Stack.Screen
        name={Route.OnboardingScreen}
        component={OnboardingScreen}
      />
      <Stack.Screen name={Route.SignUpScreen} component={SignUpScreen} />
      <Stack.Screen name={Route.LoginScreen} component={LoginScreen} />
      <Stack.Screen
        name={Route.AccountSetUpScreen}
        component={AccountSetUpScreen}
      />
      <Stack.Screen
        name={Route.LocationScreen}
        component={LocationScreen}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen name={Route.AddressScreen} component={AddressScreen} />
      <Stack.Screen
        name={Route.ResetPasswordScreen}
        component={ResetPasswordScreen}
      />
      <Stack.Screen
        name={Route.PhoneVerificationStack}
        component={PhoneVerificationStack}
      />
    </Stack.Navigator>
  );
}
