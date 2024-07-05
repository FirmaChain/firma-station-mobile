import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderColor, BoxColor, Lato, PointLightColor, TextCatTitleColor, TextColor } from '@/constants/theme';
import { RESTAKE_STATUS } from '@/constants/common';
import { ForwardArrow } from '@/components/icon/icon';
import { IStakingState } from '@/hooks/staking/hooks';
import { useIsFocused } from '@react-navigation/native';
import { convertTimerText } from '@/util/common';
import { useAppSelector } from '@/redux/hooks';
import { CHAIN_NETWORK } from '@/../config';

interface IProps {
    moveToRestake: () => void;
    stakingState: IStakingState | null;
    grantStates: boolean | null;
}

const defaultColor = RESTAKE_STATUS['NO_DELEGATION'].color;

const RestakeInfoBox = ({ moveToRestake, stakingState, grantStates }: IProps) => {
    const isFocused = useIsFocused();
    const { storage } = useAppSelector((state) => state);
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
            const result = await fetch(CHAIN_NETWORK[storage.network].RESTAKE_API);
            const json = await result.json();
            setRestakeInfoJson(json);
        } catch (error) {
            console.log(error);
        }
    };

    const handleRestakeProgress = useCallback(() => {
        let result = convertTimerText(restakeInfoJson.nextRoundDateTime);
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
        return (
            <Text style={[styles.label, { backgroundColor: restakeStatus.color + '30', color: restakeStatus.color }]}>
                {restakeStatus.title}
            </Text>
        );
    }, [restakeStatus]);

    return (
        <TouchableOpacity style={styles.restakeButtonBox} disabled={!delegationState} onPress={() => moveToRestake()}>
            <View style={styles.infoBox}>
                <Text style={styles.title}>Restake</Text>
                <View style={[styles.infoBox, { justifyContent: 'flex-end', paddingHorizontal: delegationState !== null ? 10 : 0 }]}>
                    {delegationState !== null && delegationState && (
                        <Text style={[styles.label, { backgroundColor: defaultColor + '30', color: defaultColor, marginRight: 6 }]}>
                            {nextRoundDateTime}
                        </Text>
                    )}
                    {renderLabel()}
                </View>
            </View>
            {delegationState !== null && delegationState && <ForwardArrow size={20} color={TextCatTitleColor} />}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    restakeEmptyButtonBox: {
        padding: 0,
        marginTop: 0,
        maxHeight: 0
    },
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
    activeInfoBox: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginRight: 15
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
    },
    background: {
        flex: 100,
        height: 6,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: BorderColor,
        borderRadius: 8,
        position: 'relative',
        overflow: 'hidden'
    },
    percentage: {
        height: 6,
        borderRadius: 8,
        backgroundColor: PointLightColor
    }
});

export default React.memo(RestakeInfoBox);
