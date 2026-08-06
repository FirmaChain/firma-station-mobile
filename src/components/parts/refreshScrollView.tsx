import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { TextCatTitleColor, WhiteColor } from '@/constants/theme';
import { CommonActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { fadeIn, fadeOut } from '@/util/animation';
import { useFocusEffect } from '@react-navigation/native';
import {
    Animated,
    NativeScrollEvent,
    NativeSyntheticEvent,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';

import { ScrollToTop } from '../icon/icon';

interface IProps {
    scrollEndFunc?: (evt: NativeSyntheticEvent<NativeScrollEvent>) => void;
    refreshFunc: () => Promise<void>;
    background?: string;
    scrollToTop?: boolean;
    toTopButton?: boolean;
    children: ReactNode;
}

const RefreshScrollView = ({
    scrollEndFunc,
    refreshFunc,
    background = 'transparent',
    scrollToTop = false,
    toTopButton = false,
    children
}: IProps) => {
    const { scrollToTop: commonScrollToTop } = useAppSelector((state) => state.common);
    const [refreshing, setRefreshing] = useState(false);
    const scrollRef = useRef<ScrollView>(null);
    const refreshPromiseRef = useRef<Promise<void> | null>(null);
    const isMountedRef = useRef(true);

    const [activeButton] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const traceRefreshing = (value: boolean): void => {
        if (typeof __DEV__ !== 'boolean' || !__DEV__) return;
        // eslint-disable-next-line no-console
        console.log('[RefreshScrollView]', { refreshing: value });
    };

    const onRefresh = async (): Promise<void> => {
        const existingRefresh = refreshPromiseRef.current;
        if (existingRefresh !== null) {
            await existingRefresh;
            return;
        }

        setRefreshing(true);
        traceRefreshing(true);
        const refreshPromise = refreshFunc().catch((error: unknown) => {
            console.error(error);
        });
        refreshPromiseRef.current = refreshPromise;

        try {
            await refreshPromise;
        } finally {
            if (refreshPromiseRef.current === refreshPromise) {
                refreshPromiseRef.current = null;
                if (isMountedRef.current) {
                    setRefreshing(false);
                    traceRefreshing(false);
                }
            }
        }
    };

    //   const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    //     // if(Platform.OS === "android"){
    //     //     if(event.nativeEvent.contentOffset.y >= 300){
    //     //         setActiveButton(true);
    //     //     } else {
    //     //         setActiveButton(false);
    //     //     }
    //     // }
    //   };

    const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (scrollEndFunc) scrollEndFunc(event);
    };

    const handleScrollToTop = (animated: boolean) => {
        scrollRef.current?.scrollTo({ y: 0, animated: animated });
        CommonActions.handleScrollToTop(false);
    };

    useEffect(() => {
        if (activeButton) {
            fadeIn(Animated, fadeAnim, 300);
        } else {
            fadeOut(Animated, fadeAnim, 300);
        }
    }, [activeButton]);

    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    useEffect(() => {
        if (commonScrollToTop) {
            handleScrollToTop(true);
        }
    }, [commonScrollToTop]);

    useFocusEffect(
        useCallback(() => {
            if (scrollToTop) {
                handleScrollToTop(false);
            }
        }, [scrollToTop])
    );

    const inlineStyles1 = {
        inlineStyle1: { flex: 1 },
        inlineStyle2: { backgroundColor: background },
        inlineStyle3: { flex: 1, position: 'relative', paddingBottom: toTopButton ? 40 : 0 },
        inlineStyle4: { transform: [{ scale: fadeAnim }] }
    } as const;

    return (
        <View style={inlineStyles1.inlineStyle1}>
            <ScrollView
                ref={scrollRef}
                scrollEventThrottle={16}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.inlineStyle1}
                onScroll={(event: NativeSyntheticEvent<NativeScrollEvent>) => onScrollEnd(event)}
                // onScroll={(event:NativeSyntheticEvent<NativeScrollEvent>) => onScroll(event)}
                refreshControl={
                    <RefreshControl
                        tintColor={WhiteColor}
                        style={inlineStyles1.inlineStyle2}
                        refreshing={refreshing}
                        enabled={true}
                        onRefresh={onRefresh}
                    />
                }
            >
                <View style={inlineStyles1.inlineStyle3}>{children}</View>
            </ScrollView>
            {toTopButton && (
                <Animated.View style={[styles.buttonBox, inlineStyles1.inlineStyle4]}>
                    <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => handleScrollToTop(true)}>
                        <ScrollToTop size={40} color={TextCatTitleColor} />
                    </TouchableOpacity>
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    inlineStyle1: { flexGrow: 1 },
    buttonBox: {
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        left: '50%',
        marginLeft: -20
    }
});

export default RefreshScrollView;
