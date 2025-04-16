import {StyleSheet, TextStyle} from 'react-native';
import {useMemo} from 'react';
import {CustomText} from '../CustomText';
import {fontFamilies} from '../../../theme/textVariants';
import {colors} from '../../../theme/colors';
import {scale} from 'react-native-size-matters';
import React from 'react';

const styles = StyleSheet.create<Styles>({
  text: {
    paddingVertical: scale(3.8),
  },
});

type LinkType = 'general' | 'underlined-link' | 'link1' | 'link2';
type Variant = 'buttonText' | 'body' | 'text' | 'link';

export default function CustomLink({
  testID = undefined,
  type = 'general',
  onPress,
  text,
  style = {},
}: CustomLinkProps) {
  const variant = useMemo<Variant>(() => {
    switch (type) {
      case 'general':
        return 'buttonText';
      case 'link1':
        return 'body';
      case 'link2':
        return 'text';
      default:
        return 'link';
    }
  }, [type]);

  const dynamicStyle = useMemo<TextStyle>(() => {
    switch (type) {
      case 'underlined-link':
        return {
          color: colors.customBlue500,
          textDecorationLine: 'underline',
        };
      case 'link2':
        return {
          fontFamily: fontFamilies.bold,
          fontWeight: '600',
          color: colors.primaryGreen,
        };
      case 'general':
        return {
          fontFamily: fontFamilies.bold,
          fontWeight: '600',
          fontSize: 18,
        };
      default:
        return {};
    }
  }, [type]);

  return (
    <CustomText
      testID={testID}
      text={text}
      variant={variant}
      style={[styles.text, style, dynamicStyle]}
      onPress={onPress}
    />
  );
}
