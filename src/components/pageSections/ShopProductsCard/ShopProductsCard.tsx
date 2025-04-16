import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {colors} from '../../../theme/colors';
import {CustomText} from '../../shared/CustomText';
import ProductCard from '../ProductCard/ProductCard';
import {CustomTouchableSVG} from '../../shared/CustomTouchableSVG';
import RightArrowSVG from 'assets/svg/RightArrowSVG';
import {ShopCard} from '../ShopCard';
import {scale, vs} from 'react-native-size-matters';
import {useNavigation} from '@react-navigation/native';
import {Route} from 'src/routes/Route';

const styles = StyleSheet.create<Styles>({
  shopBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 124,
    marginTop: vs(20),
  },
  shopBtnLabel: {
    alignSelf: 'center',
    textAlign: 'center',
    color: colors.primaryGreen,
    marginBottom: scale(7.5),
    fontWeight: '700',
  },
  shopClickBtn: {
    borderRadius: 9999,
    backgroundColor: `${colors.primaryGreen}40`,
    padding: 12,
  },
  flatListStyle: {
    overflow: 'visible',
    paddingBottom: scale(15),
    paddingLeft: scale(14),
  },
});
export default function ShopProductsCard({item}: ShopProductsCardProps) {
  const navigation = useNavigation();
  return (
    <View>
      <ShopCard item={item} />
      <FlatList
        showsHorizontalScrollIndicator={false}
        style={styles.flatListStyle}
        horizontal
        data={item?.products}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({item: productItem}) => (
          <ProductCard
            item={productItem}
            storeAddress={item?.storeAddress}
            storeId={item?.storeId || item?._id}
            storeName={item?.storeName || item?.name}
          />
        )}
        ListFooterComponent={() => (
          <View style={styles.shopBtn}>
            <CustomText
              text={'View All'}
              variant={'label'}
              style={styles.shopBtnLabel}
            />
            <CustomTouchableSVG
              containerStyle={styles.shopClickBtn}
              onPress={() =>
                navigation.navigate(Route.StoreDetails, {
                  storeId: item._id || item?.storeId && item?.deliveryTime
                })
              }>
              <RightArrowSVG width={20} height={20} />
            </CustomTouchableSVG>
          </View>
        )}
      />
    </View>
  );
}
