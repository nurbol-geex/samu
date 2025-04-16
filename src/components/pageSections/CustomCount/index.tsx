import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View, Animated} from 'react-native';
import {moderateScale, scale} from 'react-native-size-matters';
import {colors} from 'src/theme/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Octicons from 'react-native-vector-icons/Octicons';
import {CustomTouchableSVG} from 'src/components/shared/CustomTouchableSVG';
import {CustomText} from 'src/components/shared/CustomText';

const CustomCount: React.FC<CustomCountProps> = ({
  containerStyle,
  buttonStyle,
  textStyle,
  productCount,
  increaseCartHandler,
  decreaseCartHandler,
}) => {
  const translateXAnim = useRef(new Animated.Value(300)).current; // Start off-screen (300px to the right)
  const [isClosing, setIsClosing] = useState(false); // Track if closing the component

  useEffect(() => {
    // Slide-in animation from right to left
    Animated.spring(translateXAnim, {
      toValue: 0, // Slide to the final position (0px offset)
      useNativeDriver: true,
      friction: 8, // Optional: Adjust for smoother movement
      tension: 40, // Optional: Adjust for less stiffness
    }).start();
  }, [translateXAnim]);

  const handleDeletePress = () => {
    // Start the animation
    Animated.spring(translateXAnim, {
      toValue: 0, // Slide out of the screen to the right
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start(() => {
      if (decreaseCartHandler) {
        decreaseCartHandler();
      }
    });
  };

  return (
    !isClosing && (
      <Animated.View // Special animatable View with slide-in effect
        style={{
          transform: [{translateX: translateXAnim}], // Slide in from right to left
        }}>
        <View style={[styles.container, containerStyle]}>
          <CustomTouchableSVG
            onPress={productCount > 1 ? decreaseCartHandler : handleDeletePress} // Delete when count is 1
            disabled={productCount === 0}
            containerStyle={{...styles.button, buttonStyle}}>
            {productCount > 1 ? (
              <AntDesign color={colors.darkGreen} name="minus" size={15} />
            ) : (
              <AntDesign color={colors.darkGreen} name="delete" size={15} />
              // <ActivityIndicator size={'small'} color={colors.red700} />
            )}
          </CustomTouchableSVG>
          <View>
            <CustomText
              variant="small"
              text={productCount}
              textColor={colors.darkGreen}
              style={textStyle}
            />
          </View>
          <CustomTouchableSVG
            onPress={increaseCartHandler}
            containerStyle={{...styles.button, buttonStyle}}>
            <Octicons color={colors.darkGreen} name="plus" size={15} />
          </CustomTouchableSVG>
        </View>
      </Animated.View>
    )
  );
};

export default CustomCount;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    borderRadius: moderateScale(30),
    height: 38,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: scale(150),
  },
  button: {
    height: 32,
    width: 36,
    justifyContent: 'center',
    alignItems: 'center'
  },
});
