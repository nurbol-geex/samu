/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {moderateScale, scale, vs} from 'react-native-size-matters';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {colors} from '../../../theme/colors';
import {fontFamilies} from '../../../theme/textVariants';
import {CustomHintText} from '../CustomHintText';
import {CustomText} from '../CustomText';
import {heightPercentageScale} from 'src/theme/dimensions';
import {CustomTouchableSVG} from '../CustomTouchableSVG';

type InputType = 'general' | 'password';
type PlaceholderPosition = 'left' | 'center';

export default function CustomTextInput(props: CustomTextInputProps) {
  const {
    testID = undefined,
    type = 'general',
    containerStyle = {},
    placeholderPosition = 'left',
    onBlur = () => {},
    error = undefined,
    hasBorderBottom = false,
    textVariant = 'input',
    label = undefined,
    inputStyle,
    onFocus,
    value,
    onChange,
    inputContainerStyle,
    secureTextEntry,
    subLabel,
    ...rest
  } = props;

  const [visible, setVisible] = useState<boolean>(secureTextEntry);

  const onPressIcon = () => {
    rest?.onPressIcon ? onPressIcon() : secureTextEntry && setVisible(!visible);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <CustomText
          text={label}
          variant="label"
          textColor={colors.darkGreen}
          style={styles.label}
        />
      )}
            {subLabel && (
        <CustomText
          text={subLabel}
          variant="label"
          textColor={colors.darkGreen}
          style={styles.sublabel}
        />
      )}
      <View style={[styles.inputContainer, inputContainerStyle]}>
        <View style={{flex: 1}}>
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholderTextColor={colors.gray73}
            style={[styles.input, inputStyle, {textAlign: placeholderPosition}]}
            secureTextEntry={visible}
            {...rest}
          />
        </View>
        {secureTextEntry && (
          <CustomTouchableSVG
            containerStyle={styles.iconContainer}
            onPress={onPressIcon}>
            <IonIcons
              color={colors.primary200}
              name={!visible ? 'eye-off' : 'eye'}
              disabled
              size={scale(20)}
            />
          </CustomTouchableSVG>
        )}
      </View>
      {error && <CustomHintText message={error.hasOwnProperty('message') ? error?.message : error ? error : ''} />}
    </View>
  );
}

const styles = StyleSheet.create<Styles>({
  container: {
    marginHorizontal: scale(27),
    marginVertical: vs(20),
  },
  label: {
    marginBottom: vs(4),
  },
  inputContainer: {
    height: heightPercentageScale(6),
    alignItems: 'center',
    backgroundColor: colors.inputBackgroundColor,
    borderRadius: moderateScale(7.5),
    width: '100%',
    // flex: 1,
    flexDirection: 'row',
  },
  input: {
    paddingHorizontal: scale(9),
    fontFamily: fontFamilies.medium,
    fontWeight: '500',
    fontSize: moderateScale(15.09), //16
    letterSpacing: -0.1,
    color: colors.darkGreen,
    height: '100%',
  },
  eyeIcon: {
    padding: scale(3.8),
    marginEnd: scale(7.5),
  },
  iconContainer: {
    flex: 0.16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sublabel:{
    fontSize:12,
    marginBottom:2
  }
});
