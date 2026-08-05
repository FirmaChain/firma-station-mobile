import React, { useEffect, useRef, useState } from 'react';
import { GUIDE_URI } from '@/../config';
import { TRANSACTION_TYPE, WRONG_TARGET_ADDRESS_WARN_TEXT } from '@/constants/common';
import { BgColor, BoxDarkColor, CW721BackgroundColor, CW721Color, Lato, TextColor } from '@/constants/theme';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { CommonActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { fadeOut } from '@/util/animation';
import { addressCheck, getEstimateGasSendCW721, getFeesFromGas, getFirmaConfig } from '@/util/firma';
import FastImage from '@d11/react-native-fast-image';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Animated, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';

import Button from '@/components/button/button';
import AlertModal from '@/components/modal/alertModal';
import TransactionConfirmModal from '@/components/modal/transactionConfirmModal';
import Container from '@/components/parts/containers/conatainer';
import ViewContainer from '@/components/parts/containers/viewContainer';
import SquareSkeleton from '@/components/skeleton/squareSkeleton';

import SendInputBox from './sendInputBox';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.SendCW20>;

interface ISendInfo {
    address: string;
    tokenId: string;
    memo: string;
}

interface IProps {
    contract: string;
    imageURL: string;
    nftName: string;
    tokenId: string;
}

const SendCW721 = ({ contract, imageURL, nftName, tokenId }: IProps) => {
    const navigation: ScreenNavgationProps = useNavigation();
    const fadeAnimImage = useRef(new Animated.Value(1)).current;

    const { name: walletName, dstAddress: walletDstAddress } = useAppSelector((state) => state.wallet);

    const [gas, setGas] = useState(getFirmaConfig().defaultGas);
    const [imageLoading, setImageLoading] = useState(true);
    const [sendInfoState, setSendInfoState] = useState<ISendInfo>({
        address: '',
        tokenId: tokenId,
        memo: ''
    });
    const [resetInputValues, setInputResetValues] = useState(false);

    const [openTransactionModal, setOpenTransactionModal] = useState(false);
    const [openAlertModal, setOpenAlertModal] = useState(false);
    const [alertDescription, setAlertDescription] = useState('');

    const handleSendInfo = (type: string, value: string | number) => {
        let val: string | number | null = value;
        if (type === 'memo' && val === '') val = null;
        setSendInfoState((prevState) => ({
            ...prevState,
            [type]: val
        }));
    };

    const handleAlertModalOpen = (open: boolean) => {
        setOpenAlertModal(open);
    };

    const handleTransactionModal = (open: boolean) => {
        setOpenTransactionModal(open);
    };

    const handleTransaction = (password: string) => {
        handleTransactionModal(false);

        const transactionState = {
            type: TRANSACTION_TYPE['SEND_CW721'],
            password: password,
            contractAddress: contract,
            targetAddress: sendInfoState.address,
            tokenId: sendInfoState.tokenId,
            memo: sendInfoState.memo,
            gas: gas
        };
        setInputResetValues(true);
        navigation.navigate(Screens.Transaction, { state: transactionState });
    };

    const handleSend = async () => {
        if (sendInfoState.address === '' || sendInfoState.tokenId === '') return;
        const isValidAddress = addressCheck(sendInfoState.address);
        const loadingRequestId = CommonActions.beginLoadingProgress();
        try {
            if (isValidAddress) {
                const gas = await getEstimateGasSendCW721(walletName, contract, sendInfoState.address, sendInfoState.tokenId);
                setGas(gas);
            } else {
                setAlertDescription(WRONG_TARGET_ADDRESS_WARN_TEXT);
                setOpenAlertModal(true);
                CommonActions.endLoadingProgress(loadingRequestId);
                return;
            }
        } catch (error) {
            console.error(error);
            CommonActions.endLoadingProgress(loadingRequestId);
            setAlertDescription(String(error));
            setOpenAlertModal(true);
            return;
        }
        CommonActions.endLoadingProgress(loadingRequestId);
        handleTransactionModal(true);
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const handleMoveToWeb = () => {
        // navigation.navigate(Screens.WebScreen, {uri: GUIDE_URI["send"]});
        Linking.openURL(GUIDE_URI['send']);
    };

    useEffect(() => {
        if (imageLoading === false) {
            fadeOut(Animated, fadeAnimImage, 500);
        }
    }, [imageLoading]);

    const inlineStyles1 = {
        inlineStyle1: { flex: 6 },
        inlineStyle2: { alignItems: 'center', paddingBottom: 30 },
        inlineStyle3: { justifyContent: 'flex-start', paddingTop: 15 },
        inlineStyle4: { position: 'absolute', top: 0, left: 0, opacity: fadeAnimImage },
        inlineStyle5: { paddingBottom: 5 },
        inlineStyle6: { flex: 1, justifyContent: 'flex-end' }
    } as const;

    return (
        <Container title="Send CW721" handleGuide={handleMoveToWeb} backEvent={handleBack}>
            <ViewContainer bgColor={BgColor}>
                <View style={styles.container}>
                    <View style={inlineStyles1.inlineStyle1}>
                        <ScrollView keyboardShouldPersistTaps={'handled'}>
                            <View style={inlineStyles1.inlineStyle2}>
                                <View style={inlineStyles1.inlineStyle3}>
                                    <FastImage
                                        style={styles.contentImage}
                                        source={{
                                            uri: imageURL,
                                            priority: FastImage.priority.normal
                                        }}
                                        onLoadEnd={() => setImageLoading(false)}
                                    />
                                    <Animated.View style={inlineStyles1.inlineStyle4}>
                                        <SquareSkeleton size={200} marginBottom={20} />
                                    </Animated.View>
                                </View>
                                <View style={[styles.box, inlineStyles1.inlineStyle5]}>
                                    <Text style={styles.label}>CW721</Text>
                                </View>
                                <View style={styles.box}>
                                    <Text numberOfLines={2} ellipsizeMode="tail" style={styles.nftName}>
                                        {nftName}
                                    </Text>
                                </View>
                            </View>
                            <SendInputBox handleSendInfo={handleSendInfo} dstAddress={walletDstAddress} reset={resetInputValues} />
                        </ScrollView>
                    </View>
                    <View style={inlineStyles1.inlineStyle6}>
                        <Button
                            title="Send"
                            active={sendInfoState.address !== '' && sendInfoState.tokenId !== ''}
                            onPressEvent={() => handleSend()}
                        />
                    </View>
                    <TransactionConfirmModal
                        transactionHandler={handleTransaction}
                        title={'Send CW721'}
                        fee={getFeesFromGas(gas)}
                        amount={0}
                        extraData={{ NFT: `#${tokenId} ${nftName}` }}
                        open={openTransactionModal}
                        setOpenModal={handleTransactionModal}
                    />
                    {openAlertModal && (
                        <AlertModal
                            visible={openAlertModal}
                            handleOpen={handleAlertModalOpen}
                            title={'Failed'}
                            desc={alertDescription}
                            confirmTitle={'OK'}
                            type={'ERROR'}
                        />
                    )}
                </View>
            </ViewContainer>
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20
    },
    contentImage: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        overflow: 'hidden',
        borderRadius: 8,
        marginBottom: 20,
        backgroundColor: BoxDarkColor
    },
    box: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        flex: 1
    },
    nftName: {
        fontSize: 20,
        fontFamily: Lato,
        fontWeight: 'bold',
        color: TextColor
    },
    label: {
        fontFamily: Lato,
        fontSize: 12,
        borderRadius: 10,
        textAlign: 'center',
        overflow: 'hidden',
        fontWeight: '600',
        paddingHorizontal: 6,
        paddingVertical: 3,
        color: CW721Color,
        backgroundColor: CW721BackgroundColor
    }
});

export default SendCW721;
