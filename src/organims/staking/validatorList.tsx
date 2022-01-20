import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { BoxColor, DisableColor, GrayColor, Lato, PointLightColor, TextCatTitleColor, TextColor, TextDarkGrayColor, TextDisableColor, TextGrayColor } from "../../constants/theme";
import CustomModal from "../../components/modal/customModal";
import ModalItems from "../../components/modal/modalItems";
import { DownArrow } from "@/components/icon/icon";
import MonikerSection from "./parts/list/monikerSection";
import DataSection from "./parts/list/dataSection";

interface Props {
    validators: Array<any>;
    navigateValidator: Function;
}

const ValidatorList = ({validators, navigateValidator}:Props) => {
    const sortItems = ['Voting Power', 'Commission', 'APY/APR'];
    const [selected, setSelected] = useState(0);
    const [openModal, setOpenModal] = useState(false);

    useMemo(() => {
        switch (selected) {
        case 0:
            return validators.sort((a, b) => (b.votingPower - a.votingPower));
        case 1:
            return validators.sort((a, b) => (b.commission - a.commission));
        case 2:
            return validators.sort((a, b) => (b.APR - a.APR));
        }
    }, [selected])

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
                    <Text style={{color: PointLightColor}}> 30</Text>
                </Text>
                <TouchableOpacity style={styles.sortButton} onPress={() => handleOpenModal(true)}>
                    <Text style={[styles.title, {paddingRight: 4}]}>{sortItems[selected]}</Text>
                    <DownArrow size={12} color={GrayColor} />
                </TouchableOpacity>
            </View>
            {validators.map((vd, index) => {
                return (
                    <TouchableOpacity key={index} onPress={() => navigateValidator(vd)}>
                        <View style={styles.item}>
                            <MonikerSection validator={vd} />
                            <DataSection title="Voting Power" data={vd.votingPowerPercent.toString() + '%'} />
                            <DataSection title="Commission" data={vd.commission.toString() + '%'} />
                            <DataSection 
                                title="APY/APR" 
                                data={(vd.APY * 100).toFixed(2).toString() + '% / ' + (vd.APR * 100).toFixed(2).toString() + '%'} />
                            <DataSection title="Uptime" data={vd.condition.toString() + '%'} />
                            <View style={{paddingBottom: 22}} />
                            {index < validators.length - 1 && <View style={styles.divider} />}
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
    },
    header: {
        height: 48,
        paddingHorizontal: 20,
        backgroundColor: BoxColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    item : {
        paddingTop: 22,
        backgroundColor: BoxColor,
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
        color: TextCatTitleColor,
        fontFamily: Lato,
        fontSize: 10,
        fontWeight: 'bold'
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