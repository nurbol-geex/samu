import {StyleSheet, View} from 'react-native';
import React from 'react';
import {CustomModal} from 'src/components/shared/CustomModal';
import {CustomTouchableSVG} from 'src/components/shared/CustomTouchableSVG';
import {CustomText} from 'src/components/shared/CustomText';
import {colors} from 'src/theme/colors';
import {CustomTextInput} from 'src/components/shared/CustomInputText';
import {moderateScale, scale, vs} from 'react-native-size-matters';
import {CustomButton} from 'src/components/shared/CustomButton';
import {fontFamilies} from 'src/theme/textVariants';
import {heightPercentageScale} from 'src/theme/dimensions';

const NoteModal = ({
  noteModalVisible,
  setNoteModalVisible,
  storeNote,
  setStoreNote,
}: NoteModalProps) => {
  return (
    <CustomModal
      containerStyle={styles.noteModal}
      isVisible={noteModalVisible}
      hideYesNoButton={true}
      onModalHide={() => setNoteModalVisible(false)}>
      <CustomTouchableSVG
        containerStyle={styles.handle}
        onPress={() => setNoteModalVisible(false)}
      />
      <CustomText
        style={styles.noteTitle}
        text="Note for Restaurant"
        variant="h3"
        textColor={colors.black}
      />
      <CustomText
        style={{alignSelf: 'center', textAlign: 'center'}}
        text="Please lets us know about any allergies you might have, so we can take that into consideration when preparing food for you."
        variant="text"
        textColor={colors.dark}
      />
      <CustomTextInput
        value={storeNote}
        inputContainerStyle={{height: heightPercentageScale(18)}}
        onChangeText={e => setStoreNote(e)}
        containerStyle={styles.noteInputContainer}
        style={styles.noteInput}
        placeholderTextColor={colors.gray73}
        placeholder="Enter details about your allergies"
        multiline={true}
      />
      <View style={styles.row}>
        <CustomButton
          textColor={colors.darkGreen}
          onPress={() => setNoteModalVisible(false)}
          text="Cancel"
          btnContainerStyle={styles.cancelBtn}
        />
        <CustomButton
          textColor={colors.white}
          onPress={() => setNoteModalVisible(false)}
          text="Submit"
          btnContainerStyle={styles.submitBtn}
        />
      </View>
    </CustomModal>
  );
};

export default NoteModal;

const styles = StyleSheet.create({
  noteModal: {
    // height: vs(394),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cancelBtn: {
    backgroundColor: colors.white,
    width: scale(145),
    borderWidth: 1,
    borderRadius: moderateScale(10),
    borderColor: colors.grey,
  },
  submitBtn: {
    backgroundColor: colors.darkGreen,
    width: scale(145),
    borderRadius: moderateScale(10),
  },
  handle: {
    position: 'absolute',
    top: vs(15),
    backgroundColor: colors.grey,
    width: scale(30),
    height: vs(5),
    borderRadius: moderateScale(10),
  },
  noteInputContainer: {
    height: vs(120),
    marginHorizontal: scale(4),
  },
  noteInput: {
    fontFamily: fontFamilies.medium,
    fontWeight: '500',
    fontSize: moderateScale(15.09), //16
    color: colors.black,
    textAlignVertical: 'top',
    paddingTop: vs(12),
    paddingHorizontal: scale(10),
    minHeight: vs(120),
  },
  noteTitle: {
    alignSelf: 'center',
    marginVertical: vs(16),
  },
  tipModal: {
    borderTopLeftRadius: moderateScale(8),
    borderTopRightRadius: moderateScale(8),
    alignItems: 'center',
    height: vs(212),
    position: 'relative',
    padding: 0,
    paddingHorizontal: scale(40),
  },
  crossIcon: {position: 'absolute', right: 15, top: 15},
  inputView: {
    width: scale(300),
    marginVertical: vs(20),
    alignItems: 'center',
    backgroundColor: colors.inputBackgroundColor,
    borderWidth: 1,
    borderColor: colors.gray73,
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
  row: {
    gap: -scale(20),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
  },
});
