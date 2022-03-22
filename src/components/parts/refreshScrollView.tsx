import React, { useCallback, useRef, useState } from "react";
import { RefreshControl, ScrollView, NativeSyntheticEvent, NativeScrollEvent, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { WhiteColor } from "@/constants/theme";
import { wait } from "@/util/common";

interface Props {
    scrollEndFunc?: Function;
    refreshFunc: Function;
    background?: string;
    children: JSX.Element;
}

const RefreshScrollView = ({scrollEndFunc, refreshFunc, background = "transparent", children}:Props) => {
    const [refreshing, setRefreshing] = useState(false);
    const scrollRef = useRef<ScrollView|null>(null);

    const onRefresh = () => {
        setRefreshing(true);
        refreshFunc && refreshFunc();
        wait(1500).then(() => {
            setRefreshing(false)
        });
    }

    useFocusEffect(
        useCallback(() => {
            scrollRef.current?.scrollTo({ y: 0, animated: false});
            return () => {
            }
        },[])
    )

    return (
        <ScrollView
            ref={scrollRef}
            keyboardShouldPersistTaps="handled"
            onScrollEndDrag={(event:NativeSyntheticEvent<NativeScrollEvent>) => scrollEndFunc && scrollEndFunc(event)}
            refreshControl={
                <RefreshControl 
                    tintColor={WhiteColor}
                    style={{backgroundColor: background}}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }>
            <View style={{flex: 1}}>
                {children}
            </View>
        </ScrollView>
    )
}

export default RefreshScrollView;