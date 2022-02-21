import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { BgColor, BoxColor, DisableColor, GrayColor, Lato, PointLightColor, TextCatTitleColor, TextColor, TextDarkGrayColor, TextDisableColor, TextGrayColor } from "../../constants/theme";
import CustomModal from "../../components/modal/customModal";
import ModalItems from "../../components/modal/modalItems";
import { DownArrow } from "@/components/icon/icon";
import MonikerSection from "./parts/list/monikerSection";
import DataSection from "./parts/list/dataSection";
import { convertPercentage } from "@/util/common";

interface Props {
    validators: Array<any>;
    navigateValidator: Function;
}

const ValidatorList = ({validators, navigateValidator}:Props) => {
    const sortItems = ['Commision', 'Voting Power', 'Uptime'];
    const [selected, setSelected] = useState(0);
    const [openModal, setOpenModal] = useState(false);

    useMemo(() => {
        switch (selected) {
        case 0:
            return validators.sort((a, b) => (a.commission - b.commission));
        case 1:
            return validators.sort((a, b) => (b.votingPower - a.votingPower));
        case 2:
            return validators.sort((a, b) => (b.condition - a.condition));
        }
    }, [selected, validators])

    const handleOpenModal = (open:boolean) => {
        setOpenModal(open);
    }

    const handleSelectSort = (index:number) => {
        setSelected(index);
        handleOpenModal(false);
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>List 
                    <Text style={{color: PointLightColor}}> {validators.length}</Text>
                </Text>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <TouchableOpacity style={styles.sortButton} onPress={() => handleOpenModal(true)}>
                        <Text style={[styles.sortItem, {paddingRight: 4}]}>{sortItems[selected]}</Text>
                        <DownArrow size={12} color={GrayColor} />
                    </TouchableOpacity>
                </View>
            </View>
            {validators.map((vd, index) => {
                return (
                    <TouchableOpacity key={index} onPress={() => navigateValidator(vd.validatorAddress)}>
                        <View style={styles.item}>
                            <MonikerSection validator={{avatarURL: vd.validatorAvatar, moniker: vd.validatorMoniker}} />
                            <DataSection title="Voting Power" data={vd.votingPowerPercent.toString() + '%'} />
                            <DataSection title="Commission" data={vd.commission.toString() + '%'} />
                            <DataSection 
                                title="APY/APR" 
                                data={convertPercentage(vd.APY) + '% / ' + convertPercentage(vd.APR) + '%'} />
                            <DataSection title="Uptime" data={vd.condition.toString() + '%'} />
                            <View style={{paddingBottom: 22}} />
                        </View>
                    </TouchableOpacity>
                )
            })}
            <CustomModal visible={openModal} handleOpen={handleOpenModal}>
                <ModalItems initVal={selected} data={sortItems} onPressEvent={handleSelectSort}/>
            </CustomModal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 4,
        overflow: "hidden",
        justifyContent: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: BoxColor,
    },
    header: {
        height: 48,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        marginBottom: 5,
        backgroundColor: BgColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    item : {
        paddingTop: 22,
        backgroundColor: BgColor,
        marginVertical: 5,
        borderRadius: 8,
    },
    title: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextGrayColor,
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sortItem: {
        color: GrayColor,
        fontFamily: Lato,
        fontSize: 16,
    },

    moniikerWrapperH: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    vdWrapperH: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    descWrapperH: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 5,
    },
    vdWrapperV: {
        flex: 1,
        alignItems: 'flex-start',
    },
    avatar: {
        width: 35,
        maxWidth: 35,
        height: 35,
        borderRadius: 50,
        overflow: 'hidden',
        marginRight: 10,
    },
    icon: {
        marginRight: 10,
    },
    moniker: {
        fontSize: 16,
        paddingBottom: 5,
        fontFamily: Lato,
        color: TextColor,
    },
    divider: {
        height: 1,
        marginHorizontal: 20,
        backgroundColor: DisableColor,
    },
    descTitle: {
        fontFamily: Lato,
        fontSize: 14,
        color: TextDisableColor,
    },
    descItem: {
        fontFamily: Lato,
        fontSize: 14,
        fontWeight: "600",
        color: TextDarkGrayColor,
    },
})

export default ValidatorList;