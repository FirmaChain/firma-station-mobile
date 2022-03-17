import React, { useCallback, useState } from "react";
import { NativeScrollEvent, NativeSyntheticEvent, Platform } from "react-native";
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

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.History>;

const History = () => {
    const navigation:ScreenNavgationProps = useNavigation();

    const { historyList, handleHisotyPolling } = useHistoryData();

    const [pagination, setPagination] = useState(10);

    const onScrollEnd = (event:NativeSyntheticEvent<NativeScrollEvent>) => {
        if(Platform.OS === 'ios'){
            if(event.nativeEvent.targetContentOffset){
                if(event.nativeEvent.contentOffset.y > event.nativeEvent.targetContentOffset.y) 
                setPagination(pagination => pagination + 5);
            }
        } else {
            if((event.nativeEvent.contentOffset.y + 50) >= event.nativeEvent.contentSize.height - event.nativeEvent.layoutMeasurement.height) 
            setPagination(pagination => pagination + 5);
        }
    }

    const refreshStates = async() => {
        if(handleHisotyPolling !== undefined){
            CommonActions.handleLoadingProgress(true);
            await handleHisotyPolling();
            CommonActions.handleLoadingProgress(false);
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
            backEvent={handleBack}>
            <ViewContainer bgColor={BgColor}>
                <RefreshScrollView
                    scrollEndFunc={onScrollEnd}
                    refreshFunc={refreshStates}>
                    <HistoryList historyList={historyList} pagination={pagination} />
                </RefreshScrollView>
            </ViewContainer>
        </Container>
    )
}

export default History;