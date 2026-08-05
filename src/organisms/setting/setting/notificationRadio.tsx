import React, { useEffect, useState } from 'react';
import { BgColor, BoxColor, DisableColor, Lato, PointColor, TextColor, WhiteColor } from '@/constants/theme';
import { useAppSelector } from '@/redux/hooks';
import {
    getNotificationEnabled,
    requestNotificationPermission,
    setNotificationEnabled,
    syncNotificationTopics
} from '@/services/notifications';
import { ActivityIndicator, AppState, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

const NotificationRadio = () => {
    const { network, notificationEnabled } = useAppSelector((state) => state.storage);

    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        let isMounted = true;
        let activeRefreshTimer: ReturnType<typeof setTimeout> | undefined;

        const loadNotificationState = async () => {
            if (isMounted) {
                setIsLoading(true);
            }

            try {
                const storedEnabled = await getNotificationEnabled();

                if (!isMounted) {
                    return;
                }

                await syncNotificationTopics({
                    network,
                    enabled: storedEnabled,
                    requestPermission: false
                });
            } catch {
                // ignore load errors; the toggle simply stays off
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void loadNotificationState();

        const appStateSubscription = AppState.addEventListener('change', (nextState) => {
            if (nextState === 'active') {
                if (activeRefreshTimer) {
                    clearTimeout(activeRefreshTimer);
                }

                activeRefreshTimer = setTimeout(() => {
                    void loadNotificationState();
                }, 300);
            }
        });

        return () => {
            isMounted = false;
            if (activeRefreshTimer) {
                clearTimeout(activeRefreshTimer);
            }
            appStateSubscription.remove();
        };
    }, [network]);

    const isBusy = isLoading || isUpdating;

    const handleToggle = async () => {
        if (isBusy) {
            return;
        }

        const nextEnabled = !notificationEnabled;
        setIsUpdating(true);

        try {
            if (!nextEnabled) {
                await setNotificationEnabled(false);
                await syncNotificationTopics({
                    network,
                    enabled: false,
                    requestPermission: false
                });
                return;
            }

            const granted = await requestNotificationPermission();
            if (!granted) {
                Toast.show({
                    type: 'error',
                    text1: 'Notification permission is required to turn on alerts.'
                });
                return;
            }

            await setNotificationEnabled(true);
            await syncNotificationTopics({
                network,
                enabled: true,
                requestPermission: false
            });
        } catch {
            Toast.show({
                type: 'error',
                text1: 'Failed to update notification setting.'
            });
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <View style={styles.listItem}>
            <Text style={styles.itemTitle}>Notifications</Text>
            {isBusy ? (
                <ActivityIndicator size={24} color={WhiteColor} />
            ) : (
                <TouchableOpacity
                    activeOpacity={0.8}
                    disabled={isBusy}
                    onPress={handleToggle}
                    style={isBusy ? styles.radioDisabled : styles.inlineStyle1}
                >
                    <View style={[styles.radioWrapper, notificationEnabled ? styles.radioWrapperOn : styles.radioWrapperOff]}>
                        <View style={styles.radio} />
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    inlineStyle1: {},
    listItem: {
        backgroundColor: BoxColor,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: BgColor
    },
    itemTitle: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextColor
    },
    radioWrapper: {
        width: 45,
        borderRadius: 20,
        justifyContent: 'center',
        padding: 3
    },
    radioWrapperOn: {
        backgroundColor: PointColor,
        alignItems: 'flex-end'
    },
    radioWrapperOff: {
        backgroundColor: DisableColor,
        alignItems: 'flex-start'
    },
    radioDisabled: {
        opacity: 0.45
    },
    radio: {
        width: 18,
        height: 18,
        borderRadius: 50,
        backgroundColor: WhiteColor
    }
});

export default NotificationRadio;
