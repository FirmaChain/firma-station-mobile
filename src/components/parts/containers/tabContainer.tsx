import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSelector } from '@/redux/hooks';
import { ModalActions } from '@/redux/actions';
import { QRCodeScannerIcon, QuestionFilledCircle, Setting } from '@/components/icon/icon';
import { ICON_HISTORY } from '@/constants/images';
import { BgColor, GrayColor, Lato, TextColor, WhiteColor } from '@/constants/theme';
import NetworkBadge from '../networkBadge';

interface IProps {
    title: string;
    settingNavEvent: Function;
    historyNavEvent: Function;
    handleGuide?: () => void;
    children: JSX.Element;
}

const TabContainer = ({ title, settingNavEvent, historyNavEvent, handleGuide, children }: IProps) => {
    const insets = useSafeAreaInsets();
    const { storage } = useAppSelector((state) => state);

    const handleQRScanner = async (active: boolean) => {
        ModalActions.handleQRScannerModal(active);
        if (active === false) {
            ModalActions.handleResetModal({});
        }
    };

    const handleMoveToSetting = () => {
        settingNavEvent && settingNavEvent();
    };

    const handleMoveToHistory = () => {
        historyNavEvent && historyNavEvent();
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.titleContainer}>
                <View style={[styles.boxH, { paddingLeft: 10 }]}>
                    <Text style={[styles.title, { paddingLeft: 10 }]}>{title}</Text>
                    {handleGuide && (
                        <TouchableOpacity style={styles.guide} onPress={() => handleGuide()}>
                            <QuestionFilledCircle size={18} color={GrayColor} />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={[styles.boxH, { justifyContent: 'flex-end', paddingRight: 20 }]}>
                    <TouchableOpacity hitSlop={{ top: 5, bottom: 5, left: 10, right: 10 }} onPress={() => handleQRScanner(true)}>
                        <QRCodeScannerIcon size={30} color={WhiteColor} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        hitSlop={{ top: 5, bottom: 5, left: 10, right: 10 }}
                        style={{ marginHorizontal: 25 }}
                        onPress={() => handleMoveToHistory()}
                    >
                        <Image style={{ width: 30, height: 30, resizeMode: 'contain' }} source={ICON_HISTORY} />
                    </TouchableOpacity>

                    <TouchableOpacity hitSlop={{ top: 5, bottom: 5, left: 10, right: 10 }} onPress={() => handleMoveToSetting()}>
                        <Setting size={30} color={WhiteColor} />
                    </TouchableOpacity>
                </View>
                {storage.network !== 'MainNet' && <NetworkBadge top={-20} title={storage.network} />}
            </View>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
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
        fontWeight: 'bold',
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
