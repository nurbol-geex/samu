import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {colors} from 'src/theme/colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {CustomText} from 'src/components/shared/CustomText';
import SearchBar from '../CustomSearch/index';
import {useNavigation} from '@react-navigation/native';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {RootState, useReduxSelector} from 'src/redux';
import {selectUser} from 'src/redux/user/selectors';
import {useDispatch, useSelector} from 'react-redux';
import {setUser} from 'src/redux/user/slice';
import {GET_PRODUCT_SEARCH_REQUEST} from 'src/redux/home/constants';
import CrossSVG from 'assets/svg/CrossSVG';
import {CustomTouchableSVG} from 'src/components/shared/CustomTouchableSVG';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {widthPercentageScale} from 'src/theme/dimensions';
import LinearGradient from 'react-native-linear-gradient';

const HomeHeader: React.FC<HomeHeaderProps> = props => {
  const {
    onPressAddressBar,
    selectedAddress,
    inputDisable,
    setSearchingEnabled = () => {},
  } = props;
  const {top} = useSafeAreaInsets();
  const [searchValue, setSearchValue] = useState<string>('');
  const navigation = useNavigation();
  const userHasEdited = useRef(false);
  const user = useReduxSelector(selectUser);
  const dispatchStore = useDispatch();
  const {
    user: {accessToken, isGuest, lat, lng},
  } = useReduxSelector(store => ({user: store.user}));
  let {
    primaryAddress: {geometry, name},
  } = useSelector((state: RootState) => state.addresses);
  useEffect(() => {
    if (searchValue) {
      const handler = setTimeout(() => {
        dispatchStore(setUser({ searchKey: searchValue }));
        dispatchStore({
          type: GET_PRODUCT_SEARCH_REQUEST,
          payload: {
            keyword: searchValue,
            longitude: isGuest ? lng || geometry?.longitude : geometry?.longitude,
            latitude: isGuest ? lat || geometry?.latitude : geometry?.latitude,
          },
        });
      }, 1000);
      return () => clearTimeout(handler);
    }
  }, [searchValue, dispatchStore, isGuest, lat, lng, geometry]);
  
  

  useEffect(() => {
    if (searchValue) {
      const handler = setTimeout(() => {
        const payload = {
          keyword: searchValue,
          longitude: isGuest ? lng || geometry?.longitude : geometry?.longitude,
          latitude: isGuest ? lat || geometry?.latitude : geometry?.latitude,
        };
  
  
        dispatchStore(setUser({ searchKey: searchValue }));
        dispatchStore({
          type: GET_PRODUCT_SEARCH_REQUEST,
          payload,
        });
      }, 1000);
      return () => clearTimeout(handler);
    }
  }, [searchValue, dispatchStore, isGuest, lat, lng, geometry]);
  
  


  const handleClearSearch = () => {
    userHasEdited.current = false;
    dispatchStore(setUser({searchKey: ''}));
    setSearchValue('');
    setSearchingEnabled();
  };

  return (
    <LinearGradient
      colors={[colors.primaryGreen, colors.secondaryGreen]}
      style={[styles.container, {paddingTop: top}]}>
      <CustomText
        style={styles.deliveryText}
        textColor={colors.white}
        text={`Delivery to: ${name}`}
        variant="Figtree"
      />
      <TouchableWithoutFeedback onPress={onPressAddressBar}>
        <View style={styles.adressContainer}>
          <CustomText
            text={selectedAddress || 'Select your address'}
            // text={
            //   (selectedAddress && selectedAddress?.toString()?.split(',')[0]) ||
            //   'Select your address'
            // }
            variant="small"
            style={styles.addressText}
            numberOfLines={1}
          />
          <MaterialCommunityIcons
            name="chevron-down"
            color={colors.white}
            size={20}
          />
        </View>
      </TouchableWithoutFeedback>
      <CustomTouchableSVG
        onPress={() => {
          navigation.navigate('Browse');
        }}>
        <View style={styles.searchMainContainer}>
          <View style={styles.searchContainer}>
            <IonIcons
              name="search-outline"
              disabled
              color="#6B6B6B"
              size={scale(20)}
            />

            <SearchBar
              value={searchValue}
              onChangeText={(e: any) => {
                setSearchValue(e);
                userHasEdited.current = true;
              }}
              placeholder="Search for stores or products"
              inputDisable={inputDisable}
              onFocus={() => {
                if (inputDisable) {
                  navigation.navigate('Browse');
                }
              }}
            />

            {searchValue ? (
              <CustomTouchableSVG
                onPress={handleClearSearch}
                containerStyle={styles.crossIcon}>
                <CrossSVG />
              </CustomTouchableSVG>
            ) : null}
          </View>
        </View>
      </CustomTouchableSVG>
    </LinearGradient>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primaryGreen,
    borderBottomLeftRadius: moderateScale(18),
    borderBottomRightRadius: moderateScale(18),
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(14),
  },
  adressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: verticalScale(8),
    maxWidth: '95%',
  },

  addressText: {
    color: colors.white,
    fontWeight: '700',
    letterSpacing: 0.9,
  },
  searchMainContainer: {
    height: widthPercentageScale(10),
    // width: widthPercentageScale(90),
    backgroundColor: colors.white,
    paddingHorizontal: scale(12),
    borderRadius: moderateScale(20),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  crossIcon: {
    position: 'absolute',
    alignSelf: 'center',
    // borderWidth:2,
    right: scale(1),
    height: scale(12),
    width: scale(30),
    alignItems: 'center',
  },
  deliveryText: {
    fontSize: moderateScale(12),
    fontWeight: '500',
    marginTop: verticalScale(6),
  },
});
