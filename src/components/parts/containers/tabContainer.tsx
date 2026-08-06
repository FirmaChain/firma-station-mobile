import React, { ReactNode } from 'react';
import HistoryIcon from '@/assets/icons/material/history.svg';
import { BgColor, GrayColor, Lato, TextColor, WhiteColor } from '@/constants/theme';
import { ModalActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { QRCodeScannerIcon, QuestionFilledCircle, Setting } from '@/components/icon/icon';

import NetworkBadge from '../networkBadge';

interface IProps {
    title: string;
    settingNavEvent: () => void;
    historyNavEvent: () => void;
    handleGuide?: () => void;
    children: ReactNode;
}

const TabContainer = ({ title, settingNavEvent, historyNavEvent, handleGuide, children }: IProps) => {
    const { network } = useAppSelector((state) => state.storage);

    const handleQRScanner = async (active: boolean) => {
        ModalActions.handleQRScannerModal(active);
        if (active === false) {
            ModalActions.handleResetModal();
        }
    };

    const handleMoveToSetting = () => {
        if (settingNavEvent) settingNavEvent();
    };

    const handleMoveToHistory = () => {
        if (historyNavEvent) historyNavEvent();
    };

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <View style={[styles.boxH, styles.inlineStyle1]}>
                    <Text style={[styles.title, styles.inlineStyle2]}>{title}</Text>
                    {handleGuide && (
                        <TouchableOpacity style={styles.guide} onPress={() => handleGuide()}>
                            <QuestionFilledCircle size={18} color={GrayColor} />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={[styles.boxH, styles.inlineStyle3]}>
                    <TouchableOpacity hitSlop={{ top: 5, bottom: 5, left: 10, right: 10 }} onPress={() => handleQRScanner(true)}>
                        <QRCodeScannerIcon size={30} color={WhiteColor} />
                    </TouchableOpacity>

                    <TouchableOpacity hitSlop={{ top: 5, bottom: 5, left: 10, right: 10 }} onPress={() => handleMoveToHistory()}>
                        <HistoryIcon width={30} height={30} color={WhiteColor} />
                    </TouchableOpacity>

                    <TouchableOpacity hitSlop={{ top: 5, bottom: 5, left: 10, right: 10 }} onPress={() => handleMoveToSetting()}>
                        <Setting size={30} color={WhiteColor} />
                    </TouchableOpacity>
                </View>
                {network !== 'MainNet' && <NetworkBadge top={-20} title={network} />}
            </View>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    inlineStyle1: { paddingLeft: 10 },
    inlineStyle2: { paddingLeft: 10 },
    inlineStyle3: { justifyContent: 'flex-end', gap: 25, paddingRight: 20 },
    container: {
        flex: 1,
        backgroundColor: BgColor
    },
    boxH: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    titleContainer: {
        width: '100%',
        height: 50,
        backgroundColor: BgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    title: {
        fontFamily: Lato,
        fontSize: 28,
        fontWeight: '700',
        color: TextColor
    },
    guide: {
        paddingLeft: 5,
        paddingRight: 10,
        paddingVertical: 10,
        marginTop: 3
    }
});

export default TabContainer;
