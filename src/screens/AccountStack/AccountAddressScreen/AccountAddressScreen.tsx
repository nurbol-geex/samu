import React, {useEffect} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {CustomHeader} from '../../../components/shared/CustomHeader';
import {CustomText} from '../../../components/shared/CustomText';
import {createCustomTheme} from '../../../theme/createCustomTheme';
import {colors} from '../../../theme/colors';
import {CustomTouchableSVG} from 'src/components/shared/CustomTouchableSVG';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {RootStackNavigation} from 'src/routes/RootStack';
import {useNavigation} from '@react-navigation/native';
import {CustomRadioLabel} from '../../../components/shared/CustomRadioLabel';
import {CustomRadioButton} from 'src/components/shared/CustomRadioButton';
import PlusSVG from 'assets/svg/PlusSVG';
import {addressEditScreenPushAction} from 'src/routes/navigationActionCreators';
import {scale, vs} from 'react-native-size-matters';
import {CustomStatusBar} from 'src/components/shared/CustomStatusBar';
import {useHeaderUserAddresses} from 'src/components/shared/CustomHomeHeader/useHeaderUserAddresses';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from 'src/redux';
import {
  addressInitialState,
  setSelectedAddress,
} from '../../../redux/address/slice';
import {updateAddress} from 'src/redux/address/addressApiThunk';

const theme = createCustomTheme();

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: colors.primaryGreen,
    position: 'relative',
  },
  header: {},
  mainContainer: {
    height: '100%',
    flex: 1,
    paddingHorizontal: scale(12),
    backgroundColor: colors.white,
  },
  title: {
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 32,
    color: colors.darkGreen,
    marginTop: 10,
  },
  addressSelectButton: {
    backgroundColor: colors.green500,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(7.5) + 5,
    marginTop: scale(15),
    borderRadius: 9999,
  },
  radioButtonContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingHorizontal: scale(15),
    paddingVertical: scale(7.5),
  },
  activeRadioButton: {
    borderColor: colors.primaryGreen,
    borderWidth: 1,
    backgroundColor: `${colors.primaryGreen}20`,
    borderRadius: 10,
  },
  selectedRadioButton: {
    borderColor: `${colors.primaryGreen}`,
    borderWidth: 1,
    backgroundColor: `${colors.primaryGreen}20`,
    borderRadius: 10,
  },
  linkItem: {
    paddingVertical: scale(15),
    paddingHorizontal: scale(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: colors.grey,
  },
  addressIconContainer: {
    borderRadius: 9999,
    backgroundColor: colors.primaryGreen,
    padding: scale(7.5),
  },
  text: {
    alignSelf: 'center',
    marginLeft: scale(15),
    fontWeight: '700',
  },
});

export default function AccountAddressScreen() {
  const navigation = useNavigation<RootStackNavigation>();
  const dispatchStore: AppDispatch = useDispatch();

  const {onAddNewAddressPress} = useHeaderUserAddresses(true);

  const {addresses, selectedAddress, isLoading, primaryAddress} = useSelector(
    (state: RootState) => state.addresses,
  );
  const selectedAddressFunc = (item: Address) => {
    dispatchStore(setSelectedAddress(item));
    navigation.dispatch(
      addressEditScreenPushAction({
        addressId: selectedAddress?._id,
      }),
    );
  };

  const handleUpdatedPrimaryAddress = () => {
    dispatchStore(
      updateAddress({
        updatedAddress: {...selectedAddress, primary: true},
        routeFrom: '',
      }),
    );
  };

  useEffect(() => {
    return () => {
      dispatchStore(setSelectedAddress(addressInitialState));
    };
  }, [dispatchStore]);

  return (
    <>
      <View style={styles.container}>
        <CustomStatusBar />
        <CustomHeader
          title="ADDRESSES"
          titleColor={colors.white}
          containerBackgroundColor={colors.primaryGreen}
          startButtonIconType="back"
        />
        <View style={styles.mainContainer}>
          <ScrollView
            style={{paddingTop: theme.spacing.xs}}
            showsVerticalScrollIndicator={false}>
            {(addresses || []).map(item => {
              const {_id, street, city, name, unit, typeOfPlace, deliveryNotes} = item;
              return (
                <CustomRadioButton
                  key={_id}
                  id={_id}
                  label={<CustomRadioLabel deliveryNotes={deliveryNotes} name={name} typeOfPlace={typeOfPlace} unit={typeOfPlace === "Apartment" ? `${unit}, ` : ""} address={street} city={city} />}
                  // containerStyle={[
                  //   styles.radioButtonContainer,
                  //   primaryAddress?._id === _id && !selectedAddress?._id
                  //     ? styles.activeRadioButton
                  //     : selectedAddress?._id === _id
                  //     ? styles.selectedRadioButton
                  //     : {},
                  // ]}
                  containerStyle={[
                    styles.radioButtonContainer,
                    primaryAddress?._id === _id
                      ? styles.selectedRadioButton
                      : {},
                  ]}
                  onPress={() => selectedAddressFunc(item)}
                  color={colors.primaryGreen}
                  borderColor={colors.primaryGreen}
                  selected={primaryAddress?._id === _id}
                />
              );
            })}
            <View
              style={{paddingHorizontal: scale(7.5), paddingBottom: vs(10)}}>
              <CustomTouchableSVG
                containerStyle={styles.linkItem}
                onPress={onAddNewAddressPress}>
                <View
                  style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                  <View style={styles.addressIconContainer}>
                    <PlusSVG width="20" height="20" />
                  </View>
                  <CustomText
                    variant="text"
                    text="Add New Address"
                    style={styles.text}
                    textColor={colors.darkGreen}
                  />
                </View>
                <MaterialIcons
                  style={{left: 4}}
                  name="keyboard-arrow-right"
                  size={30}
                  color={colors.primaryGreen}
                />
              </CustomTouchableSVG>
            </View>
            {/* <View style={{paddingHorizontal: scale(7.5)}}>
              <CustomTouchableSVG
                containerStyle={styles.linkItem}
                onPress={() => {
                  navigation.dispatch(
                    addressEditScreenPushAction({
                      addressId: selectedAddress?._id,
                    }),
                  );
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={styles.addressIconContainer}>
                    <EditSVG width="20" height="20" />
                  </View>
                  <CustomText
                    variant="text"
                    text="Edit Address"
                    style={styles.text}
                    textColor={colors.darkGreen}
                  />
                </View>
                <MaterialIcons
                  style={{left: 4}}
                  name="keyboard-arrow-right"
                  size={30}
                  color={colors.primaryGreen}
                />
              </CustomTouchableSVG>
            </View> */}
          </ScrollView>
          {/* <View style={{marginVertical: vs(12)}}>
            <CustomButton
              onPress={handleUpdatedPrimaryAddress}
              text="Save Changes"
              touchableBackgroundColor={colors.green400}
              loading={isLoading}
            />
          </View> */}
        </View>
      </View>
    </>
  );
}
