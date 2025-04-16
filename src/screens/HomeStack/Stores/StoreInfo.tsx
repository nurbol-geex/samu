import {Image, Linking, StyleSheet, View} from 'react-native';
import React from 'react';
import {CustomStatusBar} from 'src/components/shared/CustomStatusBar';
import {CustomHeader} from 'src/components/shared/CustomHeader';
import {colors} from 'src/theme/colors';
import {moderateScale, scale, vs} from 'react-native-size-matters';
import {CustomText} from 'src/components/shared/CustomText';
import LocationSVG from 'assets/svg/LocationSVG';
import TimerSVG from 'assets/svg/TimerSVG';
import {getCurrentDayHours} from 'src/utils';
import Share, {ShareOptions} from 'react-native-share';
import MapView from 'src/components/pageSections/MapView.tsx/MapView';
import {widthPercentageScale} from 'src/theme/dimensions';
import StoreContact from 'src/components/pageSections/Store/StoreContact';
import DeviceInfo from 'react-native-device-info';
import Toast from 'react-native-toast-message';

const StoreInfo = ({
  route,
}: {
  route: {
    params: {storeInfo: any};
  };
}) => {
  const storeInfo = route?.params?.storeInfo;

  const shareStore = async () => {
    const shareOptions: ShareOptions = {
      // title: 'Share this store',
      // message: 'Created by the samu app',
      url: `samuapp://store/${storeInfo?.id}`,
    };
    try {
      const response = await Share.open(shareOptions);
      if (__DEV__) {
        console.log({response});
      }
    } catch (error: any) {
      if (error.message === 'User did not share') {
        return;
      }
    }
  };

  const openDialer = () => {
    if (!storeInfo?.availability) {
      Toast.show({
        type: 'info',
        text1: 'This store is closed right now',
        text2: "It's not possible to call at the moment",
      });
      return;
    }
    const phone = storeInfo?.phone.replace(/[^\d\+]/g, '');
    Linking.openURL(`tel:${phone}`);
  };
  return (
    <View style={styles.fullContainer}>
      <CustomStatusBar backgroundColor={colors.primaryGreen} />
      {/* {hasNotch && ( */}
      <CustomHeader
        title={storeInfo.storeName}
        titleColor={colors.white}
        containerBackgroundColor={colors.primaryGreen}
        startButtonIconType="back"
        endButtonIconType={'share'}
        shareHandler={shareStore}
      />
      {/* )} */}

      <View style={styles.mainContent}>
        <MapView
          zoomEnabled={true}
          draggable={false}
          containerStyle={styles.map}
          lat={storeInfo?.address?.geometry?.latitude}
          lng={storeInfo?.address?.geometry?.longitude}
          zoomLevel={15}
        />

        <View style={styles.infoContainer}>
          <View>
            <CustomText
              text="Address"
              variant="h4"
              textColor={colors.darkGreen}
            />
            <View style={styles.infoRow}>
              <LocationSVG iconColor={colors.darkGreen} />
              <CustomText
                text={storeInfo?.address?.street}
                variant="text"
                textColor={'#6b6b6b'}
              />
            </View>
          </View>
          <View style={styles.timeContainer}>
            <CustomText text="Time" variant="h4" textColor={colors.darkGreen} />
            <View style={styles.infoRow}>
              <TimerSVG iconColor={colors.darkGreen} />
              <CustomText
                text={
                  storeInfo?.hours
                    ? `Accepting orders until ${
                        getCurrentDayHours(storeInfo?.hours).split(' - ')[1]
                      }`
                    : ''
                }
                variant="text"
                textColor={'#6b6b6b'}
              />
            </View>
          </View>
        </View>

        <StoreContact
          SvgShowing
          onPress={openDialer}
          logoTextStyle="h4"
          logoDescStyle="body"
          logo={{uri: storeInfo?.storeImage}}
          logoText={storeInfo?.storeName || ''}
          logoDesc={storeInfo?.phone || ''}
          logoStyle={styles.logo}
        />
      </View>
    </View>
  );
};

export default StoreInfo;

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  mainContent: {
    marginHorizontal: scale(25),
    marginTop: vs(25),
  },
  container: {
    height: vs(150),
    width: '100%',
  },
  map: {
    height: widthPercentageScale(55),
    borderRadius: moderateScale(14),
    overflow: 'hidden',
  },
  infoContainer: {
    borderWidth: 1,
    borderColor: colors.grey,
    backgroundColor: colors.white,
    padding: scale(13),
    borderRadius: moderateScale(14),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: vs(5),
  },
  timeContainer: {
    marginTop: vs(15),
  },
  logo: {
    right: scale(3),
    resizeMode: 'contain',
    width: widthPercentageScale(12),
    height: widthPercentageScale(12),
  },
});
