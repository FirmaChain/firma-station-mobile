import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BarCodeReadEvent } from 'react-native-camera';
import { CommonActions, ModalActions } from '@/redux/actions';
import { ScreenHeight, ScreenWidth } from '@/util/getScreenSize';
import { QRCODE_SCANNER_MODAL_TEXT } from '@/constants/common';
import { BlackColor, Lato, TextCatTitleColor, WhiteColor } from '@/constants/theme';
import { FailFilledCircle } from '../icon/icon';
import { checkCameraPermission } from '@/util/permission';
// import { wait } from '@/util/common';
import QRCodeScanner from 'react-native-qrcode-scanner';
import CustomToast from '../toast/customToast';

const QRCodeScannerModal = () => {
    const [visible, setVisible] = useState(false);

    const handleCameraPermission = async () => {
        let permissionGranted = await checkCameraPermission();
        setVisible(permissionGranted);
        // wait(1000).then(() => handleReaderTest());
    };

    // const handleReaderTest = () => {
    //     ModalActions.handleModalData({ result: 'sign://d3663139-2a36-4c69-bfd7-6038252db235' });
    //     closeModal();
    // };

    useEffect(() => {
        handleCameraPermission();
    }, []);

    const handleReader = (event: BarCodeReadEvent) => {
        CommonActions.handleLoadingProgress(true);
        ModalActions.handleModalData({ result: event.data });
        closeModal();
    };

    const closeModal = () => {
        ModalActions.handleQRScannerModal(false);
    };

    return (
        <Modal animationType="fade" transparent={true} onRequestClose={closeModal} visible={visible}>
            <View style={styles.container}>
                <QRCodeScanner
                    reactivate={true}
                    showMarker={true}
                    onRead={handleReader}
                    cameraStyle={{ height: ScreenHeight() }}
                    customMarker={
                        <View style={styles.rectangleContainer}>
                            <View style={styles.topOverlay}>
                                <View style={{ width: '100%', paddingVertical: 40, paddingHorizontal: 20, alignItems: 'flex-start' }}>
                                    <TouchableOpacity style={{ width: 30, height: 30, borderRadius: 50 }} onPress={() => closeModal()}>
                                        <View
                                            style={{
                                                width: 20,
                                                height: 20,
                                                position: 'absolute',
                                                top: 5,
                                                left: 5,
                                                backgroundColor: WhiteColor
                                            }}
                                        />
                                        <FailFilledCircle size={30} color={BlackColor} />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.titleWrapper}>
                                    <Text style={styles.title}>{QRCODE_SCANNER_MODAL_TEXT}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={styles.leftAndRightOverlay} />
                                <View style={styles.rectangle}>
                                    <View
                                        style={{
                                            width: 20,
                                            height: 20,
                                            position: 'absolute',
                                            top: -4,
                                            left: -4,
                                            borderTopWidth: 4,
                                            borderLeftWidth: 4,
                                            borderTopColor: WhiteColor,
                                            borderLeftColor: WhiteColor
                                        }}
                                    />

                                    <View
                                        style={{
                                            width: 20,
                                            height: 20,
                                            position: 'absolute',
                                            top: -4,
                                            right: -4,
                                            borderTopWidth: 4,
                                            borderRightWidth: 4,
                                            borderTopColor: WhiteColor,
                                            borderRightColor: WhiteColor
                                        }}
                                    />

                                    <View
                                        style={{
                                            width: 20,
                                            height: 20,
                                            position: 'absolute',
                                            bottom: -4,
                                            left: -4,
                                            borderBottomWidth: 4,
                                            borderLeftWidth: 4,
                                            borderBottomColor: WhiteColor,
                                            borderLeftColor: WhiteColor
                                        }}
                                    />

                                    <View
                                        style={{
                                            width: 20,
                                            height: 20,
                                            position: 'absolute',
                                            bottom: -4,
                                            right: -4,
                                            borderBottomWidth: 4,
                                            borderRightWidth: 4,
                                            borderBottomColor: WhiteColor,
                                            borderRightColor: WhiteColor
                                        }}
                                    />
                                </View>
                                <View style={styles.leftAndRightOverlay} />
                            </View>
                            <View style={styles.bottomOverlay} />
                            <CustomToast />
                        </View>
                    }
                />
            </View>
        </Modal>
    );
};

export default QRCodeScannerModal;

// const overlayColor = 'rgba(255,255,255,0.5)';
const overlayColor = 'rgba(0,0,0,0.5)';

const rectDimensions = ScreenWidth() * 0.65;
const rectBorderWidth = ScreenWidth() * 0.005;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: overlayColor,
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleWrapper: {
        borderRadius: 18,
        paddingVertical: 8,
        paddingHorizontal: 20,
        backgroundColor: BlackColor + '80'
    },
    title: {
        fontFamily: Lato,
        fontSize: 18,
        textAlign: 'center',
        color: TextCatTitleColor
    },
    rectangleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },

    rectangle: {
        height: rectDimensions,
        width: rectDimensions,
        borderWidth: 4,
        borderColor: overlayColor,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },

    topOverlay: {
        flex: 1,
        height: ScreenWidth(),
        width: ScreenWidth(),
        backgroundColor: overlayColor,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 30
    },

    bottomOverlay: {
        flex: 1,
        height: ScreenWidth(),
        width: ScreenWidth(),
        backgroundColor: overlayColor,
        paddingBottom: ScreenWidth() * 0.1
    },

    leftAndRightOverlay: {
        flex: 1,
        backgroundColor: overlayColor
    }
});
