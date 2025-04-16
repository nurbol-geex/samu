import React from 'react';
import {View, StyleSheet} from 'react-native';
import {CustomText} from 'src/components/shared/CustomText';
import {CustomTouchableSVG} from 'src/components/shared/CustomTouchableSVG';
import {colors} from 'src/theme/colors';
import {moderateScale, scale, vs} from 'react-native-size-matters';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ShopDetailCard: React.FC<ShopDetailCardProps> = ({
  shopName = '',
  address = '',
  buttonOnPress,
}) => {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.flex}>
        <View style={styles.textContainer}>
          <FontAwesome6
            style={{alignSelf: 'center'}}
            color={colors.darkGreen}
            size={18}
            name="shop"
          />
          <CustomText
            style={[styles.flex, {alignSelf: 'center'}]}
            text={shopName}
            variant="h4"
            textColor={colors.darkGreen}
            numberOfLines={1}
          />
          <CustomTouchableSVG
            containerStyle={styles.buttonContainer}
            onPress={buttonOnPress}>
            <CustomText
              textColor={colors.primaryGreen}
              variant="text"
              text="More Info"
            />
            <MaterialCommunityIcons
              color={colors.primaryGreen}
              size={20}
              name="information-outline"
            />
          </CustomTouchableSVG>
        </View>
        <View style={styles.flex}>
          <CustomText text={address} variant="label" textColor={colors.dark} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    flexDirection: 'row',
    marginTop: vs(14),
    padding: scale(10),
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: moderateScale(12),
  },
  textContainer: {
    gap: scale(5),
    marginBottom: vs(5),
    flexDirection: 'row',
  },
  flex: {
    flex: 1,
  },
  buttonContainer: {
    marginLeft: scale(4),
    gap: 5,
    marginTop: vs(2),
    flexDirection: 'row',
  },
});

export default ShopDetailCard;
