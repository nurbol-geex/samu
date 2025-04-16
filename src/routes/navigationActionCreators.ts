import {StackActions} from '@react-navigation/native';
import {Route} from './Route';
import {RootStackParamList} from './RootStack';
import {AuthStackParamList} from './AuthStack';
import {AccountStackParamList} from './AccountStack';
import {BottomStackParamList} from './BottomStack';
import {BrowseStackParamList} from './BrowseStack';
import {PhoneVerificationStackParamList} from './PhoneVerificationStack';

type NavigateOptions = {
  routeName: string;
  key?: string;
  params?: Record<string, unknown>;
  // merge?: boolean;
};

const rootStackNavigateOptions: NavigateOptions = {
  routeName: Route.RootStack,
};

const authStackNavigateOptions = (
  params: RootStackParamList[Route.AuthStack] = {},
): NavigateOptions => ({
  ...rootStackNavigateOptions,
  params: {
    screen: Route.AuthStack,
    ...params,
  },
});

export const signUpScreenNavigateOptions = (
  params: AuthStackParamList[Route.SignUpScreen] = {},
): NavigateOptions => ({
  ...authStackNavigateOptions({
    params: {
      screen: Route.SignUpScreen,
      ...params,
    },
  }),
});

export function onboardingScreenPushAction(
  params: RootStackParamList[Route.OnboardingScreen] = {},
) {
  return StackActions.push(Route.OnboardingScreen, params);
}

export function authStackPushAction(
  params: RootStackParamList[Route.AuthStack] = {},
) {
  return StackActions.push(Route.AuthStack, params);
}

export function signUpScreenPushAction(
  params: AuthStackParamList[Route.SignUpScreen] = {},
) {
  return StackActions.push(Route.SignUpScreen, params);
}

export function loginScreenPushAction(
  params: AuthStackParamList[Route.LoginScreen] = {},
) {
  return StackActions.push(Route.LoginScreen, params);
}

export function accountSetUpScreenPushAction(
  params: AuthStackParamList[Route.AccountSetUpScreen] = {},
) {
  return StackActions.push(Route.AccountSetUpScreen, params);
}

export function phoneNumberVerificationScreenPushAction(
  params: PhoneVerificationStackParamList[Route.PhoneNumberVerificationScreen] = {},
) {
  return StackActions.push(Route.PhoneNumberVerificationScreen, params);
}

export function locationScreenPushAction(
  params: AuthStackParamList[Route.LocationScreen] = {},
) {
  return StackActions.push(Route.LocationScreen, params);
}

export function addressScreenPushAction(
  params: AuthStackParamList[Route.SignUpScreen] = {},
) {
  return StackActions.push(Route.AddressScreen, params);
}

export function bottomStackPushAction(
  params: RootStackParamList[Route.BottomStack] = {},
) {
  return StackActions.push(Route.BottomStack, params);
}

export function myDetailsScreenPushAction(
  params: AccountStackParamList[Route.MyDetailsScreen] = {},
) {
  return StackActions.push(Route.MyDetailsScreen, params);
}

export function changePasswordScreenPushAction(
  params: AccountStackParamList[Route.ChangePasswordScreen] = {},
) {
  return StackActions.push(Route.ChangePasswordScreen, params);
}

export function accountAddressScreenPushAction(
  params: AccountStackParamList[Route.AccountAddressScreen] = {},
) {
  return StackActions.push(Route.AccountAddressScreen, params);
}

export function addressEditScreenPushAction(
  params: AccountStackParamList[Route.AddressEditScreen] = {},
) {
  return StackActions.push(Route.AddressEditScreen, params);
}

export function categoryResultScreenPushAction(
  params: BrowseStackParamList[Route.BrowseScreen] = {},
) {
  return StackActions.push(Route.BrowseScreen, params);
}

