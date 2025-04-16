import {Image, StyleSheet, View} from 'react-native';
import React from 'react';
import {CustomTouchableSVG} from 'src/components/shared/CustomTouchableSVG';
import {CustomText} from 'src/components/shared/CustomText';
import {colors} from 'src/theme/colors';
import {
  heightPercentageScale,
  widthPercentageScale,
} from 'src/theme/dimensions';
import {useNavigation} from '@react-navigation/native';
import {Route} from 'src/routes/Route';
import roundOffToNearestFive, {convertToAmPm, formatPrice, getCurrentDayHours} from 'src/utils';
import ClockSVG from 'assets/svg/ClockSVG';
import {moderateScale, vs} from 'react-native-size-matters';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {backgroundColor, border} from '@shopify/restyle';
import moment from 'moment-timezone';

const StoreSection = ({item, id, cardStyle}: StoreSectionProps) => {
  const navigation = useNavigation();
  // Get the current day
  const currentDay = moment().tz(item?.hours?.tz).format('dddd').toLowerCase();
  // Add 1 day to the current day
  const nextDay = moment().tz(item?.hours?.tz).add(1, 'days').format('dddd').toLowerCase();

  const opensAtNextDay = item?.hours[nextDay]?.opensAt;



  return (
    <CustomTouchableSVG
      containerStyle={[styles.storeCard, cardStyle]}
      onPress={() => navigation.navigate(Route.StoreDetails, {storeId: id})}>
      <View style={{position: 'relative'}}>
        <Image
          style={styles.storeImage}
          source={{
            uri: item?.headerImage ? item?.headerImage[0] : '',
          }}
        />

        {item?.availability && (
          <View style={styles.timerContainer}>
            <ClockSVG width={20} height={20} />
            <CustomText
              text={`${item?.deliveryTime?.min} - ${item?.deliveryTime?.max} mins `}
              variant="small"
              textColor={colors.white}
              numberOfLines={1}
              style={styles.cardText}
            />
          </View>
        )}

        {!item?.availability && (
          <View style={[styles.closedOverlay]}>
            <View style={styles.closeText}>
            <CustomText
              text="Closed"
              variant="small"
              textColor={colors.white}
              numberOfLines={1}
              
              style={{fontSize:12}}
            />
            </View>
            <CustomText
              text={`Opens ${nextDay} ${convertToAmPm(item?.hours[nextDay]?.opensAt)}`}
              variant="small"
              textColor={colors.white}
              numberOfLines={1}
              
              style={{fontSize:10, textAlign: 'center', alignSelf: 'center', marginTop: 6}}
            />
            
          </View>
        )}
      </View>
      <View style={styles.storeCardDetailsContainer}>
        <CustomText
          text={item?.name}
          variant="title"
          textColor={colors.darkGreen}
          numberOfLines={1}
          style={styles.storeTitle}
        />

        <View style={styles.storeTimerContainer}>
          <View style={styles.ratings}>
            <FontAwesome name="star" color={colors.yellow} size={14} />
            <CustomText
              text={
                item?.averageRating ? Number(item?.averageRating).toFixed(1) : 0
              }
              variant="small"
              textColor={colors.dark}
              numberOfLines={1}
              style={[styles.cardText, {marginLeft: -6}]}
            />
            {item?.deliveryCost && (
              <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                <MaterialCommunityIcons
                  name="bike-fast"
                  color={colors.primaryGreen}
                  size={14}
                />
                <CustomText
                  // text={`${
                  //   item?.deliveryCost >= 0
                  //     ? `${formatPrice(item?.deliveryCost)}`
                  //     : 'Free Delivery'
                  // }`}
                  text={`${
                    item?.deliveryCost >= 0
                      ? `${formatPrice(item?.deliveryCost)}`
                      : 'Free Delivery'
                  }`}
                  variant="small"
                  textColor={colors.dark}
                  numberOfLines={1}
                  style={[styles.cardText, {marginLeft: 4}]}
                />
              </View>
            )}

            {/* <CustomText
              text="Category"
              variant="small"
              textColor={colors.primary400}
              numberOfLines={1}
              style={styles.cardText}
            /> */}
          </View>
        </View>
      </View>
    </CustomTouchableSVG>
  );
};

export default StoreSection;

const styles = StyleSheet.create<Styles>({
  storeCard: {
    backgroundColor: colors.white,
    marginHorizontal: widthPercentageScale(1.2),
    borderRadius: moderateScale(8),
    marginVertical: heightPercentageScale(1.5),
    width: widthPercentageScale(46),
    shadowColor: colors.dark,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  storeImage: {
    borderTopRightRadius: moderateScale(8),
    borderTopLeftRadius: moderateScale(8),
    position: 'relative',
    width: '100%',
    height: widthPercentageScale(22),
  },
  storeTitle: {
    fontSize: widthPercentageScale(3.8),
  },
  storeCardDetailsContainer: {
    paddingVertical: heightPercentageScale(1),
    paddingHorizontal: widthPercentageScale(2.5),
  },
  ratingImage: {
    marginRight: -14,
    width: widthPercentageScale(3.8),
    height: widthPercentageScale(3.8),
    right: widthPercentageScale(1.5),
  },
  storeTimerContainer: {
    marginTop: heightPercentageScale(0.7),
    flexDirection: 'row',
    alignItems: 'center',
  },

  ratings: {
    gap: 10,
    alignItems: 'center',
    flexDirection: 'row',
    left: vs(2),
  },
  cardText: {
    fontSize: widthPercentageScale(3),
    fontWeight: '600',
    alignSelf: 'center',
  },
  closeText: {
    fontSize: widthPercentageScale(3),
    fontWeight: '600',
    alignSelf: 'center',
    backgroundColor: 'black',
    paddingVertical:6,
    paddingHorizontal:12,
    borderRadius:50
  },
  timerContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    // opacity: 0.8,
    gap: 4,
    padding: 4,
    right: 0,
    borderTopLeftRadius: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    bottom: 0,
    width: widthPercentageScale(25),
  },
  closedOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 10,

  },
});
