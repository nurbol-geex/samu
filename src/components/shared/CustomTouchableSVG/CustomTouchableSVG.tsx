import {StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';

const styles = StyleSheet.create<Styles>({
  container: {},
});

export default function CustomTouchableSVG({
  children,
  onPress,
  containerStyle,
  disabled,
}: CustomTouchableSVGProps) {
  return (
    <TouchableOpacity
      disabled={disabled as boolean}
      onPress={onPress}
      style={[styles.container, containerStyle]}>
      {children}
    </TouchableOpacity>
  );
}
