import {yupResolver} from '@hookform/resolvers/yup';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {moderateScale, scale, vs} from 'react-native-size-matters';
import {useDispatch} from 'react-redux';
import * as yup from 'yup';
import {CustomButton} from '../../../components/shared/CustomButton';
import {CustomHeader} from '../../../components/shared/CustomHeader';
import {CustomTextInput} from '../../../components/shared/CustomInputText';
import {CustomText} from '../../../components/shared/CustomText';
import {setCreateAccountForm, setUser} from '../../../redux/user/slice';
import {phoneNumberVerificationScreenPushAction} from '../../../routes/navigationActionCreators';
import {RootStackNavigation} from '../../../routes/RootStack';
import {colors} from '../../../theme/colors';
import {SIGN_UP_REQUEST} from 'src/redux/user/constants';
import * as RootNavigation from '../../../routes/RootNavigation';
import {backgroundColor} from '@shopify/restyle';
import {phoneVerifyAPI} from 'src/api/phoneVerifyAPI';
import {showToast} from 'src/components/shared/CustomToast/toastUtils';
import PhoneNumberInput from 'src/components/shared/PhoneNumberInput/PhoneNumberInput';

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: colors.grey,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContentContainer: {
    flexGrow: 1,
  },
  title: {
    alignSelf: 'center',
    textAlign: 'center',
    width: scale(240),
    marginTop: vs(10),
  },
  emailInput: {
    marginTop: vs(13),
  },
  inputsLabel: {
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: vs(38),
  },
  continueButton: {
    backgroundColor: colors.grey,
  },
  shadow: {
    // borderWidth: 0,
    // borderRadius: moderateScale(14),
    // alignSelf: 'center',
    // shadowColor: colors.black,
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.22,
    // shadowRadius: 2.22,
    // elevation: 3,
  },
});

export default function PhoneNumberInputScreen() {
  const phoneRef= useRef(null);
  const [phone, setPhone] = useState<string>('');

  const dispatchStore = useDispatch();
  const navigation = useNavigation<RootStackNavigation>();
  const [isloading, setIsLoading] = useState(false);
  const validationSchema = yup.object<FormValues>().shape({
    phone: yup
      .string()
      .required('Please enter your phone')
      // .test('phone', 'Phone Number is not valid', value => {
      //   return validatePhone(value);
      // }),
  });

  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
  } = useForm<FormValues>({
    resolver: yupResolver<FormValues>(validationSchema),
    defaultValues: {
      phone,
    },
  });

  useEffect(() => {
    if (phone) {
      dispatchStore(setCreateAccountForm({phone: phone, email: ''}));
      return;
    }
    dispatchStore(setCreateAccountForm({phone: '', email: ''}));
  }, [phone]);

  const onSubmit = async () => {
    // const checkValid = phoneRef.current?.isValidNumber(phone);
    // console.log('checkValid: ', checkValid);
    setIsLoading(true);
    try {
      // Call the API to verify if the user exists
      const response = await phoneVerifyAPI(phone);
      const json = await response.json();

      if (response?.status >= 200 && response?.status < 300 && json?.uuid) {
        dispatchStore(setUser({uuid: json?.uuid || ''}));
        showToast('success', json.message, 'The code has been sent');
        dispatchStore(
          setUser({
            resetPasswordRequested: true,
          }),
        );
        navigation.navigate('PhoneNumberVerification', {phone});
      } else {
        // If user does not exist, show an error toast message
        showToast('error', 'User not found', 'Please check the phone number');
      }
    } catch (error) {
      console.log('Error: ', error);
      showToast('error', 'An error has occurred', 'Please try again');
    }
    setIsLoading(false);
  };

  // function validatePhone(phoneNumber: string | undefined) {
  //   const phoneRegExp =
  //     /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  //   return yup
  //     .string()
  //     .matches(phoneRegExp, 'Phone number is not valid')
  //     .isValidSync(phoneNumber);
  // }

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title="STEP 1"
        startButtonIconType={'circular-back'}
        containerBackgroundColor={colors.grey}
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
        <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
          <CustomText
            text="RESET PASSWORD"
            variant="h1"
            style={styles.title}
            textColor={colors.darkGreen}
            numberOfLines={2}
          />

          <View style={{marginTop:40}}>
            <Controller
              control={control}
              name="phone"
              render={({field: {onChange, onBlur, value}}) => {
                return (
                  <PhoneNumberInput
                  ref={phoneRef}
                    value={value || ''}
                    onChange={val => {
                      onChange(val);
                      setPhone(val);
                    }}
                    error={errors?.phone?.message}
                  />
                );
              }}
            />
          </View>
        </ScrollView>
        <CustomButton
          loading={isloading}
          btnContainerStyle={styles.btnContainer}
          onPress={handleSubmit(onSubmit)}
          text="Continue"
          containerStyle={[styles.continueButton]}
          active={phone ? true : false}
          hasBackView
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
