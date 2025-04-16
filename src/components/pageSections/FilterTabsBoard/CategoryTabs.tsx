import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {CustomTabButton} from '../../shared/CustomTabButton';
import {scale} from 'react-native-size-matters';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal:scale(13),
    marginHorizontal: scale(3.5),
    marginVertical: scale(10),
    maxHeight: scale(35),
  },
});

interface CategoryTabsProps {
  tabs?: tab[];
  onChange?: (value?: {}) => void;
  dropdown?: tab[];
  active?: boolean;
}

export default function CategoryTabs({
  tabs = [],
  onChange,
  active,
}: CategoryTabsProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {tabs?.map((item: tab, index) => (
        <CustomTabButton
          text={item.name}
          active={active === item.name}
          key={index}
          onPress={() => {
            onChange(item);
          }}
          containerStyle={styles.container}
        />
      ))}
    </ScrollView>
  );
}
