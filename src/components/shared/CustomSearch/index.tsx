import React from 'react';
import {StyleSheet, TextInput} from 'react-native';
import {moderateScale, scale} from 'react-native-size-matters';

const SearchBar: React.FC<SearchBarProps> = props => {
  const {value, onChangeText, placeholder, inputDisable, onFocus} = props;
  return (
    <TextInput
      style={styles.textInput}
      placeholderTextColor={'#6B6B6B'}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      onPressIn={onFocus}
      autoFocus={!inputDisable ? true : false}
      editable={!inputDisable ? true : false}
    />
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    color: '#6B6B6B',
    paddingHorizontal: scale(7),
    fontSize: moderateScale(14.2),
    fontWeight: '500',
  },
});
