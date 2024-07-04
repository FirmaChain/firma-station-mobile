import React, { useEffect, useRef, useState } from 'react';
import { Animated, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CommonActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { BgColor, BoxDarkColor, Lato, RestakeActiveColor, TextColor, TextDarkGrayColor } from '@/constants/theme';
import { TRANSACTION_TYPE, WRONG_TARGET_ADDRESS_WARN_TEXT } from '@/constants/common';
import { addressCheck, getEstimateGasSendCW20, getEstimateGasSendCW721, getFeesFromGas } from '@/util/firma';
import { FIRMACHAIN_DEFAULT_CONFIG, GUIDE_URI } from '@/../config';
import Container from '@/components/parts/containers/conatainer';
import ViewContainer from '@/components/parts/containers/viewContainer';
import Button from '@/components/button/button';
import TransactionConfirmModal from '@/components/modal/transactionConfirmModal';
import AlertModal from '@/components/modal/alertModal';
import SendInputBox from './sendInputBox';
import FastImage from 'react-native-fast-image';
import { fadeOut } from '@/util/animation';
import SquareSkeleton from '@/components/skeleton/squareSkeleton';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.SendCW20>;

interface ISendInfo {
    address: string;
    tokenId: string;
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

    const { wallet } = useAppSelector((state) => state);

    const [gas, setGas] = useState(FIRMACHAIN_DEFAULT_CONFIG.defaultGas);
    const [imageLoading, setImageLoading] = useState(true);
    const [sendInfoState, setSendInfoState] = useState<ISendInfo>({
        address: '',
        tokenId: tokenId,
    });
    const [resetInputValues, setInputResetValues] = useState(false);

    const [openTransactionModal, setOpenTransactionModal] = useState(false);
    const [openAlertModal, setOpenAlertModal] = useState(false);
    const [alertDescription, setAlertDescription] = useState('');

    const handleSendInfo = (type: string, value: string | number) => {
        let val: any = value;
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
            gas: gas,
        };
        setInputResetValues(true);
        navigation.navigate(Screens.Transaction, { state: transactionState });
    };

    const handleSend = async () => {
        if (sendInfoState.address === '' || sendInfoState.tokenId === '') return;
        const isValidAddress = addressCheck(sendInfoState.address);
        CommonActions.handleLoadingProgress(true);
        try {
            if (isValidAddress) {
                let gas = await getEstimateGasSendCW721(wallet.name, contract, sendInfoState.address, sendInfoState.tokenId);
                setGas(gas);
            } else {
                setAlertDescription(WRONG_TARGET_ADDRESS_WARN_TEXT);
                setOpenAlertModal(true);
                CommonActions.handleLoadingProgress(false);
                return;
            }
        } catch (error) {
            console.log(error);
            CommonActions.handleLoadingProgress(false);
            setAlertDescription(String(error));
            setOpenAlertModal(true);
            return;
        }
        CommonActions.handleLoadingProgress(false);
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

    return (
        <Container title="Send CW721" handleGuide={handleMoveToWeb} backEvent={handleBack}>
            <ViewContainer bgColor={BgColor}>
                <View style={styles.container}>
                    <View style={{ flex: 6 }}>
                        <ScrollView keyboardShouldPersistTaps={'handled'}>
                            <View style={{ alignItems: 'center', paddingBottom: 30 }}>
                                <View style={{ justifyContent: 'flex-start', paddingTop: 15 }}>
                                    <FastImage
                                        style={styles.contentImage}
                                        source={{
                                            uri: imageURL,
                                            priority: FastImage.priority.normal
                                        }}
                                        onLoadEnd={() => setImageLoading(false)}
                                    />
                                    <Animated.View style={{ position: 'absolute', top: 0, left: 0, opacity: fadeAnimImage }}>
                                        <SquareSkeleton size={200} marginBottom={20} />
                                    </Animated.View>
                                </View>
                                <View style={[styles.box, { paddingBottom: 5 }]}>
                                    <Text style={styles.label}>CW721</Text>
                                </View>
                                <View style={styles.box}>
                                    <Text numberOfLines={2} ellipsizeMode="tail" style={[styles.nftName]}>
                                        {nftName}
                                    </Text>
                                </View>
                            </View>
                            <SendInputBox
                                handleSendInfo={handleSendInfo}
                                dstAddress={wallet.dstAddress}
                                reset={resetInputValues}
                            />
                        </ScrollView>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
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
                        extraData={{ 'NFT': `#${tokenId} ${nftName}` }}
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
        flex: 1,
    },
    nftName: {
        fontSize: 20,
        fontFamily: Lato,
        fontWeight: 'bold',
        color: TextColor,
    },
    tokenId: {
        fontSize: 18,
        fontFamily: Lato,
        color: TextDarkGrayColor,
        paddingLeft: 10,
    },
    label: {
        fontFamily: Lato,
        fontSize: 13,
        borderRadius: 10,
        textAlign: 'center',
        overflow: 'hidden',
        paddingHorizontal: 10,
        paddingVertical: 3,
        backgroundColor: RestakeActiveColor + '30',
        color: RestakeActiveColor,
        marginHorizontal: 5
    },
});

export default SendCW721;
