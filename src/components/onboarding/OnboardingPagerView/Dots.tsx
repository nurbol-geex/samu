import React from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from '../../../theme/colors';

const styles = StyleSheet.create<Styles>({
  container: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 7.5,
  },
});

export function Dots({activePage = 0,pages = [],containerStyle,}: ContainerStyle) {
  return (
    <View
      style={[
        styles.container,
        containerStyle,
        {width: pages.length * 10 + (pages.length - 1) * 20},
      ]}>
      {pages.map((page, index) => (
        <View
          key={index.toString()}
          style={[
            styles.indicator,
            {
              backgroundColor:
                activePage === index
                  ? colors.primaryGreen
                  : `${colors.customGreenTwo}33`,
            },
          ]}
        />
      ))}
    </View>
  );
}
