import React, { useEffect, useState } from 'react';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '@/redux/hooks';
import { getMnemonic } from '@/util/wallet';
import {
    delegate,
    grant,
    recoverFromMnemonic,
    redelegate,
    revoke,
    sendFCT,
    undelegate,
    voting,
    withdrawAllRewards,
    withdrawRewards
} from '@/util/firma';
import { BgColor } from '@/constants/theme';
import { TRANSACTION_TYPE } from '@/constants/common';
import ViewContainer from '@/components/parts/containers/viewContainer';
import ProgressTransaction from './progressTransaction';
import TransactionResult from './transactionResult';
import ConnectClient from '@/util/connectClient';
import { CHAIN_NETWORK } from '@/../config';

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

    const { storage, wallet } = useAppSelector((state) => state);
    const connectClient = new ConnectClient(CHAIN_NETWORK[storage.network].RELAY_HOST);

    const [mnemonic, setMnemonic] = useState('');
    const [transactionResult, setTransactionResult] = useState<IResultState>({
        code: 0,
        result: '',
        type: state.type
    });

    useEffect(() => {
        const getMnemonicFromChain = async () => {
            try {
                let result = await getMnemonic(wallet.name, state.password);
                if (result) {
                    setMnemonic(result);
                }
            } catch (error) {
                setTransactionResult({ ...transactionResult, code: -1, result: String(error) });
            }
        };
        getMnemonicFromChain();
    }, []);

    useEffect(() => {
        if (mnemonic === '') return;
        const transaction = async () => {
            try {
                switch (state.type) {
                    case TRANSACTION_TYPE['SEND']:
                        const sendResult = await sendFCT(mnemonic, state.targetAddress, state.amount, state.gas, state.memo);
                        setTransactionResult({ ...transactionResult, code: sendResult.code, result: sendResult.transactionHash });
                        break;
                    case TRANSACTION_TYPE['DELEGATE']:
                        const delegateResult = await delegate(mnemonic, state.operatorAddressDst, state.amount, state.gas);
                        setTransactionResult({ ...transactionResult, code: delegateResult.code, result: delegateResult.transactionHash });
                        break;
                    case TRANSACTION_TYPE['REDELEGATE']:
                        const redelegateResult = await redelegate(
                            mnemonic,
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
                    case TRANSACTION_TYPE['UNDELEGATE']:
                        const undelegateResult = await undelegate(mnemonic, state.operatorAddressDst, state.amount, state.gas);
                        setTransactionResult({
                            ...transactionResult,
                            code: undelegateResult.code,
                            result: undelegateResult.transactionHash
                        });
                        break;
                    case TRANSACTION_TYPE['GRANT']:
                        const grantResult = await grant(mnemonic, state.validatorAddressList, state.maxTokens, state.gas);
                        setTransactionResult({ ...transactionResult, code: grantResult.code, result: grantResult.transactionHash });
                        break;
                    case TRANSACTION_TYPE['REVOKE']:
                        const revokeResult = await revoke(mnemonic, state.gas);
                        setTransactionResult({ ...transactionResult, code: revokeResult.code, result: revokeResult.transactionHash });
                        break;
                    case TRANSACTION_TYPE['WITHDRAW']:
                        const withdrawResult = await withdrawRewards(mnemonic, state.operatorAddress, state.gas);
                        setTransactionResult({ ...transactionResult, code: withdrawResult.code, result: withdrawResult.transactionHash });
                        break;
                    case TRANSACTION_TYPE['WITHDRAW_ALL']:
                        const withdrawAllResult = await withdrawAllRewards(mnemonic, state.gas);
                        setTransactionResult({
                            ...transactionResult,
                            code: withdrawAllResult.code,
                            result: withdrawAllResult.transactionHash
                        });
                        break;
                    case TRANSACTION_TYPE['VOTING']:
                        const votingResult = await voting(mnemonic, state.proposalId, state.votingOpt, state.gas);
                        setTransactionResult({ ...transactionResult, code: votingResult.code, result: votingResult.transactionHash });
                        break;
                    case TRANSACTION_TYPE['DAPP']:
                        const Wallet = await recoverFromMnemonic(mnemonic);
                        let rawData = '';

                        let code = 0;
                        let resultMessage = '';
                        if (connectClient.isDirectSign(state.data)) {
                            const { txRaw, signature } = await connectClient.getDirectSignRawData(Wallet, state.data);
                            if (await connectClient.verifySign(JSON.parse(state.session), state.data, signature)) {
                                if (state.data.qrType === 1) {
                                    await connectClient.approve(JSON.parse(state.session), state.data, {
                                        address: wallet.address,
                                        chainId: state.chainId,
                                        rawData: rawData
                                    });

                                    rawData = await connectClient.broadcast(Wallet, txRaw);
                                } else {
                                    rawData = await connectClient.broadcast(Wallet, txRaw);

                                    await connectClient.approve(JSON.parse(state.session), state.data, {
                                        address: wallet.address,
                                        chainId: state.chainId,
                                        rawData: rawData
                                    });
                                }
                                resultMessage = JSON.parse(rawData).transactionHash;
                            }
                        } else {
                            rawData = await connectClient.getArbitarySignRawData(Wallet, state.data);
                            code = 1;
                            resultMessage = 'Signature is completed.';

                            await connectClient.approve(JSON.parse(state.session), state.data, {
                                address: wallet.address,
                                chainId: state.chainId,
                                rawData: rawData
                            });
                        }

                        setTransactionResult({ ...transactionResult, code: code, result: resultMessage });
                        break;
                    default:
                        break;
                }
            } catch (error) {
                console.log('ERROR : ', error);
                setTransactionResult({ ...transactionResult, code: -1, result: String(error) });
            }
        };
        transaction();
    }, [mnemonic]);

    const handleMoveToWeb = (uri: string) => {
        navigation.navigate(Screens.WebScreen, { uri: uri });
    };

    const handleBack = () => {
        switch (state.type) {
            case TRANSACTION_TYPE['SEND']:
                navigation.reset({ routes: [{ name: Screens.Home }] });
                break;
            case TRANSACTION_TYPE['DELEGATE']:
            case TRANSACTION_TYPE['REDELEGATE']:
            case TRANSACTION_TYPE['UNDELEGATE']:
                navigation.navigate(Screens.Validator, {
                    validatorAddress: state.operatorAddressDst
                });
                break;
            case TRANSACTION_TYPE['GRANT']:
            case TRANSACTION_TYPE['REVOKE']:
                navigation.navigate(Screens.Staking);
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
