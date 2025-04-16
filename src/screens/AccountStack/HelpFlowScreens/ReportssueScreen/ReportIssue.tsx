import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {CustomStatusBar} from 'src/components/shared/CustomStatusBar';
import {CustomHeader} from 'src/components/shared/CustomHeader';
import {colors} from 'src/theme/colors';
import {CustomText} from 'src/components/shared/CustomText';
import {moderateScale, scale, vs} from 'react-native-size-matters';
import {CustomTouchableSVG} from 'src/components/shared/CustomTouchableSVG';
import {Route} from 'src/routes/Route';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import axios from 'axios';
import moment from 'moment';
import {formatPrice} from 'src/utils';
import {useReduxSelector} from 'src/redux';
import {fontFamilies} from 'src/theme/textVariants';
import {getBaseUrlFromStorage} from 'src/utils/SetENV';

const ReportIssue: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any, any>>();
  const [ordersData, setOrdersData] = useState<ReportIssueOrder[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const user = useReduxSelector(
    (state: {user: ReportIssueUserState}) => state.user,
  );

  const fetchActiveOrders = async () => {
    try {
      const response = await axios.get<{orders: ReportIssueOrder[]}>(
        `${getBaseUrlFromStorage()}/user/order?page=1&pageSize=10&sortBy=latest&status=active`,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        },
      );
      const sortedOrders = response.data.orders.sort((a, b) => {
        return Number(b.orderNumber) - Number(a.orderNumber);
      });
      setOrdersData(prevState => [...prevState, ...sortedOrders]);
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
      setIsLoading(false);
    }
  };

  const fetchCompletedOrders = async () => {
    try {
      const response = await axios.get<{orders: ReportIssueOrder[]}>(
        `${getBaseUrlFromStorage()}/user/order?page=1&pageSize=10&sortBy=latest&status=completed`,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        },
      );
      const sortedOrders = response.data.orders.sort((a, b) => {
        return Number(b.orderNumber) - Number(a.orderNumber);
      });
      setOrdersData(prevState => [...prevState, ...sortedOrders]);
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveOrders();
    fetchCompletedOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setOrdersData([]);
    fetchActiveOrders();
    fetchCompletedOrders();
  };

  return (
    <View style={styles.mainContainer}>
      <CustomStatusBar backgroundColor={colors.primaryGreen} />
      <CustomHeader
        containerStyle={styles.headerContainer}
        title="REPORT AN ISSUE"
        titleColor={colors.white}
        containerBackgroundColor={colors.primaryGreen}
        startButtonIconType="back"
      />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.select<'height' | 'position' | 'padding'>({
          ios: 'padding',
          android: undefined,
        })}>
        {isLoading ? (
          <View style={styles.centeredContainer}>
            <ActivityIndicator size="large" color={colors.primaryGreen} />
          </View>
        ) : ordersData.length === 0 && !isLoading && !refreshing ? (
          <View style={styles.centeredContainer}>
            <CustomText
              style={styles.noDataText}
              textColor={colors.darkGreen}
              text="No recent orders"
              variant="h2"
            />
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContentContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            {!isLoading && !refreshing && (
              <CustomText
                style={styles.heading}
                textColor={colors.black}
                text={`Last ${ordersData.length} Orders`}
                variant="h4"
              />
            )}

            {ordersData.map(item => (
              <CustomTouchableSVG
                key={item.orderNumber}
                onPress={() => {
                  navigation.navigate(Route.ChooseIssue, {
                    orderId: item.orderNumber,
                  });
                }}
                containerStyle={styles.cardContainer}>
                <View style={styles.gap}>
                  <CustomText
                    textColor={colors.darkGreen}
                    text={`Order: #${item.orderNumber}`}
                    variant="Figtree"
                  />
                  {(item.currentStatus === 'completed' ||
                    item.currentStatus === 'cancelled' ||
                    item.currentStatus === 'processed') && (
                    <CustomText
                      style={styles.timeZone}
                      textColor={colors.dark}
                      variant="Figtree"
                      text={moment(item.createdAt).format(
                        'HH:mm, MMMM Do, YYYY',
                      )}
                    />
                  )}
                </View>
                <View style={styles.gap}>
                  <View style={styles.priceContainer}>
                    <View
                      style={[
                        styles.statusContainer,
                        {
                          backgroundColor:
                            item.currentStatus === 'cancelled' ||
                            item.currentStatus === 'failed'
                              ? colors.red50
                              : item.currentStatus === 'completed'
                              ? colors.green50
                              : item.currentStatus === 'processed'
                              ? colors.primaryGreen
                              : undefined,
                        },
                      ]}>
                      <CustomText
                        text={
                          item.currentStatus === 'processed'
                            ? '⚡ Delivering'
                            : item.currentStatus
                        }
                        textColor={
                          item.currentStatus === 'cancelled' ||
                          item.currentStatus === 'failed'
                            ? colors.red400
                            : item.currentStatus === 'completed'
                            ? colors.green400
                            : item.currentStatus === 'processed'
                            ? colors.white
                            : undefined
                        }
                        variant="small"
                      />
                    </View>
                    <CustomText
                      style={{fontWeight: '500'}}
                      text={formatPrice(item.total)}
                      textColor={colors.darkGreen}
                      variant="Figtree"
                    />
                  </View>
                </View>
              </CustomTouchableSVG>
            ))}
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

export default ReportIssue;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContentContainer: {
    flexGrow: 1,
    paddingHorizontal: scale(20),
    paddingBottom: vs(20),
  },
  headerContainer: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: colors.grey,
    borderTopWidth: 1,
    paddingVertical: vs(10),
  },
  priceContainer: {
    gap: vs(6),
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  statusContainer: {
    paddingVertical: vs(6),
    paddingHorizontal: vs(10),
    borderRadius: moderateScale(6),
  },
  timeZone: {
    fontSize: moderateScale(14.6),
    fontWeight: '500',
    fontFamily: fontFamilies.medium,
  },
  heading: {
    marginTop: vs(10),
    marginBottom: vs(16),
  },
  gap: {
    gap: vs(5),
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    alignSelf: 'center',
    textAlign: 'center',
  },
});
