import React, { useRef, useState } from 'react';
import {
    NativeSyntheticEvent,
    NativeScrollEvent,
    View,
    StyleSheet,
    Animated,
    TouchableOpacity,
    RefreshControl,
    ScrollView
} from 'react-native';
import { TextCatTitleColor, WhiteColor } from '@/constants/theme';
import { ScrollToTop } from '../icon/icon';
import { fadeIn, fadeOut } from '@/util/animation';
import { useEffect } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { CommonActions } from '@/redux/actions';

interface IProps {
    scrollEndFunc?: Function;
    refreshFunc: () => void;
    background?: string;
    toTopButton?: boolean;
    children: JSX.Element;
}

const RefreshScrollView = ({ scrollEndFunc, refreshFunc, background = 'transparent', toTopButton = false, children }: IProps) => {
    const { common: removeable } = useAppSelector((state) => state);
    const [refreshing, setRefreshing] = useState(false);
    const scrollRef = useRef<ScrollView>(null);

    const [activeButton, setActiveButton] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const onRefresh = async () => {
        try {
            setRefreshing(true);
            refreshFunc();
            setRefreshing(false);
        } catch (error) {
            setRefreshing(false);
            console.log(error);
        }
    };

    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        // if(Platform.OS === "android"){
        //     if(event.nativeEvent.contentOffset.y >= 300){
        //         setActiveButton(true);
        //     } else {
        //         setActiveButton(false);
        //     }
        // }
    };

    const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        scrollEndFunc && scrollEndFunc(event);
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
        if (removeable.scrollToTop) {
            handleScrollToTop(true);
        }
    }, [removeable.scrollToTop]);

    return (
        <View style={{ flex: 1 }}>
            <ScrollView
                ref={scrollRef}
                scrollEventThrottle={16}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ flexGrow: 1 }}
                onScroll={(event: NativeSyntheticEvent<NativeScrollEvent>) => onScrollEnd(event)}
                // onScroll={(event:NativeSyntheticEvent<NativeScrollEvent>) => onScroll(event)}
                refreshControl={
                    <RefreshControl
                        tintColor={WhiteColor}
                        style={{ backgroundColor: background }}
                        refreshing={refreshing}
                        enabled={true}
                        onRefresh={onRefresh}
                    />
                }
            >
                <View style={{ flex: 1, position: 'relative', paddingBottom: toTopButton ? 40 : 0 }}>{children}</View>
            </ScrollView>
            {toTopButton && (
                <Animated.View style={[styles.buttonBox, { transform: [{ scale: fadeAnim }] }]}>
                    <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => handleScrollToTop(true)}>
                        <ScrollToTop size={40} color={TextCatTitleColor} />
                    </TouchableOpacity>
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    buttonBox: {
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        left: '50%',
        marginLeft: -20
    }
});

export default RefreshScrollView;
