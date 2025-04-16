import {Image, StyleSheet, View} from 'react-native';
import React from 'react';
import {CustomText} from 'src/components/shared/CustomText';
import {CustomTouchableSVG} from 'src/components/shared/CustomTouchableSVG';
import {colors} from 'src/theme/colors';
import {moderateScale, scale, vs} from 'react-native-size-matters';
import PhoneSVG from 'assets/svg/PhoneSVG';

// Function to check if the logo is a URL
export const isUrl = (string: any) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

export const StoreContact: React.FC<StoreContactProps> = ({
  onPress,
  logoText,
  logoDesc,
  logo,
  logoTextStyle,
  logoDescStyle,
  btnStyle,
  containerStyle,
  logoStyle,
  icon,
  iconStyle,
  SvgShowing,
  showCallIcon,
  handleIcon,
}) => {
  return (
    <CustomTouchableSVG
      onPress={onPress}
      containerStyle={[styles.containerStyle, containerStyle]}>
      <Image
        style={[styles.logo, logoStyle]}
        resizeMode="contain"
        source={isUrl(logo) ? {uri: logo} : logo}
      />
      <View style={styles.logoTextContainer}>
        <CustomText
          text={logoText}
          variant={logoTextStyle}
          textColor={colors.darkGreen}
        />
        <CustomText
          text={logoDesc}
          variant={logoDescStyle}
          textColor={'#6b6b6b'}
          style={styles.logoText}
        />
      </View>
      {showCallIcon ? (
        <CustomTouchableSVG
          onPress={handleIcon}
          containerStyle={[styles.phoneContainer, btnStyle]}>
          {SvgShowing ? (
            <PhoneSVG />
          ) : (
            <Image style={[iconStyle, {right: -30}]} source={icon} />
          )}
        </CustomTouchableSVG>
      ) : null}
    </CustomTouchableSVG>
  );
};

export default StoreContact;

const styles = StyleSheet.create({
  containerStyle: {
    borderWidth: 1,
    borderColor: colors.grey,
    backgroundColor: colors.white,
    marginTop: vs(15),
    padding: scale(13),
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
    borderRadius: moderateScale(14),
  },
  logo: {
    width: scale(50),
    height: scale(50),
    resizeMode: 'contain',
    borderRadius: 100,
  },
  logoTextContainer: {
    width: '70%',
    paddingLeft: scale(8),
  },
  phoneContainer: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
    backgroundColor: colors.white,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  logoText: {
    marginTop: vs(1.2),
  },
});
