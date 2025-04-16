import React from 'react';
import {StyleSheet, Image, Pressable} from 'react-native';
import {colors} from '../../../theme/colors';
import {CustomText} from '../CustomText';
import {moderateScale, scale} from 'react-native-size-matters';
import {widthPercentageScale} from 'src/theme/dimensions';

export default function CustomTabButton({
  active = false,
  text = '',
  textStyle = {},
  containerStyle = {},
  icon = '',
  iconPosition = 'left',
  iconStyle = {},
  ...rest
}: CustomTabButtonProps) {
  const styles = StyleSheet.create<Styles>({
    container: {
      flexDirection: iconPosition === 'left' ? 'row' : 'row-reverse',
      backgroundColor: active ? colors.primaryGreen : colors.white,
      borderRadius: moderateScale(20),
      paddingHorizontal: scale(22.4),
      height: widthPercentageScale(10),
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,

      elevation: 2,
    },
    image: {},
    text: {
      alignSelf: 'center',
      color: active ? colors.white : colors.darkGreen,
    },
  });

  return (
    <Pressable style={[styles.container, containerStyle]} {...rest}>
      <Image source={icon} style={[styles.image, iconStyle]} />
      <CustomText
        text={text}
        variant={'title'}
        style={[styles.text, textStyle]}
      />
    </Pressable>
  );
}
