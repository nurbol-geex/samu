import {Image, StyleSheet, View} from 'react-native';
import React from 'react';
import {CustomTouchableSVG} from 'src/components/shared/CustomTouchableSVG';
import {CustomText} from 'src/components/shared/CustomText';
import {colors} from 'src/theme/colors';
import {
  heightPercentageScale,
  widthPercentageScale,
} from 'src/theme/dimensions';
import {useDispatch} from 'react-redux';
import {setUser} from 'src/redux/user/slice';
import {useNavigation} from '@react-navigation/native';
import {moderateScale} from 'react-native-size-matters';
import { Route } from 'src/routes/Route';

const CategorySection = ({
  item,
  bgColor,
  containerStyle,
  imageContainerStyle,
  imageStyle,
  titleStyle,
}: CategorySectionProps) => {
  const dispatchStore = useDispatch();
  const navigation = useNavigation();
  return (
    <CustomTouchableSVG
      onPress={() => {
        // navigation.navigate(Route.CategoryScreen);
        navigation.navigate(Route.CategoryScreen, {
          id: item.id,
          name: item.name,
        });
        // dispatchStore(setUser({searchKey: item?.title}));
      }}
      containerStyle={[styles.categoriesButton, containerStyle]}>
      <View
        style={[
          styles.imageContainer,
          imageContainerStyle,
          {backgroundColor: bgColor},
        ]}>
        <Image
          style={[styles.categoriesImage, imageStyle]}
          resizeMode="contain"
          source={{uri: item?.icon || item?.symbol?.originalUrl}}
        />
      </View>
      <CustomText
        text={item?.name || item?.title}
        variant="title"
        textColor={colors.darkGreen}
        style={[styles.carouselButtonText, titleStyle]}
        numberOfLines={1}
      />
    </CustomTouchableSVG>
  );
};

export default CategorySection;

const styles = StyleSheet.create<Styles>({
  categoriesButton: {
    width: widthPercentageScale(24),
    height: widthPercentageScale(30),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: heightPercentageScale(1),
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: widthPercentageScale(20),
    height: widthPercentageScale(20),
    borderRadius: moderateScale(14),
  },
  categoriesImage: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,

    width: widthPercentageScale(14),
    height: widthPercentageScale(14),
  },

  carouselButtonText: {
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: moderateScale(11.1),
  },
});
