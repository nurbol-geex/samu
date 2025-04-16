import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Platform,
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {CustomHeader} from 'src/components/shared/CustomHeader';
import {CustomStatusBar} from 'src/components/shared/CustomStatusBar';
import {colors} from 'src/theme/colors';
import {moderateScale, scale, vs} from 'react-native-size-matters';
import {
  heightPercentageScale,
  widthPercentageScale,
} from 'src/theme/dimensions';
import {useDispatch, useSelector} from 'react-redux';
import {RootState, useReduxSelector} from 'src/redux';
import {
  selectSearchStoreIsLoading,
  selectSearchStores,
} from 'src/redux/home/selectors';
import {SEARCH_STORES} from 'src/redux/home/constants';
import {CustomText} from 'src/components/shared/CustomText';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {CustomTouchableSVG} from 'src/components/shared/CustomTouchableSVG';
import CrossSVG from 'assets/svg/CrossSVG';
import SearchBar from 'src/components/shared/CustomSearch';
import StoreSection from 'src/components/pageSections/HomeCard/StoreSection';
import DeviceInfo from 'react-native-device-info';
import BannerSection from 'src/components/pageSections/HomeCard/BannerSection';
import HeaderSection from 'src/components/pageSections/HomeCard/HeaderSection';
import {selectProductGetCartIsLoading} from 'src/redux/cart/selectors';
import CustomFilter from 'src/components/shared/CustomFilter/CustomFIlter'; // Assuming your filter is named as this
import {useNavigation} from '@react-navigation/native';
import {Route} from 'src/routes/Route';
import CategoryTabs from 'src/components/pageSections/FilterTabsBoard/CategoryTabs';

const CategoryScreen = ({route}: any) => {
  const {id, name} = route.params; // new
  const navigation = useNavigation();
  const {
    user: {accessToken, isGuest,lat,lng},
  } = useReduxSelector(store => ({user: store.user}));
 
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [load, setLoad] = useState(false);
  const searchAnim = useRef(new Animated.Value(0)).current;
  const hasNotch = DeviceInfo.hasNotch();
  const [allFilters, setAllFilters] = useState({
    priceRange: null,
    reviewScore: null,
    topRated: false,
    freeDelivery: false,
    quickDelivery: false,
  });

  const dispatchStore = useDispatch();
  const searchStoresData = useReduxSelector(selectSearchStores);
  // const allStores =
  //   searchStoresData?.find((section: any) => {
  //     return section?.type === 'all-store';
  //   })?.stores ?? [];

  const searchStoresIsLoading = useReduxSelector(selectSearchStoreIsLoading);

  let getCategories = searchStoresData?.find(
    item => item.type === 'categories',
  );

  let tabData = getCategories?.categories?.find(item => item.name === name);

  let {
    primaryAddress: {geometry},
  } = useSelector((state: RootState) => state.addresses);

  const handleShowSearch = () => {
    if (showSearch) {
      // Animate search view up
      Animated.timing(searchAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setShowSearch(false);
      });
    } else {
      setShowSearch(true);
      // Animate search view down
      Animated.timing(searchAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const searchTranslateY = searchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, 55], // Adjust these values as needed
  });

  // Fetch and filter data based on selected filters without refreshing the full screen
  useEffect(() => {
    if (id) {
      const filteredStores = searchStoresData.filter(store => {
        return (
          (!allFilters.priceRange ||
            store.priceRange === allFilters.priceRange) &&
          (!allFilters.reviewScore ||
            store.reviewScore >= allFilters.reviewScore) &&
          (!allFilters.topRated || store.topRated) &&
          (!allFilters.freeDelivery || store.freeDelivery) &&
          (!allFilters.quickDelivery || store.quickDelivery)
        );
      });
      setFilteredData(filteredStores); // Update only the filtered data
    }
  }, [allFilters, searchStoresData, id]);

  useEffect(() => {
    if (searchValue && id) {
      const handler = setTimeout(() => {
        dispatchStore({
          type: SEARCH_STORES,
          payload: {
            keyword: searchValue,
            longitude: geometry.longitude,
            latitude: geometry.latitude,
            options: {
              categories: [id],
              priceRange: allFilters.priceRange,
              reviewScore: allFilters.reviewScore,
              topRated: allFilters.topRated,
              freeDelivery: allFilters.freeDelivery,
              quickDelivery: allFilters.quickDelivery,
            },
          },
        });
      }, 800);
      return () => clearTimeout(handler);
    }
  }, [dispatchStore, searchValue, id, geometry, allFilters]);

  useEffect(() => {
    if (id) {
      const longitude = isGuest ? lng : geometry.longitude;
      const latitude = isGuest ? lat : geometry.latitude;
  
      dispatchStore({
        type: SEARCH_STORES,
        payload: {
          keyword: '',
          longitude,
          latitude,
          options: {
            categories: [id],
            priceRange: allFilters.priceRange,
            reviewScore: allFilters.reviewScore,
            topRated: allFilters.topRated,
            freeDelivery: allFilters.freeDelivery,
            quickDelivery: allFilters.quickDelivery,
          },
        },
      });
    }
  }, [dispatchStore, id, isGuest, lat, lng, geometry, allFilters]);
  

  const handleRefresh = () => {
    // Dispatch actions to fetch data
    dispatchStore({
      type: SEARCH_STORES,
      payload: {
        keyword: searchValue,
        longitude: geometry.longitude,
        latitude: geometry.latitude,
        options: {
          categories: [id],
          priceRange: allFilters.priceRange,
          reviewScore: allFilters.reviewScore,
          topRated: allFilters.topRated,
          freeDelivery: allFilters.freeDelivery,
          quickDelivery: allFilters.quickDelivery,
        },
      },
    });
  };

  const renderSectionItem = ({item, section}: any) => {
    switch (section?.type) {
      case 'store-carousel':
        return <StoreSection item={item} id={item._id} />;
      case 'all-store':
        return <StoreSection item={item} id={item._id} />;
      default:
        return null;
    }
  };

  const onTabChange = (tabValue: object) => {
    const selectedTab = tabData?.children?.find(
      tab => tab.name === tabValue?.name,
    );
    if (selectedTab) {
      navigation.navigate(Route.CategoryScreen, {
        id: selectedTab.id,
        name: selectedTab.name,
      });
    } else {
      console.log('Selected tab not found');
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <CustomStatusBar backgroundColor={colors.primaryGreen} />
      <CustomHeader
        title={name?.toUpperCase() || 'CATEGORIES'}
        titleColor={colors.white}
        containerBackgroundColor={colors.primaryGreen}
        startButtonIconType="back"
        endButtonIconType={'search'}
        handleSearch={handleShowSearch}
      />
      {showSearch && (
        <Animated.View
          style={[
            styles.searchMainContainer,
            {
              top:
                Platform.OS === 'ios'
                  ? hasNotch
                    ? widthPercentageScale(1)
                    : widthPercentageScale(-8.5)
                  : widthPercentageScale(-9.6),
              transform: [{translateY: searchTranslateY}],
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
              placeholder="Search Stores"
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
        </Animated.View>
      )}
      {tabData?.children.length > 0 && (
        <View>
          <CategoryTabs
            tabs={tabData?.children}
            onChange={e => onTabChange(e)}
          />
        </View>
      )}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: vs(20),
          flexGrow: searchStoresData || !searchStoresData?.length ? 1 : 0,
        }}
        refreshControl={
          <RefreshControl
            style={{zIndex: 1}}
            refreshing={searchStoresIsLoading}
            onRefresh={handleRefresh}
            tintColor={colors.green300}
          />
        }
        style={styles.mainContainer}>
        {searchStoresIsLoading && !load ? (
          <View style={styles.loadingContainer} />
        ) : searchStoresData?.length ? (
          searchStoresData.map((section: any, index: number) => {
            const data = Object.keys(section)
              .filter(key => Array.isArray(section[key]))
              .flatMap(key => section[key]);

            if (section.type === 'banners') {
              return <BannerSection key={index} item={section?.sliders} />;
            }

            if (section.type === 'store-carousel') {
              return (
                <View key={index}>
                  {/* <HeaderSection section={section} /> */}
                  <CustomText
                    text="Trending"
                    variant="h4"
                    textColor={colors.darkGreen}
                    numberOfLines={1}
                    // style={{alignSelf: 'center'}}
                  />
                  {/* <CustomFilter /> */}
                  <FlatList
                    horizontal={true}
                    data={data}
                    // numColumns={2} // Set the number of columns to 2
                    keyExtractor={(_, i) => i.toString()}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item}) => {
                      return renderSectionItem({section, item}); // Adjust the render method if needed
                    }}
                  />
                </View>
              );
            }

            if (section.type === 'all-store') {
              return (
                <View key={index}>
                
                  {/* {allStores.stores.length > 0 &&  */}
                  <CustomFilter
                    allFilters={allFilters}
                    setLoad={setLoad}
                    setAllFilters={setAllFilters}
                  />
                    <HeaderSection section={section} />
                  {/* } */}
                  <FlatList
                    data={data}
                    numColumns={2} // Set the number of columns to 2
                    keyExtractor={(_, i) => i.toString()}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                      <View style={styles.loadingContainer}>
                        <CustomText
                          text="No Result Found"
                          variant="h4"
                          textColor={colors.darkGreen}
                          numberOfLines={1}
                        />
                      </View>
                    }
                    renderItem={({item}) => {
                      return renderSectionItem({section, item}); // Adjust the render method if needed
                    }}
                  />
                </View>
              );
            }
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
          // <></>
        )}
      </ScrollView>
      {/* {searchStoresIsLoading ? (
        <View style={styles.centeredContainer}>
          <ActivityIndicator size={'large'} color={colors.darkGreen} />
        </View>
      ) : (
        searchStoresData.length < 0 && (
          <View style={styles.loadingContainer}>
            <CustomText
              text={'No Result Found'}
              variant="h4"
              textColor={colors.darkGreen}
              numberOfLines={1}
              style={{alignSelf: 'center'}}
            />
          </View>
        )
      )} */}
    </View>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: widthPercentageScale(2),
  },
  searchMainContainer: {
    position: 'absolute',
    zIndex: 1,
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
    right: 0,
    paddingRight: moderateScale(5),
  },
  loadingContainer: {

    alignSelf:'center',
    marginTop:vs(10)
  },
  centeredContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: vs(20),
  },
  separator: {
    height: heightPercentageScale(2),
    width: '100%',
  },
});
