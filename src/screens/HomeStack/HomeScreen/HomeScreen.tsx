import React, {useEffect, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import CategorySection from 'src/components/pageSections/HomeCard/CategorySection';
import StoreSection from 'src/components/pageSections/HomeCard/StoreSection';
import {CustomText} from 'src/components/shared/CustomText';
import {GET_HOME_SECTIONS_REQUEST} from 'src/redux/home/constants';
import {
  selectHomeSections,
  selectHomeSectionsIsLoading,
  selectStoreDetails,
} from 'src/redux/home/selectors';
import {
  selectCartTotalPrice,
  selectCurrentCartItem,
  selectProductGetCart,
  selectProductGetCartIsLoading,
} from 'src/redux/cart/selectors';
import {
  heightPercentageScale,
  widthPercentageScale,
} from 'src/theme/dimensions';
import {useLocation} from 'src/utils/hooks/useLocation';
import {useHeaderUserAddresses} from 'src/components/shared/CustomHomeHeader/useHeaderUserAddresses';
import {colors} from 'src/theme/colors';
import HomeHeader from 'src/components/shared/CustomHomeHeader';
import SelectAddressModal from 'src/components/shared/CustomAddressModal';
import {AppDispatch, RootState, useReduxSelector} from 'src/redux';
import CartDetailSection from 'src/components/pageSections/HomeCard/CartDetailSection';
import HeaderSection from 'src/components/pageSections/HomeCard/HeaderSection';
import {
  SAVE_LOCAL_CART,
  GET_PRODUCT_GET_CART_REQUEST,
} from 'src/redux/cart/constants';
import {fetchAddresses} from 'src/redux/address/addressApiThunk';
import {useNavigation} from '@react-navigation/native';
import {HomeStackNavigation} from 'src/routes/HomeStack';
import {setUser} from 'src/redux/user/slice';
import {scale, vs} from 'react-native-size-matters';
import BannerSection from 'src/components/pageSections/HomeCard/BannerSection';
import DeliverSection from 'src/components/pageSections/HomeCard/DeliverSection';
import {fetchOrdersByActive} from 'src/redux/orders/thunk/getAllOrders';
import {selectUser} from 'src/redux/user/selectors';
import appsFlyer from 'react-native-appsflyer';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGrey,
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: widthPercentageScale(2),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  categoryImageContainer: {
    height: widthPercentageScale(20),
    width: widthPercentageScale(20),
    marginBottom: scale(4),
  },
});

export default function HomeScreen() {
  const {uuid, resetPasswordRequested} = useReduxSelector(selectUser);

  const {addressModalVisible, setAddressModalVisible, onAddNewAddressPress} =
    useHeaderUserAddresses(true);
  const navigation = useNavigation<HomeStackNavigation>();
  const storeDetailsData = useReduxSelector(selectStoreDetails);

  const dispatchStore: AppDispatch = useDispatch();
  const {
    user: {accessToken, isGuest, lat, lng},
  } = useReduxSelector(store => ({user: store.user}));
  const homeSections = useReduxSelector(selectHomeSections);
  const homeSectionsLoading = useReduxSelector(selectHomeSectionsIsLoading);
  const user = useReduxSelector(state => state.user);

  let {
    addresses,
    isLoading,
    primaryAddress: {street, geometry, city, unit, typeOfPlace},
  } = useSelector((state: RootState) => state.addresses);

  useEffect(() => {
    dispatchStore({
      type: GET_HOME_SECTIONS_REQUEST,
      payload: geometry,
    });
  }, [dispatchStore, geometry]);

  const {checkPermission} = useLocation();
  const cartTotalPrice = useReduxSelector(selectCartTotalPrice);
  const currentCartItem = useReduxSelector(selectCurrentCartItem);
  const productGetCartData = useReduxSelector(selectProductGetCart);
  const productGetCartLoading = useReduxSelector(selectProductGetCartIsLoading);

  useEffect(() => {
    dispatchStore(fetchAddresses());
  }, [dispatchStore, user?.accessToken]);

  useEffect(() => {
    if (
      user?.accessToken &&
      (!addresses.length || user?.user?.addresses.length === 0) &&
      !isLoading &&
      !resetPasswordRequested
    ) {
      checkPermission();
    }
  }, [
    user.accessToken,
    checkPermission,
    addresses,
    isLoading,
    resetPasswordRequested,
  ]);

  useEffect(() => {
    dispatchStore({
      type: GET_PRODUCT_GET_CART_REQUEST,
    });
    dispatchStore(setUser({searchKey: ''}));
  }, [dispatchStore]);

  useEffect(() => {
    // if (productGetCartData?.products?.length) {
    productGetCartData?.products?.forEach((item: any) => {
      dispatchStore({
        type: SAVE_LOCAL_CART,
        payload: {
          storeId: productGetCartData?.storeId,
          quantity: item?.count,
          productId: item?.product?.id,
          price: item?.product?.price,
          name: item?.product?.name,
          image: item?.product?.images[0]?.originalUrl,
          productOptionValueIds: item?.productOptionValueIds,
          cartProductItemId: item?.cartProductItemId,
          cartId: productGetCartData?.id,
          productExtraOptions: item?.product?.options,
          deliveryAddress: productGetCartData?.deliveryAddress,
          storeName: item?.store?.name,
          storeAddress: item.store.address,
          deliveryTime: productGetCartData?.deliveryTime,
        },
      });
    });
    // }
  }, [dispatchStore, productGetCartData]);

  const renderSectionItem = ({item, section}: any) => {
    switch (section?.type) {
      //  case 'item-carousel':
      //     return <ChipSection item={item} />;
      case 'categories':
        return (
          <CategorySection
            containerStyle={{marginTop: heightPercentageScale(-1)}}
            imageContainerStyle={styles.categoryImageContainer}
            bgColor="#E7EDE5"
            item={item}
          />
        );
      case 'store-carousel':
        return <StoreSection item={item} id={item._id} />;
      case 'all-store':
        return <StoreSection item={item} id={item._id} />;
      default:
        return null;
    }
  };

  const handleRefresh = () => {
    dispatchStore({
      type: GET_HOME_SECTIONS_REQUEST,
      payload: geometry,
    });
  };
  return (
    <View style={styles.container}>
      <HomeHeader
        onPressAddressBar={() => setAddressModalVisible(true)}
        selectedAddress={
          city
            ? `${
                typeOfPlace === 'Apartment'
                  ? unit + ', ' + street + ', ' + city
                  : street + ', ' + city
              }`
            : null
        }
        inputDisable={true}
      />
      <SelectAddressModal
        isVisible={addressModalVisible}
        setVisible={setAddressModalVisible}
        onAddNewAddressPress={onAddNewAddressPress}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: vs(20),
          flexGrow: homeSectionsLoading || !homeSections?.length ? 1 : 0,
        }}
        refreshControl={
          <RefreshControl
            style={{zIndex: -1}}
            refreshing={homeSectionsLoading || productGetCartLoading}
            onRefresh={handleRefresh}
            tintColor={colors.green300}
          />
        }
        style={styles.mainContainer}>
        {homeSectionsLoading ? (
          <View style={styles.loadingContainer}></View>
        ) : homeSections?.length ? (
          homeSections.map((section: any, index: number) => {
            const data = Object.keys(section)
              .filter(key => Array.isArray(section[key]))
              .flatMap(key => section[key]);

            if (section.type === 'banners') {
              return (
                <BannerSection
                  item={section.sliders?.filter(item => item.homepage)}
                  homeScreen={true}
                />
              );
            }

            if (section.type === 'all-store') {
              return (
                <View key={index}>
                  <HeaderSection
                    containerStyle={{marginTop: widthPercentageScale(2)}}
                    section={section}
                  />
                  <FlatList
                    data={data}
                    numColumns={2} // Set the number of columns to 2
                    keyExtractor={(_, i) => i.toString()}
                    showsVerticalScrollIndicator={false}
                    renderItem={({item}) => {
                      return renderSectionItem({section, item}); // Adjust the render method if needed
                    }}
                  />
                </View>
              );
            }

            return (
              <View key={index}>
                <HeaderSection
                  containerStyle={{marginTop: widthPercentageScale(0)}}
                  section={section}
                />
                <FlatList
                  data={data}
                  horizontal
                  keyExtractor={(_, i) => i.toString()}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item}) => {
                    return renderSectionItem({section, item});
                  }}
                />
                {/* {index === 1 && <DeliverSection />} */}
              </View>
            );
          })
        ) : (
          <View style={styles.loadingContainer}>
            <CustomText
              text="No Result Found"
              variant="h4"
              textColor={colors.darkGreen}
              numberOfLines={1}
            />
          </View>
        )}
       
      </ScrollView>
      {currentCartItem?.length ? (
        <CartDetailSection
          cartTotalPrice={cartTotalPrice}
          currentCartItem={currentCartItem}
          productGetCartData={productGetCartData}
        />
      ) : null}
    </View>
  );
}
