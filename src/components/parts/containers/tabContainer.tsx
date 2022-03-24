import React, { useEffect, useState } from "react";
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { useAppSelector } from "@/redux/hooks";
import { CommonActions } from "@/redux/actions";
import { BgColor, FailedColor, GrayColor, Lato, TextButtonColor, TextColor, WhiteColor } from "@/constants/theme";
import { ICON_HISTORY } from "@/constants/images";
import { QuestionFilledCircle, Setting } from "@/components/icon/icon";
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
    handleGuide?: ()=>void;
    children: JSX.Element;
}

const TabContainer = ({title, settingNavEvent, historyNavEvent, handleGuide, children}:Props) => {
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
                <View style={styles.boxH}>
                    <Text style={[styles.title, {paddingLeft: 10}]}>{title}</Text>
                    {handleGuide &&
                    <TouchableOpacity style={styles.guide} onPress={()=>handleGuide()}>
                        <QuestionFilledCircle size={18} color={GrayColor}/>
                    </TouchableOpacity>
                    }
                </View>

                <View style={[styles.boxH, {justifyContent: "flex-end"}]}>
                    <TextButton
                        title={common.network}
                        bgColor={common.network === "MainNet"? TextButtonColor:FailedColor}
                        onPressEvent={() => handleNetworkSelectModal(true)}/>
                    <TouchableOpacity style={{paddingLeft: 10, paddingRight: 5}} onPress={() => handleMoveToHistory()}>
                        <Image style={{width: 30, height: 30, resizeMode: "contain"}} source={ICON_HISTORY} />
                    </TouchableOpacity>

                    <TouchableOpacity style={{paddingLeft: 5, paddingRight: 10}} onPress={() => handleMoveToSetting()}>
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
        width: "100%",
        height: 50,
        backgroundColor: BgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: 15,
        paddingHorizontal: 10,
    },
    title: {
        fontFamily: Lato,
        fontSize: 28,
        fontWeight: 'bold',
        color: TextColor,
    },
    guide: {
        paddingLeft: 5,
        paddingRight: 10,
        paddingVertical: 10,
        marginTop: 3,
    }
})

export default TabContainer;