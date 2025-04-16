import React from 'react';
import {Platform, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {colors} from 'src/theme/colors';
import AccountStack from './AccountStack';
import HomeStack from './HomeStack';
import HomeSVG from 'assets/svg/HomeSVG';
import HomeActiveSVG from 'assets/svg/HomeActiveSVG';
import BrowseSVG from 'assets/svg/BrowseSVG';
import BrowseActiveSVG from 'assets/svg/BrowseActiveSVG';
import BasketSVG from 'assets/svg/BasketSVG';
import UserSVG from 'assets/svg/UserSVG';
import UserActiveSVG from 'assets/svg/UserActiveSVG';
import BasketStack from './BasketStack';
import BrowseStack from './BrowseStack';
import AuthStack from './AuthStack';
import {Route} from './Route';
import {AddressScreen} from 'src/screens/AuthStack/AddressScreen';
import {LocationScreen} from 'src/screens/AuthStack/LocationScreen';
import {useReduxSelector} from 'src/redux';
import {setCreateAccountForm} from 'src/redux/user/slice';
import {useDispatch} from 'react-redux';
import {moderateScale, scale, vs} from 'react-native-size-matters';
import ProductDetails from 'src/screens/HomeStack/Products/ProductDetails';
import {CustomText} from 'src/components/shared/CustomText';
import {selectCurrentCartItem} from 'src/redux/cart/selectors';
import {AccountAddressScreen} from 'src/screens/AccountStack/AccountAddressScreen';
import {ChangePasswordScreen} from 'src/screens/AccountStack/ChangePasswordScreen';
import {AddressEditScreen} from 'src/screens/AccountStack/AddressEditScreen';
import {MyDetailsScreen} from 'src/screens/AccountStack/MyDetailsScreen';
import WalletScreen from 'src/screens/AccountStack/WalletScreen/WalletScreen';
import AddNewCardScreen from 'src/screens/AccountStack/WalletScreen/AddNewCardScreen';
import OrderDetails from 'src/screens/AccountStack/OrderDetailScreen/OrderDetailScreen';
import DriverProfile from 'src/screens/AccountStack/DriverProfile/DriverProfile';
import BasketTabs from './BasketTabs';
import RatingScreen from 'src/screens/AccountStack/RatingScreen/RatingScreen';
import AboutSamu from 'src/screens/AccountStack/AboutSamuScreen/AboutSamu';
import HelpAndSupport from 'src/screens/AccountStack/HelpFlowScreens/HelpSupportScreen/HelpAndSupport';
import ReportIssue from 'src/screens/AccountStack/HelpFlowScreens/ReportssueScreen/ReportIssue';
import CustomerSupport from 'src/screens/AccountStack/HelpFlowScreens/CustomerSupportScreen/CustomerSupport';
import MessageUs from 'src/screens/AccountStack/HelpFlowScreens/MessageUsScreen/MessageUs';
import Faqs from 'src/screens/AccountStack/HelpFlowScreens/FaqsScreen/Faqs';
import ChooseIssue from 'src/screens/AccountStack/HelpFlowScreens/ChooseIssueScreen/ChooseIssue';
import SubmitIssue from 'src/screens/AccountStack/HelpFlowScreens/SubmitIssueScreen/SubmitIssue';
import {getBaseUrlFromEmail} from 'src/utils/SetENV';
import {logAnalyticsEvent} from 'src/utils';
import {pageOpened} from 'src/api/analyticsAPI';
import {ANALYTICS, LOGOUT} from 'src/redux/user/constants';
import Toast from 'react-native-toast-message';

export type BottomStackParamList = {};

export type BottomStackNavigation = NavigationProp<BottomStackParamList>;

export type BottomStackRouteProps<
  RouteName extends keyof BottomStackParamList,
> = RouteProp<BottomStackParamList, RouteName>;

const Tab = createBottomTabNavigator();

const BottomTab = () => {
  const user = useReduxSelector(str => str.user);
  const dispatchStore = useDispatch();
  const currentCartItem = useReduxSelector(selectCurrentCartItem);
  return (
    <Tab.Navigator
      screenOptions={({route}: tabNavigatorProps) => ({
        tabBarStyle: {
          height: Platform.OS === 'android' ? vs(45) : vs(60),
        },
        tabBarActiveTintColor: colors.primaryGreen,
        tabBarInactiveTintColor: colors.darkGreen,
        tabBarLabelStyle: {
          bottom: Platform.OS === 'android' ? vs(6) : vs(2),
          fontSize: moderateScale(13),
          fontWeight: '600',
        },
        tabBarIcon: ({focused}: tabIconProps) => {
          let icon;
          switch (route.name) {
            case 'Home':
              icon = focused ? (
                <HomeActiveSVG width={scale(21)} height={scale(21)} />
              ) : (
                <HomeSVG width={scale(21)} height={scale(21)} />
              );
              break;
            case 'Browse':
              icon = focused ? (
                <BrowseActiveSVG width={scale(21)} height={scale(21)} />
              ) : (
                <BrowseSVG width={scale(21)} height={scale(21)} />
              );
              break;
            case 'Basket':
              icon = (
                <>
                  <BasketSVG width={scale(21)} height={scale(21)} />
                  {currentCartItem?.length ? (
                    <View
                      style={{
                        backgroundColor: colors.primaryGreen,
                        width: scale(17),
                        height: scale(17),
                        position: 'absolute',
                        bottom: vs(12),
                        right: scale(25),
                        borderRadius: scale(17 / 2),
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <CustomText
                        variant="small"
                        style={{
                          fontSize: moderateScale(10),
                          fontWeight: '700',
                          textAlign: 'center',
                          alignSelf: 'center',
                        }}
                        text={currentCartItem?.length}
                        textColor={colors.white}
                      />
                    </View>
                  ) : null}
                </>
              );
              break;
            case 'Account':
              icon = focused ? (
                <UserActiveSVG width={scale(21)} height={scale(21)} />
              ) : (
                <UserSVG width={scale(21)} height={scale(21)} />
              );
              break;
          }

          return icon;
        },
      })}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={() => ({
          headerShown: false,
          tabBarLabel: 'Home',
        })}
      />
      <Tab.Screen
        name="Browse"
        component={BrowseStack}
        options={() => ({
          headerShown: false,
          tabBarLabel: 'Search',
        })}
      />
      <Tab.Screen
        name="Basket"
        component={BasketTabs}
        options={() => ({
          headerShown: false,
          tabBarLabel: 'My Orders',
          tabBarStyle: {
            display: 'none',
          },
        })}
      />

      <Tab.Screen
        listeners={({navigation, route}) => ({
          tabPress: e => {
            e.preventDefault();
            if (user?.isGuest || user?.email === '' || !user?.email) {
              // Show toast message for guest
              Toast.show({
                text1: 'Sign up required',
                text2: 'Please create an account/Login to continue.',
                type: 'info', // Optional, depending on the toast library you're using
              });

              // Dispatch action to change guest status
              dispatchStore({type: LOGOUT});
              dispatchStore(setCreateAccountForm({isGuest: false}));
            } else {
              // Navigate to Account if not a guest
              navigation.navigate('Account');
            }
          },
        })}
        options={({route}) => ({
          headerShown: false,
          tabBarLabel: 'Profile',
        })}
        name="Account"
        component={AccountStack}
      />
    </Tab.Navigator>
  );
};
const getActiveRouteName = state => {
  if (!state || !state.routes || state.index === undefined) {
    return null; // Return null or a default value if state is undefined
  }

  const route = state.routes[state.index];

  console.log('Active Route:', route?.name); // Debugging

  // Recursively get the active route name if there's a nested state
  if (route?.state) {
    return getActiveRouteName(route.state);
  }

  return route?.name || null; // Safely return route name or null
};

export default function BottomStack() {
  const Stack = createNativeStackNavigator();
  const dispatchStore = useDispatch();
  const user = useReduxSelector(state => state.user);
  const {
    user: {accessToken, isGuest},
  } = useReduxSelector(store => ({user: store.user}));
  getBaseUrlFromEmail(user?.email);

  return (
    <Stack.Navigator
      screenListeners={({navigation, route}) => ({
        focus: () => {
          const pageName = getActiveRouteName(navigation.getState());
          logAnalyticsEvent('Screen_Changed', {screen_name: pageName});
          if (!user.accessToken && !isGuest) {
            dispatchStore({
              type: ANALYTICS,
              payload: {
                eventType: 'pageOpened', // Specify the event type here
                data: {
                  pageName,
                  userId: user?.email,
                  sessionId: accessToken,
                },
              },
            });
          }
        },
      })}
      screenOptions={{headerShown: false, animation: 'ios'}}
      initialRouteName="tab">
      <Stack.Screen name="tab" component={BottomTab} />
      <Stack.Screen name="AuthStack" component={AuthStack} />
      <Stack.Screen name={Route.AddressScreen} component={AddressScreen} />
      <Stack.Screen
        name={Route.LocationScreen}
        component={LocationScreen}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen name={Route.ProductDetails} component={ProductDetails} />
      <Stack.Screen
        name={Route.MyDetailsScreen}
        component={MyDetailsScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Route.ChangePasswordScreen}
        component={ChangePasswordScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Route.AccountAddressScreen}
        component={AccountAddressScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Route.AddressEditScreen}
        component={AddressEditScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Route.WalletScreen}
        component={WalletScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Route.AddNewCardScreen}
        component={AddNewCardScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Route.OrderDetails}
        component={OrderDetails}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Route.DriverProfile}
        component={DriverProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Route.RatingScreen}
        component={RatingScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Route.AboutSamu}
        component={AboutSamu}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Route.HelpAndSupport}
        component={HelpAndSupport}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Route.ReportIssue}
        component={ReportIssue}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Route.CustomerSupport}
        component={CustomerSupport}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Route.MessageUs}
        component={MessageUs}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Route.Faqs}
        component={Faqs}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Route.ChooseIssue}
        component={ChooseIssue}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Route.SubmitIssue}
        component={SubmitIssue}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
