import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {Controller, useForm} from 'react-hook-form';
import {CustomHeader} from '../../../components/shared/CustomHeader';
import {CustomText} from '../../../components/shared/CustomText';
import {createCustomTheme} from '../../../theme/createCustomTheme';
import {colors} from '../../../theme/colors';
import {CustomButton} from 'src/components/shared/CustomButton';
import {CustomTextInput} from 'src/components/shared/CustomInputText';
import {scale} from 'react-native-size-matters';
import {useSelector} from 'react-redux';
import * as KeyChain from 'react-native-keychain';
import {selectCreateAccountForm} from 'src/redux/user/selectors';
import {CustomStatusBar} from '../../../components/shared/CustomStatusBar';
import {changePasswordAPI} from '../../../api/changePasswordAPI';
import {showToast} from '../../../components/shared/CustomToast/toastUtils';

const theme = createCustomTheme();

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    position: 'relative',
  },
  header: {},
  mainContainer: {
    flex: 1,
    paddingHorizontal: scale(22.4),
    marginTop: scale(15),
  },
  title: {
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 32,
    color: colors.darkGreen,
    marginTop: 10,
  },
  saveButton: {
    paddingVertical: theme.spacing.s,
  },
  label: {
    fontSize: 16,
    color: colors.darkGreen,
    letterSpacing: 0,
  },
  inputContainerStyle: {
    width: '100%',
    marginLeft: 0,
    marginTop: 5,
  },
  item: {
    marginTop: 10,
  },
  inputStyle: {
    paddingLeft: 10,
    backgroundColor: '#F8F9FB',
    borderWidth: 1,
    borderColor: `${colors.black}10`,
    color: `${colors.darkGreen}`,
  },
  linkGroup: {
    paddingHorizontal: theme.spacing.l,
  },
  linkItem: {
    paddingVertical: scale(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: colors.grey,
  },
  footerContainer: {},
  lastItem: {},
});

export default function MyDetailsScreen() {
  const {email} = useSelector(selectCreateAccountForm);
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [repeatPassword, setRepeatPassword] = useState<string>('');

  const validationSchema = yup.object<FormValues>().shape({
    oldPassword: yup
      .string()
      .required('Please enter current passowrd')
      .min(8, 'Password must be at least 8 characters long'),

    newPassword: yup
      .string()
      .required('Please enter new password')
      .min(8, 'Password must be at least 8 characters long'),

    repeatPassword: yup
      .string()
      .required('Please enter repeat password')
      .oneOf([yup.ref('newPassword')], 'Passwords must match'),
  });

  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver<FormValues>(validationSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      repeatPassword: '',
    },
  });

  useEffect(() => {
    resetForm();
  }, []);

  const resetForm = () => {
    reset({
      oldPassword: '',
      newPassword: '',
      repeatPassword: '',
    });
  };

  const onSubmit = async (data: FormValues) => {
    try {
      await KeyChain.setGenericPassword(email, data.newPassword);
      await changePassword();
      console.log('Password save successfully');
    } catch (error) {
      console.log('Could not save password.', error);
    }
  };

  const changePassword = async () => {
    try {
      const response = await changePasswordAPI(
        oldPassword,
        newPassword,
        repeatPassword,
      );
      const json = await response.json();
      if (
        'status' in response &&
        response.status >= 200 &&
        response.status < 300
      ) {
        showToast('success', json.message, 'Your password has been changed');
        resetForm();
      } else {
        showToast('error', json.message, 'An error has occurred');
      }
    } catch (error) {
      showToast('error', error?.message || 'Error', 'An error has occurred');
    }
  };

  return (
    <>
      <View style={styles.container}>
        <CustomStatusBar />
        <CustomHeader
          title="CHANGE PASSWORD"
          startButtonIconType="back"
          containerBackgroundColor={colors.primaryGreen}
          titleColor={colors.white}
        />
        <View style={styles.mainContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Controller
              control={control}
              name="oldPassword"
              render={({field: {onChange, onBlur, value}}) => {
                return (
                  <View style={styles.item}>
                    <CustomText
                      variant="label"
                      text="Current Password"
                      style={styles.label}
                    />
                    <CustomTextInput
                      value={value}
                      onChange={(val: any) => {
                        onChange(val);
                        setOldPassword(val);
                      }}
                      placeholder="Enter your current password"
                      containerStyle={styles.inputContainerStyle}
                      onBlur={onBlur}
                      error={errors?.oldPassword}
                      placeholderPosition="left"
                      type="password"
                    />
                  </View>
                );
              }}
            />
            <Controller
              control={control}
              name="newPassword"
              render={({field: {onChange, onBlur, value}}) => {
                return (
                  <View style={styles.item}>
                    <CustomText
                      variant="label"
                      text="New Password"
                      style={styles.label}
                    />
                    <CustomTextInput
                      value={value}
                      onChange={(val: any) => {
                        onChange(val);
                        setNewPassword(val);
                      }}
                      placeholder="Enter your new password"
                      containerStyle={styles.inputContainerStyle}
                      onBlur={onBlur}
                      error={errors?.newPassword}
                      placeholderPosition="left"
                      type="password"
                    />
                  </View>
                );
              }}
            />
            <Controller
              control={control}
              name="repeatPassword"
              render={({field: {onChange, onBlur, value}}) => {
                return (
                  <View style={styles.item}>
                    <CustomText
                      variant="label"
                      text="Repeat New Password"
                      style={styles.label}
                    />
                    <CustomTextInput
                      value={value}
                      onChange={(val: any) => {
                        onChange(val);
                        setRepeatPassword(val);
                      }}
                      placeholder="Repeat your new password"
                      containerStyle={styles.inputContainerStyle}
                      onBlur={onBlur}
                      error={errors?.repeatPassword}
                      placeholderPosition="left"
                      type="password"
                    />
                  </View>
                );
              }}
            />
          </ScrollView>
        </View>
        <View style={styles.footerContainer}>
          <CustomButton
            text="Save Changes"
            onPress={handleSubmit(onSubmit)}
            containerStyle={styles.saveButton}
            hasBackView
          />
        </View>
      </View>
    </>
  );
}
