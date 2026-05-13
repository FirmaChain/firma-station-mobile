import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import firebase from '@react-native-firebase/app';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { checkNotifications, requestNotifications, RESULTS } from 'react-native-permissions';

const CHANNEL_ID = 'firma-station-mainnet'; // Need to changed by current network
const CHANNEL_NAME = 'Firma Station';

const resolveText = (value: unknown, fallback = '') => {
    if (typeof value === 'string') {
        return value;
    }

    return value ? JSON.stringify(value) : fallback;
};

const resolveTitle = (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
    return resolveText(remoteMessage.notification?.title ?? remoteMessage.data?.title, 'Notification');
};

const resolveBody = (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
    return resolveText(remoteMessage.notification?.body ?? remoteMessage.data?.body ?? remoteMessage.data?.message);
};

const normalizeData = (data: FirebaseMessagingTypes.RemoteMessage['data']): Record<string, string> => {
    return Object.fromEntries(
        Object.entries(data ?? {}).map(([key, value]) => [key, typeof value === 'string' ? value : JSON.stringify(value)])
    ) as Record<string, string>;
};

const ensureChannel = async () => {
    await notifee.createChannel({
        id: CHANNEL_ID,
        name: CHANNEL_NAME,
        importance: AndroidImportance.HIGH
    });
};

export const showRemoteMessage = async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
    const title = resolveTitle(remoteMessage);
    const body = resolveBody(remoteMessage);

    await notifee.displayNotification({
        title,
        body,
        data: normalizeData(remoteMessage.data),
        android: {
            channelId: CHANNEL_ID,
            pressAction: {
                id: 'default'
            }
        },
        ios: {
            foregroundPresentationOptions: {
                badge: true,
                banner: true,
                list: true,
                sound: true
            }
        }
    });
};

export const registerBackgroundNotificationHandler = () => {
    if (firebase.apps.length === 0) {
        console.log('[FCM] Firebase default app is not configured yet; background message handler is disabled.');
        return;
    }

    messaging().setBackgroundMessageHandler(showRemoteMessage);
};

const hasNotificationPermission = async () => {
    const { status } = await checkNotifications();
    if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) {
        return true;
    }

    const { status: requestedStatus } = await requestNotifications(['alert', 'badge', 'sound']);
    return requestedStatus === RESULTS.GRANTED || requestedStatus === RESULTS.LIMITED;
};

export const requestNotificationPermission = hasNotificationPermission;

export const initializeForegroundNotifications = async () => {
    if (firebase.apps.length === 0) {
        console.log('[FCM] Firebase default app is not configured yet; skipping notification initialization.');
        return () => {};
    }

    await messaging().registerDeviceForRemoteMessages();
    await ensureChannel();

    const token = await messaging().getToken();
    console.log('[FCM] token:', token);

    const unsubscribeOnMessage = messaging().onMessage(async (remoteMessage) => {
        await showRemoteMessage(remoteMessage);
    });

    const unsubscribeOnTokenRefresh = messaging().onTokenRefresh((nextToken) => {
        console.log('[FCM] token refreshed:', nextToken);
    });

    const unsubscribeOnNotificationOpenedApp = messaging().onNotificationOpenedApp((remoteMessage) => {
        console.log('[FCM] notification opened from background:', remoteMessage.data);
    });

    const initialNotification = await messaging().getInitialNotification();
    if (initialNotification) {
        console.log('[FCM] notification opened from quit state:', initialNotification.data);
    }

    const unsubscribeOnForegroundEvent = notifee.onForegroundEvent(({ type, detail }) => {
        if (type === EventType.PRESS) {
            console.log('[FCM] foreground notification pressed:', detail.notification?.data);
        }
    });

    return () => {
        unsubscribeOnMessage();
        unsubscribeOnTokenRefresh();
        unsubscribeOnNotificationOpenedApp();
        unsubscribeOnForegroundEvent();
    };
};
