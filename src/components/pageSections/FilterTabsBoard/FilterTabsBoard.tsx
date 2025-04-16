import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {CustomTabButton} from '../../shared/CustomTabButton';
import {scale} from 'react-native-size-matters';
import {setUser} from 'src/redux/user/slice';
import {useDispatch} from 'react-redux';

const styles = StyleSheet.create<Styles>({
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});

export default function FilterTabsBoard({
  tabs = [],
  onChange,
}: FilterTabsBoardProps) {
  const [activeId, setActiveId] = useState(tabs?.[0]?.value);
  const dispatchStore = useDispatch();
  const changeActiveId = (value: string) => {
    if (onChange) {
      onChange(value);
    }
    setActiveId(value);
  };

  return (
    <View style={styles.mainContainer}>
      {tabs?.map(({name, value}: tab, index) => (
        <CustomTabButton
          text={name}
          active={activeId === value}
          key={index}
          onPress={() => {
            changeActiveId(value);
            dispatchStore(setUser({searchKey: value}));
          }}
          containerStyle={{marginRight: scale(7.5)}}
        />
      ))}
    </View>
  );
}
