import React, {useRef, useCallback} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {CustomText} from 'src/components/shared/CustomText';
import {CustomTouchableSVG} from 'src/components/shared/CustomTouchableSVG';
import CustomCount from '../CustomCount/index';
import {moderateScale, scale, vs} from 'react-native-size-matters';
import {colors} from 'src/theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  SAVE_LOCAL_CART,
  PRODUCT_UPDATE_CART_REQUEST,
} from 'src/redux/cart/constants';
import {useDispatch} from 'react-redux';
import {formatPrice } from 'src/utils';
import {useNavigation} from '@react-navigation/native';
import {Route} from 'src/routes/Route';
import { useReduxSelector } from 'src/redux';
import { ANALYTICS } from 'src/redux/user/constants';
import { useAnalytics } from 'src/segmentService';

const BasketCard: React.FC<BasketCardProps> = ({item, isBorderLess = true}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const user = useReduxSelector(state => state.user);
  const {
    user: {accessToken, isGuest},
  } = useReduxSelector(store => ({user: store.user}));
  const { track } = useAnalytics()
  const handleRemoveFromCart = useCallback(() => {
    dispatch({
      type: SAVE_LOCAL_CART,
      payload: {
        storeId: item?.storeId,
        productId: item?.productId,
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
      },
    });
    dispatch({
      type: PRODUCT_UPDATE_CART_REQUEST,
      payload: {},
      productCartId: item.cartProductItemId,
      productRemove: true,
    });
  }, [dispatch, item]);
  const dispatchUpdateCart = useCallback(
    (count: number) => {
      dispatch({
        type: SAVE_LOCAL_CART,
        payload: {
          storeId: item?.storeId,
          productId: item?.productId,
          quantity: count,
          name: item?.name,
          image: item?.image,
          price: item?.price,
          productOptionValueIds: item?.productOptionValueIds,
          cartProductItemId: item?.cartProductItemId,
          cartId: item?.cartId,
          productExtraOptions: item?.productExtraOptions,
          deliveryAddress: item?.deliveryAddress,
          storeName: item?.storeName,
          storeAddress: item?.storeAddress,
          deliveryTime: item?.deliveryTime,
        },
      });
      debounceTimeout.current = setTimeout(() => {
        dispatch({
          type: PRODUCT_UPDATE_CART_REQUEST,
          payload: {count},
          productCartId: item?.cartProductItemId,
        });
      }, 500);
    },
    [dispatch, item],
  );

  const handleDebounce = useCallback(
    (count: number, type: 'inc' | 'dec') => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      if (count < 1 && type === 'dec') {
        handleRemoveFromCart();
        return;
      }

      dispatchUpdateCart(count);
    },
    [handleRemoveFromCart, dispatchUpdateCart],
  );

  const handleIncrease = useCallback(() => {

    track('Added to cart', {productId: item?.productId,});
    dispatch({
      type: ANALYTICS,
      payload: {
        eventType: 'addToCart', // Specify the event type here
        data: {
          productId: item?.productId,
          userId: user.email,
          sessionId: accessToken,
        },
      },
    });



    handleDebounce(item?.quantity + 1, 'inc');
  }, [handleDebounce, item?.quantity]);

  const handleDecrease = useCallback(
    (remove?: boolean) => {
      if (remove) {
        handleDebounce(0, 'dec');
      } else {
        handleDebounce(item?.quantity > 1 ? item?.quantity - 1 : 0, 'dec');
      }
    },
    [handleDebounce, item?.quantity],
  );

  const productExtraOptionsData = item?.productExtraOptions
    .map((option: any) => {
      const filteredValues = option?.values.filter((value: any) =>
        item?.productOptionValueIds.includes(value.id),
      );
      return {...option, values: filteredValues};
    })
    .filter(option => option.values.length > 0);

  const additionalPrice = productExtraOptionsData?.reduce(
    (total: number, option: any) => {
      return (
        total +
        option.values.reduce((optionTotal: number, value: any) => {
          // Add the additional price for each selected value
          return optionTotal + (value.additionalPrice || 0);
        }, 0)
      );
    },
    0,
  );
  // const totalPrice = item?.price * item?.quantity + additionalPrice;
  const totalPrice = (item?.price + additionalPrice) * Number(item?.quantity);

  const handleProductDetail = () => {
    navigation.navigate(Route.ProductDetails, {
      productId: item?.productId,
      storeId: item?.storeId,
    });
  };

  return (
    <View
      style={[
        styles.listItemContainer,
        {
          borderBottomWidth: isBorderLess ? 0 : 1,
          borderColor: colors.grey,
        },
      ]}>
      <CustomTouchableSVG onPress={() => handleProductDetail()}>
        <Image
          resizeMode="cover"
          style={styles.itemImage}
          source={{uri: item?.image}}
        />
      </CustomTouchableSVG>
      <View style={styles.flex}>
        <View style={styles.row}>
          <CustomTouchableSVG onPress={() => handleProductDetail()}>
            <CustomText
              style={styles.itemTitle}
              text={`${item?.name} (${formatPrice(item?.price)})`}
              variant="Figtree"
              textColor={colors.darkGreen}
            />
          </CustomTouchableSVG>
          <CustomTouchableSVG onPress={() => handleDecrease(true)}>
            <Ionicons
              name="close"
              size={20}
              color={colors.warning}
              style={{
                bottom: vs(5),
                width: vs(25),
                alignItems: 'center',
                height: vs(20),
                left: vs(5),
              }}
            />
          </CustomTouchableSVG>
        </View>
        <View
          style={[
            styles.extraOptionsContainer,
            {display: productExtraOptionsData?.length > 0 ? 'flexx' : 'none'},
          ]}>
          {productExtraOptionsData?.map((extraOptions, index) => {
            return (
              <View key={index} style={styles.extraOptions}>
                <CustomText
                  text={'+ ' + extraOptions.name}
                  variant="small"
                  textColor={colors.darkGreen}
                />
                {extraOptions?.values?.map((value: any, valueIndex: number) => (
                  <View style={{flexDirection:'row',justifyContent:'space-between'}}>

                  <CustomText
                    key={valueIndex}
                    text={`${value.name}`}
                    variant="small"
                    textColor={colors.dark}
                    style={{fontSize: 12, marginLeft: 10,width:'75%'}}
                  />
                   <CustomText
                    key={valueIndex}
                    text={`${formatPrice(value.additionalPrice)}`}
                    variant="small"
                    textColor={colors.dark}
                    style={{fontSize: 12, marginLeft: 10,width:'25%'}}
                  />
                  </View>
                ))}

              </View>
            );
          })}
        </View>

        <View style={styles.row}>
          <CustomText
            text={formatPrice(totalPrice)}
            variant="label"
            textColor={colors.primaryGreen}
            style={{marginTop: vs(5)}}
          />
          <CustomCount
            productCount={item?.quantity}
            increaseCartHandler={handleIncrease}
            decreaseCartHandler={() => handleDecrease(false)}
            containerStyle={styles.countContainer}
            buttonStyle={{padding: 5, alignItems: 'center'}}
          />
        </View>
      </View>
    </View>
  );
};

export default BasketCard;

const styles = StyleSheet.create({
  flex: {flex: 1},
  listItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: scale(12),
  },
  countContainer: {
    borderWidth: 1,
    borderColor: colors.grey,
    width: scale(90),
  },
  itemTitle: {
    width: scale(170),
  },
  itemImage: {
    borderRadius: moderateScale(8),
    marginRight: scale(17),
    width: scale(54),
    height: scale(50),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  extraOptionsContainer: {
    backgroundColor: colors.inputBackgroundColor,
    marginVertical: vs(8),
    borderRadius: moderateScale(8),
  },
  extraOptions: {
    padding: scale(7),
  },
});
