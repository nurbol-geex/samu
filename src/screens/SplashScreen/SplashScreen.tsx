import React, {useCallback} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StyleSheet} from 'react-native';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {INIT} from '../../redux/app/constants';
import {useNavigation} from '@react-navigation/native';
import {Route} from '../../routes/Route';
import {RootStackNavigation} from '../../routes/RootStack';

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
  },
});

export default function SplashScreen() {
  const dispatchStore = useDispatch();

  const navigation = useNavigation<RootStackNavigation>();

  const init = useCallback(() => {
    dispatchStore({type: INIT});
  }, [dispatchStore]);

  useEffect(() => {
    // init();
    navigation.navigate(Route.OnboardingScreen, {});
  }, [navigation]);

  return <SafeAreaView style={styles.container} />;
}
