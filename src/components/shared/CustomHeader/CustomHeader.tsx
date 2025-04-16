import React, {useCallback} from 'react';
import {StyleSheet, View, Platform,NativeModules} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {CustomText} from '../CustomText';
import {colors} from '../../../theme/colors';
import {CustomTouchableSVG} from '../CustomTouchableSVG';
import CircularBackSVG from 'assets/svg/CircularBackSVG';
import BackSVG from 'assets/svg/BackSVG';
import CloseSVG from 'assets/svg/CloseSVG';
import {scale, vs} from 'react-native-size-matters';
import {widthPercentageScale} from 'src/theme/dimensions';
import ProductSearch from 'assets/svg/ProductSearch';
import ShareSVG from 'assets/svg/ShareSVG';
import DeviceInfo from 'react-native-device-info';




type StartButtonIconType =
  | 'none'
  | 'back'
  | 'circular-back'
  | 'close'
  | 'advanced';

export default function CustomHeader({
  title = '',
  containerStyle = {},
  titleStyle = {},
  startButtonIconType = 'none',
  containerBackgroundColor = colors.white,
  titleColor = colors.darkGreen,
  endButtonIconType,
  handleSearch,
  shareHandler,
  handleBack,
}: CustomHeaderProps) {
  const navigation = useNavigation();
  const hasNotch = DeviceInfo.hasNotch();

  const styles = StyleSheet.create<Styles>({
    container: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      backgroundColor: containerBackgroundColor,
      height: hasNotch ? widthPercentageScale(18) : widthPercentageScale(16),
      alignItems: 'center',
    },
    startButton: {
      width: widthPercentageScale(20),
      alignItems: 'center',
    },
    endButton: {
      width: widthPercentageScale(20),
      alignItems: 'center',
    },
    endButtonIcon: {
      width: scale(18),
      height: vs(18),
    },
    title: {
      width: widthPercentageScale(60),
      alignSelf: 'center',
      textAlign: 'center',
    },
  });

  const renderStartButtonIcon = useCallback(() => {
    switch (startButtonIconType) {
      case 'back':
        return <BackSVG />;
      case 'circular-back':
        return <CircularBackSVG />;
      case 'close':
        return <CloseSVG />;
      default:
        return <BackSVG />;
    }
  }, [startButtonIconType]);

  const renderEndButtonIcon = useCallback(() => {
    switch (endButtonIconType) {
      case 'search':
        return <ProductSearch />;
      case 'share':
        return <ShareSVG />;
      default:
        return null;
    }
  }, [endButtonIconType]);

  
  return (
    <View style={[styles.container, containerStyle]} >
      {startButtonIconType === 'none' ? (
        <View style={styles.startButton} />
      ) : (
        <CustomTouchableSVG
          onPress={() => {
            if (handleBack) {
              handleBack();
            } else {
              navigation.goBack();
            }
          }}
          containerStyle={styles.startButton}>
          {renderStartButtonIcon()}
        </CustomTouchableSVG>
      )}

      {title && (
        <CustomText
          text={title}
          numberOfLines={1}
          variant="titleBar"
          textColor={titleColor}
          style={[styles.title, titleStyle]}
        />
      )}

      {endButtonIconType && (
        <CustomTouchableSVG
          onPress={() =>
            endButtonIconType === 'share'
              ? shareHandler && shareHandler()
              : handleSearch && handleSearch()
          }
          containerStyle={styles.endButton}>
          {renderEndButtonIcon()}
        </CustomTouchableSVG>
      )}
    </View>
  );
}
