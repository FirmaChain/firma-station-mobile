import React, { useEffect, useState } from 'react';
import { QRCODE_SCANNER_MODAL_TEXT } from '@/constants/common';
import { BlackColor, Lato, TextCatTitleColor, WhiteColor } from '@/constants/theme';
import { ModalActions } from '@/redux/actions';
import { ScreenHeight, ScreenWidth } from '@/util/getScreenSize';
import { Modal, PixelRatio, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { Camera, Code, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';

import { FailFilledCircle } from '../icon/icon';
import CustomToast from '../toast/customToast';

const screenWidth = ScreenWidth();
const screenHeight = ScreenHeight();
const transparentColor = 'rgba(0,0,0,0)';
const overlayColor = 'rgba(0,0,0,0.5)';

const rectDimensions = PixelRatio.roundToNearestPixel(screenWidth * 0.65);
const rectLeft = PixelRatio.roundToNearestPixel((screenWidth - rectDimensions) / 2);
const rectTop = PixelRatio.roundToNearestPixel((screenHeight - rectDimensions) / 2);

const cornerSize = 20;
const cornerOffset = -4;
const cornerThickness = 4;

const QRCodeScannerModal = () => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    const safeAreaInsets = useSafeAreaInsets();
    const device = useCameraDevice('back');
    const { hasPermission, requestPermission } = useCameraPermission();

    const codeScanner = useCodeScanner({
        codeTypes: ['qr'],
        onCodeScanned: (codes: Code[]) => {
            const first = codes[0];
            if (!first || first.type !== 'qr' || !first.value) {
                return;
            }

            closeModal();
            ModalActions.handleModalData({ result: first.value });
        }
    });

    const closeModal = () => {
        setVisible(false);
        ModalActions.handleQRScannerModal(false);
    };

    useEffect(() => {
        const init = async () => {
            if (hasPermission) {
                setVisible(true);
                setLoading(false);
                return;
            }

            const granted = await requestPermission();
            if (granted) {
                setVisible(true);
            } else {
                setVisible(false);
                ModalActions.handleQRScannerModal(false);
            }
            setLoading(false);
        };

        void init();
    }, []);

    return (
        <Modal animationType="fade" transparent visible={visible} onRequestClose={closeModal}>
            <View style={styles.container}>
                {!loading && device ? (
                    <Camera style={StyleSheet.absoluteFill} device={device} isActive={visible} codeScanner={codeScanner} />
                ) : null}

                <Svg pointerEvents="none" style={StyleSheet.absoluteFill}>
                    <Path
                        fill={overlayColor}
                        fillRule="evenodd"
                        d={`M0 0H${screenWidth}V${screenHeight}H0Z M${rectLeft} ${rectTop}H${rectLeft + rectDimensions}V${rectTop + rectDimensions}H${rectLeft}Z`}
                    />
                </Svg>

                <View style={[styles.header, { paddingTop: safeAreaInsets.top + 20 }]}>
                    <View style={styles.closeRow}>
                        <TouchableOpacity style={styles.closeButton} onPress={closeModal} activeOpacity={0.7}>
                            <View style={styles.closeIconBackground} />
                            <FailFilledCircle size={30} color={BlackColor} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.titleWrapper}>
                        <Text style={styles.title}>{QRCODE_SCANNER_MODAL_TEXT}</Text>
                    </View>
                </View>

                <View style={styles.rectangle}>
                    <View style={[styles.corner, styles.topLeft]} />
                    <View style={[styles.corner, styles.topRight]} />
                    <View style={[styles.corner, styles.bottomLeft]} />
                    <View style={[styles.corner, styles.bottomRight]} />
                </View>

                <CustomToast />
            </View>
        </Modal>
    );
};

export default QRCodeScannerModal;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: screenWidth,
        height: screenHeight,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: transparentColor
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 10
    },
    closeRow: {
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 40,
        alignItems: 'flex-start'
    },
    closeButton: {
        width: 30,
        height: 30,
        borderRadius: 50
    },
    closeIconBackground: {
        position: 'absolute',
        width: 20,
        height: 20,
        top: 5,
        left: 5,
        backgroundColor: WhiteColor,
        borderRadius: '100%'
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
    rectangle: {
        position: 'absolute',
        top: rectTop,
        left: rectLeft,
        width: rectDimensions,
        height: rectDimensions,
        backgroundColor: transparentColor
    },
    corner: {
        width: cornerSize,
        height: cornerSize,
        position: 'absolute',
        borderColor: WhiteColor
    },
    topLeft: {
        top: cornerOffset,
        left: cornerOffset,
        borderTopWidth: cornerThickness,
        borderLeftWidth: cornerThickness
    },
    topRight: {
        top: cornerOffset,
        right: cornerOffset,
        borderTopWidth: cornerThickness,
        borderRightWidth: cornerThickness
    },
    bottomLeft: {
        bottom: cornerOffset,
        left: cornerOffset,
        borderBottomWidth: cornerThickness,
        borderLeftWidth: cornerThickness
    },
    bottomRight: {
        bottom: cornerOffset,
        right: cornerOffset,
        borderBottomWidth: cornerThickness,
        borderRightWidth: cornerThickness
    }
});
