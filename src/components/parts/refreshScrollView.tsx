import React, { useState } from "react";
import { RefreshControl, StyleSheet, ScrollView } from "react-native";

interface Props {
    refreshFunc?: Function;
    children: JSX.Element;
}

const wait = () => {
    return new Promise(resolve => setTimeout(resolve));
}

const RefreshScrollView = ({refreshFunc, children}:Props) => {

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        wait().then(() => {
            refreshFunc && refreshFunc();
            setRefreshing(false)
        });
    }

    return (
        <ScrollView
            contentContainerStyle={styles.refreshScrollView}
            refreshControl={
                <RefreshControl 
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }>
            {children}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    refreshScrollView :{
        flex: 1,
    }
})

export default RefreshScrollView;