/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import {REACT_APP_MSW} from '@env';

async function enableMocking() {
  if (!__DEV__ || !REACT_APP_MSW) {
    return;
  }

  await import('./msw.polyfills');
  const {server} = await import('./src/mocks/server');
  server.listen();
}

enableMocking().then(() => {
  AppRegistry.registerComponent(appName, () => App);
});
