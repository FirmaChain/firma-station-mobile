import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CHAIN_SYMBOL, RESTAKE_STATUS } from '@/constants/common';
import { IStakeInfo, IStakingGrantState } from '@/hooks/staking/hooks';
import { BorderColor, Lato, TextGrayColor } from '@/constants/theme';
import { convertTime } from '@/util/common';

interface IProps {
    grantState: IStakingGrantState;
    delegationState: Array<IStakeInfo> | null;
    minimumRewards: number;
}

const StatusBox = ({ grantState, delegationState, minimumRewards }: IProps) => {
    const _CHAIN_SYMBOL = CHAIN_SYMBOL();

    const grantExist = useMemo(() => {
        if (grantState.list.length > 0) {
            let activation = grantState.list.filter((value) => value.isActive);
            return activation.length > 0;
        }
    }, [grantState]);

    const delegationExist = useMemo(() => {
        if (delegationState === null) return null;
        return delegationState.length > 0;
    }, [delegationState]);

    const restakeStatus = useMemo(() => {
        if (delegationExist === false) {
            return RESTAKE_STATUS['NO_DELEGATION'];
        } else {
            if (grantExist) {
                return RESTAKE_STATUS['ACTIVE'];
            } else {
                return RESTAKE_STATUS['INACTIVE'];
            }
        }
    }, [grantExist, delegationExist]);

    const conditions = useMemo(() => {
        return `${minimumRewards} ${_CHAIN_SYMBOL} (per validator)`;
    }, [minimumRewards]);

    return (
        <View>
            <View style={styles.wrapper}>
                <Text style={styles.text}>Restake Status</Text>
                <Text
                    style={[
                        styles.label,
                        {
                            backgroundColor: restakeStatus.color + '30',
                            color: restakeStatus.color,
                            opacity: delegationExist === null ? 0 : 1
                        }
                    ]}
                >
                    {restakeStatus.title}
                </Text>
            </View>
            {grantExist && (
                <React.Fragment>
                    <View style={[styles.wrapper, { paddingBottom: 10 }]}>
                        <Text style={styles.text}>{'Expiry Date '}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.text}>{convertTime(grantState.expire, false, false)}</Text>
                        </View>
                    </View>
                    <View style={[styles.wrapper, { paddingBottom: 10 }]}>
                        <Text style={styles.text}>{'Minimum Rewards'}</Text>
                        <Text style={styles.text}>{conditions}</Text>
                    </View>
                </React.Fragment>
            )}
            <View style={styles.dashedBorder} />
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        paddingBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    text: {
        fontFamily: Lato,
        fontSize: 14,
        fontWeight: 'normal',
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
    dashedBorder: {
        width: '100%',
        borderColor: BorderColor,
        borderWidth: 1,
        borderStyle: 'dashed',
        marginVertical: 10
    }
});

export default StatusBox;
