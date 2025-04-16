import {StyleSheet, View} from 'react-native';
import React from 'react';
import {CustomText} from 'src/components/shared/CustomText';
import {CustomButton} from 'src/components/shared/CustomButton';
import {colors} from 'src/theme/colors';
import {moderateScale, scale, vs} from 'react-native-size-matters';
import {widthPercentageScale} from 'src/theme/dimensions';

export const YourExperience: React.FC<YourExperienceProps> = ({
  title,
  btnText,
  containerStyle,
  btnStyle,
  reportOnPress,
  ratingOnPress,
}) => {
  return (
    <View style={[styles.containerStyle, containerStyle]}>
      <CustomText textColor={colors.darkGreen} text={title} variant="h4" />
      <CustomText textColor={colors.dark} text="Not Rated Yet" variant="text" />
      <View style={styles.btnContainer}>
        <CustomButton
          textColor={colors.warning}
          style={{fontSize: moderateScale(16)}}
          text={'Report an Issue'}
          btnContainerStyle={[styles.btnStyle, btnStyle]}
          touchableBackgroundColor={colors.white}
          onPress={reportOnPress}
        />
        <CustomButton
          textColor={colors.white}
          style={{fontSize: moderateScale(16)}}
          text={'Rate Experience'}
          btnContainerStyle={[styles.btnStyle, btnStyle]}
          touchableBackgroundColor={colors.primaryGreen}
          onPress={ratingOnPress}
        />
      </View>
    </View>
  );
};

export default YourExperience;

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: colors.white,
    marginVertical: vs(10),
    gap: scale(4),
    padding: scale(12),
    borderRadius: moderateScale(14),
    borderWidth: 1,
    borderColor: colors.grey,
  },
  btnContainer: {
    marginTop: scale(6),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnStyle: {
    borderWidth: 0.6,
    borderColor: colors.lightGrey,
    shadowColor: colors.dark,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
    borderRadius: moderateScale(10),
    width: widthPercentageScale(39.8),
    marginHorizontal: 0,
  },
});
