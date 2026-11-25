import React, { useCallback, useEffect, useRef, useState } from 'react';
import { QRCODE_SCANNER_MODAL_TEXT } from '@/constants/common';
import { BlackColor, Lato, TextCatTitleColor, WhiteColor } from '@/constants/theme';
import { ModalActions } from '@/redux/actions';
import { AppState, Modal, PixelRatio, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { useBarcodeScannerOutput, type Barcode, type TargetBarcodeFormat } from 'react-native-vision-camera-barcode-scanner';

import { FailFilledCircle } from '../icon/icon';
import CustomToast from '../toast/customToast';

const QR_FORMATS: TargetBarcodeFormat[] = ['qr-code'];
const transparentColor = 'rgba(0,0,0,0)';
const overlayColor = 'rgba(0,0,0,0.5)';

const cornerSize = 20;
const cornerOffset = -4;
const cornerThickness = 4;

const QRCodeScannerModal = () => {
    const [visible, setVisible] = useState(false);
    const [appState, setAppState] = useState(AppState.currentState);
    const [scanError, setScanError] = useState(false);
    const [{ width, height }, setLayout] = useState({ width: 0, height: 0 });
    const request = useRef<Promise<boolean> | null>(null);
    const closed = useRef(false);

    const safeAreaInsets = useSafeAreaInsets();
    const device = useCameraDevice('back');
    const { hasPermission, canRequestPermission, requestPermission } = useCameraPermission();

    const closeModal = useCallback(() => {
        if (closed.current) return;
        closed.current = true;
        setVisible(false);
        ModalActions.handleQRScannerModal(false);
    }, []);

    useEffect(() => {
        let cancelled = false;
        if (hasPermission) {
            if (!closed.current) setVisible(true);
        } else if (!canRequestPermission) {
            closeModal();
        } else {
            const pending = (request.current ??= requestPermission());
            void pending.then(
                (granted) => {
                    if (cancelled || closed.current) return;
                    if (granted) setVisible(true);
                    else closeModal();
                },
                () => {
                    if (!cancelled) closeModal();
                }
            );
        }
        return () => {
            cancelled = true;
        };
    }, [hasPermission, canRequestPermission, requestPermission, closeModal]);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', (next) => {
            setAppState(next);
            if (visible && hasPermission && next === 'background') closeModal();
        });
        setAppState(AppState.currentState);
        return () => subscription.remove();
    }, [visible, hasPermission, closeModal]);

    const active = visible && hasPermission && appState === 'active' && !!device && !scanError;
    const onBarcodeScanned = (barcodes: Barcode[]) => {
        if (!active || AppState.currentState !== 'active' || closed.current) return;
        const result = barcodes.find((barcode) => barcode.format === 'qr-code' && barcode.rawValue)?.rawValue;
        if (!result) return;
        closeModal();
        ModalActions.handleModalData({ result });
    };
    const onError = () => {
        if (!closed.current) setScanError(true);
    };
    const output = useBarcodeScannerOutput({ barcodeFormats: QR_FORMATS, onBarcodeScanned, onError });

    const rectDimensions = PixelRatio.roundToNearestPixel(width * 0.65);
    const rectLeft = PixelRatio.roundToNearestPixel((width - rectDimensions) / 2);
    const rectTop = PixelRatio.roundToNearestPixel((height - rectDimensions) / 2);
    const showGuide = width > 0 && height > 0 && device && !scanError;

    return (
        <Modal animationType="fade" transparent visible={visible} onRequestClose={closeModal}>
            <View
                style={styles.container}
                onLayout={({ nativeEvent: { layout } }) => setLayout({ width: layout.width, height: layout.height })}
            >
                {visible && hasPermission && device && !scanError ? (
                    <Camera
                        style={StyleSheet.absoluteFill}
                        device={device}
                        isActive={active}
                        implementationMode="compatible"
                        outputs={[output]}
                        onError={onError}
                    />
                ) : null}

                {showGuide ? (
                    <Svg pointerEvents="none" style={StyleSheet.absoluteFill}>
                        <Path
                            fill={overlayColor}
                            fillRule="evenodd"
                            d={`M0 0H${width}V${height}H0Z M${rectLeft} ${rectTop}H${rectLeft + rectDimensions}V${rectTop + rectDimensions}H${rectLeft}Z`}
                        />
                    </Svg>
                ) : null}

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

                {scanError || !device ? (
                    <View style={styles.titleWrapper}>
                        <Text style={styles.title}>{scanError ? 'Unable to start the camera.' : 'No rear camera available.'}</Text>
                    </View>
                ) : showGuide ? (
                    <View
                        pointerEvents="none"
                        style={[styles.rectangle, { top: rectTop, left: rectLeft, width: rectDimensions, height: rectDimensions }]}
                    >
                        <View style={[styles.corner, styles.topLeft]} />
                        <View style={[styles.corner, styles.topRight]} />
                        <View style={[styles.corner, styles.bottomLeft]} />
                        <View style={[styles.corner, styles.bottomRight]} />
                    </View>
                ) : null}

                <CustomToast />
            </View>
        </Modal>
    );
};

export default QRCodeScannerModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
