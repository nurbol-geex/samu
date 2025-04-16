import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  ImageBackground,
  FlatList,
  ActivityIndicator,
  Platform,
  ScrollView,
} from 'react-native';
import {CustomText} from '../../shared/CustomText';
import {colors} from '../../../theme/colors';
import {moderateScale, scale, vs} from 'react-native-size-matters';
import {CustomTouchableSVG} from 'src/components/shared/CustomTouchableSVG';
import {Route} from 'src/routes/Route';
import ProductSearch from 'assets/svg/ProductSearch';
import BackSVG from 'assets/svg/BackSVG';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {widthPercentageScale} from 'src/theme/dimensions';
import roundOffToNearestFive, {
  formatPrice,
  getCurrentDayHours,
  metersToMiles,
} from 'src/utils';
import ProductCard from '../ProductCard/ProductCard';
import {useReduxSelector} from 'src/redux';
import {selectStoreProduct} from 'src/redux/home/selectors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const StoreDetailsHeader: React.FC<HeaderComponentProps> = ({
  navigation,
  storeDetailsData,
  storeDetailsDataLoading,
  setShowMenu,
  handleSearch,
}) => {
  const storeProductData = useReduxSelector(selectStoreProduct);
  if (storeDetailsDataLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primaryGreen} />
      </View>
    );
  } else if (
    !storeDetailsDataLoading &&
    storeDetailsData.hasOwnProperty('deliveryTimeAndCostDetails')
  ) {
    return (
      <>
        <ImageBackground
          style={styles.storeImage}
          resizeMode="cover"
          source={{uri: storeDetailsData?.store?.headerImage?.originalUrl}}>
          <View style={styles.overlay} />
          <View style={styles.imageHeaderContainer}>
            <CustomTouchableSVG onPress={() => navigation.goBack()}>
              <BackSVG style={styles.backSVG} />
            </CustomTouchableSVG>
            {storeProductData?.length > 0 ? (
              <ProductSearch
                onPress={handleSearch}
                style={styles.productSearch}
              />
            ) : null}
          </View>
        </ImageBackground>
        <View style={styles.scrollViewContainer}>
          <View style={styles.scrollContent}>
            <Image
              style={styles.storeLogo}
              source={{uri: storeDetailsData?.store?.image?.originalUrl}}
            />
            <CustomText
              text={storeDetailsData?.store?.name}
              variant="h3"
              textColor={colors.darkGreen}
            />
            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal
              contentContainerStyle={styles.storeTimerContainer}>
              <View style={styles.ratings}>
                <FontAwesome name="star" color={colors.yellow} size={15} />
                <CustomText
                  text={
                    storeDetailsData?.store?.averageRating
                      ? `${Number(
                          storeDetailsData?.store?.averageRating,
                        ).toFixed(1)}`
                      : 0
                  }
                  variant="small"
                  textColor={colors.dark}
                  numberOfLines={1}
                  style={[styles.moreInfoText, {marginLeft: 4}]}
                />
              </View>
              {/* <View style={styles.verticalLine} />
              <CustomText
                text="Category Title"
                variant="small"
                textColor={colors.dark}
              /> */}
              {storeDetailsData?.deliveryTimeAndCostDetails[0]?.hasOwnProperty(
                'deliveryCost',
              ) &&
                storeDetailsData?.deliveryTimeAndCostDetails[0]
                  ?.deliveryCost && (
                  <>
                    <View style={styles.verticalLine} />
                    <MaterialCommunityIcons
                      name="bike-fast"
                      color={colors.primaryGreen}
                      size={15}
                    />
                    <CustomText
                      style={styles.moreInfoText}
                      text={`${
                        storeDetailsData?.deliveryTimeAndCostDetails[0]
                          ?.deliveryCost >= 0
                          ? `${formatPrice(
                              storeDetailsData?.deliveryTimeAndCostDetails[0]
                                ?.deliveryCost,
                            )}`
                          : 'Free Delivery'
                      }`}
                      variant="small"
                      textColor={
                        storeDetailsData?.deliveryTimeAndCostDetails[0]
                          ?.deliveryCost >= 0
                          ? colors.dark
                          : colors.primaryGreen
                      }
                    />
                  </>
                )}
              {storeDetailsData?.store?.hasOwnProperty('availability') &&
              !storeDetailsData?.store?.availability ? (
                <>
                  <View style={styles.verticalLine} />
                  <MaterialCommunityIcons
                    name="store-remove-outline"
                    color={colors.primaryGreen}
                    size={15}
                  />
                  <CustomText
                    variant="small"
                    textColor={colors.dark}
                    numberOfLines={2}
                    style={styles.moreInfoText}
                    text={`Closed`}
                  />
                </>
              ) : storeDetailsData?.deliveryTimeAndCostDetails[0]?.hasOwnProperty(
                  'deliveryTime',
                ) ? (
                <>
                  <View style={styles.verticalLine} />
                  <MaterialCommunityIcons
                    name="timer-outline"
                    color={colors.primaryGreen}
                    size={15}
                  />
                  <CustomText
                    text={
                      <>
                        {
                          storeDetailsData?.deliveryTimeAndCostDetails[0]
                            ?.deliveryTime?.min
                        }
                        -
                        {
                          storeDetailsData?.deliveryTimeAndCostDetails[0]
                            ?.deliveryTime?.max
                        }
                        mins
                      </>
                    }
                    variant="small"
                    textColor={colors.dark}
                    numberOfLines={2}
                    style={styles.moreInfoText}
                  />
                </>
              ) : null}

              {storeDetailsData?.deliveryTimeAndCostDetails[0]?.hasOwnProperty(
                'distance',
              ) && (
                <>
                  <View style={styles.verticalLine} />
                  <MaterialCommunityIcons
                    name="map-marker-distance"
                    color={colors.primaryGreen}
                    size={15}
                  />
                  <CustomText
                    variant="small"
                    textColor={colors.dark}
                    numberOfLines={2}
                    style={styles.moreInfoText}
                    text={`${metersToMiles(
                      storeDetailsData?.deliveryTimeAndCostDetails[0]?.distance,
                    )} mi`}
                  />
                </>
              )}
            </ScrollView>

            <CustomTouchableSVG
              onPress={() =>
                navigation.navigate(Route.StoreInfo, {
                  storeInfo: {
                    availability: storeDetailsData?.store?.availability,
                    address: storeDetailsData?.store?.address,
                    storeName: storeDetailsData?.store?.name,
                    storeImage: storeDetailsData?.store?.image?.originalUrl,
                    hours: storeDetailsData?.store?.hours,
                    phone: storeDetailsData?.store?.phone,
                    id: storeDetailsData?.store?._id,
                    deliveryTime:
                      storeDetailsData?.deliveryTimeAndCostDetails[0]
                        ?.deliveryTime,
                  },
                })
              }
              containerStyle={styles.moreInfoButton}>
              <CustomText
                style={styles.moreInfoText}
                text="More info"
                variant="label"
                textColor={colors.primaryGreen}
              />
              <MaterialCommunityIcons
                name="information-outline"
                color={colors.primaryGreen}
                size={20}
              />
            </CustomTouchableSVG>
          </View>

          {storeDetailsData?.store?.sliders?.length ? (
            <>
              <View style={[styles.separator, {top: vs(2)}]} />
              <View style={{top: vs(2)}}>
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  data={storeDetailsData?.store?.sliders}
                  style={styles.flatListStyle}
                  horizontal
                  keyExtractor={(_, i) => i.toString()}
                  renderItem={({item}: {item: SliderItem}) => (
                    <View style={styles.bannerCard}>
                      <CustomText
                        text={item.title}
                        variant="h5"
                        textColor={colors.white}
                        numberOfLines={2}
                      />
                      <CustomText
                        text={item.subTitle}
                        variant="small"
                        textColor={colors.white}
                        numberOfLines={2}
                        style={styles.bannerDescription}
                      />
                    </View>
                  )}
                />
              </View>
            </>
          ) : null}
          {storeDetailsData?.store?.featuredItems?.length ? (
            <View style={styles.popularItemsContainer}>
              <View style={[styles.separator, {top: vs(0)}]} />
              <View style={{top: vs(8)}}>
                <CustomText
                  text="Featured Items"
                  variant="h4"
                  textColor={colors.darkGreen}
                />
              </View>
              <FlatList
                showsHorizontalScrollIndicator={false}
                style={styles.flatListStyle}
                horizontal
                data={storeDetailsData?.store?.featuredItems}
                keyExtractor={(_, i) => i.toString()}
                renderItem={({item: productItem}) => {
                  return (
                    <View style={{top: vs(8)}}>
                      <ProductCard
                        item={productItem}
                        storeAddress={storeDetailsData?.store?.address}
                        storeId={storeDetailsData?.store?._id}
                        storeName={storeDetailsData?.store?.name}
                        deliveryTime={
                          storeDetailsData?.deliveryTimeAndCostDetails[0]
                            ?.deliveryTime
                        }
                      />
                    </View>
                  );
                }}
              />
            </View>
          ) : null}

          {/* <></> */}

          <View style={styles.popularItemsContainer}>
            <View style={[styles.separator, {top: vs(-4)}]} />
            <CustomTouchableSVG
              containerStyle={styles.fullMenuButton}
              onPress={() => setShowMenu(true)}>
              <CustomText
                text="Full Menu"
                variant="h4"
                textColor={colors.darkGreen}
              />
              <MaterialCommunityIcons
                name="chevron-down"
                color={colors.primaryGreen}
                size={28}
              />
            </CustomTouchableSVG>
            {/* <CustomText
              text="Volutpat nulla tincidunt sit at non. Proin volutpat amet enim a nulla sed felis."
              variant="small"
              textColor={colors.dark}
            /> */}
            <CustomText
              text={
                storeDetailsData?.store?.hours &&
                getCurrentDayHours(storeDetailsData?.store?.hours)
              }
              variant="label"
              textColor={colors.darkGreen}
            />
          </View>
        </View>
      </>
    );
  }
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeImage: {
    width: '100%',
    height: vs(143),
  },
  storeLogo: {
    width: scale(60),
    height: scale(60),
    position: 'absolute',
    zIndex: 2,
    top: -vs(30),
    left: scale(10),
    borderRadius: moderateScale(60 / 2),
  },
  scrollViewContainer: {
    backgroundColor: colors.lightGrey,
    borderTopLeftRadius: scale(12),
    borderTopRightRadius: scale(12),
    // bottom: vs(10),
  },
  scrollContent: {
    paddingHorizontal: scale(15),
    paddingTop: vs(30),
    gap: vs(4),
  },
  ratings: {
    flexDirection: 'row',
    marginTop: vs(1),
    alignItems: 'center',
  },
  ratingImage: {
    width: widthPercentageScale(3.8),
    height: widthPercentageScale(3.8),
    right: widthPercentageScale(0.5),
  },
  storeTimerContainer: {
    alignItems: 'center',
    gap: scale(3),
  },
  storeTimerImage: {
    width: widthPercentageScale(3.8),
    height: widthPercentageScale(3.8),
  },
  cardText: {
    fontSize: moderateScale(12),
  },
  moreInfoButton: {
    // backgroundColor: colors.extraLightGrey,
    borderRadius: 45,
    gap: 7,
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(8),
    overflow: 'hidden',
    top: vs(3),
    position: 'absolute',
    right: scale(10),
  },
  moreInfoText: {
    alignSelf: 'center',
    fontWeight: '700',
  },
  separator: {
    borderWidth: 0.7,
    borderColor: colors.grey,
    marginTop: vs(10),
  },
  verticalLine: {
    marginHorizontal: 6,
    borderWidth: 0.7,
    opacity: 0.2,
    borderRadius: 1,
    borderColor: '#000000',
    height: 18,
  },
  flatListStyle: {
    overflow: 'visible',
  },
  bannerCard: {
    backgroundColor: colors.primaryGreen,
    width: widthPercentageScale(58),
    padding: scale(10),
    borderRadius: moderateScale(20),
    gap: vs(6),
    marginLeft: scale(15),
    marginTop: vs(10),
    marginBottom: vs(3),
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    overflow: Platform.OS === 'ios' ? 'visible' : 'hidden',
  },
  bannerDescription: {
    fontSize: moderateScale(12),
  },
  popularItemsContainer: {
    paddingHorizontal: scale(15),
    gap: vs(8),
  },
  fullMenuButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? vs(50) : vs(30),
    alignItems: 'center',
  },
  backSVG: {
    left: scale(7),
  },
  productSearch: {
    right: scale(15),
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(3, 3, 3, 0.452)', // Adjust the color and opacity as needed
  },
});

export default StoreDetailsHeader;
