import React, {useState} from 'react';
import {View, StyleSheet, Dimensions, Image, Platform} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {scale, verticalScale} from 'react-native-size-matters';
import {colors} from 'src/theme/colors';
import {widthPercentageScale} from 'src/theme/dimensions';
import {useNavigation} from '@react-navigation/native';
import {Route} from 'src/routes/Route';
import {CustomTouchableSVG} from 'src/components/shared/CustomTouchableSVG';

const {width: screenWidth} = Dimensions.get('window');

const BannerSection = ({item: data, homeScreen}: BannerSectionProps) => {
  const navigation = useNavigation();
  const [activeSlide, setActiveSlide] = useState(0);

  const renderItem = ({item}: {item: BannerItems}) => {
    if (homeScreen) {
      return (
        <CustomTouchableSVG
          containerStyle={styles.itemContainer}
          onPress={() => {
            navigation.navigate(Route.CategoryScreen, {
              id: item?.category?.id,
              name: item?.category?.name,
            });
          }}>
          <Image source={{uri: item.image.originalUrl}} style={styles.image} />
        </CustomTouchableSVG>
      );
    } else {
      return (
        <View style={styles.itemContainer}>
          <Image source={{uri: item.image.originalUrl}} style={styles.image} />
        </View>
      );
    }
  };

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {data.map((_, index) => (
        <View
          key={index}
          style={[styles.dot, activeSlide === index && styles.activeDot]}
        />
      ))}
    </View>
  );

  return (
    <View>
      <Carousel
        data={data}
        renderItem={renderItem}
        sliderWidth={screenWidth}
        itemWidth={screenWidth}
        onSnapToItem={index => setActiveSlide(index)}
        vertical={false}
      />
      {renderDots()}
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: widthPercentageScale(39),
    width: widthPercentageScale(96),
    marginVertical: verticalScale(12),
    backgroundColor: 'white',
    borderRadius: scale(16),
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
    overflow: Platform.OS === 'ios' ? 'visible' : 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: scale(12),
    resizeMode: 'cover',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: verticalScale(10),
  },
  dot: {
    width: scale(25),
    height: verticalScale(4),
    borderRadius: 5,
    marginHorizontal: scale(4),
    backgroundColor: '#DAE2D7',
  },
  activeDot: {
    backgroundColor: colors.primaryGreen,
  },
});

export default BannerSection;
