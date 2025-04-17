import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Alert, Image, StyleSheet, View} from 'react-native';
import {
  moderateScale,
  scale,
  verticalScale,
  vs,
} from 'react-native-size-matters';
import {CustomText} from 'src/components/shared/CustomText';
import {colors} from 'src/theme/colors';
import {CustomTouchableSVG} from 'src/components/shared/CustomTouchableSVG';
import PlusSVG from 'assets/svg/PlusSVG';
import {Route} from 'src/routes/Route';
import {appsFlyerTrackEvent, formatPrice } from 'src/utils';
import {useDispatch} from 'react-redux';
import {
  CLEAR_CART_REQUEST,
  PRODUCT_ADD_TO_CART_REQUEST,
  PRODUCT_UPDATE_CART_REQUEST,
  SAVE_LOCAL_CART,
} from 'src/redux/cart/constants';
import {useReduxSelector} from 'src/redux';
import {
  selectCurrentCartItem,
  selectProductAddToCartIsLoading,
} from 'src/redux/cart/selectors';
import {CustomModal} from 'src/components/shared/CustomModal';
import CustomCount from '../CustomCount';
import {ANALYTICS, LOGOUT} from 'src/redux/user/constants';
import {widthPercentageScale} from 'src/theme/dimensions';
import {setCreateAccountForm} from 'src/redux/user/slice';
import Toast from 'react-native-toast-message';
import { useAnalytics } from 'src/segmentService';
import { current } from '@reduxjs/toolkit';

const StoreProducts: React.FC<StoreProductsProps> = ({
  item,
  navigation,
  storeId,
  storeDetailsData,
}) => {
  const dispatchStore = useDispatch();
  const currentId = item?.id || item?._id;
  const [alreadyAddedStore, setAlreadyAddedStore] = useState<boolean>(false);
  const [shouldAddToCart, setShouldAddToCart] = useState<boolean>(false);
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);
  const [guestModal, setGuestModal] = useState(false)
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const {primaryAddress} = useReduxSelector(state => state.addresses);
  const currentCartItem = useReduxSelector(selectCurrentCartItem);
  const selectedCartItem = currentCartItem.find(
    (currentItem: {productId: string; storeId: string}) =>
      currentId === currentItem?.productId && currentItem?.storeId === storeId,
  );

  const [showCustomCount, setShowCustomCount] = useState(false); // Initially show CustomCount
  const user = useReduxSelector(state => state.user);
  const {
    user: {accessToken, isGuest},
  } = useReduxSelector(store => ({user: store.user}));
  const productAddToCartLoading = useReduxSelector(
    selectProductAddToCartIsLoading,
  );

  const timerRef: React.MutableRefObject<null | any> = useRef(null);

  const { track } = useAnalytics()

  useEffect(() => {
    if (showCustomCount) {
      if (timerRef.current) {
        clearTimeout(timerRef.current); // Purana timer clear karein
      }

      timerRef.current = setTimeout(() => {
        setShowCustomCount(false); // 5 seconds baad CustomCount ko hide karen
      }, 5000);

      return () => clearTimeout(timerRef.current); // Cleanup timer jab component unmount ho
    }
  }, [showCustomCount]);
  const handleAddToCart = useCallback(
    (count: number) => {
      setLoadingItemId(currentId);
      if (storeId !== currentCartItem[0]?.storeId && currentCartItem.length) {
        setAlreadyAddedStore(true);
        setLoadingItemId(null);
        return;
      }
      appsFlyerTrackEvent('af_add_to_cart', {
        af_content_id:   currentId,
        af_content_name:  item?.name,
        af_price:item?.price,
        af_quantity: count, 
      });

      dispatchStore({
        type: PRODUCT_ADD_TO_CART_REQUEST,
        payload: {
          productOptionValueIds: [],
          count,
          productId: currentId,
          storeId: storeId,
          storeName: storeDetailsData?.store?.name,
          deliveryAddress: primaryAddress,
        },
        price: item?.price,
        image: item?.images[0]?.originalUrl,
        name: item?.name,
        productExtraOptions: item.options,
        storeName: storeDetailsData?.store?.name,
        storeAddress: storeDetailsData?.store?.address,
        deliveryTime:
          storeDetailsData?.deliveryTimeAndCostDetails[0]?.deliveryTime,
      });
    },
    [
      storeId,
      currentCartItem,
      dispatchStore,
      currentId,
      item?.price,
      item?.images,
      item?.name,
      item.options,
      storeDetailsData,
      primaryAddress,
    ],
  );

  const handleClearCart = () => {
    dispatchStore({
      type: CLEAR_CART_REQUEST,
      payload: {
        cartId: currentCartItem[0]?.cartId,
        storeId: storeId,
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

  const handleRemoveFromCart = useCallback(() => {
    dispatchStore({
      type: SAVE_LOCAL_CART,
      payload: {
        storeId: currentCartItem[0]?.storeId,
        productId: currentId,
        quantity: 0,
        name: '',
        image: '',
        price: 0,
        productOptionValueIds: [],
        cartProductItemId: '',
        cartId: '',
        productExtraOptions: [],
        deliveryAddress: {},
        storeName: '',
        storeAddress: {},
        deliveryTime:
          storeDetailsData?.deliveryTimeAndCostDetails[0]?.deliveryTime,
      },
    });
    dispatchStore({
      type: PRODUCT_UPDATE_CART_REQUEST,
      payload: {},
      productCartId: selectedCartItem?.cartProductItemId,
      productRemove: true,
    });
  }, [dispatchStore, currentCartItem, selectedCartItem]);

  const dispatchUpdateCart = useCallback(
    (count: number) => {
      dispatchStore({
        type: SAVE_LOCAL_CART,
        payload: {
          storeId: currentCartItem[0]?.storeId,
          productId: currentId,
          quantity: count,
          name: item?.name,
          image: item?.images[0]?.originalUrl,
          price: item?.price,
          productOptionValueIds: [],
          cartProductItemId: selectedCartItem?.cartProductItemId,
          cartId: selectedCartItem?.cartId,
          productExtraOptions: selectedCartItem?.productExtraOptions,
          deliveryAddress: primaryAddress,
          storeName: storeDetailsData?.store?.name,
          storeAddress: storeDetailsData?.store?.address,
          deliveryTime:
            storeDetailsData?.deliveryTimeAndCostDetails[0]?.deliveryTime,
        },
      });
      debounceTimeout.current = setTimeout(() => {
        dispatchStore({
          type: PRODUCT_UPDATE_CART_REQUEST,
          payload: {count},
          productCartId: selectedCartItem?.cartProductItemId,
        });
      }, 500);
    },
    [dispatchStore, currentCartItem, selectedCartItem],
  );

  const handleDebounce = useCallback(
    (count: number, type: 'inc' | 'dec') => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      if (count < 1 && type === 'dec') {
        setShowCustomCount(false); // Count hide karen
        handleRemoveFromCart(); // Cart se item remove karein
        return;
      }

      setShowCustomCount(true); // Custom count show karen

      // Reset the timer when count changes
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        setShowCustomCount(false); // Reset timer jab increase/decrease ho
      }, 5000);

      dispatchUpdateCart(count); // Async cart update karein
    },
    [handleRemoveFromCart, dispatchUpdateCart],
  );

  const handleIncrease = useCallback(() => {
    // NEW ANALYTICS START
    track("Added to card", { productId: currentId })

    dispatchStore({
      type: ANALYTICS,
      payload: {
        eventType: 'addToCart', 
        data: {
          productId: currentId,
          userId: user.email,
          sessionId: accessToken,
        },
      },
    });

    handleDebounce(selectedCartItem?.quantity + 1, 'inc');
  }, [handleDebounce, selectedCartItem?.quantity]);

  const handleDecrease = useCallback(
    (remove?: boolean) => {
      if (remove) {
        handleDebounce(0, 'dec');
      } else {
        handleDebounce(
          selectedCartItem?.quantity > 1 ? selectedCartItem?.quantity - 1 : 0,
          'dec',
        );
      }
    },
    [handleDebounce, selectedCartItem?.quantity],
  );

  const handleQuantityContainer = () => {};

  return (
    <View style={styles.popularItemsContainer}>
      <CustomTouchableSVG
        onPress={() => {
          navigation.navigate(Route.ProductDetails, {
            productId: currentId,
            storeId: storeId,
            deliveryTime: storeDetailsData,
          });
        }}
        containerStyle={styles.popularItemCard}>
        <View style={styles.popularItemDescription}>
          <CustomText
            text={item?.name}
            style={{fontSize: 16, fontWeight: '600'}}
            textColor={colors.darkGreen}
          />
          <CustomText
            numberOfLines={3}
            text={item?.description}
            variant="small"
            textColor={colors.dark}
            style={styles.cardText}
          />
          <CustomText
            text={formatPrice(item.price)}
            variant="small"
            textColor={colors.primaryGreen}
          />
        </View>
        <Image
          style={styles.popularItemImage}
          resizeMode="cover"
          source={{uri: item?.images[0]?.originalUrl}}
        />
      </CustomTouchableSVG>
      {currentId !== selectedCartItem?.productId ? (
        <CustomTouchableSVG
          onPress={() => {
            if (!storeDetailsData?.store?.availability) {
              Toast.show({
                type: 'info',
                text1: 'This store is closed right now',
                text2: "It's not possible to order at the moment",
              });
              return;
            }
            if (isGuest || user.email === '' || !user.email) {
             setGuestModal(true)
              return;
            }

            if (item?.options?.length) {
              navigation.navigate(Route.ProductDetails, {
                productId: currentId,
                storeId: storeId,
                deliveryTime: storeDetailsData,
              });
            } else {
              handleAddToCart(1);
            }

            setShowCustomCount(true);
            if (!isGuest || user.email === '' || !user.email) {
              // Logging analytics event
              track('Added to cart', {productId: currentId});

              // Dispatching analytics action

              dispatchStore({
                type: ANALYTICS,
                payload: {
                  eventType: 'addToCart', // Specify the event type
                  data: {
                    userId: user.email,
                    productId: currentId,
                    sessionId: accessToken,
                  },
                },
              });
            }
          }}
          containerStyle={styles.addButton}>
          {loadingItemId === currentId && productAddToCartLoading ? (
            <ActivityIndicator size={'small'} color={colors.white} />
          ) : (
            
            <PlusSVG />
          )}
        </CustomTouchableSVG>
      ) : (
        <CustomTouchableSVG
          onPress={() => setShowCustomCount(true)}
          containerStyle={[
            styles.addButton,
            // {opacity: showCustomCount ? 0 : 1}, // Set opacity based on showCustomCount
          ]}>
          {showCustomCount ? (
            <CustomCount
              productCount={selectedCartItem?.quantity}
              increaseCartHandler={handleIncrease}
              decreaseCartHandler={() => handleDecrease(false)}
              containerStyle={styles.countContainer}
            />
          ) : null}
          <CustomText
            text={selectedCartItem?.quantity}
            style={styles.addButtonText}
            textColor={colors.white}
          />
        </CustomTouchableSVG>
      )}
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
                    onOk={()=> dispatchStore({type: LOGOUT})}>
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
  popularItemsContainer: {
    marginTop: vs(5),
    paddingHorizontal: scale(15),
    gap: vs(8),
  },
  popularItemCard: {
    borderWidth: 1,
    borderColor: colors.disabledFillColorLight,
    borderRadius: moderateScale(7.5),
    backgroundColor: colors.disabledFillColorLight,
    flexDirection: 'row',
    shadowColor: colors.darkGray,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  popularItemDescription: {
    gap: vs(8),
    width: '70%',
    padding: scale(10),
  },
  popularItemImage: {
    borderTopRightRadius: moderateScale(7.5),
    borderBottomRightRadius: moderateScale(7.5),
    height: '100%',
    width: '30%',
  },
  addButton: {
    borderRadius: 100,
    backgroundColor: colors.primaryGreen,
    position: 'absolute',
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    right: 24,
    bottom: 16,
  },
  addButtonText: {
    alignSelf: 'center',
    top: 3,
    height: verticalScale(18),
    width: scale(20),
    textAlign: 'center',
    alignItems: 'center',
  },
  cardText: {
    fontSize: moderateScale(12),
  },
  modalText: {
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: vs(10),
    paddingHorizontal: scale(10),
  },
  countContainer: {
    width: scale(90),
    right: widthPercentageScale(8.4),
    height: 38,
    top: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0.2, height: 0.2},
    shadowOpacity: 0.1,
  },
  count: {
    position: 'absolute',
    right: scale(-18),
  },
});

export default StoreProducts;
