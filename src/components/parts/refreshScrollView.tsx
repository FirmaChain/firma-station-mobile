import React, { useCallback, useRef, useState } from "react";
import { NativeSyntheticEvent, NativeScrollEvent, View, StyleSheet, Animated, TouchableOpacity, RefreshControl, ScrollView, Platform } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { TextCatTitleColor, WhiteColor } from "@/constants/theme";
import { ScrollToTop } from "../icon/icon";
import { fadeIn, fadeOut } from "@/util/animation";
import { useEffect } from "react";

interface Props {
    scrollEndFunc?: Function;
    refreshFunc: Function;
    background?: string;
    toTopButton?: boolean;
    children: JSX.Element;
}

const RefreshScrollView = ({scrollEndFunc, refreshFunc, background = "transparent", toTopButton = false, children}:Props) => {
    const [refreshing, setRefreshing] = useState(false);
    const scrollRef = useRef<ScrollView>(null);
    
    const [activeButton, setActiveButton] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const onRefresh = async() => {
        setRefreshing(true);
        refreshFunc && await refreshFunc();
        setRefreshing(false)
    }

    const onScroll = (event:NativeSyntheticEvent<NativeScrollEvent>) => {
        // if(Platform.OS === "android"){
        //     if(event.nativeEvent.contentOffset.y >= 300){
        //         setActiveButton(true);
        //     } else {
        //         setActiveButton(false);
        //     }
        // }
    }

    const onScrollEnd = (event:NativeSyntheticEvent<NativeScrollEvent>) => {
        scrollEndFunc && scrollEndFunc(event);
    }

    const handleScrollToTop = (animated:boolean) => {
        scrollRef.current?.scrollTo({ y: 0, animated: animated});
    }

    useEffect(() => {
        if(activeButton){
            fadeIn(Animated, fadeAnim, 300);
        } else {
            fadeOut(Animated, fadeAnim, 300);
        }
    }, [activeButton])

    useFocusEffect(
        useCallback(() => {
            handleScrollToTop(false);
            return () => {
            }
        },[])
    )

    return (
        <View style={{flex: 1}}>
            <ScrollView
                ref={scrollRef}
                scrollEventThrottle={16}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{flexGrow: 1}}
                onMomentumScrollEnd={(event:NativeSyntheticEvent<NativeScrollEvent>) => onScrollEnd(event)}
                onScroll={(event:NativeSyntheticEvent<NativeScrollEvent>) => onScroll(event)}
                refreshControl={
                    <RefreshControl 
                        tintColor={WhiteColor}
                        style={{backgroundColor: background}}
                        refreshing={refreshing}
                        enabled={true}
                        onRefresh={onRefresh}
                    />
                }>
                <View style={{flex: 1, position: "relative", paddingBottom: toTopButton? 40:0}}>
                    {children}
                </View>
            </ScrollView>
            {toTopButton &&
                <Animated.View style={[styles.buttonBox, {transform: [{scale: fadeAnim}]}]}>
                    <TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} onPress={()=>handleScrollToTop(true)}>
                        <ScrollToTop size={40} color={TextCatTitleColor} />
                    </TouchableOpacity>
                </Animated.View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    buttonBox: {
        alignItems: "center",
        position: "absolute",
        bottom: 20,
        left: "50%",
        marginLeft: -20,
    }
})

export default RefreshScrollView;