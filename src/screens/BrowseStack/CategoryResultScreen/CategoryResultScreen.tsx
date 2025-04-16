import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {colors} from '../../../theme/colors';
import {ShopProductsCard} from 'src/components/pageSections/ShopProductsCard';
import {FilterTabsBoard} from '../../../components/pageSections/FilterTabsBoard';

import {
  selectProductSearch,
  selectProductSearchIsLoading,
} from 'src/redux/home/selectors';
import {CustomSkeletonLoader} from 'src/components/shared/CustomSkeletonLoader';
import {CustomText} from 'src/components/shared/CustomText';
import {
  heightPercentageScale,
  widthPercentageScale,
} from 'src/theme/dimensions';
import HomeHeader from 'src/components/shared/CustomHomeHeader';
import {useHeaderUserAddresses} from 'src/components/shared/CustomHomeHeader/useHeaderUserAddresses';
import SelectAddressModal from 'src/components/shared/CustomAddressModal';
import {RootState, useReduxSelector} from 'src/redux';
import {selectUser} from 'src/redux/user/selectors';
import {useSelector} from 'react-redux';

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: colors.grey,
  },
  mainContainer: {
    flex: 1,
  },
  card: {
    backgroundColor: colors.white,
    marginTop: heightPercentageScale(1.2),
  },
  tabContainer: {
    marginTop: heightPercentageScale(1.2),
    paddingHorizontal: widthPercentageScale(3),
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});
export default function CategoryResultScreen() {
  const [searchingEnabled, setSearchingEnabled] = useState(false);
  const productSearchData = useReduxSelector(selectProductSearch);
  const isProductSearchDataLoad = useReduxSelector(
    selectProductSearchIsLoading,
  );
  const {searchKey} = useReduxSelector(selectUser);
  const onTabChange = (tabValue: string) => {
    console.log(tabValue);
  };
  const {addressModalVisible, setAddressModalVisible, onAddNewAddressPress} =
    useHeaderUserAddresses(true);

  const {
    primaryAddress: {street},
  } = useSelector((state: RootState) => state.addresses);

  useEffect(() => {
    if (searchKey) {
      setSearchingEnabled(true);
    } else {
      setSearchingEnabled(false);
    }
  }, [searchKey]);

  const tabData: tab[] = [
    {name: 'All', value: 'all'},
    {name: 'Groceries', value: 'groceries'},
    {name: 'Restaurants', value: 'restaurants'},
  ];

  return (
    <View style={styles.container}>
      <HomeHeader
        onPressAddressBar={() => setAddressModalVisible(true)}
        selectedAddress={street}
        setSearchingEnabled={() => setSearchingEnabled(false)}
      />
      <SelectAddressModal
        isVisible={addressModalVisible}
        setVisible={setAddressModalVisible}
        onAddNewAddressPress={onAddNewAddressPress}
      />
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        style={styles.mainContainer}>
        <View style={styles.tabContainer}>
          <FilterTabsBoard tabs={tabData} onChange={onTabChange} />
        </View>

        {isProductSearchDataLoad ? (
          <CustomSkeletonLoader />
        ) : productSearchData?.length && searchKey ? (
          productSearchData?.map((item: any, index: number) => (
            <View key={index} style={styles.card}>
              <ShopProductsCard item={item} />
            </View>
          ))
        ) : searchKey || searchingEnabled ? (
          <View style={styles.loadingContainer}>
            <CustomText
              text={'No Result Found'}
              variant="h4"
              textColor={colors.darkGreen}
              numberOfLines={1}
            />
          </View>
        ) : (
          <View style={styles.loadingContainer}>
            <CustomText
              text={''}
              variant="h4"
              textColor={colors.darkGreen}
              numberOfLines={1}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
