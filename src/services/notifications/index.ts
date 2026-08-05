import { CHAIN_NETWORK } from '@/../config';
import { StorageActions } from '@/redux/actions';
import { store } from '@/redux/store';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { getApp, getApps } from '@react-native-firebase/app';
import {
    FirebaseMessagingTypes,
    getMessaging,
    onMessage,
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

const resolveTitle = (remoteMessage: FirebaseMessagingTypes.RemoteMessage): string => {
    const dataTitle = remoteMessage.data?.title;
    return remoteMessage.notification?.title ?? (typeof dataTitle === 'string' ? dataTitle : 'Notification');
};

const resolveBody = (remoteMessage: FirebaseMessagingTypes.RemoteMessage): string => {
    const dataBody = remoteMessage.data?.body;
    const dataMessage = remoteMessage.data?.message;
    return (
        remoteMessage.notification?.body ?? (typeof dataBody === 'string' ? dataBody : typeof dataMessage === 'string' ? dataMessage : '')
    );
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
};

export const getNotificationEnabled = async () => {
    return store.getState().storage.notificationEnabled;
};

export const setNotificationEnabled = async (enabled: boolean) => {
    StorageActions.handleNotificationEnabled(enabled);
};

export const getNotificationPermissionPrompted = async () => {
    return store.getState().storage.notificationPermissionPrompted;
};

export const setNotificationPermissionPrompted = async (prompted: boolean) => {
    StorageActions.handleNotificationPermissionPrompted(prompted);
};

const hasFirebaseApp = () => getApps().length > 0;

const getFirebaseMessaging = () => getMessaging(getApp());

const clearNotificationTopics = async () => {
    const fcm = getFirebaseMessaging();
    const topics = getAllNotificationTopics();

    if (topics.length === 0) {
        return;
    }

    await Promise.all(topics.map((topic) => unsubscribeFromTopic(fcm, topic)));
};

const subscribeNotificationTopics = async (network: string) => {
    const fcm = getFirebaseMessaging();
    const topics = getNotificationTopics(network);
    await Promise.all(topics.map((topic) => subscribeToTopic(fcm, topic)));
};

const hasNotificationPermission = async (requestPermission = false) => {
    const { status } = await checkNotifications();
    if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) {
        return true;
    }

    if (!requestPermission) {
        return false;
    }

    const { status: requestedStatus } = await requestNotifications(['alert', 'badge', 'sound']);
    const granted = requestedStatus === RESULTS.GRANTED || requestedStatus === RESULTS.LIMITED;
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
    const granted = await hasNotificationPermission(true);
    await setNotificationPermissionPrompted(true);
    return granted;
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
        return false;
    }

    const isEnabled = enabled ?? (await getNotificationEnabled());
    await clearNotificationTopics();

    if (!isEnabled) {
        return false;
    }

    const hasPermission = await hasNotificationPermission(requestPermission);
    if (!hasPermission) {
        return false;
    }

    await subscribeNotificationTopics(network);
    return true;
};

const displayRemoteMessage = async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
    const enabled = await getNotificationEnabled();
    const hasPermission = await hasNotificationPermission(false);

    if (!enabled || !hasPermission) {
        return false;
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
    return true;
};

export const showRemoteMessage = async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
    await displayRemoteMessage(remoteMessage);
};

export const registerBackgroundNotificationHandler = () => {
    if (!hasFirebaseApp()) {
        return;
    }

    setBackgroundMessageHandler(getFirebaseMessaging(), showRemoteMessage);
};

export const initializeForegroundNotifications = async (network: string) => {
    if (!hasFirebaseApp()) {
        return () => {};
    }

    const permissionStatus = await getNotificationPermissionStatus();
    const notificationPermissionPrompted = await getNotificationPermissionPrompted();
    if (permissionStatus === RESULTS.DENIED && !notificationPermissionPrompted) {
        const granted = await requestNotificationPermission();
        if (granted) {
            await setNotificationEnabled(true);
        }
    }

    const fcm = getFirebaseMessaging();
    await registerDeviceForRemoteMessages(fcm);
    await ensureChannel();

    const unsubscribeOnMessage = onMessage(fcm, async (remoteMessage) => {
        await showRemoteMessage(remoteMessage);
    });

    const unsubscribeOnTokenRefresh = onTokenRefresh(fcm, () => {
        void syncNotificationTopics({ network, requestPermission: false });
    });

    await syncNotificationTopics({ network, requestPermission: false });

    return () => {
        unsubscribeOnMessage();
        unsubscribeOnTokenRefresh();
    };
};
