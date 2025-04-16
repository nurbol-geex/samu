import {
  KeyboardAvoidingView,
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
import {useNavigation} from '@react-navigation/native';

const AboutSamu = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.mainContainer}>
      <CustomStatusBar backgroundColor={colors.primaryGreen} />
      <CustomHeader
        title="ABOUT US"
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
            style={styles.gap}
            textColor={colors.darkGreen}
            text="About us"
            variant="h2"
          />
          <CustomText
            textColor={colors.dark}
            text="SAMU is a instant delivery app for all your needs currently operating in Abuja, you can shop from your favorite restaurants and have them delivered in minutes. We have a dedicated rider fleet to ensure swift and quailty assured deliveries. Check it out yourself and place a order today!"
            variant="Figtree"
            style={{lineHeight: 22, fontSize: 16, fontWeight: 500}}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AboutSamu;

const styles = StyleSheet.create({
  mainContainer: {
    position: 'relative',
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
  gap: {marginVertical: vs(10)},
});
