import React from 'react';
import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CustomButton} from 'src/components/shared/CustomButton';
import {useLocation} from 'src/utils/hooks/useLocation';
import {CustomHeader} from '../../../components/shared/CustomHeader';
import {CustomText} from '../../../components/shared/CustomText';
import {colors} from '../../../theme/colors';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import NeedAddressSVG from 'assets/svg/NeedAddressSVG';

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {},
  mainContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: moderateScale(32),
    color: colors.darkGreen,
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    color: colors.dark,
    alignSelf: 'center',
    marginTop: 10,
  },
  shareButton: {
    width: '92%',
    textAlign: 'center',
    paddingVertical: 10,
    alignSelf: 'center',
  },
  bottomView: {
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: `${colors.dark}20`,
    paddingVertical: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  mapPointer: {
    alignSelf: 'center',
    marginTop: verticalScale(55),
  },
});

export default function LocationScreen() {
  const {requestPermission} = useLocation();

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        titleColor={colors.darkGreen}
        containerBackgroundColor={colors.white}
        title="STEP 3"
        startButtonIconType="circular-back"
      />
      <View style={styles.mainContainer}>
        <View style={{paddingHorizontal: 15}}>
          <CustomText
            variant="h1"
            text="WE NEED YOUR ADDRESS"
            style={styles.title}
          />
          <CustomText
            variant="text"
            text="Please share your location to start shopping."
            style={styles.text}
          />
          <NeedAddressSVG style={styles.mapPointer} />
        </View>
        <View style={styles.bottomView}>
          <CustomButton
            text="Continue"
            onPress={requestPermission}
            containerStyle={styles.shareButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
