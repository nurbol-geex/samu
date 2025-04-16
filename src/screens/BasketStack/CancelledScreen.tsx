import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
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
import {AppDispatch, RootState} from 'src/redux';
import {useDispatch, useSelector} from 'react-redux';
import {dateFormater, formatPrice} from 'src/utils';
import {
  fetchOrdersByCancelled,
  resetCancelledReducer,
} from 'src/redux/orders/thunk/getAllOrders';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {Route} from 'src/routes/Route';
import {showToast} from 'src/components/shared/CustomToast/toastUtils';
import {CustomTouchableSVG} from 'src/components/shared/CustomTouchableSVG';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

const CancelledScreen = ({route}) => {
  const dispatchStore: AppDispatch = useDispatch();
  const navigation = useNavigation<NavigationProp<any>>();
  const flatListRef = useRef<FlatList>(null); // Create a ref for the FlatList

  const [openDropDown, setopenDropDown] = useState(false);
  const [value, setValue] = useState('latest');
  const [items, setItems] = useState([
    {label: 'Latest first', value: 'latest'},
    {label: 'Oldest first', value: 'oldest'},
  ]);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const {
    cancelledOrdersData: {orders: ordersData, totalCount},
    loading: ordersLoading,
  } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    dispatchStore(
      fetchOrdersByCancelled({
        page: page,
        pageSize: 10,
        status: 'cancelled',
        sortBy: value,
      }),
    );
  }, [page, dispatchStore]);

  useEffect(() => {
    if (route?.params?.cancelOrderBtn) {
      navigation.setParams({cancelOrderBtn: false});
    }
  }, [route?.params?.cancelOrderBtn]);

  const handleSortBy = (sortBy: any) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({animated: true, offset: 0});
      dispatchStore(resetCancelledReducer());
      dispatchStore(
        fetchOrdersByCancelled({
          page: 1,
          pageSize: 10,
          status: 'cancelled',
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
  const uniqueOrders = ordersData?.filter(
    (order, index, self) => index === self.findIndex(o => o.id === order.id)
  );
  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    dispatchStore(resetCancelledReducer());
    dispatchStore(
      fetchOrdersByCancelled({
        page: 1,
        pageSize: 10,
        status: 'cancelled',
        sortBy: value,
      }),
    ).finally(() => setRefreshing(false));
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <CustomText textColor={colors.dark} text="No cancelled orders found" variant="h4" />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.scrollViewContentContainer}>
        <View style={styles.heading}>
          <View>
            <CustomText
              text="Order History"
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
              onPress={() => {
                if (item.store) {
                  navigation?.navigate(Route.OrderDetails, {
                    orderId: item?.id,
                  });
                } else {
                }
              }}>
              <View style={styles.cardContainer}>
                <View>
                  <CustomText
                    text={`Order: #${item?.orderNumber}`}
                    textColor={colors.darkGreen}
                    variant="h4"
                  />
                  <CustomText
                    style={{marginTop: vs(6)}}
                    text={dateFormater(item?.createdAt)}
                    textColor={colors.dark}
                    variant="small"
                  />
                </View>
                <View style={styles.priceContainer}>
                  <View style={styles.completedContainer}>
                    <CustomText
                      text={item.currentStatus}
                      textColor={colors.red400}
                      variant="small"
                    />
                  </View>
                  <CustomText
                    style={{fontWeight: '600'}}
                    text={`${formatPrice(item?.paymentDetail?.total)}`}
                    textColor={colors.darkGreen}
                    variant="Figtree"
                  />
                </View>
              </View>
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

export default CancelledScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollViewContentContainer: {
    paddingVertical: vs(15),
    paddingHorizontal: scale(20),
    flexGrow: 1,
    marginBottom: vs(40),
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
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.grey,
    paddingVertical: vs(12),
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
  priceContainer: {
    gap: vs(6),
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  completedContainer: {
    backgroundColor: colors.red50,
    paddingVertical: vs(6),
    paddingHorizontal: vs(10),
    borderRadius: moderateScale(6),
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
