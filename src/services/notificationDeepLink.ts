import AsyncStorage from '@react-native-async-storage/async-storage';

export type NotificationDeepLinkTarget = {
    kind: 'proposal';
    proposalId: number;
};

const listeners = new Set<(target: NotificationDeepLinkTarget) => void>();
const PENDING_NOTIFICATION_DEEP_LINK_STORAGE_KEY = 'pendingNotificationDeepLink';

const isNotificationDeepLinkTarget = (value: unknown): value is NotificationDeepLinkTarget => {
    if (typeof value !== 'object' || value === null) {
        return false;
    }

    const target = value as NotificationDeepLinkTarget;
    return target.kind === 'proposal' && Number.isInteger(target.proposalId) && target.proposalId > 0;
};

export const emitNotificationDeepLink = (target: NotificationDeepLinkTarget) => {
    listeners.forEach((listener) => listener(target));
};

export const subscribeNotificationDeepLink = (listener: (target: NotificationDeepLinkTarget) => void) => {
    listeners.add(listener);

    return () => {
        listeners.delete(listener);
    };
};

export const savePendingNotificationDeepLink = async (deepLink: string) => {
    const target = parseNotificationDeepLink(deepLink);
    if (target === null) {
        await AsyncStorage.removeItem(PENDING_NOTIFICATION_DEEP_LINK_STORAGE_KEY);
        return null;
    }

    await AsyncStorage.setItem(PENDING_NOTIFICATION_DEEP_LINK_STORAGE_KEY, JSON.stringify(target));
    return target;
};

export const getPendingNotificationDeepLink = async () => {
    const storedValue = await AsyncStorage.getItem(PENDING_NOTIFICATION_DEEP_LINK_STORAGE_KEY);
    if (storedValue === null || storedValue === '') {
        return null;
    }

    try {
        const parsedValue = JSON.parse(storedValue);
        if (isNotificationDeepLinkTarget(parsedValue)) {
            return parsedValue;
        }
    } catch {
        // Backward compatibility for pending raw links saved by older app versions.
        return parseNotificationDeepLink(storedValue);
    }

    return null;
};

export const clearPendingNotificationDeepLink = async () => {
    await AsyncStorage.removeItem(PENDING_NOTIFICATION_DEEP_LINK_STORAGE_KEY);
};

const decodeValue = (value: string) => {
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
};

const parseQueryString = (queryString: string) => {
    return queryString.split('&').reduce<Record<string, string>>((acc, pair) => {
        if (!pair) {
            return acc;
        }

        const [rawKey, ...rawValueParts] = pair.split('=');
        if (!rawKey) {
            return acc;
        }

        const key = decodeValue(rawKey);
        const value = decodeValue(rawValueParts.join('=') ?? '');
        acc[key] = value;
        return acc;
    }, {});
};

export const parseNotificationDeepLink = (rawDeepLink: string): NotificationDeepLinkTarget | null => {
    if (typeof rawDeepLink !== 'string') {
        return null;
    }

    const trimmed = rawDeepLink.trim();
    if (!trimmed.startsWith('firmastation://')) {
        return null;
    }

    const withoutScheme = trimmed.slice('firmastation://'.length);
    const [pathPart, queryString = ''] = withoutScheme.split('?');
    const pathSegments = pathPart.split('/').filter(Boolean);
    const action = pathSegments[0];
    const query = parseQueryString(queryString);

    if (action === 'proposal') {
        const proposalIdValue = pathSegments[1] ?? query.proposalId ?? '';
        const proposalId = Number(proposalIdValue);

        if (!Number.isInteger(proposalId) || proposalId <= 0) {
            return null;
        }

        return { kind: 'proposal', proposalId };
    }

    return null;
};
