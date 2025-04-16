import React from 'react';
import {Platform, StatusBar, View} from 'react-native';
import {colors} from 'src/theme/colors';
import DeviceInfo from 'react-native-device-info';

export default function CustomStatusBar({
  containerStyle,
  backgroundColor,
}: CustomStatusBarProps) {
  const hasNotch = DeviceInfo.hasNotch();

  if (!hasNotch) {
    return null; // Don't render anything if the device doesn't have a notch
  }

  return (
    <>
      <View
        style={[
          containerStyle,
          {
            backgroundColor: backgroundColor
              ? backgroundColor
              : colors.primaryGreen,
            height: Platform.OS === 'ios' ? 40 : 0,
          },
        ]}
      />
      <StatusBar barStyle={'light-content'} />
    </>
  );
}
