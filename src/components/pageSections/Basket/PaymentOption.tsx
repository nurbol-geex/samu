import React, {useState} from 'react';
import {View, StyleSheet, Image, Alert} from 'react-native';
import {CustomText} from 'src/components/shared/CustomText';
import {CustomTouchableSVG} from 'src/components/shared/CustomTouchableSVG';
import {colors} from 'src/theme/colors';
import {moderateScale, scale, vs} from 'react-native-size-matters';
import VisaIcon from 'assets/images/visa-icon.png';
import {CustomModal} from 'src/components/shared/CustomModal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import {fontFamilies} from 'src/theme/textVariants';
import {widthPercentageScale} from 'src/theme/dimensions';

const PaymentOption: React.FC<PaymentOptionProps> = React.memo(
  ({paymentOptions, handleOptionSelect, selectedOption, bankTransfer}) => {
    console.log('selectedOption: ', selectedOption);


    return (
      <>
        {/* Card Payment Option */}
        <CustomTouchableSVG
          containerStyle={[
            styles.sectionContainer,
            selectedOption === paymentOptions?.id
              ? {
                  backgroundColor: colors.green50,
                  borderColor: colors.primaryGreen,
                  borderWidth: 1,
                }
              : {
                  borderColor: 'transparent',
                },
          ]}
          disabled={paymentOptions?.channel !== 'card'}
          onPress={() => handleOptionSelect(paymentOptions?.id)}>
          <View style={styles.textContainer}>
            {paymentOptions?.isIcon ? (
              paymentOptions?.icon
            ) : (
              <Image
                source={
                  paymentOptions?.channel === 'card'
                    ? VisaIcon
                    : paymentOptions?.image
                }
                style={styles.paymentImage}
                resizeMode="contain"
              />
            )}

            <View style={styles.flex}>
              <CustomText
                style={{textTransform: 'capitalize'}}
                text={paymentOptions?.card?.cardBrand}
                variant="h5"
                textColor={colors.darkGreen}
              />
              <CustomText
                text={
                  paymentOptions?.channel === 'card'
                    ? `**** **** **** ${paymentOptions?.card?.last4}`
                    : paymentOptions?.card?.last4
                }
                variant="small"
                textColor={colors.dark}
              />
            </View>
          </View>
        </CustomTouchableSVG>
      </>
    );
  },
);

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: vs(14),
    paddingVertical: scale(13),
    paddingHorizontal: scale(12),
    borderRadius: moderateScale(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: colors.gray73,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
    backgroundColor: colors.white,
  },

  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  flex: {
    flex: 1,
  },
  paymentImage: {
    width: scale(30),
    height: vs(30),
  },
  charityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: scale(12),
    alignItems: 'flex-start',
    width: widthPercentageScale(90),
  },
  noteInput: {
    verticalAlign: 'top',
    paddingTop: vs(12),
    paddingLeft: vs(12),
    fontFamily: fontFamilies.medium,
    fontWeight: '500',
    fontSize: moderateScale(15.09), //16
    letterSpacing: -0.1,
    color: colors.darkGreen,
  },
  bankText: {
    fontSize: 14,
    color: colors.gray73,
    marginBottom: 5,
  },
  amountGroup: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 20,
    // paddingVertical: 0,
  },
});

export default PaymentOption;
