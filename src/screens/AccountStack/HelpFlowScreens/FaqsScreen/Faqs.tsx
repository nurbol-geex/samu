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
import { fontFamilies } from 'src/theme/textVariants';

export default function Faqs() {
  const navigation = useNavigation();

  const sections = [
    {
      title: 'Ordering and Delivery',
      data: [
        {
          title: 'How do I place an order?',
          path: Route.CustomerSupport,
        },
        {
          title: 'Can I schedule an order for later?',
          path: Route.CustomerSupport,
        },
        {
          title: 'How do I track my order?',
          path: Route.CustomerSupport,
        },
        {
          title: 'What if my delivery is late?',
          path: Route.CustomerSupport,
        },
        {
          title: 'Can I cancel or modify my order?',
          path: Route.CustomerSupport,
        },
      ],
    },
    {
      title: 'Payment and Billing',
      data: [
        {
          title: 'What payment methods do you accept?',
          path: Route.CustomerSupport,
        },
        {
          title: 'How can I apply a promo code?',
          path: Route.CustomerSupport,
        },
        {
          title: 'Why was my payment declined?',
          path: Route.CustomerSupport,
        },
        {
          title: 'How do I get a refund?',
          path: Route.CustomerSupport,
        },
        {
          title: 'Can I get an invoice for my order?',
          path: Route.CustomerSupport,
        },
      ],
    },
    {
      title: 'Account and Settings',
      data: [
        {
          title: 'How do I create an account?',
          path: Route.CustomerSupport,
        },
        {
          title: 'How do I reset my password?',
          path: Route.CustomerSupport,
        },
        {
          title: 'How can I update my delivery address?',
          path: Route.CustomerSupport,
        },
        {
          title: 'How can I delete my account?',
          path: Route.CustomerSupport,
        },
        {
          title: 'How do I change my notification preferences?',
          path: Route.CustomerSupport,
        },
      ],
    },
    {
      title: 'Restaurant and Menu',
      data: [
        {
          title: 'How are restaurants selected on your platform?',
          path: Route.CustomerSupport,
        },
        {
          title: 'Why can not I find my favorite restaurant?',
          path: Route.CustomerSupport,
        },
        {
          title: 'What if the menu items are incorrect?',
          path: Route.CustomerSupport,
        },
        {
          title: 'Can I customize my order?',
          path: Route.CustomerSupport,
        },
        {
          title: 'Why are some restaurants unavailable for delivery?',
          path: Route.CustomerSupport,
        },
      ],
    },
    {
      title: 'Support and Assistance',
      data: [
        {
          title: 'How do I contact customer support?',
          path: Route.CustomerSupport,
        },
        {
          title: 'What if I receive the wrong order?',
          path: Route.CustomerSupport,
        },
        {
          title: 'How do I report a problem with my delivery?',
          path: Route.CustomerSupport,
        },
        {
          title: 'What if the delivery driver can’t find my location?',
          path: Route.CustomerSupport,
        },
        {
          title: 'How long does it take to resolve an issue?',
          path: Route.CustomerSupport,
        },
      ],
    },
  ];

  return (
    <View style={styles.mainContainer}>
      <CustomStatusBar backgroundColor={colors.primaryGreen} />
      <CustomHeader
        title="FAQS"
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
          <CustomText
            style={styles.sectionHeader}
            textColor={colors.darkGreen}
            text="Find your answer"
            variant="h2"
          />
          <CustomText
            style={styles.description}
            textColor={colors.dark}
            text="Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Nulla vitae elit libero, a pharetra augue. Sed posuere consectetur est at lobortis. Curabitur blandit tempus porttitor. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            variant="text"
          />

          {sections.map((section, index) => (
            <View key={index}>
              <CustomText
                style={styles.sectionHeader}
                textColor={colors.darkGreen}
                text={section.title}
                variant="h4"
              />
              {section.data.map((item, idx) => (
                <CustomTouchableSVG
                  key={idx}
                  onPress={() => {
                    navigation.navigate(item.path);
                  }}>
                  <View style={styles.itemContainer}>
                    <CustomText
                      style={{fontWeight: '600'}}
                      textColor={colors.darkGreen}
                      text={item.title}
                      variant="Figtree"
                    />
                    <MaterialIcons
                      name="keyboard-arrow-right"
                      size={25}
                      color={colors.primaryGreen}
                    />
                  </View>
                </CustomTouchableSVG>
              ))}
            </View>
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
    paddingHorizontal: scale(20),
  },
  sectionHeader: {
    marginVertical: vs(10),
  },
  description: {
    marginBottom: vs(20),
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: colors.grey,
    paddingVertical: vs(10),
  },
});
