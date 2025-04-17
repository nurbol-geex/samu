import {yupResolver} from '@hookform/resolvers/yup';
import {useNavigation} from '@react-navigation/native';
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
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {moderateScale, scale, vs} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';
import * as yup from 'yup';
import {testIDs} from '../../../assets/testIDs';
import {CustomButton} from '../../../components/shared/CustomButton';
import {CustomHeader} from '../../../components/shared/CustomHeader';
import {CustomTextInput} from '../../../components/shared/CustomInputText';
import {CustomLink} from '../../../components/shared/CustomLink';
import {CustomText} from '../../../components/shared/CustomText';
import {CustomTouchableSVG} from '../../../components/shared/CustomTouchableSVG';
import {
  selectCreateAccountForm,
  selectUpdateProfileIsLoading,
} from '../../../redux/user/selectors';
import {setCreateAccountForm} from '../../../redux/user/slice';
import {AuthStackNavigation} from '../../../routes/AuthStack';
import {
  accountSetUpScreenPushAction,
  loginScreenPushAction,
} from '../../../routes/navigationActionCreators';
import {colors} from '../../../theme/colors';
import {useReduxSelector} from 'src/redux';
import axios from 'axios';
import {Route} from 'src/routes/Route';
import {widthPercentageScale} from 'src/theme/dimensions';
// import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {getBaseUrlFromEmail, getBaseUrlFromStorage} from 'src/utils/SetENV';
import {showToast} from 'src/components/shared/CustomToast/toastUtils';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';
import {GUEST_LOGIN, SOCIAL_AUTH} from 'src/redux/user/constants';
import { storage } from 'src/redux/MMKVStorage';
import useGuestLocation from 'src/utils/hooks/useGuestLocation';
import DeviceInfo from 'react-native-device-info';
import { useAnalytics, initSegment } from 'src/segmentService';
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
    marginTop: vs(100),
  },
  emailInput: {
    marginTop: vs(14),
  },
  orText: {
    alignSelf: 'center',
    marginTop: vs(8),
  },
  googleButton: {
    backgroundColor: colors.gray73,
    marginTop: vs(21),
  },
  appleButton: {
    backgroundColor: colors.gray73,
    marginTop: vs(13),
  },
  otherOptions: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  loginNowRow: {
    marginTop: vs(6.5),
    marginBottom: vs(14),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginNowLabel: {
    alignSelf: 'center',
  },
  loginNow: {
    marginStart: scale(3.8),
  },
  continueAsGuest: {
    alignSelf: 'center',
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
  email: {
    backgroundColor: colors.gray73,
    bottom: vs(8),
  },
});

export default function SignUpScreen() {
  const dispatchStore = useDispatch();
  const navigation = useNavigation<AuthStackNavigation>();
  const [emailOrPhone, setEmailOrPhone] = useState<string>('');
  const updateProfileLoading = useReduxSelector(selectUpdateProfileIsLoading);
  const [isloading, setIsLoading] = useState(false);
  const [isloadings, setIsLoadings] = useState(false);
  const {email, phone} = useSelector(selectCreateAccountForm);
  const isOnboard = useReduxSelector(store => store.settings.isOnBoard);
  const [isloadingGoogle, setIsloadingGoogle] = useState(false);
const[deviceId,setDeviceId]=useState()

const { track } = useAnalytics();
  function validatePhone(phone: string | undefined) {
    const phoneRegExp = /^\+?[1-9]\d{1,14}$/; // E.164 format
    return yup
      .string()
      .matches(phoneRegExp, 'Phone number is not valid. It must start with a country code (e.g., +234)')
      .isValidSync(phone);
  }
  
  function validateEmail(email: string | undefined) {
    return yup.string().email('Please enter a valid email').isValidSync(email);
  }

  // const googleSignin = async () => {
  //   setIsloadingGoogle(true)
  //   try {
  //     await GoogleSignin.hasPlayServices();

  //     const response = await GoogleSignin.signIn();

  //     if (response) {
  //       const {idToken, user} = response.data;


  //       // Dispatch the action with idToken and email
  //       dispatchStore({
  //         type: SOCIAL_AUTH,
  //         payload: {
  //           email: user.email,
  //           signupType: 'google',
  //           appleUserId: undefined,
  //           authorizationCode: idToken, // Send tokenId in the payload
  //         },
  //       });
  //     }
  //   } catch (error) {
  //     console.log('Error signing in: ', error);
     

  //   }
  //   setIsloadingGoogle(false)
  // };

  const validationSchema = yup.object<FormValues>().shape({
    emailOrPhone: yup
      .string()
      .required('Please enter your email/phone')
      .test('emailOrPhone', 'Email/Phone is not valid', value => {
        return validateEmail(value) || validatePhone(value);
      }),
    password: yup.string().optional(),
  });
  // async function signInWithApple() {
  //   setIsLoadings(true)
  //   try {
  //     // Start the sign-in request
  //     const appleAuthRequestResponse = await appleAuth.performRequest({
  //       requestedOperation: appleAuth.Operation.LOGIN,
  //       requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
  //     });


  //     // Ensure Apple returned a user identityToken
  //     if (!appleAuthRequestResponse.identityToken) {
  //       throw new Error('Apple Sign-In failed - no identity token returned');
  //     }

  //     // Extract the identityToken, nonce, and user information
  //     const {identityToken, nonce, user} = appleAuthRequestResponse;

  //     // Extract user details such as email (check for null values if necessary)
  //     const email = user.email ?? null;


  //     // Create a Firebase credential from the response
  //     const appleCredential = auth.AppleAuthProvider.credential(
  //       identityToken,
  //       nonce,
  //     );

  //     // Sign the user in with the credential
  //     await auth().signInWithCredential(appleCredential);

  //     // Dispatch the action with idToken and email
  //     dispatchStore({
  //       type: SOCIAL_AUTH,
  //       payload: {
  //         email: email, // User email
  //         signupType: 'apple', // Specify 'apple' as the signupType
  //         authorizationCode: appleAuthRequestResponse?.authorizationCode,
  //         appleUserId: appleAuthRequestResponse?.user, // Send the user in the payload
  //       },
  //     });
  //   } catch (error) {
  //     console.log('Error signing in with Apple: ', error);
  //     setIsLoadings(false)
  //   }

  // }

  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
  } = useForm<FormValues>({
    resolver: yupResolver<FormValues>(validationSchema),
    defaultValues: {
      emailOrPhone,
    },
  });

  const getGoogleIcon = useCallback(
    () => (
      <CustomTouchableSVG onPress={() => {}}>
        <GoogleButtonSVG />
      </CustomTouchableSVG>
    ),
    [],
  );

  const getAppleIcon = useCallback(
    () => (
      <CustomTouchableSVG onPress={() => {}}>
        <AppleButtonSVG />
      </CustomTouchableSVG>
    ),
    [],
  );

  const onNavigateToAccountSetUpScreen = useCallback(async () => {
    try {
      setIsLoading(true)
      let response;
      if (phone) {
        response = await axios.post(
          `${getBaseUrlFromStorage()}/user/auth/phone-verify`,
          {
            phone,
          },
        );
      } else {
        response = await axios.post(
          `${getBaseUrlFromStorage()}/user/auth/email-verify`,
          {
            email,
          },
        );
      }
      if (response.data.message === 'Success') {
        setIsLoading(false)

        navigation.navigate(Route.LoginScreen, {
          dataFromSignUp: phone || email,
        });
      }

      // navigation.dispatch(accountSetUpScreenPushAction());
    } catch (error) {
      setIsLoading(false)

      if (error?.response?.data?.message === 'User not found.') {
        navigation.dispatch(accountSetUpScreenPushAction());
      } else {
        showToast(
          'error',
          error?.response?.data?.message || 'An error has occurred',
        );
      }
    }
  }, [navigation, email, phone]);

  const onLoginNowPress = useCallback(() => {
    navigation.dispatch(loginScreenPushAction());
  }, [navigation]);

  const onContinueAsGuestPress = useCallback(() => {
    // navigation.dispatch(locationScreenPushAction());
    dispatchStore(setCreateAccountForm({isGuest: true}));
  }, [navigation]);

  const onSubmit = () => {
    onNavigateToAccountSetUpScreen();
  };

  useEffect(() => {
    if (validatePhone(emailOrPhone)) {
      dispatchStore(setCreateAccountForm({phone: emailOrPhone, email: ''}));
      return;
    }
    if (validateEmail(emailOrPhone)) {
      dispatchStore(setCreateAccountForm({phone: '', email: emailOrPhone}));
      return;
    } else {
      dispatchStore(setCreateAccountForm({phone: '', email: ''}));
    }
  }, [emailOrPhone, dispatchStore]);

  useEffect(() => {
    getBaseUrlFromStorage();   
    getBaseUrlFromEmail(email); 
  }, [email]);  

  // useEffect(() => {
  //   if(DeviceInfo.getUniqueId()){
  //     setDeviceId(DeviceInfo.getUniqueId()?._j)
  //   }
  // }, [DeviceInfo.getUniqueId()])
  
  const handleGuestLogin = async () => {
    setIsLoadings(true);
    try {
      // Явно инициализируем Segment перед отправкой события
      await initSegment();
      
      console.log('Trying to track event');
      track('Continue as Guest', {
        productId: 123,
        productName: 'Striped trousers',
      });
      console.log('Continue as Guest');
      
      // Раскомментируйте этот код, когда будете готовы использовать гостевой вход
      // const deviceId = await DeviceInfo.getUniqueId();
      // dispatchStore({
      //   type: GUEST_LOGIN,
      //   payload: {
      //     deviceId
      //   },
      // });
    } catch (error) {
      console.error('Error in guest login:', error);
    } finally {
      setIsLoadings(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} testID={testIDs.signUpScreen.id}>
      <CustomHeader
        title="SIGNUP"
        titleColor={colors.darkGreen}
        containerBackgroundColor={colors.grey}
        startButtonIconType={'none'}
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
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContentContainer}
          bounces={false}>
          <CustomText
            text="JOIN SAMU TODAY"
            variant="h1"
            style={styles.title}
            textColor={colors.darkGreen}
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
                    // if (validatePhone(val)) {
                    //   dispatchStore(setCreateAccountForm({phone: val}));
                    // } else {
                    //   dispatchStore(setCreateAccountForm({email: val}));
                    // }
                  }}
                  placeholder="Enter your Email/Phone"
                  inputContainerStyle={styles.shadow}
                  containerStyle={styles.emailInput}
                  onBlur={onBlur}
                  // subLabel={validatePhone(phone)?'(Please start with country code eg: +234xxxxxxxx)':''}
                  error={errors?.email}
                  placeholderPosition="center"
                  keyboardType="email-address"
                  autoComplete="email"
                  autoCapitalize="none"
                />
              );
            }}
          />
          <CustomButton
            loading={isloading}
            btnContainerStyle={styles.btnContainer}
            containerStyle={[styles.email, styles.shadow]}
            onPress={handleSubmit(onSubmit)}
            text={`Continue with ${validatePhone(phone) ? 'Phone' : 'Email'}`}
            active={isValid}
            touchableBackgroundColor={colors.darkGreen}
          />
          {/* <CustomText text="or" variant="text" style={styles.orText} /> */}

          {/* <CustomButton
            loading={updateProfileLoading}
            onPress={googleSignin}
            text="Continue with Google"
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
              text="Continue with Apple"
              touchableBackgroundColor={colors.black}
              textColor={colors.white}
              btnContainerStyle={styles.btnContainer}
              containerStyle={[styles.appleButton, styles.shadow]}
              IconComponent={getAppleIcon()}
              active
            />
          )} */}

                     <CustomButton
                      loading={isloadings}
                      onPress={handleGuestLogin}
                        text="Continue as Guest asd"
                        touchableBackgroundColor={colors.black}
                        textColor={colors.white}
                        btnContainerStyle={styles.btnContainer}
                        containerStyle={[styles.appleButton, styles.shadow]}
                        active
                      />
          <View style={styles.otherOptions}>
            <View style={styles.loginNowRow}>
              <CustomText
                text="Already got an account?"
                variant="text"
                style={styles.loginNowLabel}
              />
              <CustomLink
                onPress={onLoginNowPress}
                text="Login"
                type="link2"
                style={styles.loginNow}
              />
              {/* <CustomText
                text=" | "
                variant="text"
                style={styles.continueAsGuest}
              />
              <CustomLink
                onPress={onContinueAsGuestPress}
                text="Skip for Now"
                type="link2"
                style={styles.continueAsGuest}
              /> */}
              
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
