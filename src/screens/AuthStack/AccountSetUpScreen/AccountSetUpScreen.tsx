import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {CustomHeader} from '../../../components/shared/CustomHeader';
import {CustomText} from '../../../components/shared/CustomText';
import {Controller, useForm} from 'react-hook-form';
import {CustomButton} from '../../../components/shared/CustomButton';
import {colors} from '../../../theme/colors';
import {CustomTextInput} from '../../../components/shared/CustomInputText';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectCreateAccountForm,
  selectHelpIsLoading,
  selectUpdateProfileIsLoading,
} from '../../../redux/user/selectors';
import {
  setCreateAccountForm,
  setUser,
  signUpRequest,
} from '../../../redux/user/slice';
import {SIGN_UP_REQUEST} from '../../../redux/user/constants';
import {moderateScale, scale, vs} from 'react-native-size-matters';
import {createCustomTheme} from 'src/theme/createCustomTheme';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';
import {heightPercentageScale} from 'src/theme/dimensions';
import {fontFamilies} from 'src/theme/textVariants';
import {CustomTouchableSVG} from 'src/components/shared/CustomTouchableSVG';
import {phoneVerifyAPI} from 'src/api/phoneVerifyAPI';
import {showToast} from 'src/components/shared/CustomToast/toastUtils';
import {RootState, useReduxSelector} from 'src/redux';
import PhoneNumberInput from 'src/components/shared/PhoneNumberInput/PhoneNumberInput';
import DeviceInfo from 'react-native-device-info';
import {appsFlyerTrackEvent} from 'src/utils';

const theme = createCustomTheme();

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContentContainer: {
    flexGrow: 1,
    paddingBottom: vs(20),
  },
  title: {
    alignSelf: 'center',
    textAlign: 'center',
  },
  continueButton: {
    paddingVertical: theme.spacing.s,
  },
  dropdownContainer: {
    width: '92%',
    alignSelf: 'center',
    marginTop: vs(20),
    zIndex: 1,
  },
  phoneInput: {
    width: '92%',
    alignSelf: 'center',
    marginTop: vs(20),
  },
  dropdownLabel: {
    marginBottom: vs(4),
    fontFamily: fontFamilies.medium,
    fontWeight: '600',
    fontSize: moderateScale(15.09), //16,
    zindex: 1,
  },
  dropdownPicker: {
    height: heightPercentageScale(6),
    backgroundColor: colors.inputBackgroundColor,
    borderWidth: 0,
    borderRadius: moderateScale(7.5),
    zindex: 1,
  },
  datePickerContainer: {
    width: '92%',
    alignSelf: 'center',
    marginTop: vs(20),
  },
  datePickerButton: {
    height: heightPercentageScale(6),
    backgroundColor: colors.inputBackgroundColor,
    borderWidth: 0,
    borderRadius: moderateScale(7.5),
    justifyContent: 'center',
    paddingHorizontal: moderateScale(10),
  },
  errorText: {
    marginTop: vs(4),
    color: colors.red400,
  },
  input: {
    marginHorizontal: scale(16),
    marginTop: vs(20),
    marginVertical: 0,
  },
  dropdownplaceholder: {
    color: colors.gray73,
    fontFamily: fontFamilies.medium,
    fontWeight: '500',
    fontSize: moderateScale(15.09), //16
    letterSpacing: -0.1,
  },
  helperText: {
    color: colors.gray73, // Assuming you have a gray color in your theme
    fontSize: 12, // Small font size for helper text
    marginTop: 5, // Space between input and helper text
  },
});

export default function AccountSetUpScreen() {
  const {
    firstName,
    lastName,
    dateOfBirth,
    gender,
    phone,
    email,
    password,
    confirmationPassword,
  } = useSelector(selectCreateAccountForm);
  const dispatchStore = useDispatch();
  const {isLoading} = useSelector((state: RootState) => state.user);

  const validationSchema = yup.object<FormValues>().shape({
    firstName: yup.string().required('Please enter your first name'),
    lastName: yup.string().required('Please enter your last name'),
    gender: yup.string().required('Please select your gender'),
    phone: yup.string().required('Please enter your phone number'),
    email: yup
      .string()
      .required('Please enter your email')
      .email('Please enter a valid email')
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        'Please enter a valid email',
      ),
    password: yup
      .string()
      .required('Please enter your password')
      .min(8, 'Password should be 8 chars minimum'),
    confirmationPassword: yup
      .string()
      .oneOf([yup.ref('password'), undefined], 'Passwords must match')
      .required('Required'),
    dateOfBirth: yup.string().required('Please select your Date of Birth'),
  });

  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
  } = useForm<FormValues>({
    resolver: yupResolver<FormValues>(validationSchema),
    defaultValues: {
      firstName,
      lastName,
      gender,
      dateOfBirth,
      phone,
      email,
      password,
      confirmationPassword,
    },
  });

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    {label: 'Male', value: 'male'},
    {label: 'Female', value: 'female'},
    {label: 'Other', value: 'other'},
  ]);
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const onSubmit = async () => {
    dispatchStore({type: SIGN_UP_REQUEST});
    appsFlyerTrackEvent('af_complete_registration', {
      af_registration_method: 'signingup',
      af_registration_success: 'signup_success',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title="STEP 1"
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
          showsVerticalScrollIndicator={false}>
          <CustomText
            text="SET UP ACCOUNT"
            variant="h1"
            textColor={colors.darkGreen}
            style={styles.title}
            numberOfLines={2}
          />
          <Controller
            control={control}
            name="firstName"
            render={({field: {onChange, onBlur, value}}) => {
              return (
                <CustomTextInput
                  containerStyle={styles.input}
                  value={value}
                  onChange={val => {
                    onChange(val);
                    dispatchStore(setCreateAccountForm({firstName: val}));
                  }}
                  placeholder="Enter your first name"
                  onBlur={onBlur}
                  error={errors?.firstName}
                  label="First Name*"
                />
              );
            }}
          />
          <Controller
            control={control}
            name="lastName"
            render={({field: {onChange, onBlur, value}}) => {
              return (
                <CustomTextInput
                  containerStyle={styles.input}
                  value={value}
                  onChange={val => {
                    onChange(val);
                    dispatchStore(setCreateAccountForm({lastName: val}));
                  }}
                  placeholder="Enter your last name"
                  onBlur={onBlur}
                  error={errors?.lastName}
                  label="Last Name*"
                  inputBackgroundColor={colors.inputBackgroundColor}
                />
              );
            }}
          />
          <Controller
            control={control}
            name="dateOfBirth"
            render={({field: {onChange, onBlur, value}}) => (
              <View style={styles.datePickerContainer}>
                <CustomText
                  textColor={colors.darkGreen}
                  text="Date of Birth*"
                  style={styles.dropdownLabel}
                />
                <CustomTouchableSVG
                  containerStyle={styles.datePickerButton}
                  onPress={() => setDatePickerVisible(true)}>
                  <CustomText
                    text={
                      value
                        ? new Intl.DateTimeFormat('en-US', {
                            month: '2-digit',
                            day: '2-digit',
                            year: 'numeric',
                          }).format(new Date(value))
                        : 'Enter your Date of Birth'
                    }
                    style={{
                      fontFamily: fontFamilies.medium,
                      fontWeight: '500',
                      fontSize: moderateScale(15.09), //16
                      letterSpacing: -0.1,
                      color: value ? colors.darkGreen : colors.gray73,
                    }}
                  />
                </CustomTouchableSVG>
                {errors.dateOfBirth && (
                  <CustomText
                    variant="small"
                    text={errors?.dateOfBirth?.message}
                    style={styles.errorText}
                  />
                )}
                <DatePicker
                  modal
                  open={datePickerVisible}
                  date={value ? new Date(value) : new Date()}
                  mode="date"
                  maximumDate={new Date()}
                  onConfirm={date => {
                    onChange(date);
                    dispatchStore(setCreateAccountForm({dateOfBirth: date}));
                    setDatePickerVisible(false);
                  }}
                  onCancel={() => setDatePickerVisible(false)}
                />
              </View>
            )}
          />
          <Controller
            control={control}
            name="gender"
            render={({field: {onChange, value}}) => (
              <View style={styles.dropdownContainer}>
                <CustomText
                  textColor={colors.darkGreen}
                  text="Select your Gender*"
                  style={styles.dropdownLabel}
                />
                <DropDownPicker
                  arrowIconStyle={{tintColor: colors.darkGreen}}
                  tickIconStyle={{tintColor: colors.darkGreen}}
                  placeholderStyle={styles.dropdownplaceholder}
                  open={open}
                  value={value}
                  items={items}
                  setOpen={setOpen}
                  setValue={callback => {
                    onChange(callback(value));
                    dispatchStore(
                      setCreateAccountForm({gender: callback(value)}),
                    );
                  }}
                  setItems={setItems}
                  placeholder="Please select"
                  style={styles.dropdownPicker}
                  dropDownContainerStyle={{
                    backgroundColor: colors.inputBackgroundColor,
                    borderColor: colors.grey,
                  }}
                  textStyle={{
                    fontSize: moderateScale(15.2),
                    color: value ? colors.darkGreen : colors.primary300,
                  }}
                />
                {errors.gender && (
                  <CustomText
                    variant="small"
                    text={errors.gender.message}
                    style={styles.errorText}
                  />
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="phone"
            rules={{required: 'Phone number is required'}}
            render={({field: {onChange, onBlur, value}}) => (
              <View style={styles.phoneInput}>
                <CustomText
                  textColor={colors.darkGreen}
                  text="Enter phone number*"
                  style={styles.dropdownLabel}
                />
                <PhoneNumberInput
                  value={value || ''}
                  onChange={val => {
                    console.log('val: ', val);
                    onChange(val);
                    dispatchStore(setCreateAccountForm({phone: val}));
                  }}
                  error={errors?.phone?.message}
                />
              </View>
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({field: {onChange, onBlur, value}}) => {
              return (
                <CustomTextInput
                  containerStyle={styles.input}
                  autoComplete="email"
                  value={value}
                  onChange={val => {
                    onChange(val);
                    dispatchStore(setCreateAccountForm({email: val}));
                  }}
                  placeholder="Enter your Email"
                  onBlur={onBlur}
                  error={errors?.email}
                  label="Email Address*"
                  inputBackgroundColor={colors.inputBackgroundColor}
                  keyboardType="email-address"
                />
              );
            }}
          />
          <Controller
            control={control}
            name="password"
            render={({field: {onChange, onBlur, value}}) => {
              return (
                <CustomTextInput
                  containerStyle={styles.input}
                  value={value}
                  onChange={val => {
                    onChange(val);
                    dispatchStore(setCreateAccountForm({password: val}));
                  }}
                  placeholder="Enter your Password"
                  onBlur={onBlur}
                  error={errors?.password}
                  label="Your Password*"
                  secureTextEntry
                  inputBackgroundColor={colors.inputBackgroundColor}
                />
              );
            }}
          />
          <Controller
            control={control}
            name="confirmationPassword"
            render={({field: {onChange, onBlur, value}}) => {
              return (
                <CustomTextInput
                  containerStyle={styles.input}
                  value={value}
                  onChange={val => {
                    onChange(val);
                    dispatchStore(
                      setCreateAccountForm({confirmationPassword: val}),
                    );
                  }}
                  secureTextEntry
                  placeholder="Repeat Password"
                  onBlur={onBlur}
                  error={errors?.confirmationPassword}
                  label="Repeat Password*"
                  inputBackgroundColor={colors.inputBackgroundColor}
                />
              );
            }}
          />
        </ScrollView>
        <CustomButton
          loading={isLoading}
          onPress={handleSubmit(onSubmit)}
          text="Continue"
          containerStyle={styles.continueButton}
          // active={isValid}
          hasBackView
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
