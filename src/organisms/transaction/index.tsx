import React, { useCallback, useEffect, useState } from 'react';
import { CHAIN_NETWORK } from '@/../config';
import { TRANSACTION_TYPE } from '@/constants/common';
import { BgColor } from '@/constants/theme';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { useAppSelector } from '@/redux/hooks';
import ConnectClient from '@/util/connectClient';
import {
    delegate,
    grant,
    mnemonicCheck,
    recoverWallet,
    redelegate,
    revoke,
    sendCW20,
    sendCW721NFT,
    sendFCT,
    sendIBC,
    sendToken,
    undelegate,
    voting,
    withdrawAllRewards,
    withdrawRewards
} from '@/util/firma';
import { getRecoverValue } from '@/util/wallet';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import ViewContainer from '@/components/parts/containers/viewContainer';

import ProgressTransaction from './progressTransaction';
import TransactionResult from './transactionResult';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Transaction>;

interface IProps {
    state: any;
}

export interface IResultState {
    code: number;
    result: any;
    type: string;
}

const Transaction = ({ state }: IProps) => {
    const navigation: ScreenNavgationProps = useNavigation();

    const { name: walletName, address: walletAddress } = useAppSelector((state) => state.wallet);
    const { network } = useAppSelector((state) => state.storage);

    const connectClient = new ConnectClient(CHAIN_NETWORK[network].RELAY_HOST);

    const [mnemonic, setMnemonic] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    const [recoverValueType, setRecoverValueType] = useState<'mnemonic' | 'privateKey'>('mnemonic');
    const [transactionResult, setTransactionResult] = useState<IResultState>({
        code: 0,
        result: '',
        type: state.type
    });

    useEffect(() => {
        const getMnemonicFromChain = async () => {
            try {
                const result = await getRecoverValue(walletName, state.password);
                if (result !== null) {
                    const isMnemonic = await mnemonicCheck(result);
                    if (isMnemonic) {
                        setRecoverValueType('mnemonic');
                        setMnemonic(result);
                    } else {
                        setRecoverValueType('privateKey');
                        setPrivateKey(result);
                    }
                }
            } catch (error) {
                setTransactionResult({ ...transactionResult, code: -1, result: String(error) });
            }
        };
        getMnemonicFromChain();
    }, []);

    const transaction = useCallback(async () => {
        let recoverValue = '';
        if (recoverValueType === 'mnemonic') recoverValue = mnemonic;
        if (recoverValueType === 'privateKey') recoverValue = privateKey;
        if (recoverValue === '') return;

        try {
            switch (state.type) {
                case TRANSACTION_TYPE.SEND: {
                    const sendResult = await sendFCT(recoverValue, state.targetAddress, state.amount, state.gas, state.memo);
                    setTransactionResult({
                        ...transactionResult,
                        code: sendResult.code,
                        result: sendResult.transactionHash
                    });
                    break;
                }
                case TRANSACTION_TYPE.SEND_TOKEN: {
                    const sendTokenResult = await sendToken(
                        recoverValue,
                        state.targetAddress,
                        state.amount,
                        state.tokenId,
                        state.decimal,
                        state.gas,
                        state.memo
                    );
                    setTransactionResult({
                        ...transactionResult,
                        code: sendTokenResult.code,
                        result: sendTokenResult.transactionHash
                    });
                    break;
                }
                case TRANSACTION_TYPE.SEND_IBC: {
                    const sendIBCResult = await sendIBC(
                        recoverValue,
                        'transfer',
                        state.channel,
                        state.denom,
                        state.targetAddress,
                        state.amount,
                        state.decimal,
                        state.gas,
                        state.memo
                    );
                    setTransactionResult({
                        ...transactionResult,
                        code: sendIBCResult.code,
                        result: sendIBCResult.transactionHash
                    });
                    break;
                }
                case TRANSACTION_TYPE.DELEGATE: {
                    const delegateResult = await delegate(recoverValue, state.operatorAddressDst, state.amount, state.gas);
                    setTransactionResult({
                        ...transactionResult,
                        code: delegateResult.code,
                        result: delegateResult.transactionHash
                    });
                    break;
                }
                case TRANSACTION_TYPE.REDELEGATE: {
                    const redelegateResult = await redelegate(
                        recoverValue,
                        state.operatorAddressSrc,
                        state.operatorAddressDst,
                        state.amount,
                        state.gas
                    );
                    setTransactionResult({
                        ...transactionResult,
                        code: redelegateResult.code,
                        result: redelegateResult.transactionHash
                    });
                    break;
                }
                case TRANSACTION_TYPE.UNDELEGATE: {
                    const undelegateResult = await undelegate(recoverValue, state.operatorAddressDst, state.amount, state.gas);
                    setTransactionResult({
                        ...transactionResult,
                        code: undelegateResult.code,
                        result: undelegateResult.transactionHash
                    });
                    break;
                }
                case TRANSACTION_TYPE.GRANT: {
                    const grantResult = await grant(recoverValue, state.validatorAddressList, state.maxTokens, state.gas);
                    setTransactionResult({
                        ...transactionResult,
                        code: grantResult.code,
                        result: grantResult.transactionHash
                    });
                    break;
                }
                case TRANSACTION_TYPE.REVOKE: {
                    const revokeResult = await revoke(recoverValue, state.gas);
                    setTransactionResult({
                        ...transactionResult,
                        code: revokeResult.code,
                        result: revokeResult.transactionHash
                    });
                    break;
                }
                case TRANSACTION_TYPE.WITHDRAW: {
                    const withdrawResult = await withdrawRewards(recoverValue, state.operatorAddress, state.gas);
                    setTransactionResult({
                        ...transactionResult,
                        code: withdrawResult.code,
                        result: withdrawResult.transactionHash
                    });
                    break;
                }
                case TRANSACTION_TYPE.WITHDRAW_ALL: {
                    const withdrawAllResult = await withdrawAllRewards(recoverValue, state.gas);
                    setTransactionResult({
                        ...transactionResult,
                        code: withdrawAllResult.code,
                        result: withdrawAllResult.transactionHash
                    });
                    break;
                }
                case TRANSACTION_TYPE.VOTING: {
                    const votingResult = await voting(recoverValue, state.proposalId, state.votingOpt, state.gas);
                    setTransactionResult({
                        ...transactionResult,
                        code: votingResult.code,
                        result: votingResult.transactionHash
                    });
                    break;
                }
                case TRANSACTION_TYPE.DAPP: {
                    const Wallet = await recoverWallet(recoverValue);
                    let rawData = '';

                    let code = 0;
                    let resultMessage = '';

                    if (connectClient.isDirectSign(state.data)) {
                        const { signature, txRaw } = await connectClient.getDirectSignRawData(Wallet, state.data);
                        const session = JSON.parse(state.session);

                        if (await connectClient.verifySign(session, state.data, signature)) {
                            if (state.data.qrType === 1) {
                                await connectClient.approve(session, state.data, {
                                    address: walletAddress,
                                    chainId: state.chainId,
                                    rawData: rawData
                                });

                                rawData = await connectClient.broadcast(Wallet, txRaw);
                            } else {
                                rawData = await connectClient.broadcast(Wallet, txRaw);

                                await connectClient.approve(JSON.parse(state.session), state.data, {
                                    address: walletAddress,
                                    chainId: state.chainId,
                                    rawData: rawData
                                });
                            }
                            resultMessage = JSON.parse(rawData, (_, value) => {
                                if (typeof value === 'string' && /^\d{16,}$/.test(value)) {
                                    return BigInt(value);
                                }
                                return value;
                            }).transactionHash;
                        }
                    } else {
                        rawData = await connectClient.getArbitarySignRawData(Wallet, state.data);
                        code = 1;
                        resultMessage = 'Signature is completed.';

                        await connectClient.approve(JSON.parse(state.session), state.data, {
                            address: walletAddress,
                            chainId: state.chainId,
                            rawData: rawData
                        });
                    }

                    setTransactionResult({ ...transactionResult, code: code, result: resultMessage });
                    break;
                }
                case TRANSACTION_TYPE.SEND_CW20: {
                    const sendCW20Result = await sendCW20(
                        recoverValue,
                        state.targetAddress,
                        state.amount,
                        state.gas,
                        state.contractAddress,
                        state.memo
                    );
                    setTransactionResult({
                        ...transactionResult,
                        code: sendCW20Result.code,
                        result: sendCW20Result.transactionHash
                    });
                    break;
                }
                case TRANSACTION_TYPE.SEND_CW721: {
                    const sendCW721Result = await sendCW721NFT(
                        recoverValue,
                        state.targetAddress,
                        state.tokenId,
                        state.gas,
                        state.contractAddress,
                        state.memo
                    );
                    setTransactionResult({
                        ...transactionResult,
                        code: sendCW721Result.code,
                        result: sendCW721Result.transactionHash
                    });
                    break;
                }
                default:
                    break;
            }
        } catch (error) {
            console.log('ERROR : ', error);
            setTransactionResult({ ...transactionResult, code: -1, result: String(error) });
        }
    }, [recoverValueType, mnemonic, privateKey]);

    useEffect(() => {
        transaction();
    }, [mnemonic, privateKey]);

    const handleMoveToWeb = (uri: string) => {
        navigation.navigate(Screens.WebScreen, { uri: uri });
    };

    const handleBack = () => {
        switch (state.type) {
            case TRANSACTION_TYPE.SEND:
            case TRANSACTION_TYPE.SEND_TOKEN:
            case TRANSACTION_TYPE.SEND_IBC:
                navigation.reset({ routes: [{ name: Screens.Home }] });
                break;
            case TRANSACTION_TYPE.DELEGATE:
            case TRANSACTION_TYPE.REDELEGATE:
            case TRANSACTION_TYPE.UNDELEGATE:
                navigation.pop(2);
                break;
            case TRANSACTION_TYPE.GRANT:
            case TRANSACTION_TYPE.REVOKE:
                navigation.goBack();
                break;
            case TRANSACTION_TYPE.SEND_CW20:
            case TRANSACTION_TYPE.SEND_CW721:
                navigation.navigate(Screens.DappDetail);
                break;
            default:
                navigation.goBack();
                break;
        }
    };

    return (
        <ViewContainer full={true} bgColor={BgColor}>
            {transactionResult.result !== '' ? (
                <TransactionResult result={transactionResult} handleExplorer={handleMoveToWeb} handleBack={handleBack} />
            ) : (
                <ProgressTransaction />
            )}
        </ViewContainer>
    );
};

export default Transaction;
