import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {useTheme} from '@shopify/restyle';
import {Theme} from '../../../theme/createCustomTheme';
import {colors} from 'src/theme/colors';

const styles = StyleSheet.create<Styles>({
  text: {
    alignSelf: 'flex-start',
  },
});

export default function CustomText({
  text,
  text2,
  variant,
  testID = undefined,
  style = {},
  textColor,
  ...rest
}: CustomTextProps) {
  const theme = useTheme<Theme>();

  return (
    <Text
      testID={testID}
      style={[
        styles.text,
        theme.textVariants[variant],
        style,
        textColor ? {color: textColor} : {},
      ]}
      {...rest}>
      {text}
      <Text style={[styles.text, {color: colors.green400}]}>
        {text2 ? ` ${text2}` : null}
      </Text>
    </Text>
  );
}
