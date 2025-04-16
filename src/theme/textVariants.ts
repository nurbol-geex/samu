import {Platform} from 'react-native';
import {moderateScale} from 'react-native-size-matters';

export const fontFamilies = {
  light: 'Figtree-Light',
  lightItalic: 'Figtree-LightItalic',
  medium: 'Figtree-Medium',
  mediumItalic: 'Figtree-MediumItalic',
  regular: 'Figtree-Regular',
  italic: 'Figtree-Italic',
  semiBold: 'Figtree-SemiBold',
  semiBoldItalic: 'Figtree-SemiBoldItalic',
  bold: 'Figtree-Bold',
  boldItalic: 'Figtree-BoldItalic',
  extraBold: 'Figtree-ExtraBold',
  extraBoldItalic: 'Figtree-ExtraBoldItalic',
  black: 'Figtree-Black',
  blackItalic: 'Figtree-BlackItalic',
} as const;

export const textVariants = {
  h1: {
    fontFamily:
      Platform.OS === 'ios' ? fontFamilies.bold : fontFamilies.extraBold,
    fontWeight: '900',
    fontSize: moderateScale(30.2), //32
    lineHeight: 0 || null,
    letterSpacing: -1,
    color: 'black',
  },
  h2: {
    fontFamily: fontFamilies.bold,
    fontWeight: '800',
    fontSize: moderateScale(27.3), //29
    lineHeight: 0 || null,
    letterSpacing: 0,
    color: 'black',
  },
  h3: {
    fontFamily: fontFamilies.bold,
    fontWeight: '800',
    fontSize: moderateScale(24.5), //26
    lineHeight: 0 || null,
    letterSpacing: 0,
    color: 'black',
  },
  h4: {
    fontFamily: fontFamilies.semiBold,
    fontWeight: '800',
    fontSize: moderateScale(18.8), //20
    lineHeight: 0 || null,
    letterSpacing: 0,
    color: 'black',
  },
  h5: {
    fontFamily: fontFamilies.semiBold,
    fontWeight: '700',
    fontSize: moderateScale(17), //18
    lineHeight: 0 || null,
    letterSpacing: 0,
    color: 'black',
  },
  titleBar: {
    fontFamily: fontFamilies.semiBold,
    fontWeight: '900',
    fontSize: moderateScale(21.67), //23,
    lineHeight: 0 || null,
    letterSpacing: -1,
    color: 'black',
  },
  body: {
    fontFamily: fontFamilies.regular,
    fontWeight: '500',
    fontSize: moderateScale(15.09), //16,
    lineHeight: 0 || null,
    letterSpacing: -1.1,
    color: 'black',
  },
  label: {
    fontFamily: fontFamilies.medium,
    fontWeight: '600',
    fontSize: moderateScale(15.09), //16,
    lineHeight: 0 || null,
    letterSpacing: 0,
    color: 'black',
  },
  text: {
    fontFamily: fontFamilies.regular,
    fontWeight: '500',
    fontSize: moderateScale(15.09), //16
    lineHeight: 0 || null,
    letterSpacing: 0,
    color: 'black',
  },
  buttonText: {
    fontFamily: fontFamilies.medium,
    fontWeight: '600',
    fontSize: moderateScale(16.08), //17
    lineHeight: 0 || null,
    letterSpacing: 0,
    color: 'black',
  },
  input: {
    fontFamily: fontFamilies.medium,
    fontWeight: '500',
    fontSize: moderateScale(15.09), //16
    lineHeight: 0 || null,
    letterSpacing: -0.1,
    color: 'black',
  },
  link: {
    fontFamily: fontFamilies.medium,
    fontWeight: '500',
    fontSize: moderateScale(15.09), //16
    lineHeight: 0 || null,
    letterSpacing: 1.5,
    color: 'black',
  },
  small: {
    fontFamily: fontFamilies.light,
    fontWeight: '500',
    fontSize: moderateScale(14.1), //15
    lineHeight: 0 || null,
    letterSpacing: -0.1,
    color: 'black',
  },
  title: {
    fontFamily: fontFamilies.semiBold,
    fontWeight: '700',
    fontSize: moderateScale(14.1), //15
    lineHeight: 0 || null,
    letterSpacing: 0,
    color: 'black',
  },
  Figtree: {
    fontFamily: fontFamilies.semiBold,
    fontWeight: '700',
    fontSize: moderateScale(15.9), //16
    lineHeight: 0 || null,
    letterSpacing: 0,
    color: 'black',
  },
} as const;

export type TextVariant = keyof typeof textVariants;
