import {Platform, StyleSheet} from 'react-native';
import {colors} from './colors';

const shadowColor = Platform.select<string>({
  android: colors.primary600,
  ios: colors.primary200,
});

export const shadowVariants = {
  elevation2: {
    elevation: 2,
    shadowOffset: {height: 2, width: 1},
    shadowRadius: 2,
    shadowOpacity: 1,
    shadowColor,
  },
  elevation4: {
    elevation: 4,
    shadowOffset: {height: 4, width: 1},
    shadowRadius: 4,
    shadowOpacity: 1,
    shadowColor,
  },
  elevation8: {
    elevation: 8,
    shadowOffset: {height: 8, width: 1},
    shadowRadius: 8,
    shadowOpacity: 1,
    shadowColor,
  },
  elevation16: {
    elevation: 16,
    shadowOffset: {height: 16, width: 1},
    shadowRadius: 16,
    shadowOpacity: 1,
    shadowColor,
  },
  elevation24: {
    elevation: 24,
    shadowOffset: {height: 24, width: 1},
    shadowRadius: 24,
    shadowOpacity: 1,
    shadowColor,
  },
} as const;

export type ShadowVariant = keyof typeof shadowVariants;
export const shadows = StyleSheet.create<Styles>(shadowVariants);

export type Elevation = 2 | 4 | 8 | 16 | 24;
