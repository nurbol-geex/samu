import React, {useEffect, useState} from 'react';
import {Image, ScrollView, StyleSheet, View} from 'react-native';
import {CustomText} from '../../../components/shared/CustomText';
import {createCustomTheme} from '../../../theme/createCustomTheme';
import {colors} from '../../../theme/colors';
import {useDispatch, useSelector} from 'react-redux';
import {selectCreateAccountForm} from 'src/redux/user/selectors';
import {Route} from 'src/routes/Route';
import {CustomTouchableSVG} from 'src/components/shared/CustomTouchableSVG';
import {useNavigation} from '@react-navigation/native';
import {
  accountAddressScreenPushAction,
  myDetailsScreenPushAction,
} from 'src/routes/navigationActionCreators';
import OrdersSVG from 'assets/svg/OrdersSVG';
import UserSVG from 'assets/svg/UserSVG';
import MapPointerSVG from 'assets/svg/MapPointerSVG';
import WalletSVG from 'assets/svg/WalletSVG';
import HelpSVG from 'assets/svg/HelpSVG';
import AboutSVG from 'assets/svg/AboutSVG';
import LogOutSVG from 'assets/svg/LogOutSVG';
import {CustomHeader} from '../../../components/shared/CustomHeader';
import {scale} from 'react-native-size-matters';
import {CustomModal} from 'src/components/shared/CustomModal';
import {LOGOUT} from 'src/redux/user/constants';
import {RootStackNavigation} from 'src/routes/RootStack';
import {getOwnAccountAPI} from '../../../api/getOwnAccountAPI';
import {showToast} from '../../../components/shared/CustomToast/toastUtils';
import {resetUser, setCreateAccountForm} from '../../../redux/user/slice';
import {capitalizeFirstLetter} from '../../../utils';
import {CustomStatusBar} from '../../../components/shared/CustomStatusBar';
import {resetAddressData} from 'src/redux/address/slice';
import {resetAppReducer} from 'src/redux/app/reducers';
import store, {AppDispatch} from 'src/redux';
import {resetApp} from 'src/redux/app/slice';
import {CLEAR_LOCAL_CART} from 'src/redux/cart/constants';
import {
  CLEAR_ADD_NEW_CARD_DATA,
  CLEAR_CHECKOUT,
} from 'src/redux/orders/constants';
import {
  resetActiveReducer,
  resetCancelledReducer,
  resetCompletedReducer,
} from 'src/redux/orders/thunk/getAllOrders';
import {resetUserReducer} from 'src/redux/user/reducers';
import {getBaseUrlFromStorage} from 'src/utils/SetENV';
import * as Sentry from '@sentry/react-native'; // Import Sentry

const theme = createCustomTheme();

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {},
  mainContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.l,
  },
  title: {
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 32,
    color: colors.darkGreen,
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    color: colors.darkGreen,
    letterSpacing: 0,
  },
  inputContainerStyle: {
    width: '100%',
    marginLeft: 0,
    marginTop: 5,
  },
  item_text: {
    fontWeight: 'bold',
    marginLeft: 15,
    fontSize: 17,
  },
  inputStyle: {
    paddingLeft: 10,
    backgroundColor: '#F8F9FB',
    borderWidth: 1,
    borderColor: `${colors.black}10`,
    color: `${colors.darkGreen}`,
  },
  linkGroup: {
    borderBottomWidth: 1,
    borderColor: colors.grey,
  },
  linkItem: {
    paddingVertical: scale(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // borderBottomWidth: 1,
    // borderColor: colors.grey,
  },
  footerContainer: {},
  lastItem: {
    borderBottomWidth: 0,
  },
  modalContainer: {
    width: '100%',
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalBody: {
    backgroundColor: colors.white,
    borderTopLeftRadius: theme.spacing.l,
    borderTopRightRadius: theme.spacing.l,
    padding: theme.spacing.l,
    paddingBottom: scale(42.8),
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    textAlign: 'center',
    marginTop: scale(15),
    fontSize: 14,
    color: 'gray',
    paddingHorizontal: 18,
  },
  modalButton: {
    flex: 1,
  },
  cancelButton: {
    shadowColor: colors.dark,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,

    elevation: 5,
  },
  iconSize: {
    width: 20,
    height: 20,
  },
  itemLeftContainer: {
    flexDirection: 'row',
  },
  nameContainer: {
    paddingVertical: scale(22.4),
  },
});

const caretIcon = (
  <Image
    source={require('assets/images/caret_icon.png')}
    style={styles.iconSize}
  />
);

const accountIcons = {
  orders: <OrdersSVG />,
  details: <UserSVG />,
  addresses: <MapPointerSVG />,
  wallet: <WalletSVG />,
  help: <HelpSVG />,
  about: <AboutSVG />,
  logout: <LogOutSVG />,
};

export default function AccountScreen() {
  const [visible, setVisible] = useState<boolean>(false);
  const {firstName, lastName, email} = useSelector(selectCreateAccountForm);
  const dispatchStore: AppDispatch = useDispatch();
  const navigation = useNavigation<RootStackNavigation>();

  useEffect(() => {
    async function handler() {
      let json;
      try {
        const response = await getOwnAccountAPI();
        json = await response.json();
      } catch (e) {
        console.error(e);
        showToast('error', 'Error', 'An error has occurred');
      }
      dispatchStore(
        setCreateAccountForm({
          firstName: json?.firstName || '',
          lastName: json?.lastName || '',
          email: json?.email || '',
          phone: json?.phone || '',
        }),
      );
    }

    handler();
  }, [dispatchStore]);

  const logout = () => {
    dispatchStore({type: CLEAR_LOCAL_CART});
    dispatchStore(resetAddressData());
    dispatchStore(resetCancelledReducer());
    dispatchStore(resetCompletedReducer());
    dispatchStore(resetActiveReducer());
    dispatchStore(resetUser());
    dispatchStore({type: LOGOUT});
    Sentry.setUser(null)
    setVisible(false);
    
  };

  return (
    <>
      <View style={styles.container}>
        <CustomStatusBar />
        <CustomHeader
          title="ACCOUNT"
          titleColor={colors.white}
          containerBackgroundColor={colors.primaryGreen}
          startButtonIconType="back"
        />
        <View style={styles.mainContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.nameContainer}>
              <CustomText
                text={`${
                  firstName && lastName
                    ? `${capitalizeFirstLetter(
                        firstName,
                      )} ${capitalizeFirstLetter(lastName)}`
                    : 'John Smith'
                }`}
                variant="h2"
                textColor={colors.darkGreen}
              />
              <CustomText
                text={`${email ? email : 'john.smith@email.com'}`}
                variant="text"
                textColor={colors.primaryGreen}
              />
            </View>
            <View style={styles.linkGroup}>
              <CustomTouchableSVG
                containerStyle={styles.linkItem}
                onPress={() => {
                  navigation.navigate('Ongoing');
                }}>
                <View style={styles.itemLeftContainer}>
                  {accountIcons.orders}
                  <CustomText
                    variant="text"
                    text="My Orders"
                    textColor={colors.darkGreen}
                    style={styles.item_text}
                  />
                </View>
                {caretIcon}
              </CustomTouchableSVG>
            </View>
            <View style={styles.linkGroup}>
              <CustomTouchableSVG
                containerStyle={styles.linkItem}
                onPress={() => {
                  navigation.dispatch(myDetailsScreenPushAction());
                }}>
                <View style={styles.itemLeftContainer}>
                  {accountIcons.details}
                  <CustomText
                    variant="text"
                    text="My Details"
                    textColor={colors.darkGreen}
                    style={styles.item_text}
                  />
                </View>
                {caretIcon}
              </CustomTouchableSVG>
            </View>
            <View style={styles.linkGroup}>
              <CustomTouchableSVG
                containerStyle={styles.linkItem}
                onPress={() => {
                  navigation.dispatch(accountAddressScreenPushAction());
                }}>
                <View style={styles.itemLeftContainer}>
                  {accountIcons.addresses}
                  <CustomText
                    variant="text"
                    text="Addresses"
                    textColor={colors.darkGreen}
                    style={styles.item_text}
                  />
                </View>
                {caretIcon}
              </CustomTouchableSVG>
            </View>
            <View style={styles.linkGroup}>
              <CustomTouchableSVG
                containerStyle={styles.linkItem}
                onPress={() => {
                  navigation.navigate(Route.WalletScreen);
                }}>
                <View style={styles.itemLeftContainer}>
                  {accountIcons.wallet}
                  <CustomText
                    variant="text"
                    text="Wallet"
                    textColor={colors.darkGreen}
                    style={styles.item_text}
                  />
                </View>
                {caretIcon}
              </CustomTouchableSVG>
            </View>
            <View style={styles.linkGroup}>
              <CustomTouchableSVG
                containerStyle={styles.linkItem}
                onPress={() => {
                  navigation.navigate(Route.HelpAndSupport);
                }}>
                <View style={styles.itemLeftContainer}>
                  {accountIcons.help}
                  <CustomText
                    variant="text"
                    text="Help & Support"
                    textColor={colors.darkGreen}
                    style={styles.item_text}
                  />
                </View>
                {caretIcon}
              </CustomTouchableSVG>
            </View>
            <View style={styles.linkGroup}>
              <CustomTouchableSVG
                containerStyle={styles.linkItem}
                onPress={() => {
                  navigation.navigate(Route.AboutSamu);
                }}>
                <View style={styles.itemLeftContainer}>
                  {accountIcons.about}
                  <CustomText
                    variant="text"
                    text="About Samu"
                    textColor={colors.darkGreen}
                    style={styles.item_text}
                  />
                </View>
                {caretIcon}
              </CustomTouchableSVG>
            </View>
            <View style={styles.linkGroup}>
              <CustomTouchableSVG
                containerStyle={[styles.linkItem, styles.lastItem]}
                onPress={() => {
                  setVisible(true);
                }}>
                <View style={styles.itemLeftContainer}>
                  {accountIcons.logout}
                  <CustomText
                    variant="text"
                    text="Log out"
                    textColor={colors.darkGreen}
                    style={styles.item_text}
                  />
                </View>
                {caretIcon}
              </CustomTouchableSVG>
            </View>
            {(getBaseUrlFromStorage().includes('dev') ||
              getBaseUrlFromStorage().includes('staging')) && (
              <CustomText
                text={
                  getBaseUrlFromStorage().includes('dev')
                    ? 'Development'
                    : getBaseUrlFromStorage().includes('staging')
                    ? 'Staging'
                    : ''
                }
                variant="text"
                textColor={colors.primaryGreen}
                style={{
                  textAlign: 'center',
                  alignSelf: 'center',
                  marginTop: 40,
                }}
              />
            )}
          </ScrollView>
        </View>
      </View>

      {/* <Modal
        isVisible={visible}
        style={styles.modalContainer}
        onBackdropPress={() => setVisible(false)}
      >
        <View style={styles.modalBody}>
          <CustomText variant='h1' text='Are you sure you want to log out?' style={styles.modalTitle} />
          <CustomText variant='text' text='Lorem ipsum dolor sit amet consectetur. Consequat sollicitudin faucibus amet duis cras varius. Venenatis interdum porta.' style={styles.modalText} />
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <CustomButton text='No' touchableBackgroundColor={colors.white} textColor={colors.dark} onPress={() => {}} containerStyle={[styles.modalButton, styles.cancelButton]} />
            <CustomButton text='Yes' touchableBackgroundColor={colors.darkGreen} containerStyle={styles.modalButton} onPress={() => {}} />
          </View>
        </View>
      </Modal> */}
      <CustomModal
        isVisible={visible}
        onModalHide={() => setVisible(false)}
        title={'Are you sure you\nwant to log out?'}
        onCancel={() => setVisible(false)}
        okBtnColor={colors.darkGreen}
        onOk={logout}>
        <CustomText
          variant="text"
          text="Stay logged in to receive account notifications, updates and more. Sign back in at anytime to keep enjoying the SAMU experience."
          style={styles.modalText}
        />
      </CustomModal>
    </>
  );
}
