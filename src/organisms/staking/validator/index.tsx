import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { CommonActions, StakingActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import {
    IStakingState,
    IValidatorData,
    IValidatorDescription,
    useDelegationData,
    useValidatorDataFromAddress
} from '@/hooks/staking/hooks';
import { getStakingFromvalidator } from '@/util/firma';
import { BgColor, BoxColor, FailedColor, Lato } from '@/constants/theme';
import { DATA_RELOAD_INTERVAL, IKeyValue, TRANSACTION_TYPE, TYPE_COLORS } from '@/constants/common';
import { useInterval } from '@/hooks/common/hooks';
import RefreshScrollView from '@/components/parts/refreshScrollView';
import Container from '@/components/parts/containers/conatainer';
import ViewContainer from '@/components/parts/containers/viewContainer';
import DescriptionBox from './descriptionBox';
import DelegationBox from './delegationBox';
import PercentageBox from './percentageBox';
import AddressBox from './addressBox';
import Progress from '@/components/parts/progress';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Validator>;

interface IProps {
    validatorAddress: string;
}

const Validator = ({ validatorAddress }: IProps) => {
    const navigation: ScreenNavgationProps = useNavigation();

    const { wallet, common } = useAppSelector((state) => state);
    const { validatorState, handleValidatorPolling } = useValidatorDataFromAddress(validatorAddress);
    const { delegationState, handleTotalDelegationPolling } = useDelegationData();

    const [stakingState, setStakingState] = useState<IStakingState | null>(null);

    const delegationLength = useMemo(() => {
        return delegationState.length;
    }, [delegationState]);

    const Validator = useMemo(() => {
        return validatorState;
    }, [validatorState]);

    const ValidatorDescription: IValidatorDescription | undefined = useMemo(() => {
        if (Validator === undefined) return undefined;
        return Validator.description;
    }, [Validator]);

    const ValidatorPercentageData: IValidatorData | undefined = useMemo(() => {
        if (Validator === undefined) return undefined;
        return Validator.percentageData;
    }, [Validator]);

    const ValidatorOperatorAddress = useMemo(() => {
        if (Validator === undefined) return '';
        return Validator.address.operatorAddress;
    }, [Validator]);

    const ValidatorAccountAddress = useMemo(() => {
        if (Validator === undefined) return '';
        return Validator.address.accountAddress;
    }, [Validator]);

    const openLoadingProgress = useMemo(() => {
        return stakingState === null || Validator === undefined;
    }, [stakingState, Validator]);

    const AlertText = useMemo(() => {
        if (Validator !== undefined) {
            if (Validator.tombstoned === true) return 'TOMBSTONED';
            if (Validator.status === 0) return 'UNKNOWN';
            if (Validator.status === 1) return 'UNBONDED';
            if (Validator.status === 2 && Validator.jailed === false) return 'UNBONDING';
            if (Validator.status === 2 && Validator.jailed === true) return 'JAILED';
        }
        return '';
    }, [Validator]);

    const AlertColor = useMemo(() => {
        switch (AlertText) {
            case 'UNKNOWN':
            case 'UNBONDED':
                return TYPE_COLORS['zero'];
            case 'UNBONDING':
                return TYPE_COLORS['three'];
            case 'JAILED':
                return TYPE_COLORS['two'];
            case 'TOMBSTONED':
                return FailedColor;
        }
    }, [AlertText]);

    const handleWithdraw = (password: string, gas: number) => {
        const transactionState = {
            type: TRANSACTION_TYPE['WITHDRAW'],
            password: password,
            operatorAddress: validatorAddress,
            gas: gas
        };
        navigation.navigate(Screens.Transaction, { state: transactionState });
    };

    const moveToDelegate = (type: string) => {
        let delegateState: IKeyValue = {
            type: type,
            operatorAddress: validatorAddress
        };

        navigation.navigate(Screens.Delegate, { state: delegateState });
    };

    const handleDelegateState = async () => {
        try {
            const state = await getStakingFromvalidator(wallet.address, validatorAddress);

            setStakingState({
                available: state.available,
                delegated: state.delegated,
                undelegate: state.undelegate,
                stakingReward: state.stakingReward
            });
        } catch (error) {
            throw error;
        }
    };

    const refreshStates = async () => {
        try {
            await Promise.all([handleDelegateState(), handleTotalDelegationPolling(), handleValidatorPolling()]);
        } catch (error) {
            CommonActions.handleDataLoadStatus(common.dataLoadStatus + 1);
            console.log(error);
        }
    };

    useInterval(
        () => {
            refreshStates();
        },
        common.dataLoadStatus > 0 ? DATA_RELOAD_INTERVAL : null,
        true
    );

    const handleMoveToWeb = (uri: string) => {
        navigation.navigate(Screens.WebScreen, { uri: uri });
    };

    const handleBack = () => {
        navigation.goBack();
    };

    useEffect(() => {
        if (Validator) {
            StakingActions.updateValidatorState(Validator);
        }
    }, [Validator]);

    useEffect(() => {
        if (stakingState !== null) {
            if (stakingState.stakingReward > 0) {
                StakingActions.updateDelegateState({
                    address: validatorAddress,
                    reward: stakingState.stakingReward * 1000000
                });
            }
        }
    }, [stakingState]);

    useFocusEffect(
        useCallback(() => {
            refreshStates();
        }, [])
    );

    return (
        <Fragment>
            <Container titleOn={false} bgColor={BoxColor} backEvent={handleBack}>
                <ViewContainer bgColor={BgColor}>
                    <RefreshScrollView refreshFunc={refreshStates} background={BoxColor}>
                        <View style={{ backgroundColor: BoxColor }}>
                            <Fragment>
                                <View style={styles.jailedBox}>
                                    <Text
                                        style={[
                                            styles.jailedText,
                                            { display: AlertText !== '' ? 'flex' : 'none', backgroundColor: AlertColor }
                                        ]}
                                    >
                                        {AlertText}
                                    </Text>
                                </View>
                                <DescriptionBox validator={ValidatorDescription} />
                                <DelegationBox
                                    walletName={wallet.name}
                                    validatorAddress={validatorAddress}
                                    stakingState={stakingState}
                                    delegations={delegationLength}
                                    handleDelegate={moveToDelegate}
                                    transactionHandler={handleWithdraw}
                                />
                                <View style={styles.infoBox}>
                                    <PercentageBox data={ValidatorPercentageData} />
                                    <AddressBox
                                        title={'Operator address'}
                                        path={'validators'}
                                        address={ValidatorOperatorAddress}
                                        handleExplorer={handleMoveToWeb}
                                    />
                                    <AddressBox
                                        title={'Account address'}
                                        path={'accounts'}
                                        address={ValidatorAccountAddress}
                                        handleExplorer={handleMoveToWeb}
                                    />
                                </View>
                            </Fragment>
                        </View>
                    </RefreshScrollView>
                </ViewContainer>
            </Container>
            {openLoadingProgress && <Progress />}
        </Fragment>
    );
};

const styles = StyleSheet.create({
    infoBox: {
        backgroundColor: BgColor,
        paddingTop: 30
    },
    jailedBox: {
        paddingHorizontal: 20,
        marginTop: -10,
        paddingTop: 10,
        backgroundColor: BoxColor,
        alignItems: 'center',
        justifyContent: 'center'
    },
    jailedText: {
        borderRadius: 8,
        overflow: 'hidden',
        paddingHorizontal: 20,
        paddingVertical: 5,
        fontFamily: Lato,
        fontSize: 16,
        textAlign: 'center',
        color: BoxColor
    }
});

export default Validator;
