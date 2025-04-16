import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {CustomStatusBar} from 'src/components/shared/CustomStatusBar';
import {colors} from 'src/theme/colors';
import {CustomHeader} from 'src/components/shared/CustomHeader';
import {moderateScale, scale, vs} from 'react-native-size-matters';
import {CustomText} from 'src/components/shared/CustomText';
import User from '../../../../assets/images/UserPic.png';
import {StoreAddress} from 'src/components/pageSections/Store/StoreAddress';
import StoreContact from 'src/components/pageSections/Store/StoreContact';
import StoreHelp from 'src/components/pageSections/Store/StoreHelp';
import PriceCard from 'src/components/pageSections/Basket/PriceCard';
import {CustomTouchableSVG} from 'src/components/shared/CustomTouchableSVG';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Visa from '../../../../assets/images/visa-icon.png';
import LinearGradient from 'react-native-linear-gradient';
import MapView from 'src/components/pageSections/MapView.tsx/MapView';
import {WebView} from 'react-native-webview';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {Route} from 'src/routes/Route';
import {useDispatch} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {CANCEL_ORDER, GET_ORDER_DETAILS} from 'src/redux/orders/constants';
import {AppDispatch, useReduxSelector} from 'src/redux';
import {
  selectCancelOrder,
  selectCancelOrderIsLoading,
  selectGetOrderDetails,
  selectGetOrderDetailsIsLoading,
} from 'src/redux/orders/selectors';
import {keyMappings, OrderStatus, OrderStatusText} from 'src/utils';
import {CustomButton} from 'src/components/shared/CustomButton';
import moment from 'moment';
import {
  fetchOrdersByActive,
  fetchOrdersByCancelled,
  resetActiveReducer,
} from 'src/redux/orders/thunk/getAllOrders';
import {formatPrice} from 'src/utils';
import YourExperience from 'src/components/pageSections/RateBar/YourExperience';
import {widthPercentageScale} from 'src/theme/dimensions';
import {CustomModal} from 'src/components/shared/CustomModal';

const Status = [
  {
    icon: require('../../../../assets/images/Processed.png'),
    orderStatus: OrderStatus.pending,
    isHighlighted: false,
    date: '',
    key: 0,
  },
  {
    icon: require('../../../../assets/images/Processed.png'),
    orderStatus: OrderStatus.processed,
    isHighlighted: false,
    date: '',
    key: 1,
  },
  {
    icon: require('../../../../assets/images/order-accepted.png'),
    orderStatus: OrderStatus.accepted,
    isHighlighted: false,
    date: '',
    key: 2,
  },
  {
    icon: require('../../../../assets/images/Packed.png'),
    orderStatus: OrderStatus.ready,
    isHighlighted: false,
    date: '',
    key: 3,
  },
  {
    icon: require('../../../../assets/images/Picked.png'),
    orderStatus: OrderStatus.pickedUp,
    isHighlighted: false,
    date: '',
    key: 4,
  },
  {
    icon: require('../../../../assets/images/Delivering.png'),
    orderStatus: OrderStatus.onDelivery,
    isHighlighted: false,
    date: '',
    key: 5,
  },
  {
    icon: require('../../../../assets/images/correct.png'),
    orderStatus: OrderStatus.completed,
    isHighlighted: false,
    date: '',
    key: 6,
  },
  {
    icon: require('../../../../assets/images/cancel.png'),
    orderStatus: OrderStatus.cancelled,
    isHighlighted: false,
    date: '',
    key: 7,
  },
  {
    icon: require('../../../../assets/images/cancel.png'),
    orderStatus: OrderStatus.failed,
    isHighlighted: false,
    date: '',
    key: 8,
  },
];

const OrderDetails = ({route}) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const getOrderDetailsData = useReduxSelector(selectGetOrderDetails);
  const getOrderDetailsIsLoading = useReduxSelector(
    selectGetOrderDetailsIsLoading,
  );
  const cancelOrderData = useReduxSelector(selectCancelOrder);
  const cancelOrderLoading = useReduxSelector(selectCancelOrderIsLoading);

  const orderId = route?.params?.orderId;
  const fromReviewScreen = route?.params?.fromReviewScreen;
  const dispatchStore: AppDispatch = useDispatch();
  const [updatedStatus, setUpdatedStatus] = useState(Status);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isRefreshLoad, setRefreshLoad] = useState(false);
  const [cancelOrderModal, setCancelOrderModal] = useState(false);

  useEffect(() => {
    if (orderId) {
      dispatchStore({
        type: GET_ORDER_DETAILS,
        payload: {orderId: orderId},
      });
    }
    dispatchStore(resetActiveReducer());
    dispatchStore(
      fetchOrdersByActive({
        page: 1,
        pageSize: 10,
        status: 'active',
        sortBy: 'latest',
      }),
    );
    dispatchStore(
      fetchOrdersByCancelled({
        page: 1,
        pageSize: 10,
        status: 'cancelled',
        sortBy: 'latest',
      }),
    );
  }, [dispatchStore, orderId, cancelOrderData, cancelOrderLoading]);

  useEffect(() => {
    if (getOrderDetailsData?.status) {
      const apiStatus = getOrderDetailsData.status;
      const lastStatus = apiStatus[apiStatus.length - 1];
      let filteredStatusList;
      // If the array contains only "processed", show all statuses except "cancelled"
      if (
        apiStatus.length === 1 &&
        lastStatus.orderStatus === OrderStatus.processed
      ) {
        filteredStatusList = Status.filter(
          item =>
            item.orderStatus !== OrderStatus.cancelled &&
            item.orderStatus !== OrderStatus.failed,
        );
      } else {
        // Handle the specific case where "completed" and "cancelled" statuses need to be mutually exclusive
        filteredStatusList = Status.filter(item => {
          if (
            lastStatus.orderStatus === OrderStatus.completed &&
            item.orderStatus === OrderStatus.cancelled
          ) {
            return false;
          }
          if (
            lastStatus.orderStatus === OrderStatus.cancelled &&
            item.orderStatus === OrderStatus.completed
          ) {
            return false;
          }
          return apiStatus.some(
            apiItem => apiItem.orderStatus === item.orderStatus,
          );
        });
      }
      const updatedStatusList = filteredStatusList.map(item => {
        let matchedStatus = apiStatus.find(
          apiItem => apiItem.orderStatus === item.orderStatus,
        );
        return {
          ...item,
          orderStatus: OrderStatusText[item.orderStatus], // Use the updated enum values
          date: matchedStatus
            ? moment(matchedStatus.date).format('HH:mm, MMMM Do, YYYY')
            : null,
          isHighlighted: matchedStatus
            ? matchedStatus.orderStatus === lastStatus.orderStatus
            : false,
        };
      });
      setUpdatedStatus(updatedStatusList);
      setIsFirstLoad(false);
    }
  }, [getOrderDetailsData]);

  const handleCancelOrder = () => {
    dispatchStore({
      type: CANCEL_ORDER,
      payload: {orderId: orderId},
    });
    setTimeout(() => {
      navigation.navigate('Cancelled', {
        cancelOrderBtn: true,
      });
    }, 1000);
  };

  const handleRefresh = () => {
    if (orderId) {
      setIsFirstLoad(false);
      setRefreshLoad(true);
      dispatchStore({
        type: GET_ORDER_DETAILS,
        payload: {orderId: orderId},
      });
    }
  };

  useEffect(() => {
    let intervalId: any;
    let checkStatus =
      getOrderDetailsData.currentStatus == OrderStatus.pending ||
      getOrderDetailsData.currentStatus == OrderStatus.processed ||
      getOrderDetailsData.currentStatus == OrderStatus.accepted ||
      getOrderDetailsData.currentStatus == OrderStatus.ready ||
      getOrderDetailsData.currentStatus == OrderStatus.pickedUp ||
      getOrderDetailsData.currentStatus == OrderStatus.onDelivery;

    if (orderId && checkStatus) {
      intervalId = setInterval(() => {
        handleRefresh();
      }, 5000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [orderId, getOrderDetailsData]);

  useEffect(() => {
    if (getOrderDetailsIsLoading) {
      setIsFirstLoad(true);
    }
  }, [getOrderDetailsIsLoading]);

  if (
    getOrderDetailsData.currentStatus === OrderStatus.completed &&
    !getOrderDetailsData.isReviewed &&
    !fromReviewScreen
  ) {
    setTimeout(() => {
      navigation.navigate(Route.RatingScreen, {
        storeData: getOrderDetailsData?.store,
        driverData: getOrderDetailsData?.driver,
        orderId: getOrderDetailsData?.id,
        products: getOrderDetailsData?.products,
      });
    }, 5000);
  }

  return (
    <View style={styles.mainContainer}>
      <CustomStatusBar backgroundColor={colors.darkGreen} />
      <CustomHeader
        title="ORDER DETAILS"
        titleColor={colors.white}
        containerBackgroundColor={colors.darkGreen}
        startButtonIconType="close"
      />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.select<
          'height' | 'position' | 'padding' | undefined
        >({
          ios: 'padding',
          android: undefined,
        })}>
        {isFirstLoad && !isRefreshLoad ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size={'large'} color={colors.darkGreen} />
          </View>
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={getOrderDetailsIsLoading && isFirstLoad}
                onRefresh={handleRefresh}
                tintColor={colors.green300}
              />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContentContainer}>
            {getOrderDetailsData.currentStatus !== 'pending' &&
            getOrderDetailsData.currentStatus !== 'completed' &&
            getOrderDetailsData.currentStatus !== 'cancelled' &&
            getOrderDetailsData.currentStatus !== 'failed' &&
            getOrderDetailsData.currentStatus !== 'pickedUp' &&
            getOrderDetailsData.currentStatus !== 'onDelivery' ? (
              <MapView
                draggable={false}
                zoomEnabled={false}
                orderDetails={getOrderDetailsData}
                containerStyle={styles.map}
                lat={getOrderDetailsData?.store?.address?.geometry?.latitude}
                lng={getOrderDetailsData?.store?.address?.geometry?.longitude}
              />
            ) : getOrderDetailsData.currentStatus == 'onDelivery' ? (
              <WebView
                source={{
                  uri: getOrderDetailsData?.onFleetDeliveryTaskTrackingURL,
                }}
                style={styles.map}
                javaScriptEnabled={true}
                injectedJavaScript={`
                  (function() {
                    var header = document.querySelector('a.mapBadge');
                    var footer = document.getElementById('trackingDetails')
                    if (header) {
                      header.style.display = 'none'; // Hides the element
                      header.parentNode.removeChild(header); // Removes the element completely
                      window.ReactNativeWebView.postMessage('Header removed successfully');
                    } else {
                      window.ReactNativeWebView.postMessage('Header not found');
                    }

                    if (footer) {
                      footer.style.display = 'none'; // Hides the element
                      footer.parentNode.removeChild(footer); // Removes the element completely
                      window.ReactNativeWebView.postMessage('footer removed successfully');
                    } else {
                      window.ReactNativeWebView.postMessage('footer not found');
                    }
                  })();
                `}
                onMessage={event => {
                  console.log('WebView message:', event.nativeEvent.data);
                }}
              />
            ) : (
              <View style={{height: vs(110)}}></View>
            )}

            <View
              style={[
                styles.container,
                {
                  marginTop:
                    getOrderDetailsData.currentStatus !== 'completed' &&
                    getOrderDetailsData.currentStatus !== 'cancelled' &&
                    getOrderDetailsData.currentStatus !== 'failed'
                      ? widthPercentageScale(-15)
                      : widthPercentageScale(-25),
                },
              ]}>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={[colors.darkGreen, colors.green500]}
                style={styles.linearGradient}>
                <View
                  style={{
                    flexDirection: 'row',
                    // justifyContent: 'space-',
                    alignItems: 'center',
                    padding: scale(12),
                    paddingLeft: scale(20),
                  }}>
                  <View style={{width: '70%'}}>
                    {getOrderDetailsData.currentStatus === 'completed' ? (
                      <CustomText
                        style={{marginBottom: 4}}
                        textColor={colors.yellow}
                        text={`Delivered in ${moment(
                          getOrderDetailsData.status[
                            getOrderDetailsData.status.length - 1
                          ].date,
                        ).diff(
                          moment(getOrderDetailsData.status[1].date),
                          'minutes',
                        )}mins`}
                        variant="text"
                      />
                    ) : null}
                    <CustomText
                      textColor={colors.white}
                      text={`Order: #${getOrderDetailsData?.orderNumber}`}
                      variant="h5"
                    />
                    {getOrderDetailsData.currentStatus !== 'completed' &&
                    getOrderDetailsData.currentStatus !== 'cancelled' &&
                    getOrderDetailsData.currentStatus !== 'failed' ? (
                      <CustomText
                        style={{marginLeft: -4, marginBottom: 0}}
                        textColor={colors.yellow}
                        text={`⚡ Estimated ${getOrderDetailsData?.deliveryDetails?.deliveryTime?.min} - ${getOrderDetailsData?.deliveryDetails?.deliveryTime?.max} mins`}
                        variant="text"
                      />
                    ) : null}

                    {getOrderDetailsData.currentStatus === 'completed' ||
                    getOrderDetailsData.currentStatus === 'cancelled' ||
                    getOrderDetailsData.currentStatus === 'failed' ? (
                      <CustomText
                        style={{marginTop: 4}}
                        textColor={colors.gray73}
                        text={moment(getOrderDetailsData.createdAt).format(
                          'HH:mm, MMMM Do, YYYY',
                        )}
                        variant="text"
                      />
                    ) : null}
                  </View>
                  <View style={{alignItems: 'center', width: '30%'}}>
                    {getOrderDetailsData.currentStatus === 'pending' ||
                    getOrderDetailsData.currentStatus === 'processed' ||
                    getOrderDetailsData.currentStatus === 'accepted' ? (
                      <CustomButton
                        onPress={() => {
                          setCancelOrderModal(true);
                        }}
                        text="Cancel Order"
                        style={{fontSize: 14}}
                        btnContainerStyle={styles.cancelBtn}
                      />
                    ) : null}
                  </View>

                  <CustomModal
                    isVisible={cancelOrderModal}
                    okBtnLoading={cancelOrderLoading}
                    onModalHide={() => setCancelOrderModal(false)}
                    title="Cancel Order"
                    onCancel={() => setCancelOrderModal(false)}
                    onOk={handleCancelOrder}>
                    <CustomText
                      variant="text"
                      text="Are you sure you want to cancel this order?"
                      style={styles.modalText}
                      textColor={colors.dark}
                    />
                  </CustomModal>
                </View>
              </LinearGradient>
              <View style={[styles.sectionContainer, {marginTop: vs(8)}]}>
                <CustomText
                  textColor={colors.darkGreen}
                  text="Order Status"
                  variant="h4"
                />

                {updatedStatus.map((item, index) => {
                  return (
                    <View
                      key={item.key}
                      style={{
                        ...styles.row,
                        marginTop:
                          item.key === 1 || item.key === 0 ? vs(12) : 0,
                        opacity: item.isHighlighted ? 1 : 0.6,
                      }}>
                      <View>
                        <Image style={styles.icon} source={item.icon} />
                        {index !== updatedStatus.length - 1 && (
                          <View
                            style={[styles.dotsContainer, {marginRight: 6}]}>
                            {[...Array(4)].map((_, index) => (
                              <View key={index} style={styles.dot} />
                            ))}
                          </View>
                        )}
                      </View>
                      <View style={{marginLeft: scale(6)}}>
                        <CustomText
                          style={{
                            fontWeight: '600',
                            marginTop: item.date ? 0 : 8,
                          }}
                          textColor={colors.darkGreen}
                          text={item.orderStatus}
                          variant="Figtree"
                        />
                        {item.date ? (
                          <CustomText
                            textColor={colors.dark}
                            text={item.date}
                            variant="small"
                          />
                        ) : null}
                      </View>
                    </View>
                  );
                })}
              </View>
              {getOrderDetailsData?.driver ? (
                <StoreContact
                  showCallIcon={
                    getOrderDetailsData.currentStatus === 'completed' ||
                    getOrderDetailsData.currentStatus === 'cancelled' ||
                    getOrderDetailsData.currentStatus === 'failed'
                      ? false
                      : true
                  }
                  SvgShowing={true}
                  logo={getOrderDetailsData?.driver?.imageUrl || User}
                  logoText={getOrderDetailsData?.driver?.firstName}
                  logoTextStyle="h4"
                  // logoStyle={styles.userIcon}
                  logoDesc="Delivery driver"
                  logoDescStyle="text"
                  handleIcon={() =>
                    Linking.openURL(`tel:${getOrderDetailsData?.driver?.phone}`)
                  }
                  onPress={() => {
                    navigation.navigate(Route.DriverProfile, {
                      driverData: getOrderDetailsData?.driver,
                      showButton:
                        getOrderDetailsData.currentStatus === 'completed' ||
                        getOrderDetailsData.currentStatus === 'cancelled' ||
                        getOrderDetailsData.currentStatus === 'failed'
                          ? false
                          : true,
                    });
                  }}
                />
              ) : null}

              {getOrderDetailsData.currentStatus === 'completed' &&
              getOrderDetailsData.isReviewed == false &&
              !fromReviewScreen ? (
                <YourExperience
                  title="Your Experience"
                  reportOnPress={() => {
                    navigation.navigate(Route.ChooseIssue, {
                      getOrderDetailsData,
                    });
                  }}
                  ratingOnPress={() => {
                    navigation.navigate(Route.RatingScreen, {
                      storeData: getOrderDetailsData?.store,
                      driverData: getOrderDetailsData?.driver,
                      orderId: getOrderDetailsData?.id,
                      products: getOrderDetailsData?.products,
                    });
                  }}
                />
              ) : (
                <StoreHelp
                  title="Need help?"
                  btnText="Report an Issue"
                  onPress={() => {
                    navigation.navigate(Route.ChooseIssue, {
                      orderId,
                    });
                  }}
                />
              )}

              <StoreAddress
                showTimer={false}
                deliveryAddress={`${getOrderDetailsData?.deliveryAddress?.street}, ${getOrderDetailsData?.deliveryAddress?.city}`}
                deliveryInstructions={getOrderDetailsData?.driverNotes}
              />
              {getOrderDetailsData?.paymentMethod ? (
                <View style={styles.sectionContainer}>
                  <CustomText
                    text="Payment Method"
                    variant="h4"
                    textColor={colors.darkGreen}
                  />
                  <CustomTouchableSVG
                    onPress={() => {}}
                    containerStyle={[styles.row]}>
                    <Image style={styles.icon} source={Visa} />
                    <View>
                      <CustomText
                        text={
                          getOrderDetailsData?.paymentMethod?.card?.cardBrand
                        }
                        variant="Figtree"
                        textColor={colors.darkGreen}
                      />
                      <CustomText
                        text={`**** **** **** ${getOrderDetailsData?.paymentMethod?.card?.last4}`}
                        variant="text"
                        textColor={colors.darkGreen}
                      />
                    </View>
                  </CustomTouchableSVG>
                </View>
              ) : getOrderDetailsData.isBankTransfer ? (
                <View style={styles.sectionContainer}>
                  <CustomText
                    text="Payment Method"
                    variant="h4"
                    textColor={colors.darkGreen}
                  />
                  <CustomTouchableSVG
                    onPress={() => {}}
                    containerStyle={[styles.row]}>
                    <View
                      style={{
                        backgroundColor: colors.primaryGreen,
                        height: 35,
                        width: 35,
                        borderRadius: 100,
                        justifyContent: 'center',
                        alignSelf: 'center',
                        alignItems: 'center',
                        marginRight: 13,
                      }}>
                      <MaterialCommunityIcons
                        color={colors.white}
                        size={20}
                        name="bank"
                      />
                    </View>
                    <View>
                      <CustomText
                        text={'Bank Transfer'}
                        variant="Figtree"
                        textColor={colors.darkGreen}
                      />
                      <CustomText
                        text={'Manually Bank Transfer'}
                        variant="text"
                        textColor={colors.darkGreen}
                      />
                    </View>
                  </CustomTouchableSVG>
                </View>
              ) : null}

              <View style={styles.sectionContainer}>
                <CustomText
                  text="Order Info"
                  variant="h4"
                  textColor={colors.darkGreen}
                />
                <View style={styles.newSection}>
                  {getOrderDetailsData.products?.map(
                    (
                      item: {
                        count: number;
                        subTotal: number;
                        productOptionValueIds: string[];
                        product: {
                          name: string;
                          price: number;
                          options: Array<{
                            name: string;
                            id: string;
                            values: Array<{
                              name: string;
                              id: string;
                              additionalPrice: number; // make sure this is part of the data structure
                            }>;
                          }>;
                        };
                      },
                      index: number,
                    ) => {
                      const groupedOptions = item.product.options.reduce(
                        (acc, option) => {
                          const matchingValues = option.values.filter(value =>
                            item.productOptionValueIds.includes(value.id),
                          );
                          if (matchingValues.length > 0) {
                            acc.push({
                              optionName: option.name,
                              values: matchingValues
                                .map(value => value.name)
                                .join(', '),
                            });
                          }
                          return acc;
                        },
                        [],
                      );
                      return (
                        <View
                          key={index}
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottomColor: colors.disabledFillColorLight,
                            borderBottomWidth: 1,
                            paddingVertical: 10,
                          }}>
                          <View style={{flexDirection: 'column'}}>
                            <CustomText
                              text={`${item?.count}x ${item?.product?.name}`}
                              variant="label"
                              style={{fontWeight: 800, fontSize: 18}}
                              textColor={colors.dark}
                            />
                            {groupedOptions.map((option, optionIndex) => (
                              <CustomText
                                style={{fontSize: 14}}
                                key={optionIndex}
                                text={`${option?.optionName} (${option.values})`}
                                variant="small"
                                textColor={colors.dark}
                              />
                            ))}
                          </View>

                          <CustomText
                            text={`${formatPrice(item?.subTotal)}`}
                            variant="label"
                            textColor={colors.darkGreen}
                          />
                        </View>
                      );
                    },
                  )}
                </View>

                {getOrderDetailsData?.paymentDetail
                  ? Object.keys(getOrderDetailsData?.paymentDetail)
                      .map(key => ({
                        title: keyMappings[key] || key,
                        price: getOrderDetailsData?.paymentDetail[key],
                      }))
                      .map(item => (
                        <PriceCard
                          key={item.id}
                          title={item?.title}
                          price={item.price}
                          titleStyle={
                            item?.title === 'Total'
                              ? {fontSize: 18, fontWeight: 800}
                              : null
                          }
                          priceStyle={
                            item?.title === 'Total'
                              ? {fontSize: 18, fontWeight: 800}
                              : null
                          }
                          containerStyle={styles.row}
                        />
                      ))
                  : ''}
                <CustomTouchableSVG
                  containerStyle={styles.receiptBtn}
                  onPress={() => {}}>
                  <CustomText
                    text="Download Receipt"
                    variant="Figtree"
                    textColor={colors.primaryGreen}
                  />
                  <AntDesign
                    name="download"
                    size={20}
                    color={colors.primaryGreen}
                  />
                </CustomTouchableSVG>
              </View>
            </View>
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};
export default OrderDetails;
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContentContainer: {
    flexGrow: 1,
  },
  container: {
    paddingHorizontal: scale(20),
    marginTop: widthPercentageScale(-25),
    marginBottom: 30,
  },
  linearGradient: {
    width: scale(310),
    gap: 5,
    borderRadius: moderateScale(8),
    alignSelf: 'center',
    // padding: scale(12),
    // paddingLeft: scale(20),
    shadowColor: '#000',
    shadowOffset: {width: 0.2, height: 0.2},
    shadowOpacity: 0.2,
    elevation: 4,
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  receiptBtn: {
    marginTop: vs(16),
    backgroundColor: colors.pantone,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(10),
    paddingVertical: vs(12),
    gap: 10,
  },
  sectionContainer: {
    backgroundColor: colors.white,
    marginTop: vs(14),
    padding: scale(14),
    borderRadius: moderateScale(14),
    borderWidth: 1,
    borderColor: colors.grey,
  },

  map: {height: vs(350)},

  userIcon: {
    width: scale(48),
    height: vs(48),
  },

  phone: {
    resizeMode: 'contain',
    width: scale(50),
    height: scale(50),
  },
  row: {
    flexDirection: 'row',
    marginTop: vs(8),
  },
  icon: {
    resizeMode: 'contain',
    width: scale(32),
    height: scale(32),
    marginRight: scale(5),
  },
  dotsContainer: {
    alignItems: 'center',
    marginVertical: vs(8),
  },
  dot: {
    width: 2,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.darkGreen,
    marginVertical: vs(2),
  },
  newSection: {
    marginVertical: scale(6),
    // borderBottomWidth: 1,
    paddingBottom: scale(6),
    // borderBottomColor: colors.disabledFillColorLight,
  },
  underSectionContainer: {
    paddingVertical: scale(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: colors.red500,
    paddingVertical: scale(8),
    borderRadius: moderateScale(8),
    minWidth: 100,
    minHeight: 40,
  },
  modalText: {
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: vs(10),
    paddingHorizontal: scale(10),
  },
});
