import {Image, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {CustomTouchableSVG} from 'src/components/shared/CustomTouchableSVG';
import {colors} from 'src/theme/colors';
import {
  heightPercentageScale,
  widthPercentageScale,
} from 'src/theme/dimensions';
import DropDownPicker from 'react-native-dropdown-picker';
import {moderateScale, vs} from 'react-native-size-matters';
import DropDown from '../../../../assets/images/dropdown.png';

const ChipSection = ({text}: ChipSectionProps) => {
  const [openDropDown, setopenDropDown] = useState(false);
  const [value, setValue] = useState('latest');
  const [items, setItems] = useState([
    {label: 'Sort', value: 'latest'},
    {label: 'Fast', value: 'oldest'},
  ]);

  return (
    <View style={{width: '20%', zIndex: 999}}>
      <CustomTouchableSVG onPress={() => console.log('Clicked Product')}>
        <DropDownPicker
          autoScroll
          style={styles.dropdown}
          containerStyle={styles.dropdownContainer}
          dropDownContainerStyle={styles.dropdownInnerContainer}
          open={openDropDown}
          value={value}
          items={items}
          setOpen={setopenDropDown}
          setValue={setValue}
          setItems={setItems}
          textStyle={styles.label}
          listItemLabelStyle={[styles.label]} // Ensure text truncates with an ellipsis
          ArrowUpIconComponent={() => (
            <Image source={DropDown} style={styles.arrowIcon} />
          )}
          ArrowDownIconComponent={() => (
            <Image source={DropDown} style={styles.arrowIcon} />
          )}
          // onSelectItem={e => handleSortBy(e.value)}
        />
      </CustomTouchableSVG>
    </View>
  );
};

export default ChipSection;

const styles = StyleSheet.create<Styles>({
  arrowIcon: {
    width: 16,
    height: 16,
    right: vs(10),
  },
  label: {
    fontWeight: '700',
    fontSize: moderateScale(15.08), //16,
    color: colors.black,
    textAlign: 'center',
    fontFamily: 'Figtree',
  },
  dropdown: {
    borderRadius: moderateScale(30),
    borderWidth: 0,
  },
  dropdownContainer: {
    marginTop: vs(10),
    borderRadius: moderateScale(30),
    backgroundColor: colors.white,
    marginHorizontal: widthPercentageScale(1.2),
    width: widthPercentageScale(25),
    shadowColor: colors.grey,
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 5,
    shadowRadius: 5,

    elevation: 5,
  },

  dropdownInnerContainer: {
    // justifyContent:"center",
    borderWidth: 0,
    backgroundColor: colors.inputBackgroundColor,
  },
  chipButton: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOpacity: 0.15,
    shadowOffset: {width: 0.2, height: 0.2},
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: widthPercentageScale(5),
    // borderRadius: 40,
    marginTop: heightPercentageScale(2),
    marginHorizontal: widthPercentageScale(0.8),
    height: heightPercentageScale(4.8),
    elevation: 5,
  },
  chipImage: {
    width: widthPercentageScale(4.6),
    height: widthPercentageScale(4.6),
    right: widthPercentageScale(1),
  },
  carouselButtonText: {
    alignSelf: 'center',
    textAlign: 'center',
  },
});
