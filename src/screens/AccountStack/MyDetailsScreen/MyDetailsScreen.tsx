import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {Controller, useForm} from 'react-hook-form';
import {useDispatch, useSelector} from 'react-redux';
import {CustomHeader} from '../../../components/shared/CustomHeader';
import {CustomText} from '../../../components/shared/CustomText';
import {createCustomTheme} from '../../../theme/createCustomTheme';
import {colors} from '../../../theme/colors';
import {CustomButton} from 'src/components/shared/CustomButton';
import {CustomTextInput} from 'src/components/shared/CustomInputText';
import {CustomTouchableSVG} from 'src/components/shared/CustomTouchableSVG';
import {CustomModal} from 'src/components/shared/CustomModal';
import CaretSVG from 'assets/svg/CaretSVG';
import {selectCreateAccountForm} from 'src/redux/user/selectors';
import {setCreateAccountForm} from 'src/redux/user/slice';
import {DELETE_ACCOUNT, UPDATE_PROFIlE} from 'src/redux/user/constants';
import {RootStackNavigation} from 'src/routes/RootStack';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {Route} from '../../../routes/Route';
import {getOwnAccountAPI} from '../../../api/getOwnAccountAPI';
import {showToast} from '../../../components/shared/CustomToast/toastUtils';
import {changePasswordScreenPushAction} from 'src/routes/navigationActionCreators';
import {moderateScale, scale, vs} from 'react-native-size-matters';
import {CustomStatusBar} from 'src/components/shared/CustomStatusBar';
import DropDownPicker from 'react-native-dropdown-picker';
import {fontFamilies} from 'src/theme/textVariants';
import DatePicker from 'react-native-date-picker';
import {heightPercentageScale} from 'src/theme/dimensions';
import {selectUpdateProfile, selectUpdateProfileIsLoading} from 'src/redux/user/selectors';
import {useReduxSelector} from 'src/redux';

const theme = createCustomTheme();

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: colors.primaryGreen,
    marginBottom: -40,
    position: 'relative',
  },
  header: {},
  mainContainer: {
    flex: 1,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.m,
    backgroundColor: colors.white,
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

  linkItem: {
    paddingVertical: scale(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: colors.grey,
  },
  footerContainer: {
    backgroundColor: colors.white,
    paddingBottom: 40,
  },
  lastItem: {},
  modalContainer: {
    width: '100%',
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalBody: {
    backgroundColor: colors.white,
    borderTopLeftRadius: theme.spacing.l,
    borderTopRightRadius: theme.spacing.l,
    padding: theme.spacing.l,
    paddingBottom: scale(42.8),
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    textAlign: 'center',
    marginTop: scale(15),
    color: colors.primary600,
  },
  modalButton: {
    flex: 1,
  },
  cancelButton: {
    shadowColor: colors.dark,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  dropdownContainer: {
    width: '100%',
    alignSelf: 'center',
    marginVertical: vs(20),
    zIndex: 1,
  },
  dropdownLabel: {
    marginBottom: vs(4),
    fontFamily: fontFamilies.medium,
    fontWeight: '600',
    fontSize: moderateScale(15.09), //16,
  },
  dropdownPicker: {
    height: heightPercentageScale(6),
    backgroundColor: colors.inputBackgroundColor,
    borderWidth: 0,
    borderRadius: moderateScale(7.5),
  },
  datePickerContainer: {
    width: '100%',
    alignSelf: 'center',
    // marginTop: vs(20),
  },
  datePickerButton: {
    height: heightPercentageScale(6),
    backgroundColor: colors.inputBackgroundColor,
    borderWidth: 0,
    borderRadius: moderateScale(7.5),
    justifyContent: 'center',
    paddingHorizontal: moderateScale(10),
  },
});

export default function MyDetailsScreen() {
  const updateProfileData = useReduxSelector(selectUpdateProfile);
  const updateProfileLoading = useReduxSelector(selectUpdateProfileIsLoading);
  const dispatchStore = useDispatch();
  const {firstName, lastName, email, phone, gender, dateOfBirth} = useSelector(
    selectCreateAccountForm,
  );

  const [visible, setVisible] = useState<boolean>(false);

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    {label: 'Male', value: 'male'},
    {label: 'Female', value: 'female'},
    {label: 'Other', value: 'other'},
  ]);
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const navigation = useNavigation<RootStackNavigation>();

  const deleteAccount = () => {
    setVisible(true);
  };

  const validationSchema = yup.object<FormValues>().shape({
    phone: yup.string().required('Please enter your phone'),

    email: yup
      .string()
      .email('Please enter valid email')
      .required('Please enter your email'),
  });

  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver<FormValues>(validationSchema),
    defaultValues: {
      phone: '',
      email: '',
      gender: '',
      dateOfBirth: '',
      firstName: '',
      lastName: '',
    },
  });

  useEffect(() => {
    async function handler() {
      let json;
      try {
        const response = await getOwnAccountAPI();
        json = await response.json();
      } catch (e) {
        console.error(e);
        showToast('error', 'Error', 'An error has occurred');
      }
      dispatchStore(
        setCreateAccountForm({
          firstName: json?.firstName || '',
          lastName: json?.lastName || '',
          email: json?.email || '',
          phone: json?.phone || '',
          gender: json?.gender || '',
          dateOfBirth: json?.dateOfBirth || '',
        }),
      );
    }

    handler();
  }, [dispatchStore]);

  useEffect(() => {
    reset({
      email: email,
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      gender: gender,
      dateOfBirth: dateOfBirth,
    });
  }, [email, firstName, lastName, phone, gender, dateOfBirth, reset]);

  const updateProfile = () => {
    const data = {
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      dateOfBirth: dateOfBirth,
      gender: gender,
    };
    dispatchStore({type: UPDATE_PROFIlE, payload: data, navigation});
  };
  const handleDeleteAccount = () => {
    dispatchStore({type: DELETE_ACCOUNT});
    setVisible(false);
    setTimeout(() => {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            {
              name: Route.OnboardingScreen,
            },
            {
              name: Route.AuthStack,
            },
          ],
        }),
      );
    }, 400);
  };

  return (
    <>
      <View style={styles.container}>
        <CustomStatusBar />
        <CustomHeader
          title="MY DETAILS"
          titleColor={colors.white}
          containerBackgroundColor={colors.primaryGreen}
          startButtonIconType="back"
        />
        <View style={styles.mainContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Controller
              control={control}
              name="firstName"
              render={({field: {onChange, onBlur, value}}) => {
                return (
                  <CustomTextInput
                    onChange={val => {
                      onChange(val);
                      dispatchStore(setCreateAccountForm({firstName: val}));
                    }}
                    label="First Name*"
                    placeholder="Enter your first name"
                    value={value}
                    onBlur={onBlur}
                    error={errors?.firstName}
                    inputProps={{
                      textContentType: 'firstName',
                      autoComplete: 'firstName',
                    }}
                    keyboardType="default"
                    placeholderPosition="left"
                    textVariant="input"
                    containerStyle={styles.inputContainerStyle}
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
                    onChange={val => {
                      onChange(val);
                      dispatchStore(setCreateAccountForm({lastName: val}));
                    }}
                    label="Last Name*"
                    placeholder="Enter your Last name"
                    value={value}
                    onBlur={onBlur}
                    error={errors?.lastName}
                    inputProps={{
                      textContentType: 'lastName',
                      autoComplete: 'lastName',
                    }}
                    keyboardType="default"
                    placeholderPosition="left"
                    textVariant="input"
                    containerStyle={styles.inputContainerStyle}
                  />
                );
              }}
            />

            <Controller
              control={control}
              name="email"
              render={({field: {onChange, onBlur, value}}) => {
                return (
                  <CustomTextInput
                    onChange={val => {
                      onChange(val);
                      dispatchStore(setCreateAccountForm({email: val}));
                    }}
                    label="Email Address*"
                    placeholder="Email"
                    value={value}
                    onBlur={onBlur}
                    error={errors?.email}
                    editable={false}
                    inputProps={{
                      textContentType: 'emailAddress',
                      autoComplete: 'email',
                    }}
                    keyboardType="email-address"
                    placeholderPosition="left"
                    textVariant="input"
                    containerStyle={styles.inputContainerStyle}
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
                    text="Date of Birth"
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
                    text="Gender"
                    style={styles.dropdownLabel}
                  />
                  <DropDownPicker
                    // onChangeValue={(val: any) => {
                    //   onChange(val);
                    //   dispatchStore(setCreateAccountForm({gender: val}));
                    // }}
                    setValue={callback => {
                      onChange(callback(value));
                      dispatchStore(
                        setCreateAccountForm({gender: callback(value)}),
                      );
                    }}
                    value={value}
                    open={open}
                    items={items}
                    setOpen={setOpen}
                    setItems={setItems}
                    props={{
                      textContentType: 'gender',
                      autoComplete: 'gender',
                    }}
                    arrowIconStyle={{tintColor: colors.darkGreen}}
                    tickIconStyle={{tintColor: colors.darkGreen}}
                    placeholderStyle={styles.dropdownplaceholder}
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
              render={({field: {onChange, onBlur, value}}) => {
                return (
                  <CustomTextInput
                    onChange={val => {
                      onChange(val);
                      dispatchStore(setCreateAccountForm({phone: val}));
                    }}
                    label="Phone Number"
                    placeholder="Phone Number"
                    value={value}
                    onBlur={onBlur}
                    error={errors?.phone}
                     subLabel='(Please start with country code eg: +234xxxxxxxx)'
                    inputProps={{
                      textContentType: 'telephoneNumber',
                      autoComplete: 'tel',
                    }}
                    keyboardType="phone-pad"
                    placeholderPosition="left"
                    textVariant="input"
                    containerStyle={styles.inputContainerStyle}
                  />
                );
              }}
            />
            <>
              <View>
                <CustomTouchableSVG
                  containerStyle={styles.linkItem}
                  onPress={() =>
                    navigation.dispatch(changePasswordScreenPushAction())
                  }>
                  <CustomText
                    variant="text"
                    text="Change Password"
                    textColor={colors.darkGreen}
                  />
                  <CaretSVG />
                </CustomTouchableSVG>
              </View>
              <View style={styles.lastItem}>
                <CustomTouchableSVG
                  containerStyle={styles.linkItem}
                  onPress={deleteAccount}>
                  <CustomText
                    variant="text"
                    text="Delete Account"
                    textColor={colors.darkGreen}
                  />
                  <CaretSVG />
                </CustomTouchableSVG>
              </View>
            </>
          </ScrollView>
        </View>
        <View style={styles.footerContainer}>
          <CustomButton
            text="Save Changes"
            onPress={()=>{updateProfile()}}
            loading={updateProfileLoading}
            containerStyle={styles.saveButton}
            hasBackView
          />
        </View>
      </View>

      <CustomModal
        isVisible={visible}
        onModalHide={() => setVisible(false)}
        title={'Do you really want to\ndelete your account?'}
        onCancel={() => setVisible(false)}
        onOk={handleDeleteAccount}>
        <CustomText
          variant="text"
          text="Deleting your account is a permanent action and cannot be restored"
          style={styles.modalText}
        />
      </CustomModal>
    </>
  );
}