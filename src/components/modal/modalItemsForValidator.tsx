import React, { useState } from 'react';
import { BgColor, BoxColor, BoxDarkColor, Lato, TextCatTitleColor, TextColor, TextWarnColor, WhiteColor } from '@/constants/theme';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { IStakeInfo } from '@/hooks/staking/hooks';

import { ExclamationCircle, Radio } from '../icon/icon';
import ValidatorProfile from '../parts/validatorProfile';

interface IProps {
    title: string;
    initVal: string;
    data: Array<IStakeInfo>;
    myAddress: string;
    onPressEvent: (address: string) => void;
}

const ModalItemsForValidator = ({ title, initVal, data, myAddress, onPressEvent }: IProps) => {
    const [selected, setSelected] = useState(initVal);

    const handleSelect = (address: string) => {
        if (myAddress === address) return;
        onPressEvent(address);
        setSelected(address);
    };

    const inlineStyles1 = {
        inlineStyle1: { marginBottom: data.length > 0 ? 20 : 10 }
    } as const;

    return (
        <View style={[styles.modalContainer, inlineStyles1.inlineStyle1]}>
            <View style={styles.headerBox}>
                <Text style={styles.headerTitle}>{title}</Text>
            </View>
            <ScrollView>
                <View>
                    {data.map((item, index) => {
                        const mine = myAddress === item.validatorAddress;
                        const inlineStyles2 = {
                            inlineStyle1: { display: mine ? 'flex' : 'none' }
                        } as const;

                        return (
                            <View key={index} style={styles.modalContentBox}>
                                <Pressable onPress={() => handleSelect(item.validatorAddress)}>
                                    <View style={[styles.modalPressBox, mine && styles.inlineStyle1]}>
                                        <ValidatorProfile uri={item.avatarURL} size={32} customStyle={styles.inlineStyle2} />
                                        <Text style={styles.moniker}>{item.moniker}</Text>
                                        <Radio size={20} color={WhiteColor} active={item.validatorAddress === selected} />
                                    </View>
                                    <View style={[styles.noticeBox, inlineStyles2.inlineStyle1]}>
                                        <ExclamationCircle size={15} color={TextWarnColor} />
                                        <Text style={styles.notice}>Not allowed to same validator</Text>
                                    </View>
                                </Pressable>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    inlineStyle1: { opacity: 0.15 },
    inlineStyle2: { marginRight: 10 },
    modalContainer: {
        width: '100%',
        maxHeight: 500,
        backgroundColor: BoxDarkColor
    },
    headerBox: {
        paddingHorizontal: 10,
        paddingVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: BoxColor
    },
    headerTitle: {
        fontFamily: Lato,
        fontSize: 18,
        color: TextCatTitleColor,
        paddingHorizontal: 10
    },
    modalContentBox: {
        position: 'relative',
        backgroundColor: BgColor,
        marginBottom: 1
    },
    modalPressBox: {
        width: '100%',
        paddingVertical: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 1
    },
    moniker: {
        flex: 1,
        fontFamily: Lato,
        fontSize: 16,
        fontWeight: '600',
        color: TextColor
    },
    noticeBox: {
        width: '100%',
        position: 'absolute',
        paddingVertical: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    notice: {
        fontFamily: Lato,
        fontSize: 16,
        lineHeight: 32,
        textAlign: 'center',
        color: TextWarnColor,
        paddingLeft: 5
    }
});

export default ModalItemsForValidator;
