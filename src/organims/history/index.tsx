import React, { useCallback, useEffect, useState } from "react";
import { Linking, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View } from "react-native";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { CommonActions } from "@/redux/actions";
import { useAppSelector } from "@/redux/hooks";
import { HistoryState, useHistoryData } from "@/hooks/wallet/hooks";
import { BgColor } from "@/constants/theme";
import { wait } from "@/util/common";
import { GUIDE_URI } from "@/../config";
import Container from "@/components/parts/containers/conatainer";
import RefreshScrollView from "@/components/parts/refreshScrollView";
import HistoryList from "./historyList";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.History>;

const History = () => {
    const {common} = useAppSelector(state => state);
    const navigation:ScreenNavgationProps = useNavigation();
    
    const { historyList, handleHistoryOffset, handleHisotyPolling } = useHistoryData();
    const [historyRefresh, setHistoryRefresh] = useState(false);
    const [loadedHistoryList, setLoadedHistoryList] = useState<Array<HistoryState>>([]);

    const onScrollEnd = (event:NativeSyntheticEvent<NativeScrollEvent>) => {
        if(common.loading === false && historyRefresh === false){
            if(event.nativeEvent.contentOffset.y > 0 
                && ((event.nativeEvent.contentOffset.y + 50) >= event.nativeEvent.contentSize.height - event.nativeEvent.layoutMeasurement.height)){
                CommonActions.handleLoadingProgress(true);
                historyOffsetHandler(false);
            }
        }
    }

    const historyOffsetHandler = (reset:boolean) => {
        handleHistoryOffset && handleHistoryOffset(reset);
    }

    const refreshStates = () => {
        if(handleHisotyPolling !== undefined){
            setHistoryRefresh(true);
            CommonActions.handleLoadingProgress(true);
            handleHisotyPolling();
            wait(800).then(()=>{
                CommonActions.handleLoadingProgress(false);
                setHistoryRefresh(false);
            });
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

    useEffect(() => {
        if(historyList !== undefined){
            if(historyRefresh){
                setLoadedHistoryList(historyList.list);
            } else {
                setLoadedHistoryList(loadedHistoryList.concat(historyList.list));
            }
        }
    }, [historyList])

    useEffect(() => {
        if(loadedHistoryList.length > 0){
            wait(100).then(()=>CommonActions.handleLoadingProgress(false))
        }
    }, [loadedHistoryList])

    useFocusEffect(
        useCallback(() => {
            CommonActions.handleLoadingProgress(true);
            wait(800).then(()=>CommonActions.handleLoadingProgress(false));
        }, [])
    )

    return (
        <Container
            title="History"
            handleGuide={()=>handleMoveToWeb("history")}
            backEvent={handleBack}>
            <View style={[styles.listBox, {justifyContent: historyList.list.length > 0? "space-between":"center"}]}>
                <RefreshScrollView
                    toTopButton={true}
                    scrollEndFunc={onScrollEnd}
                    refreshFunc={refreshStates}>
                    <HistoryList historyList={loadedHistoryList} isEmpty={loadedHistoryList.length === 0} handleExplorer={handleMoveToWeb} />
                </RefreshScrollView>
            </View>
        </Container>
    )
}

const styles = StyleSheet.create({
    listBox: {
        flex: 1,
        backgroundColor: BgColor,
    },
})

export default History;