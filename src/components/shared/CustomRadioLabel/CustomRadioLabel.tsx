import MapPointerActiveSVG from 'assets/svg/MapPointerActiveSVG';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {scale} from 'react-native-size-matters';
import {colors} from 'src/theme/colors';
import {CustomText} from '../CustomText';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';

const styles = StyleSheet.create<Styles>({
  addressIconContainer: {
    borderRadius: 9999,
    backgroundColor: colors.primaryGreen,
    height: 38,
    width: 38,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    // padding: scale(7.5),
    marginLeft: -scale(7.5) / 2,
  },
  radioLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    flex: 1,
  },
});

export default function CustomRadioLabel({
  address,
  city,
  name,
  unit,
  deliveryNotes
}: CustomRadioLabelProps) {
  return (
    <View style={styles.radioLabelContainer}>
      <View style={styles.addressIconContainer}>
        {name === "Home" ?
          <Entypo
            style={{ alignSelf: 'center' }}
            color={colors.white}
            size={20}
            name="home"
          />
          : name === "Work" ?
            <Entypo
              style={{ alignSelf: 'center' }}
              color={colors.white}
              size={18}
              name="briefcase"
            />
            : name === "Partner" ?
              <AntDesign
                style={{ alignSelf: 'center' }}
                color={colors.white}
                size={16}
                name="heart"
              />
              :
              <FontAwesome5
                style={{ alignSelf: 'center' }}
                color={colors.white}
                size={18}
                name="map-marker-alt"
              />
        }
        
        {/* <MapPointerActiveSVG width={20} height={20} /> */}
      </View>
      <View style={{paddingLeft: scale(15), paddingRight: scale(42.8)}}>
        <CustomText
          variant="Figtree"
          textColor={colors.darkGreen}
          text={name ? name : address}
          style={{fontWeight: '700'}}
          numberOfLines={1}
          ellipsizeMode={'tail'}
        />
        <CustomText numberOfLines={1} style={{fontSize: 14, marginVertical: 2}} variant="label" textColor={colors.dark} text={name ? unit+address+", "+city : city} />
        <CustomText numberOfLines={1} style={{fontSize: 14}} variant="label" textColor={colors.dark} text={`Note to rider: ${deliveryNotes && deliveryNotes !== "" ? deliveryNotes : 'none'}`} />

      </View>
    </View>
  );
}
