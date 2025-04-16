import {Image, StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {CustomText} from 'src/components/shared/CustomText';
import {colors} from 'src/theme/colors';
import {CustomButton} from 'src/components/shared/CustomButton';
import {CustomTouchableSVG} from 'src/components/shared/CustomTouchableSVG';
import {CustomModal} from 'src/components/shared/CustomModal';
import {moderateScale, scale, vs} from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Success from 'assets/images/success.png';
import {Route} from 'src/routes/Route';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useReduxSelector} from 'src/redux';
import {selectOrderId} from 'src/redux/orders/selectors';
import {useDispatch} from 'react-redux';
import {CLEAR_ORDER_VERIFIED} from 'src/redux/orders/constants';
import {widthPercentageScale} from 'src/theme/dimensions';
const OrderSuccess = ({successModal, setSuccessModal}) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const orderId = useReduxSelector(selectOrderId);
  const dispatchStore = useDispatch();
  useEffect(() => {
    dispatchStore({type: CLEAR_ORDER_VERIFIED});
  }, [dispatchStore]);
  return (
    <CustomModal
      containerStyle={styles.modal}
      hideYesNoButton={true}
      isVisible={successModal}
      onModalHide={() => {
        setSuccessModal(false);
        navigation?.navigate(Route.HomeScreen);
      }}
      onCancel={() => setSuccessModal(false)}>
      <LinearGradient
        colors={[colors.primaryGreen, colors.secondaryGreen]}
        style={styles.linearGradient}>
        <CustomTouchableSVG
          onPress={() => {
            setSuccessModal(false);
            navigation?.navigate(Route.OrderDetails, {orderId});
          }}
          containerStyle={styles.closeBtn}>
          <Ionicons name="close" size={30} color={colors.white} />
        </CustomTouchableSVG>
        <View style={styles.modalContainer}>
          <Image
            resizeMode="contain"
            style={styles.successIcon}
            source={Success}
          />
          <CustomText
            style={[styles.successText, {textTransform: 'uppercase'}]}
            textColor={colors.white}
            variant="h1"
            text="Success!"
          />
          <CustomText
            style={styles.successText}
            textColor={colors.white}
            variant="text"
            text="Thank you for choosing SAMU, We are working hard to get your order to you as fast as possible!"
          />
        </View>
        <CustomButton
          style={{fontSize: moderateScale(17)}}
          btnContainerStyle={styles.modalBtn}
          touchableBackgroundColor={colors.darkGreen}
          onPress={() => {
            setSuccessModal(false);
            navigation?.navigate(Route.OrderDetails, {orderId});
          }}
          text="View Order Status"
        />
      </LinearGradient>
    </CustomModal>
  );
};

export default OrderSuccess;

const styles = StyleSheet.create({
  linearGradient: {
    padding: moderateScale(30),
    flex: 1,
    borderRadius: 5,
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    rowGap: vs(14),
    padding: scale(22),
  },
  modal: {
    position: 'relative',
    paddingTop: 0,
    padding: moderateScale(0),
    paddingBottom: vs(0),
    backgroundColor: 'red',
    flex: 1,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
  },
  closeBtn: {
    alignSelf: 'flex-start',
    marginTop: scale(30),
  },
  successIcon: {width: scale(200), height: scale(200)},
  successText: {
    alignSelf: 'center',
    textAlign: 'center',
  },
  modalBtn: {
    height: 60,
    width: widthPercentageScale(90),
    alignSelf: 'center',
  },
});
