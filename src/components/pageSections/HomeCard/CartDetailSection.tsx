import React from 'react';
import {StyleSheet, View} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {CustomText} from 'src/components/shared/CustomText';
import {colors} from 'src/theme/colors';
import {widthPercentageScale} from 'src/theme/dimensions';
import {Route} from 'src/routes/Route';
import {scale, vs} from 'react-native-size-matters';
import {formatPrice} from 'src/utils';
import {CustomTouchableSVG} from 'src/components/shared/CustomTouchableSVG';
import Icon from 'react-native-vector-icons/FontAwesome';

const styles = StyleSheet.create({
  cartDetailsBox: {
    backgroundColor: colors.darkGreen,
    width: widthPercentageScale(95),
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scale(12),
    paddingVertical: scale(13),
    borderRadius: scale(8),
    bottom: vs(10),
    left: 2,
    gap: 10,
  },
});

const CartDetailSection: React.FC<CartDetailsSectionProps> = ({
  cartTotalPrice,
  currentCartItem,
  productGetCartData,
}) => {
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <CustomTouchableSVG
      onPress={() =>
        navigation.navigate(Route.StoreDetails, {
          storeId: currentCartItem[0]?.storeId,
        })
      }>
      <View style={styles.cartDetailsBox}>
        <View
          style={{
            height: 24,
            width: 24,
            backgroundColor: colors.white,
            borderRadius: 100,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            // marginRight: 6,
          }}>
          <CustomText
            text={`${currentCartItem?.length}`}
            variant="Figtree"
            textColor={colors.darkGreen}
            style={{alignSelf: 'center', fontSize: 16, fontWeight: '800'}}
          />
        </View>
        <CustomText
          text={`${currentCartItem[0].storeName}`}
          variant="Figtree"
          textColor={colors.white}
          style={{flex: 1, alignSelf: 'center'}}
          numberOfLines={1}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
            gap: 10,
          }}>
          <CustomText
            text={formatPrice(cartTotalPrice)}
            variant="Figtree"
            textColor={colors.white}
          />
          <Icon name="chevron-right" size={16} color={colors.white} />
        </View>
      </View>
    </CustomTouchableSVG>
  );
};

export default CartDetailSection;
