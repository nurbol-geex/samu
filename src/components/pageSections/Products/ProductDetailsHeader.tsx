import React, {FC} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {CustomText} from 'src/components/shared/CustomText';
import Carousel from 'react-native-snap-carousel';
import {moderateScale, scale, vs} from 'react-native-size-matters';
import {colors} from 'src/theme/colors';
import {formatPrice} from 'src/utils';

const ProductDetailsHeader: FC<ProductDetailsHeaderProps> = ({
  storeProductDetailsData,
  activeIndex,
  setActiveIndex,
}) => {
  const renderImageItem = ({item}: {item: {originalUrl: string}}) => (
    <View style={styles.imageContainer}>
      <Image style={styles.image} source={{uri: item.originalUrl}} />
    </View>
  );

  const renderDots = () => {
    return storeProductDetailsData?.images?.length > 1 ? (
      <View style={styles.dotsContainer}>
        {(storeProductDetailsData?.images || []).map((_, index) => (
          <View
            key={index}
            style={[styles.dot, activeIndex === index && styles.activeDot]}
          />
        ))}
      </View>
    ) : null;
  };

  return (
    <>
      <View style={styles.carouselContainer}>
        <Carousel
          data={storeProductDetailsData?.images || []}
          renderItem={renderImageItem}
          sliderWidth={scale(322)}
          itemWidth={scale(322)}
          onSnapToItem={(index: number) => setActiveIndex(index)}
        />
        {renderDots()}
        <CustomText
          style={styles.productName}
          text={storeProductDetailsData?.name}
          variant="h3"
          textColor={colors.darkGreen}
        />
        <CustomText
          text={formatPrice(storeProductDetailsData?.price)}
          variant="label"
          textColor={colors.primaryGreen}
        />
        <CustomText
          style={styles.description}
          text={storeProductDetailsData?.description || ''}
          variant="label"
          textColor={colors.dark}
        />
      </View>
      {/* <View style={styles.infoContainer}>
        <View style={styles.divider} />
        <CustomText text="Info" variant="h4" textColor={colors.darkGreen} />
        <CustomText
          text="12 Servings"
          variant="label"
          textColor={colors.dark}
        />
        <CustomText
          text="If you have any questions about allergens or anything"
          text2="please contact the vendor"
          variant="label"
          textColor={colors.dark}
        />
      </View> */}
      {/* {storeProductDetailsData?.options?.length ? (
        <View style={styles.additionsContainer}>
          <CustomText
            text="Add to your burger"
            variant="h4"
            textColor={colors.darkGreen}
            style={styles.additionsTitle}
          />
          <CustomText
            text="Lorem ipsum dolor sit amet consectetur."
            variant="label"
            textColor={colors.dark}
          />
        </View>
      ) : null} */}
    </>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    paddingTop: vs(8),
    padding: scale(14),
    alignItems: 'center',
  },
  imageContainer: {
    paddingTop: vs(8),
    padding: scale(14),
    alignItems: 'center',
  },
  image: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    borderRadius: moderateScale(20),
    alignSelf: 'center',
    width: scale(322),
    height: vs(238),
  },
  productName: {
    marginBottom: vs(4),
  },
  description: {
    paddingTop: vs(18),
  },
  infoContainer: {
    gap: vs(8),
    padding: scale(14),
  },
  additionsContainer: {
    paddingHorizontal: scale(14),
    paddingTop: vs(10),
    backgroundColor: colors.disabledFillColorLight,
    flex: 1,
  },
  additionsTitle: {
    marginBottom: vs(4),
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    // marginTop: vs(8),
    bottom: vs(50),
  },
  dot: {
    width: scale(10),
    height: scale(10),
    borderRadius: 15,
    backgroundColor: '#A7CCBB',
    opacity: 0.6,
    marginHorizontal: scale(10),
  },
  activeDot: {
    backgroundColor: colors.primaryGreen,
    opacity: 1,
  },
  divider: {
    borderWidth: 0.7,
    borderColor: colors.grey,
  },
});

export default ProductDetailsHeader;
