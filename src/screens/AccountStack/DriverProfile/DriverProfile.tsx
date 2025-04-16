import {
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import React from 'react';
import {ScrollView} from 'react-native';
import {CustomStatusBar} from 'src/components/shared/CustomStatusBar';
import {CustomHeader} from 'src/components/shared/CustomHeader';
import {colors} from 'src/theme/colors';
import {moderateScale, scale, vs} from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import {CustomText} from 'src/components/shared/CustomText';
import User from '../../../../assets/images/UserPic.png';
import Rating from '../../../../assets/images/rating.png';
import Phone from '../../../../assets/images/call.png';
import {CustomTouchableSVG} from 'src/components/shared/CustomTouchableSVG';
import {isUrl} from 'src/components/pageSections/Store/StoreContact';
import moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';

const DriverProfile = ({route}) => {
  const {driverData, showButton} = route.params;

  const DriverStatus = [
    {
      title: 'Total Trips',
      status: driverData?.totalTrips,
      key: 1,
    },
    {
      title: 'Registerd',
      status: moment(driverData?.createdAt).format('YYYY-MM-DD'),
      key: 2,
    },
    {
      title: 'Driving for',
      status: driverData?.drivingFor,
      key: 3,
    },
    {
      title: 'Profile Status',
      status: driverData?.profileStatus ? 'Verified' : 'Not Verified',
      icon: '../../../../assets/images/success.png',
      key: 4,
    },
    // {
    //   title: 'From',
    //   status: 'Abouja',
    //   key: 5,
    // },
  ];
  return (
    <View style={styles.mainContainer}>
      <CustomStatusBar backgroundColor={colors.primaryGreen} />
      <CustomHeader
        title="DRIVER PROFILE"
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
        <LinearGradient
          start={{x: 0, y: -0.3}}
          end={{x: 0, y: 0.5}}
          colors={[colors.green100, colors.white]}
          style={styles.linearGradient}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContentContainer}>
            <View style={styles.userContainer}>
              <Image
                style={styles.userProfile}
                source={
                  isUrl(driverData?.imageUrl)
                    ? {uri: driverData?.imageUrl}
                    : User
                }
              />
              <View style={styles.ratingContainer}>
                <Image style={styles.ratingIcon} source={Rating} />
                <CustomText
                  textColor={colors.darkGreen}
                  text={`${driverData?.averageReview}/5`}
                  variant="Figtree"
                  style={{alignSelf: 'center', marginLeft: 4}}
                />
              </View>
              <CustomText
                style={styles.userName}
                textColor={colors.darkGreen}
                text={driverData?.firstName}
                variant="h2"
              />
              <CustomText
                style={{alignSelf: 'center'}}
                textColor={colors.dark}
                text="Delivery Driver"
                variant="text"
              />
            </View>
            <View style={[styles.sectionContainer, styles.detailContainer]}>
              {DriverStatus.map(item => (
                <View
                  style={[
                    styles.innerContainer,
                    {
                      borderBottomWidth: item.key === 4 ? 0 : 1,
                    },
                  ]}>
                  <CustomText
                    textColor={colors.dark}
                    text={item.title}
                    variant="text"
                  />
                  <View style={styles.row}>
                    <CustomText
                      style={{
                        fontWeight: '600',
                        fontSize: moderateScale(14.9),
                      }}
                      textColor={
                        item.key !== 4
                          ? colors.darkGreen
                          : driverData?.profileStatus
                          ? colors.primaryGreen
                          : colors.red500
                      }
                      text={item.status}
                      variant="Figtree"
                    />
                    {item.key === 4 && (
                      <AntDesign
                        name={
                          driverData?.profileStatus
                            ? 'checkcircle'
                            : 'closecircle'
                        }
                        color={
                          driverData?.profileStatus
                            ? colors.primaryGreen
                            : colors.red500
                        }
                        size={20}
                        style={{marginLeft: 5}}
                      />
                    )}
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
          <View
            style={[styles.btnView, {display: showButton ? 'flex' : 'none'}]}>
            <CustomTouchableSVG
              containerStyle={styles.btnContainer}
              onPress={() => {
                Linking.openURL(`tel:${driverData?.phone}`);
              }}>
              <CustomText
                textColor={colors.white}
                text="Contact Driver"
                variant="buttonText"
              />
              <Image
                style={[styles.icon, {marginLeft: scale(10)}]}
                source={Phone}
              />
            </CustomTouchableSVG>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </View>
  );
};

export default DriverProfile;

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
  },
  container: {
    paddingHorizontal: scale(20),
    marginTop: -120,
    marginBottom: 30,
  },
  linearGradient: {
    flex: 1,
  },
  sectionContainer: {
    backgroundColor: colors.white,
    marginTop: vs(14),
    padding: scale(10),
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: moderateScale(12),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userContainer: {
    alignItems: 'center',
    marginTop: vs(60),
  },
  userProfile: {
    resizeMode: 'contain',
    width: scale(120),
    height: scale(120),
    borderRadius: 100,
  },
  userName: {
    alignSelf: 'center',
    marginTop: vs(10),
  },
  ratingContainer: {
    marginTop: vs(-22),
    paddingHorizontal: scale(14),
    paddingVertical: vs(6),
    borderRadius: moderateScale(30),
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingIcon: {
    width: scale(16),
    height: vs(16),
    resizeMode: 'contain',
  },
  icon: {
    width: scale(15),
    height: vs(15),
    resizeMode: 'contain',
  },
  btnView: {
    padding: 20,
    borderWidth: 1,
    borderColor: colors.grey,
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(14),
    padding: vs(18),
    backgroundColor: colors.primaryGreen,
  },
  detailContainer: {
    marginTop: vs(25),
    marginBottom: vs(50),
    marginHorizontal: scale(20),
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: scale(10),
    borderColor: colors.grey,

    borderRadius: moderateScale(12),
  },
});
