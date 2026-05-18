import React, { useEffect, useState } from 'react';
import { BoxColor, DisableColor, Lato, PointColor, TextColor, TextGrayColor, WhiteColor } from '@/constants/theme';
import { useAppSelector } from '@/redux/hooks';
import { isNotificationPermissionGranted } from '@/services/notifications';
import { AppState, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

const NotificationPermissionBox = () => {
    const { notificationEnabled } = useAppSelector((state) => state.storage);

    const [hasPermission, setHasPermission] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        let activeRefreshTimer: ReturnType<typeof setTimeout> | undefined;

        const loadPermissionState = async () => {
            try {
                const nextHasPermission = await isNotificationPermissionGranted();
                if (isMounted) {
                    setHasPermission(nextHasPermission);
                }
            } catch {
                if (isMounted) {
                    setHasPermission(false);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void loadPermissionState();

        const appStateSubscription = AppState.addEventListener('change', (nextState) => {
            if (nextState === 'active') {
                if (activeRefreshTimer) {
                    clearTimeout(activeRefreshTimer);
                }

                activeRefreshTimer = setTimeout(() => {
                    void loadPermissionState();
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
    }, []);

    const handleOpenSettings = async () => {
        try {
            await Linking.openSettings();
        } catch {
            Toast.show({
                type: 'error',
                text1: 'Failed to open app settings.'
            });
        }
    };

    if (isLoading || !notificationEnabled || hasPermission) {
        return null;
    }

    return (
        <View style={styles.box}>
            <Text style={styles.title}>Notification disabled in your device settings</Text>
            <Text style={styles.description}>Allow Firma Station to receive new notifications.</Text>
            <TouchableOpacity activeOpacity={0.85} style={styles.button} onPress={() => void handleOpenSettings()}>
                <Text style={styles.buttonText}>Go to Settings</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    box: {
        marginBottom: 24,
        marginHorizontal: 12,
        padding: 16,
        borderRadius: 8,
        backgroundColor: BoxColor
    },
    title: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextColor,
        marginBottom: 8
    },
    description: {
        fontFamily: Lato,
        fontSize: 14,
        lineHeight: 20,
        color: TextGrayColor,
        marginBottom: 14
    },
    button: {
        alignSelf: 'flex-start',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: PointColor,
        marginHorizontal: 'auto'
    },
    buttonText: {
        fontFamily: Lato,
        fontSize: 14,
        color: WhiteColor
    }
});

export default NotificationPermissionBox;
