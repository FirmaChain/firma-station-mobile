import React, { useEffect, useState } from 'react';
import { BgColor, BoxColor, DisableColor, Lato, PointColor, TextColor, WhiteColor } from '@/constants/theme';
import { useAppSelector } from '@/redux/hooks';
import {
    getNotificationEnabled,
    getNotificationPermissionStatus,
    isNotificationPermissionGranted,
    setNotificationEnabled,
    syncNotificationTopics
} from '@/services/notifications';
import { Alert, AppState, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { openSettings, RESULTS } from 'react-native-permissions';
import Toast from 'react-native-toast-message';

const NotificationRadio = () => {
    const { network, notificationEnabled } = useAppSelector((state) => state.storage);

    const [hasPermission, setHasPermission] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        let isMounted = true;
        let activeRefreshTimer: ReturnType<typeof setTimeout> | undefined;

        const loadNotificationState = async () => {
            try {
                const [storedEnabled, nextHasPermission] = await Promise.all([getNotificationEnabled(), isNotificationPermissionGranted()]);

                if (!isMounted) {
                    return;
                }

                setHasPermission(nextHasPermission);
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

    const openNotificationSettings = async () => {
        try {
            await openSettings('notifications');
        } catch {
            await Linking.openSettings();
        }
    };

    const handleToggle = async () => {
        if (isLoading || isUpdating) {
            return;
        }

        const nextEnabled = !(notificationEnabled && hasPermission);
        setIsUpdating(true);

        try {
            if (nextEnabled) {
                const permissionStatus = await getNotificationPermissionStatus();
                const hasPermission = permissionStatus === RESULTS.GRANTED || permissionStatus === RESULTS.LIMITED;

                if (!hasPermission) {
                    Alert.alert('Notifications are off', 'Please enable notifications to use this feature.', [
                        {
                            text: 'Cancel',
                            style: 'cancel'
                        },
                        {
                            text: 'Go to settings',
                            onPress: () => {
                                void openNotificationSettings();
                            }
                        }
                    ]);
                    await syncNotificationTopics({
                        network,
                        enabled: false,
                        requestPermission: false
                    });
                    return;
                }
            }

            await setNotificationEnabled(nextEnabled);
            await syncNotificationTopics({
                network,
                enabled: nextEnabled,
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
            <TouchableOpacity activeOpacity={0.8} disabled={isLoading || isUpdating} onPress={handleToggle}>
                <View style={[styles.radioWrapper, notificationEnabled && hasPermission ? styles.radioWrapperOn : styles.radioWrapperOff]}>
                    <View style={styles.radio} />
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
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
    radio: {
        width: 18,
        height: 18,
        borderRadius: 50,
        backgroundColor: WhiteColor
    }
});

export default NotificationRadio;
