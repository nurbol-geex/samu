import {NavigationProp, RouteProp} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {CategoryResultScreen} from 'src/screens/BrowseStack/CategoryResultScreen';
import {HomeScreen} from 'src/screens/HomeStack/HomeScreen';
import {Route} from './Route';
import StoreDetails from 'src/screens/HomeStack/Stores/StoreDetails';
import Stores from 'src/screens/HomeStack/Stores/Stores';
import StoreInfo from 'src/screens/HomeStack/Stores/StoreInfo';
import {BrowseScreen} from 'src/screens/BrowseStack/BrowseScreen';
import {getBaseUrlFromEmail} from 'src/utils/SetENV';
import {useReduxSelector} from 'src/redux';
import CategoryScreen from 'src/screens/HomeStack/CategoryScreen/CategoryScreen';

export type HomeStackParamList = {
  [Route.HomeScreen]: NonNullable<object>;
  [Route.AddressScreen]: NonNullable<object>;
  [Route.LocationScreen]: NonNullable<object>;
  [Route.CategoryResultScreen]: NonNullable<object>;
  [Route.StoreDetails]: NonNullable<object>;
  [Route.Stores]: NonNullable<object>;
  [Route.StoreInfo]: NonNullable<object>;
  [Route.ProductDetails]: NonNullable<object>;
  [Route.BrowseScreen]: NonNullable<object>;
  [Route.CategoryScreen]: NonNullable<object>;
};

export type HomeStackNavigation = NavigationProp<HomeStackParamList>;

export type HomeStackRouteProps<RouteName extends keyof HomeStackParamList> =
  RouteProp<HomeStackParamList, RouteName>;

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStack = () => {
  const user = useReduxSelector(state => state.user);
  getBaseUrlFromEmail(user?.email);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={Route.HomeScreen} component={HomeScreen} />
      <Stack.Screen name={Route.Stores} component={Stores} />
      <Stack.Screen name={Route.StoreDetails} component={StoreDetails} />
      <Stack.Screen name={Route.StoreInfo} component={StoreInfo} />
      <Stack.Screen name={Route.CategoryScreen} component={CategoryScreen} />

      {/* <Stack.Screen name={Route.BrowseScreen} component={BrowseScreen} /> */}
      {/* <Stack.Screen
        name={Route.CategoryResultScreen}
        component={CategoryResultScreen}
      /> */}
    </Stack.Navigator>
  );
};

export default HomeStack;
