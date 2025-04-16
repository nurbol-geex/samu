import {StyleSheet, View} from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {
  heightPercentageScale,
  widthPercentageScale,
} from 'src/theme/dimensions';
import { vs } from 'react-native-size-matters';

const CustomSkeletonLoader = () => {
  return (
    <SkeletonPlaceholder>
      <View style={styles.mainContainer}>
        <View style={styles.storeDetailsContainer}>
          <View style={styles.imageStyle} />
          <View style={styles.storeDetails}>
            <View style={styles.title} />
            <View style={styles.price} />
            <View style={styles.ratingView} />
          </View>
        </View>
        <View style={styles.singleProductContainer}>
          <View style={styles.singleProductDetails}>
            <View style={styles.imageStyle} />
            <View style={styles.title} />
            <View style={styles.price} />
            <View style={styles.addButtonView} />
          </View>
          <View style={styles.singleProductDetails}>
            <View style={styles.imageStyle} />
            <View style={styles.title} />
            <View style={styles.price} />
            <View style={styles.addButtonView} />
          </View>
          <View style={styles.singleProductDetails}>
            <View style={styles.imageStyle} />
            <View style={styles.title} />
            <View style={styles.price} />
            <View style={styles.addButtonView} />
          </View>
        </View>

        <View style={styles.storeDetailsContainer}>
          <View style={styles.imageStyle} />
          <View style={styles.storeDetails}>
            <View style={styles.title} />
            <View style={styles.price} />
            <View style={styles.ratingView} />
          </View>
        </View>

        <View style={styles.singleProductContainer}>
          <View style={styles.singleProductDetails}>
            <View style={styles.imageStyle} />
            <View style={styles.title} />
            <View style={styles.price} />
            <View style={styles.addButtonView} />
          </View>
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

export default CustomSkeletonLoader;

const styles = StyleSheet.create<Styles>({
  mainContainer: {
    padding: widthPercentageScale(2),
    position: 'relative',
    bottom:vs(25)
  },
  imageStyle: {
    width: widthPercentageScale(25),
    height: heightPercentageScale(12),
    borderRadius: 7,
  },
  title: {
    marginTop: heightPercentageScale(1.2),
    width: widthPercentageScale(22),
    height: heightPercentageScale(1.5),
    borderRadius: 7,
  },
  price: {
    marginTop: heightPercentageScale(1.2),
    width: widthPercentageScale(12),
    height: heightPercentageScale(1.5),
    borderRadius: 7,
  },
  ratingView: {
    marginTop: heightPercentageScale(1.2),
    width: widthPercentageScale(27),
    height: heightPercentageScale(1.5),
    borderRadius: 7,
  },
  addButtonView: {
    width: widthPercentageScale(7),
    height: widthPercentageScale(7),
    borderRadius: 9999,
    position: 'absolute',
    bottom: -heightPercentageScale(1.2),
    right: -widthPercentageScale(1.7),
  },
  singleProductContainer: {
    flexDirection: 'row',
    marginTop: heightPercentageScale(3),
  },
  singleProductDetails: {
    // borderWidth: 1,
    borderColor: 'white',
    padding: widthPercentageScale(1.2),
    alignItems: 'center',
    justifyContent: 'center',
    margin: widthPercentageScale(1.2),
    borderRadius: 7,
  },
  storeDetailsContainer: {
    flexDirection: 'row',
    margin: widthPercentageScale(1.2),
    marginTop: heightPercentageScale(3),
  },
  storeDetails: {
    marginLeft: widthPercentageScale(3),
  },
});
