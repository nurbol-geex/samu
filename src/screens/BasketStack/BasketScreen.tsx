import React, {useEffect, useState, FC, useMemo, useRef} from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  View,
  RefreshControl,
  Alert,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import {moderateScale, scale, vs} from 'react-native-size-matters';
import {CustomButton} from 'src/components/shared/CustomButton';
import {CustomText} from 'src/components/shared/CustomText';
import {CustomTextInput} from 'src/components/shared/CustomInputText';
import {CustomTouchableSVG} from 'src/components/shared/CustomTouchableSVG';
import {colors} from 'src/theme/colors';
import store, {RootState, useReduxSelector} from 'src/redux';
import {
  selectCurrentCartItem,
  selectIsUpdateCartAddressLoading,
  selectProductGetCart,
  selectProductUpdateCart,
  selectUpdateCartAddressData,
} from 'src/redux/cart/selectors';
import TextContentCard from 'src/components/pageSections/Basket/TextContentCard';
import BasketCard from 'src/components/pageSections/Basket/BasketCard';
import PriceCard from 'src/components/pageSections/Basket/PriceCard';
import PaymentOption from 'src/components/pageSections/Basket/PaymentOption';
import TipOption from 'src/components/pageSections/Basket/TipOption';
import EmptyBasket from 'src/components/pageSections/Basket/EmptyBasket';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Location from 'assets/images/location.png';
import Knife from 'assets/images/fork-knife.png';
import credits from 'assets/images/credit-icon.png';
import delivery from 'assets/images/delivery-icon.png';
import {useDispatch, useSelector} from 'react-redux';
import {
  CLEAR_ADD_NEW_CARD_DATA,
  CLEAR_CHECKOUT,
  GET_ALL_PAYMENT_METHODS_REQUEST,
  PAYMENT_CALCULATED,
  SETUP_CHECKOUT,
  CHECK_ORDER_PAID,
} from 'src/redux/orders/constants';
import {
  selectCheckoutIsLoading,
  selectAllPaymentMethods,
  selectCheckout,
  selectPaymentDefault,
  selectAllPaymentMethodsIsLoading,
} from 'src/redux/orders/selectors';
import TipModal from 'src/components/pageSections/Basket/TipModal';
import NoteModal from 'src/components/pageSections/Basket/NoteModal';
import {useHeaderUserAddresses} from 'src/components/shared/CustomHomeHeader/useHeaderUserAddresses';
import SelectAddressModal from 'src/components/shared/CustomAddressModal';
import {
  appsFlyerTrackEvent,
  formatPrice,
  keyMappings,
  logAnalyticsEvent,
} from 'src/utils';
import MapView from 'src/components/pageSections/MapView.tsx/MapView';
import {Route} from 'src/routes/Route';
import OrderSuccess from 'src/components/pageSections/Basket/OrderSuccess';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {
  CLEAR_LOCAL_CART,
  UPDATE_CART_ADDRESS_REQUEST,
} from 'src/redux/cart/constants';
import {
  heightPercentageScale,
  widthPercentageScale,
} from 'src/theme/dimensions';
import ShopDetailCard from 'src/components/pageSections/Basket/ShopDetailCard';
import {setSelectedAddress} from 'src/redux/address/slice';
import NoteImage from '../../../assets/images/msg-icon.png';
import CharityIcon from '../../../assets/images/charity.png';
import {fontFamilies} from 'src/theme/textVariants';
import LocationSVG from 'assets/svg/LocationSVG';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {ANALYTICS} from 'src/redux/user/constants';
import {CustomModal} from 'src/components/shared/CustomModal';
import Clipboard from '@react-native-clipboard/clipboard';

const additionalPaymentMethods = [
  // {
  //   id: '1',
  //   image: '',
  //   isIcon: true,
  //   icon: (
  //     <View style={{backgroundColor: colors.primaryGreen, height: 35, width: 35, borderRadius: 100, justifyContent: 'center', alignSelf: 'center', alignItems: 'center'}}>
  //        <MaterialCommunityIcons
  //         color={colors.white}
  //         size={20}
  //         name="bank"
  //       />
  //     </View>
  //   ),
  //   channel: 'other',
  //   card: {
  //     cardBrand: 'Bank Transfer',
  //     last4: 'Manually Transfer Funds',
  //   },
  //   isDefault: false,
  // },
  // {
  //   id: '2',
  //   image: credits,
  //   channel: 'other',
  //   card: {
  //     cardBrand: 'Pay with Credits',
  //     last4: 'Credit balance: ₦250.00',
  //   },
  //   isDefault: false,
  // },
  // {
  //   id: '3',
  //   image: delivery,
  //   channel: 'other',
  //   card: {
  //     cardBrand: 'Pay at Delivery',
  //     last4: 'Card/Transfers Only',
  //   },
  //   isDefault: false,
  // },
];

const BasketScreen: FC = () => {
  const [copiedItem, setCopiedItem] = useState('');
  const [verifyPaymentError, setVerifyPaymentError] = useState('');
  const [isBankTransferSelected, setIsBankTransferSelected] = useState(false);
  const [paymentMethodId, setPaymentMethodId] = useState<string>('');
  const [noteModalVisible, setNoteModalVisible] = useState<boolean>(false);
  const [tipModalVisible, setTipModalVisible] = useState<boolean>(false);
  const [selectTip, setSelectTip] = useState<number>(0);
  const [courierNote, setCourierNote] = useState<string>('');
  const [storeNote, setStoreNote] = useState<string>('');
  const [orderCompleted, setOrderCompleted] = useState<boolean>(false);
  const currentCartItem = useReduxSelector(selectCurrentCartItem);
  const getAllPaymentMethods = useReduxSelector(selectAllPaymentMethods);
  const getAllPaymentMethodsloading = useReduxSelector(
    selectAllPaymentMethodsIsLoading,
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);

  const [summaryPrices, setSummaryPrices] = useState<any>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [deliveryAddress, setDeliveryAddress] = useState({});
  const [calculatedPriceLoader, setCalculatedPriceLoader] =
    useState<boolean>(false);
  const defaultPaymentMethod = getAllPaymentMethods?.find(
    (item: {isDefault: boolean}) => item?.isDefault,
  );
  const checkoutData = useReduxSelector(selectCheckout);
  const checkoutIsLoading = useReduxSelector(selectCheckoutIsLoading);
  const paymentDefaultData = useReduxSelector(selectPaymentDefault);
  const productUpdateCart = useReduxSelector(selectProductUpdateCart);
  const updatedCardAddressData = useReduxSelector(selectUpdateCartAddressData);
  const [bankDetailsModalVisible, setBankDetailsModalVisible] = useState(false);

  const [coupon, setCoupon] = useState<string>('');

  const dispatchStore = useDispatch();
  const navigation = useNavigation<NavigationProp<any>>();
  const {addressModalVisible, setAddressModalVisible, onAddNewAddressPress} =
    useHeaderUserAddresses(true);
  const isUpdateCartAddressLoading = useReduxSelector(
    selectIsUpdateCartAddressLoading,
  );
  const user = useReduxSelector(state => state.user);
  const {
    user: {accessToken, isGuest},
  } = useReduxSelector(store => ({user: store.user}));
  const {selectedAddress, addresses, primaryAddress} = useSelector(
    (state: RootState) => state.addresses,
  );

  const {orderVerifiedData, isOrderVerifiedLoading, orderVerifiedError} =
    useSelector(state => state.order);

  const onRefresh = () => {
    dispatchStore({type: GET_ALL_PAYMENT_METHODS_REQUEST});
    handleCalculatedPrice();
  };
  useEffect(() => {
    if (currentCartItem[0]?.cartId) {
      dispatchStore({type: GET_ALL_PAYMENT_METHODS_REQUEST});
      if (currentCartItem[0]?.deliveryAddress?.deliveryNotes) {
        setCourierNote(currentCartItem[0]?.deliveryAddress?.deliveryNotes);
      }
    }
  }, [dispatchStore, currentCartItem, paymentDefaultData]);

  useEffect(() => {
    if (defaultPaymentMethod) {
      setPaymentMethodId(defaultPaymentMethod?.id);
    }
  }, [defaultPaymentMethod]);

  const allPaymentMethods = useMemo(
    () => [defaultPaymentMethod, ...additionalPaymentMethods],
    [defaultPaymentMethod],
  );

  const orderData = useMemo(
    () => ({
      cartId: currentCartItem[0]?.cartId,
      paymentMethodId: paymentMethodId,
      pickUpTime: new Date().toISOString(),
      driverNotes: courierNote,
      storeNotes: storeNote,
      tip: selectTip,
      isBankTransfer: isBankTransferSelected,
      promoCode: coupon || '',
    }),
    [
      currentCartItem,
      paymentMethodId,
      courierNote,
      storeNote,
      selectTip,
      isBankTransferSelected,
    ],
  );
  const cartItems = useSelector(state => state.cart.items);
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const onSearchAnalytics = orderData => {
    // Check if cart has items
    if (currentCartItem && currentCartItem.length > 0) {
      // Start analytics event
      logAnalyticsEvent('checkoutStarted', {orderData});
      dispatchStore({
        type: ANALYTICS,
        payload: {
          eventType: 'checkoutStarted', // Specify the event type here
          data: {
            cartTotal,
            items: currentCartItem[0]?.cartId,
            userId: user.email,
            sessionId: accessToken,
          },
        },
      });
    } else {
      console.log('Cart is empty. No analytics event triggered.');
    }
  };
  useEffect(() => {
    if (orderData) {
      onSearchAnalytics(orderData);
    }
  }, [orderData]);

  const handleCheckout = () => {
    if (isBankTransferSelected) {
      setVerifyPaymentError('');
      dispatchStore({
        type: SETUP_CHECKOUT,
        payload: orderData,
      });
      logAnalyticsEvent('checkoutStarted', {orderData});
      return;
    }
    appsFlyerTrackEvent('af_purchase', {
      af_content_id: currentCartItem[0]?.cartId,
      af_price: formatPrice(totalPrice),
      af_order_id: orderData.cartId,
    });
    if (!currentCartItem[0]?.cartId) {
      logAnalyticsEvent('checkoutFailed', {reason: 'No cart ID'});
      dispatchStore({
        type: ANALYTICS,
        payload: {
          eventType: 'checkoutFailed',
          data: {
            reason: 'checkout failed',
            userId: user.email,
            sessionId: accessToken,
          },
        },
      });
      return;
    }

    if (!defaultPaymentMethod) {
      logAnalyticsEvent('checkoutFailed', {
        reason: 'No default payment method',
      });
      dispatchStore({
        type: ANALYTICS,
        payload: {
          eventType: 'checkoutFailed',
          data: {
            reason: 'No default payment method',
            userId: user.email,
            sessionId: accessToken,
          },
        },
      });
      navigation.navigate(Route.AddNewCardScreen, {orderData});
      return;
    }

    logAnalyticsEvent('checkoutCompleted', {orderData});
    dispatchStore({
      type: ANALYTICS,
      payload: {
        eventType: 'checkoutCompleted',
        data: {
          orderId: orderData.cartId,
          total: formatPrice(totalPrice),
          userId: user.email,
          sessionId: accessToken,
        },
      },
    });
    dispatchStore({
      type: SETUP_CHECKOUT,
      payload: orderData,
    });
  };

  useEffect(() => {
    if (defaultPaymentMethod && checkoutData?.status === 'processed') {
      setOrderCompleted(true);
      dispatchStore({type: CLEAR_LOCAL_CART});
      dispatchStore({type: CLEAR_CHECKOUT});
      dispatchStore({type: CLEAR_ADD_NEW_CARD_DATA});
      setStoreNote('');
      setCourierNote('');
      setSelectTip(0);
    } else if (
      checkoutData?.status === 'pending' &&
      defaultPaymentMethod &&
      checkoutData?.access_code
    ) {
      navigation.navigate(Route.AddNewCardScreen, {
        orderData,
      });
    } else if (
      checkoutData?.status === 'pending' &&
      isBankTransferSelected &&
      checkoutData.hasOwnProperty('orderId')
    ) {
      setBankDetailsModalVisible(true);
    }
  }, [
    checkoutData,
    defaultPaymentMethod,
    navigation,
    dispatchStore,
    paymentMethodId,
    orderData,
  ]);

  const handleCalculatedPrice = () => {
    if (currentCartItem[0]?.cartId) {
      setCalculatedPriceLoader(true);
      try {
        console.log('coupon: ', coupon);
        dispatchStore({
          type: PAYMENT_CALCULATED,
          payload: {
            cartId: currentCartItem[0]?.cartId,
            tip: selectTip,
            isBankTransfer: isBankTransferSelected, // Add this line
            promoCode: coupon || '',
          },
          getResponse: (fees: any) => {
            console.log('fees RES *****: ', fees);
            const feesArray = Object.keys(fees).map(key => ({
              title: keyMappings[key] || key,
              price: fees[key],
            }));
            setSummaryPrices(feesArray);
            setTotalPrice(fees.total);
            setCalculatedPriceLoader(false);
          },
        });
      } catch (error) {
        console.log('CALULATED ERROR', error);
        setCalculatedPriceLoader(false);
      }
    }
  };

  useEffect(() => {
    handleCalculatedPrice();
  }, [
    dispatchStore,
    selectTip,
    productUpdateCart,
    updatedCardAddressData,
    currentCartItem,
    isBankTransferSelected,
  ]);

  const handleUdpatedAddress = () => {
    if (selectedAddress && currentCartItem.length) {
      dispatchStore({
        type: UPDATE_CART_ADDRESS_REQUEST,
        payload: {
          data: {
            deliveryAddress: {
              street: selectedAddress?.street,
              geometry: selectedAddress?.geometry,
              city: selectedAddress?.city,
              zip: selectedAddress?.zip,
              province: selectedAddress?.province,
              country: selectedAddress?.country,
              typeOfPlace: selectedAddress?.typeOfPlace,
              deliveryNotes: selectedAddress?.deliveryNotes,
              name: selectedAddress?.name,
            },
          },
          cartId: currentCartItem[0]?.cartId,
        },
      });
      setAddressModalVisible(false);
      dispatchStore(setSelectedAddress({}));
      // const unsubscribe = store.subscribe(() => {
      //     const state = store.getState();
      //     if (state.cart.updateCartAddressSuccess) {
      //       setAddressModalVisible(false);
      //       dispatchStore(setSelectedAddress({}));
      //       unsubscribe(); // Unsubscribe from store updates once the action is handled
      //     }
      //     if (state.cart.updateCartAddressFailure) {
      //       console.log('Failed to update address. Keeping modal open.');
      //       unsubscribe();
      //     }
      //   });
    }
  };

  useEffect(() => {
    if (updatedCardAddressData?.deliveryAddress) {
      setDeliveryAddress(updatedCardAddressData?.deliveryAddress);
    } else {
      setDeliveryAddress(currentCartItem[0]?.deliveryAddress);
    }
  }, [updatedCardAddressData, currentCartItem, setDeliveryAddress]);

  const handleCopy = (value: string, type: string) => {
    if (value) {
      Clipboard.setString(value.toString());
      setCopiedItem(type);
      setTimeout(() => {
        setCopiedItem('');
      }, 3000); // Revert back after 3 seconds
    }
  };

  const verifyPayment = () => {
    setVerifyPaymentError('');
    dispatchStore({
      type: CHECK_ORDER_PAID,
      payload: {
        orderId: checkoutData.orderId,
      },
    });
  };

  const startPaymentVerification = () => {
    if (bankDetailsModalVisible) {
      const intervalId = setInterval(() => {
        verifyPayment();
      }, 10000);

      return intervalId;
    }
  };

  useEffect(() => {
    if (bankDetailsModalVisible) {
      const intervalId = startPaymentVerification();
      return () => clearInterval(intervalId);
    }
  }, [bankDetailsModalVisible, checkoutData]);

  useEffect(() => {
    setVerifyPaymentError('');
    if (orderVerifiedData.hasOwnProperty('message')) {
      console.log('Payment Verified:', orderVerifiedData);
      setBankDetailsModalVisible(false);
      navigation?.navigate(Route.OrderDetails, {orderId: checkoutData.orderId});
    }
    if (orderVerifiedError) {
      setVerifyPaymentError(orderVerifiedError.orderVerifiedData);
      console.log('Payment Error:', orderVerifiedError);
    }
  }, [orderVerifiedData, orderVerifiedError, isOrderVerifiedLoading]);

  const instructions = [
    '• Open your banking app.',
    '• Make a bank transfer to the account below.',
    '• Make sure the transfer amount is exactly the one below.',
    '• After the transfer is completed, click Verify Payment to proceed.',
  ];

  return (
    <View style={styles.container}>
      <SelectAddressModal
        isVisible={addressModalVisible}
        setVisible={setAddressModalVisible}
        onAddNewAddressPress={() => {
          setAddressModalVisible(false);
          navigation.navigate(Route.AddressScreen, {
            createFromAccount: true,
            deliveryAddress: true,
          });
        }}
        deliveryAddress={deliveryAddress}
        hideButton={true}
        handleUdpatedAddress={() => handleUdpatedAddress()}
      />
      <>
        {orderCompleted ? (
          <OrderSuccess
            successModal={orderCompleted}
            setSuccessModal={setOrderCompleted}
          />
        ) : (
          <>
            <KeyboardAvoidingView
              style={styles.keyboardAvoidingView}
              behavior={Platform.select<
                'height' | 'position' | 'padding' | undefined
              >({
                ios: 'padding',
                android: undefined,
              })}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContentContainer}
                refreshControl={
                  <RefreshControl
                    refreshing={
                      getAllPaymentMethodsloading || calculatedPriceLoader
                    }
                    onRefresh={onRefresh}
                    tintColor={colors.green300}
                  />
                }>
                {currentCartItem.length ? (
                  <>
                    <View
                      style={{
                        paddingHorizontal: scale(20),
                      }}>
                      <ShopDetailCard
                        shopName={currentCartItem[0]?.storeName}
                        address={
                          currentCartItem[0]?.storeAddress?.street +
                          ', ' +
                          currentCartItem[0]?.storeAddress?.city
                        }
                        buttonOnPress={() =>
                          navigation.navigate(Route.StoreDetails, {
                            storeId: currentCartItem[0]?.storeId,
                          })
                        }
                      />
                      <TextContentCard
                        title="Delivery Time"
                        position="flex-end"
                        icon={
                          <MaterialCommunityIcons
                            color={colors.darkGreen}
                            size={22}
                            name="clock-time-eight"
                          />
                        }
                        description={`Delivery in around ${currentCartItem[0]?.deliveryTime?.min}-${currentCartItem[0]?.deliveryTime?.max} mins`}
                        buttonOnPress={() => {}}
                        // buttonLabel="Change"
                      />

                      <View style={[styles.sectionContainer, {padding: 0}]}>
                        {currentCartItem.map((item: any, index: any) => (
                          <View key={item.id}>
                            <BasketCard
                              isBorderLess={
                                currentCartItem.length - 1 === index
                              }
                              item={item}
                            />
                          </View>
                        ))}
                      </View>
                      <CustomButton
                        btnContainerStyle={styles.continueBtn}
                        text="Add more items"
                        onPress={() =>
                          navigation.navigate(Route.StoreDetails, {
                            storeId: currentCartItem[0]?.storeId,
                          })
                        }
                      />

                      <CustomTouchableSVG
                        onPress={() => setNoteModalVisible(true)}>
                        <TextContentCard
                          icon={
                            <Image
                              style={{
                                width: scale(16),
                                height: vs(16),
                                marginRight: 2,
                              }}
                              source={NoteImage}
                            />
                          }
                          title="Note for Restaurant"
                          description={
                            storeNote === ''
                              ? 'Let us know if you have any allergies we should be aware of'
                              : storeNote
                          }
                          buttonLabelStyle={{bottom: vs(10), right: scale(10)}}
                          buttonLabel={
                            <MaterialIcons
                              name="keyboard-arrow-right"
                              size={30}
                              color={colors.primaryGreen}
                            />
                          }
                          position="flex-end"
                        />
                      </CustomTouchableSVG>
                      <NoteModal
                        noteModalVisible={noteModalVisible}
                        setNoteModalVisible={setNoteModalVisible}
                        setStoreNote={setStoreNote}
                        storeNote={storeNote}
                      />
                      <View style={styles.sectionContainer}>
                        <MapView
                          zoomEnabled={true}
                          containerStyle={styles.map}
                          lat={deliveryAddress?.geometry?.latitude}
                          lng={deliveryAddress?.geometry?.longitude}
                          draggable={false}
                          zoomLevel={15}
                        />
                        <CustomText
                          text="Delivery Address"
                          variant="h4"
                          textColor={colors.darkGreen}
                        />
                        <CustomTouchableSVG
                          containerStyle={[
                            styles.textContainer,
                            {
                              marginTop: vs(15),
                              marginBottom: vs(25),
                              alignItems: 'flex-start',
                            },
                          ]}
                          onPress={() => setAddressModalVisible(true)}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              width: '100%',
                            }}>
                            <View style={{flexDirection: 'row'}}>
                              <FontAwesome5
                                color={colors.darkGreen}
                                size={22}
                                name="map-marker-alt"
                              />
                              <CustomText
                                text={
                                  deliveryAddress
                                    ? `${`${deliveryAddress?.street}, ${deliveryAddress?.city}`}`
                                    : 'Select your address'
                                }
                                style={{marginLeft: 8}}
                                variant="label"
                                textColor={colors.dark}
                              />
                            </View>
                            <MaterialIcons
                              style={{bottom: scale(3)}}
                              name="keyboard-arrow-right"
                              size={30}
                              color={colors.primaryGreen}
                            />
                          </View>
                        </CustomTouchableSVG>

                        <CustomText
                          text="Leave a note for courier"
                          variant="h5"
                          textColor={colors.darkGreen}
                        />
                        <CustomTextInput
                          value={courierNote}
                          onChange={(e: any) => setCourierNote(e)}
                          multiline
                          style={styles.noteInput}
                          containerStyle={[
                            styles.inputContainer,
                            {marginTop: vs(10)},
                          ]}
                          inputContainerStyle={{
                            height: heightPercentageScale(11),
                            alignItems: 'flex-start',
                          }}
                          placeholder="Enter your message"
                        />
                      </View>
                      <TextContentCard
                        title="Cutlery"
                        icon={
                          <Image
                            source={Knife}
                            style={{width: scale(16), height: vs(16)}}
                          />
                        }
                        description="Help us reduce plastic waste - only request cutlery when you need it"
                        position="flex-start"
                        buttonLabelStyle={{left: scale(20)}}
                        buttonLabel={
                          <Switch
                            trackColor={{
                              false: colors.grey,
                              true: colors.primaryGreen,
                            }}
                            thumbColor={colors.white}
                            ios_backgroundColor={colors.grey}
                            onValueChange={() => console.log('SWITCH')}
                            value={true}
                          />
                        }
                      />
                      <View style={styles.sectionContainer}>
                        <CustomText
                          text="Payment Options"
                          variant="h4"
                          textColor={colors.darkGreen}
                        />
                        <CustomTouchableSVG
                          containerStyle={[
                            styles.sectionContainer,
                            isBankTransferSelected // Check if selected
                              ? {
                                  backgroundColor: colors.green50,
                                  borderColor: colors.primaryGreen,
                                  borderWidth: 1,
                                }
                              : {borderColor: 'transparent'},
                          ]}
                          onPress={() => {
                            // handleOptionSelect('bank_transfer'); // Update selected option
                            // setBankDetailsModalVisible(true);
                            setIsBankTransferSelected(true);
                          }}>
                          <View style={styles.textContainer}>
                            <View
                              style={{
                                backgroundColor: colors.primaryGreen,
                                height: 35,
                                width: 35,
                                borderRadius: 100,
                                justifyContent: 'center',
                                alignSelf: 'center',
                                alignItems: 'center',
                              }}>
                              <MaterialCommunityIcons
                                color={colors.white}
                                size={20}
                                name="bank"
                              />
                            </View>
                            <View>
                              <CustomText
                                text="Bank Transfer"
                                variant="label"
                                textColor={colors.darkGreen}
                              />
                              <CustomText
                                text="Manually Transfer Funds"
                                variant="light"
                                textColor={colors.darkGreen}
                              />
                            </View>
                          </View>
                        </CustomTouchableSVG>
                        {getAllPaymentMethods?.length
                          ? allPaymentMethods.map(
                              (paymentOptions: any, index: number) => {
                                return (
                                  <PaymentOption
                                    key={index}
                                    paymentOptions={paymentOptions}
                                    selectedOption={
                                      isBankTransferSelected
                                        ? null
                                        : paymentMethodId
                                    }
                                    bankTransfer={isBankTransferSelected}
                                    // handleOptionSelect={(optionId: string) =>
                                    //   // console.log('optionId: ', optionId);
                                    //   setPaymentMethodId(optionId)
                                    //   // setIsBankTransferSelected
                                    // }
                                    handleOptionSelect={(optionId: string) => {
                                      if (optionId === 'bank_transfer') {
                                        setIsBankTransferSelected(true);
                                      } else {
                                        setPaymentMethodId(optionId);
                                        setIsBankTransferSelected(false);
                                      }
                                    }}
                                  />
                                );
                              },
                            )
                          : null}

                        {allPaymentMethods?.length && (
                          <CustomTouchableSVG
                            onPress={() => {
                              dispatchStore({type: CLEAR_ADD_NEW_CARD_DATA});
                              navigation.navigate(Route.AddNewCardScreen, {
                                changeCard: true,
                              });
                            }}
                            containerStyle={styles.addNewPaymentMethod}>
                            <View style={styles.textContainer}>
                              <Image
                                source={require('assets/images/payment-icon.png')}
                                style={styles.paymentImage}
                                resizeMode="contain"
                              />
                              {getAllPaymentMethods.length > 0 ? (
                                <CustomText
                                  text="Change Card Details"
                                  variant="label"
                                  textColor={colors.darkGreen}
                                  style={{alignSelf: 'center'}}
                                />
                              ) : (
                                <CustomText
                                  text="Add Card Details"
                                  variant="label"
                                  textColor={colors.darkGreen}
                                  style={{alignSelf: 'center'}}
                                />
                              )}
                            </View>

                            <MaterialIcons
                              name="keyboard-arrow-right"
                              size={30}
                              color={colors.primaryGreen}
                            />
                          </CustomTouchableSVG>
                        )}

                        {/* Bank Details Modal */}
                        <CustomModal
                          buttonVariant="variant1"
                          forceRedButtons={true} // Enforce red buttons for this specific modal
                          isVisible={bankDetailsModalVisible}
                          onModalHide={() => setBankDetailsModalVisible(false)}
                          title={'Payment with Transfer'}
                          onCancel={() => setBankDetailsModalVisible(false)}
                          okBtnColor={colors.darkGreen}
                          okBtnLoading={isOrderVerifiedLoading}
                          onOk={() => {
                            // setBankDetailsModalVisible(false);
                            verifyPayment();
                          }}>
                          <View
                            style={{
                              paddingHorizontal: 20,
                              paddingVertical: 10,
                            }}>
                            <CustomText
                              variant="title"
                              text="Instructions"
                              style={{
                                fontSize: 14,
                                textAlign: 'center',
                                fontWeight: 700,
                                marginBottom: 10,
                                alignSelf: 'center',
                                color: colors.dark,
                              }}
                            />

                            <CustomText
                              variant="title"
                              text={`To complete your bank transfer:`}
                              style={[
                                styles.bankText,
                                {
                                  fontWeight: '800',
                                  fontSize: 15,
                                  marginBottom: 10,
                                },
                              ]}
                            />

                            <CustomText
                              variant="title"
                              text={`${instructions
                                .map(instruction => `${instruction}`)
                                .join('\n')}`}
                              style={styles.bankText}
                            />
                          </View>
                          <View style={styles.cartDetailsBox}>
                            <View
                              style={{
                                paddingVertical: 14,
                                paddingHorizontal: 20,
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 10,
                              }}>
                              <MaterialCommunityIcons
                                size={20}
                                name="information-outline"
                              />
                              <CustomText
                                text={`Payment is required within 20 min; Make sure the transferred amount is exactly the value below`}
                                variant="Figtree"
                                textColor={colors.black}
                                style={{
                                  fontSize: 13,
                                  fontWeight: '500',
                                  width: widthPercentageScale(88),
                                }}
                              />
                            </View>
                          </View>
                          <View>
                            {checkoutData && checkoutData.data ? (
                              <>
                                {/* Amount */}
                                <View
                                  key="amount"
                                  style={styles.amountContainer}>
                                  <View style={styles.amountGroup}>
                                    <CustomText
                                      text={`Amount to pay`}
                                      variant="text"
                                      style={styles.bankText}
                                    />
                                    <CustomText
                                      variant="title"
                                      text={`NGN ${parseFloat(
                                        checkoutData?.amount,
                                      ).toFixed(2)}`}
                                      style={{
                                        fontSize: 18,
                                        fontWeight: '800',
                                      }}
                                    />
                                  </View>
                                  <TouchableOpacity
                                    onPress={() => {
                                      handleCopy(
                                        parseFloat(
                                          checkoutData?.amount,
                                        ).toFixed(2),
                                        'amount',
                                      );
                                    }}>
                                    <MaterialCommunityIcons
                                      size={24}
                                      name={
                                        copiedItem === 'amount'
                                          ? 'check'
                                          : 'content-copy'
                                      }
                                      color={
                                        copiedItem === 'amount'
                                          ? colors.primaryGreen
                                          : colors.dark
                                      }
                                    />
                                  </TouchableOpacity>
                                </View>

                                {/* Beneficiary Account Holder */}
                                <View
                                  key="account_name"
                                  style={styles.amountContainer}>
                                  <View style={styles.amountGroup}>
                                    <CustomText
                                      text={`Beneficiary Account Holder`}
                                      variant="text"
                                      style={styles.bankText}
                                    />
                                    <CustomText
                                      variant="title"
                                      text={checkoutData?.data?.account_name}
                                      style={{
                                        fontSize: 18,
                                        fontWeight: '800',
                                      }}
                                    />
                                  </View>
                                  <TouchableOpacity
                                    onPress={() => {
                                      handleCopy(
                                        checkoutData?.data?.account_name,
                                        'account_name',
                                      );
                                    }}>
                                    <MaterialCommunityIcons
                                      size={24}
                                      name={
                                        copiedItem === 'account_name'
                                          ? 'check'
                                          : 'content-copy'
                                      }
                                      color={
                                        copiedItem === 'account_name'
                                          ? colors.primaryGreen
                                          : colors.dark
                                      }
                                    />
                                  </TouchableOpacity>
                                </View>

                                {/* Beneficiary Bank Name */}
                                <View
                                  key="bank_name"
                                  style={styles.amountContainer}>
                                  <View style={styles.amountGroup}>
                                    <CustomText
                                      text={`Beneficiary Bank Name`}
                                      variant="text"
                                      style={styles.bankText}
                                    />
                                    <CustomText
                                      variant="title"
                                      text={checkoutData?.data?.bank?.name}
                                      style={{
                                        fontSize: 18,
                                        fontWeight: '800',
                                      }}
                                    />
                                  </View>
                                  <TouchableOpacity
                                    onPress={() => {
                                      handleCopy(
                                        checkoutData?.data?.bank?.name,
                                        'bank_name',
                                      );
                                    }}>
                                    <MaterialCommunityIcons
                                      size={24}
                                      name={
                                        copiedItem === 'bank_name'
                                          ? 'check'
                                          : 'content-copy'
                                      }
                                      color={
                                        copiedItem === 'bank_name'
                                          ? colors.primaryGreen
                                          : colors.dark
                                      }
                                    />
                                  </TouchableOpacity>
                                </View>

                                {/* Beneficiary Account Number */}
                                <View
                                  key="account_number"
                                  style={styles.amountContainer}>
                                  <View style={styles.amountGroup}>
                                    <CustomText
                                      text={`Beneficiary Account Number`}
                                      variant="text"
                                      style={styles.bankText}
                                    />
                                    <CustomText
                                      variant="title"
                                      text={checkoutData?.data?.account_number}
                                      style={{
                                        fontSize: 18,
                                        fontWeight: '800',
                                      }}
                                    />
                                  </View>
                                  <TouchableOpacity
                                    onPress={() => {
                                      handleCopy(
                                        checkoutData?.data?.account_number,
                                        'account_no',
                                      );
                                    }}>
                                    <MaterialCommunityIcons
                                      size={24}
                                      name={
                                        copiedItem === 'account_no'
                                          ? 'check'
                                          : 'content-copy'
                                      }
                                      color={
                                        copiedItem === 'account_no'
                                          ? colors.primaryGreen
                                          : colors.dark
                                      }
                                    />
                                  </TouchableOpacity>
                                </View>

                                <CustomText
                                  text={verifyPaymentError}
                                  variant="text"
                                  style={{
                                    color: colors.red500,
                                    alignSelf: 'center',
                                    marginBottom: 10,
                                  }}
                                />
                              </>
                            ) : (
                              <CustomText
                                variant="text"
                                text="No bank details available"
                                style={{
                                  textAlign: 'center',
                                  color: colors.red200,
                                }}
                              />
                            )}
                          </View>
                        </CustomModal>
                      </View>

                      <View style={[styles.sectionContainer, {gap: 8}]}>
                        <CustomText
                          text="Coupon Code"
                          variant="h4"
                          textColor={colors.darkGreen}
                        />
                        <View style={[styles.row, {gap: 8}]}>
                          <View style={styles.flex}>
                            <CustomTextInput
                              inputContainerStyle={{
                                alignItems: 'center',
                                height: heightPercentageScale(7),
                              }}
                              value={coupon} // promo
                              onChange={(val: any) => setCoupon(val)}
                              containerStyle={styles.inputContainer}
                              placeholder="Enter code here"
                            />
                          </View>
                          <CustomButton
                            onPress={handleCalculatedPrice}
                            btnContainerStyle={[
                              styles.applyButton,
                              {alignSelf: 'center'},
                            ]}
                            touchableBackgroundColor={colors.darkGreen}
                            containerStyle={styles.applyButton}
                            loading={calculatedPriceLoader}
                            text="Apply"
                          />
                        </View>
                      </View>

                      <TipOption
                        setTipModalVisible={setTipModalVisible}
                        selectTip={selectTip}
                        setSelectTip={setSelectTip}
                      />
                      <TipModal
                        tipModalVisible={tipModalVisible}
                        setTipModalVisible={setTipModalVisible}
                        setSelectTip={setSelectTip}
                        selectTip={selectTip}
                      />
                      <View style={styles.sectionContainer}>
                        <CustomText
                          text="Summary"
                          variant="h4"
                          textColor={colors.darkGreen}
                        />
                        {summaryPrices.map((item: any, index: number) => (
                          <PriceCard
                            key={index}
                            title={item?.title}
                            price={item.price}
                            containerStyle={styles.row}
                          />
                        ))}
                      </View>
                      {/* <View
                        style={[
                          styles.sectionContainer,
                          styles.charityContainer,
                        ]}>
                        <View style={{flexDirection: 'row'}}>
                          <Image
                            source={CharityIcon}
                            style={{width: scale(20), height: vs(20)}}
                            resizeMode="contain"
                          />
                          <CustomText
                            style={{
                              width: widthPercentageScale(58),
                              marginLeft: 10,
                            }}
                            numberOfLines={3}
                            text="Round up your spare charge to donate to charity?"
                            variant="text"
                            textColor={colors.dark}
                          />
                        </View>
                        <Switch
                          trackColor={{
                            false: colors.grayBg,
                            true: colors.primaryGreen,
                          }}
                          thumbColor={colors.white}
                          ios_backgroundColor={colors.grayBg}
                          onValueChange={() => console.log('SWITCH')}
                          value={false}
                        />
                      </View> */}
                    </View>
                  </>
                ) : (
                  <EmptyBasket />
                )}
              </ScrollView>
            </KeyboardAvoidingView>
            <View style={styles.checkoutContainer}>
              {currentCartItem?.length ? (
                checkoutIsLoading ||
                isUpdateCartAddressLoading ||
                calculatedPriceLoader ? (
                  <ActivityIndicator color={colors.darkGreen} size={'small'} />
                ) : (
                  <CustomButton
                    onPress={handleCheckout}
                    disabled={totalPrice < 1 || checkoutIsLoading}
                    btnContainerStyle={{opacity: totalPrice < 1 ? 0.5 : 1}}
                    text={
                      !defaultPaymentMethod
                        ? `Pay ${formatPrice(totalPrice)} & Checkout`
                        : `Checkout ${formatPrice(totalPrice)}`
                    }
                  />
                )
              ) : null}
            </View>
          </>
        )}
      </>
      {/* )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  amountContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 15,
  },
  amountGroup: {
    paddingHorizontal: 20,
    // paddingVertical: 0,
  },
  flex: {flex: 1},
  keyboardAvoidingView: {
    flex: 1,
  },
  amountText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scrollViewContentContainer: {
    flexGrow: 1,
    paddingBottom: vs(10),
  },
  sectionContainer: {
    marginTop: vs(14),
    padding: scale(10),
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: moderateScale(12),
  },
  addNewPaymentMethod: {
    marginTop: vs(14),
    paddingVertical: scale(13),
    paddingHorizontal: scale(10),
    borderRadius: moderateScale(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: colors.gray73,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
    backgroundColor: colors.white,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    width: scale(18),
    height: vs(18),
    // resizeMode: 'contain',
  },
  map: {
    borderTopLeftRadius: moderateScale(8),
    borderTopRightRadius: moderateScale(8),
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: vs(5),
  },
  inputContainer: {
    marginHorizontal: scale(0),
    marginVertical: vs(0),
  },
  applyButton: {
    backgroundColor: colors.darkGreen,
    borderRadius: moderateScale(10),
    width: scale(80),
    alignSelf: 'center',
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
  paymentImage: {
    width: scale(30),
    height: scale(30),
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
    paddingVertical: 0,
    backgroundColor: colors.primaryGreen,
    flex: 1,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
  },
  closeBtn: {position: 'absolute', left: 20, top: 20},
  successIcon: {width: scale(200), height: vs(200)},
  modalBtn: {
    width: scale(350),
    position: 'absolute',
    bottom: 0,
  },
  continueBtn: {
    marginTop: 20,
    borderRadius: 8,
    width: widthPercentageScale(85),
    alignSelf: 'center',
  },
  charityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: scale(12),
    alignItems: 'flex-start',
    width: widthPercentageScale(90),
  },
  noteInput: {
    verticalAlign: 'top',
    paddingTop: vs(12),
    paddingLeft: vs(12),
    fontFamily: fontFamilies.medium,
    fontWeight: '500',
    fontSize: moderateScale(15.09), //16
    letterSpacing: -0.1,
    color: colors.darkGreen,
  },
  bankText: {
    fontSize: 14,
    color: colors.dark,
    marginBottom: 4,
    lineHeight: 22,
  },
  cartDetailsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.orange50,
    width: widthPercentageScale(100),
    alignSelf: 'center',
    gap: 10,
    marginBottom: 16,
  },
});

export default BasketScreen;
