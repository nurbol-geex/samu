import React from 'react';
import {View, FlatList, StyleSheet, ActivityIndicator} from 'react-native';
import {CustomText} from 'src/components/shared/CustomText';
import {CustomTouchableSVG} from 'src/components/shared/CustomTouchableSVG';
import {CustomModal} from 'src/components/shared/CustomModal';
import {colors} from 'src/theme/colors';
import {moderateScale, scale, vs} from 'react-native-size-matters';
import {getCurrentDayHours} from 'src/utils';

const StoreMenuSheet: React.FC<StoreMenuSheetProps> = ({
  isVisible,
  setShowMenu,
  storeMenuDataLoading,
  storeMenuData,
  onCategorySelect,
  selectedCategory,
  storeDetailsData,
}) => {
  const getDynamicStyles = (itemRes: boolean) => ({
    backgroundColor: itemRes ? colors.green400 : null,
  });
  return (
    <CustomModal
      isVisible={isVisible}
      onModalHide={() => setShowMenu(false)}
      title=""
      containerStyle={styles.customModalContainer}
      hideYesNoButton={true}>
      {storeMenuDataLoading ? (
        <View style={styles.listEmpty}>
          <ActivityIndicator size="small" color={colors.primaryGreen} />
        </View>
      ) : (
        <FlatList
          ListHeaderComponent={
            <View style={styles.modalHeader}>
              <CustomTouchableSVG onPress={() => setShowMenu(false)}>
                <View style={styles.horizontalLine} />
              </CustomTouchableSVG>
              <CustomText
                text="Full Menu"
                variant="h3"
                textColor={colors.darkGreen}
              />
              <CustomText
                text={
                  storeDetailsData?.store?.hours &&
                  getCurrentDayHours(storeDetailsData?.store?.hours)
                }
                variant="label"
                textColor={colors.darkGreen}
              />
            </View>
          }
          data={storeMenuData}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({item}) => {
            return (
              <CustomTouchableSVG
                containerStyle={[styles.menuItem]}
                onPress={() => {
                  setShowMenu(false);
                  onCategorySelect && onCategorySelect(item?.data[0]);
                }}>
                <View
                  style={[
                    styles.verticalLine,
                    getDynamicStyles(item?.title === selectedCategory),
                  ]}
                />
                <View style={styles.line}>
                  <CustomText
                    style={{
                      marginTop: vs(6),
                      fontWeight:
                        item?.title === selectedCategory ? '800' : '600',
                    }}
                    text={item?.title}
                    variant="label"
                    textColor={
                      item?.title === selectedCategory
                        ? colors.green400
                        : colors.green700
                    }
                  />
                  <CustomText
                    style={{marginTop: vs(6)}}
                    text={String(item?.data?.length)}
                    variant="label"
                    textColor={colors.dark}
                  />
                </View>
              </CustomTouchableSVG>
            );
          }}
        />
      )}
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  customModalContainer: {
    padding: moderateScale(0),
    paddingBottom: vs(40),
    paddingTop: vs(10),
  },
  listEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeader: {
    marginLeft: scale(20),
    gap: vs(5),
    marginBottom: scale(10),
  },
  menuItem: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: colors.grey,
    marginHorizontal: scale(18),
    paddingVertical: vs(8),
  },
  horizontalLine: {
    width: vs(30), // Thickness of the line
    height: vs(3), // Height of the line
    backgroundColor: '#E8E8E8', // Color of the line
    marginBottom: 5, // Space between the line and the text
    alignSelf: 'center',
  },
  verticalLine: {
    width: vs(6), // Thickness of the line
    height: vs(40), // Height of the line
    position: 'absolute',
    left: scale(-18),
    top: scale(8),
  },
  line: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: scale(6),
    marginBottom: scale(6),
  },
  selectedMenuItem: {
    backgroundColor: 'red', // Light green background for the selected item (optional)
  },
  unselectedMenuItem: {
    backgroundColor: 'yellow',
  },
});

export default StoreMenuSheet;
