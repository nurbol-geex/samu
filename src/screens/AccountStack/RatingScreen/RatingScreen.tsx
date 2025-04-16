import React, {useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {CustomStatusBar} from 'src/components/shared/CustomStatusBar';
import {CustomHeader} from 'src/components/shared/CustomHeader';
import {CustomText} from 'src/components/shared/CustomText';
import {CustomTextInput} from 'src/components/shared/CustomInputText';
import {CustomButton} from 'src/components/shared/CustomButton';
import {colors} from 'src/theme/colors';
import {moderateScale, scale, vs} from 'react-native-size-matters';
import {
  heightPercentageScale,
  widthPercentageScale,
} from 'src/theme/dimensions';
import User from 'assets/images/UserPic.png';
import Burger from 'assets/images/popular-3.png';
import {fontFamilies} from 'src/theme/textVariants';
import {postAllOrderReview} from 'src/redux/orders/thunk/getAllOrders';
import {useDispatch} from 'react-redux';
import {AppDispatch} from 'src/redux';
import {useNavigation} from '@react-navigation/native';
import {Route} from 'src/routes/Route';

const feedbackOptions: Record<string, Record<number, string[]>> = {
  driver: {
    5: [
      'Friendly',
      'Great Communication',
      'On-time Delivery',
      'Professional',
      'Excellent Service',
    ],
    4: [
      'Polite',
      'Good Communication',
      'Timely Delivery',
      'Courteous',
      'Reliable Service',
    ],
    3: [
      'Okay',
      'Average Communication',
      'Slightly Late',
      'Decent Service',
      'Not Bad',
    ],
    2: [
      'Rude',
      'Poor Communication',
      'Late Delivery',
      'Unprofessional',
      'Bad Service',
    ],
    1: [
      'Very Rude',
      'No Communication',
      'Extremely Late',
      'Unprofessional Behavior',
      'Terrible Service',
    ],
  },
  order: {
    5: [
      'Complete Order',
      'Perfect Packaging',
      'Correct Items',
      'Well Packaged',
      'Outstanding Quality',
    ],
    4: [
      'Accurate Order',
      'Good Packaging',
      'Mostly Correct',
      'Well Sealed',
      'High Quality',
    ],
    3: [
      'Minor Mistakes',
      'Average Packaging',
      'Some Missing Items',
      'Okay Sealing',
      'Standard Quality',
    ],
    2: [
      'Wrong Items',
      'Damaged Packaging',
      'Missing Items',
      'Poorly Packaged',
      'Low Quality',
    ],
    1: [
      'Completely Wrong',
      'Broken Packaging',
      'Incomplete Order',
      'Horrible Quality',
      'Unacceptable',
    ],
  },
  product: {
    5: [
      'Delicious Food',
      'Perfect Packaging',
      'Complete Order',
      'Fresh Ingredients',
      'Outstanding Quality',
    ],
    4: [
      'Tasty Food',
      'Good Packaging',
      'Accurate Order',
      'Fresh Enough',
      'High Quality',
    ],
    3: [
      'Okay Taste',
      'Acceptable Packaging',
      'Minor Mistakes',
      'Average Freshness',
      'Standard Quality',
    ],
    2: [
      'Too Salty/Too Bland',
      'Damaged Packaging',
      'Missing Item',
      'Not Fresh',
      'Low Quality',
    ],
    1: [
      'Inedible Food',
      'Broken Packaging',
      'Wrong Order',
      'Spoiled Ingredients',
      'Dirty Food',
    ],
  },
};

const RatingScreen: React.FC<RatingScreenProps> = ({route}) => {
  const {driverData, orderId, storeData, products} = route.params;

  const dispatchStore: AppDispatch = useDispatch();
  const navigation = useNavigation();

  const initialProductsRating = products?.map(() => 0);
  const initialProductsOptions = products?.map(() => []);

  const [deliveryRating, setDeliveryRating] = useState<number>(0);
  const [productRating, setproductRating] = useState<number[]>(
    initialProductsRating,
  );
  const [orderRating, setOrderRating] = useState<number>(0);
  const [selectedDeliveryOptions, setSelectedDeliveryOptions] = useState<
    string[]
  >([]);
  const [selectedOrderOptions, setSelectedOrderOptions] = useState<string[]>(
    [],
  );
  const [selectedProductOptions, setSelectedProductOptions] = useState<
    string[][]
  >(initialProductsOptions);

  const [additionalReview, setAdditionalReview] = useState<string>('');

  const handleStarPress = (
    rating: number,
    setRating: React.Dispatch<React.SetStateAction<number>>,
  ) => {
    setRating(rating);
    setAdditionalReview('');
  };

  const handleOptionSelect = (
    option: string,
    selectedOptions: string[],
    setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    const updatedOptions = selectedOptions?.includes(option)
      ? selectedOptions.filter(item => item !== option)
      : [...selectedOptions, option];

    setSelectedOptions(updatedOptions);
  };

  const submitRating = () => {
    dispatchStore(
      postAllOrderReview({
        orderId,
        ...(driverData &&
          driverData.id && {
            driverId: driverData.id,
            driverReview: {
              star: deliveryRating,
              content: additionalReview,
              tags: selectedDeliveryOptions,
            },
          }),
        ...(storeData &&
          storeData.id && {
            storeId: storeData.id,
            storeReview: {
              star: orderRating,
              content: additionalReview,
              tags: selectedOrderOptions,
            },
          }),
        ...(products.length > 0 && {
          productReviews: products.map((product: any, index: number) => ({
            productId: product.product.id,
            content: additionalReview,
            star: productRating[index],
            tags: selectedProductOptions[index],
          })),
        }),
      }),
    );
    navigation?.navigate(Route.OrderDetails, {orderId, fromReviewScreen: true});
  };

  const isSubmitDisabled = useMemo(() => {
    if (driverData) {
      return (
        deliveryRating === 0 ||
        orderRating === 0 ||
        productRating.every(num => num === 0)
      );
    }
  }, [deliveryRating, orderRating, productRating]);

  const renderFeedbackOptions = (
    ratingCategory: string,
    rating: number,
    selectedOptions: string[],
    setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    const options = feedbackOptions[ratingCategory][rating] || [];
    return (
      <FlatList
        data={options}
        renderItem={({item, index}) => (
          <TouchableWithoutFeedback onPress={() =>
            handleOptionSelect(item, selectedOptions, setSelectedOptions)
          }>
            <View
              style={[
                styles.optionContainer,
                {
                  backgroundColor: selectedOptions?.includes(item)
                    ? colors.darkGreen
                    : colors.white,
                  marginLeft: index === 0 ? scale(20) : scale(0),
                  marginRight: index !== 0 ? scale(10) : scale(8),
                },
              ]}>
              <CustomText
                text={item}
                variant="title"
                textColor={
                  selectedOptions?.includes(item)
                    ? colors.white
                    : colors.darkGreen
                }
              />
            </View>

          </TouchableWithoutFeedback>
        )}
        keyExtractor={item => item}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    );
  };


  return (
    <View style={styles.mainContainer}>
      <CustomStatusBar backgroundColor={colors.primaryGreen} />
      <CustomHeader
        title="LEAVE A RATING"
        titleColor={colors.white}
        containerBackgroundColor={colors.primaryGreen}
        startButtonIconType="close"
      />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.select<'height' | 'position' | 'padding'>({
          ios: 'padding',
          android: undefined,
        })}>
        <LinearGradient
          start={{x: 0, y: 0.3}}
          end={{x: 0, y: 1.4}}
          colors={[colors.primaryGreen, colors.green600]}
          style={styles.linearGradient}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContentContainer}>
            {driverData ? (
              <>
                <View style={styles.sectionContainer}>
                  <CustomText
                    style={styles.sectionTitle}
                    textColor={colors.white}
                    variant="h3"
                    text="How was the Delivery?"
                  />
                  <RatingItem
                    imageSource={driverData?.imageUrl || User}
                    // imageSource={{uri: driverData?.imageUrl}}
                    name={driverData?.firstName}
                    selectedRating={deliveryRating}
                    onStarPress={rating =>
                      handleStarPress(rating, setDeliveryRating)
                    }
                    hideStars={deliveryRating > 0}
                  />
                </View>
                {deliveryRating > 0 && (
                  <View style={styles.feedbackContainer}>
                    {renderFeedbackOptions(
                      'driver',
                      deliveryRating,
                      selectedDeliveryOptions,
                      setSelectedDeliveryOptions,
                    )}
                  </View>
                )}
                <View style={styles.breakline} />
              </>
            ) : null}
            <View style={styles.sectionContainer}>
              <CustomText
                style={styles.sectionTitle}
                textColor={colors.white}
                variant="h3"
                text="How was your Order?"
              />
              <RatingItem
                imageSource={storeData.hasOwnProperty('image') ? storeData?.image?.originalUrl : Burger}
                // imageSource={Burger}
                name={storeData?.name}
                selectedRating={orderRating}
                onStarPress={rating => handleStarPress(rating, setOrderRating)}
                hideStars={orderRating > 0}
              />
              {orderRating > 0 && (
                <View style={styles.feedbackContainer}>
                  {renderFeedbackOptions(
                    'order',
                    orderRating,
                    selectedOrderOptions,
                    setSelectedOrderOptions,
                  )}
                </View>
              )}

              <View style={styles.breakline} />

              <CustomText
                style={styles.sectionTitle}
                textColor={colors.white}
                variant="h3"
                text="How was the Product?"
              />
              {products.map((item, index) => {
                return (
                  <>
                    <View
                      style={[
                        styles.breakline,
                        {
                          borderWidth: index === 0 ? 0 : 0.6,
                          marginVertical:
                            index === 0 ? 0 : widthPercentageScale(10),
                        },
                      ]}
                    />
                    <View style={styles.sectionContainer}>
                      <RatingItem
                        imageSource={{
                          uri: item?.product?.images[0]?.originalUrl,
                        }}
                        name={item?.product?.name}
                        selectedRating={productRating?.[index] || 0}
                        onStarPress={rating => {
                          handleStarPress(rating, rat => {
                            setproductRating(() => {
                              const latestProductsRating = productRating.map(
                                (prevRating, idx) => {
                                  if (idx === index) {
                                    return rating;
                                  }
                                  return prevRating;
                                },
                              );
                              return latestProductsRating;
                            });
                          });
                        }}
                        hideStars={(productRating?.[index] || 0) > 0}
                      />
                    </View>
                    {productRating[index] > 0 && (
                      <View style={styles.feedbackContainer}>
                        {renderFeedbackOptions(
                          'product',
                          productRating[index],
                          selectedProductOptions[index] ?? [],
                          updatedOptions => {
                            setSelectedProductOptions(
                              prevSelectedProductOptions => {
                                return prevSelectedProductOptions.map(
                                  (prevSelectedProductOption, idx) => {
                                    if (idx === index) {
                                      return updatedOptions;
                                    }
                                    return prevSelectedProductOption;
                                  },
                                );
                              },
                            );
                          },
                        )}
                      </View>
                    )}
                  </>
                );
              })}
            </View>
            {orderRating > 0 &&
              (!driverData || deliveryRating > 0) &&
              productRating.every(num => num > 0) && (
                <>
                  <CustomTextInput
                    value={additionalReview}
                    onChangeText={setAdditionalReview}
                    placeholderTextColor={colors.dark}
                    placeholder="Leave any other details you have..."
                    multiline={true}
                    placeholderPosition="left"
                    style={styles.input}
                    inputContainerStyle={styles.inputInnerContainer}
                  />
                  <CustomButton
                    disabled={isSubmitDisabled}
                    onPress={submitRating}
                    text="Submit Rating"
                    touchableBackgroundColor={
                      isSubmitDisabled ? colors.primary400 : colors.darkGreen
                    }
                  />
                </>
              )}
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </View>
  );
};

const RatingItem: React.FC<RatingItemProps> = ({
  imageSource,
  name,
  selectedRating,
  onStarPress,
  hideStars,
}) => (
  <View style={styles.underSectionContainer}>
    <View style={styles.profileContainer}>
      <Image
        resizeMode="cover"
        style={styles.driverProfile}
        source={imageSource}
      />
      {selectedRating > 0 && (
        <View style={styles.ratingOverlay}>
          <View style={styles.ratingTextContainer}>
            <CustomText
              textColor={colors.darkGreen}
              text={`${selectedRating}`}
              variant="Figtree"
            />
            <AntDesign name="star" color={colors.yellow} size={18} />
          </View>
        </View>
      )}
    </View>
    <CustomText
      style={styles.driverName}
      textColor={colors.white}
      text={name}
      variant="h5"
    />
    {!hideStars && (
      <View style={styles.starContainer}>
        {Array.from({length: 5}).map((_, index) => (
          <TouchableOpacity onPress={() => onStarPress(index + 1)}>
            <AntDesign
              key={index}
              name={index < selectedRating ? 'star' : 'staro'}
              color={index < selectedRating ? colors.yellow : colors.white}
              size={30}
            />
          </TouchableOpacity>
          
        ))}
      </View>
    )}
  </View>
);

export default RatingScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContentContainer: {
    justifyContent: 'center',
    flexGrow: 1,
    paddingBottom: scale(20),
  },
  sectionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    alignSelf: 'center',
    marginBottom: scale(10),
  },
  underSectionContainer: {
    gap: scale(5),
    flexDirection: 'column',
    alignItems: 'center',
  },
  breakline: {
    width: '100%',
    borderWidth: 0.6,
    borderColor: colors.green200,
    marginVertical: widthPercentageScale(10),
  },
  driverProfile: {
    width: widthPercentageScale(27),
    height: widthPercentageScale(27),
    borderRadius: moderateScale(80),
    
  },
  linearGradient: {
    flex: 1,
  },
  starContainer: {
    marginTop: scale(10),
    gap: scale(10),
    flexDirection: 'row',
  },
  profileContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  ratingOverlay: {
    position: 'absolute',
    top: widthPercentageScale(8),
    left: scale(-20),
    backgroundColor: colors.white,
    borderRadius: moderateScale(30),
    justifyContent: 'center',
    alignItems: 'center',
    width: widthPercentageScale(11),
    height: widthPercentageScale(11),
  },
  ratingTextContainer: {
    gap: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverName: {
    alignSelf: 'center',
    marginTop: scale(5),
  },
  feedbackContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: scale(20),
  },
  optionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scale(5),
    paddingHorizontal: scale(12),
    borderRadius: moderateScale(30),
  },
  input: {
    verticalAlign: 'top',
    fontFamily: fontFamilies.medium,
    fontWeight: '500',
    fontSize: moderateScale(15.09), //16
    letterSpacing: -0.1,
    color: colors.darkGreen,
  },

  inputInnerContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: moderateScale(10),
    opacity: 0.9,
    backgroundColor: colors.inputBackgroundColor,
    height: heightPercentageScale(12),
    alignItems: 'flex-start',
  },
  productImage: {
    borderWidth: 1,
    borderRadius: moderateScale(6),
    height: widthPercentageScale(10),
    width: widthPercentageScale(10),
  },
  productContainer: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
