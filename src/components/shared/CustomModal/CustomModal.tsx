import React from 'react';
import { View, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { CustomText } from '../CustomText';
import { CustomButton } from '../CustomButton';
import { colors } from '../../../theme/colors';
import { moderateScale, scale, vs } from 'react-native-size-matters';

const styles = StyleSheet.create({
  modalContainer: {
    width: '100%',
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalBody: {
    backgroundColor: colors.white,
    borderTopLeftRadius: scale(30),
    borderTopRightRadius: scale(30),
    padding: moderateScale(20),
    paddingBottom: vs(40),
  },
  modalTitle: {
    textAlign: 'center',
    alignSelf: 'center',
  },
  modalButton: {
    borderRadius: 8,
  },
  modalBtn: {
    borderRadius: 10,
    marginHorizontal: 0,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 0.5,
  },
  fullWidthButton: {
    width: '90%', // Full width for forceRedButtons case
    alignSelf: 'center',
    marginBottom: vs(10),
  },
  halfWidthButton: {
    width: '45%', // Default behavior
  },
});

// Define button styles dynamically based on the `buttonVariant` prop
const buttonStyles = {
  default: {
    cancelBackground: colors.white,
    cancelText: colors.darkGreen,
    okBackground: colors.warning,
  },
  variant1: {
    cancelBackground: colors.lightGrey,
    cancelText: colors.black,
    okBackground: colors.red300,
  },
};

export default function CustomModal({
  forceRedButtons = false, // Custom flag to override button colors
  isVisible = false,
  containerStyle = {},
  okButtonStyle = {},
  titleStyle = {},
  title,
  okText = forceRedButtons ? 'Verify Payment' : 'Yes',
  children,
  onOk = () => {},
  onModalHide = () => {},
  hideYesNoButton = false,
  okBtnColor,
  okBtnLoading = false,
  buttonVariant = 'default', // Variant selector
  ...rest
}: CustomModalProps) {
  const selectedStyle = buttonStyles[buttonVariant] || buttonStyles.default;

  return (
    <Modal
      onBackdropPress={forceRedButtons ? ()=>{} : onModalHide}
      // onBackdropPress={onModalHide}
      isVisible={isVisible}
      style={styles.modalContainer}
      onModalHide={onModalHide}
      avoidKeyboard
      {...rest}>
      <View style={[styles.modalBody, containerStyle]}>
        {title && (
          <CustomText
            variant="h3"
            text={title}
            style={[styles.modalTitle, titleStyle]}
          />
        )}
        {children}
        {!hideYesNoButton ? (
          <View
            style={{
              flexDirection: forceRedButtons ? 'column' : 'row',
              marginTop: vs(12),
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            {buttonVariant !== 'variant1' && (
              <CustomButton
                text={'No'}
                touchableBackgroundColor={
                  forceRedButtons ? colors.white : selectedStyle.cancelBackground
                }
                textColor={forceRedButtons ? colors.red300 : selectedStyle.cancelText}
                onPress={onModalHide}
                containerStyle={
                  forceRedButtons ? styles.fullWidthButton : styles.halfWidthButton
                }
                btnContainerStyle={styles.modalBtn}
              />
            )}
            {okText !== '' && (
              <CustomButton
                text={okText}
                loading={okBtnLoading}
                touchableBackgroundColor={
                   okBtnColor || selectedStyle.okBackground
                }
                textColor={colors.white}
                containerStyle={
                  forceRedButtons ? styles.fullWidthButton : styles.halfWidthButton
                }
                btnContainerStyle={styles.modalBtn}
                onPress={onOk}
              />
            )}
          </View>
        ) : null}
      </View>
    </Modal>
  );
}
