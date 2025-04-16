import React from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import {CustomText} from '../../shared/CustomText';
import {colors} from '../../../theme/colors';
import {TimeBar} from '../TimeBar';
import {RateBar} from '../RateBar';
import {scale} from 'react-native-size-matters';
import {CustomTouchableSVG} from 'src/components/shared/CustomTouchableSVG';
import {useNavigation} from '@react-navigation/native';
import {Route} from 'src/routes/Route';
import {formatPrice, metersToMiles} from 'src/utils';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const styles = StyleSheet.create({
  topSide: {
    padding: scale(15),
    flexDirection: 'row',
    position: 'relative', // Ensure overlay can be positioned over the card
  },
  shopImage: {
    borderRadius: 8,
    width: 126,
    height: undefined,
    aspectRatio: 126 / 94,
  },
  shopDetail: {
    marginLeft: scale(15),
    justifyContent: 'space-evenly',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Covers the entire card
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent dark background
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8, // Match the shopImage borderRadius
  },
  closedText: {
    color: 'white',
    fontSize: scale(16),
    fontWeight: 'bold',
  },
});

export default function ShopCard({item}: ShopCardProps) {
  const navigation = useNavigation();
  return (
    <CustomTouchableSVG
      onPress={() =>
        navigation.navigate(Route.StoreDetails, {
          storeId: item?.storeId || item?._id,
        })
      }
      containerStyle={styles.topSide}>
      <View style={{position: 'relative'}}>
        <Image source={{uri: item?.icon[0]}} style={styles.shopImage} />
        {!item?.availability && ( // Render overlay if availability is false
          <View style={styles.overlay}>
            <View
              style={{
                alignSelf: 'center',
                backgroundColor: 'black',
                fontWeight: '600',
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: 50,
              }}>
              <CustomText
                text="Closed"
                variant="small"
                textColor={colors.white}
                numberOfLines={1}
                style={{fontSize: 12}}
              />
            </View>
          </View>
        )}
      </View>
      <View style={styles.shopDetail}>
        <CustomText
          text={item?.name}
          variant="title"
          textColor={colors.darkGreen}
        />

        <RateBar
          rate={item?.averageRating?.toFixed(1)}
          deliveryCost={`${
            item?.deliveryCost >= 0
              ? `${formatPrice(item?.deliveryCost)}`
              : 'Free Delivery'
          }`}
        />
        {item?.availability ? (
          <TimeBar
            hours={`${item?.deliveryTime?.min}-${item?.deliveryTime?.max} mins`}
            distance={`${metersToMiles(item?.distance)} mi`}
          />
        ) : (
          <View style={{flexDirection: 'row'}}>
            <MaterialCommunityIcons
              name="store-remove-outline"
              color={colors.primaryGreen}
              size={15}
            />
            <CustomText
              text="Closed"
              variant="small"
              style={{
                fontSize: 12,
                color: colors.primaryGreen,
                fontWeight: '600',
                left: 5,
              }}
              // Use your desired color for the "Closed" text
            />
          </View>
        )}
      </View>
    </CustomTouchableSVG>
  );
}
