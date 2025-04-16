import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {Route} from './Route';
import {AccountScreen} from 'src/screens/AccountStack/AccountScreen';
import {MyDetailsScreen} from 'src/screens/AccountStack/MyDetailsScreen';
import {ChangePasswordScreen} from 'src/screens/AccountStack/ChangePasswordScreen';
import {AccountAddressScreen} from 'src/screens/AccountStack/AccountAddressScreen';
import {AddressEditScreen} from 'src/screens/AccountStack/AddressEditScreen';

export type AccountStackParamList = {
  [Route.AccountScreen]: NonNullable<object>;
  [Route.MyDetailsScreen]: NonNullable<object>;
  [Route.ChangePasswordScreen]: NonNullable<object>;
  [Route.AccountAddressScreen]: NonNullable<object>;
  [Route.AddressEditScreen]: AddressEditScreenParams;
};

export type AccountStackNavigation = NavigationProp<AccountStackParamList>;

export type AccountStackRouteProps<
  RouteName extends keyof AccountStackParamList,
> = RouteProp<AccountStackParamList, RouteName>;

const Stack = createNativeStackNavigator<AccountStackParamList>();

const AccountStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={Route.AccountScreen}
        component={AccountScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default AccountStack;
