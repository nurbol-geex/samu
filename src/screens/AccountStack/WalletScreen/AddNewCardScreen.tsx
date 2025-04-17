import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {useDispatch} from 'react-redux';
// import RNPaystack from 'react-native-paystack';
import {useReduxSelector} from 'src/redux';
import {colors} from 'src/theme/colors';
import {CustomHeader} from 'src/components/shared/CustomHeader';
import {CustomText} from 'src/components/shared/CustomText';
import {CustomTextInput} from 'src/components/shared/CustomInputText';
import {CustomButton} from 'src/components/shared/CustomButton';
import {CustomStatusBar} from 'src/components/shared/CustomStatusBar';
import {moderateScale, scale, vs} from 'react-native-size-matters';
import {
  ADD_NEW_PAYMENT_METHOD,
  GET_ALL_PAYMENT_METHODS_REQUEST,
  UPDATE_PAYMENT_METHOD,
  CLEAR_ADD_NEW_CARD_DATA,
} from 'src/redux/orders/constants';
import {
  analytics,
  appsFlyerTrackEvent,
  CardFields,
  Errors,
  extractAllDash,
  extractBin,
  extractExpMonth,
  extractExpYear,
  extractFirstName,
  extractLast4,
  extractLastName,
  formatCardNumber,
  formatExpiryDate,
  validateFields,
} from 'src/utils/index';
import {
  selectCheckoutIsLoading,
  selectAddNewPaymentMethod,
  selectAddNewPaymentMethodIsLoading,
  selectCheckout,
  selectUpdatePaymentMethodIsLoading,
  selectCardDetails,
  selectOrderVerifiedIsLoading,
  selectOrderVerifiedData,
  selectAllPaymentMethods,
} from 'src/redux/orders/selectors';
import OrderSuccess from 'src/components/pageSections/Basket/OrderSuccess';
import {CardDetails} from 'src/redux/orders/initialState';
import {showToast} from 'src/components/shared/CustomToast/toastUtils';
import {ANALYTICS} from 'src/redux/user/constants';
import * as Sentry from '@sentry/react-native'; // Import Sentry
import { useAnalytics } from 'src/segmentService';

const AddNewCardScreen: React.FC<AddNewCardScreenProps> = ({
  route,
  navigation,
}) => {
  const dispatchStore = useDispatch();
  const paystackInvokedRef = useRef(false);

  const orderData = route?.params?.orderData;
  const changeCard = route?.params?.changeCard;
  const addNewPaymentMethodIsLoading = useReduxSelector(
    selectAddNewPaymentMethodIsLoading,
  );
  const checkoutIsLoading = useReduxSelector(selectCheckoutIsLoading);
  const checkoutData = useReduxSelector(selectCheckout);
  const addNewCardData = useReduxSelector(selectAddNewPaymentMethod);
  const updatePaymentMethodIsLoading = useReduxSelector(
    selectUpdatePaymentMethodIsLoading,
  );
  const orderVerifiedIsLoading = useReduxSelector(selectOrderVerifiedIsLoading);
  const orderVerifiedData = useReduxSelector(selectOrderVerifiedData);
  const getAllPaymentMethods = useReduxSelector(selectAllPaymentMethods);
  const savedCardDetails = useReduxSelector(selectCardDetails);
  const [matchingCardDetails, setMatchingCardDetails] =
    useState<CardDetails | null>(null);
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState<any>(null); // Define a type for this if known
  const [newCardFields, setNewCardFields] = useState<CardFields>({
    name: '',
    cardNumber: '',
    expDate: '',
    cvc: '',
    billingAddress: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [paystackLoading, setPaystackLoading] = useState<boolean>(false);
  const [orderCompleted, setOrderCompleted] = useState<boolean>(false);
  const {
    user: {accessToken, isGuest, email},
  } = useReduxSelector(store => ({user: store.user}));
  const user = useReduxSelector(state => state.user);
  const { track } = useAnalytics()

  const onSearchAnalytics = () => {
    if (Object.keys(addNewCardData).length) {
      track('Begin Adding Payment Method', {addNewCardData});
      dispatchStore({
        type: ANALYTICS,
        payload: {
          eventType: 'beginAddingPaymentMethod', // Specify the event type here
          data: {
            userId: user.email,
            sessionId: accessToken,
          },
        },
      });
    }
  };
  useEffect(() => {
    onSearchAnalytics(); // Dispatch analytics when search key is set

    if (newCardFields.cardNumber) {
      setNewCardFields(prev => ({
        ...prev,
        cardNumber: formatCardNumber(prev.cardNumber), // Format card number with dashes
      }));
    }
  }, []);

  useEffect(() => {
    if (getAllPaymentMethods && Object.keys(addNewCardData).length) {
      if (changeCard) {
        navigation.goBack();
        return;
      }
      const defaultMethod = getAllPaymentMethods.find(
        (item: {isDefault: boolean}) => item?.isDefault,
      );

      setDefaultPaymentMethod(defaultMethod);

      if (defaultMethod) {
        const bin = defaultMethod.card.bin;
        const last4 = defaultMethod.card.last4;

        const matchingCard: any = savedCardDetails.find(card => {
          return (
            card.cardNumber.startsWith(bin) && card.cardNumber.endsWith(last4)
          );
        });
        setMatchingCardDetails(matchingCard);
      }
    }
  }, [
    getAllPaymentMethods,
    savedCardDetails,
    addNewCardData,
    changeCard,
    navigation,
    dispatchStore,
  ]);

  const handleAddNewPaymentMethod = () => {

    const validationErrors = validateFields(newCardFields);
    if (Object.keys(validationErrors).length > 0) {
      track('paymentMethodError', {validationError: true});
      setErrors(validationErrors);
      return;
    }
        appsFlyerTrackEvent('af_add_payment_info', {
          af_payment_info_added:  addNewCardData, 
          af_payment_method: 'Card',
          
          });

    setErrors({});
    const cardDetails = {
      name: newCardFields.name,
      bin: extractBin(newCardFields.cardNumber),
      last4: extractLast4(newCardFields.cardNumber),
      expMonth: extractExpMonth(newCardFields.expDate),
      expYear: extractExpYear(newCardFields.expDate),
      firstName: extractFirstName(newCardFields.name),
      lastName: extractLastName(newCardFields.name),
      isDefault: true,
    };
    const cardDetailsPaystack = {
      cardNumber: extractAllDash(newCardFields.cardNumber),
      expiryMonth: extractExpMonth(newCardFields.expDate),
      expiryYear: extractExpYear(newCardFields.expDate),
      cvc: newCardFields.cvc,
    };
    dispatchStore({
      type: ADD_NEW_PAYMENT_METHOD,
      payload: {
        cardDetails,
        orderData,
        cardDetailsPaystack,
        navigation,
        changeCard,
      },
    });
  };

  const handlePaystack = useCallback(async () => {
    if (paystackInvokedRef.current) return;
    paystackInvokedRef.current = true;

    try {
      setPaystackLoading(true);
      let response;
      try {
        // response = await RNPaystack.chargeCardWithAccessCode({
        //   cardNumber: matchingCardDetails?.cardNumber,
        //   expiryMonth: matchingCardDetails?.expiryMonth,
        //   expiryYear: matchingCardDetails?.expiryYear,
        //   cvc: matchingCardDetails?.cvc,
        //   accessCode: checkoutData?.access_code,
        // });
        response = { reference: 'test' }; // Temporary mock response
      } catch (error) {
        const errorMessage = Array.isArray(error)
        ? error[0]
        : error?.message || 'An unexpected error occurred';
        Sentry.captureException(errorMessage);
        
        track('paymentMethod', {paystackChargeCardError: errorMessage});
        showToast('error', 'Error', errorMessage);

        dispatchStore({type: CLEAR_ADD_NEW_CARD_DATA});
        console.log('Paystack error>>', error);
        return;
      }

      if (response?.reference) {
        track('paymentMethod', {paystackChargeCard: 'Success'});
        dispatchStore({
          type: ANALYTICS,
          payload: {
            eventType: 'paymentMethodAdded', // Specify the event type here
            data: {
              userId: user.email,
              sessionId: accessToken,
              paymentMethodType: 'credit card',
            },
          },
        });
        dispatchStore({
          type: UPDATE_PAYMENT_METHOD,
          payload: {
            orderId: checkoutData?.orderId,
            paymentMethodId: defaultPaymentMethod?.id,
          },
        });
      }
    } catch (error) {
      console.log('Something went wrong>>', error);
      const errorMessage = error?.message || 'An unexpected error occurred';
      Sentry.captureException(errorMessage);
      track('paymentMethod', {paystackChargeCardError: errorMessage});
      showToast('error', 'Error', errorMessage);
    } finally {
      setPaystackLoading(false);
      paystackInvokedRef.current = false;
    }
  }, [
    checkoutData,
    dispatchStore,
    matchingCardDetails,
    defaultPaymentMethod?.id,
  ]);

  useEffect(() => {
    if (orderVerifiedData?.message === 'Order is paid successfully.') {
      track('paymentMethod', {verifyOrderPayment: 'Success'});

      setNewCardFields({
        name: '',
        cardNumber: '',
        expDate: '',
        cvc: '',
        billingAddress: '',
      });
      setOrderCompleted(true);
    }
  }, [orderVerifiedData, orderCompleted]);

  useEffect(() => {
    const executePaymentFlow = () => {
      if (matchingCardDetails) {
        track('paymentMethod', {initiatingPaystack: 'Success'});
        handlePaystack();
      } else {
        console.log('Waiting for user to add card details...');
      }
    };
    if (
      checkoutData?.status === 'pending' &&
      checkoutData?.access_code &&
      !paystackInvokedRef.current
    ) {
      executePaymentFlow();
    }
  }, [checkoutData, handlePaystack, matchingCardDetails]);

  const handleChange = (value: string, name: keyof CardFields) => {
    if (name === 'cardNumber') {
      value = formatCardNumber(value);
    } else if (name === 'expDate') {
      value = formatExpiryDate(value);
    }
    setNewCardFields(prev => ({...prev, [name]: value}));

    setErrors(prevErrors => ({...prevErrors, [name]: undefined}));
  };
  useEffect(() => {
    if (Object.keys(addNewCardData).length) {
      dispatchStore({type: GET_ALL_PAYMENT_METHODS_REQUEST});
    }
  }, [dispatchStore, addNewCardData]);
  if (
    addNewPaymentMethodIsLoading ||
    checkoutIsLoading ||
    updatePaymentMethodIsLoading ||
    paystackLoading ||
    orderVerifiedIsLoading
  ) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.darkGreen} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <CustomStatusBar />
      <CustomHeader
        title="PAYOUT METHOD"
        titleColor={colors.white}
        containerBackgroundColor={colors.primaryGreen}
        startButtonIconType="back"
      />
      {orderCompleted ? (
        <OrderSuccess
          successModal={orderCompleted}
          setSuccessModal={setOrderCompleted}
        />
      ) : (
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.select<'height' | 'position' | 'padding'>({
            ios: 'padding',
            android: undefined,
          })}
          keyboardVerticalOffset={0}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContentContainer}>
            <CustomText
              style={styles.headerText}
              text="Add Payment Card"
              variant="h2"
              textColor={colors.darkGreen}
            />
            <CustomTextInput
              inputStyle={styles.input}
              containerStyle={styles.inputContainer}
              label="Full Name"
              placeholder="Enter your full name on the card"
              onChangeText={e => handleChange(e, 'name')}
              value={newCardFields.name}
              error={errors.name}
            />
            {/* {errors.name && (
              <CustomText style={styles.errorText} text={errors.name} />
            )} */}
            <CustomTextInput
              inputStyle={styles.input}
              containerStyle={styles.inputContainer}
              keyboardType="numeric"
              label="Card Number"
              placeholder="xxxx-xxxx-xxxx-xxxx"
              onChangeText={e => handleChange(e, 'cardNumber')}
              value={newCardFields.cardNumber}
              maxLength={23}
              error={errors.cardNumber}
            />
            {/* {errors.cardNumber && (
              <CustomText style={styles.errorText} text={errors.cardNumber} />
            )} */}
            <View style={styles.row}>
              <View>
                <CustomTextInput
                  inputStyle={styles.input}
                  containerStyle={[
                    styles.inputContainer,
                    styles.expiryContainer,
                  ]}
                  keyboardType="numeric"
                  label="Expiry Date"
                  placeholder="MM/YY"
                  onChangeText={e => handleChange(e, 'expDate')}
                  value={newCardFields.expDate}
                  maxLength={5}
                  error={errors.expDate}
                />
                {/* {errors.expDate && (
                  <CustomText style={styles.errorText} text={errors.expDate} />
                )} */}
              </View>
              <View>
                <CustomTextInput
                  keyboardType="numeric"
                  inputStyle={styles.input}
                  containerStyle={[styles.inputContainer, styles.cvcContainer]}
                  label="Security Code"
                  placeholder="CVC"
                  onChangeText={e => handleChange(e, 'cvc')}
                  value={newCardFields.cvc}
                  maxLength={3}
                  error={errors.cvc}
                />
                {/* {errors.cvc && (
                  <CustomText style={styles.errorText} text={errors.cvc} />
                )} */}
              </View>
            </View>
            <CustomTextInput
              inputStyle={styles.input}
              containerStyle={styles.inputContainer}
              label="Billing Address"
              placeholder="Enter your billing address"
              onChangeText={e => handleChange(e, 'billingAddress')}
              value={newCardFields.billingAddress}
              error={errors.billingAddress}
            />
            {/* {errors.billingAddress && (
              <CustomText
                style={styles.errorText}
                text={errors.billingAddress}
              />
            )} */}
          </ScrollView>
          <View style={styles.checkoutContainer}>
            {addNewPaymentMethodIsLoading ? (
              <ActivityIndicator size="small" color={colors.darkGreen} />
            ) : (
              <CustomButton text="Save" onPress={handleAddNewPaymentMethod} />
            )}
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
};

export default AddNewCardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContentContainer: {
    flexGrow: 1,
  },
  inputContainer: {
    marginHorizontal: scale(0),
    marginVertical: vs(10),
    height: vs(70),
    width: scale(325),
    alignSelf: 'center',
  },
  input: {
    paddingLeft: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expiryContainer: {
    width: scale(155),
    marginHorizontal: scale(14),
  },
  cvcContainer: {
    width: scale(155),
  },
  errorText: {
    color: 'red',
    // paddingLeft: 20,
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
  headerText: {
    alignSelf: 'center',
    marginVertical: vs(10),
  },
});
