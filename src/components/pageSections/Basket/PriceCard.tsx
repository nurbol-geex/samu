import React from 'react';
import {View, StyleSheet} from 'react-native';
import {CustomText} from 'src/components/shared/CustomText';
import {moderateScale, vs} from 'react-native-size-matters';
import {colors} from 'src/theme/colors';
import {formatPrice} from 'src/utils';

const PriceCard: React.FC<PriceCardProps> = ({
  title,
  price,
  containerStyle,
  titleStyle,
  priceStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <CustomText
        text={title}
        variant="label"
        textColor={colors.dark}
        style={[styles.title, titleStyle]}
      />
      <CustomText
        text={
          title === 'Delivery Fee' && price === 0 ? 'Free' : formatPrice(price)
        }
        variant="label"
        textColor={colors.darkGreen}
        style={[styles.price, priceStyle]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: vs(10),
  },
  title: {
    flex: 1,
    marginRight: moderateScale(10),
  },
  price: {
    flex: 1,
    textAlign: 'right',
  },
});

export default PriceCard;
