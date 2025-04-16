import Geolocation from 'react-native-geolocation-service';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Platform, Alert } from 'react-native';

const useGuestLocation = async (): Promise<{ lat: number; lng: number } | null> => {
  try {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    // Check and request permissions
    const status = await check(permission);
    if (status !== RESULTS.GRANTED) {
      const newStatus = await request(permission);
      if (newStatus !== RESULTS.GRANTED) {
        Alert.alert('Permission Denied', 'Location access is required to use this feature.');
        return null;
      }
    }

    // Fetch location
    const location = await new Promise<{ lat: number; lng: number }>((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });

    return location;
  } catch (error) {
    console.error('Error fetching location:', error.message);
    Alert.alert('Error', 'Unable to fetch location. Please try again.');
    return null;
  }
};

export default useGuestLocation;
