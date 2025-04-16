import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { CustomStatusBar } from 'src/components/shared/CustomStatusBar';
import { CustomHeader } from 'src/components/shared/CustomHeader';
import { colors } from 'src/theme/colors';
import { CustomText } from 'src/components/shared/CustomText';
import { moderateScale, scale, vs } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { CustomTextInput } from 'src/components/shared/CustomInputText';
import { heightPercentageScale } from 'src/theme/dimensions';
import { fontFamilies } from 'src/theme/textVariants';
import { CustomButton } from 'src/components/shared/CustomButton';
import { HELP_DESK } from 'src/redux/user/constants';
import { useDispatch } from 'react-redux';
import { useReduxSelector } from 'src/redux';
import { showToast } from 'src/components/shared/CustomToast/toastUtils';
import { selectHelpIsLoading } from 'src/redux/user/selectors';

const SubmitIssue = ({ route }) => {
  const navigation = useNavigation();
  const { title } = route.params;
  const dispatchStore = useDispatch();
  const orderId = route?.params?.orderId;
  const [description, setDescription] = useState('');
  const [error, setError] = useState(''); // Error state for validation
  const helpDeskLoading = useReduxSelector(selectHelpIsLoading);

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
        title="Help & Support"
        titleColor={colors.white}
        containerBackgroundColor={colors.primaryGreen}
        startButtonIconType="back"
      />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.select({
          ios: 'padding',
          android: undefined,
        })}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContentContainer}
        >
          <CustomText
            style={{ marginVertical: vs(10) }}
            textColor={colors.darkGreen}
            text={title}
            variant="h2"
          />
          <CustomText
            style={{ marginBottom: vs(30) }}
            textColor={colors.dark}
            text="Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Nulla vitae elit libero, a pharetra augue. Sed posuere consectetur est at lobortis. Curabitur blandit tempus porttitor. Lorem ipsum dolor sit amet, consectetur adipiscing elit.."
            variant="text"
          />
          <CustomText
            style={{ marginBottom: vs(10) }}
            textColor={colors.darkGreen}
            text="Leave a comment (optional)"
            variant="h5"
          />

          <CustomTextInput
            placeholder="Explain your issue"
            placeholderPosition="left"
            multiline
            style={styles.input}
            value={description}
            onChangeText={(text) => setDescription(text)}
            containerStyle={{
              marginVertical: 0,
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
        </ScrollView>
        <CustomButton
          onPress={SubmitQuery}
          text="Submit Issue"
          hasBackView
          loading={helpDeskLoading}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

export default SubmitIssue;

const styles = StyleSheet.create({
  mainContainer: {
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
  input: {
    verticalAlign: 'top',
    paddingTop: vs(12),
    paddingLeft: vs(12),
    fontFamily: fontFamilies.medium,
    fontWeight: '500',
    fontSize: moderateScale(15.09),
    letterSpacing: -0.1,
    color: colors.darkGreen,
  },
});
