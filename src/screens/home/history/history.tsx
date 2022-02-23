import React, { useContext, useState } from "react";
import { Linking, Platform, StyleSheet, Text, View, TouchableOpacity, ScrollView, RefreshControl, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { BgColor, BoxColor, InputPlaceholderColor, Lato, TextCatTitleColor, WhiteColor } from "@/constants/theme";
import Container from "@/components/parts/containers/conatainer";
import ViewContainer from "@/components/parts/containers/viewContainer";
import { useHistoryData } from "@/hooks/wallet/hooks";
import { convertTime } from "@/util/common";
import { ForwardArrow } from "@/components/icon/icon";
import { useNavigation } from "@react-navigation/native";
import { AppContext } from "@/util/context";
import { EXPLORER } from "@/constants/common";
import RefreshScrollView from "@/components/parts/refreshScrollView";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.History>;

const HistoryScreen: React.FunctionComponent = () => {
    const navigation:ScreenNavgationProps = useNavigation();
    const { wallet } = useContext(AppContext);

    const { historyList, handleHisotyPolling } = useHistoryData(wallet.address);

    const [pagination, setPagination] = useState(10);

    const refreshStates = () => {
        handleHisotyPolling && handleHisotyPolling();
    }

    const onScrollEnd = (event:NativeSyntheticEvent<NativeScrollEvent>) => {
        if(Platform.OS === 'ios' && event.nativeEvent.targetContentOffset){
            if(event.nativeEvent.contentOffset.y > event.nativeEvent.targetContentOffset.y) 
            setPagination(pagination => pagination + 5);
        } else {
            if(event.nativeEvent.contentOffset.y >= event.nativeEvent.contentSize.height - event.nativeEvent.layoutMeasurement.height) 
            setPagination(pagination => pagination + 5);
        }
    }

    const moveToExplorer = (hash:string) => {
        Linking.openURL(EXPLORER + '/transactions/' + hash);
    }

    const handleBack = () => {
        navigation.goBack();
    }

    return (
        <Container
            title="History"
            backEvent={handleBack}>
            <ViewContainer bgColor={BgColor}>
                <RefreshScrollView
                    scrollEndFunc={onScrollEnd}
                    refreshFunc={refreshStates}>
                    <View style={styles.container}>
                            {historyList !== undefined && historyList.list.map((value:any, index) => {
                                if(index < pagination){
                                    return (
                                        <TouchableOpacity key={index} onPress={()=>moveToExplorer(value.hash)}>
                                            <View style={styles.box}>
                                                <View style={styles.wrapperH}>
                                                    <View style={{flex: 2}}>
                                                        <View style={[styles.wrapperH, {alignItems: "center", paddingBottom: 15}]}>
                                                            <Text style={[styles.contentTitle, {fontSize: 10, fontWeight: "normal"}]}>{convertTime(value.timestamp, false, true)}</Text>
                                                        </View>
                                                        <View style={[styles.wrapperH, styles.wrapper, {flex: 4, justifyContent: "flex-start", alignItems: "flex-start", paddingLeft: 10}]}>
                                                            <View style={[styles.historyWrapper, {flex: 1}]}>
                                                                <Text style={[styles.contentTitle, {fontSize: 14}]}>Block</Text>
                                                                <Text style={[styles.contentItem, {fontSize: 14}]}>{value.block}</Text>
                                                            </View>
                                                            <View style={[styles.historyWrapper, {flex: 2, paddingHorizontal: 10}]}>
                                                                <Text style={[styles.contentTitle, {fontSize: 14}]}>Type</Text>
                                                                <Text style={[styles.contentItem, {fontSize: 14}]}>{value.type}</Text>
                                                            </View>
                                                            <View style={[styles.historyWrapper, {flex: 1}]}>
                                                                <Text style={[styles.contentTitle, {fontSize: 14}]}>Result</Text>
                                                                <Text style={[styles.contentItem, {fontSize: 14}]}>{value.success}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    <View style={{justifyContent: "center"}}>
                                                            <ForwardArrow size={20} color={TextCatTitleColor}/>
                                                    </View>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }
                            })}
                    </View>
                </RefreshScrollView>
            </ViewContainer>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:"space-between",
        margin: 20,
    },
    historyWrapper: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "flex-start"
    },
    box: {
        justifyContent: "center",
        borderRadius: 8,
        backgroundColor: BoxColor,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    wrapperH: {
        flexDirection: "row",
    },
    wrapper: {
        paddingBottom: 5,
    },
    title: {
        fontFamily: Lato,
        fontSize: 20,
        fontWeight: "bold",
        color: TextCatTitleColor,
    },
    contentItem: {
        fontFamily: Lato,
        fontSize: 14,
        fontWeight: "normal",
        color: TextCatTitleColor,
        paddingTop: 6,
    },
    contentTitle: {
        fontFamily: Lato,
        fontSize: 14,
        fontWeight: "bold",
        color: InputPlaceholderColor,
    },
})

export default HistoryScreen;