import React from 'react';
import {View, StyleSheet} from 'react-native';
import {CustomText} from 'src/components/shared/CustomText';
import {colors} from 'src/theme/colors';
import {moderateScale, scale, vs} from 'react-native-size-matters';
import {CustomTouchableSVG} from 'src/components/shared/CustomTouchableSVG';
import {tips} from 'src/mocks/general';
import {formatPrice } from 'src/utils';
import {useReduxSelector} from 'src/redux';
import {useDispatch} from 'react-redux';
import {ANALYTICS} from 'src/redux/user/constants';
import { useAnalytics } from 'src/segmentService';

const TipOption: React.FC<TipOptionProps> = React.memo(
  ({setTipModalVisible, setSelectTip, selectTip}) => {
    const isTipInList = tips.some(tip => tip.price === selectTip);
    const user = useReduxSelector(state => state.user);
    const { track } = useAnalytics()
    const {
      user: {accessToken, isGuest},
    } = useReduxSelector(store => ({user: store.user}));
    const dispatchStore = useDispatch();

    const sendtipAnalytics = () => {
      track('tipAdded', {selectTip});
      dispatchStore({
        type: ANALYTICS,
        payload: {
          eventType: 'tipSet', // Specify the event type here
          data: {
            tipAmount: selectTip,
            userId: user.email,
            sessionId: accessToken,
          },
        },
      });
    };

    return (
      <View style={styles.sectionContainer}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <CustomText
            text="Leave a tip for Rider"
            variant="h5"
            textColor={colors.darkGreen}
          />
          {!isTipInList && (
            <CustomText
              style={{right: scale(5)}}
              text={formatPrice(selectTip)}
              variant="label"
              textColor={colors.darkGreen}
            />
          )}
        </View>
        <View style={[styles.row, {gap: 3}]}>
          {tips.map((tip, index) => {
            const isOtherOption = index === 3;
            const isSelected = isOtherOption
              ? !isTipInList
              : selectTip === tip.price;
            const highlightColor = colors.darkGreen;
            const defaultColor = colors.white;

            return (
              <CustomTouchableSVG
                onPress={() => {
                  if (isOtherOption) {
                    sendtipAnalytics();
                    setTipModalVisible(true);
                  } else {
                    // Handle tip selection
                    if (selectTip === tip.price) {
                      setSelectTip(0);
                    } else {
                      setSelectTip(tip.price);
                      sendtipAnalytics();
                    }
                  }
                }}
                key={tip.id}
                containerStyle={{
                  ...styles.tipContainer,
                  backgroundColor: isSelected ? highlightColor : defaultColor,
                }}>
                <CustomText
                  text={isOtherOption ? 'Other' : formatPrice(tip.price)}
                  variant="title"
                  textColor={isSelected ? defaultColor : highlightColor}
                />
              </CustomTouchableSVG>
            );
          })}
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: vs(14),
    padding: scale(10),
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: moderateScale(12),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: vs(5),
  },
  tipContainer: {
    borderRadius: moderateScale(30),
    borderColor: colors.grey,
    borderWidth: 1,
    paddingHorizontal: scale(8),
    paddingVertical: vs(7),
    alignItems: 'center',
    marginTop: vs(3),
  },
});

export default TipOption;
