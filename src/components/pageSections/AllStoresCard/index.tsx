import {Image, StyleSheet, View} from 'react-native';
import React from 'react';
import {CustomTouchableSVG} from 'src/components/shared/CustomTouchableSVG';
import {CustomText} from 'src/components/shared/CustomText';
import {colors} from 'src/theme/colors';
import {
  heightPercentageScale,
  widthPercentageScale,
} from 'src/theme/dimensions';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {Route} from 'src/routes/Route';
import {moderateScale} from 'react-native-size-matters';
import ClockSVG from 'assets/svg/ClockSVG';
import {metersToMiles} from 'src/utils';

const AllStoresCard = ({item}: AllStoresCardProps) => {
  const navigation = useNavigation<NavigationProp<any>>();
  return (
    <CustomTouchableSVG
      containerStyle={styles.storeCard}
      onPress={() =>
        navigation.navigate(Route.StoreDetails, {
          storeId: item?._id || item?.id,
        })
      }>
      <View style={{position: 'relative'}}>
        <Image style={styles.storeImage} source={{uri: item?.icon}} />

        <View style={styles.timerContainer}>
          <ClockSVG width={20} height={18} />
          <CustomText
            text={`${item.deliveryTime?.min}-${
              item.deliveryTime?.max
            }min (${metersToMiles(item?.distance)} mi)`}
            variant="small"
            textColor={colors.white}
            numberOfLines={1}
            style={styles.cardText}
          />
        </View>
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
            <Image
              resizeMode="contain"
              style={styles.ratingImage}
              source={require('../../../../assets/images/rating.png')}
            />
            <CustomText
              text={item.rating}
              variant="small"
              textColor={colors.primary400}
              numberOfLines={1}
              style={styles.cardText}
            />
            <CustomText
              text={`${item.deliveryCharge}`}
              variant="small"
              textColor={colors.dark}
              numberOfLines={1}
              style={styles.cardText}
            />
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

export default AllStoresCard;

const styles = StyleSheet.create<Styles>({
  storeCard: {
    backgroundColor: colors.white,
    marginHorizontal: widthPercentageScale(1.2),
    borderRadius: moderateScale(8),
    marginTop: heightPercentageScale(1.5),
    width: widthPercentageScale(46),
    shadowColor: colors.grey,
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 10.18,
    shadowRadius: 11.0,

    elevation: 11,
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
  },
  cardText: {
    fontSize: widthPercentageScale(3),
    fontWeight: '700',
  },
  timerContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.8,
    gap: 4,
    padding: 2,
    right: 0,
    borderTopLeftRadius: 6,
    backgroundColor: 'black',
    bottom: 0,
  },
});
