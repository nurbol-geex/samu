import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {CustomText} from 'src/components/shared/CustomText';
import {colors} from 'src/theme/colors';
import {widthPercentageScale} from 'src/theme/dimensions';
import Rider from './../../../../assets/images/deliver-rider.png';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';

const DeliverSection: React.FC = () => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.detailContainer}>
        <CustomText
          text="SamuSend"
          variant="h4"
          textColor={colors.darkGreen}
          numberOfLines={1}
        />
        <CustomText
          style={styles.descriptionText}
          variant="text"
          text="Send & Receive packages in minutes"
          textColor={colors.dark}
          numberOfLines={2}
        />
        <LinearGradient
          colors={[colors.primaryGreen, colors.secondaryGreen]}
          style={[styles.bookNowBtn]}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignSelf: 'center',
            }}>
            <CustomText
              style={styles.bookNowText}
              variant="text"
              text="Coming Soon"
              textColor={colors.white}
              numberOfLines={1}
            />
          </View>
        </LinearGradient>
      </View>
      <Image source={Rider} style={styles.riderImage} resizeMode="contain" />
    </View>
  );
};

export default DeliverSection;

const styles = StyleSheet.create<Styles>({
  cardContainer: {
    backgroundColor: '#E7EDE5',
    borderRadius: moderateScale(18),
    width: widthPercentageScale(94),
    alignSelf: 'center',
    marginVertical: verticalScale(10),
    position: 'relative',
  },
  detailContainer: {
    width: widthPercentageScale(62),
    height: widthPercentageScale(30),
    paddingLeft: scale(12),
    paddingTop: verticalScale(12),
    gap: scale(4),
  },
  riderImage: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    borderTopRightRadius: moderateScale(19),
    borderBottomRightRadius: moderateScale(18),
    borderRadius: moderateScale(30),
    height: '100%',
    width: widthPercentageScale(30),
    overflow: 'hidden',
  },
  bookNowBtn: {
    // backgroundColor: colors.primaryGreen,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 7,
    borderRadius: 40,
    width: 110,
    marginTop: scale(6),
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  descriptionText: {
    fontSize: moderateScale(12),
  },
  bookNowText: {
    fontSize: moderateScale(12.6),
    alignSelf: 'center',
  },
});
