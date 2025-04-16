import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../../theme/colors';
import { CustomText } from '../CustomText';
import { moderateScale, scale, vs } from 'react-native-size-matters';

const styles = StyleSheet.create({
  container: {},
  touchable: {
    borderRadius: moderateScale(15),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: scale(28),
    paddingVertical: vs(10),
  },
  contentContainer: {
    gap: scale(10),
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: colors.white,
    paddingVertical: vs(5),
    alignSelf: 'center',
    marginHorizontal: vs(5),
  },
});

export default function CustomButton({
  testID = undefined,
  onPress,
  containerStyle = {},
  style = {},
  text,
  disabled = false,
  active = true,
  touchableBackgroundColor = colors.primaryGreen,
  textColor = colors.white,
  IconComponent,
  hasBackView = false,
  btnContainerStyle = {},
  loading,
  loadingColor = colors.white, // Add default loading color here
}: CustomButtonProps) {
  const containerBackViewStyle = useMemo(() => {
    if (hasBackView) {
      return {
        backgroundColor: colors.white,
        borderWidth: 0,
        borderTopStartRadius: moderateScale(15),
        borderTopEndRadius: moderateScale(15),
        paddingVertical: vs(15),
        shadowColor: colors.black,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 10,
      };
    }
    return {};
  }, [hasBackView]);

  const touchableBackgroundColorMemo = useMemo(() => {
    if (active && touchableBackgroundColor) {
      return touchableBackgroundColor;
    }
    return colors.primary400;
  }, [active, touchableBackgroundColor]);

  const textColorMemo = useMemo(() => {
    if (active && textColor) {
      return textColor;
    }
    return colors.white;
  }, [active, textColor]);

  return (
    <View style={[styles.container, containerBackViewStyle, containerStyle]}>
      <TouchableOpacity
        testID={testID}
        onPress={(event) => {
          if (onPress) {
            onPress(event);
          }
        }}
        style={[
          styles.touchable,
          { backgroundColor: touchableBackgroundColorMemo },
          btnContainerStyle,
        ]}
        disabled={disabled}
      >
        <View style={styles.contentContainer}>
          {loading ? (
            <ActivityIndicator size={scale(29)} color={loadingColor} /> // Use loadingColor here
          ) : (
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                alignItems: 'center',
              }}
            >
              <CustomText
                text={text}
                variant="buttonText"
                style={[styles.text, style, { color: textColorMemo }]}
              />
              {IconComponent ? IconComponent : null}
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}
