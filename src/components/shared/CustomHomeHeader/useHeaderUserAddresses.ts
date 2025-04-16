import {useCallback, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {setCreateAccountForm} from '../../../redux/user/slice';
import {Route} from '../../../routes/Route';
import {HomeStackNavigation} from 'src/routes/HomeStack';
import {useReduxSelector} from 'src/redux';
import {Alert} from 'react-native';

export function useHeaderUserAddresses(
  shouldGetUserAddresses: boolean = false,
) {
  const user = useReduxSelector(str => str.user);
  const [addressModalVisible, setAddressModalVisible] =
    useState<boolean>(false);

  const dispatchStore = useDispatch();

  const navigation = useNavigation<HomeStackNavigation>();

  const onAddNewAddressPress = useCallback(() => {
    setAddressModalVisible(false);
    // setTimeout(() => {
    //   if (!user.accessToken) {
    //     return Alert.alert(
    //       'UnAuthorized',
    //       'You need to login or create account to add address',
    //       [
    //         {text: 'OK', onPress: () => {}},
    //         {
    //           text: 'Login/Create Account',
    //           onPress: () => {
    //           },
    //         },
    //       ],
    //     );
    //   }
    //   navigation.navigate(Route.AddressScreen, {createFromAccount: true});
    // }, 400);
    setTimeout(() => {
      dispatchStore(setCreateAccountForm({isGuest: true}));

      navigation.navigate(Route.AddressScreen, {createFromAccount: true});
    }, 400);
  }, [navigation]);

  return {
    addressModalVisible,
    setAddressModalVisible,
    onAddNewAddressPress,
  };
}
