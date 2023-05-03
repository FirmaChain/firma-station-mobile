import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { CHAIN_SYMBOL } from '@/constants/common';
import { StyleSheet, Text, View } from 'react-native';
import { AddressTextColor, Lato, TextDarkGrayColor, WhiteColor } from '@/constants/theme';
import {
    AUTHZ_GRANT,
    AUTHZ_REVOKE,
    BANK_SEND,
    DAPP_MESSAGE_TYPE,
    GOV_DEPOSIT,
    GOV_PROPOSAL,
    GOV_VOTE,
    STAKING_DELEGATE,
    STAKING_REDELEGATE,
    STAKING_UNDELEGATE,
    STAKING_WITHDRAW,
    STAKING_WITHDRAW_ALL,
    VOTE_TYPE
} from '@/constants/types';
import { convertAmount, convertNumber, convertTime, convertToFctNumber } from '@/util/common';
import { useAppSelector } from '@/redux/hooks';
import { getValidatorAvatarURL, useStakingData } from '@/hooks/staking/hooks';
import { useProposalData } from '@/hooks/governance/hooks';
import { VALIDATOR_PROFILE } from '@/constants/images';
import { getStakingFromvalidator, getValidatorFromAddress } from '@/util/firma';
import FastImage from 'react-native-fast-image';

interface IProps {
    type: string;
    qrData: any | null;
}

interface IInfoProps {
    type: string;
}

interface IRenderDefaultInfoProps {
    title: string;
    value: string;
}

interface IRenderAmountInfoProps {
    title: string;
    amount: number;
}

interface IRenderValidatorInfoProps {
    title: string;
    moniker: string;
    avatarURL: string;
}

const TxWithStationInfoBox = ({ type, qrData }: IProps) => {
    const _CHAIN_SYMBOL = CHAIN_SYMBOL();

    const { storage, wallet } = useAppSelector((state) => state);
    const { stakingState, getStakingState } = useStakingData();
    const { proposalState, handleProposalPolling } = useProposalData();

    const [avatarError, setAvatarError] = useState<boolean>(false);
    const [srcMoniker, setSrcMoniker] = useState<string>('');
    const [srcAvatarURL, setSrcAvatarURL] = useState<string>('');
    const [dstMoniker, setDstMoniker] = useState<string>('');
    const [dstAvatarURL, setDstAvatarURL] = useState<string>('');
    const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
    const [fee, setFee] = useState<number>(30000);
    const [memo, setMemo] = useState<string>('');

    const QRData = useMemo(() => {
        let data = qrData.signParams.argument;
        if (data.fee !== undefined) setFee(data.fee);
        if (data.memo !== undefined) setMemo(data.memo);
        return data;
    }, [qrData]);

    const ValidatorAvatarList = useMemo(() => {
        return storage.validatorsProfile.profileInfos;
    }, [storage.validatorsProfile]);

    const isEmptyInfo = useMemo(() => {
        return DAPP_MESSAGE_TYPE[type] === AUTHZ_REVOKE;
    }, [type]);

    const RenderDefaultInfo = ({ title, value }: IRenderDefaultInfoProps) => {
        return (
            <View style={[styles.boxH, { width: '100%', justifyContent: 'space-between', paddingBottom: 12 }]}>
                <Text style={styles.catTitle}>{title}</Text>
                <Text style={[styles.value, { flex: 0, color: AddressTextColor, fontSize: 15 }]} numberOfLines={1} ellipsizeMode={'middle'}>
                    {value}
                </Text>
            </View>
        );
    };

    const RenderAmountInfo = ({ title, amount }: IRenderAmountInfoProps) => {
        return (
            <View style={[styles.boxH, { width: '100%', justifyContent: 'space-between', paddingBottom: 12 }]}>
                <Text style={styles.catTitle}>{title}</Text>
                <Text style={[styles.value, { color: AddressTextColor, fontSize: 15 }]}>{`${convertAmount(
                    amount,
                    false,
                    amount > 0 ? 6 : 0
                )} ${_CHAIN_SYMBOL}`}</Text>
            </View>
        );
    };

    const RenderValidatorInfo = ({ title, moniker, avatarURL }: IRenderValidatorInfoProps) => {
        return (
            <View style={[styles.boxH, { width: '100%', justifyContent: 'space-between', paddingBottom: 12 }]}>
                <Text style={styles.catTitle}>{title}</Text>
                <FastImage
                    style={styles.avatar}
                    onError={() => {
                        setAvatarError(true);
                    }}
                    source={
                        avatarError || avatarURL === null || avatarURL === ''
                            ? VALIDATOR_PROFILE
                            : { uri: avatarURL, priority: FastImage.priority.low }
                    }
                />
                <Text style={[styles.value, { flex: 0, color: AddressTextColor, fontSize: 15 }]} numberOfLines={1} ellipsizeMode={'middle'}>
                    {moniker}
                </Text>
            </View>
        );
    };

    const RenderInfoByType = useCallback(
        ({ type }: IInfoProps) => {
            if (QRData === undefined) return <Fragment />;
            switch (DAPP_MESSAGE_TYPE[type]) {
                case BANK_SEND:
                    let sendAmount = QRData.fctPrice;
                    return <RenderAmountInfo title={'Amount'} amount={sendAmount} />;
                case STAKING_DELEGATE:
                case STAKING_UNDELEGATE:
                    let stakingAmount = QRData.amount;
                    getValidatorInfo(QRData.validatorAddress, 0);
                    return (
                        <Fragment>
                            <RenderValidatorInfo title={'Validator'} moniker={srcMoniker} avatarURL={srcAvatarURL} />
                            <RenderAmountInfo title={'Amount'} amount={stakingAmount} />
                        </Fragment>
                    );
                case STAKING_REDELEGATE:
                    let _stakingAmount = QRData.amount;
                    getValidatorInfo(QRData.validatorSrcAddress, 0);
                    getValidatorInfo(QRData.validatorDstAddress, 1);
                    return (
                        <Fragment>
                            <RenderValidatorInfo title={'From'} moniker={srcMoniker} avatarURL={srcAvatarURL} />
                            <RenderValidatorInfo title={'To'} moniker={dstMoniker} avatarURL={dstAvatarURL} />
                            <RenderAmountInfo title={'Amount'} amount={_stakingAmount} />
                        </Fragment>
                    );
                case STAKING_WITHDRAW:
                    getValidatorInfo(QRData.validatorAddress, 0);
                    getWithdrawInfo(QRData.validatorAddress);
                    return (
                        <Fragment>
                            <RenderValidatorInfo title={'Validator'} moniker={srcMoniker} avatarURL={srcAvatarURL} />
                            <RenderAmountInfo title={'Amount'} amount={withdrawAmount} />
                        </Fragment>
                    );
                case STAKING_WITHDRAW_ALL:
                    getWithdrawAllInfo();
                    return <RenderAmountInfo title={'Amount'} amount={stakingState === null ? 0 : stakingState.stakingReward} />;
                case GOV_PROPOSAL:
                    let proposalTitle = QRData.title;
                    let initialDepositFCT = QRData.initialDepositFCT;
                    return (
                        <Fragment>
                            <RenderDefaultInfo title={'Proposal Title'} value={proposalTitle} />
                            <RenderAmountInfo title={'Initial Deposit'} amount={initialDepositFCT} />
                        </Fragment>
                    );
                case GOV_DEPOSIT:
                    getProposalInfo(QRData.proposalId);
                    let proposalTitleDeposit = proposalState === null ? '' : proposalState.titleState.title;
                    let depositAmount = QRData.amount;
                    return (
                        <Fragment>
                            <RenderDefaultInfo title={'Proposal Title'} value={proposalTitleDeposit} />
                            <RenderAmountInfo title={'Deposit'} amount={depositAmount} />
                        </Fragment>
                    );
                case GOV_VOTE:
                    getProposalInfo(QRData.proposalId);
                    let proposalTitleVote = proposalState === null ? '' : proposalState.titleState.title;
                    let option = QRData.option;
                    let voteIndex: number = convertNumber(option - 1);
                    return (
                        <Fragment>
                            <RenderDefaultInfo title={'Proposal Title'} value={proposalTitleVote} />
                            <RenderDefaultInfo title={'Vote'} value={VOTE_TYPE[voteIndex]} />
                        </Fragment>
                    );
                case AUTHZ_GRANT:
                    let expirationDate = QRData.expirationDate;
                    return <RenderDefaultInfo title={'Expiry Date'} value={convertTime(expirationDate, false, false)} />;
                default:
                    return <Fragment />;
            }
        },
        [type, QRData, ValidatorAvatarList, srcAvatarURL, srcMoniker, dstAvatarURL, dstMoniker, withdrawAmount, stakingState, proposalState]
    );

    const getValidatorInfo = useCallback(
        async (validatorAddress: string, type: number) => {
            try {
                const [validator, avatarURL] = await Promise.all([
                    getValidatorFromAddress(validatorAddress),
                    getValidatorAvatarURL(ValidatorAvatarList, validatorAddress)
                ]);
                if (type === 0) {
                    setSrcMoniker(validator.description.moniker);
                    setSrcAvatarURL(avatarURL);
                }
                if (type === 1) {
                    setDstMoniker(validator.description.moniker);
                    setDstAvatarURL(avatarURL);
                }
            } catch (error) {
                console.log(error);
            }
        },
        [qrData]
    );

    const getWithdrawInfo = useCallback(
        async (validatorAddress: string) => {
            try {
                const withdraw = await getStakingFromvalidator(wallet.address, validatorAddress);
                setWithdrawAmount(withdraw.stakingReward);
            } catch (error) {
                console.log(error);
            }
        },
        [qrData]
    );

    const getWithdrawAllInfo = useCallback(async () => {
        try {
            await getStakingState();
        } catch (error) {
            console.log(error);
        }
    }, [qrData, stakingState]);

    const getProposalInfo = useCallback(
        async (proposalId: number) => {
            try {
                await handleProposalPolling(proposalId);
            } catch (error) {
                console.log(error);
            }
        },
        [qrData]
    );

    return (
        <Fragment>
            <View style={{ width: '100%', height: 1, backgroundColor: WhiteColor + '10', display: isEmptyInfo ? 'none' : 'flex' }} />
            <View style={[styles.boxV, isEmptyInfo ? {} : { paddingTop: 20, paddingBottom: 17 }]}>
                <RenderInfoByType type={type} />
                <RenderAmountInfo title={'Fee'} amount={convertToFctNumber(fee)} />
                <RenderDefaultInfo title={'Memo'} value={memo} />
            </View>
        </Fragment>
    );
};

const styles = StyleSheet.create({
    boxH: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    boxV: {
        width: '100%',
        alignItems: 'flex-start'
    },

    catTitle: {
        flex: 1,
        fontFamily: Lato,
        fontSize: 14,
        color: TextDarkGrayColor
    },
    value: {
        flex: 1,
        fontFamily: Lato,
        fontSize: 14,
        color: TextDarkGrayColor,
        textAlign: 'right'
    },
    avatar: {
        width: 20,
        maxWidth: 20,
        height: 20,
        borderRadius: 50,
        overflow: 'hidden',
        marginRight: 7
    }
});

export default TxWithStationInfoBox;
