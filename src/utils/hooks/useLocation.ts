// import {useNavigation} from '@react-navigation/native';
// import {useCallback, useEffect, useRef} from 'react';
// import {Alert, Linking, Platform} from 'react-native';
// import Geolocation from 'react-native-geolocation-service';
// import {
//   checkMultiple,
//   PERMISSIONS,
//   requestMultiple,
// } from 'react-native-permissions';
// import {useDispatch, useSelector} from 'react-redux';
// import {RootState, useReduxSelector} from 'src/redux';
// import {REVERSE_GEOCODING_REQUEST} from 'src/redux/user/constants';
// import { selectUser } from 'src/redux/user/selectors';
// import {HomeStackNavigation} from 'src/routes/HomeStack';
// import {addressScreenPushAction} from 'src/routes/navigationActionCreators';
// import {Route} from 'src/routes/Route';

// export const Permisions =
//   Platform.OS === 'ios'
//     ? [PERMISSIONS.IOS.LOCATION_ALWAYS, PERMISSIONS.IOS.LOCATION_WHEN_IN_USE]
//     : [
//         PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
//         PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
//       ];

// export const useLocation = () => {
//   const {uuid, resetPasswordRequested} = useReduxSelector(selectUser);

//   const navigation = useNavigation<HomeStackNavigation>();
//   const dispatchStore = useDispatch();
//   const toAddressScreen = useCallback(
//     (address = {}) => {
//       navigation.dispatch(addressScreenPushAction(address));
//     },
//     [navigation],
//   );
//   const {addresses} = useSelector((state: RootState) => state.addresses);
//   const addressesRef = useRef(addresses);

//   useEffect(() => {
//     addressesRef.current = addresses;
//   }, [addresses]);

//   const getLocation = () => {
//     Geolocation.getCurrentPosition(
//       async (position: any) => {
//         const {latitude: lat, longitude: lng} = position.coords;
//         dispatchStore({
//           type: REVERSE_GEOCODING_REQUEST,
//           payload: {
//             lat,
//             lng,
//           },
//         });
//       },
//       (error: any) => {
//         console.error(error);
//         // toAddressScreen();
//       },
//       {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
//     );
//   };

//   const checkPermission = async () => {
//     try {
//       let res = await checkMultiple(Permisions);
//       setTimeout(() => {
//         const currentAddresses = addressesRef.current;
//         if (Object.values(res).includes('granted')) {
//           if (currentAddresses?.length > 0) {
//             return true;
//           } else if (currentAddresses?.length === 0) {
//             navigation.navigate(Route.AddressScreen, { createFromAccount: false });
//             return true;
//           }
//         } else if (!Object.values(res).includes('granted')) {
//           // Only navigate to LocationScreen if not in reset password flow
//           if (!resetPasswordRequested) {
//             navigation.navigate(Route.LocationScreen, {});
//             return true
//           }
//           return false;
//         }
//       }, 3000);
//       } catch (error: any) {
//         console.log(
//           '===========ERROR checking PERMISSION FOR LOCATION===========',
//           error.message,
//         );
//       }
//   };
  

//   const requestPermission = async () => {
//     try {
//       const res = await requestMultiple(Permisions);
//       if (Object.values(res).every(item => item === 'blocked')) {
//         Alert.alert(
//           'Permission Blocked',
//           'Please enable permissions in the app settings.',
//           [
//             {text: 'Cancel', style: 'cancel'},
//             {text: 'Open Settings', onPress: () => Linking.openSettings()},
//           ],
//         );
//       } 
//       else if(Object.values(res).includes('granted') && addresses?.length){
//         navigation.navigate(Route.HomeScreen, {createFromAccount: false});
//       }else if (Object.values(res).includes('granted') && !addresses?.length) {
//         navigation.navigate(Route.AddressScreen, {createFromAccount: false});
//         getLocation();
//       } else {
//         navigation.navigate(Route.AddressScreen, {createFromAccount: false});
//       }
//     } catch (error: any) {
//       console.log('====+REQUIRST+++ ERORR', error?.message);
//     }
//   };

//   // useEffect(() => {
//   //   const requestPermissions = async () => {
//   //     const res = await requestMultiple(Permisions);
//   //     if (!Object.values(res).includes('granted')) {
//   //       getLocation();
//   //     }
//   //   };

//   //   requestPermissions();
//   // }, []);

//   return {
//     checkPermission,
//     requestPermission,
//   };
// };

import {useNavigation} from '@react-navigation/native';
import {useCallback, useEffect, useRef} from 'react';
import {Alert, Linking, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {
  checkMultiple,
  PERMISSIONS,
  requestMultiple,
} from 'react-native-permissions';
import {useDispatch, useSelector} from 'react-redux';
import {RootState, useReduxSelector} from 'src/redux';
import {REVERSE_GEOCODING_REQUEST} from 'src/redux/user/constants';
import { selectUser } from 'src/redux/user/selectors';
import {HomeStackNavigation} from 'src/routes/HomeStack';
import {addressScreenPushAction} from 'src/routes/navigationActionCreators';
import {Route} from 'src/routes/Route';
import { storage } from 'src/redux/MMKVStorage';

export const Permisions =
  Platform.OS === 'ios'
    ? [PERMISSIONS.IOS.LOCATION_ALWAYS, PERMISSIONS.IOS.LOCATION_WHEN_IN_USE]
    : [
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
      ];

export const useLocation = () => {
  const {uuid, resetPasswordRequested} = useReduxSelector(selectUser);

  const navigation = useNavigation<HomeStackNavigation>();
  const dispatchStore = useDispatch();
  const toAddressScreen = useCallback(
    (address = {}) => {
      navigation.dispatch(addressScreenPushAction(address));
    },
    [navigation],
  );
  const {addresses} = useSelector((state: RootState) => state.addresses);
  const addressesRef = useRef(addresses);

  useEffect(() => {
    addressesRef.current = addresses;
  }, [addresses]);

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      async (position: any) => {
        const {latitude: lat, longitude: lng} = position.coords;
        dispatchStore({
          type: REVERSE_GEOCODING_REQUEST,
          payload: {
            lat,
            lng,
          },
        });
      },
      (error: any) => {
        console.error(error);
        // toAddressScreen();
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const checkPermission = useCallback(async () => {
    try {
      let res = await checkMultiple(Permisions);
      setTimeout(() => {
        const currentAddresses = addressesRef.current;
        if (Object.values(res).includes('granted')) {
          if (currentAddresses?.length > 0) {
            navigation.navigate(Route.HomeScreen, {createFromAccount: false});
          } else if (currentAddresses?.length === 0) {
            navigation.navigate(Route.AddressScreen, { createFromAccount: false });
          }
        } else if (!Object.values(res).includes('granted')) {
          // Only navigate to LocationScreen if not in reset password flow
          if (!resetPasswordRequested) {
            if(storage.getBoolean('permissionAllowed') !== undefined && storage.getBoolean('permissionAllowed')){
              navigation.navigate(Route.LocationScreen, {});
            }
            else if(storage.getBoolean('permissionAllowed') !== undefined && !storage.getBoolean('permissionAllowed')){
              if(currentAddresses?.length === 0){
                navigation.navigate(Route.AddressScreen, { createFromAccount: false });
              }
              else if(currentAddresses?.length > 0){
                navigation.navigate(Route.HomeScreen, {createFromAccount: false});
              }
            }
            else{
              navigation.navigate(Route.LocationScreen, {});
            }
          }
          return false;
        }
      }, 3000);
      } catch (error: any) {
        console.log(
          '===========ERROR checking PERMISSION FOR LOCATION===========',
          error.message,
        );
      }
  }, [addresses, resetPasswordRequested, navigation]);
  

  const requestPermission = async () => {
    try {
      const currentAddresses = addressesRef.current;
      const res = await requestMultiple(Permisions);
      if (Object.values(res).every(item => item === 'blocked')) {
        storage.set("permissionAllowed", false)
        if(currentAddresses?.length === 0){
          navigation.navigate(Route.AddressScreen, { createFromAccount: false });
        }
        else if(currentAddresses?.length > 0){
          navigation.navigate(Route.HomeScreen, {createFromAccount: false});
        }
        // Alert.alert(
        //   'Permission Blocked',
        //   'Please enable permissions in the app settings.',
        //   [
        //     {text: 'Cancel', style: 'cancel'},
        //     {text: 'Open Settings', onPress: () => Linking.openSettings()},
        //   ],
        // );
      } 
      else if(Object.values(res).includes('granted') && currentAddresses?.length){
        navigation.navigate(Route.HomeScreen, {createFromAccount: false});
      }else if (Object.values(res).includes('granted') && !currentAddresses?.length) {
        navigation.navigate(Route.AddressScreen, {createFromAccount: false});
        getLocation();
      } else {
        navigation.navigate(Route.AddressScreen, {createFromAccount: false});
      }
    } catch (error: any) {
      console.log('====+REQUIRST+++ ERORR', error?.message);
    }
  };

  return {
    checkPermission,
    requestPermission,
  };
};