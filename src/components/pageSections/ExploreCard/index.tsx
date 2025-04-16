import {Image, StyleSheet} from 'react-native';
import React from 'react';
import {CustomTouchableSVG} from 'src/components/shared/CustomTouchableSVG';
import {CustomText} from 'src/components/shared/CustomText';
import {colors} from 'src/theme/colors';
import {
  heightPercentageScale,
  widthPercentageScale,
} from 'src/theme/dimensions';

const ExploreCard = ({item}: ExploreCardProps) => {
  return (
    <CustomTouchableSVG
      onPress={() => console.log('Clicked Product')}
      containerStyle={styles.exploreButton}>
      <Image style={styles.exploreButtonImage} source={{uri: item?.icon}} />
      <CustomText
        text={item?.title}
        variant="title"
        textColor={colors.darkGreen}
        style={styles.exploreButtonText}
        numberOfLines={2}
      />
    </CustomTouchableSVG>
  );
};

export default ExploreCard;

const styles = StyleSheet.create<Styles>({
  exploreButton: {
    marginLeft: widthPercentageScale(2.5),
    marginTop: heightPercentageScale(2),
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: colors.grey,
    elevation: 4,
    overflow: 'hidden',
    paddingBottom: heightPercentageScale(2),
  },
  exploreButtonImage: {
    width: widthPercentageScale(28),
    height: widthPercentageScale(22),
  },
  exploreButtonText: {
    fontSize: widthPercentageScale(3.8),
    left: widthPercentageScale(2),
    top: heightPercentageScale(1),
  },
});
