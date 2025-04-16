import {yupResolver} from '@hookform/resolvers/yup';
import {useNavigation, useRoute} from '@react-navigation/native';
import AppleButtonSVG from 'assets/svg/AppleButtonSVG';
import GoogleButtonSVG from 'assets/svg/GoogleButtonSVG';
import React, {useCallback, useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {moderateScale, scale, vs} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';
import * as yup from 'yup';
import {CustomButton} from '../../../components/shared/CustomButton';
import {CustomHeader} from '../../../components/shared/CustomHeader';
import {CustomTextInput} from '../../../components/shared/CustomInputText';
import {CustomLink} from '../../../components/shared/CustomLink';
import {CustomText} from '../../../components/shared/CustomText';
import {CustomTouchableSVG} from '../../../components/shared/CustomTouchableSVG';
import {
  GUEST_LOGIN,
  LOGIN_REQUEST,
  LOGOUT,
  SOCIAL_AUTH,
} from '../../../redux/user/constants';
import {AuthenticationType} from '../../../redux/user/initialState';
import {
  resetUser,
  setCreateAccountForm,
  setIsGuest,
  setUser,
} from '../../../redux/user/slice';
import {AuthStackNavigation} from '../../../routes/AuthStack';
import {Route} from '../../../routes/Route';
import {colors} from '../../../theme/colors';
import {widthPercentageScale} from 'src/theme/dimensions';
import {getBaseUrlFromEmail, getBaseUrlFromStorage} from 'src/utils/SetENV';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {RootState, useReduxSelector} from 'src/redux';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';
import {
  resetActiveReducer,
  resetCancelledReducer,
  resetCompletedReducer,
} from 'src/redux/orders/thunk/getAllOrders';
import {useLocation} from 'src/utils/hooks/useLocation';
import useGuestLocation from 'src/utils/hooks/useGuestLocation';
import {checkMultiple, PERMISSIONS} from 'react-native-permissions';
import * as RootNavigation from '../../../routes/RootNavigation';
import Geolocation from 'react-native-geolocation-service';
import DeviceInfo from 'react-native-device-info';
import {appsFlyerTrackEvent} from 'src/utils';

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
    marginHorizontal: scale(14),
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: vs(62),
  },
  emailOrPhoneInput: {
    marginTop: vs(14),
    marginBottom: vs(30),
  },
  passwordInput: {
    marginTop: -vs(7),
    bottom: vs(10),
  },
  orText: {
    top: vs(6),
    alignSelf: 'center',
  },
  forgot: {
    alignSelf: 'flex-end',
    bottom: vs(25),
    width: '40%',
  },
  googleButton: {
    backgroundColor: colors.gray73,
    marginTop: vs(20),
  },
  appleButton: {
    backgroundColor: colors.gray73,
    marginTop: vs(13),
  },
  continueWithEmailOrPhoneButton: {
    backgroundColor: colors.gray73,
    marginTop: vs(-15),
  },
  shadow: {
    borderWidth: 0,
    borderRadius: moderateScale(14),
    alignSelf: 'center',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  btnContainer: {
    marginHorizontal: 0,
    width: widthPercentageScale(84),
    alignSelf: 'center',
  },
});

export default function LoginScreen() {
  const route = useRoute();
  const {dataFromSignUp} = route.params || {};
  const {
    user: {accessToken, isGuest, lat, lng},
  } = useReduxSelector(store => ({user: store.user}));
  const [emailOrPhone, setEmailOrPhone] = useState<string>(dataFromSignUp);
  const navigation = useNavigation<AuthStackNavigation>();
  const dispatchStore = useDispatch();
  const {isLoading} = useSelector((state: RootState) => state.user);
  const [isloadings, setIsLoadings] = useState(false);
  const [isloadingGoogle, setIsloadingGoogle] = useState(false);
  const Permissions =
    Platform.OS === 'ios'
      ? [PERMISSIONS.IOS.LOCATION_ALWAYS, PERMISSIONS.IOS.LOCATION_WHEN_IN_USE]
      : [
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
        ];

  useEffect(() => {
    if (validatePhone(emailOrPhone)) {
      dispatchStore(setCreateAccountForm({phone: emailOrPhone, email: ''}));
      return;
    }
    if (validateEmail(emailOrPhone)) {
      dispatchStore(setCreateAccountForm({phone: '', email: emailOrPhone}));
      return;
    }
    dispatchStore(setCreateAccountForm({phone: '', email: ''}));
  }, [emailOrPhone]);

  function validateEmail(email: string | undefined) {
    return yup.string().email('Please enter a valid email').isValidSync(email);
  }

  function validatePhone(phone: string | undefined) {
    const phoneRegExp = /^\+?[1-9]\d{1,14}$/; // E.164 format
    return yup
      .string()
      .matches(
        phoneRegExp,
        'Phone number is not valid. It must start with a country code (e.g., +234)',
      )
      .isValidSync(phone);
  }

  const validationSchema = yup.object<FormValues>().shape({
    emailOrPhone: yup
      .string()
      .required('Please enter your email/phone')
      .test('emailOrPhone', 'Email/Phone is not valid', value => {
        return validateEmail(value) || validatePhone(value);
      }),
    password: yup.string().optional(),
    // .required('Please enter your password')
    // .min(8, 'Password is too short - should be 8 chars minimum.')
    // .when('emailOrPhone', (values, schema) => {
    //   if (validatePhone(values[0].value())) return schema.optional();
    // }),
    // .test('validWhenEmail', (value, context) =>
    //   validateEmail(context.parent.emailOrPhone),
    // ),
  });

  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
  } = useForm<FormValues>({
    resolver: yupResolver<FormValues>(validationSchema),
    defaultValues: {
      emailOrPhone: emailOrPhone || dataFromSignUp,
      password: '',
    },
  });

  const getGoogleIcon = useCallback(
    () => (
      <TouchableWithoutFeedback onPress={googleSignin}>
        <GoogleButtonSVG />
      </TouchableWithoutFeedback>
    ),
    [],
  );

  const getAppleIcon = useCallback(
    () => (
      <TouchableWithoutFeedback onPress={signInWithApple}>
        <AppleButtonSVG />
      </TouchableWithoutFeedback>
    ),
    [],
  );

  const googleSignin = async () => {
    setIsloadingGoogle(true);
    try {
      await GoogleSignin.hasPlayServices();

      const response = await GoogleSignin.signIn();

      if (response) {
        const {idToken, user} = response.data;

        // Dispatch the action with idToken and email
        dispatchStore({
          type: SOCIAL_AUTH,
          payload: {
            email: user.email,
            signupType: 'google',
            // appleUserId: undefined,
            // authorizationCode: idToken, // Send tokenId in the payload
          },
        });
      }
    } catch (error) {
      console.log('Error signing in: ', error);
      setIsloadingGoogle(false);
    }
  };

  async function signInWithApple() {
    setIsLoadings(true);
    try {
      // Start the sign-in request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });

      // Ensure Apple returned a user identityToken
      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - no identity token returned');
      }

      // Extract the identityToken, nonce, and user information
      const {identityToken, nonce, user} = appleAuthRequestResponse;

      // Extract user details such as email (check for null values if necessary)
      const email = user.email ?? null;

      // Create a Firebase credential from the response
      const appleCredential = auth.AppleAuthProvider.credential(
        identityToken,
        nonce,
      );

      // Sign the user in with the credential
      await auth().signInWithCredential(appleCredential);

      // Dispatch the action with idToken and email
      dispatchStore({
        type: SOCIAL_AUTH,
        payload: {
          email: email,
          signupType: 'apple', // Specify 'apple' as the signupType
          authorizationCode: appleAuthRequestResponse?.authorizationCode,
          appleUserId: appleAuthRequestResponse?.user, // Send the user in the payload
        },
      });
    } catch (error) {
      console.log('Error signing in with Apple: ', error);
      setIsLoadings(false);
    }
  }

  const onSubmit = async () => {
    try {
      await dispatchStore(
        setUser({
          authenticationType: validatePhone(emailOrPhone)
            ? AuthenticationType.PhoneLogin
            : AuthenticationType.EmailLogin,
        }),
      );
      appsFlyerTrackEvent('af_login', {
        af_login_method: emailOrPhone,
        af_login_success: 'login_success',
      });
      // Then initiate login request
      await dispatchStore({type: LOGIN_REQUEST});
    } catch (error) {
      console.error('Error during login:', error);
    } finally {
    }
  };

  const handleGuestLogin = async () => {
    const deviceId = await `${DeviceInfo.getUniqueId()}${Math.random()}`;
    dispatchStore({
      type: GUEST_LOGIN,
      payload: {
        deviceId,
      },
    });
  };

  useEffect(() => {
    getBaseUrlFromStorage();
    getBaseUrlFromEmail(emailOrPhone);
    // Retrieve the base URL later
  }, [emailOrPhone]);

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title="LOGIN"
        titleColor={colors.darkGreen}
        containerBackgroundColor={colors.grey}
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
          bounces={false}
          showsVerticalScrollIndicator={false}>
          <CustomText
            text="LOGIN TO YOUR ACCOUNT"
            variant="h1"
            textColor={colors.darkGreen}
            style={styles.title}
            numberOfLines={2}
          />
          <Controller
            control={control}
            name="emailOrPhone"
            render={({field: {onChange, onBlur, value}}) => {
              return (
                <CustomTextInput
                  value={value}
                  onChange={val => {
                    onChange(val);
                    setEmailOrPhone(val);
                  }}
                  subLabel={
                    validatePhone(emailOrPhone) && !validateEmail(emailOrPhone)
                      ? '(Please start with country code eg: +234xxxxxxxx)'
                      : ''
                  }
                  placeholder="Enter your Email/Phone"
                  inputContainerStyle={styles.shadow}
                  containerStyle={styles.emailOrPhoneInput}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  error={errors?.emailOrPhone}
                  placeholderPosition="center"
                  autoCapitalize="none"
                />
              );
            }}
          />
          {!validatePhone(emailOrPhone) ? (
            <>
              <Controller
                control={control}
                name="password"
                render={({field: {onChange, onBlur, value}}) => {
                  return (
                    <CustomTextInput
                      value={value}
                      onChange={val => {
                        onChange(val);
                        dispatchStore(setCreateAccountForm({password: val}));
                      }}
                      secureTextEntry
                      placeholder="Enter your Password"
                      inputContainerStyle={styles.shadow}
                      containerStyle={styles.passwordInput}
                      onBlur={onBlur}
                      error={errors?.password}
                      inputBackgroundColor={colors.inputBackgroundColor}
                      placeholderPosition="center"
                    />
                  );
                }}
              />

              <CustomLink
                text="Forgot Password"
                type="link2"
                style={styles.forgot}
                onPress={() =>
                  navigation.navigate(Route.PhoneVerificationStack, {
                    screen: Route.PhoneNumberInputScreen,
                  })
                }
              />
            </>
          ) : null}

          <CustomButton
            // loading={isLoading}
            onPress={handleSubmit(onSubmit)}
            // text={`Login with ${
            //   validatePhone(emailOrPhone) ? 'Phone' : 'Email'
            // }`}
            text={'Login'}
            btnContainerStyle={styles.btnContainer}
            containerStyle={[
              styles.continueWithEmailOrPhoneButton,
              styles.shadow,
            ]}
            active={isValid}
            touchableBackgroundColor={colors.darkGreen}
          />

          {/* <CustomText
            text="or"
            variant="text"
            style={[styles.orText, {marginTop: scale(7.5)}]}
          /> */}
          {/* <CustomButton
            // Set your preferred spinner color here
            loadingColor={colors.black} // Custom color for loading spinner
            loading={isloadingGoogle}
            onPress={googleSignin}
            text="Login with Google"
            touchableBackgroundColor={colors.white}
            textColor={colors.black}
            btnContainerStyle={styles.btnContainer}
            containerStyle={[styles.googleButton, styles.shadow]}
            IconComponent={getGoogleIcon()}
            active
          /> */}
          {/* {Platform.OS === 'ios' && (
            <CustomButton
              loading={isloadings}
              onPress={signInWithApple}
              text="Login with Apple"
              touchableBackgroundColor={colors.black}
              textColor={colors.white}
              btnContainerStyle={styles.btnContainer}
              containerStyle={[styles.appleButton, styles.shadow]}
              IconComponent={getAppleIcon()}
              active
            />
          )} */}

          <CustomButton
            onPress={handleGuestLogin}
            text="Continue as Guest"
            touchableBackgroundColor={colors.black}
            textColor={colors.white}
            btnContainerStyle={styles.btnContainer}
            containerStyle={[styles.appleButton, styles.shadow]}
            active
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
