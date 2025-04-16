import {StyleSheet} from 'react-native';
import React from 'react';
import {CustomText} from '../CustomText';
import {vs} from 'react-native-size-matters';
import {colors} from 'src/theme/colors';

const styles = StyleSheet.create<Styles>({
  text: {
    paddingVertical: vs(3.5),
    color: colors.red400,
  },
});

export default function CustomHintText({
  message,
  numberOfLines = 1,
  containerStyle = {},
}: CustomHintTextProps) {
  return (
    <CustomText
      text={message}
      variant="small"
      style={[styles.text, containerStyle]}
      numberOfLines={numberOfLines}
    />
  );
}
