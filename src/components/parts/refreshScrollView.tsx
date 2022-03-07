import { WhiteColor } from "@/constants/theme";
import { wait } from "@/util/common";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useRef, useState } from "react";
import { RefreshControl, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from "react-native";

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
            onScrollEndDrag={(event:NativeSyntheticEvent<NativeScrollEvent>) => scrollEndFunc && scrollEndFunc(event)}
            refreshControl={
                <RefreshControl 
                    tintColor={WhiteColor}
                    style={{backgroundColor: background}}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }>
            {children}
        </ScrollView>
    )
}

export default RefreshScrollView;