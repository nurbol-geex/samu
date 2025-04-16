import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import Map, {MapStyleElement, Marker, PROVIDER_GOOGLE} from 'react-native-maps'; // Import MapView from react-native-maps
import {colors} from 'src/theme/colors';
import {vs} from 'react-native-size-matters';
import MapSVG from 'assets/svg/MapSVG';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const greenMapStyle: MapStyleElement[] = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#dde7dd', // Set landscape color to green
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#827b72',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#Ecf5ee',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        color: '#d2dcd3',
      },
    ],
  },
];

const MapView = ({
  lat = 0,
  lng = 0,
  zoomLevel = 15,
  containerStyle,
  draggable,
  orderDetails,
  zoomEnabled,
}: MapViewProps) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const mapRef = useRef<Map>(null);

  // Dynamically calculate delta values based on zoom level
  const zoomFactor = 1 / zoomLevel;
  let latitudeDelta = 0.0922 * zoomFactor;
  let longitudeDelta = 0.0421 * zoomFactor;

  // Create an array of marker coordinates
  const markers = [];

  // Add delivery address marker if available
  if (
    orderDetails?.deliveryAddress?.geometry?.latitude &&
    orderDetails?.deliveryAddress?.geometry?.longitude
  ) {
    markers.push({
      latitude: orderDetails.deliveryAddress.geometry.latitude,
      longitude: orderDetails.deliveryAddress.geometry.longitude,
    });
  }

  // Add store marker if available
  if (lat && lng) {
    markers.push({
      latitude: lat,
      longitude: lng,
    });
  }

  // Optional: Compute initial region based on markers
  let initialRegion = {
    latitude: lat || 0,
    longitude: lng || 0,
    latitudeDelta: latitudeDelta,
    longitudeDelta: longitudeDelta,
  };

  if (markers.length >= 2) {
    const latitudes = markers.map(marker => marker.latitude);
    const longitudes = markers.map(marker => marker.longitude);
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    const midLat = (minLat + maxLat) / 2;
    const midLng = (minLng + maxLng) / 2;

    latitudeDelta = (maxLat - minLat) * 1.5;
    longitudeDelta = (maxLng - minLng) * 1.5;

    initialRegion = {
      latitude: midLat,
      longitude: midLng,
      latitudeDelta,
      longitudeDelta,
    };
  }


  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMap(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // useEffect(() => {
  //   if (isMapLoaded && markers.length > 0) {
  //     mapRef.current?.fitToCoordinates(markers, {
  //       edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
  //       animated: true,
  //     });
  //   }
  // }, [isMapLoaded, markers]);

  return (
    <View style={[styles.container, containerStyle]}>
      {!isMapLoaded && (
        <ActivityIndicator
          size="large"
          color={colors.darkGreen}
          style={styles.loader}
        />
      )}
      {showMap && (
        <Map
          ref={mapRef}
          scrollEnabled={draggable}
          onMapReady={() => setIsMapLoaded(true)}
          customMapStyle={greenMapStyle}
          provider={PROVIDER_GOOGLE}
          userInterfaceStyle="light"
          style={styles.map}
          zoomEnabled={zoomEnabled}
          zoomControlEnabled
          initialRegion={initialRegion}>
          {/* Render delivery address marker if available */}
          {orderDetails && (
            <Marker
              coordinate={{
                latitude: orderDetails.deliveryAddress.geometry.latitude,
                longitude: orderDetails.deliveryAddress.geometry.longitude,
              }}>
              <FontAwesome5
                style={{alignSelf: 'center'}}
                color={colors.primaryGreen}
                size={32}
                name="map-marker-alt"
              />
            </Marker>
          )}
          {/* Render store marker */}
          {lat && lng && (
            <Marker
              coordinate={{
                latitude: lat,
                longitude: lng,
              }}>
              <View
                style={{
                  width: 120,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: colors.primaryGreen,
                    fontWeight: '700',
                    textAlign: 'center',
                    marginBottom: 4,
                    textShadowColor: colors.white,
                    textShadowOffset: {width: 1, height: -1},
                    textShadowRadius: 10,
                  }}>
                  {orderDetails?.store?.name}
                </Text>
                {orderDetails ? (
                  <MaterialCommunityIcons
                    style={{alignSelf: 'center'}}
                    color={colors.primaryGreen}
                    size={30}
                    name={'store-marker'}
                  />
                ) : (
                  <FontAwesome5
                    style={{alignSelf: 'center'}}
                    color={colors.primaryGreen}
                    size={24}
                    name={orderDetails ? 'store' : 'map-marker-alt'}
                  />
                )}
              </View>
            </Marker>
          )}
        </Map>
      )}
    </View>
  );
};

export default MapView;

const styles = StyleSheet.create({
  container: {
    height: vs(150),
    width: '100%',
    marginBottom: vs(15),
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loader: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
  },
});
