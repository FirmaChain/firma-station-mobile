import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from "react-native";
import { BgColor, BoxColor, ContainerColor, Lato, TextCatTitleColor, TextColor, TextGrayColor } from "../../constants/theme";
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomModal from "../../components/modal/customModal";
import ModalItems from "../../components/modal/modalItems";

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
                <Text style={styles.title}>Validators</Text>
                <TouchableOpacity style={styles.sortButton} onPress={() => handleOpenModal(true)}>
                    <Text style={styles.sortItem}>{sortItems[selected].toUpperCase()}</Text>
                    <Icon name="swap-vert" size={20} color={TextCatTitleColor}/>
                </TouchableOpacity>
            </View>
            {validators.map((vd, index) => {
                return (
                    <TouchableOpacity key={index} style={styles.list} onPress={() => navigateValidator(vd)}>
                        <View style={[styles.vdWrapperH, {alignItems: "flex-start"}]}>
                            {vd.validatorAvatar?
                            <Image
                                style={styles.avatar}
                                source={{uri: vd.validatorAvatar}}/>
                            :
                            <Icon style={styles.icon} name="person" size={35} />
                            }
                            <View style={styles.vdWrapperV}>
                                <Text style={styles.moniker}>{vd.validatorMoniker}</Text>
                                <View style={styles.descWrapperH}>
                                    <Text style={styles.descTitle}>Voting power</Text>
                                    <Text style={styles.desc}>{vd.votingPowerPercent.toString() + '%'}</Text>
                                </View>
                                <View style={styles.descWrapperH}>
                                    <Text style={styles.descTitle}>Commission</Text>
                                    <Text style={styles.desc}>{vd.commission.toString() + '%'}</Text>
                                </View>
                                <View style={[styles.descWrapperH, {alignItems: "flex-start"}]}>
                                    <Text style={styles.descTitle}>APY/APR</Text>
                                    <View style={[styles.vdWrapperH, {justifyContent:"flex-end"}]}>
                                        <Text style={[styles.desc, {fontSize: 10, opacity: 0.8}]}>{(vd.APY * 100).toFixed(2).toString() + '%'}</Text>
                                        <Text style={{color: TextGrayColor, paddingHorizontal: 10}}>/</Text>
                                        <Text style={styles.desc}>{(vd.APR * 100).toFixed(2).toString() + '%'}</Text>
                                    </View>
                                </View>
                            </View>
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
        marginBottom: 20,
        marginHorizontal: 20,
        borderRadius: 4,
        overflow: "hidden",
        justifyContent: 'center',
    },
    header: {
        height: 50,
        paddingHorizontal: 20,
        borderBottomColor: BgColor,
        borderBottomWidth: 3,
        backgroundColor: BoxColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        color: TextCatTitleColor,
        fontFamily: Lato,
        fontWeight: 'bold'
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
    list: {
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: BoxColor,
        borderBottomWidth: 1,
        borderColor: BgColor,
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
    descTitle: {
        fontSize: 14,
        fontFamily: Lato,
        color: TextGrayColor,
    },
    desc: {
        fontSize: 14,
        fontFamily: Lato,
        color: TextColor,
        textAlign: 'right',
    },
})

export default ValidatorList;