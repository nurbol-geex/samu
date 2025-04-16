import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import React from 'react';
import {CustomStatusBar} from 'src/components/shared/CustomStatusBar';
import {CustomHeader} from 'src/components/shared/CustomHeader';
import {colors} from 'src/theme/colors';
import {CustomText} from 'src/components/shared/CustomText';
import {scale, vs} from 'react-native-size-matters';
import StoreContact from 'src/components/pageSections/Store/StoreContact';
import Phone from '../../../../../assets/images/whatsapp.png';
import Arrow from '../../../../../assets/images/caret_icon.png';

export default function CustomerSupport() {
  return (
    <View style={styles.mainContainer}>
      <CustomStatusBar backgroundColor={colors.primaryGreen} />
      <CustomHeader
        title="Customer support"
        titleColor={colors.white}
        containerBackgroundColor={colors.primaryGreen}
        startButtonIconType="back"
      />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.select<
          'height' | 'position' | 'padding' | undefined
        >({
          ios: 'padding',
          android: undefined,
        })}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContentContainer}>
          <CustomText
            style={{marginVertical: vs(10)}}
            textColor={colors.darkGreen}
            text="Call us"
            variant="h2"
          />
          <CustomText
            style={styles.gap}
            textColor={colors.dark}
            text="Any issues? Give us a call and we will have one of our dedicated agents help you"
            variant="text"
          />
          <CustomText
            style={styles.gap}
            textColor={colors.darkGreen}
            text="Weekdays: 8AM to 8PM"
            variant="label"
          />
          <StoreContact
            onPress={() => {Linking.openURL(`tel:+2348145276455`);}}
            containerStyle={styles.storeCard}
            logo={Phone}
            logoText="Call"
            logoTextStyle="label"
            logoStyle={styles.phoneIcon}
            logoDesc="+234 8145276455"
            logoDescStyle="small"
            icon={Arrow}
            iconStyle={styles.arrowIcon}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContentContainer: {
    flexGrow: 1,
    paddingHorizontal: scale(20),
  },
  storeCard: {
    marginTop: vs(6),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },
  phoneIcon: {
    width: scale(32),
    height: vs(32),
  },
  arrowIcon: {
    width: scale(14),
    height: vs(20),
  },
  gap: {marginBottom: vs(20)},
});
