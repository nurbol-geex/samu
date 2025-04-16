import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import {CustomHeader} from 'src/components/shared/CustomHeader';
import {CustomStatusBar} from 'src/components/shared/CustomStatusBar';
import {colors} from 'src/theme/colors';
import {moderateScale, scale, vs} from 'react-native-size-matters';
import {
  heightPercentageScale,
  widthPercentageScale,
} from 'src/theme/dimensions';
import {fontFamilies} from 'src/theme/textVariants';
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
import CustomFilter from 'src/components/shared/CustomFilter/CustomFIlter';

const Stores = ({route}: any) => {
  const storeTitle = route?.params?.title;
  const storeQuery = route?.params?.query;
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const searchAnim = useRef(new Animated.Value(0)).current;
  const hasNotch = DeviceInfo.hasNotch();
  const [load, setLoad] = useState(false);
  const [allFilters, setAllFilters] = useState({
    priceRange: null,
    reviewScore: null,
    topRated: false,
    freeDelivery: false,
    quickDelivery: false,
  });

  const dispatchStore = useDispatch();
  const searchStoresData = useReduxSelector(selectSearchStores);
  const allStores =
    searchStoresData?.find((section: any) => {
      return section?.type === 'all-store';
    })?.stores ?? [];

  const searchStoresIsLoading = useReduxSelector(selectSearchStoreIsLoading);
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
  const onTabChange = (tabValue: string) => {
    console.log(tabValue);
  };

  useEffect(() => {
    if (searchValue) {
      const handler = setTimeout(() => {
        dispatchStore({
          type: SEARCH_STORES,
          payload: {
            keyword: searchValue,
            longitude: geometry.longitude,
            latitude: geometry.latitude,
            options: {
              categories: [],
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
  }, [dispatchStore, searchValue, geometry.allFilters]);
  useEffect(() => {
    if (storeQuery) {
      dispatchStore({
        type: SEARCH_STORES,
        payload: {
          keyword: storeQuery,
          longitude: geometry.longitude,
          latitude: geometry.latitude,
          options: {
            categories: [],
            priceRange: allFilters.priceRange,
            reviewScore: allFilters.reviewScore,
            topRated: allFilters.topRated,
            freeDelivery: allFilters.freeDelivery,
            quickDelivery: allFilters.quickDelivery,
          },
        },
      });
    }
  }, [dispatchStore, storeQuery, geometry,allFilters]);

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <CustomStatusBar backgroundColor={colors.primaryGreen} />

      <CustomHeader
        title={storeTitle.toUpperCase()}
        titleColor={colors.white}
        containerBackgroundColor={colors.primaryGreen}
        startButtonIconType="back"
        endButtonIconType={'search'}
        handleSearch={handleShowSearch}
      />

      {showSearch && (
        <Animated.View
          style={[
            styles.searchMainContiner,
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
      <CustomFilter allFilters={allFilters} setAllFilters={setAllFilters}  setLoad={setLoad}/>
      <View style={styles.separator} />
      {searchStoresIsLoading ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size={'large'} color={colors.darkGreen} />
        </View>
      ) : allStores.length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          numColumns={2}
          data={allStores}
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
          keyExtractor={(_, i) => i.toString()}
          renderItem={({item}) => {
            return (
              <StoreSection
                cardStyle={{marginHorizontal: widthPercentageScale(2)}}
                item={item}
                id={item._id}
              />
            );
          }}
        />
      ) : (
        <View style={styles.loadingContainer}>
          <CustomText
            text={'No Result Found'}
            variant="h4"
            textColor={colors.darkGreen}
            numberOfLines={1}
          />
        </View>
      )}
    </View>
  );
};

export default Stores;

const styles = StyleSheet.create({
  tabContainer: {
    marginTop: heightPercentageScale(1.2),
    paddingHorizontal: widthPercentageScale(3),
  },
  container: {
    marginTop: vs(12),
    paddingHorizontal: vs(4),
    flexDirection: 'row',
    width: widthPercentageScale(100),
    justifyContent: 'space-around',
    zIndex: 1,
  },
  dropdown: {
    borderColor: colors.gray73,
    backgroundColor: colors.grey,
  },
  dropdownContainer: {
    width: widthPercentageScale(25),
  },
  dropdownContainerCustom: {
    width: widthPercentageScale(42),
  },
  dropdownInnerContainer: {
    borderColor: colors.gray73,
    backgroundColor: colors.grey,
  },
  label: {
    fontFamily: fontFamilies.medium,
    fontWeight: '500',
    fontSize: moderateScale(13.08), //16,
    color: colors.darkGreen,
  },
  separator: {
    borderWidth: 0.5,
    borderColor: colors.grey,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop:vs(10)
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
    right: scale(10),
  },
});
