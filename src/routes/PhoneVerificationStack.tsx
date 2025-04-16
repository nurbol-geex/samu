import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {Route} from './Route';
import {PhoneNumberVerificationScreen} from '../screens/PhoneVerificationStack/PhoneNumberVerificationScreen';
import {PhoneNumberInputScreen} from '../screens/PhoneVerificationStack/PhoneNumberInputScreen';

export type PhoneVerificationStackParamList = {
  [Route.PhoneNumberVerificationScreen]: NonNullable<object>;
  [Route.PhoneNumberInputScreen]: NonNullable<object>;
};

export type PhoneVerificationStackNavigation =
  NavigationProp<PhoneVerificationStackParamList>;

export type PhoneVerificationStackRouteProps<
  RouteName extends keyof PhoneVerificationStackParamList,
> = RouteProp<PhoneVerificationStackParamList, RouteName>;

const Stack = createNativeStackNavigator<PhoneVerificationStackParamList>();

export default function PhoneVerificationStack() {
  return (
    <Stack.Navigator
      initialRouteName={Route.PhoneNumberInputScreen}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name={Route.PhoneNumberVerificationScreen}
        component={PhoneNumberVerificationScreen}
      />
      <Stack.Screen
        name={Route.PhoneNumberInputScreen}
        component={PhoneNumberInputScreen}
      />
    </Stack.Navigator>
  );
}
