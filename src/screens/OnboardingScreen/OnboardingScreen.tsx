import {useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {Image, StatusBar, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {scale, verticalScale} from 'react-native-size-matters';
import {useDispatch} from 'react-redux';
import {setOnboard} from 'src/redux/settings/slice';
import {AuthStackNavigation} from 'src/routes/AuthStack';
import {testIDs} from '../../assets/testIDs';
import {CustomButton} from '../../components/shared/CustomButton';
import {Route} from '../../routes/Route';
import {colors} from '../../theme/colors';
import {View} from 'react-native';
import {CustomText} from 'src/components/shared/CustomText';
import {Dimensions} from 'react-native';
import Onboarding from '../../../assets/images/onboarding.png';
import { storage } from 'src/redux/MMKVStorage';

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: colors.grey,
    paddingVertical: scale(10),
  },
  logo: {
    width: scale(107),
    height: undefined,
    aspectRatio: 142 / 57,
    alignSelf: 'center',
    marginTop: scale(6),
  },
  getStartedButton: {
    marginVertical: 10,
  },
  onboardingImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 423 / 254,
    alignSelf: 'center',
  },
  title: {
    alignSelf: 'center',
    textAlign: 'center',
    width: scale(214),
    marginTop: scale(10),
  },
  description: {
    alignSelf: 'center',
    textAlign: 'center',
    color: colors.dark,
    width: '90%',
    marginTop: scale(7),
  },
  pagerContainer: {
    marginBottom: verticalScale(20),
  },
});

export default function OnboardingScreen() {
  const navigation = useNavigation<AuthStackNavigation>();

  const dispatchStore = useDispatch();

  const onGetStartedPress = useCallback(() => {
    dispatchStore(setOnboard());
    storage.set("setOnboard", false)
    navigation.navigate(Route.SignUpScreen);
  }, [dispatchStore, navigation]);

  return (
    <SafeAreaView style={styles.container} testID={testIDs.onboardingScreen.id}>
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor="rgba(0, 0, 0, 0)"
      />
      <View style={{flex: 1, justifyContent: 'space-between'}}>
        <Image
          source={require('@assets/images/logo.png')}
          style={styles.logo}
        />
        <View>
          {/* <Image source={Onboarding} style={styles.onboardingImage} /> */}
          <CustomText
            textColor={colors.darkGreen}
            text="Satisfy your cravings"
            variant="h1"
            style={styles.title}
            numberOfLines={2}
          />
          <CustomText
            text="Enjoy quick access to your favourite foods, delivered fast to your doorstep"
            variant="text"
            style={styles.description}
            numberOfLines={2}
          />
        </View>
        <CustomButton
          onPress={onGetStartedPress}
          text="Get Started"
          containerStyle={styles.getStartedButton}
          touchableBackgroundColor={colors.darkGreen}
          testID={testIDs.onboardingScreen.getStartedButton.id}
        />
      </View>
    </SafeAreaView>
  );
}
