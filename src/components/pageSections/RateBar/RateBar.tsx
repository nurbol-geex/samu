import React from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from '../../../theme/colors';
import RateSVG from 'assets/svg/RateSVG';
import {CustomText} from '../../shared/CustomText';
import {scale} from 'react-native-size-matters';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const styles = StyleSheet.create<Styles>({
  rate: {
    fontSize: 12,
    color: `${colors.primary400}`,
    paddingLeft: scale(7.5),
  },
});

export default function RateBar({rate, deliveryCost}: RateBarProps) {
  return (
    <View style={{flexDirection: 'row'}}>
      {rate > 0 ? (
        <View
          style={{
            borderRightColor: colors.primary300,
            borderRightWidth: 1,
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 10,
          }}>
          <RateSVG />
          <CustomText
            text={`${rate}`}
            variant={'label'}
            style={[
              styles.rate,
              {
                paddingRight: scale(7.5),
              },
            ]}
          />
        </View>
      ) : null}
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <MaterialCommunityIcons
          name="bike-fast"
          color={colors.primaryGreen}
          size={12}
        />
        <CustomText
          text={deliveryCost}
          variant={'label'}
          numberOfLines={1}
          style={styles.rate}
        />
      </View>
      {/* <CustomText text={`${followers}`} variant={'label'} style={styles.rate} /> */}
    </View>
  );
}
