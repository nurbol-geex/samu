import {StyleSheet, View} from 'react-native';
import React from 'react';
import {CustomText} from 'src/components/shared/CustomText';
import {CustomButton} from 'src/components/shared/CustomButton';
import {colors} from 'src/theme/colors';
import {moderateScale, scale, vs} from 'react-native-size-matters';

export const StoreHelp: React.FC<StoreHelpProps> = ({
  title,
  btnText,
  containerStyle,
  btnStyle,
  onPress,
}) => {
  return (
    <View style={[styles.containerStyle, containerStyle]}>
      <CustomText textColor={colors.darkGreen} text={title} variant="h4" />
      <CustomButton
        text={btnText}
        btnContainerStyle={[styles.btnStyle, btnStyle]}
        touchableBackgroundColor={colors.darkGreen}
        onPress={onPress}
      />
    </View>
  );
};

export default StoreHelp;

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: colors.white,
    marginVertical: vs(10),
    gap: 10,
    padding: vs(14),
    borderRadius: moderateScale(14),
    borderWidth: 1,
    borderColor: colors.grey,
  },
  btnStyle: {
    borderRadius: moderateScale(10),
    width: scale(280),
    marginHorizontal: 0,
  },
});
