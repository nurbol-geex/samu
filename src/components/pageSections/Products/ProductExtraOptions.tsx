import React from 'react';
import {View, StyleSheet} from 'react-native';
import {CustomText} from 'src/components/shared/CustomText';
import {CustomTouchableSVG} from 'src/components/shared/CustomTouchableSVG';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {colors} from 'src/theme/colors';
import {moderateScale, scale, vs} from 'react-native-size-matters';
import {formatPrice} from 'src/utils';

const ProductExtraOptions: React.FC<OptionItemProps> = ({
  item,
  selectedOptions,
  handleSelect,
}) => {
  const selectedForOption = selectedOptions.filter(id =>
    item.values.some(value => value.id === id),
  );
  const maxSelected = selectedForOption.length > item.max;

  const getSelectionMessage = (option: Option): string => {
    const {type, min, max} = option;
    if (type === 'multiple' && min === 0 && max > 0) {
      return `Select up to ${max} options (Optional)`;
    } else if (type === 'single' && min === 0 && max === 1) {
      return 'Select 1 option (Optional)';
    } else if (type === 'single' && min > 0 && max === 1) {
      return 'Select 1 option';
    } else if (
      (type === 'multiple' && min > 0 && max === 0) ||
      (min > 0 && !max)
    ) {
      return `Select ${min} or more options`;
    } else if (type === 'multiple' && min > 0 && max > 0 && min < max) {
      return `Select between ${min} and ${max} options`;
    }
    return '';
  };

  return (
    <View key={item.id} style={styles.optionContainer}>
      <CustomText
        text={item.name}
        variant="h5"
        textColor={colors.darkGreen}
        style={styles.optionTitle}
      />
      <CustomText
        text={getSelectionMessage(item)}
        variant="label"
        textColor={colors.dark}
      />
      {item.values.map((extraItem, ind) => {
        const isSelected = selectedOptions.includes(extraItem.id);
        const isDisabled = !isSelected && maxSelected;

        return (
          <CustomTouchableSVG
            onPress={() => !isDisabled && handleSelect(item.id, extraItem.id)}
            containerStyle={[
              styles.itemContainer,
              {
                backgroundColor: selectedOptions?.includes(extraItem.id)
                  ? colors.green50
                  : colors.disabledFillColorLight,
                borderBottomWidth: item.values?.length - 1 ? 1 : 0,
                borderTopWidth: ind === 0 ? 1 : 0,
              },
            ]}
            key={extraItem.id}>
            <View style={styles.itemDetails}>
              <CustomText
                text={extraItem.name}
                variant="label"
                textColor={colors.darkGreen}
              />
              <CustomText
                text={'kcal'}
                variant="small"
                textColor={colors.dark}
              />
            </View>
            <View style={styles.itemAction}>
              <View style={styles.itemPrice}>
                <CustomText
                  text={formatPrice(extraItem.additionalPrice)}
                  variant="label"
                  textColor={colors.primaryGreen}
                />
              </View>
              <CustomTouchableSVG
                disabled={isDisabled}
                containerStyle={[
                  styles.addButton,
                  {
                    backgroundColor: selectedOptions?.includes(extraItem.id)
                      ? colors.primaryGreen
                      : colors.white,
                    borderColor: selectedOptions?.includes(extraItem.id)
                      ? colors.primaryGreen
                      : colors.gray73,
                  },
                ]}
                onPress={() =>
                  !isDisabled && handleSelect(item.id, extraItem.id)
                }
              >
                <AntDesign
                  name={
                    selectedOptions?.includes(extraItem.id) ? 'check' : null
                  }
                  size={18}
                  color={colors.white}
                />
              </CustomTouchableSVG>
            </View>
          </CustomTouchableSVG>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  optionContainer: {
    backgroundColor: colors.disabledFillColorLight,
    paddingHorizontal: scale(14),
    // paddingTop: vs(10),
  },
  optionTitle: {
    fontSize: moderateScale(18),
    width: scale(320),
    paddingBottom: vs(12),
    paddingTop: vs(18),
  },
  itemContainer: {
    marginTop: vs(12),
    width: '100%',
    padding: vs(10),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: moderateScale(8),
    borderTopColor: colors.grey,
    borderBottomColor: colors.grey,
  },
  itemDetails: {
    flex: 1,
  },
  itemAction: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  itemPrice: {
    marginRight: 10,
  },
  addButton: {
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(22),
    height: scale(22),
    borderRadius: scale(20),
  },
});

export default ProductExtraOptions;
