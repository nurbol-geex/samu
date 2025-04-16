import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import React from 'react';
import {CustomStatusBar} from 'src/components/shared/CustomStatusBar';
import {CustomHeader} from 'src/components/shared/CustomHeader';
import {colors} from 'src/theme/colors';
import {CustomText} from 'src/components/shared/CustomText';
import {scale, vs} from 'react-native-size-matters';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {CustomTouchableSVG} from 'src/components/shared/CustomTouchableSVG';
import {Route} from 'src/routes/Route';
import {useNavigation} from '@react-navigation/native';


export default function ChooseIssue({route}) {
  const navigation = useNavigation();
  const orderId = route?.params?.orderId;
  const info = [
    {
      title: 'Order wasn’t delivered',
      icon: 'keyboard-arrow-right',
      key: 1,
    },
    {
      title: 'I got wrong items',
      icon: 'keyboard-arrow-right',
      key: 2,
    },
    {
      title: 'Food arrived late',
      icon: 'keyboard-arrow-right',
      key: 3,
    },
    {
      title: 'Missing items from my order',
      icon: 'keyboard-arrow-right',
      key: 4,
    },
    {
      title: 'Food was cold or stale',
      icon: 'keyboard-arrow-right',
      key: 5,
    },
    {
      title: 'Order was damaged',
      icon: 'keyboard-arrow-right',
      key: 6,
    },
    {
      title: 'Received incorrect portion sizes',
      icon: 'keyboard-arrow-right',
      key: 7,
    },
    {
      title: 'Incorrect charges on the bill',
      icon: 'keyboard-arrow-right',
      key: 8,
    },
    {
      title: 'Delivery driver was rude',
      icon: 'keyboard-arrow-right',
      key: 9,
    },
    {
      title: 'Special instructions were ignored',
      icon: 'keyboard-arrow-right',
      key: 10,
    },
  ];

  return (
    <View style={styles.mainContainer}>
      <CustomStatusBar backgroundColor={colors.primaryGreen} />
      <CustomHeader
        title="CHOOSE YOUR ISSUE"
        titleColor={colors.white}
        containerBackgroundColor={colors.primaryGreen}
        startButtonIconType="back"
      />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.select<
          'height' | 'position' | 'padding' | undefined
        >({
          ios: 'padding',
          android: undefined,
        })}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContentContainer}>
          {info.map(item => (
            <CustomTouchableSVG
              key={item.key}
              onPress={() => {
                navigation.navigate(Route.SubmitIssue, {
                  title: item.title,
                  orderId,
                });
              }}>
              <View style={styles.container}>
                <CustomText
                  textColor={colors.darkGreen}
                  text={item.title}
                  variant="Figtree"
                />
                <MaterialIcons
                  name={item.icon}
                  size={25}
                  color={colors.primaryGreen}
                />
              </View>
            </CustomTouchableSVG>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContentContainer: {
    flexGrow: 1,
    paddingTop: vs(18),
    paddingHorizontal: scale(20),
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: colors.grey,
    borderBottomWidth: 1,
    paddingVertical: vs(10),
  },
});
