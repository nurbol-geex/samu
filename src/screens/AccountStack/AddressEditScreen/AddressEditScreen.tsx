import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {Controller, useForm} from 'react-hook-form';
import {CustomHeader} from '../../../components/shared/CustomHeader';
import {CustomText} from '../../../components/shared/CustomText';
import {colors} from '../../../theme/colors';
import {CustomButton} from 'src/components/shared/CustomButton';
import {CustomTextInput} from 'src/components/shared/CustomInputText';
import {CustomModal} from 'src/components/shared/CustomModal';
import {CustomStatusBar} from 'src/components/shared/CustomStatusBar';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectDeleteDone,
  selectUpdateDone,
} from '../../../redux/user/selectors';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  AccountStackNavigation,
  AccountStackRouteProps,
} from '../../../routes/AccountStack';
import {Route} from '../../../routes/Route';

import {setUser, setUserAddress} from '../../../redux/user/slice';
import {moderateScale, scale, vs} from 'react-native-size-matters';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {RootState} from 'src/redux';
import {AppDispatch} from '../../../redux/index';
import {showToast} from 'src/components/shared/CustomToast/toastUtils';
import {updateAddress, deleteAddress} from 'src/redux/address/addressApiThunk';
import DropDownPicker from 'react-native-dropdown-picker';
import {fontFamilies} from 'src/theme/textVariants';
import {heightPercentageScale} from 'src/theme/dimensions';
import Feather from 'react-native-vector-icons/Feather';
import { CustomHintText } from 'src/components/shared/CustomHintText';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { CustomTouchableSVG } from 'src/components/shared/CustomTouchableSVG';

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
  continueButton: {
    flexGrow: 1,
    textAlign: 'center',
    alignSelf: 'center',
    padding: 0,
    margin: 0,
    width: '45%',
    paddingHorizontal: 20,
  },
  bottomView: {
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: `${colors.dark}20`,
    paddingVertical: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    color: colors.darkGreen,
    letterSpacing: 0,
  },
  inputContainerStyle: {
    width: '100%',
    marginLeft: 0,
    marginTop: vs(4),
  },
  item: {
    marginTop: vs(20),
    position: 'relative',
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

  modalText: {
    textAlign: 'center',
    marginTop: scale(15),
  },
  dropdownContainer: {
    alignSelf: 'center',
    zIndex: 1,
    // bottom:vs(3)
    // marginTop:vs(2)
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
  labelContainer: {
    height: 60, 
    width: 60, 
    borderWidth: 1, 
    borderRadius: 100, 
    marginBottom: 6,
    borderColor: colors.grey,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf:'center'
  },
});

export default function AddressEditScreen() {
  const {
    params: {addressId},
  } = useRoute<AccountStackRouteProps<Route.AddressEditScreen>>();

  const dispatchStore: AppDispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    {label: 'Hotel', value: 'Hotel'},
    {label: 'Apartment', value: 'Apartment'},
    {label: 'House', value: 'House'},
  ]);
  const navigation = useNavigation<AccountStackNavigation>();
  const [showAdditionalField, setShowAdditionalField] = useState(false);

  const [visible, setVisible] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState();
  const [locationInputFocused, setlocationInputFocused] = useState(false);



  const {selectedAddress, primaryAddress} = useSelector(
    (state: RootState) => state.addresses,
  );
  const abc = useSelector((state: RootState) => state);
  const {
    name,
    _id,
    primary,
    street,
    unit,
    city,
    zip,
    country,
    province,
    typeOfPlace,
    deliveryNotes,
  } = selectedAddress || primaryAddress;

  const updateDone = useSelector(selectUpdateDone);

  const deleteDone = useSelector(selectDeleteDone);

  const onDeleteAddress = useCallback(() => {
    if (primary) {
      setVisible(false);
      showToast('error', 'Primary address can not be deleted');
    } else {
      dispatchStore(deleteAddress(_id));
      setVisible(false);
    }
  }, [dispatchStore, _id, primary]);

  const validationSchema = yup.object<FormValues>().shape({
    street: yup.string().required('Please enter your address'),
    name: yup.string().required('Please enter your name'),
    unit: yup.string().optional(),
    province: yup.string().optional(),
    city: yup.string().optional(),

    zip: yup.string().optional(),
    country: yup.string().optional(),
    typeOfPlace: yup.string().optional(),
    deliveryNotes: yup.string().optional(),
  });

  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver<FormValues>(validationSchema),
    defaultValues: {
      name,
      street,
      unit,
      province,
      city,
      zip,
      country,
      typeOfPlace,
      deliveryNotes,
    },
  });

  const onSubmit = useCallback(
    (data: FormValues) => {
      const updatedAddress = {
        ...selectedAddress,
        ...data,
      };
      dispatchStore(
        updateAddress({
          updatedAddress: updatedAddress,
          routeFrom: Route.AccountAddressScreen,
        }),
      );
    },
    [selectedAddress, dispatchStore],
  );

  useEffect(() => {
    if (updateDone) {
      dispatchStore(setUser({updateDone: false}));
    }
  }, [dispatchStore, navigation, updateDone]);

  useEffect(() => {
    if (deleteDone) {
      dispatchStore(setUser({deleteDone: false}));
      navigation.goBack();
    }
  }, [dispatchStore, navigation, deleteDone]);

  useEffect(() => {
    if (
      primaryAddress.typeOfPlace === 'Hotel' ||
      primaryAddress.typeOfPlace === 'Apartment'
    ) {
      setShowAdditionalField(true);
    } else {
      setShowAdditionalField(false);
    }
  }, [primaryAddress.typeOfPlace, dispatchStore, setUserAddress]);
  return (
    <>
      <View style={styles.container}>
        <CustomStatusBar />
        <CustomHeader
          title="EDIT ADDRESSES"
          titleColor={colors.white}
          containerBackgroundColor={colors.primaryGreen}
          startButtonIconType="back"
        />
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          style={styles.mainContainer}>
          <View style={{paddingHorizontal: scale(13), paddingTop: vs(10)}}>
            <View>
              <Controller
               control={control}
               name="name"
               render={({field: {onChange, onBlur, value}}) => {
                setSelectedLabel(value);
                 return (
                   <>
                     <CustomText
                       variant="label"
                       text="Label*"
                       textColor={colors.darkGreen}
                       style={{marginBottom: 8, marginTop: 10}}
                     />
                     <View style={{flexDirection:'row', justifyContent: 'space-between', marginBottom: 18}}>
                       <CustomTouchableSVG onPress={()=>{
                         setSelectedLabel('Home')
                         onChange("Home");
                         dispatchStore(
                          setUserAddress({_id: addressId, name: "Home"}),
                        )
                         }}>
                         <View style={[styles.labelContainer,
                         {
                           backgroundColor: selectedLabel === "Home" ? '#0c513f17' : colors.white,
                           borderColor: selectedLabel === "Home" ? colors.darkGreen : colors.grey
                         }]}>
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

                       <CustomTouchableSVG onPress={()=>{
                         setSelectedLabel('Work')
                         onChange("Work");
                         dispatchStore(
                          setUserAddress({_id: addressId, name: "Work"}),
                        )
                       }}>
                         <View style={[styles.labelContainer,
                           {
                             backgroundColor: selectedLabel === "Work" ? '#0c513f17' : colors.white,
                             borderColor: selectedLabel === "Work" ? colors.darkGreen : colors.grey
                           }]}>
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

                       <CustomTouchableSVG onPress={()=>{
                         setSelectedLabel('Partner')
                         onChange("Partner");
                         dispatchStore(
                          setUserAddress({_id: addressId, name: "Partner"}),
                        )
                         }}>
                         <View style={[styles.labelContainer,
                           {
                             backgroundColor: selectedLabel === "Partner" ? '#0c513f17' : colors.white,
                             borderColor: selectedLabel === "Partner" ? colors.darkGreen : colors.grey
                           }]}>
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

                       <CustomTouchableSVG onPress={()=>{
                         setSelectedLabel('Other')
                         onChange('');
                         dispatchStore(
                          setUserAddress({_id: addressId, name: ''}),
                        )
                         }}>
                         <View style={[styles.labelContainer,
                           {
                             backgroundColor: selectedLabel !== "Home" && selectedLabel !== "Work" && selectedLabel !== "Partner" ? '#0c513f17' : colors.white,
                             borderColor: selectedLabel !== "Home" && selectedLabel !== "Work" && selectedLabel !== "Partner" ? colors.darkGreen : colors.grey
                           }]}>
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
                     {selectedLabel !== "Home" && selectedLabel !== "Work" && selectedLabel !== "Partner" ? (
                       <View style={{}}>
                         <CustomTextInput
                           value={value}
                           onChange={(val: any) => {
                             onChange(val);
                             dispatchStore(
                               setUserAddress({_id: addressId, name: val}),
                             )
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
              {/* <Controller
                control={control}
                name="street"
                render={({field: {onChange, onBlur, value}}) => {
                  return (
                    <View style={styles.item}>
                      <CustomText
                        variant="label"
                        text="Address*"
                        textColor={colors.darkGreen}
                      />
                      <CustomTextInput
                        value={value}
                        onChange={(val: any) => {
                          onChange(val);
                          dispatchStore(
                            setUserAddress({_id: addressId, street: val}),
                          );
                        }}
                        placeholder="Please enter your address"
                        containerStyle={styles.inputContainerStyle}
                        onBlur={onBlur}
                        error={errors?.street}
                        placeholderPosition="left"
                      />
                    </View>
                  );
                }}
              /> */}

              <Controller
                control={control}
                name="street"
                render={({field: {onChange, onBlur, value}}) => {
                  return (
                    <View
                      style={[
                        styles.item,
                        {zIndex: 3, elevation: 3, marginTop: vs(-2), marginBottom: 18},
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
                              setUserAddress({
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
                          key: 'AIzaSyCqVpS-EXUupXT-NHrv4cvvK6LyaKE_cvw',
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
                              setUserAddress({
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

                          if (
                            selectedValue === 'Hotel' ||
                            selectedValue === 'Apartment'
                          ) {
                            setShowAdditionalField(true);
                          } else {
                            setShowAdditionalField(false);
                          }

                          dispatchStore(
                            setUserAddress({typeOfPlace: selectedValue}), // Update Redux store
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
                                  dispatchStore(setUserAddress({unit: text})); // Update Redux store
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
                    <View style={styles.item}>
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
                            setUserAddress({_id: addressId, province: val}),
                          );
                        }}
                        placeholder="Optional"
                        containerStyle={styles.inputContainerStyle}
                        onBlur={onBlur}
                        error={errors?.province}
                        placeholderPosition="left"
                        maxLength={40}
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
                    <View>
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
                            setUserAddress({_id: addressId, city: val}),
                          );
                        }}
                        placeholder="Optional"
                        containerStyle={styles.inputContainerStyle}
                        onBlur={onBlur}
                        error={errors?.city}
                        placeholderPosition="left"
                        maxLength={32}
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
                    <View>
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
                            setUserAddress({_id: addressId, zip: val}),
                          );
                        }}
                        placeholder="Optional"
                        containerStyle={styles.inputContainerStyle}
                        onBlur={onBlur}
                        error={errors?.zip}
                        placeholderPosition="left"
                        maxLength={8}
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
                    <View>
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
                            setUserAddress({_id: addressId, country: val}),
                          );
                        }}
                        placeholder="Optional"
                        containerStyle={styles.inputContainerStyle}
                        onBlur={onBlur}
                        error={errors?.country}
                        placeholderPosition="left"
                        maxLength={56}
                      />
                    </View>
                  );
                }}
              />
              <Controller
                control={control}
                name="deliveryNotes"
                render={({field: {onChange, onBlur, value}}) => {
                  return (
                    <CustomTextInput
                      placeholder="Note to rider - e.g. landmark"
                      onBlur={onBlur}
                      placeholderPosition="left"
                      value={value}
                      onChange={(val: any) => {
                        onChange(val);
                        dispatchStore(
                          setUserAddress({
                            deliveryNotes: val,
                          }),
                        );
                      }}
                      label="Delivery Instructions*"
                      multiline
                      inputStyle={{paddingTop: vs(10), paddingLeft: vs(12)}}
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
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: vs(12),
              marginVertical: vs(20),
              justifyContent: 'space-between',
            }}>
            <CustomButton
              text="Save Changes"
              onPress={handleSubmit(onSubmit)}
              containerStyle={styles.continueButton}
              btnContainerStyle={{borderRadius: 10, marginHorizontal: 0}}
            />
            <CustomButton
              // style={{paddingHorizontal: scale(3)}}
              text="Remove Address"
              onPress={() => setVisible(true)}
              touchableBackgroundColor={colors.red300}
              containerStyle={[styles.continueButton]}
              btnContainerStyle={{borderRadius: 10, marginHorizontal: 0}}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
      <CustomModal
        isVisible={visible}
        onModalHide={() => setVisible(false)}
        title="Do you really want to remove this address?"
        onCancel={() => setVisible(false)}
        onOk={onDeleteAddress}>
        <CustomText
          variant="text"
          text="Lorem ipsum dolor sit amet consectetur. Consequat sollicitudin faucibus amet duis cras varius. Venenatis interdum porta."
          style={styles.modalText}
        />
      </CustomModal>
    </>
  );
}
