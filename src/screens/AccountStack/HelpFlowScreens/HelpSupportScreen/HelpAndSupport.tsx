import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {CustomStatusBar} from 'src/components/shared/CustomStatusBar';
import {CustomHeader} from 'src/components/shared/CustomHeader';
import {colors} from 'src/theme/colors';
import {CustomText} from 'src/components/shared/CustomText';
import {scale, vs} from 'react-native-size-matters';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {CustomTouchableSVG} from 'src/components/shared/CustomTouchableSVG';
import {Route} from 'src/routes/Route';
import {useNavigation} from '@react-navigation/native';
import * as Zendesk from 'react-native-zendesk-messaging';

const HelpAndSupport = () => {
  const navigation = useNavigation();

  const info = [
    {
      title: 'Report an issue',
      icon: 'keyboard-arrow-right',
      path: Route.ReportIssue,
      key: 1,
    },
    {
      title: 'Call customer support',
      icon: 'keyboard-arrow-right',
      path: Route.CustomerSupport,
      key: 2,
    },
    {
      title: 'Live Chat',
      icon: 'keyboard-arrow-right',
      // path: Route.Faqs,
      key: 3,
    },
    // {
    //   title: 'Message us',
    //   icon: 'keyboard-arrow-right',
    //   path: Route.MessageUs,
    //   key: 4,
    // },
    // {
    //   title: 'FAQs',
    //   icon: 'keyboard-arrow-right',
    //   path: Route.Faqs,
    //   key: 5,
    // },
  ];
  useEffect(() => {
    Zendesk.initialize({
      channelKey:
        'eyJzZXR0aW5nc191cmwiOiJodHRwczovL3NhbXU1MjUyLnplbmRlc2suY29tL21vYmlsZV9zZGtfYXBpL3NldHRpbmdzLzAxSkVFNkhUOEQ5OUtGV1lNOEVFRDAzOFI1Lmpzb24ifQ==',
    })
      .then(() => console.log('success'))
      .catch(error => console.log('failure', error));
  }, []);

  const handlePressOpenButton = () => {
    Zendesk.openMessagingView();
  };

  return (
    <View style={styles.mainContainer}>
      <CustomStatusBar backgroundColor={colors.primaryGreen} />
      <CustomHeader
        title="Help & Support"
        titleColor={colors.white}
        containerBackgroundColor={colors.primaryGreen}
        startButtonIconType="back"
      />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.select<'height' | 'position' | 'padding'>({
          ios: 'padding',
          android: undefined,
        })}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContentContainer}>
          <CustomText
            style={{marginVertical: vs(10)}}
            textColor={colors.darkGreen}
            text="Need Help?"
            variant="h2"
          />
          <CustomText
            style={{marginBottom: vs(30)}}
            textColor={colors.dark}
            text="If you have any issues with your order or experience please reach out, we have a dedicated team waiting to solve any problems you have"
            variant="text"
          />

          {info.map(item => (
            <CustomTouchableSVG
              containerStyle={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderColor: colors.grey,
                borderTopWidth: item.key === 1 ? 0 : 1,
                paddingVertical: vs(10),
              }}
              key={item.key}
              onPress={() => {
                if (item?.title === 'Live Chat') {
                  handlePressOpenButton();
                } else {
                  navigation.navigate(item.path);
                }
              }}>
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
            </CustomTouchableSVG>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default HelpAndSupport;

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
    paddingHorizontal: scale(20),
  },
});
