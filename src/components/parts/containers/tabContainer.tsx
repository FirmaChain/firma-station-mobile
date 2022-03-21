import React, { useEffect, useState } from "react";
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { useAppSelector } from "@/redux/hooks";
import { CommonActions } from "@/redux/actions";
import { BgColor, FailedColor, Lato, TextButtonColor, TextColor, WhiteColor } from "@/constants/theme";
import { ICON_HISTORY } from "@/constants/images";
import { Setting } from "@/components/icon/icon";
import { setFirmaSDK } from "@/util/firma";
import { setClient } from "@/apollo";
import { setExplorerUrl } from "@/constants/common";
import TextButton from "@/components/button/textButton";
import CustomModal from "@/components/modal/customModal";
import ModalItems from "@/components/modal/modalItems";

interface Props {
    title: string;
    settingNavEvent: Function;
    historyNavEvent: Function;
    children: JSX.Element;
}

const TabContainer = ({title, settingNavEvent, historyNavEvent, children}:Props) => {
    const {common} = useAppSelector(state => state);
    const networkList = ["MainNet", "TestNet"];
    const [selectedNetworkIndex, setSelectedNetworkIndex] = useState(0);
    const [openNetworkSelectModal, setOpenNetworkSelectModal] = useState(false);
    
    const handleMoveToSetting = () => {
        settingNavEvent && settingNavEvent();
    }

    const handleMoveToHistory = () => {
        historyNavEvent && historyNavEvent();
    }

    const handleNetworkSelectModal = (open: boolean) => {
        setOpenNetworkSelectModal(open);
    }

    const handleSelectNetwork = (index:number) => {
        if(index === selectedNetworkIndex) return setOpenNetworkSelectModal(false);
        CommonActions.handleIsNetworkChange(true);
        CommonActions.handleLoadingProgress(true);
        setFirmaSDK(networkList[index]);
        setClient(networkList[index]);
        setExplorerUrl(networkList[index]);
        CommonActions.handleNetwork(networkList[index]);
        setSelectedNetworkIndex(index);
        setOpenNetworkSelectModal(false);
    }

    useEffect(() => {
        for(var i=0; i<networkList.length; i++){
            if(common.network === networkList[i])setSelectedNetworkIndex(i);
        }
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>

                <View style={styles.boxH}>
                    <TextButton
                        title={common.network}
                        bgColor={common.network === "MainNet"? TextButtonColor:FailedColor}
                        onPressEvent={() => handleNetworkSelectModal(true)}/>
                    <TouchableOpacity style={{padding: 10}} onPress={() => handleMoveToHistory()}>
                        <Image style={{width: 30, height: 30, resizeMode: "contain"}} source={ICON_HISTORY} />
                    </TouchableOpacity>

                    <TouchableOpacity style={{padding: 10}} onPress={() => handleMoveToSetting()}>
                        <Setting size={30} color={WhiteColor} />
                    </TouchableOpacity>

                    <CustomModal visible={openNetworkSelectModal} handleOpen={handleNetworkSelectModal}>
                        <ModalItems initVal={selectedNetworkIndex} data={networkList} onPressEvent={handleSelectNetwork}/>
                    </CustomModal>
                </View>
            </View>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.select({android: 0, ios: getStatusBarHeight()}),
        backgroundColor: BgColor,
    },
    boxH: {
        flexDirection: "row",
        alignItems: "center",
    },
    titleContainer: {
        height: 50,
        backgroundColor: BgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: 15,
        paddingHorizontal: 20,
    },
    title: {
        fontFamily: Lato,
        fontSize: 28,
        fontWeight: 'bold',
        color: TextColor,
    }
})

export default TabContainer;