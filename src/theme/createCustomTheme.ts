import {createTheme} from '@shopify/restyle';
import {Platform} from 'react-native';
import {colors} from './colors';
import {shadowVariants} from './shadows';
import {spacing} from './spacing';
import {textVariants} from './textVariants';

export const createCustomTheme = ({
  scaleFactor = 1,
}: DynamicThemeProps = {}) => {
  return createTheme({
    colors: {
      // brand colors
      customDarkGray: colors.primary800,
      customGray: colors.primary700,
      customLightGray: colors.primary300,
      customPowderBlue: colors.customBlue100,
      customBlue: colors.customBlue,
      // interaction colors
      active: colors.customBlue500,
      inactive: colors.primary500,
      hover: colors.customBlue400,
      textSelection:
        Platform.OS === 'ios' ? colors.customBlue400 : colors.customBlue200,
      pressed: colors.customBlue600,
      disabled: colors.customBlue100,
      disabledBackground: colors.disabledFillColorLight,
      disabledOutline: colors.primary100,
      error: colors.red400,
      warning: colors.orange400,
      information: colors.customBlue500,
      informationSecondary: colors.customBlue200,
      success: colors.green400,
      successLight: colors.green200,
      // layout colors
      shadow: colors.primary100,
      outline: colors.customBlue100,
      typography: colors.primary900,
      typographySecondary: colors.primary700,
      typographyTertiary: colors.primary500,
      typographyLinks: colors.customBlue500,
      typographyDisabled: colors.primary600,
      surface: colors.white,
      overlay: colors.black,
      applePay: colors.black,
      applePayDisabled: colors.primary300,
      googlePay: colors.black,
      googlePayDisabled: colors.primary300,
      placeholderText: colors.gray73,
    },
    spacing: {
      xxs: spacing.xxs * scaleFactor,
      xs: spacing.xs * scaleFactor,
      s: spacing.s * scaleFactor,
      m: spacing.m * scaleFactor,
      l: spacing.l * scaleFactor,
      xl: spacing.xl * scaleFactor,
      xxl: spacing.xxl * scaleFactor,
      // 12px padding
      inputPadding: spacing.xxs * 3 * scaleFactor,
    },
    iconSize: {
      xs: 16 * scaleFactor,
      s: 20 * scaleFactor,
      m: 24 * scaleFactor,
      l: 32 * scaleFactor,
    },
    breakpoints: {
      phone: 0,
      tablet: 768,
    },
    textVariants,
    shadowVariants,
  });
};

export type Theme = ReturnType<typeof createCustomTheme>;
export type ThemeColor = keyof Theme['colors'];
export type ThemeSpacing = keyof Theme['spacing'];
