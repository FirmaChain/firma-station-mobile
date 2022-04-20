import React, { useCallback, useRef, useState } from "react";
import { RefreshControl, ScrollView, NativeSyntheticEvent, NativeScrollEvent, View, Platform, StyleSheet, Animated, Pressable } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { TextCatTitleColor, WhiteColor } from "@/constants/theme";
import { wait } from "@/util/common";
import { ScrollToTop } from "../icon/icon";
import { fadeIn, fadeOut } from "@/util/animation";
import { useEffect } from "react";

interface Props {
    scrollEndFunc?: Function;
    refreshFunc: Function;
    background?: string;
    children: JSX.Element;
}

const RefreshScrollView = ({scrollEndFunc, refreshFunc, background = "transparent", children}:Props) => {
    const [refreshing, setRefreshing] = useState(false);
    const scrollRef = useRef<ScrollView|null>(null);
    
    // const [activeButton, setActiveButton] = useState(false);
    // const fadeAnim = useRef(new Animated.Value(0)).current;

    const onRefresh = () => {
        setRefreshing(true);
        refreshFunc && refreshFunc();
        wait(1500).then(() => {
            setRefreshing(false)
        });
    }

    const onScroll = (event:NativeSyntheticEvent<NativeScrollEvent>) => {
        scrollEndFunc && scrollEndFunc(event);
        // if(Platform.OS === "android"){
        //     if(event.nativeEvent.contentOffset.y >= 300){
        //         setActiveButton(true);
        //     } else {
        //         setActiveButton(false);
        //     }
        // }
    }

    const handleScrollToTop = (animated:boolean) => {
        scrollRef.current?.scrollTo({ y: 0, animated: animated});
    }

    // useEffect(() => {
    //     if(activeButton){
    //         fadeIn(fadeAnim);
    //     } else {
    //         fadeOut(fadeAnim);
    //     }
    // }, [activeButton])

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
                onScroll={(event:NativeSyntheticEvent<NativeScrollEvent>) => onScroll(event)}
                refreshControl={
                    <RefreshControl 
                        tintColor={WhiteColor}
                        style={{backgroundColor: background}}
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }>
                <View style={{flex: 1, position: "relative"}}>
                    {children}
                </View>
            </ScrollView>
            {/* <Animated.View style={[styles.buttonBox, {transform: [{scale: fadeAnim}]}]}>
                <Pressable style={{padding: 10}} onPress={()=>handleScrollToTop(true)}>
                    <View>
                        <ScrollToTop size={30} color={TextCatTitleColor} />
                    </View>
                </Pressable>
            </Animated.View> */}
        </View>
    )
}

const styles = StyleSheet.create({
    buttonBox: {
        alignItems: "center",
        position: "absolute",
        bottom: 0,
        left: "50%",
        marginLeft: -25,
    }
})

export default RefreshScrollView;