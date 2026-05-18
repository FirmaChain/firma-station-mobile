import { CHAIN_NETWORK } from '@/../config';
import { StorageActions } from '@/redux/actions';
import { store } from '@/redux/store';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { getApp, getApps } from '@react-native-firebase/app';
import {
    FirebaseMessagingTypes,
    getInitialNotification,
    getMessaging,
    getToken,
    onMessage,
    onNotificationOpenedApp,
    onTokenRefresh,
    registerDeviceForRemoteMessages,
    setBackgroundMessageHandler,
    subscribeToTopic,
    unsubscribeFromTopic
} from '@react-native-firebase/messaging';
import { checkNotifications, requestNotifications, RESULTS } from 'react-native-permissions';

const CHANNEL_ID = 'firma-station-mobile'; // Need to changed by current network
const CHANNEL_NAME = 'Firma Station';

const NOTIFICATION_CHANNELS = [{ label: 'Proposal', topic: 'proposal' }] as const;

const logNotification = (message: string, ...detail: unknown[]) => {
    console.info('[FCM]', message, ...detail);
};

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

const normalizeNetwork = (network: string) => network.trim().toLowerCase();

const getNotificationTopics = (network: string) => {
    const topicPrefix = normalizeNetwork(network);

    return NOTIFICATION_CHANNELS.map(({ topic }) => `${topicPrefix}-${topic}`);
};

const getAllNotificationTopics = () => {
    return Object.keys(CHAIN_NETWORK).flatMap((network) => getNotificationTopics(network));
};

const ensureChannel = async () => {
    await notifee.createChannel({
        id: CHANNEL_ID,
        name: CHANNEL_NAME,
        importance: AndroidImportance.HIGH
    });
    logNotification(`notification channel ready (${CHANNEL_ID})`);
};

export const getNotificationEnabled = async () => {
    return store.getState().storage.notificationEnabled;
};

export const setNotificationEnabled = async (enabled: boolean) => {
    StorageActions.handleNotificationEnabled(enabled);
};

const hasFirebaseApp = () => getApps().length > 0;

const getFirebaseMessaging = () => getMessaging(getApp());

const clearNotificationTopics = async () => {
    const fcm = getFirebaseMessaging();
    const topics = getAllNotificationTopics();

    if (topics.length === 0) {
        return;
    }

    logNotification('unsubscribing from topics', topics);
    await Promise.all(topics.map((topic) => unsubscribeFromTopic(fcm, topic)));
    logNotification('topic unsubscribe complete', topics);
};

const subscribeNotificationTopics = async (network: string) => {
    const fcm = getFirebaseMessaging();
    const topics = getNotificationTopics(network);
    logNotification(`subscribing to topics for ${normalizeNetwork(network)}`, topics);
    await Promise.all(topics.map((topic) => subscribeToTopic(fcm, topic)));
    logNotification('topic subscribe complete', topics);
};

const hasNotificationPermission = async (requestPermission = false) => {
    const { status } = await checkNotifications();
    if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) {
        return true;
    }

    if (!requestPermission) {
        return false;
    }

    logNotification('requesting notification permission');
    const { status: requestedStatus } = await requestNotifications(['alert', 'badge', 'sound']);
    const granted = requestedStatus === RESULTS.GRANTED || requestedStatus === RESULTS.LIMITED;
    logNotification(`notification permission ${granted ? 'granted' : 'denied'}`);
    return granted;
};

export const getNotificationPermissionStatus = async () => {
    const { status } = await checkNotifications();
    return status;
};

export const isNotificationPermissionGranted = async () => {
    return hasNotificationPermission(false);
};

export const requestNotificationPermission = async () => {
    return hasNotificationPermission(true);
};

export const syncNotificationTopics = async ({
    network,
    enabled,
    requestPermission = false
}: {
    network: string;
    enabled?: boolean;
    requestPermission?: boolean;
}) => {
    if (!hasFirebaseApp()) {
        logNotification('skip topic sync because firebase app is missing');
        return false;
    }

    const isEnabled = enabled ?? (await getNotificationEnabled());
    logNotification(`sync start for ${normalizeNetwork(network)}`, { enabled: isEnabled, requestPermission });
    await clearNotificationTopics();

    if (!isEnabled) {
        logNotification('topic sync stopped because notifications are off');
        return false;
    }

    const hasPermission = await hasNotificationPermission(requestPermission);
    if (!hasPermission) {
        logNotification('topic sync stopped because notification permission is missing');
        return false;
    }

    await subscribeNotificationTopics(network);
    logNotification(`sync complete for ${normalizeNetwork(network)}`);
    return true;
};

export const showRemoteMessage = async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
    const enabled = await getNotificationEnabled();
    const hasPermission = await hasNotificationPermission(false);
    logNotification('message received', {
        enabled,
        hasPermission,
        messageId: remoteMessage.messageId,
        title: resolveTitle(remoteMessage)
    });

    if (!enabled || !hasPermission) {
        logNotification('message skipped because notifications are disabled or permission is missing');
        return;
    }

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
    logNotification('notification displayed', { messageId: remoteMessage.messageId, title });
};

export const registerBackgroundNotificationHandler = () => {
    if (!hasFirebaseApp()) {
        logNotification('skip background handler registration because firebase app is missing');
        return;
    }

    setBackgroundMessageHandler(getFirebaseMessaging(), showRemoteMessage);
    logNotification('background message handler registered');
};

export const initializeForegroundNotifications = async (network: string) => {
    if (!hasFirebaseApp()) {
        logNotification('skip foreground init because firebase app is missing');
        return () => {};
    }

    const fcm = getFirebaseMessaging();
    logNotification(`foreground init start for ${normalizeNetwork(network)}`);
    await registerDeviceForRemoteMessages(fcm);
    await ensureChannel();

    const token = await getToken(fcm);
    logNotification('FCM token ready', token);

    const unsubscribeOnMessage = onMessage(fcm, async (remoteMessage) => {
        await showRemoteMessage(remoteMessage);
    });

    const unsubscribeOnTokenRefresh = onTokenRefresh(fcm, (nextToken) => {
        logNotification('FCM token refreshed', nextToken);
        void syncNotificationTopics({ network, requestPermission: false });
    });

    const unsubscribeOnNotificationOpenedApp = onNotificationOpenedApp(fcm, (message) => {
        logNotification('notification opened from background', {
            messageId: message.messageId,
            title: resolveTitle(message)
        });
    });

    const initialNotification = await getInitialNotification(fcm);
    if (initialNotification) {
        logNotification('opened from quit state by notification', {
            messageId: initialNotification.messageId,
            title: resolveTitle(initialNotification)
        });
    }

    const unsubscribeOnForegroundEvent = notifee.onForegroundEvent(({ type, detail }) => {
        if (type === EventType.PRESS) {
            logNotification('foreground notification pressed', detail.notification?.data);
        }
    });

    const synced = await syncNotificationTopics({ network, requestPermission: true });
    logNotification(`foreground init complete for ${normalizeNetwork(network)}`, { synced });

    return () => {
        logNotification(`foreground init cleanup for ${normalizeNetwork(network)}`);
        unsubscribeOnMessage();
        unsubscribeOnTokenRefresh();
        unsubscribeOnNotificationOpenedApp();
        unsubscribeOnForegroundEvent();
    };
};
