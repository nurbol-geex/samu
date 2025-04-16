import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {CustomText} from 'src/components/shared/CustomText';
import {CustomButton} from 'src/components/shared/CustomButton';
import {colors} from 'src/theme/colors';
import {moderateScale, scale, vs} from 'react-native-size-matters';
import {
  heightPercentageScale,
  widthPercentageScale,
} from 'src/theme/dimensions';
import {Route} from 'src/routes/Route';
import {useNavigation} from '@react-navigation/native';

const EmptyBasket: React.FC = () => {
  const navigation = useNavigation();
  return (
    <LinearGradient
      colors={[colors.green50, colors.white]}
      style={styles.gradientBackground}>
      <View style={styles.emptyContainer}>
        <Image
          resizeMode="contain"
          style={styles.emptyImage}
          source={require('assets/images/empty.png')}
        />
        <CustomText
          style={[
            styles.emptyText,
            {
              fontWeight: '900',
              fontSize: moderateScale(32),
              textTransform: 'uppercase',
            },
          ]}
          text="Your Basket is Empty"
          variant="h1"
          textColor={colors.darkGreen}
        />
        <CustomText
          style={styles.emptyText}
          text="Pick from any of your favorite stores now and receive your order in minutes!"
          variant="text"
          textColor={colors.darkGreen}
        />

        <CustomButton
          onPress={() => navigation.navigate(Route.HomeScreen)}
          text="Shop Now"
          containerStyle={styles.checkout}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    gap: vs(25),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(50),
    width: '100%',
  },
  emptyImage: {
    width: widthPercentageScale(85),
    height: heightPercentageScale(30),
  },
  emptyText: {
    textAlign: 'center',
    alignSelf: 'center',
  },
  checkout: {
    width: widthPercentageScale(105),
  },
});

export default EmptyBasket;
