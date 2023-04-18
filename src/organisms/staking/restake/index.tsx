import React, { useEffect, useMemo, useState } from 'react';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { StackNavigationProp } from '@react-navigation/stack';
import { FirmaUtil } from '@firmachain/firma-js';
import { CommonActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { useDelegationData, useRestakeInfoData, useStakingData } from '@/hooks/staking/hooks';
import { convertAmount } from '@/util/common';
import { getEstimateGasGrantStakeAuthorization, getEstimateGasRevokeStakeAuthorization, getFeesFromGas } from '@/util/firma';
import { CHAIN_SYMBOL, RESTAKE_NOTICE_TEXT, RESTAKE_TYPE, TRANSACTION_TYPE } from '@/constants/common';
import { BgColor, TextCatTitleColor } from '@/constants/theme';
import { FIRMACHAIN_DEFAULT_CONFIG, GUIDE_URI } from '@/../config';
import Button from '@/components/button/button';
import Container from '@/components/parts/containers/conatainer';
import ViewContainer from '@/components/parts/containers/viewContainer';
import WarnContainer from '@/components/parts/containers/warnContainer';
import TransactionConfirmModal from '@/components/modal/transactionConfirmModal';
import AlertModal from '@/components/modal/alertModal';
import BalanceInfoForRestake from '@/components/parts/balanceInfoForRestake';
import StatusBox from './statusBox';
import NextRoundCard from './nextRoundCard';
import RestakeValidatorListModal from '@/components/modal/restakeValidatorListModal';
import RestakeValidators from './restakeValidators';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Restake>;
let restakeType: string = 'GRANT';

const Restake = () => {
    const navigation: ScreenNavgationProps = useNavigation();

    const { wallet } = useAppSelector((state) => state);
    const _CHAIN_SYMBOL = CHAIN_SYMBOL();

    const [gas, setGas] = useState(FIRMACHAIN_DEFAULT_CONFIG.defaultGas);
    const [openTransactionModal, setOpenTransactionModal] = useState(false);
    const [openValidatorListModal, setOpenValidatorListModal] = useState(false);
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [alertDescription, setAlertDescription] = useState('');

    const { restakeInfo, handleRestakeInfo } = useRestakeInfoData();
    const { stakingState, getStakingState } = useStakingData();
    const { delegationState, stakingGrantState, handleDelegationState, handleStakingGrantState } = useDelegationData();

    const totalDelegate = useMemo(() => {
        if (stakingState === null) return 0;
        return FirmaUtil.getUFCTFromFCT(stakingState.delegated);
    }, [stakingState]);

    const totalReward = useMemo(() => {
        if (stakingState === null) return 0;
        return FirmaUtil.getUFCTFromFCT(stakingState.stakingReward);
    }, [stakingState]);

    const grantExist = useMemo(() => {
        if (stakingGrantState.list.length > 0) {
            let activation = stakingGrantState.list.filter((value) => value.isActive);
            return activation.length > 0;
        }
        return false;
    }, [stakingGrantState]);

    const delegationStates = useMemo(() => {
        if (stakingState === null) return null;
        return delegationState;
    }, [delegationState, stakingState]);

    const validatorAddressList = useMemo(() => {
        if (delegationState.length > 0) {
            const list = delegationState.map((value) => {
                return value.validatorAddress;
            });
            return list;
        }
        return [];
    }, [delegationState]);

    const restakeUpdateInfo = useMemo(() => {
        var json = restakeInfo;
        if (json) {
            const { nextRoundDateTime, round, ...other } = restakeInfo;
            json = {
                ...other,
                minimum_Rewards: `${convertAmount(restakeInfo.minimum_Rewards, false, 2)} ${_CHAIN_SYMBOL}`
            };
        }
        return json;
    }, [restakeInfo]);

    const nextRound = useMemo(() => {
        if (restakeInfo) {
            let round = restakeInfo.round + 1;
            return round;
        }
        return 0;
    }, [restakeInfo]);

    const nextRoundTime = useMemo(() => {
        if (restakeInfo) {
            return restakeInfo.nextRoundDateTime;
        }
        return '';
    }, [restakeInfo]);

    const minimumRewards = useMemo(() => {
        if (restakeInfo) {
            return restakeInfo.minimum_Rewards;
        }
        return 0;
    }, [restakeInfo]);

    const handleRefresh = async (progress: boolean) => {
        try {
            CommonActions.handleLoadingProgress(progress);
            await getStakingState();
            await handleDelegationState();
            await handleStakingGrantState();
            await handleRestakeInfo();
            CommonActions.handleLoadingProgress(false);
        } catch (error) {
            console.log(error);
            CommonActions.handleLoadingProgress(false);
        }
    };

    const handleGrantOrRevoke = async (open: boolean, type: string) => {
        restakeType = type;
        handleGrantOrRevokeConfirm(open, type);
    };

    const handleGrantOrRevokeConfirm = async (open: boolean, type: string = '') => {
        try {
            if (open) {
                await getEstimateGasGrantOrRevoke();
            }
            setOpenTransactionModal(open);
        } catch (error) {
            CommonActions.handleLoadingProgress(false);
            setAlertDescription(String(error));
            handleAlertModalOpen(true);
            throw error;
        }
    };

    const getEstimateGasGrantOrRevoke = async () => {
        CommonActions.handleLoadingProgress(true);
        try {
            if (TRANSACTION_TYPE[restakeType] === TRANSACTION_TYPE['GRANT']) {
                if (validatorAddressList !== null) {
                    const result = await getEstimateGasGrantStakeAuthorization(wallet.name, validatorAddressList);
                    setGas(result);
                }
            }
            if (TRANSACTION_TYPE[restakeType] === TRANSACTION_TYPE['REVOKE']) {
                const result = await getEstimateGasRevokeStakeAuthorization(wallet.name);
                setGas(result);
            }
            setAlertDescription('');
        } catch (error) {
            console.log(error);
            CommonActions.handleLoadingProgress(false);
            setAlertDescription(String(error));
            handleAlertModalOpen(true);
            throw error;
        }
        CommonActions.handleLoadingProgress(false);
    };

    const handleTransaction = (password: string) => {
        if (alertDescription !== '') return handleAlertModalOpen(true);
        let transactionState;
        switch (TRANSACTION_TYPE[restakeType]) {
            case TRANSACTION_TYPE['REVOKE']:
                transactionState = {
                    type: TRANSACTION_TYPE['REVOKE'],
                    password: password,
                    gas: gas
                };
                break;
            case TRANSACTION_TYPE['GRANT']:
                transactionState = {
                    type: TRANSACTION_TYPE['GRANT'],
                    password: password,
                    maxTokens: 0,
                    validatorAddressList: validatorAddressList,
                    gas: gas
                };
                break;
            default:
                break;
        }
        navigation.navigate(Screens.Transaction, { state: transactionState });
    };

    const handleValidatorListModalOpen = (open: boolean) => {
        setOpenValidatorListModal(open);
    };
    const handleAlertModalOpen = (open: boolean) => {
        setIsAlertModalOpen(open);
    };

    const handleMoveToWeb = () => {
        Linking.openURL(GUIDE_URI['restake']);
    };

    const handleBack = () => {
        navigation.goBack();
    };

    useEffect(() => {
        handleRefresh(true);
    }, []);

    return (
        <Container title={'Restake'} handleGuide={handleMoveToWeb} bgColor={BgColor} backEvent={handleBack}>
            <ViewContainer>
                <View style={styles.container}>
                    <View style={{ flex: 1 }}>
                        <ScrollView style={{ marginBottom: 20 }}>
                            <View style={{ flex: 1, paddingHorizontal: 20 }}>
                                <BalanceInfoForRestake available={totalDelegate} reward={totalReward} />
                                <StatusBox
                                    grantState={stakingGrantState}
                                    delegationState={delegationStates}
                                    minimumRewards={minimumRewards}
                                />
                                <NextRoundCard
                                    grantState={stakingGrantState}
                                    nextRound={nextRound}
                                    nextRoundTime={nextRoundTime}
                                    minimumRewards={minimumRewards}
                                    handleOpenListModal={handleValidatorListModalOpen}
                                    handleRefresh={handleRefresh}
                                />
                                <View style={{ paddingTop: 10 }}>
                                    {RESTAKE_NOTICE_TEXT.map((value, index) => {
                                        return (
                                            <View key={index} style={{ marginBottom: 10 }}>
                                                <WarnContainer text={value} question={true} />
                                            </View>
                                        );
                                    })}
                                </View>
                            </View>
                        </ScrollView>
                        <View style={styles.boxContainer}>
                            {grantExist && (
                                <React.Fragment>
                                    <View style={{ flex: 1 }}>
                                        <Button
                                            title="Disable"
                                            active={true}
                                            border={true}
                                            borderColor={TextCatTitleColor}
                                            borderTextColor={TextCatTitleColor}
                                            onPressEvent={() => handleGrantOrRevoke(true, 'REVOKE')}
                                        />
                                    </View>
                                    <View style={{ width: 10 }} />
                                </React.Fragment>
                            )}
                            <View style={{ flex: 1 }}>
                                <Button
                                    title={grantExist ? 'Update' : 'Enable'}
                                    active={true}
                                    onPressEvent={() => handleGrantOrRevoke(true, 'GRANT')}
                                />
                            </View>
                        </View>
                    </View>
                    <RestakeValidatorListModal open={openValidatorListModal} closeModal={() => handleValidatorListModalOpen(false)}>
                        <RestakeValidators
                            grantState={stakingGrantState}
                            minimumRewards={minimumRewards}
                            closeModal={() => handleValidatorListModalOpen(false)}
                        />
                    </RestakeValidatorListModal>
                    <TransactionConfirmModal
                        transactionHandler={handleTransaction}
                        title={RESTAKE_TYPE[restakeType]}
                        amount={0}
                        extraData={restakeType === 'GRANT' && restakeUpdateInfo}
                        fee={getFeesFromGas(gas)}
                        open={openTransactionModal}
                        setOpenModal={handleGrantOrRevokeConfirm}
                    />
                    {isAlertModalOpen && (
                        <AlertModal
                            visible={isAlertModalOpen}
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
        backgroundColor: BgColor
    },
    boxContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20
    }
});

export default Restake;
