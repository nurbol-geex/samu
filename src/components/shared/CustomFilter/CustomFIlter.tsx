import React, {useEffect, useState} from 'react';
import {View,  StyleSheet, ScrollView, ViewStyle} from 'react-native';
import Modal from 'react-native-modal';
import {moderateScale, scale, vs} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons'; // For filter icon
import {colors} from 'src/theme/colors';
import {CustomText} from '../CustomText';
import {CustomTouchableSVG} from '../CustomTouchableSVG';
import {widthPercentageScale} from 'src/theme/dimensions';

interface Props {
  containerStyle?: ViewStyle;
  setAllFilters: any;
  allFilters: any;
  setLoad: any;
}

const CustomFilter: React.FC<Props> = ({
  containerStyle,
  setAllFilters,
  allFilters,
  setLoad,
}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>(''); // Track which filter is selected for modal
  const [selectedInnerFilters, setSelectedInnerFilters] = useState<{
    [key: string]: string;
  }>({});

  const filterRelatedOptions: {[key: string]: string[]} = {
    Price: ['$', '$$', '$$$', '$$$$'],
    Rating: ['1.0+', '2.0+', '3.0+', '4.0+', '5.0+'],
  };
  const clearAllFilters = () => {
    setSelectedFilter('');
    setSelectedInnerFilters({});
    setAllFilters({
      priceRange: null,
      reviewScore: null,
      topRated: false,
      freeDelivery: false,
      quickDelivery: false,
    });
  };



  // Toggle modal visibility
  const toggleModal = (option?: string) => {
    if (option) {
      setSelectedFilter(option); // Set the filter to the selected one
    }
    setModalVisible(!isModalVisible);
  };

  const selectInnerFilter = (innerOption: string) => {
    setLoad(true);

    setSelectedInnerFilters(prev => ({
      ...prev,
      [selectedFilter]: innerOption,
    })); // Update the selected inner filter for the current filter
    toggleModal(); // Close modal after selection
  };

  // Clear all selected filters

  // Deselect the currently selected filter
  const deselectFilter = (option: string) => {
    const updatedFilters = {...selectedInnerFilters};
    delete updatedFilters[option]; // Remove the selected inner filter
    setSelectedInnerFilters(updatedFilters);

    // Clear the corresponding value in allFilters
    if (option === 'Price') {
      setAllFilters(prev => ({
        ...prev,
        priceRange: null, // Clear priceRange
      }));
    } else if (option === 'Rating') {
      setAllFilters(prev => ({
        ...prev,
        reviewScore: null, // Clear reviewScore
      }));
    }
  };

  // Get the inner options based on the selected filter
  const innerFilterOptions = filterRelatedOptions[selectedFilter] || [];

  // Count the number of applied filters
  const appliedFilterCount =
    Object.keys(selectedInnerFilters).length +
    (allFilters.topRated ? 1 : 0) +
    (allFilters.freeDelivery ? 1 : 0) +
    (allFilters.quickDelivery ? 1 : 0);
  return (
    <View style={[styles.container, containerStyle]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Filter icon with applied filter count */}
        <View style={styles.filterIconButton}>
          <Ionicons name="filter-outline" size={24} color={colors.black} />
          {appliedFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <CustomText
                style={styles.filterBadgeText}
                text={appliedFilterCount}
              />
            </View>
          )}
        </View>

        {/* Price and Rating Filters with Modal */}
        {['Price', 'Rating'].map((option, index) => (
          <CustomTouchableSVG
            key={index}
            onPress={() => toggleModal(option)}
            containerStyle={styles.filterButton}>
            <CustomText
              numberOfLines={1}
              textColor={colors.black}
              style={styles.optionText}
              variant="Figtree"
              text={
                selectedInnerFilters[option]
                  ? `${option}: ${selectedInnerFilters[option]}`
                  : option
              }
              // text={selectedInnerFilters[option] || option}
            />
            {selectedInnerFilters[option] ? (
              <CustomTouchableSVG
                containerStyle={{
                  // borderWidth: 1,
                  paddingHorizontal: scale(8),
                  // paddingVertical: scale(4),
                }}
                onPress={() => deselectFilter(option)}>
                <AntDesign name="closecircle" color={colors.black} size={18} />
              </CustomTouchableSVG>
            ) : (
              <View style={{paddingHorizontal: scale(8)}}>
                <AntDesign name="caretdown" color={colors.dark} size={14} />
              </View>
            )}
          </CustomTouchableSVG>
        ))}

        {/* Top Rated Filter */}
        <CustomTouchableSVG
          onPress={() => {
            setLoad(true);
            setAllFilters(prev => ({
              ...prev,
              topRated: !prev.topRated,
            }));
          }}
          containerStyle={[
            styles.filterButton,
            {
              backgroundColor: allFilters.topRated
                ? colors.primaryGreen
                : colors.white,
            },
          ]}>
          <CustomText
            numberOfLines={1}
            textColor={allFilters.topRated ? colors.white : colors.black}
            style={[styles.optionText, {marginRight: scale(12)}]}
            variant="Figtree"
            text="Top Rated"
          />
          {/* {topRated && (
            <AntDesign name="closecircle" color={colors.red500} size={14} />
          )} */}
        </CustomTouchableSVG>

        {/* Free Delivery Filter */}
        <CustomTouchableSVG
          onPress={() => {
            setLoad(true);
            setAllFilters(prev => ({
              ...prev,
              freeDelivery: !prev.freeDelivery,
            }));
          }}
          containerStyle={[
            styles.filterButton,
            {
              backgroundColor: allFilters.freeDelivery
                ? colors.primaryGreen
                : colors.white,
            },
          ]}>
          <CustomText
            numberOfLines={1}
            textColor={allFilters.freeDelivery ? colors.white : colors.black}
            style={[styles.optionText, {marginRight: scale(12)}]}
            variant="Figtree"
            text="Free Delivery"
          />
          {/* {freeDelivery && (
            <AntDesign name="closecircle" color={colors.red500} size={14} />
            // <AntDesign name="caretdown" color={colors.dark} size={14} />
          )} */}
        </CustomTouchableSVG>
        <CustomTouchableSVG
          onPress={() => {
            setLoad(true);
            setAllFilters(prev => ({
              ...prev,
              quickDelivery: !prev.quickDelivery,
            }));
          }}
          containerStyle={[
            styles.filterButton,
            {
              backgroundColor: allFilters.quickDelivery
                ? colors.primaryGreen
                : colors.white,
            },
          ]}>
          <CustomText
            numberOfLines={1}
            textColor={allFilters.quickDelivery ? colors.white : colors.black}
            style={[styles.optionText, {marginRight: scale(12)}]}
            variant="Figtree"
            text="Quick Delivery"
          />
          {/* {freeDelivery && (
            <AntDesign name="closecircle" color={colors.red500} size={14} />
            // <AntDesign name="caretdown" color={colors.dark} size={14} />
          )} */}
        </CustomTouchableSVG>

        {/* "Clear all" button - only show when filters are applied */}
        {appliedFilterCount > 0 && (
          <CustomTouchableSVG
            onPress={clearAllFilters}
            containerStyle={styles.clearAllButton}>
            <CustomText
              style={styles.optionText}
              textColor={colors.black}
              variant="Figtree"
              text="Clear all"
            />
          </CustomTouchableSVG>
        )}
      </ScrollView>

      <Modal isVisible={isModalVisible} onBackdropPress={() => toggleModal()}>
        <View style={styles.modalContent}>
          {/* Show the selected filter */}
          <CustomText
            style={{alignSelf: 'center'}}
            textColor={colors.black}
            variant="Figtree"
            text={selectedFilter}
          />

          {/* Dynamically render inner filter options based on selected filter */}
          {/* {innerFilterOptions.map((option, index) => (
            <CustomTouchableSVG
              key={index}
              onPress={() => selectInnerFilter(option)}
              containerStyle={[
                styles.optionButton,
                selectedInnerFilters[selectedFilter] === option
                  ? styles.selectedOptionButton
                  : null,
              ]}>
              <CustomText
                textColor={colors.black}
                style={styles.optionText}
                variant="Figtree"
                text={option}
              />
            </CustomTouchableSVG>
          ))} */}

          {innerFilterOptions.map((option, index) => {
            return (
              <CustomTouchableSVG
                key={index}
                onPress={() => {
                  if (selectedFilter === 'Price') {
                    selectInnerFilter(option); // Call to update selectedInnerFilters
                    // Update the priceRange in allFilters directly using option
                    setAllFilters(prev => ({
                      ...prev,
                      priceRange: option.length, // Set the selected option as the priceRange
                    }));
                  }

                  if (selectedFilter === 'Rating') {
                    selectInnerFilter(option); // Call to update selectedInnerFilters
                    // Update the reviewScore in allFilters as a number
                    setAllFilters(prev => ({
                      ...prev,
                      reviewScore: parseFloat(option), // Store as a number
                    }));
                  }
                }}
                containerStyle={[
                  styles.optionButton,
                  selectedInnerFilters[selectedFilter] === option
                    ? styles.selectedOptionButton
                    : null,
                ]}>
                <CustomText
                  textColor={colors.black}
                  style={styles.optionText}
                  variant="Figtree"
                  text={option} // Display option as string
                />
              </CustomTouchableSVG>
            );
          })}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: vs(6),
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    alignItems: 'center',
    padding: scale(6),
  },
  filterButton: {
    maxWidth: widthPercentageScale(36),
    flexDirection: 'row',
    alignItems: 'center',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.2,
    // shadowRadius: 1.41,

    // elevation: 2,
    borderWidth: 1,
    borderColor: colors.grayBg,
    backgroundColor: 'white',
    paddingVertical: vs(6),
    paddingLeft: scale(12),
    borderRadius: moderateScale(20),
    marginHorizontal: scale(6),
  },
  filterText: {
    color: 'black',
    fontWeight: 'bold',
  },
  filterIconButton: {
    borderWidth: 1,
    borderColor: colors.grayBg,
    borderRadius: moderateScale(20),
    marginRight: scale(6),
    position: 'relative',
    paddingVertical: vs(5),
    paddingHorizontal: scale(12),
  },
  filterBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.primaryGreen,
    borderRadius: 10,
    width: scale(18),
    height: scale(18),
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    alignSelf:"center",
    color: 'white',
    fontSize: moderateScale(10),
    fontWeight: 'bold',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  optionButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  selectedOptionButton: {
    borderWidth: 2,
    backgroundColor: colors.green50,
    borderColor: colors.primaryGreen, // Highlight selected option with border
  },
  optionText: {
    fontSize: moderateScale(14),
  },
  clearAllButton: {
    backgroundColor: colors.white,
    paddingVertical: vs(6),
    paddingHorizontal: scale(12),
    borderRadius: moderateScale(20),
    marginHorizontal: scale(6),
  },
});

export default CustomFilter;
