/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {
  SENTRY_DSN,
  PAY_STACK_LIVE_KEY,
  GOOGLE_WEB_CLIENT_ID_ANDROID,
  GOOGLE_WEB_CLIENT_ID_IOS,
  PAY_STACK_TEST_KEY,
} from '@env';
import {NavigationContainer} from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';
import {ThemeProvider} from '@shopify/restyle';
import React, {useEffect} from 'react';
import {LogBox, Platform, StyleSheet, Text, View} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {CustomToast} from './components/shared/CustomToast';
import store, {persistor} from './redux';
import {navigationRef} from './routes/RootNavigation';
import RootStack from './routes/RootStack';
import {createCustomTheme} from './theme/createCustomTheme';
import {LogLevel, OneSignal} from 'react-native-onesignal';
import RNPaystack from 'react-native-paystack';
import RNBootSplash from 'react-native-bootsplash';
import {injectParamsToURL, logAnalyticsEvent} from './utils';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import appsFlyer from 'react-native-appsflyer';

RNPaystack.init({
  publicKey: PAY_STACK_LIVE_KEY,
});
const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
});
Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0,
  integrations: [
    Sentry.reactNavigationIntegration({
      enableTimeToInitialDisplay: true,
    }),
  ],
});

appsFlyer.initSdk(
  {
    devKey: 'eR2i3Ei3hr3caN3q5FhZVV',
    isDebug: true,
    appId: '6502410038',
    onInstallConversionDataListener: true, //Optional
    onDeepLinkListener: true, //Optional
    timeToWaitForATTUserAuthorization: 10, //for iOS 14.5
  },

  result => {
    console.log('appsflyer1', result);
  },
  error => {
    console.error('appsflyer2', error);
  },
);

LogBox.ignoreAllLogs();

const App = () => {
  useEffect(() => {
    const init = async () => {
      // …do multiple sync or async tasks
    };
    init().finally(() => {
      setTimeout(async () => {
        await RNBootSplash.hide({fade: true});
        console.log('Bootsplash has been hidden successfully');
      }, 3000); // 3 seconds delay
    });
  }, []);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        Platform.OS === 'ios'
          ? GOOGLE_WEB_CLIENT_ID_IOS
          : GOOGLE_WEB_CLIENT_ID_ANDROID,
    });
  }, []);

  const theme = createCustomTheme();
  const config = {
    initialRouteName: 'tab',
    screens: {
      ProductDetails: 'product/:productId',
      tab: {
        screens: {
          Home: {
            initialRouteName: 'Home',
            screens: {
              StoreDetails: 'store/:storeId', // ✅ Dynamic store ID
            },
          },
        },
      },
    },
  };

  const linking = {
    prefixes: ['samuapp://'],
    config,
  };
  // Remove this method to stop OneSignal Debugging
  OneSignal.Debug.setLogLevel(LogLevel.Verbose);

  // OneSignal Initialization
  OneSignal.initialize('358b2260-d992-4a90-984d-b0ef48a5505f');
  // requestPermission will show the native iOS or Android notification permission prompt.
  // We recommend removing the following code and instead using an In-App Message to prompt for notification permission
  OneSignal.Notifications.requestPermission(true);

  // Method for listening for notification clicks
  OneSignal.Notifications.addEventListener('click', event => {
    console.log('OneSignal: notification clicked:', event);
  });
  const getActiveRouteName = state => {
    const route = state.routes[state.index];
    if (route?.state) {
      return getActiveRouteName(route.state);
    }
    return route.name;
  };

  return (
    <Sentry.ErrorBoundary
      fallback={({error}) => (
        <View style={styles.rootContainer}>
          <Text>An unexpected error occurred</Text>
          <Text>{error?.toString()}</Text>
        </View>
      )}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <ThemeProvider theme={theme}>
            <NavigationContainer
              onReady={() => {
                navigationIntegration.registerNavigationContainer(
                  navigationRef,
                );
              }}
              linking={linking}
              ref={navigationRef}
              onStateChange={state => {
                const routeName = getActiveRouteName(state);
                Sentry.addBreadcrumb({
                  category: 'navigation',
                  message: `Navigated to ${routeName}`,
                  level: 'info',
                });
              }}>
              <RootStack />
              <CustomToast />
            </NavigationContainer>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </Sentry.ErrorBoundary>
  );
};

export default Sentry.wrap(App);
const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: 'white', // Set your desired background color here
  },
});
