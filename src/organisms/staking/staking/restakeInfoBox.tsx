import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderColor, BoxColor, InputPlaceholderColor, Lato, PointLightColor, TextCatTitleColor, TextColor } from '@/constants/theme';
import { RESTAKE_STATUS } from '@/constants/common';
import { ForwardArrow } from '@/components/icon/icon';
import { IStakingGrantState } from '@/hooks/staking/hooks';
import { useIsFocused } from '@react-navigation/native';
import { convertTimerText } from '@/util/common';
import { useAppSelector } from '@/redux/hooks';
import { CHAIN_NETWORK } from '@/../config';

interface IProps {
    moveToRestake: () => void;
    delegationStates: boolean;
    grantStates: IStakingGrantState;
}

const RestakeInfoBox = ({ moveToRestake, delegationStates, grantStates }: IProps) => {
    const { storage } = useAppSelector((state) => state);
    const isFocused = useIsFocused();
    const defaultColor = RESTAKE_STATUS['NO_DELEGATION'].color;
    const [restakeInfoJson, setRestakeInfoJson]: any = useState(null);
    const [nextRoundDateTime, setNextRoundTime] = useState('00:00:00');

    const stakingGrantExist = useMemo(() => {
        if (grantStates.list.length > 0) {
            let activation = grantStates.list.filter((value) => value.isActive);
            return activation.length > 0;
        }
        return false;
    }, [grantStates]);

    const restakeStatus = useMemo(() => {
        if (delegationStates === false) {
            return RESTAKE_STATUS['NO_DELEGATION'];
        } else {
            if (stakingGrantExist) {
                return RESTAKE_STATUS['ACTIVE'];
            } else {
                return RESTAKE_STATUS['INACTIVE'];
            }
        }
    }, [delegationStates, stakingGrantExist]);

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
        if (isFocused) {
            getRestakeInfo();
        } else {
            setRestakeInfoJson(null);
        }
    }, [isFocused, grantStates]);

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

    return (
        <TouchableOpacity style={styles.restakeButtonBox} disabled={!delegationStates} onPress={() => moveToRestake()}>
            <View style={styles.infoBox}>
                <Text style={styles.title}>Restake</Text>
                <View style={[styles.infoBox, { justifyContent: 'flex-end', paddingHorizontal: delegationStates ? 10 : 0 }]}>
                    {stakingGrantExist && (
                        <Text style={[styles.label, { backgroundColor: defaultColor + '30', color: defaultColor, marginRight: 6 }]}>
                            {nextRoundDateTime}
                        </Text>
                    )}
                    <Text style={[styles.label, { backgroundColor: restakeStatus.color + '30', color: restakeStatus.color }]}>
                        {restakeStatus.title}
                    </Text>
                </View>
            </View>
            {delegationStates && <ForwardArrow size={20} color={TextCatTitleColor} />}
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
        justifyContent: 'space-between'
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

export default RestakeInfoBox;
