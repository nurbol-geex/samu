import React, {useCallback, useEffect, useState, FC, useRef} from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import {CustomHeader} from 'src/components/shared/CustomHeader';
import {colors} from 'src/theme/colors';
import {moderateScale, scale, vs} from 'react-native-size-matters';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {CustomButton} from 'src/components/shared/CustomButton';
import CustomCount from 'src/components/pageSections/CustomCount';
import {CustomStatusBar} from 'src/components/shared/CustomStatusBar';
import {useDispatch, useSelector} from 'react-redux';
import {
  CLEAR_CART_REQUEST,
  PRODUCT_ADD_TO_CART_REQUEST,
  PRODUCT_UPDATE_CART_REQUEST,
  SAVE_LOCAL_CART,
} from 'src/redux/cart/constants';
import {GET_STORE_PRODUCT_DETAILS_REQUEST} from 'src/redux/home/constants';
import {RootState, useReduxSelector} from 'src/redux';
import {
  selectStoreProductDetails,
  selectStoreProductDetailsIsLoading,
} from 'src/redux/home/selectors';
import {
  selectCurrentCartItem,
  selectProductAddToCartIsLoading,
} from 'src/redux/cart/selectors';
import ProductDetailsHeader from 'src/components/pageSections/Products/ProductDetailsHeader';
import ProductExtraOptions from 'src/components/pageSections/Products/ProductExtraOptions';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import Share, {ShareOptions} from 'react-native-share';
import {CustomModal} from 'src/components/shared/CustomModal';
import {CustomText} from 'src/components/shared/CustomText';
import DeviceInfo from 'react-native-device-info';
import {showToast} from 'src/components/shared/CustomToast/toastUtils';
import {appsFlyerTrackEvent, logAnalyticsEvent} from 'src/utils';
import {ANALYTICS, LOGOUT} from 'src/redux/user/constants';
import {widthPercentageScale} from 'src/theme/dimensions';
import {setCreateAccountForm} from 'src/redux/user/slice';
import Toast from 'react-native-toast-message';
import appsFlyer from 'react-native-appsflyer';

const ProductDetails: FC<ProductDetailsProps> = ({route}) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const dispatch = useDispatch<any>();
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const user = useReduxSelector(state => state.user);
  const {
    user: {accessToken, isGuest},
  } = useReduxSelector(store => ({user: store.user}));
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [alreadyAddedStore, setAlreadyAddedStore] = useState<boolean>(false);
  const [shouldAddToCart, setShouldAddToCart] = useState<boolean>(false);
  const [guestModal, setGuestModal] = useState(false);
  const storeProductDetailsData = useReduxSelector(selectStoreProductDetails);
  const storeProductDetailsDataLoading = useReduxSelector(
    selectStoreProductDetailsIsLoading,
  );
  const productAddToCartLoading = useReduxSelector(
    selectProductAddToCartIsLoading,
  );
  const currentCartItem = useReduxSelector(selectCurrentCartItem);
  const selectedCartItem = currentCartItem.find(
    (item: {productId: string; storeId: string; deliveryTime: string}) =>
      item?.productId === route?.params?.productId &&
      item?.storeId === route?.params?.storeId,
  );
  let storeName = storeProductDetailsData?.stores?.find(
    (store: {id: string}) => store.id === route.params.storeId,
  );
  const storeId = route?.params?.storeId;
  const deliveryTime = route?.params?.deliveryTime;
  const dispatchStore = useDispatch();

  const {primaryAddress} = useSelector((state: RootState) => state.addresses);

  const onSearchAnalytics = productId => {
    logAnalyticsEvent('addingToCart', {productId: route?.params?.productId});
    dispatch({
      type: ANALYTICS,
      payload: {
        eventType: 'addToCart', // Specify the event type here
        data: {
          productId: route?.params?.productId,
          userId: user.email,
          sessionId: accessToken,
        },
      },
    });
  };
  useEffect(() => {
    appsFlyerTrackEvent('af_content_view', {
      af_content_id: route?.params?.productId,
      af_content_name: storeProductDetailsData?.name,
      af_price: storeProductDetailsData?.price,
    });

    if (route?.params?.productId) {
      onSearchAnalytics(route?.params?.productId);
    }
  }, [route?.params?.productId]);

  useEffect(() => {
    if (selectedCartItem) {
      setSelectedOptions(selectedCartItem.productOptionValueIds || []);
    }
  }, [selectedCartItem]);
  useEffect(() => {
    dispatch({
      type: GET_STORE_PRODUCT_DETAILS_REQUEST,
      payload: {productId: route?.params?.productId},
    });
  }, [route?.params?.productId, dispatch]);

  const validateOptions = useCallback((): boolean => {
    if (!storeProductDetailsData) {
      return false;
    }
    for (const option of storeProductDetailsData.options) {
      const selected = selectedOptions.filter(id =>
        option.values.some(value => value.id === id),
      );
      if (selected.length < option.min) {
        showToast(
          'error',
          `Please select at least ${option.min} options for ${option.name}`,
        );
        return false;
      }
    }
    return true;
  }, [storeProductDetailsData, selectedOptions]);
  const handleRemoveFromCart = useCallback(() => {
    dispatch({
      type: SAVE_LOCAL_CART,
      payload: {
        storeId: route?.params?.storeId,
        productId: route?.params?.productId,
        quantity: 0,
        price: 0,
        image: '',
        name: '',
        productOptionValueIds: [],
        cartProductItemId: '',
        cartId: '',
        productExtraOptions: [],
        deliveryAddress: {},
        storeName: '',
        storeAddress: {},
        deliveryTime,
      },
    });
    dispatch({
      type: PRODUCT_UPDATE_CART_REQUEST,
      payload: {},
      productCartId: selectedCartItem?.cartProductItemId,
      productRemove: true,
    });
  }, [dispatch, route?.params, selectedCartItem?.cartProductItemId]);

  const dispatchUpdateCart = useCallback(
    (
      count: number,
      selectedIds: string[],
      cartProductItemId: string,
      cartId: string,
      productExtraOptions: [],
    ) => {
      dispatch({
        type: SAVE_LOCAL_CART,
        payload: {
          storeId: route?.params?.storeId,
          productId: route?.params?.productId,
          quantity: count,
          price: storeProductDetailsData?.price,
          image: storeProductDetailsData?.images[0]?.originalUrl,
          name: storeProductDetailsData?.name,
          productOptionValueIds: selectedIds,
          cartProductItemId: cartProductItemId,
          cartId: cartId,
          productExtraOptions: productExtraOptions,
          deliveryAddress: primaryAddress,
          storeName: storeName.name,
          storeAddress: storeName.address,
          deliveryTime:
            deliveryTime?.deliveryTimeAndCostDetails?.[0]?.deliveryTime,
        },
      });
    },
    [
      dispatch,
      route?.params,
      storeName,
      storeProductDetailsData,
      primaryAddress,
    ],
  );
  const handleAddToCart = useCallback(
    (count: number) => {
      logAnalyticsEvent('productId', {productId: route?.params?.productId});
      dispatch({
        type: ANALYTICS,
        payload: {
          eventType: 'addToCart', // Specify the event type here
          data: {
            productId: route?.params?.productId,
            quantity: count,
            userId: user.email,
            sessionId: accessToken,
          },
        },
      });

      appsFlyerTrackEvent('af_add_to_cart', {
        af_content_id: route?.params?.productId,
        af_content_name: storeProductDetailsData?.name,
        af_price: storeProductDetailsData?.price,
        af_quantity: count,
      });

      if (
        route?.params?.storeId !== currentCartItem[0]?.storeId &&
        currentCartItem.length
      ) {
        setAlreadyAddedStore(true);
        return;
      }
      if (!validateOptions()) {
        return;
      }
      const payload = {
        productOptionValueIds: selectedOptions,
        count,
      };

      if (selectedCartItem) {
        dispatch({
          type: PRODUCT_UPDATE_CART_REQUEST,
          payload,
          productCartId: selectedCartItem.cartProductItemId,
        });
      } else {
        dispatch({
          type: PRODUCT_ADD_TO_CART_REQUEST,
          payload: {
            ...payload,
            productId: route?.params?.productId,
            storeId: route?.params?.storeId,
            deliveryAddress: primaryAddress,
          },
          price: storeProductDetailsData?.price,
          image: storeProductDetailsData?.images[0]?.originalUrl,
          name: storeProductDetailsData?.name,
          productExtraOptions: storeProductDetailsData.options,
          storeName: storeName.name,
          storeAddress: storeName.address,
          deliveryTime:
            deliveryTime?.deliveryTimeAndCostDetails?.[0]?.deliveryTime,
        });
      }
    },

    [
      dispatch,
      validateOptions,
      selectedOptions,
      route?.params,
      storeProductDetailsData,
      selectedCartItem,
      currentCartItem,
      primaryAddress,
      storeName,
    ],
  );

  const decreaseCartHandler = useCallback(
    (count: number) => {
      dispatch({
        type: PRODUCT_UPDATE_CART_REQUEST,
        payload: {
          productOptionValueIds: selectedOptions,
          count,
        },
        productCartId: selectedCartItem?.cartProductItemId,
      });
    },
    [dispatch, selectedOptions, selectedCartItem?.cartProductItemId],
  );

  const handleDebounce = useCallback(
    (count: number, type: string) => {
      if (!validateOptions()) {
        return;
      }

      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      if (count < 1 && type === 'dec') {
        handleRemoveFromCart();
        return;
      }

      if (selectedCartItem) {
        dispatchUpdateCart(
          count,
          selectedOptions,
          selectedCartItem.cartProductItemId,
          selectedCartItem?.cartId,
          selectedCartItem?.productExtraOptions,
        );
      }

      debounceTimeout.current = setTimeout(() => {
        if (type === 'inc') {
          handleAddToCart(count);
        } else if (type === 'dec') {
          decreaseCartHandler(count);
        }
      }, 500);
    },
    [
      selectedOptions,
      validateOptions,
      handleRemoveFromCart,
      dispatchUpdateCart,
      handleAddToCart,
      decreaseCartHandler,
      selectedCartItem,
    ],
  );
  const handleSelect = useCallback(
    (optionId: string, valueId: string) => {
      const option = storeProductDetailsData?.options.find(
        opt => opt.id === optionId,
      );

      if (!option) {
        return;
      }

      setSelectedOptions(prev => {
        if (option.type === 'single') {
          // For single type, replace any existing value for this option with the new value
          const updatedOptions = prev.filter(
            id => !option.values.some(value => value.id === id),
          );
          if (!prev.includes(valueId)) {
            updatedOptions.push(valueId);
          }
          return updatedOptions;
        } else if (option.type === 'multiple') {
          // For multiple type, add or remove the value, respecting the max limit
          if (prev.includes(valueId)) {
            return prev.filter(id => id !== valueId);
          } else {
            const selectedForOption = prev.filter(id =>
              option.values.some(value => value.id === id),
            );
            if (selectedForOption.length < option.max) {
              return [...prev, valueId];
            } else {
              Alert.alert(
                'Error',
                `You can only select up to ${option.max} items`,
              );
              return prev;
            }
          }
        }
        return prev;
      });
    },
    [storeProductDetailsData],
  );

  const shareProduct = async () => {
    const hasNotch = DeviceInfo.hasNotch();

    const storeId = route?.params?.storeId;
    const productId = route?.params?.productId;
    const shareOptions: ShareOptions = {
      title: 'Share this product',
      message: 'Created by the samu app',
      url: `samuapp://product/${productId}?storeId=${storeId}`,
    };
    try {
      const response = await Share.open(shareOptions);
      if (__DEV__) {
        console.log({response});
      }
    } catch (error: any) {
      if (error.message === 'User did not share') {
        return;
      }
    }
  };
  const handleClearCart = () => {
    dispatch({
      type: CLEAR_CART_REQUEST,
      payload: {
        cartId: currentCartItem[0]?.cartId,
        storeId: route?.params?.storeId,
      },
      getResponse: (message: string) => {
        if (message === 'Successfully removed.') {
          setAlreadyAddedStore(false);
          setShouldAddToCart(true);
        }
      },
    });
  };

  useEffect(() => {
    if (shouldAddToCart && currentCartItem.length === 0) {
      handleAddToCart(1);
      setShouldAddToCart(false);
    }
  }, [shouldAddToCart, currentCartItem, handleAddToCart]);
  if (storeProductDetailsDataLoading) {
    return (
      <View style={styles.listEmpty}>
        <ActivityIndicator size="large" color={colors.primaryGreen} />
      </View>
    );
  }
  const arraysHaveSameElements = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
      return false;
    }
    const sortedArr1 = [...arr1].sort();
    const sortedArr2 = [...arr2].sort();
    return sortedArr1.every((value, index) => value === sortedArr2[index]);
  };

  const isUpdatingCart = !arraysHaveSameElements(
    selectedCartItem?.productOptionValueIds || [],
    selectedOptions,
  );
  return (
    <View style={styles.container}>
      <CustomStatusBar backgroundColor={colors.primaryGreen} />
      <CustomHeader
        title="PRODUCT INFO"
        titleColor={colors.white}
        containerBackgroundColor={colors.primaryGreen}
        startButtonIconType="back"
        endButtonIconType="share"
        shareHandler={shareProduct}
        handleBack={() => {
          navigation.goBack();
          // navigation.navigate('StoreDetails', {
          //   storeId: route?.params?.storeId,
          // });
        }}
      />
      <FlatList
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <ProductDetailsHeader
              storeProductDetailsData={storeProductDetailsData}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
            />
            {storeProductDetailsData?.options?.length > 0 ? (
              <View style={styles.addContainer}>
                <CustomText
                  text={`Add to your ${storeProductDetailsData?.name}`}
                  variant="h4"
                  textColor={colors.darkGreen}
                />
                <CustomText
                  text="You may select additional options from here"
                  variant="text"
                  textColor={colors.dark}
                />
              </View>
            ) : null}
          </View>
        }
        data={storeProductDetailsData?.options || []}
        renderItem={({item}) => {
          const availableOptions = item.values.filter(
            value => !value.unavailableStoreIds.includes(storeId),
          );
          return availableOptions.length > 0 ? (
            <ProductExtraOptions
              item={{...item, values: availableOptions}} // Pass only available options to ProductExtraOptions
              selectedOptions={selectedOptions}
              handleSelect={handleSelect}
            />
          ) : null;
        }}
        keyExtractor={item => item.id}
      />
      <View style={styles.modalContent}>
        {productAddToCartLoading ? (
          <ActivityIndicator size="large" color={colors.primaryGreen} />
        ) : selectedCartItem?.quantity >= 1 ? (
          <>
            <CustomCount
              containerStyle={styles.countContainer}
              productCount={selectedCartItem?.quantity}
              buttonStyle={{padding: 5, width: vs(30), alignItems: 'center'}}
              increaseCartHandler={() =>
                handleDebounce(selectedCartItem?.quantity + 1, 'inc')
              }
              decreaseCartHandler={() =>
                handleDebounce(
                  selectedCartItem?.quantity > 1
                    ? selectedCartItem?.quantity - 1
                    : 0,
                  'dec',
                )
              }
            />
            <CustomButton
              text={isUpdatingCart ? 'Update & Checkout' : 'Review & Checkout'} // Dynamically change text
              btnContainerStyle={styles.addButtonModal}
              onPress={() => {
                if (isUpdatingCart) {
                  dispatchUpdateCart(
                    selectedCartItem?.quantity,
                    selectedOptions,
                    selectedCartItem.cartProductItemId,
                    selectedCartItem?.cartId,
                    selectedCartItem?.productExtraOptions,
                  );
                  handleAddToCart(1); // Update the cart if needed
                  navigation.navigate('Basket', {goToCart: true});
                } else {
                  navigation.navigate('Basket', {goToCart: true});
                }
              }}
            />
          </>
        ) : (
          <CustomButton
            text="Add to Basket"
            IconComponent={
              <FontAwesome5 name="plus" size={15} color={colors.white} />
            }
            btnContainerStyle={styles.addButtonModal}
            onPress={() => {
              if (isGuest || user.email === '' || !user.email) {
                setGuestModal(true);
                return;
              } else if (!storeName?.availability) {
                Toast.show({
                  type: 'info',
                  text1: 'This store is closed right now',
                  text2: "It's not possible to order at the moment",
                });
                return;
              }
              handleAddToCart(1); // Add the product to the cart
            }}
          />
        )}
      </View>
      <CustomModal
        isVisible={alreadyAddedStore}
        onModalHide={() => setAlreadyAddedStore(false)}
        title="Warning"
        onCancel={() => setAlreadyAddedStore(false)}
        onOk={handleClearCart}>
        <CustomText
          variant="text"
          text="Your basket has a product from another store, do you wish to remove it and add this product?"
          style={styles.modalText}
          textColor={colors.dark}
        />
      </CustomModal>
      <CustomModal
        isVisible={guestModal}
        onModalHide={() => setGuestModal(false)}
        title={'Login / Create Account'}
        onCancel={() => setGuestModal(false)}
        okBtnColor={colors.darkGreen}
        onOk={() => dispatchStore({type: LOGOUT})}>
        <CustomText
          variant="text"
          text="You need to login or create an account to add an item to the cart or view product details."
          style={styles.modalText}
        />
      </CustomModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  modalContent: {
    backgroundColor: colors.white,
    alignItems: 'center',
    gap: vs(12),
    borderTopRightRadius: moderateScale(20),
    borderTopLeftRadius: moderateScale(20),
    shadowColor: '#000',
    shadowOffset: {width: 0.2, height: 0.2},
    shadowOpacity: 0.1,
    paddingTop: vs(15),
    paddingBottom: vs(20),
  },
  addButtonModal: {
    width: scale(300),
  },
  listEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: vs(10),
    paddingHorizontal: scale(10),
  },
  countContainer: {
    borderWidth: 1,
    borderColor: colors.grey,
    height: 48,
    width: widthPercentageScale(34),
    paddingHorizontal: 4,
  },
  addContainer: {
    gap: vs(6),
    paddingTop: vs(20),
    backgroundColor: colors.disabledFillColorLight,
    paddingLeft: scale(14),
  },
});

export default ProductDetails;
