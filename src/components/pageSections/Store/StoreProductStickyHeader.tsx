import React, {useState, forwardRef, Ref, useEffect, RefObject} from 'react';
import {FlatList, View, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from 'src/theme/colors';
import {CustomText} from 'src/components/shared/CustomText';
import {CustomTouchableSVG} from 'src/components/shared/CustomTouchableSVG';
import {scale, vs} from 'react-native-size-matters';
import {removeDuplicates} from 'src/utils';

type Menu = {
  id: string;
  name: string;
};

type StoreProduct = {
  id: string;
  menu: Menu;
};

type StoreProductStickyHeaderProps = {
  storeProductData: StoreProduct[];
  setShowMenu: (show: boolean) => void;
  selectedCategory?: string | null;
  onCategorySelect: (item: object) => void;
};

const StoreProductStickyHeader = forwardRef(
  (
    {
      storeProductData,
      setShowMenu,
      selectedCategory,
      onCategorySelect,
    }: StoreProductStickyHeaderProps,
    flatListRef: Ref<FlatList>,
  ) => {
    const getDynamicStyles = (itemId: string, index: number) => ({
      borderBottomColor:
        selectedCategory === itemId ? colors.white : 'transparent',
      opacity: selectedCategory === itemId ? 1 : 0.7,
    });

    const handleCategorySelect = (item: StoreProduct, index: number) => {
      onCategorySelect(item); // Trigger the category select function

      if ((flatListRef as RefObject<FlatList>)?.current as any) {
        (flatListRef as RefObject<FlatList>).current?.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0.5, // Scroll to center
        });
      }
    };

    const filteredData = removeDuplicates(storeProductData);

    return (
      <FlatList
        showsHorizontalScrollIndicator={false}
        ref={flatListRef} // Assign the reference to FlatList
        style={styles.flatList}
        horizontal
        data={filteredData}
        ListHeaderComponent={
          <CustomTouchableSVG
            onPress={() => {
              setShowMenu(true);
            }}
            containerStyle={styles.menuIconContainer}>
            <MaterialCommunityIcons
              name="dots-vertical"
              color={colors.white}
              size={32}
            />
          </CustomTouchableSVG>
        }
        keyExtractor={(_, i) => i.toString()}
        renderItem={({item, index}) => {
          return (
            <View
              style={[
                styles.menuItem,
                getDynamicStyles(item?.menu?.name, index),
              ]}>
              <CustomTouchableSVG
                containerStyle={styles.touchableContainer}
                onPress={() => handleCategorySelect(item, index)} // Pass the index to the handler
              >
                <CustomText
                  text={item.menu.name}
                  variant="label"
                  textColor={colors.white}
                />
              </CustomTouchableSVG>
            </View>
          );
        }}
      />
    );
  },
);

const styles = StyleSheet.create({
  flatList: {
    backgroundColor: colors.darkGreen,
    height: vs(38),
  },
  menuIconContainer: {
    justifyContent: 'center',
    height: '100%',
  },
  menuItem: {
    borderBottomWidth: 2,
  },
  touchableContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    paddingHorizontal: scale(10),
  },
});

export default StoreProductStickyHeader;
