import React, { useEffect, useMemo, useState } from 'react';
import { CHAIN_NETWORK } from '@/../config';
import { CHAIN_SYMBOL, RESTAKE_STATUS } from '@/constants/common';
import { BoxColor, GrayColor, Lato, RestakeActiveColor, TextCatTitleColor, TextGrayColor } from '@/constants/theme';
import { useAppSelector } from '@/redux/hooks';
import { convertAmount, convertNumber, convertTimerText, createOrdinal } from '@/util/common';
import { FirmaUtil } from '@firmachain/firma-js';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { IStakingGrantState } from '@/hooks/staking/hooks';
import { DownArrow, ForwardArrow } from '@/components/icon/icon';

interface IProps {
    grantState: IStakingGrantState;
    minimumRewards: number;
    nextRound: number;
    nextRoundTime: string;
    handleOpenListModal: (open: boolean) => void;
    handleRefresh: (progress: boolean) => void;
}

const NextRoundCard = ({ grantState, minimumRewards, nextRound, nextRoundTime, handleOpenListModal, handleRefresh }: IProps) => {
    const defaultColor = RESTAKE_STATUS['NO_DELEGATION'].color;

    const { network } = useAppSelector((state) => state.storage);

    const _CHAIN_SYMBOL = CHAIN_SYMBOL();

    const [nextRoundDateTime, setNextRoundTime] = useState('00:00:00');

    useEffect(() => {
        let timerId: NodeJS.Timeout;
        let refreshTimer = 0;
        if (nextRoundTime !== '') {
            const handleProgress = () => {
                refreshTimer = refreshTimer + 1;
                const result = convertTimerText(nextRoundTime);
                setNextRoundTime(result.time);
                if (result.diff < 0) {
                    refreshTimer = 0;
                    handleRefresh(true);
                }
            };
            handleProgress();
            timerId = setTimeout(function progress() {
                handleProgress();
                timerId = setTimeout(progress, 1000);
            }, 1000);
        }

        return () => {
            clearTimeout(timerId);
        };
    }, [nextRoundTime]);

    const grantExist = useMemo(() => {
        if (grantState.list.length > 0) {
            const activation = grantState.list.filter((value) => value.isActive);
            return activation.length > 0;
        }
    }, [grantState]);

    const expectationReward = useMemo(() => {
        let amount = 0;
        if (grantState.list.length > 0) {
            grantState.list
                .filter((value) => convertNumber(FirmaUtil.getFCTStringFromUFCT(value.stakingReward)) > minimumRewards)
                .map((value) => {
                    amount += value.stakingReward;
                });
        }

        return `${convertAmount({ value: amount })} ${_CHAIN_SYMBOL}`;
    }, [grantState]);

    const totalCount = useMemo(() => {
        return grantState.list.length;
    }, [grantState]);

    const expectationCount = useMemo(() => {
        let count = 0;
        if (totalCount > 0) {
            count = grantState.list.filter(
                (value) => convertNumber(FirmaUtil.getFCTStringFromUFCT(value.stakingReward)) > minimumRewards && value.isActive === true
            ).length;
        }
        return count;
    }, [totalCount, grantState]);

    const handleMoveToWeb = () => {
        Linking.openURL(CHAIN_NETWORK[network].RESTAKE_URL);
    };

    const inlineStyles1 = {
        inlineStyle1: { paddingBottom: 20 },
        inlineStyle2: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
        inlineStyle3: { fontSize: 16, color: TextCatTitleColor },
        inlineStyle4: { flexDirection: 'row', alignItems: 'flex-start' },
        inlineStyle5: { fontSize: 13, opacity: 0.7 },
        inlineStyle6: { fontSize: 10, opacity: 0.7 },
        inlineStyle7: { fontSize: 13, opacity: 0.7 },
        inlineStyle8: { backgroundColor: defaultColor + '30', color: defaultColor, marginLeft: 6 },
        inlineStyle9: { paddingRight: 6 },
        inlineStyle10: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
        inlineStyle11: { fontSize: 16, color: TextCatTitleColor }
    } as const;

    return (
        <React.Fragment>
            {grantExist ? (
                <View style={styles.infoBox}>
                    <TouchableOpacity style={[styles.wrapper, inlineStyles1.inlineStyle1]} onPress={handleMoveToWeb}>
                        <View style={inlineStyles1.inlineStyle2}>
                            <Text style={[styles.text, inlineStyles1.inlineStyle3]}>{'Next Round'}</Text>
                            <View style={inlineStyles1.inlineStyle4}>
                                <Text style={[styles.text, inlineStyles1.inlineStyle5]}>{`  (${nextRound}`}</Text>
                                <Text style={[styles.text, inlineStyles1.inlineStyle6]}>{`${createOrdinal(nextRound)}`}</Text>
                                <Text style={[styles.text, inlineStyles1.inlineStyle7]}>{')'}</Text>
                            </View>
                        </View>
                        <ForwardArrow size={16} color={TextCatTitleColor} />
                    </TouchableOpacity>
                    <View style={styles.wrapper}>
                        <Text style={styles.text}>{'Remaining Time'}</Text>
                        <Text style={[styles.label, inlineStyles1.inlineStyle8]}>{nextRoundDateTime}</Text>
                    </View>
                    <View style={styles.wrapper}>
                        <Text style={styles.text}>{'Restake Amount'}</Text>
                        <Text style={styles.text}>{expectationReward}</Text>
                    </View>
                    <View style={styles.wrapper}>
                        <Text style={styles.text}>{'Restake Validators'}</Text>
                        <TouchableOpacity style={styles.textButton} onPress={() => handleOpenListModal(true)}>
                            <Text style={[styles.text, expectationCount > 0 ? styles.inlineStyle1 : styles.inlineStyle2]}>
                                {expectationCount}
                            </Text>
                            <Text style={[styles.text, inlineStyles1.inlineStyle9]}>{'/' + totalCount}</Text>
                            <DownArrow size={12} color={GrayColor} />
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <View style={styles.infoBox}>
                    <TouchableOpacity style={styles.wrapper} onPress={handleMoveToWeb}>
                        <View style={inlineStyles1.inlineStyle10}>
                            <Text style={[styles.text, inlineStyles1.inlineStyle11]}>{'More Information'}</Text>
                        </View>
                        <ForwardArrow size={16} color={TextCatTitleColor} />
                    </TouchableOpacity>
                </View>
            )}
        </React.Fragment>
    );
};

const styles = StyleSheet.create({
    inlineStyle1: { color: RestakeActiveColor },
    inlineStyle2: {},
    infoBox: {
        marginVertical: 10,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
        borderRadius: 8,
        backgroundColor: BoxColor
    },
    wrapper: {
        paddingBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    text: {
        fontFamily: Lato,
        fontSize: 14,
        fontWeight: '400',
        color: TextGrayColor
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
    textButton: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});

export default NextRoundCard;
