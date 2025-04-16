import React, { useState } from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {colors} from 'src/theme/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import {vs} from 'react-native-size-matters';
import {useReduxSelector} from 'src/redux';
import {selectrecentSearchData} from 'src/redux/home/selectors';
import {useDispatch} from 'react-redux';
import {setUser} from 'src/redux/user/slice';
import {CustomTouchableSVG} from 'src/components/shared/CustomTouchableSVG';

const RecentSearches: React.FC<RecentSearchesProps> = ({}) => {
  const productSearchData = useReduxSelector(selectrecentSearchData);
  const dispatchStore = useDispatch();
    const {
      user: {accessToken, isGuest, lat, lng},
    } = useReduxSelector(store => ({user: store.user}));
  // State to hold the current search input
  const [searchInput, setSearchInput] = useState('');

  // Use a Set to eliminate duplicate items
  const uniqueSearchData = Array.from(new Set(productSearchData));

  // Default recent searches to show when there's no user search data
  const defaultRecentSearches = ['Burgers', 'Chicken', 'Pizza', 'African', 'Grocery', 'Medicine'];

  // Decide which data to display: user search data or default values
  const dataToDisplay = uniqueSearchData.length ? uniqueSearchData : defaultRecentSearches;

  // Function to handle the search key press
  const handleSearchPress = (item: string) => {
    // Directly dispatch the searchKey without trimming
    dispatchStore(setUser({ searchKey: item }));
  };

  return (
    <View style={styles.container}>

      <ScrollView>
   
        <View style={styles.titleContainer}>
          {uniqueSearchData.length ? (
            <>
              <Text style={styles.title}>Recent Search </Text>
              <Text style={{fontSize: 20}}>🔍</Text>
            </>
          ) : (
            <Text style={styles.title}>Trending Searches ⚡️</Text>
          )}
        </View>
        {dataToDisplay.map((item: any, index: number) => (
          <CustomTouchableSVG
            key={index}
            containerStyle={styles.item}
            onPress={() => handleSearchPress(item)}>
            <View style={styles.itemContent}>
              <Text style={styles.itemText}>{item}</Text>
            </View>
            <Icon name="chevron-right" size={16} color={colors.green300} />
          </CustomTouchableSVG>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    bottom:vs(35)

  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(2),
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Figtree-Regular',
    color: colors.green700,
    borderBottomColor: colors.lightGrey,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: vs(5),
    marginBottom: vs(8),
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 2,
  },
  itemContent: {
    
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    color: colors.green700,
    fontWeight: '600',
    padding: vs(10),

  },
});

export default RecentSearches;
