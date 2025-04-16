import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import {CustomText} from '../../shared/CustomText';
import {colors} from '../../../theme/colors';
import {CustomTouchableSVG} from '../../shared/CustomTouchableSVG';
import PlusSVG from 'assets/svg/PlusSVG';
import {moderateScale, scale, vs} from 'react-native-size-matters';
import {Route} from 'src/routes/Route';
import {useNavigation} from '@react-navigation/native';
import {appsFlyerTrackEvent, formatPrice} from 'src/utils';
import {useReduxSelector} from 'src/redux';
import {
  selectCurrentCartItem,
  selectProductAddToCartIsLoading,
} from 'src/redux/cart/selectors';
import {useDispatch} from 'react-redux';
import {
  CLEAR_CART_REQUEST,
  PRODUCT_ADD_TO_CART_REQUEST,
} from 'src/redux/cart/constants';
import {CustomModal} from 'src/components/shared/CustomModal';
import {widthPercentageScale} from 'src/theme/dimensions';
import {fontFamilies} from 'src/theme/textVariants';
import {setCreateAccountForm} from 'src/redux/user/slice';
import {selectUser} from 'src/redux/user/selectors';
import {LOGOUT} from 'src/redux/user/constants';
import Toast from 'react-native-toast-message';

const styles = StyleSheet.create<Styles>({
  mainContainer: {
    marginRight: widthPercentageScale(3),
    height: widthPercentageScale(40),
    width: widthPercentageScale(26),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  imageStyle: {
    borderRadius: Platform.OS === 'ios' ? moderateScale(15) : moderateScale(15),
    position: 'absolute',
    top: 0,
    height: widthPercentageScale(22),
    width: widthPercentageScale(26),
  },
  titleContainer: {
    gap: vs(3),
    position: 'absolute',
    top: widthPercentageScale(23.9),
  },
  title: {
    fontSize: moderateScale(15.5),
    lineHeight: moderateScale(15.07),
    textAlign: 'center',
    alignSelf: 'center',
  },
  price: {
    fontSize: moderateScale(14.5),
    textAlign: 'center',
    alignSelf: 'center',
    fontFamily: fontFamilies.semiBold,
  },
  addButton: {
    borderRadius: moderateScale(20),
    backgroundColor: colors.primaryGreen,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: widthPercentageScale(8),
    height: widthPercentageScale(8),
    right: vs(-5),
    bottom: scale(56),
  },
  addButtonText: {alignSelf: 'center', fontSize: moderateScale(14)},
  modalText: {
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: vs(10),
    paddingHorizontal: scale(10),
  },
});
export default function ProductCard({
  item,
  storeAddress,
  storeId,
  storeName,
  deliveryTime,
}: ProductCardProps) {
  const currentProductId = item?.id || item?._id;
  const navigation = useNavigation();
  const dispatchStore = useDispatch();
  const {
    user: {accessToken, isGuest},
  } = useReduxSelector(store => ({user: store.user}));
  const [alreadyAddedStore, setAlreadyAddedStore] = useState<boolean>(false);
  const [guestModal, setGuestModal] = useState<boolean>(false);
  const [shouldAddToCart, setShouldAddToCart] = useState<boolean>(false);
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);
  const user = useReduxSelector(selectUser);

  const {primaryAddress} = useReduxSelector(state => state.addresses);
  const currentCartItem = useReduxSelector(selectCurrentCartItem);
  const selectedCartItem = currentCartItem.find(
    (currentItem: any) =>
      currentProductId === currentItem?.productId &&
      deliveryTime === currentItem?.deliveryTime &&
      storeId === currentItem?.storeId,
  );

  const productAddToCartLoading = useReduxSelector(
    selectProductAddToCartIsLoading,
  );
  const handleAddToCart = useCallback(
    (count: number) => {
      setLoadingItemId(currentProductId);
      if (storeId !== currentCartItem[0]?.storeId && currentCartItem.length) {
        setAlreadyAddedStore(true);
        setLoadingItemId(null);
        return;
      }
      appsFlyerTrackEvent('af_add_to_cart', {
              af_content_id:  currentProductId,
              af_content_name:item?.name,
              af_price:  item?.price,
              af_quantity: count, 
            });
      dispatchStore({
        type: PRODUCT_ADD_TO_CART_REQUEST,
        payload: {
          productOptionValueIds: [],
          count,
          productId: currentProductId,
          storeId: storeId,
          deliveryAddress: primaryAddress,
        },
        price: item?.price,
        image: item?.images[0]?.originalUrl,
        name: item?.name,
        productExtraOptions: item.options,
        storeName: storeName,
        storeAddress: storeAddress || {},
        deliveryTime: deliveryTime,
      });
    },
    
    [
      currentProductId,
      storeAddress,
      currentCartItem,
      dispatchStore,
      storeId,
      primaryAddress,
      item?.price,
      item?.images,
      item?.name,
      item.options,
      storeName,
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
  return (
    <CustomTouchableSVG
      onPress={() =>
        navigation.navigate(Route.ProductDetails, {
          productId: currentProductId,
          storeId: storeId,
          deliveryTime: deliveryTime,
        })
      }
      containerStyle={styles.mainContainer}>
      <Image
        source={{uri: item?.images[0]?.originalUrl}}
        style={styles.imageStyle}
      />
      <View style={styles.titleContainer}>
        <CustomText
          text={item?.name}
          variant={'Figtree'}
          numberOfLines={2}
          textColor={colors.darkGreen}
          style={styles.title}
        />
        <CustomText
          text={formatPrice(item.price)}
          variant={'small'}
          textColor={colors.primaryGreen}
          style={styles.price}
        />
      </View>
      {currentProductId !== selectedCartItem?.productId ? (
        <CustomTouchableSVG
          onPress={() => {
            if (isGuest || user.email === '' || !user.email) {
              setGuestModal(true)
              return;
            } else if (!item?.availability) {
              Toast.show({
                type: 'info',
                text1: 'This store is closed right now',
                text2: "It's not possible to order at the moment",
              });
              return;
            }
            // Proceed with navigation or adding to cart if the user is logged in
            if (item.options?.length) {
              return navigation.navigate(Route.ProductDetails, {
                productId: currentProductId,
                storeId: storeId,
                deliveryTime: deliveryTime,
              });
            } else {
              return handleAddToCart(1);
            }
          }}
          containerStyle={styles.addButton}>
          {loadingItemId === currentProductId && productAddToCartLoading ? (
            <ActivityIndicator size={'small'} color={colors.white} />
          ) : (
            <PlusSVG />
          )}
        </CustomTouchableSVG>
      ) : (
        <View style={styles.addButton}>
          <CustomText
            text={selectedCartItem?.quantity}
            style={styles.addButtonText}
            textColor={colors.white}
          />
        </View>
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
        onOk={() => dispatchStore({type: LOGOUT})}>
        <CustomText
          variant="text"
          text="You need to login or create an account to add an item to the cart or view product details."
          style={styles.modalText}
        />
      </CustomModal>
    </CustomTouchableSVG>
  );
}
