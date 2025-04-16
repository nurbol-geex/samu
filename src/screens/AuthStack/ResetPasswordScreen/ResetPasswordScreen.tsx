import {yupResolver} from '@hookform/resolvers/yup';
import React, {useState} from 'react';
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
import * as yup from 'yup';
import {resetPasswordAPI} from '../../../api/resetPasswordAPI';
import {CustomButton} from '../../../components/shared/CustomButton';
import {CustomHeader} from '../../../components/shared/CustomHeader';
import {CustomTextInput} from '../../../components/shared/CustomInputText';
import {CustomText} from '../../../components/shared/CustomText';
import {showToast} from '../../../components/shared/CustomToast/toastUtils';
import {colors} from '../../../theme/colors';
import { useDispatch } from 'react-redux';
import { setUser } from 'src/redux/user/slice';
import { Route } from 'src/routes/Route';
import * as RootNavigation from '../../../routes/RootNavigation';

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
});

export default function ResetPasswordScreen({navigation}) {
  const [password, setPassword] = useState<string>('');
  const [confirmationPassword, setConfirmPassword] = useState<string>('');
  const dispatchStore = useDispatch();

  const validationSchema = yup.object<FormValues>().shape({
    password: yup.string().required('Please enter your password'),
    confirmationPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Passwords must match'),
  });

  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
  } = useForm<FormValues>({
    resolver: yupResolver<FormValues>(validationSchema),
    defaultValues: {
      password,
      confirmationPassword,
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await resetPasswordAPI(
        data.password,
        data.confirmationPassword,
      );
      const json = await response.json();
      if (
        'status' in response &&
        response.status >= 200 &&
        response.status < 300
      ) {
        showToast('success', json.message, 'Your password has been changed');
        RootNavigation.navigate(Route.HomeScreen, {});
        dispatchStore(
          setUser({
            resetPasswordRequested: false,
          }),
        );
      } else {
        showToast('error', json.message, 'An error has occurred');
        dispatchStore(
          setUser({
            resetPasswordRequested: false,
          }),
        );
        
      }
    } catch (error) {
      showToast('error', error?.message || 'Error', 'An error has occurred');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="STEP 3" />
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
          contentContainerStyle={styles.scrollViewContentContainer}>
          <CustomText
            text="UPDATE PASSWORD"
            variant="h1"
            style={styles.title}
            textColor={colors.darkGreen}
            numberOfLines={2}
          />
          <CustomText
            text="New Password"
            variant="label"
            textColor={colors.darkGreen}
            style={styles.inputsLabel}
          />
          <View>
            <Controller
              control={control}
              name="password"
              render={({field: {onChange, onBlur, value}}) => {
                return (
                  <CustomTextInput
                    value={value}
                    onChange={val => {
                      onChange(val);
                      setPassword(val);
                    }}
                    placeholder="New password"
                    containerStyle={[styles.email, styles.shadow]}
                    onBlur={onBlur}
                    error={errors?.password}
                    placeholderPosition="center"
                  />
                );
              }}
            />
          </View>
          <CustomText
            text="Confirm Password"
            variant="label"
            style={[styles.inputsLabel, {marginTop: scale(15)}]}
            textColor={colors.darkGreen}
          />
          <View>
            <Controller
              control={control}
              name="confirmationPassword"
              render={({field: {onChange, onBlur, value}}) => {
                return (
                  <CustomTextInput
                    value={value}
                    onChange={val => {
                      onChange(val);
                      setConfirmPassword(val);
                    }}
                    placeholder="Confirm password"
                    containerStyle={[styles.email, styles.shadow]}
                    onBlur={onBlur}
                    error={errors?.confirmationPassword}
                    placeholderPosition="center"
                  />
                );
              }}
            />
          </View>
        </ScrollView>
        <CustomButton
          onPress={handleSubmit(onSubmit)}
          text="Continue"
          containerStyle={styles.continueButton}
          active
          hasBackView
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
