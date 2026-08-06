import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CHAIN_NETWORK } from '@/../config';
import { RESTAKE_STATUS } from '@/constants/common';
import {
    //   BorderColor,
    BoxColor,
    Lato,
    //   PointLightColor,
    TextCatTitleColor,
    TextColor
} from '@/constants/theme';
import { useAppSelector } from '@/redux/hooks';
import { convertTimerText } from '@/util/common';
import { useIsFocused } from '@react-navigation/native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { IStakingState } from '@/hooks/staking/hooks';
import { ForwardArrow } from '@/components/icon/icon';

interface IProps {
    moveToRestake: () => void;
    stakingState: IStakingState | null;
    grantStates: boolean | null;
}

const defaultColor = RESTAKE_STATUS['NO_DELEGATION'].color;

const RestakeInfoBox = ({ moveToRestake, stakingState, grantStates }: IProps) => {
    const { network } = useAppSelector((state) => state.storage);

    const isFocused = useIsFocused();

    // FIXME: Restake API responses do not publish a stable interface.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [restakeInfoJson, setRestakeInfoJson]: any = useState(null);
    const [nextRoundDateTime, setNextRoundTime] = useState('00:00:00');

    const stakingGrantExist = useMemo(() => {
        return grantStates;
    }, [grantStates]);

    const delegationState = useMemo(() => {
        if (stakingState === null) return null;
        return stakingState.delegated > 0;
    }, [stakingState]);

    const restakeStatus = useMemo(() => {
        if (stakingGrantExist === null || delegationState === null)
            return {
                title: ' ',
                color: BoxColor
            };
        if (delegationState === false) {
            return RESTAKE_STATUS['NO_DELEGATION'];
        } else {
            if (stakingGrantExist) {
                return RESTAKE_STATUS['ACTIVE'];
            } else {
                return RESTAKE_STATUS['INACTIVE'];
            }
        }
    }, [delegationState, stakingGrantExist]);

    const getRestakeInfo = async () => {
        try {
            const result = await fetch(CHAIN_NETWORK[network].RESTAKE_API);
            const json = await result.json();
            setRestakeInfoJson(json);
        } catch (error) {
            console.error(error);
        }
    };

    const handleRestakeProgress = useCallback(() => {
        const result = convertTimerText(restakeInfoJson.nextRoundDateTime);
        if (result.diff <= 0) {
            getRestakeInfo();
            return;
        }
        setNextRoundTime(result.time);
    }, [restakeInfoJson]);

    useEffect(() => {
        let timerId: NodeJS.Timeout;
        if (restakeInfoJson) {
            handleRestakeProgress();
            timerId = setTimeout(function progress() {
                handleRestakeProgress();
                timerId = setTimeout(progress, 1000);
            }, 1000);
        }
        return () => {
            clearTimeout(timerId);
        };
    }, [restakeInfoJson]);

    useEffect(() => {
        if (isFocused) {
            getRestakeInfo();
        } else {
            setRestakeInfoJson(null);
        }
    }, [isFocused, grantStates]);

    const renderLabel = useCallback(() => {
        const inlineStyles1 = {
            inlineStyle1: { backgroundColor: restakeStatus.color + '30', color: restakeStatus.color }
        } as const;

        return <Text style={[styles.label, inlineStyles1.inlineStyle1]}>{restakeStatus.title}</Text>;
    }, [restakeStatus]);

    const inlineStyles2 = {
        inlineStyle1: { justifyContent: 'flex-end', paddingHorizontal: delegationState !== null ? 10 : 0 },
        inlineStyle2: { backgroundColor: defaultColor + '30', color: defaultColor, marginRight: 6 }
    } as const;

    return (
        <TouchableOpacity style={styles.restakeButtonBox} disabled={!delegationState} onPress={() => moveToRestake()}>
            <View style={styles.infoBox}>
                <Text style={styles.title}>Restake</Text>
                <View style={[styles.infoBox, inlineStyles2.inlineStyle1]}>
                    {delegationState !== null && delegationState && (
                        <Text style={[styles.label, inlineStyles2.inlineStyle2]}>{nextRoundDateTime}</Text>
                    )}
                    {renderLabel()}
                </View>
            </View>
            {delegationState !== null && delegationState && <ForwardArrow size={20} color={TextCatTitleColor} />}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    restakeButtonBox: {
        padding: 20,
        marginTop: 12,
        backgroundColor: BoxColor,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxHeight: 500
    },
    infoBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    title: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextColor,
        textAlign: 'center'
    },
    label: {
        fontFamily: Lato,
        fontSize: 13,
        borderRadius: 10,
        textAlign: 'center',
        overflow: 'hidden',
        paddingHorizontal: 10,
        paddingVertical: 3
    }
});

export default React.memo(RestakeInfoBox);
