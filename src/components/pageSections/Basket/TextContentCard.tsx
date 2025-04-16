import React from 'react';
import {View, StyleSheet} from 'react-native';
import {CustomText} from 'src/components/shared/CustomText';
import {CustomTouchableSVG} from 'src/components/shared/CustomTouchableSVG';
import {colors} from 'src/theme/colors';
import {moderateScale, scale, vs} from 'react-native-size-matters';

const TextContentCard: React.FC<TextContentCardProps> = ({
  title = '',
  icon,
  description = '',
  buttonLabel,
  buttonLabelStyle,
  buttonOnPress,
  sectionContainer,
  descriptionStyle,
  position,
}) => {
  return (
    <View style={[styles.sectionContainer, sectionContainer]}>
      <View style={styles.flex}>
        <View style={styles.textContainer}>
          {icon}
          <CustomText text={title} variant="h4" textColor={colors.darkGreen} />
        </View>
        <View style={styles.flex}>
          <CustomText
            text={description}
            variant="label"
            textColor={colors.dark}
            style={descriptionStyle}
          />
        </View>
      </View>
      <View
        style={[
          styles.buttonContainer,
          {justifyContent: position, alignItems: position},
        ]}>
        <CustomTouchableSVG onPress={buttonOnPress}>
          <CustomText
            style={buttonLabelStyle}
            numberOfLines={1}
            textColor={colors.primaryGreen}
            variant="text"
            text={buttonLabel}
          />
        </CustomTouchableSVG>
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
    alignItems: 'center',
  },
  flex: {
    flex: 1,
  },
  buttonContainer: {
    width: scale(60),
    flexDirection: 'column',
  },
});

export default TextContentCard;
