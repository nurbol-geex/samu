import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  Platform,
  InteractionManager,
  SectionList,
  StyleSheet,
  View,
  FlatList,
  Dimensions,
} from 'react-native';
import {moderateScale, scale, vs} from 'react-native-size-matters';
import {colors} from 'src/theme/colors';
import {
  heightPercentageScale,
  widthPercentageScale,
} from 'src/theme/dimensions';

import {useNavigation} from '@react-navigation/native';

import {useDispatch, useSelector} from 'react-redux';
import {RootState, useReduxSelector} from 'src/redux';
import {
  GET_PRODUCT_SEARCH_BY_STORE_ID_REQUEST,
  GET_STORE_DETAILS_REQUEST,
  GET_STORE_MENU_REQUEST,
  GET_STORE_PRODUCT_REQUEST,
} from 'src/redux/home/constants';
import {
  selectStoreDetails,
  selectStoreDetailsIsLoading,
  selectStoreMenu,
  selectStoreMenuIsLoading,
  selectStoreProduct,
  selectStoreProductByStoreIdIsLoading,
  selectStoreProductIsLoading,
} from 'src/redux/home/selectors';
import {CustomStatusBar} from 'src/components/shared/CustomStatusBar';
import {CustomHeader} from 'src/components/shared/CustomHeader';
import StoreDetailsHeader from 'src/components/pageSections/Store/StoreDetailsHeader';
import StoreProductStickyHeader from 'src/components/pageSections/Store/StoreProductStickyHeader';
import StoreProducts from 'src/components/pageSections/Store/StoreProducts';
import StoreMenuSheet from 'src/components/pageSections/Store/StoreMenu';
import {CustomText} from 'src/components/shared/CustomText';
import SearchBar from 'src/components/shared/CustomSearch';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {CustomTouchableSVG} from 'src/components/shared/CustomTouchableSVG';
import CrossSVG from 'assets/svg/CrossSVG';
import {transformDataToSections} from 'src/utils';
import DeviceInfo from 'react-native-device-info';
import {ANALYTICS} from 'src/redux/user/constants';
import {selectCurrentCartItem} from 'src/redux/cart/selectors';
import { useAnalytics } from 'src/segmentService';

const StoreDetails: React.FC<StoreDetailsProps> = ({route}) => {
  const dispatchStore = useDispatch();
  const navigation = useNavigation();
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const user = useReduxSelector(state => state.user);
  const { track } = useAnalytics();
  const {
    user: {accessToken, isGuest, lat, lng},
  } = useReduxSelector(store => ({user: store.user}));
  const [isSearchActive, setIsSearchActive] = useState(false);

  const storeId = route?.params?.storeId;
  let {
    primaryAddress: {geometry},
  } = useSelector((state: RootState) => state.addresses);

  const onSearchAnalytics = storeId => {
    track('Store', {storeId});
    dispatchStore({
      type: ANALYTICS,
      payload: {
        eventType: 'storePageView', // Specify the event type here
        data: {
          storeId,
          userId: user.email,
          sessionId: accessToken,
        },
      },
    });
  };
  useEffect(() => {
    if (storeId) {
      onSearchAnalytics(storeId);
    }
  }, [storeId]);

  useEffect(() => {
    if (storeId) {
      dispatchStore({
        type: GET_STORE_DETAILS_REQUEST,
        payload: {
          storeId,
          longitude: geometry.longitude,
          latitude: geometry.latitude,
        },
      });
      dispatchStore({type: GET_STORE_MENU_REQUEST, payload: {storeId}});
      dispatchStore({type: GET_STORE_PRODUCT_REQUEST, payload: {storeId}});
    }
  }, [dispatchStore, storeId, geometry]);

  // store details
  const storeDetailsData = useReduxSelector(selectStoreDetails);
  const storeDetailsDataLoading = useReduxSelector(selectStoreDetailsIsLoading);
  const hasNotch = DeviceInfo.hasNotch();

  const isProductByStoreIdLoading = useReduxSelector(
    selectStoreProductByStoreIdIsLoading,
  );
  const storeMenuDataLoading = useReduxSelector(selectStoreMenuIsLoading);
  // product Data
  const storeProductData = useReduxSelector(selectStoreProduct);
  const storeProductDataLoading = useReduxSelector(selectStoreProductIsLoading);

  const [isHeaderVisible, setIsHeaderVisible] = useState<boolean>(false);
  const headerRef = useRef(null);
  const flatListRef = useRef<FlatList>(null); // Create a reference for the FlatList
  const sectionListRef = useRef(null);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const sectionListData = transformDataToSections(storeProductData);
  const {height} = Dimensions.get('window');

  useEffect(() => {
    if (storeProductData.length > 0) {
      setSelectedCategory(storeProductData[0].menu.name);
    }
  }, [storeProductData]);

  const handleSelectCategory = item => {
    setSelectedCategory(item.menu.name);
    const sectionIndex = sectionListData.findIndex(
      res => res.title === item.menu.name,
    );

    if (sectionIndex !== -1) {
      // Assuming you want to scroll to the first item in the section
      const itemIndex = 0; // The first item in the section
      sectionListRef?.current?.scrollToLocation({
        sectionIndex: sectionIndex,
        itemIndex: itemIndex,
        animated: true,
        viewPosition:
          Platform.OS === 'ios' && hasNotch
            ? heightPercentageScale(23) / height
            : heightPercentageScale(20) / height,
      });

      flatListRef?.current?.scrollToIndex({
        index: sectionIndex,
        animated: true,
        viewPosition: 0.5, // Scroll to center
      });
    }
  };

  const checkHeaderPosition = useCallback(
    (event: any) => {
      const handleVisibility = (pageY: number) => {
        if (isSearchActive) {
          setIsHeaderVisible(true);
          return;
        }

        if (pageY === 0) {
          setIsHeaderVisible(false);
          setSearchValue('');
        } else if (pageY < 90 && !isHeaderVisible) {
          setIsHeaderVisible(true);
        } else if (pageY > 72 && isHeaderVisible) {
          setIsHeaderVisible(false);

          setSearchValue('');
        }
      };

      // For iOS: use measure
      if (Platform.OS === 'ios' && headerRef.current) {
        headerRef.current.measure((x, y, width, height, pageX, pageY) => {
          handleVisibility(pageY);
        });
      }

      // For Android: use onLayout and InteractionManager
      else if (Platform.OS === 'android' && headerRef.current) {
        InteractionManager.runAfterInteractions(() => {
          headerRef.current.measure((x, y, width, height, pageX, pageY) => {
            handleVisibility(pageY);
          });
        });
      }
    },
    [isHeaderVisible, isSearchActive],
  );

  const handleShowSearch = () => {
    setShowSearch(!showSearch);
    setIsHeaderVisible(true);
    setIsSearchActive(true);
  };

  const handleSearchClose = () => {
    setSearchValue('');
    navigation.goBack();
  };

  useEffect(() => {
    if (searchValue) {
      setIsHeaderVisible(true);
      const handler = setTimeout(() => {
        dispatchStore({
          type: GET_PRODUCT_SEARCH_BY_STORE_ID_REQUEST,
          payload: {searchValue: searchValue, storeId: storeId},
        });
      }, 500);
      return () => clearTimeout(handler);
    } else {
      dispatchStore({
        type: GET_STORE_PRODUCT_REQUEST,
        payload: {storeId},
      });
    }
  }, [searchValue, dispatchStore, storeId]);

  useEffect(() => {
    if (isProductByStoreIdLoading && searchValue) {
      setIsHeaderVisible(true);
    }
  }, [isProductByStoreIdLoading, searchValue]);

  if (storeDetailsDataLoading) {
    return (
      <View style={styles.listEmpty}>
        <ActivityIndicator size="large" color={colors.primaryGreen} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isHeaderVisible && (
        <View style={{position: 'absolute', zIndex: 1}}>
          <CustomStatusBar backgroundColor={colors.primaryGreen} />
          {showSearch && (
            <View
              style={[
                styles.searchMainContiner,
                {
                  top:
                    Platform.OS === 'ios'
                      ? hasNotch
                        ? widthPercentageScale(13)
                        : widthPercentageScale(6)
                      : widthPercentageScale(4.4),
                },
              ]}>
              <View style={styles.searchContainer}>
                <IonIcons
                  name="search-outline"
                  disabled
                  color="#6B6B6B"
                  size={scale(20)}
                />
                <SearchBar
                  value={searchValue}
                  onChangeText={(e: any) => {
                    setSearchValue(e);
                  }}
                  placeholder="Search Products"
                  onFocus={() => setIsHeaderVisible(true)}
                />
                {searchValue ? (
                  <CustomTouchableSVG
                    onPress={() => {
                      setSearchValue('');
                    }}
                    containerStyle={styles.crossIcon}>
                    <CrossSVG />
                  </CustomTouchableSVG>
                ) : null}
              </View>
            </View>
          )}
          <CustomHeader
            title={storeDetailsData?.store?.name}
            titleColor={colors.white}
            containerBackgroundColor={colors.primaryGreen}
            startButtonIconType="back"
            endButtonIconType={'search'}
            handleSearch={handleShowSearch}
            handleBack={() => {
              handleSearchClose();
            }}
          />
          {sectionListData?.length > 0 && (
            <StoreProductStickyHeader
              ref={flatListRef}
              storeProductData={storeProductData}
              setShowMenu={setShowMenu}
              selectedCategory={selectedCategory}
              onCategorySelect={handleSelectCategory}
            />
          )}
        </View>
      )}

      {sectionListData.length === 0 && storeDetailsData && !isHeaderVisible && (
        <StoreDetailsHeader
          navigation={navigation}
          storeDetailsData={storeDetailsData}
          storeDetailsDataLoading={storeDetailsDataLoading}
          setShowMenu={setShowMenu}
          handleSearch={handleShowSearch}
        />
      )}

      {isProductByStoreIdLoading || storeProductDataLoading ? (
        <View style={styles.listEmpty}>
          <ActivityIndicator size="large" color={colors.primaryGreen} />
        </View>
      ) : sectionListData?.length > 0 ? (
        <SectionList
          ref={sectionListRef}
          onScroll={e => checkHeaderPosition(e.nativeEvent.contentOffset.y)}
          stickySectionHeadersEnabled={false}
          ListHeaderComponent={
            <>
              {/* {showSearch && (
                <View
                  style={[
                    styles.searchMainContiner,
                    {
                      top:
                        Platform.OS === 'ios'
                          ? hasNotch
                            ? widthPercentageScale(14)
                            : widthPercentageScale(6)
                          : widthPercentageScale(4.4),
                    },
                  ]}>
                  <View style={styles.searchContainer}>
                    <IonIcons
                      name="search-outline"
                      disabled
                      color="#6B6B6B"
                      size={scale(20)}
                    />
                    <SearchBar
                      value={searchValue}
                      onChangeText={(e: any) => {
                        setSearchValue(e);
                      }}
                      placeholder="Search Products"
                      onFocus={() => setIsHeaderVisible(true)}
                    />
                    {searchValue ? (
                      <CustomTouchableSVG
                        onPress={() => {
                          setSearchValue('');
                        }}
                        containerStyle={styles.crossIcon}>
                        <CrossSVG />
                      </CustomTouchableSVG>
                    ) : null}
                  </View>
                </View>
              )} */}
              {storeDetailsData && !isHeaderVisible ? (
                <Animated.View
                  style={
                    {
                      // transform: [{translateY: scrollValue}],
                    }
                  }>
                  <StoreDetailsHeader
                    navigation={navigation}
                    storeDetailsData={storeDetailsData}
                    storeDetailsDataLoading={storeDetailsDataLoading}
                    setShowMenu={setShowMenu}
                    handleSearch={handleShowSearch}
                  />
                </Animated.View>
              ) : null}
              <View
                ref={headerRef}
                onLayout={
                  Platform.OS === 'android' ? checkHeaderPosition : undefined
                }
              />
              {/* {sectionListData?.length > 0 && showList ? (
                <View
                  ref={headerRef}
                  style={{marginTop: isHeaderVisible ? 70 : 0}}>
                  <StoreProductStickyHeader
                    storeProductData={storeProductData}
                    setShowMenu={setShowMenu}
                    selectedCategory={selectedCategory}
                    onCategorySelect={handleSelectCategory}
                  />
                </View>
              ) : null} */}
            </>
          }
          sections={sectionListData}
          keyExtractor={(_, i) => i.toString()}
          renderSectionHeader={({section}) => {
            const sectionIndex = sectionListData.findIndex(
              s => s.title === section.title,
            );
            return (
              <View
                style={{
                  marginTop:
                    sectionIndex === 0 && isHeaderVisible && hasNotch
                      ? widthPercentageScale(44)
                      : sectionIndex === 0 && isHeaderVisible
                      ? widthPercentageScale(33)
                      : 0,
                }}>
                <CustomText
                  text={section?.title} // Display index if needed
                  style={{
                    marginHorizontal: 20,
                    fontSize: 20,
                    fontWeight: '800',
                    backgroundColor: colors.lightGrey,
                    marginTop: 20,
                  }}
                  textColor={colors.darkGreen}
                />
              </View>
            );
          }}
          renderItem={({item}) => {
            return (
              <View>
                <StoreProducts
                  item={item}
                  navigation={navigation}
                  storeId={storeId}
                  storeDetailsData={storeDetailsData}
                />
              </View>
            );
          }}
        />
      ) : (
        <View style={styles.loadingContainer}>
          <CustomText
            text={'No Products Found'}
            variant="h4"
            textColor={colors.darkGreen}
            numberOfLines={1}
          />
        </View>
      )}

      <StoreMenuSheet
        isVisible={showMenu}
        setShowMenu={setShowMenu}
        storeMenuDataLoading={storeMenuDataLoading}
        storeMenuData={sectionListData}
        selectedCategory={selectedCategory}
        onCategorySelect={handleSelectCategory}
        storeDetailsData={storeDetailsData}
      />
      {!storeDetailsData?.store?.availability && (
        <View style={styles.cartDetailsBox}>
          <CustomText
            text={`This store is closed right now`}
            variant="Figtree"
            textColor={colors.black}
            style={{fontSize: 16, fontWeight: '800', margin: 0}}
          />

          <CustomText
            text={`It's not possible to order at the moment`}
            variant="Figtree"
            textColor={colors.black}
            style={{fontSize: 14, fontWeight: '500', marginTop: -8}}
          />
        </View>
      )}
    </View>
  );
};

export default StoreDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGrey,
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
    // borderWidth: 3,
    // borderColor: 'dodgerblue',
  },
  scrollViewContainer: {
    backgroundColor: colors.lightGrey,
    borderTopLeftRadius: scale(12),
    borderTopRightRadius: scale(12),
    bottom: vs(10),
  },
  scrollContent: {
    paddingHorizontal: scale(15),
    paddingTop: vs(40),
    gap: vs(4),
  },
  ratings: {
    flexDirection: 'row',
    marginTop: vs(5),
    alignItems: 'center',
  },
  ratingImage: {
    width: widthPercentageScale(3.8),
    height: widthPercentageScale(3.8),
    right: widthPercentageScale(0.5),
  },
  storeTimerContainer: {
    flexDirection: 'row',
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
  addButton: {
    borderRadius: 9999,
    backgroundColor: colors.primaryGreen,
    position: 'absolute',
    padding: scale(7.5),
    right: 8,
    bottom: 5,
    zIndex: 2,
  },
  moreInfoButton: {
    backgroundColor: colors.extraLightGrey,
    borderRadius: 45,
    gap: 7,
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(8),
    overflow: 'hidden',
    top: vs(10),
    position: 'absolute',
    right: scale(10),
  },
  separator: {
    borderWidth: 0.7,
    borderColor: colors.grey,
    marginTop: vs(10),
  },
  flatListStyle: {
    marginTop: vs(10),
    overflow: 'visible',
  },
  bannerCard: {
    backgroundColor: colors.primaryGreen,
    paddingHorizontal: vs(10),
    paddingVertical: scale(10),
    width: scale(200),
    borderRadius: moderateScale(20),
    gap: vs(8),
    marginLeft: scale(15),
  },
  featuredItemsContainer: {
    marginTop: vs(5),
    paddingHorizontal: scale(15),
    gap: 8,
  },
  popularItemsContainer: {
    marginTop: vs(5),
    paddingHorizontal: scale(15),
    gap: vs(8),
  },
  popularItemCard: {
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: moderateScale(7.5),
    flexDirection: 'row',
    overflow: 'hidden',
  },
  popularItemDescription: {
    gap: vs(8),
    width: '70%',
    padding: scale(10),
  },
  popularItemImage: {
    height: '100%',
    width: '30%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  imageHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: vs(50),
    alignItems: 'center',
  },
  backSVG: {
    left: scale(7),
  },
  productSearch: {
    right: scale(15),
  },
  bannerDescription: {
    fontSize: moderateScale(12),
  },
  fullMenuButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customModalContainer: {
    paddingHorizontal: scale(20),
    paddingTop: vs(10),
  },
  modalHeader: {
    gap: vs(5),
  },
  menuItem: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: colors.grey,
    paddingVertical: vs(8),
    justifyContent: 'space-between',
    marginTop: vs(8),
  },
  listEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customTextStyle: {
    marginHorizontal: 20,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 100,
    // marginBottom: 8,
    // zIndex: 1,
    // width: '100%',
    backgroundColor: colors.lightGrey,
  },

  searchMainContiner: {
    position: 'absolute',
    zIndex: 1,
    // left: 60,
    // right: 40,
    // minHeight: 38,
    height: widthPercentageScale(10),
    justifyContent: 'center',
    width: '68%',
    backgroundColor: colors.white,
    paddingHorizontal: scale(12),
    borderRadius: moderateScale(25),
    alignSelf: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  crossIcon: {
    position: 'absolute',
    zIndex: 10,
    alignSelf: 'center',
    right: scale(10),
  },
  cartDetailsBox: {
    backgroundColor: colors.orange50,
    width: widthPercentageScale(95),
    alignSelf: 'center',
    // alignItems: 'center',
    // flexDirection: 'row',

    paddingHorizontal: scale(12),
    paddingVertical: scale(13),
    borderRadius: scale(8),
    bottom: vs(10),
    left: 2,
    gap: 10,
  },
});
