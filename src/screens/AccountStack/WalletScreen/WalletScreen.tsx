import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {CustomStatusBar} from 'src/components/shared/CustomStatusBar';
import {colors} from 'src/theme/colors';
import {CustomHeader} from 'src/components/shared/CustomHeader';
import {moderateScale, scale, vs} from 'react-native-size-matters';
import {CustomTouchableSVG} from 'src/components/shared/CustomTouchableSVG';
import {CustomText} from 'src/components/shared/CustomText';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CoinIcon from '../../../../assets/images/coin-icon.png';
import {CustomButton} from 'src/components/shared/CustomButton';
import {useReduxSelector} from 'src/redux';
import {
  selectAddNewPaymentMethod,
  selectAllPaymentMethods,
  selectPaymentDefault,
  selectPaymentDefaultIsLoading,
} from 'src/redux/orders/selectors';
import PaymentOption from 'src/components/pageSections/Basket/PaymentOption';
import {
  GET_ALL_PAYMENT_METHODS_REQUEST,
  SETUP_PAYMENT_DEFAULT,
} from 'src/redux/orders/constants';
import {useDispatch} from 'react-redux';
import {Route} from 'src/routes/Route';
import {NavigationProp, useNavigation} from '@react-navigation/native';

const WalletScreen = () => {
  const [paymentMethodId, setPaymentMethodId] = useState<string>('');
  const getAllPaymentMethods = useReduxSelector(selectAllPaymentMethods);
  const paymentDefaultIsLoading = useReduxSelector(
    selectPaymentDefaultIsLoading,
  );
  const paymentDefaultData = useReduxSelector(selectPaymentDefault);
  const newAddedPaymentData = useReduxSelector(selectAddNewPaymentMethod);
  const navigation = useNavigation<NavigationProp<any>>();
  const defaultPaymentMethod = getAllPaymentMethods?.find(
    (item: {isDefault: boolean}) => item?.isDefault,
  );
  const dispatchStore = useDispatch();
  useEffect(() => {
    dispatchStore({type: GET_ALL_PAYMENT_METHODS_REQUEST});
  }, [dispatchStore, paymentDefaultData, newAddedPaymentData]);
  useEffect(() => {
    if (defaultPaymentMethod) {
      setPaymentMethodId(defaultPaymentMethod?.id);
    }
  }, [defaultPaymentMethod]);

  const handleSelectDefaultCard = () => {
    dispatchStore({type: SETUP_PAYMENT_DEFAULT, payload: paymentMethodId});
  };
  return (
    <View style={styles.flex}>
      <CustomStatusBar />
      <CustomHeader
        title="Wallet"
        titleColor={colors.white}
        containerBackgroundColor={colors.primaryGreen}
        startButtonIconType="back"
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.card}>
            <Image style={styles.coinIcon} source={CoinIcon} />
            <CustomText
              style={styles.center}
              text="₦0.00"
              variant="h2"
              textColor={colors.darkGreen}
            />
            <CustomText
              style={styles.center}
              text="Current Credits"
              variant="Figtree"
              textColor={colors.darkGreen}
            />
          </View>
          {getAllPaymentMethods?.length ? (
            <>
              <CustomText
                style={[styles.center, {marginTop: vs(20)}]}
                text="Your Payment Methods:"
                variant="h4"
                textColor={colors.darkGreen}
              />

              {getAllPaymentMethods.map(
                (paymentOptions: any, index: number) => {
                  return (
                    <PaymentOption
                      key={index}
                      paymentOptions={paymentOptions}
                      selectedOption={paymentMethodId}
                      handleOptionSelect={optionId =>
                        setPaymentMethodId(optionId)
                      }
                    />
                  );
                },
              )}
            </>
          ) : (
            <View style={styles.noPaymentMethod}>
              <CustomText
                text={'No Wallet Found'}
                variant="h2"
                textColor={colors.darkGreen}
              />
            </View>
          )}
          {/* <CustomTouchableSVG
            onPress={() =>
              navigation.navigate(Route.AddNewCardScreen)
            }
            containerStyle={[styles.sectionContainer]}>
            <View style={styles.textContainer}>
              <Image
                source={require('assets/images/payment-icon.png')}
                style={styles.paymentImage}
                resizeMode="contain"
              />
              <CustomText
                text="Add New Payment Method"
                variant="label"
                textColor={colors.darkGreen}
                style={{alignSelf: 'center'}}
              />
            </View>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={30}
              color={colors.primaryGreen}
            />
          </CustomTouchableSVG> */}
        </View>
      </ScrollView>
      <View style={styles.checkoutContainer}>
        {paymentDefaultIsLoading ? (
          <ActivityIndicator size={'small'} color={colors.darkGreen} />
        ) : getAllPaymentMethods?.length ? (
          <CustomButton onPress={handleSelectDefaultCard} text="Save Changes" />
        ) : null}
      </View>
    </View>
  );
};

export default WalletScreen;

const styles = StyleSheet.create({
  flex: {flex: 1, backgroundColor: colors.white},
  center: {alignSelf: 'center'},
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: colors.white,
    position: 'relative',
  },
  sectionContainer: {
    marginTop: vs(14),
    paddingVertical: scale(13),
    paddingHorizontal: scale(10),
    borderRadius: moderateScale(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: colors.black,
    shadowOffset: {width: 0.2, height: 0.2},
    shadowOpacity: 0.2,
    backgroundColor: colors.white,
  },

  card: {
    backgroundColor: colors.green50,
    borderRadius: moderateScale(15),
    alignItems: 'center',
    padding: vs(22),
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  paymentImage: {
    width: scale(30),
    height: scale(30),
  },
  coinIcon: {
    width: scale(40),
    height: vs(40),
    objectFit: 'contain',
  },
  saveBtn: {
    borderWidth: 0,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 20,
  },

  checkoutContainer: {
    backgroundColor: colors.white,
    borderTopRightRadius: moderateScale(20),
    borderTopLeftRadius: moderateScale(20),
    shadowColor: '#000',
    shadowOffset: {width: 0.2, height: 0.2},
    shadowOpacity: 0.1,
    paddingVertical: vs(25),
  },
  noPaymentMethod: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: vs(20),
  },
});
