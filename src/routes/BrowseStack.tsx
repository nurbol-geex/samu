import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {Route} from './Route';
import {BrowseScreen} from '../screens/BrowseStack/BrowseScreen';
import {CategoryResultScreen} from '../screens/BrowseStack/CategoryResultScreen';
import CategoryScreen from 'src/screens/HomeStack/CategoryScreen/CategoryScreen';

export type BrowseStackParamList = {
  [Route.BrowseScreen]: NonNullable<object>;
  [Route.CategoryResultScreen]: NonNullable<object>;
  [Route.CategoryScreen]: NonNullable<object>;
};

export type BrowseStackNavigation = NavigationProp<BrowseStackParamList>;

export type BrowseStackRouteProps<
  RouteName extends keyof BrowseStackParamList,
> = RouteProp<BrowseStackParamList, RouteName>;

const Stack = createNativeStackNavigator<BrowseStackParamList>();

export default function BrowseStack() {
  return (
    <Stack.Navigator
      initialRouteName={Route.BrowseScreen}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={Route.BrowseScreen} component={BrowseScreen} />
      <Stack.Screen
        name={Route.CategoryResultScreen}
        component={CategoryResultScreen}
      />
      <Stack.Screen name={Route.CategoryScreen} component={CategoryScreen} />
    </Stack.Navigator>
  );
}
