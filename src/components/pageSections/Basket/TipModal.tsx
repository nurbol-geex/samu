import {Image, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {CustomModal} from 'src/components/shared/CustomModal';
import {CustomTouchableSVG} from 'src/components/shared/CustomTouchableSVG';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {CustomText} from 'src/components/shared/CustomText';
import {colors} from 'src/theme/colors';
import {CustomTextInput} from 'src/components/shared/CustomInputText';
import {moderateScale, scale, vs} from 'react-native-size-matters';
import Symbol from '../../../../assets/images/symbol.png';
import {CustomButton} from 'src/components/shared/CustomButton';
import {widthPercentageScale} from 'src/theme/dimensions';

const TipModal = ({
  tipModalVisible,
  setTipModalVisible,
  setSelectTip,
  selectTip,
}: TipModalProps) => {
  const [tipPrice, setTipPrice] = useState(selectTip.toString() || '');

  const handleSetTipPrice = () => {
    setSelectTip(Number(tipPrice));
    setTipModalVisible(false);
  };
  return (
    <CustomModal
      containerStyle={styles.tipModal}
      isVisible={tipModalVisible}
      onModalHide={() => setTipModalVisible(false)}
      hideYesNoButton={true}>
      <CustomTouchableSVG
        onPress={() => setTipModalVisible(false)}
        containerStyle={styles.crossIcon}>
        <AntDesign color={colors.primary800} name="close" size={30} />
      </CustomTouchableSVG>
      <CustomText
        style={styles.tipText}
        text="Enter your tip"
        variant="h3"
        textColor={colors.black}
      />
      <CustomText
        style={{textAlign: 'center', bottom: vs(4)}}
        text="Enter a custom amount for the tip you want to leave for this Rider."
        variant="text"
        textColor={colors.dark}
      />
      <View style={styles.inputView}>
        <Image style={styles.textIcon} source={Symbol} />
        <View style={styles.inputLine} />
        <CustomTextInput
          // value={tipPrice}
          onChangeText={e => setTipPrice(e)}
          multiline={false}
          inputContainerStyle={styles.tipInput}
          containerStyle={styles.tipInputContainer}
          placeholder="Enter Amount"
          keyboardType="phone-pad"
          maxLength={5}
        />
      </View>
      <CustomButton
        onPress={handleSetTipPrice}
        text="Submit"
        containerStyle={styles.checkout}
      />
    </CustomModal>
  );
};

export default TipModal;

const styles = StyleSheet.create({
  tipModal: {
    borderTopLeftRadius: moderateScale(10),
    borderTopRightRadius: moderateScale(10),
    alignItems: 'center',
    height: widthPercentageScale(80),
    position: 'relative',
    paddingTop: vs(40),
    paddingHorizontal: scale(40),
  },
  crossIcon: {position: 'absolute', right: 15, marginTop: vs(10)},
  inputView: {
    width: scale(300),
    height: vs(45),
    marginVertical: vs(15),
    alignItems: 'center',
    backgroundColor: colors.inputBackgroundColor,
    borderRadius: scale(7.5),
    flexDirection: 'row',
  },
  textIcon: {
    width: scale(12),
    height: vs(18),
    marginHorizontal: scale(15),
  },
  inputLine: {
    borderLeftWidth: 1,
    borderColor: colors.gray73,
    height: vs(25),
  },
  tipInput: {
    borderRadius: scale(0),
    borderWidth: 0,
  },
  tipInputContainer: {
    width: scale(250),
    marginHorizontal: scale(0),
    marginVertical: vs(0),
  },
  tipText: {alignSelf: 'center', marginBottom: vs(15)},
  checkout: {
    width: widthPercentageScale(100),
  },
});
