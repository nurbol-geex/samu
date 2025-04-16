import React from 'react';
import {View, StyleSheet} from 'react-native';
import {CustomText} from 'src/components/shared/CustomText';
import {CustomTouchableSVG} from 'src/components/shared/CustomTouchableSVG';
import {colors} from 'src/theme/colors';
import {widthPercentageScale} from 'src/theme/dimensions';
import RightArrowSVG from 'assets/svg/RightArrowSVG';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {Route} from 'src/routes/Route';

const styles = StyleSheet.create({
  storeTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: widthPercentageScale(4),
    paddingHorizontal: widthPercentageScale(2),
  },
  storeTitle: {
    fontSize: widthPercentageScale(5.1),
  },
  storeTitleMoreButton: {
    fontSize: widthPercentageScale(3.8),
    top:3
  },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

const HeaderSection: React.FC<HeaderSectionProps> = ({section,containerStyle}) => {
  const navigation = useNavigation<NavigationProp<any>>();

  return (section?.type === 'store-carousel' ||
    section?.type === 'all-store') &&
    section.stores?.length ? (
    <View style={[styles.storeTitleContainer,containerStyle]}>
      <CustomText
        text={section?.title}
        variant="h4"
        textColor={colors.darkGreen}
        style={styles.storeTitle}
        numberOfLines={1}
      />

      {section.type !== 'all-store' && (
        <CustomTouchableSVG
          onPress={() =>
            navigation.navigate(Route.Stores, {
              title: section?.title,
              query: section?.query?.tags[0],
            })
          }
          containerStyle={styles.moreButton}>
          <CustomText
            text="See All"
            variant="title"
            textColor={colors.primaryGreen}
            style={styles.storeTitleMoreButton}
            numberOfLines={1}
          />
          <RightArrowSVG
            width={widthPercentageScale(4.6)}
            height={widthPercentageScale(4.6)}
            marginTop={widthPercentageScale(0.8)}
          />
        </CustomTouchableSVG>
      )}
    </View>
  ) : null;
};

export default HeaderSection;
