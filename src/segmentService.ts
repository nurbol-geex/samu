import { createClient, type SegmentClient } from '@segment/analytics-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

let segmentClient: SegmentClient | undefined = undefined;

export const initSegment = async () => {
  try {
    if (!segmentClient) {
      segmentClient = createClient({
        writeKey: 'FA7kzgCADH1nEksSsq0T117MreChbkkX',
        trackAppLifecycleEvents: true,
        debug: true,
        flushAt: 1,
        flushInterval: 1000,
      });

      // Инициализируем клиент
      await segmentClient.init();
      console.log('Segment initialized successfully');
    }
  } catch (error) {
    console.error('Failed to initialize Segment:', error);
  }
};

export const getSegmentClient = () => {
  if (!segmentClient) {
    console.warn('Segment client not initialized!');
    initSegment();
  }
  return segmentClient;
};

// Добавляем хук для использования аналитики
export const useAnalytics = () => {
  const track = async (event: string, properties?: Record<string, any>) => {
    try {
      const client = getSegmentClient();
      if (client) {
        await client.track(event, properties);
        console.log('Tracked event:', event, properties);
      } else {
        console.warn('Cannot track event - Segment client not initialized');
      }
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  };

  return { track };
};
