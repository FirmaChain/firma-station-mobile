import React, { PropsWithChildren, useEffect } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { initializeForegroundNotifications } from '@/services/notifications';

const NotificationBootstrap = ({ children }: PropsWithChildren) => {
    const { network } = useAppSelector((state) => state.storage);

    useEffect(() => {
        let cleanup = () => {};
        let isMounted = true;

        void (async () => {
            try {
                const nextCleanup = await initializeForegroundNotifications(network);
                if (isMounted) {
                    cleanup = nextCleanup;
                } else {
                    nextCleanup();
                }
            } catch (error) {
                console.error('[FCM] notification bootstrap failed', error);
            }
        })();

        return () => {
            isMounted = false;
            cleanup();
        };
    }, [network]);

    return <>{children}</>;
};

export default NotificationBootstrap;
