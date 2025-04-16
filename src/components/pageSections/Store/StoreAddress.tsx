import React from 'react';
import {View, StyleSheet} from 'react-native';
import {moderateScale, scale, vs} from 'react-native-size-matters';
import {colors} from '../../../theme/colors';
import {CustomText} from '../../../components/shared/CustomText';
import LocationSVG from 'assets/svg/LocationSVG';
import TimerSVG from 'assets/svg/TimerSVG';

export const StoreAddress: React.FC<StoreAddressProps> = ({
  deliveryAddress,
  deliveryInstructions,
  showTimer = true,
  containerStyle,
  rowStyle,
  textStyle,
}) => {
  return (
    <View style={[styles.infoContainer, containerStyle]}>
      <View>
        <CustomText
          text="Delivery Address"
          variant="h4"
          textColor={colors.darkGreen}
        />
        <View style={[styles.infoRow]}>
          <LocationSVG iconColor={colors.darkGreen} />
          <CustomText
            text={deliveryAddress}
            variant="text"
            textColor={'#6b6b6b'}
            style={textStyle}
          />
        </View>
      </View>
      {deliveryInstructions !== '' ? (
        <View style={styles.timeContainer}>
          <CustomText
            text="Delivery Instructions"
            variant="h4"
            textColor={colors.darkGreen}
          />
          <View style={[styles.infoRow, rowStyle]}>
            {showTimer && <TimerSVG iconColor={colors.darkGreen} />}
            <CustomText
              text={deliveryInstructions?.trim()}
              variant="text"
              textColor={'#6b6b6b'}
              style={textStyle}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    backgroundColor: colors.white,
    padding: scale(13),
    borderRadius: moderateScale(14),
    borderWidth: 1,
    borderColor: colors.grey,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: vs(5),
  },
  timeContainer: {
    marginTop: vs(15),
  },
});
