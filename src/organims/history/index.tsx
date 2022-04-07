import React, { useCallback, useState } from "react";
import { Linking, NativeScrollEvent, NativeSyntheticEvent, Platform, StyleSheet, View } from "react-native";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { CommonActions } from "@/redux/actions";
import { useHistoryData } from "@/hooks/wallet/hooks";
import { BgColor } from "@/constants/theme";
import Container from "@/components/parts/containers/conatainer";
import ViewContainer from "@/components/parts/containers/viewContainer";
import RefreshScrollView from "@/components/parts/refreshScrollView";
import HistoryList from "./historyList";
import { GUIDE_URI } from "@/../config";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.History>;

const History = () => {
    const navigation:ScreenNavgationProps = useNavigation();

    const { historyList, handleHisotyPolling } = useHistoryData();

    const [pagination, setPagination] = useState(10);

    const onScrollEnd = (event:NativeSyntheticEvent<NativeScrollEvent>) => {
        if((event.nativeEvent.contentOffset.y + 50) >= event.nativeEvent.contentSize.height - event.nativeEvent.layoutMeasurement.height) 
        setPagination(pagination => pagination + 5);
    }

    const refreshStates = async() => {
        if(handleHisotyPolling !== undefined){
            CommonActions.handleLoadingProgress(true);
            await handleHisotyPolling();
            CommonActions.handleLoadingProgress(false);
        }
    }

    const handleMoveToWeb = (uri:string) => {
        if(uri === "history"){
            Linking.openURL(GUIDE_URI[uri]);
        } else {
            navigation.navigate(Screens.WebScreen, {uri: uri});
        }
    }

    const handleBack = () => {
        navigation.goBack();
    }

    useFocusEffect(
        useCallback(() => {
            refreshStates();
        }, [])
    )

    return (
        <Container
            title="History"
            handleGuide={()=>handleMoveToWeb("history")}
            backEvent={handleBack}>
            <View style={[styles.listBox, {justifyContent: historyList.list.length > 0? "space-between":"center"}]}>
                <RefreshScrollView
                    scrollEndFunc={onScrollEnd}
                    refreshFunc={refreshStates}>
                    <HistoryList historyList={historyList} pagination={pagination} handleExplorer={handleMoveToWeb} />
                </RefreshScrollView>
            </View>
        </Container>
    )
}

const styles = StyleSheet.create({
    listBox: {
        flex: 1,
        backgroundColor: BgColor,
    }
})

export default History;