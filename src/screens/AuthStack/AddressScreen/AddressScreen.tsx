import {yupResolver} from '@hookform/resolvers/yup';
import {useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {StyleSheet, View} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {CustomButton} from 'src/components/shared/CustomButton';
import {CustomTextInput} from 'src/components/shared/CustomInputText';
import * as yup from 'yup';
import {CustomHeader} from '../../../components/shared/CustomHeader';
import {CustomText} from '../../../components/shared/CustomText';
import {AppDispatch, RootState} from '../../../redux';
import {selectCreateAddressForm} from '../../../redux/user/selectors';
import {setCreateAddressForm} from '../../../redux/user/slice';
import {AuthStackRouteProps} from '../../../routes/AuthStack';
import {Route} from '../../../routes/Route';
import {colors} from '../../../theme/colors';
import {moderateScale, scale, vs} from 'react-native-size-matters';
import {CustomHintText} from 'src/components/shared/CustomHintText';
import {addAddress} from 'src/redux/address/addressApiThunk';
import {showToast} from 'src/components/shared/CustomToast/toastUtils';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {heightPercentageScale} from 'src/theme/dimensions';
import DropDownPicker from 'react-native-dropdown-picker';
import {fontFamilies} from 'src/theme/textVariants';
import Feather from 'react-native-vector-icons/Feather';
import {CustomTouchableSVG} from 'src/components/shared/CustomTouchableSVG';
import {NEW_GOOGLE_MAPS_API_KEY} from "@env"
import { useAnalytics } from 'src/segmentService';
const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {},
  mainContainer: {
    flex: 1,
  },
  title: {
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: vs(8),
  },

  inputContainerStyle: {
    width: '100%',
    height: heightPercentageScale(6),
    marginLeft: 0,
    marginTop: vs(5),
  },
  item: {
    // marginTop: vs(8),
    // borderWidth: 1,
    // height:heightPercentageScale(10),
    // position: 'relative',
  },
  inputStyle: {
    height: heightPercentageScale(6),
    backgroundColor: colors.inputBackgroundColor,
    marginTop: vs(-16),
    borderRadius: scale(7.5),
    color: colors.darkGreen,
    fontWeight: '500',
    fontSize: moderateScale(15),
    // marginBottom:20,
    // borderWidth:1,
  },
  autocompleteListViewStyle: {
    borderWidth: 0.6,
    borderColor: colors.dark,
    position: 'absolute',
    top: vs(34),
    left: 0,
    right: 0,
    zIndex: 10000,
    // elevation: 3,
  },
  dropdownplaceholder: {
    color: colors.gray73,
    fontFamily: fontFamilies.medium,
    fontWeight: '500',
    fontSize: moderateScale(15.09), //16
    letterSpacing: -0.1,
  },
  dropdownPicker: {
    height: heightPercentageScale(6),
    backgroundColor: colors.inputBackgroundColor,
    borderWidth: 0,
    borderRadius: moderateScale(7.5),
  },
  dropdownContainer: {
    alignSelf: 'center',
    zIndex: 1,
    // bottom:vs(3)
    // marginTop:vs(2)
  },
  dditionalInputContainer: {},
  inputContainer: {
    marginHorizontal: scale(0),
    marginVertical: vs(0),
  },
  deliveryInput: {
    verticalAlign: 'top',
    paddingTop: vs(12),
    paddingLeft: vs(12),
    fontFamily: fontFamilies.medium,
    fontWeight: '500',
    fontSize: moderateScale(15.09), //16
    letterSpacing: -0.1,
    color: colors.darkGreen,
  },
  labelContainer: {
    height: 60,
    width: 60,
    borderWidth: 1,
    borderRadius: 100,
    marginBottom: 6,
    borderColor: colors.grey,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});

export default function AddressScreen() {
  const route = useRoute<AuthStackRouteProps<Route.AddressScreen>>();
  const {createFromAccount, deliveryAddress} = route.params;
  console.log('createFromAccount: ', createFromAccount);
  
  const { track } = useAnalytics(); 

  const [locationInputFocused, setlocationInputFocused] = useState(false);
  const {
    street,
    unit,
    name,
    province,
    city,
    zip,
    country,
    geometry,
    typeOfPlace,
    deliveryNotes,
  } = useSelector(selectCreateAddressForm);

  const data = useSelector(selectCreateAddressForm);
  const [selectedLabel, setSelectedLabel] = useState();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    {label: 'Hotel', value: 'Hotel'},
    {label: 'Apartment', value: 'Apartment'},
    {label: 'House', value: 'House'},
  ]);
  const {isLoading} = useSelector((state: RootState) => state.addresses);
  const [error, setError] = useState('');
  const [showAdditionalField, setShowAdditionalField] = useState(false);

  const dispatchStore: AppDispatch = useDispatch();

  const validationSchema = yup.object<FormValues>().shape({
    street: yup.string().required('Please enter your address'),
    unit: yup.string().optional(),
    province: yup.string().required('Please enter your province'),
    name: yup.string().required('Please enter your name'),
    city: yup.string().required('Please enter your city'),
    zip: yup.string().required('Please enter your zip'),
    country: yup.string().required('Please enter your country'),
    typeOfPlace: yup.string().required('Please select type of place'),
    deliveryNotes: yup.string(),
  });

  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver<FormValues>(validationSchema),
    defaultValues: {
      street,
      unit,
      province,
      name,
      city,
      zip,
      country,
      geometry,
      typeOfPlace,
      deliveryNotes,
    },
  });

  useEffect(() => {
    reset({
      street,
      unit,
      province,
      name,
      city,
      zip,
      country,
      geometry,
      typeOfPlace,
      deliveryNotes,
    });
  }, [
    street,
    unit,
    province,
    name,
    city,
    zip,
    country,
    geometry,
    typeOfPlace,
    deliveryNotes,
    reset,
  ]);

  const onSubmit = () => {
    let addressParams = {
      street,
      unit,
      province,
      name,
      city,
      zip,
      country,
      geometry,
      primary: deliveryAddress ? false : true,
      typeOfPlace,
      deliveryNotes,
    };
    dispatchStore(
      addAddress({
        newAddress: addressParams,
        routeFrom: !createFromAccount ? 'tab' : 'goBack',
        setError: setError,
      }),
    );

    // NEW ANALYTICS START
    track("Address added", { addressParams });

  };

  // useEffect(() => {
  //   if (error) {
  //     showToast('error', error);
  //   }
  // }, [error]);

  useEffect(() => {
    typeOfPlace === 'Hotel'
      ? dispatchStore(setCreateAddressForm({unit: 'Meet me in lobby'}))
      : dispatchStore(setCreateAddressForm({unit: ''}));
  }, [typeOfPlace]);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <CustomHeader
          titleColor={colors.darkGreen}
          containerBackgroundColor={colors.white}
          startButtonIconType="circular-back"
          title="ADD ADDRESS"
        />
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          style={styles.mainContainer}>
          <View style={{paddingHorizontal: scale(13)}}>
            <View>
              <Controller
                control={control}
                name="name"
                render={({field: {onChange, onBlur, value}}) => {
                  return (
                    <>
                      <CustomText
                        variant="label"
                        text="Add a Label*"
                        textColor={colors.darkGreen}
                        style={{marginBottom: 8, marginTop: 10}}
                      />
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginBottom: 18,
                        }}>
                        <CustomTouchableSVG
                          onPress={() => {
                            setSelectedLabel('Home');
                            onChange('Home');
                            dispatchStore(
                              setCreateAddressForm({
                                name: 'Home',
                              }),
                            );
                          }}>
                          <View
                            style={[
                              styles.labelContainer,
                              {
                                backgroundColor:
                                  selectedLabel === 'Home'
                                    ? '#0c513f17'
                                    : colors.white,
                                borderColor:
                                  selectedLabel === 'Home'
                                    ? colors.darkGreen
                                    : colors.grey,
                              },
                            ]}>
                            <Feather
                              style={{alignSelf: 'center'}}
                              color={colors.darkGreen}
                              size={24}
                              name="home"
                            />
                          </View>
                          <CustomText
                            style={{alignSelf: 'center'}}
                            variant="label"
                            text="Home"
                            textColor={colors.darkGreen}
                          />
                        </CustomTouchableSVG>

                        <CustomTouchableSVG
                          onPress={() => {
                            setSelectedLabel('Work');
                            onChange('Work');
                            dispatchStore(
                              setCreateAddressForm({
                                name: 'Work',
                              }),
                            );
                          }}>
                          <View
                            style={[
                              styles.labelContainer,
                              {
                                backgroundColor:
                                  selectedLabel === 'Work'
                                    ? '#0c513f17'
                                    : colors.white,
                                borderColor:
                                  selectedLabel === 'Work'
                                    ? colors.darkGreen
                                    : colors.grey,
                              },
                            ]}>
                            <Feather
                              style={{alignSelf: 'center'}}
                              color={colors.darkGreen}
                              size={24}
                              name="briefcase"
                            />
                          </View>
                          <CustomText
                            style={{alignSelf: 'center'}}
                            variant="label"
                            text="Work"
                            textColor={colors.darkGreen}
                          />
                        </CustomTouchableSVG>

                        <CustomTouchableSVG
                          onPress={() => {
                            setSelectedLabel('Partner');
                            onChange('Partner');
                            dispatchStore(
                              setCreateAddressForm({
                                name: 'Partner',
                              }),
                            );
                          }}>
                          <View
                            style={[
                              styles.labelContainer,
                              {
                                backgroundColor:
                                  selectedLabel === 'Partner'
                                    ? '#0c513f17'
                                    : colors.white,
                                borderColor:
                                  selectedLabel === 'Partner'
                                    ? colors.darkGreen
                                    : colors.grey,
                              },
                            ]}>
                            <Feather
                              style={{alignSelf: 'center'}}
                              color={colors.darkGreen}
                              size={24}
                              name="heart"
                            />
                          </View>
                          <CustomText
                            style={{alignSelf: 'center'}}
                            variant="label"
                            text="Partner"
                            textColor={colors.darkGreen}
                          />
                        </CustomTouchableSVG>

                        <CustomTouchableSVG
                          onPress={() => {
                            setSelectedLabel('Other');
                            onChange('');
                            dispatchStore(
                              setCreateAddressForm({
                                name: '',
                              }),
                            );
                          }}>
                          <View
                            style={[
                              styles.labelContainer,
                              {
                                backgroundColor:
                                  selectedLabel === 'Other'
                                    ? '#0c513f17'
                                    : colors.white,
                                borderColor:
                                  selectedLabel === 'Other'
                                    ? colors.darkGreen
                                    : colors.grey,
                              },
                            ]}>
                            <Feather
                              style={{alignSelf: 'center'}}
                              color={colors.darkGreen}
                              size={24}
                              name="plus"
                            />
                          </View>
                          <CustomText
                            style={{alignSelf: 'center'}}
                            variant="label"
                            text="Other"
                            textColor={colors.darkGreen}
                          />
                        </CustomTouchableSVG>
                      </View>
                      {selectedLabel === 'Other' ? (
                        <View style={{}}>
                          <CustomTextInput
                            value={value}
                            onChange={(val: any) => {
                              onChange(val);
                              dispatchStore(
                                setCreateAddressForm({
                                  name: val,
                                }),
                              );
                            }}
                            placeholder="e.g. 🏠 Adam's house"
                            containerStyle={styles.inputContainerStyle}
                            onBlur={onBlur}
                            error={errors?.name}
                            placeholderPosition="left"
                          />
                        </View>
                      ) : null}
                    </>
                  );
                }}
              />
              <Controller
                control={control}
                name="street"
                render={({field: {onChange, onBlur, value}}) => {
                  return (
                    <View
                      style={[
                        styles.item,
                        {zIndex: 3, elevation: 3, marginTop: vs(-2)},
                      ]}>
                      <CustomText
                        style={{marginBottom: vs(20)}}
                        variant="label"
                        text="Address*"
                        textColor={colors.darkGreen}
                      />
                      <GooglePlacesAutocomplete
                        placeholder="Please enter your address"
                        onPress={(data, details = null) => {
                          // 'details' is provided when fetchDetails = true
                          if (details) {
                            const addressComponents =
                              details.address_components;
                            let a_street = '',
                              // a_unit = '',
                              a_city = '',
                              a_province = '',
                              // a_name = '',
                              a_postcode = '',
                              a_country = '';

                            addressComponents.forEach(component => {
                              if (component.types.includes('street_number')) {
                                a_street = component.long_name;
                              }
                              if (component.types.includes('route')) {
                                a_street =
                                  a_street !== ''
                                    ? `${a_street} ${component.long_name}`
                                    : component.long_name;
                              }
                              // if (component.types.includes('subpremise')) {
                              //   a_unit = component.long_name;
                              // }
                              if (component.types.includes('locality')) {
                                a_city = component.long_name;
                              }
                              if (
                                component.types.includes(
                                  'administrative_area_level_1',
                                )
                              ) {
                                a_province = component.long_name;
                              }
                              if (component.types.includes('postal_code')) {
                                a_postcode = component.long_name;
                              }
                              if (component.types.includes('country')) {
                                a_country = component.long_name;
                              }
                            });
                            onChange(a_street);
                            dispatchStore(
                              setCreateAddressForm({
                                street: a_street,
                                // unit: a_unit,
                                city: a_city,
                                // name: a_name,
                                province: a_province,
                                zip: a_postcode,
                                country: a_country,
                                geometry: `${details?.geometry?.location?.lat}, ${details?.geometry?.location?.lng}`,
                              }),
                            );
                            setlocationInputFocused(false);
                          }
                        }}
                        query={{
                          key: NEW_GOOGLE_MAPS_API_KEY,
                          language: 'en',
                          types: 'address', // Use types for addressing specific place types
                        }}
                        styles={{
                          description: {color: colors.darkGreen},
                          textInput: styles.inputStyle,
                          textInputContainer: styles.inputContainerStyle,
                          listView: styles.autocompleteListViewStyle,
                        }}
                        suppressDefaultStyles={false}
                        enablePoweredByContainer={false}
                        fetchDetails={true}
                        textInputProps={{
                          placeholderTextColor: colors.gray73,
                          onFocus: () => setlocationInputFocused(true),
                          value: value, // Set the value of the input
                          onBlur: onBlur, // Notify react-hook-form on blur
                          onChange: e => {
                            onChange(e.nativeEvent.text);
                            dispatchStore(
                              setCreateAddressForm({
                                street: e.nativeEvent.text,
                                geometry: '',
                              }),
                            );
                          }, // Update the value on change
                          cursorColor: colors.darkGreen,
                        }}
                        listViewDisplayed={false}
                        listEmptyComponent={
                          <View
                            style={{
                              backgroundColor: colors.white,
                              paddingVertical: scale(3.8),
                            }}>
                            <CustomText
                              text={'No Data'}
                              variant={'text'}
                              style={{alignSelf: 'center'}}
                            />
                          </View>
                        }
                        debounce={1000}
                        disableScroll={false}
                        // disableScroll
                      />
                      {errors.street && (
                        <CustomHintText
                          containerStyle={{marginTop: vs(-15)}}
                          message={errors.street.message || ''}
                        />
                      )}
                    </View>
                  );
                }}
              />

              <Controller
                control={control}
                name="typeOfPlace"
                render={({field: {onChange, onBlur, value}}) => {
                  return (
                    <View style={styles.dropdownContainer}>
                      <CustomText
                        variant="label"
                        text="Type of Place*"
                        textColor={colors.darkGreen}
                        style={{marginBottom: scale(6)}}
                      />
                      <DropDownPicker
                        placeholderStyle={styles.dropdownplaceholder}
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={callback => {
                          const selectedValue = callback(value);
                          onChange(selectedValue); // Update form state

                          // Show additional field if Hotel or Apartment is selected
                          if (
                            selectedValue === 'Hotel' ||
                            selectedValue === 'Apartment'
                          ) {
                            setShowAdditionalField(true);
                          } else {
                            setShowAdditionalField(false);
                          }

                          dispatchStore(
                            setCreateAddressForm({typeOfPlace: selectedValue}), // Update Redux store
                          );
                        }}
                        setItems={setItems}
                        placeholder="Please select type of place"
                        style={styles.dropdownPicker}
                        dropDownContainerStyle={{
                          backgroundColor: colors.inputBackgroundColor,
                          borderColor: colors.grey,
                        }}
                        textStyle={{
                          fontSize: moderateScale(15.2),
                          color: value ? colors.darkGreen : colors.primary300,
                        }}
                        error={errors?.typeOfPlace}
                      />
                      {showAdditionalField && (
                        <Controller
                          control={control}
                          name="unit"
                          render={({field: {onChange, onBlur, value}}) => (
                            <View style={{top: vs(17)}}>
                              <CustomText
                                variant="label"
                                text="Unit"
                                textColor={colors.darkGreen}
                              />
                              <CustomTextInput
                                containerStyle={styles.inputContainerStyle}
                                // style={styles.additionalInput}
                                placeholder="Please enter Unit"
                                onChange={text => {
                                  onChange(text); // Update form state
                                  dispatchStore(
                                    setCreateAddressForm({unit: text}),
                                  ); // Update Redux store
                                }}
                                value={value} // Prefill value if empty
                              />
                            </View>
                          )}
                        />
                      )}
                    </View>
                  );
                }}
              />

              <Controller
                control={control}
                name="province"
                render={({field: {onChange, onBlur, value}}) => {
                  return (
                    <View style={[styles.item, {marginTop: vs(14)}]}>
                      <CustomText
                        variant="label"
                        text="Province*"
                        textColor={colors.darkGreen}
                      />
                      <CustomTextInput
                        value={value}
                        onChange={(val: any) => {
                          onChange(val);
                          dispatchStore(
                            setCreateAddressForm({
                              province: val,
                            }),
                          );
                        }}
                        placeholder="Please enter your province"
                        containerStyle={styles.inputContainerStyle}
                        onBlur={onBlur}
                        error={errors?.province}
                        placeholderPosition="left"
                      />
                    </View>
                  );
                }}
              />
              <Controller
                control={control}
                name="city"
                render={({field: {onChange, onBlur, value}}) => {
                  return (
                    <View style={styles.item}>
                      <CustomText
                        variant="label"
                        text="City*"
                        textColor={colors.darkGreen}
                      />
                      <CustomTextInput
                        value={value}
                        onChange={(val: any) => {
                          onChange(val);
                          dispatchStore(
                            setCreateAddressForm({
                              city: val,
                            }),
                          );
                        }}
                        placeholder="Please enter your city"
                        containerStyle={styles.inputContainerStyle}
                        onBlur={onBlur}
                        error={errors?.city}
                        placeholderPosition="left"
                      />
                    </View>
                  );
                }}
              />
              <Controller
                control={control}
                name="zip"
                render={({field: {onChange, onBlur, value}}) => {
                  return (
                    <View style={styles.item}>
                      <CustomText
                        variant="label"
                        text="Postcode*"
                        textColor={colors.darkGreen}
                      />
                      <CustomTextInput
                        keyboardType={'numeric'}
                        value={value}
                        onChange={(val: any) => {
                          onChange(val);
                          dispatchStore(
                            setCreateAddressForm({
                              zip: val,
                            }),
                          );
                        }}
                        placeholder="Please enter your postal code"
                        containerStyle={styles.inputContainerStyle}
                        onBlur={onBlur}
                        error={errors?.zip}
                        placeholderPosition="left"
                      />
                    </View>
                  );
                }}
              />
              <Controller
                control={control}
                name="country"
                render={({field: {onChange, onBlur, value}}) => {
                  return (
                    <View style={styles.item}>
                      <CustomText
                        variant="label"
                        text="Country*"
                        textColor={colors.darkGreen}
                      />
                      <CustomTextInput
                        value={value}
                        onChange={(val: any) => {
                          onChange(val);
                          dispatchStore(
                            setCreateAddressForm({
                              country: val,
                            }),
                          );
                        }}
                        placeholder="Please enter your country"
                        containerStyle={styles.inputContainerStyle}
                        onBlur={onBlur}
                        error={errors?.country}
                        placeholderPosition="left"
                      />
                    </View>
                  );
                }}
              />
            </View>
            <Controller
              control={control}
              name="deliveryNotes"
              render={({field: {onChange, onBlur, value}}) => {
                return (
                  <CustomTextInput
                    placeholder="Note to rider - e.g. landmark"
                    onBlur={onBlur}
                    error={errors?.province}
                    placeholderPosition="left"
                    value={value}
                    onChange={(val: any) => {
                      onChange(val);
                      dispatchStore(
                        setCreateAddressForm({
                          deliveryNotes: val,
                        }),
                      );
                    }}
                    label="Delivery Instructions*"
                    multiline
                    style={styles.deliveryInput}
                    containerStyle={{
                      marginVertical: 0,
                      marginHorizontal: 0,
                    }}
                    inputContainerStyle={{
                      marginBottom: scale(20),
                      // height: heightPercentageScale(14),
                      alignItems: 'flex-start',
                    }}
                  />
                );
              }}
            />
          </View>

          <CustomButton
            text="Continue"
            onPress={handleSubmit(onSubmit)}
            hasBackView
            active={isValid}
            loading={isLoading}
          />
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </>
  );
}
