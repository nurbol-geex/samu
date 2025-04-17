import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {CustomText} from '../../../components/shared/CustomText';
import {colors} from '../../../theme/colors';
import {useDispatch, useSelector} from 'react-redux';
import {useHeaderUserAddresses} from '../../../components/shared/CustomHomeHeader/useHeaderUserAddresses';
import {
  heightPercentageScale,
  widthPercentageScale,
} from 'src/theme/dimensions';
import {
  browesGridData,
  selectExploreSectionsIsLoading,
  selectHomeSections,
  selectHomeSectionsIsLoading,
  selectProductSearch,
  selectProductSearchIsLoading,
} from 'src/redux/home/selectors';
import {
  GET_EXPLORE_SECTIONS_REQUEST,
  GET_USER_PRODUCT_COLLECTIONS,
} from 'src/redux/home/constants';
import HomeHeader from 'src/components/shared/CustomHomeHeader';
import SelectAddressModal from 'src/components/shared/CustomAddressModal';
import CategorySection from 'src/components/pageSections/HomeCard/CategorySection';
import {RootState, useReduxSelector} from 'src/redux';
import RecentSearches from './RecentSearch';
import {ShopProductsCard} from 'src/components/pageSections/ShopProductsCard';
import {selectUser} from 'src/redux/user/selectors';
import {CustomSkeletonLoader} from 'src/components/shared/CustomSkeletonLoader';
import {FilterTabsBoard} from 'src/components/pageSections/FilterTabsBoard';
import {scale, vs} from 'react-native-size-matters';
import {ANALYTICS} from 'src/redux/user/constants';
import {appsFlyerTrackEvent } from 'src/utils';
import {Route} from 'src/routes/Route';
import {useNavigation} from '@react-navigation/native';
import CategoryTabs from 'src/components/pageSections/FilterTabsBoard/CategoryTabs';
import { useAnalytics } from 'src/segmentService';

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  mainContainer: {
    flex: 1,
    paddingTop: heightPercentageScale(1),
    paddingHorizontal: widthPercentageScale(2),
  },
  browseTitle: {
    marginStart: widthPercentageScale(2),
    color: colors.darkGreen,
    fontSize: widthPercentageScale(7.4),
  },
  browseContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  card: {
    backgroundColor: colors.white,
    marginTop: heightPercentageScale(-5),
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    fontFamily: 'Figtree-Regular',
    color: colors.green700,
    padding: vs(10),
    bottom: vs(15),
  },
  tabContainer: {
    paddingHorizontal: widthPercentageScale(3),
  },
  categoryContainer: {
    width: widthPercentageScale(20),
    height: widthPercentageScale(24),
    marginLeft: widthPercentageScale(3),
    marginTop: heightPercentageScale(2),
  },
  categoryImageContainer: {
    height: widthPercentageScale(22),
    width: widthPercentageScale(22),
    position: 'relative',
  },
  categoryImage: {
    marginBottom: scale(16),
    width: widthPercentageScale(12),
    height: widthPercentageScale(12),
  },
  categoryText: {
    position: 'absolute',
    bottom: scale(8),
  },
});

export default function BrowseScreen({section}) {
  const navigation = useNavigation();
  const dispatchStore = useDispatch();
  const [searchingEnabled, setSearchingEnabled] = useState(false);
  const [selectedTabData, setSelectedTabData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const { track } = useAnalytics()
  const homeSections = useReduxSelector(selectHomeSections);
  const homeSectionsLoading = useReduxSelector(selectHomeSectionsIsLoading);
  const isProductSearchDataLoad = useReduxSelector(
    selectProductSearchIsLoading,
  );

  let getCategories = homeSections?.find(item => item.type === 'categories');
  const user = useReduxSelector(str => str.user);
  const {
    user: {accessToken, isGuest},
  } = useReduxSelector(store => ({user: store.user}));

  const productSearchData = useReduxSelector(selectProductSearch);
  const {
    primaryAddress: {street, city, unit, typeOfPlace},
  } = useSelector((state: RootState) => state.addresses);

  useEffect(() => {
    dispatchStore({type: GET_EXPLORE_SECTIONS_REQUEST});
    dispatchStore({type: GET_USER_PRODUCT_COLLECTIONS});
  }, [dispatchStore]);

  const {addressModalVisible, setAddressModalVisible, onAddNewAddressPress} =
    useHeaderUserAddresses(true);
  const {searchKey} = useReduxSelector(selectUser);

  const onTabChange = (tabValue: object) => {
    setSelectedCategory(tabValue?.name);
    const selectedTab = getCategories?.categories?.find(
      item => item.name === tabValue?.name,
    );
    const selectedTabEmptyData = tabData.find(
      tab => tab.name === tabValue?.name,
    );

    if (selectedTab?.children?.length > 0) {
      setSelectedTabData(selectedTab?.children);
    } else {
      navigation.navigate(Route.CategoryScreen, {
        id: selectedTabEmptyData.id,
        name: selectedTabEmptyData.name,
      });
      setSelectedTabData([]);
    }
  };

  const multiColors = [
    '#FEF6F9',
    '#F6FEFB',
    '#F6F7FE',
    '#FEFCF6',
    '#FEF6F9',
    '#F6F7FE',
    '#F6FBFE',
    '#FEF6F9',
    '#FCFEF6',
    '#F6FEFA',
    '#F6F7FE',
    '#FEF6F9',
    '#F6FEFE',
    '#FEFEFE',
    '#F6FEF8',
    '#FEFCF6',
    '#FEF6F9',
    '#FEF6F9',
    '#FEF6F9',
    '#FEF6F9',
    '#FEF6F9',
    '#FEF6F9',
    '#FEF6F9',
    '#FEF6F9',
  ];

  const onSearchAnalytics = searchKey => {
   
      track('Searched', {searchKey});
      dispatchStore({
        type: ANALYTICS,
        payload: {
          eventType: 'searchPlaced',
          data: {
            searchQuery: searchKey,
            userId: user?.email,
            sessionId: accessToken,
          },
        },
      });
    
  };

  useEffect(() => {
    if (searchKey) {
      onSearchAnalytics(searchKey); // Dispatch analytics when search key is set
    }
  }, [searchKey]);
  useEffect(() => {
    // Automatically select "Restaurants" category tab if it exists
    if (getCategories) {
      const restaurantsCategory = getCategories?.categories?.find(
        item => item.name === 'Restaurants',
      );
      if (restaurantsCategory) {
        setSelectedCategory(restaurantsCategory.name);
        setSelectedTabData(restaurantsCategory.children || []);
      }
    }
  }, [getCategories]);
  const categoriesObject = homeSections.find(obj => obj.type === 'categories');
  let tabData: tab[] = [];
  if (categoriesObject) {
    tabData = categoriesObject?.categories?.map(slider => ({
      id: slider.id,
      name: slider.name,
      value: slider.name.toLowerCase(),
    }));
  } else {
    console.log('Categories not found');
  }

  useEffect(() => {
    if (productSearchData.length) {
      productSearchData.forEach((item, index) => {
        setTimeout(() => {
          const eventData = {
            storeName: item.name,
            storeId: item._id,
          };
          track('Search Result', {...eventData});

          dispatchStore({
            type: ANALYTICS,
            payload: {
              eventType: 'searchResult',
              data: {
                searchQuery: searchKey,
                selectedItem: item._id,
                userId: user?.email,
                sessionId: accessToken,
              },
            },
          });
             appsFlyerTrackEvent('af_search', {
              af_search_string: searchKey,
              af_search_success: 'search_success',
              });

          console.log(
            `Event ${index + 1} Sent for Store:`,
            eventData.storeName,
          );
        }, index * 1000); // Add a 100ms delay between events
      });
    }
  }, [productSearchData]);

  const renderSectionItem = ({item, section, index}: any) => {
    return (
      <CategorySection
        containerStyle={styles.categoryContainer}
        imageContainerStyle={styles.categoryImageContainer}
        imageStyle={styles.categoryImage}
        titleStyle={styles.categoryText}
        bgColor={
          multiColors[
            index < multiColors.length ? index : index % multiColors.length
          ]
        }
        item={item}
      />
    );
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <HomeHeader
        onPressAddressBar={() => setAddressModalVisible(true)}
        selectedAddress={
          city && street
            ? `${
                typeOfPlace === 'Apartment'
                  ? unit + ', ' + street + ', ' + city
                  : street + ', ' + city
              }`
            : 'Select your address'
        }
        // inputDisable={true}
      />

      <SelectAddressModal
        isVisible={addressModalVisible}
        setVisible={setAddressModalVisible}
        onAddNewAddressPress={onAddNewAddressPress}
      />
      <View style={styles.tabContainer}>
        <CategoryTabs
          tabs={tabData}
          onChange={e => onTabChange(e)}
          active={selectedCategory}
        />
      </View>

      <ScrollView
        contentContainerStyle={{
          flexGrow: homeSectionsLoading || !homeSections?.length ? 1 : 0,
        }}
        style={styles.mainContainer}>
        {selectedTabData?.length > 0 && (
          <View>
            <CustomText
              style={styles.title}
              text="Categories"
              textColor={colors.darkGreen}
              numberOfLines={1}
            />
            {homeSectionsLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.darkGreen} />
              </View>
            ) : (
              <View style={{bottom: vs(35)}}>
                <FlatList
                  data={selectedTabData}
                  horizontal
                  keyExtractor={(_, i) => i.toString()}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item, index}) =>
                    renderSectionItem({item, index})
                  }
                />
              </View>
            )}
          </View>
        )}

        {isProductSearchDataLoad ? (
          <CustomSkeletonLoader />
        ) : productSearchData?.length && searchKey ? (
          productSearchData.map((item, index) => {

            return (
              <View key={index} style={styles.card}>
                <ShopProductsCard item={item} />
              </View>
            );
          })
        ) : searchKey ||
          (searchingEnabled &&
            productSearchData?.length === 0 &&
            !isProductSearchDataLoad) ? (
          <View style={styles.loadingContainer}>
            <CustomText
              text={'No Result Found'}
              variant="h5"
              textColor={colors.darkGreen}
              numberOfLines={1}
            />
          </View>
        ) : (
           <RecentSearches /> // Render RecentSearches only if not a guest
        )}
      </ScrollView>
    </View>
  );
}
