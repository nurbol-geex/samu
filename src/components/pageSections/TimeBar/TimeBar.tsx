import React from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from '../../../theme/colors';
import {CustomText} from '../../shared/CustomText';
import ClockSVG from 'assets/svg/ClockSVG';
import {scale} from 'react-native-size-matters';

const styles = StyleSheet.create<Styles>({
  rate: {
    fontSize: 12,
    color: `${colors.primary400}`,
    paddingLeft: scale(7.5),
  },
});

export default function TimeBar({hours, distance}: TimeBarProps) {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <ClockSVG />
      <CustomText
        style={styles.rate}
        text={`${hours} (${distance})`}
        variant={'label'}
      />
    </View>
  );
}
