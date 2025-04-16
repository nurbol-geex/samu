import React, {useCallback} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import BasketScreen from '../screens/BasketStack/BasketScreen';
import OngoingScreen from '../screens/BasketStack/OngoingScreen';
import CompletedScreen from '../screens/BasketStack/CompletedScreen';
import {CustomHeader} from 'src/components/shared/CustomHeader';
import {colors} from 'src/theme/colors';
import {CustomStatusBar} from 'src/components/shared/CustomStatusBar';
import {scale, vs} from 'react-native-size-matters';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import CancelledScreen from 'src/screens/BasketStack/CancelledScreen';

const Tab = createMaterialTopTabNavigator();

const BasketTabs = ({route}) => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      if (route?.params?.goToCart) {
        navigation.navigate('My Cart');
        navigation.setParams({goToCart: false});
      }
    }, [navigation, route?.params?.goToCart]),
  );

  return (
    <>
      <CustomStatusBar backgroundColor={colors.primaryGreen} />
      <CustomHeader
        title="MY ORDERS"
        titleColor={colors.white}
        containerBackgroundColor={colors.primaryGreen}
        startButtonIconType="close"
      />
      <Tab.Navigator
        initialRouteName="My Cart"
        screenOptions={{
          tabBarStyle: {
            backgroundColor: colors.darkGreen,
          },
          tabBarIndicatorStyle: {
            backgroundColor: colors.white,
            // width: scale(50),
            height: vs(3),
            // left: scale(33),
          },
          tabBarLabelStyle: {
            fontWeight: '700',
            textTransform: 'capitalize',
          },
          tabBarActiveTintColor: colors.white,
          tabBarInactiveTintColor: colors.gray73,
          tabBarScrollEnabled: true,
          tabBarItemStyle: {width: scale(110)},
        }}>
        <Tab.Screen name="My Cart" component={BasketScreen} />
        <Tab.Screen name="Ongoing" component={OngoingScreen} />
        <Tab.Screen name="Past Orders" component={CompletedScreen} />
        <Tab.Screen name="Cancelled" component={CancelledScreen} />
      </Tab.Navigator>
    </>
  );
};

export default BasketTabs;
