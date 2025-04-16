import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import React, { useState } from 'react';
import {CustomStatusBar} from 'src/components/shared/CustomStatusBar';
import {CustomHeader} from 'src/components/shared/CustomHeader';
import {colors} from 'src/theme/colors';
import {CustomText} from 'src/components/shared/CustomText';
import {moderateScale, scale, vs} from 'react-native-size-matters';
import {CustomTouchableSVG} from 'src/components/shared/CustomTouchableSVG';
import {useNavigation} from '@react-navigation/native';
import {CustomTextInput} from 'src/components/shared/CustomInputText';
import {
  heightPercentageScale,
} from 'src/theme/dimensions';
import {fontFamilies} from 'src/theme/textVariants';
import { useDispatch } from 'react-redux';
import { HELP_DESK } from 'src/redux/user/constants';
import { useReduxSelector } from 'src/redux';
import { selectUpdateProfileIsLoading ,selectHelpIsLoading} from 'src/redux/user/selectors';
import { CustomButton } from 'src/components/shared/CustomButton';

const MessageUs = ({route}) => {
  const navigation = useNavigation();
  const dispatchStore = useDispatch();
  // const orderId = useReduxSelector(selectOrderId);
  const helpDeskLoading = useReduxSelector(selectHelpIsLoading);
  const [error, setError] = useState(''); // Error state for validation

  const [description, setDescription] = useState(''); // State to store input value


  const SubmitQuery = () => {
    // Validation: Check if description is empty
    if (!description.trim()) {
      setError('Please provide a description for your issue.');
      return;
    }

    setError(''); // Clear error if validation passes
    dispatchStore({
      type: HELP_DESK,
      payload: {
        order_id: orderId,
        description: description,
        priority: 'High',
        type: 'Problem',
      },
    });
  };

  return (
    <View style={styles.mainContainer}>
      <CustomStatusBar backgroundColor={colors.primaryGreen} />
      <CustomHeader
        title="Message Us"
        titleColor={colors.white}
        containerBackgroundColor={colors.primaryGreen}
        startButtonIconType="back"
      />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.select<
          'height' | 'position' | 'padding' | undefined
        >({
          ios: 'padding',
          android: undefined,
        })}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContentContainer}>
          <CustomText
            style={{marginVertical: vs(10)}}
            textColor={colors.darkGreen}
            text="Get in touch"
            variant="h2"
          />
          <CustomText
            style={{marginBottom: vs(30)}}
            textColor={colors.dark}
            text="Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Nulla vitae elit libero, a pharetra augue. Sed posuere consectetur est at lobortis. Curabitur blandit tempus porttitor. Lorem ipsum dolor sit amet, consectetur adipiscing elit.."
            variant="text"
          />
          <CustomText
            textColor={colors.darkGreen}
            text="Your Message"
            variant="h5"
          />

          <CustomTextInput
            placeholder="Enter your message"
            placeholderPosition="left"
            // label="Your Message"
            multiline
            onChangeText={text => setDescription(text)} // Update state on input change
            style={styles.input}
            containerStyle={{
              marginVertical: scale(10),
              marginHorizontal: 0,
            }}
            inputContainerStyle={{
              marginBottom: scale(20),
              height: heightPercentageScale(14),
              alignItems: 'flex-start',
            }}
          />
             {error ? (
            <CustomText
              style={{ marginBottom: vs(10) }}
              text={error}
              variant="errorText" 
              textColor={colors.red400}// Ensure you have this text style
            />
          ) : null}
          <View style={styles.btnView}>
          <CustomButton onPress={SubmitQuery} text="Submit Issue" hasBackView  loading={helpDeskLoading}  />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default MessageUs;

const styles = StyleSheet.create({
  mainContainer: {
    position: 'relative',
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContentContainer: {
    flexGrow: 1,
    paddingHorizontal: scale(20),
  },

  btnView: {
    position: 'absolute',
    bottom: 0,
    width: scale(400),
    alignSelf: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: colors.grey,
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
  },
  btnContainer: {
    borderRadius: moderateScale(14),
    padding: vs(18),
    backgroundColor: colors.primaryGreen,
  },
  input: {
    verticalAlign: 'top',
    paddingTop: vs(12),
    paddingLeft: vs(12),
    fontFamily: fontFamilies.medium,
    fontWeight: '500',
    fontSize: moderateScale(15.09), //16
    letterSpacing: -0.1,
    color: colors.darkGreen,
  },
});
