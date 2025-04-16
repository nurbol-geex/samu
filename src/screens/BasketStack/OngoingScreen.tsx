import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  View,
  RefreshControl,
} from 'react-native';
import {colors} from 'src/theme/colors';
import {moderateScale, scale, vs} from 'react-native-size-matters';
import {CustomText} from 'src/components/shared/CustomText';
import DropDownPicker from 'react-native-dropdown-picker';
import {widthPercentageScale} from 'src/theme/dimensions';
import {fontFamilies} from 'src/theme/textVariants';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from 'src/redux';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {Route} from 'src/routes/Route';
import {formatPrice} from 'src/utils';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

import {
  fetchOrdersByActive,
  resetActiveReducer,
} from 'src/redux/orders/thunk/getAllOrders';
import {CustomTouchableSVG} from 'src/components/shared/CustomTouchableSVG';

const OngoingScreen = () => {
  const [openDropDown, setopenDropDown] = useState(false);
  const [value, setValue] = useState('latest');
  const [items, setItems] = useState([
    {label: 'Latest first', value: 'latest'},
    {label: 'Oldest first', value: 'oldest'},
  ]);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const {
    ordersData: {orders: ordersData, totalCount},
    loading: ordersLoading,
  } = useSelector((state: RootState) => state.orders);

  const navigation = useNavigation<NavigationProp<any>>();
  const dispatchStore: AppDispatch = useDispatch();
  const flatListRef = useRef<FlatList>(null); // Create a ref for the FlatList

  useEffect(() => {
    dispatchStore(
      fetchOrdersByActive({
        page: page,
        pageSize: 10,
        status: 'active',
        sortBy: value,
      }),
    );
  }, [dispatchStore, page]);

  const handleSortBy = (sortBy: any) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({animated: true, offset: 0});
      dispatchStore(resetActiveReducer());
      dispatchStore(
        fetchOrdersByActive({
          page: 1,
          pageSize: 10,
          status: 'active',
          sortBy: sortBy,
        }),
      );
    }
  };

  const handleLoadMore = () => {
    if (!ordersLoading && totalCount > ordersData?.length) {
      setPage(prev => prev + 1);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    dispatchStore(resetActiveReducer());
    dispatchStore(
      fetchOrdersByActive({
        page: 1,
        pageSize: 10,
        status: 'active',
        sortBy: value,
      }),
    ).finally(() => setRefreshing(false));
  };
  const uniqueOrders = ordersData?.filter(
    (order, index, self) => index === self.findIndex(o => o.id === order.id),
  );
  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <CustomText
        textColor={colors.dark}
        text="No active orders found"
        variant="h4"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View
        // showsVerticalScrollIndicator={false}
        style={styles.scrollViewContentContainer}>
        <View style={styles.heading}>
          <View>
            <CustomText
              text="Ongoing Orders"
              textColor={colors.black}
              variant="h4"
            />
          </View>
          <DropDownPicker
            autoScroll
            ArrowDownIconComponent={() => (
              <Entypo color={colors.darkGreen} size={20} name="chevron-down" />
            )}
            ArrowUpIconComponent={() => (
              <Entypo color={colors.darkGreen} size={20} name="chevron-up" />
            )}
            TickIconComponent={() => (
              <FontAwesome6 color={colors.darkGreen} size={14} name="check" />
            )}
            arrowIconContainerStyle={{paddingRight: scale(8)}}
            tickIconContainerStyle={{paddingRight: scale(10)}}
            placeholder="Sort by"
            style={styles.dropdown}
            containerStyle={styles.dropdownContainer}
            dropDownContainerStyle={styles.dropdownInnerContainer}
            open={openDropDown}
            value={value}
            items={items}
            setOpen={setopenDropDown}
            setValue={setValue}
            setItems={setItems}
            textStyle={styles.label}
            listItemLabelStyle={styles.label}
            onSelectItem={e => handleSortBy(e.value)}
          />
        </View>
        <FlatList
          ref={flatListRef} // Attach the ref to FlatList
          showsVerticalScrollIndicator={false}
          data={uniqueOrders}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <CustomTouchableSVG
              onPress={() =>
                navigation?.navigate(Route.OrderDetails, {orderId: item?.id})
              }
              containerStyle={styles.cardContainer}>
              <View style={{width: '100%'}}>
                <View
                  style={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <CustomText
                    text={`Order#${item?.orderNumber}`}
                    textColor={colors.darkGreen}
                    variant="h4"
                  />
                  <View style={styles.circleContainer}>
                    <View style={styles.circle} />
                  </View>
                </View>
                <View
                  style={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row',
                    marginVertical: vs(12),
                  }}>
                  <CustomText
                    text={`${item?.store?.name}`}
                    textColor={colors.dark}
                    variant="small"
                    style={{width: '75%'}}
                  />
                  <CustomText
                    style={{fontWeight: '600'}}
                    text={`${formatPrice(item?.paymentDetail?.total)}`}
                    textColor={colors.green500}
                    variant="Figtree"
                  />
                </View>
                <View style={styles.statusContainer}>
                  <Image
                    style={styles.icon}
                    source={require('../../../assets/images/clock.png')}
                  />
                  <CustomText
                    text={`${
                      item?.currentStatus === 'pending'
                        ? 'Payment is pending'
                        : item?.currentStatus === 'processed'
                        ? 'Payment is proccessed'
                        : 'Order is ' + item?.currentStatus
                    }`}
                    textColor={colors.white}
                    variant="small"
                    style={{alignSelf: 'center'}}
                  />
                </View>
              </View>
              {/* <View style={styles.priceContainer}>
                <View style={styles.circleContainer}>
                  <View style={styles.circle} />
                </View>
                <CustomText
                  style={{fontWeight: '600'}}
                  text={`${formatPrice(item.total)}`}
                  textColor={colors.darkGreen}
                  variant="Figtree"
                />
              </View> */}
            </CustomTouchableSVG>
          )}
          ListFooterComponent={
            ordersLoading && !refreshing ? (
              <ActivityIndicator size={'small'} color={colors.darkGreen} />
            ) : null
          }
          onEndReached={() => handleLoadMore()}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={() =>
            !ordersLoading && ordersData?.length === 0 && renderEmptyComponent()
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.green300}
            />
          }
        />
      </View>
    </View>
  );
};

export default OngoingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollViewContentContainer: {
    paddingVertical: vs(15),
    paddingHorizontal: scale(20),
    flexGrow: 1,
    marginBottom: vs(50),
  },
  heading: {
    marginBottom: vs(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: vs(8),
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: moderateScale(16),
    padding: scale(12),
  },
  label: {
    left: scale(5),
    fontWeight: 700,
    fontSize: moderateScale(14.6),
    color: colors.darkGreen,
  },
  dropdown: {
    borderRadius: moderateScale(30),
    borderWidth: 0,
    backgroundColor: colors.inputBackgroundColor,
  },
  dropdownContainer: {
    width: 150,
    // width: widthPercentageScale(36),
  },
  dropdownInnerContainer: {
    borderWidth: 0,
    backgroundColor: colors.inputBackgroundColor,
  },
  statusContainer: {
    paddingVertical: vs(4),
    paddingHorizontal: scale(10),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryGreen,
    borderRadius: moderateScale(16),
    alignSelf: 'flex-start',
  },
  icon: {
    resizeMode: 'contain',
    marginRight: scale(6),
    width: scale(18),
    height: scale(18),
  },
  priceContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '25%',
  },
  circleContainer: {
    backgroundColor: colors.green100,
    padding: vs(6),
    borderRadius: scale(25 / 2),
    width: scale(25),
    height: scale(25),
    marginBottom: 5,
  },
  circle: {
    backgroundColor: colors.primaryGreen,
    width: scale(12),
    height: scale(12),
    borderRadius: moderateScale(12 / 2),
  },
  emptyContainer: {
    marginVertical: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: '40%',
  },
});
