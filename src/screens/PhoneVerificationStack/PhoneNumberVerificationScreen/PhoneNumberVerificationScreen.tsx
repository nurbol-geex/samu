import OTPInputView from '@twotalltotems/react-native-otp-input';
import React, {useEffect, useMemo, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {moderateScale, scale, vs} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';
import {phoneVerifyAPI} from '../../../api/phoneVerifyAPI';
import {CustomButton} from '../../../components/shared/CustomButton';
import {CustomHeader} from '../../../components/shared/CustomHeader';
import {CustomText} from '../../../components/shared/CustomText';
import {showToast} from '../../../components/shared/CustomToast/toastUtils';
import {
  LOGIN_PHONE_CONFIRM_REQUEST,
  PHONE_CONFIRM_REQUEST,
} from '../../../redux/user/constants';
import {AuthenticationType} from '../../../redux/user/initialState';
import {
  selectAuthenticationType,
  selectCreateAccountForm,
  selectUpdateProfileIsLoading,
  selectUser,
} from '../../../redux/user/selectors';
import {resetUser, setUser} from '../../../redux/user/slice';
import {colors} from '../../../theme/colors';
import {formatPhoneNumber} from '../../../utils';
import {heightPercentageScale} from 'src/theme/dimensions';
import { useRoute } from '@react-navigation/native';
import { RootState, useReduxSelector } from 'src/redux';

export default function PhoneNumberVerificationScreen() {
  const { phone: reduxPhone } = useSelector(selectCreateAccountForm);
  const route = useRoute();
  const phoneParam = route.params?.phone;
  const phone = phoneParam || reduxPhone; // Use phone from navigation if available, otherwise fallback to Redux
  const { isLoading } = useSelector((state: RootState) => state.user);
 
  const authenticationType = useSelector(selectAuthenticationType);
  const {resetPasswordRequested} = useSelector(selectUser);

  const dispatchStore = useDispatch();

  useEffect(() => {
    async function handler() {
      if (phone) {
        try {
          const response = (await phoneVerifyAPI(phone)) as unknown as Response;
          const json = (await response.json()) as PhoneVerifyResponseBody;
          if (
            'status' in response &&
            response.status >= 200 &&
            response.status < 300
          ) {
            dispatchStore(setUser({uuid: json?.uuid || ''}));
            showToast('success', json.message, 'The code has been sent');
          } else {
            showToast('error', json.message, 'An error has occurred');
          }
        } catch (error) {
          console.log('error: ', error);
          showToast(
            'error',
            error?.message || 'Error',
            'An error has occurred',
          );
        }
      }
    }

  

    if (!resetPasswordRequested) {
      handler();
    }
  }, [phone, authenticationType, dispatchStore]);

  const [code, setCode] = useState<string>('');

  const formattedPhoneNumber = useMemo(() => {
    if (phone) {
      return formatPhoneNumber(phone);
    }
    return '';
  }, [phone]);

  const onSetValue = (value: string) => {
    setCode(value);
  };

  const onSubmit = () => {
    if (
      authenticationType === AuthenticationType.PhoneLogin ||
      authenticationType === AuthenticationType.EmailLogin
    ) {
      dispatchStore({
        type: LOGIN_PHONE_CONFIRM_REQUEST,
        payload: {
          code,
        },
      });
    } else {
      dispatchStore({
        type: PHONE_CONFIRM_REQUEST,
        payload: {
          code,
        },
      });
    }
  

  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title="STEP 2"
        titleColor={colors.darkGreen}
        containerBackgroundColor={colors.white}
        startButtonIconType="circular-back"
      />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.select<
          'height' | 'position' | 'padding' | undefined
        >({
          ios: 'padding',
          android: undefined,
        })}
        keyboardVerticalOffset={0}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContentContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}>
          <CustomText
            text="VERIFY YOUR PHONE NUMBER"
            variant="h1"
            textColor={colors.darkGreen}
            style={styles.title}
            numberOfLines={2}
          />
          <CustomText
            text="We have send verification code to your number"
            variant="text"
            textColor={colors.dark}
            style={styles.subtitle}
            numberOfLines={2}
          />
          <CustomText
            text={formattedPhoneNumber || ''}
            variant="h1"
            style={styles.phoneNumber}
            textColor={colors.darkGreen}
          />
          <CustomText
            text="Enter the Code your received"
            variant="label"
            textColor={colors.darkGreen}
            style={styles.inputsLabel}
          />
          <View style={styles.codeInputsContainer}>
            <OTPInputView
              style={{width: '100%'}}
              pinCount={5}
              codeInputFieldStyle={styles.underlineStyleBase}
              onCodeChanged={code => {
                onSetValue(code);
              }}
            />
          </View>
        </ScrollView>
        <CustomButton
          loading={isLoading}
          disabled={code.length < 5 ? true : false}
          onPress={onSubmit}
          text="Continue"
          containerStyle={styles.continueButton}
          active={code.length > 4 ? true : false}
          hasBackView
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContentContainer: {
    flexGrow: 1,
  },
  title: {
    fontSize: moderateScale(32),
    fontWeight: '900',
    alignSelf: 'center',
    textAlign: 'center',
    width: scale(260),
    marginTop: vs(10),
  },
  subtitle: {
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: vs(10),
    width: scale(260),
  },
  phoneNumber: {
    letterSpacing: -3,
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: vs(10),
  },
  inputsLabel: {
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: vs(40),
  },
  codeInputsContainer: {
    marginHorizontal: scale(15),
    height: heightPercentageScale(12),
  },
  codeInput: {
    flex: 1,
    marginTop: scale(7.5),
  },
  continueButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },

  underlineStyleBase: {
    width: scale(57),
    height: heightPercentageScale(7),
    borderRadius: moderateScale(10),
    backgroundColor: '#F8F9FB',
    color: colors.black,
    borderWidth:0,
    // color: colors.green500,
  },
});
