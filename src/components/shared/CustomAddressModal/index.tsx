/* eslint-disable react-native/no-inline-styles */
import PlusSVG from 'assets/svg/PlusSVG';
import React, {useEffect} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {moderateScale, scale, vs} from 'react-native-size-matters';
import {CustomModal} from 'src/components/shared/CustomModal';
import {CustomRadioButton} from 'src/components/shared/CustomRadioButton';
import {CustomRadioLabel} from 'src/components/shared/CustomRadioLabel';
import {CustomText} from 'src/components/shared/CustomText';
import {CustomTouchableSVG} from 'src/components/shared/CustomTouchableSVG';
import {colors} from 'src/theme/colors';
import {CustomButton} from '../CustomButton';
import {AppDispatch, RootState, useReduxSelector} from 'src/redux';
import {useDispatch, useSelector} from 'react-redux';
import {addressInitialState, setSelectedAddress} from 'src/redux/address/slice';
import {updateAddress} from 'src/redux/address/addressApiThunk';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const SelectAddressModal: React.FC<SelectAddressModalProps> = props => {
  const {
    isVisible,
    setVisible,
    onAddNewAddressPress,
    hideButton,
    handleUdpatedAddress,
    deliveryAddress,
  } = props;
  const dispatchStore: AppDispatch = useDispatch();

  const {addresses, selectedAddress, isLoading, primaryAddress} = useSelector(
    (state: RootState) => state.addresses,
  );
  // const {deliveryAddress} = useReduxSelector(selectProductGetCart);

  const user = useReduxSelector(str => str.user);

  const selectedAddressFunc = (item: Address) => {
    dispatchStore(setSelectedAddress(item));
  };

  const handleUpdatedPrimaryAddress = async () => {
  

    dispatchStore(updateAddress({
      updatedAddress: { ...selectedAddress, primary: true },
      routeFrom: '',
    }))
    .then(() => {
      setVisible(false);
    })
    .catch((error) => {
      console.error('Error updating address: ', error);
    });
  };
  

  useEffect(() => {
    if (isVisible) {
      setVisible(false);
    }
  }, [addresses]);

  useEffect(() => {
    if (!isVisible) {
      dispatchStore(setSelectedAddress(addressInitialState));
    }
  }, [dispatchStore, isVisible]);

  return (
    <CustomModal
      isVisible={isVisible}
      onModalHide={() => setVisible(false)}
      title={hideButton ? 'Delivery Address' : 'Your Addresses'}
      titleStyle={{fontSize: 26}}
      cancelText=""
      okText=""
      containerStyle={styles.modal}>
      <ScrollView
        style={{marginTop: scale(22.4)}}
        showsVerticalScrollIndicator={false}>
        {(addresses || []).map(item => {
          const {_id, street, city, deliveryNotes, name, typeOfPlace, unit} = item;
          return (
            <CustomRadioButton
              key={_id}
              id={_id}
              label={<CustomRadioLabel deliveryNotes={deliveryNotes} name={name} typeOfPlace={typeOfPlace} unit={typeOfPlace === "Apartment" ? `${unit}, ` : ""} address={street} city={city} />}
              containerStyle={[
                styles.radioButtonContainer,
                (hideButton &&
                  deliveryAddress?.street === street &&
                  !selectedAddress?._id) ||
                (!hideButton &&
                  primaryAddress?._id === _id &&
                  !selectedAddress?._id)
                  ? styles.activeRadioButton
                  : selectedAddress?._id === _id
                  ? styles.selectedRadioButton
                  : {},
              ]}
              onPress={() => {
                selectedAddressFunc(item);
              }}
              color={colors.primaryGreen}
              borderColor={colors.primaryGreen}
              selected={
                (hideButton && deliveryAddress?.street === street) ||
                (!hideButton && primaryAddress?._id === _id)
              }
            />
          );
        })}
        <View style={{paddingHorizontal: scale(7.5)}}>
          <CustomTouchableSVG
            containerStyle={styles.linkItem}
            onPress={onAddNewAddressPress}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={styles.addressIconContainer}>
                <PlusSVG width="20" height="20" />
              </View>
              <CustomText
                variant="text"
                text="Add New Address"
                style={{
                  fontWeight: '700',
                  alignSelf: 'center',
                  marginLeft: scale(13),
                }}
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
      </ScrollView>
      {user?.accessToken ? (
        <View style={{marginVertical: vs(12)}}>
          <CustomButton
            onPress={() => {

              if (hideButton) {
                handleUdpatedAddress && handleUdpatedAddress();
              } else {
                handleUpdatedPrimaryAddress();
              }
            }}
            text="Save Changes"
            touchableBackgroundColor={colors.green400}
            loading={isLoading}
          />
        </View>
      ) : null}
    </CustomModal>
  );
};

export default SelectAddressModal;

const styles = StyleSheet.create({
  radioButtonContainer: {
    borderBottomWidth: 1,
    borderColor: colors.grey,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingHorizontal: scale(15),
    paddingVertical: vs(10),
  },
  activeRadioButton: {
    borderColor: colors.primaryGreen,
    borderWidth: 1,
    backgroundColor: `${colors.primaryGreen}20`,
    borderRadius: moderateScale(8),
  },
  selectedRadioButton: {
    borderColor: colors.primaryGreen,
    borderWidth: 1,
    backgroundColor: `${colors.primaryGreen}10`,
    borderRadius: 10,
  },
  linkItem: {
    paddingVertical: vs(13),
    paddingHorizontal: scale(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addressIconContainer: {
    left: -3,
    borderRadius: 9999,
    backgroundColor: colors.primaryGreen,
    padding: moderateScale(7.5),
  },
  modal: {
    paddingHorizontal: scale(15),
    height: '90%',
    paddingBottom: vs(0),
  },
});
