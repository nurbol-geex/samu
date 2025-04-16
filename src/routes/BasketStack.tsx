import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {Route} from './Route';
import BasketTabs from './BasketTabs';
export type BasketStackParamList = {
  [Route.BasketTabs]: NonNullable<object>;
};

export type BasketStackNavigation = NavigationProp<BasketStackParamList>;

export type BasketStackRouteProps<
  RouteName extends keyof BasketStackParamList,
> = RouteProp<BasketStackParamList, RouteName>;

const Stack = createNativeStackNavigator<BasketStackParamList>();

export default function BasketStack() {
  return (
    <Stack.Navigator
      initialRouteName={Route.BasketTabs}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={Route.BasketTabs} component={BasketTabs} />
    </Stack.Navigator>
  );
}
