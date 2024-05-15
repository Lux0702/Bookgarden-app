/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import notifee, {EventType} from '@notifee/react-native';
import {navigationRef} from './src/utils/RootNavigation';
notifee.onBackgroundEvent(async ({type, detail}) => {
  const {notification, pressAction} = detail;
  if (type === EventType.ACTION_PRESS && pressAction.id === 'default') {
    // Update external API
    navigationRef.navigate('Notification');
    // Remove the notification
    await notifee.cancelNotification(notification?.id);
  }
});

AppRegistry.registerComponent(appName, () => App);
