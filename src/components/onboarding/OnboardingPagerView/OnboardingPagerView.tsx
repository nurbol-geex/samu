import React, {useCallback, useMemo, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  View,
  ViewToken,
} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import {CustomText} from 'src/components/shared/CustomText';
import {colors} from '../../../theme/colors';
import {Dots} from './Dots';
import {pagerContents} from './pagerContents';

const WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create<Styles>({
  container: {flex: 1, justifyContent: 'center'},
  pagerContentView: {
    width: WIDTH,
    justifyContent: 'center',
  },
  onboardingImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 423 / 254,
    alignSelf: 'center',
  },
  title: {
    alignSelf: 'center',
    textAlign: 'center',
    color: colors.darkGreen,
    // width: 220,
    width: scale(214),
    marginTop: scale(10),
  },
  description: {
    alignSelf: 'center',
    textAlign: 'center',
    color: colors.dark,
    width: '90%',
    marginTop: scale(7),
  },
  pagerContainer: {
    marginBottom: verticalScale(20),
  },
});

const PagerItem = ({item}: PagerItemProps) =>
  useMemo(() => {
    const {id, image, title, description} = item;
    return (
      <View key={`${id}`} style={styles.pagerContentView}>
        <Image source={image} style={styles.onboardingImage} />
        <CustomText
          text={title}
          variant="h1"
          style={styles.title}
          numberOfLines={2}
        />
        <CustomText
          text={description}
          variant="text"
          style={styles.description}
          numberOfLines={2}
        />
      </View>
    );
  }, [item]);

export default function OnboardingPagerView() {
  const [activePage, setActivePage] = useState<number>(0);
  const _onViewableItemsChanged = useCallback(({viewableItems}: {viewableItems: ViewToken[]}) => {
      if (viewableItems.length > 0) {
        setActivePage(viewableItems[0].index ?? 0);
      }
    },
    [],
  );

  const _viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };
  return (
    <View style={styles.container}>
      <View style={styles.pagerContainer}>
        <FlatList
          data={pagerContents}
          keyExtractor={item => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => <PagerItem item={item} />}
          pagingEnabled
          bounces={false}
          onViewableItemsChanged={_onViewableItemsChanged}
          viewabilityConfig={_viewabilityConfig}
        />
      </View>
      <Dots activePage={activePage} pages={pagerContents} />
    </View>
  );
}
