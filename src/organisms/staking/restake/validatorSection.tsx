import { Fragment, useMemo } from 'react';
import { CHAIN_SYMBOL, RESTAKE_STATUS } from '@/constants/common';
import { BgColor, Lato, RestakeActiveColor, RestakeNoDelegationColor, TextColor, TextDisableColor } from '@/constants/theme';
import { convertAmount, convertNumber } from '@/util/common';
import { FirmaUtil } from '@firmachain/firma-js';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import ValidatorProfile from '@/components/parts/validatorProfile';

interface IProps {
    // FIXME: Validator records are supplied by external chain modules without a stable schema.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    minimumRewards: number;
}

const ValidatorSection = ({ data, minimumRewards }: IProps) => {
    const _CHAIN_SYMBOL = CHAIN_SYMBOL();

    const state = useMemo(() => {
        return {
            avatarURL: data.avatarURL,
            moniker: data.moniker,
            delegated: data.delegated,
            reward: data.stakingReward,
            granted: data.isActive
        };
    }, [data]);

    const isRestakeActive = useMemo(() => {
        return convertNumber(FirmaUtil.getFCTStringFromUFCT(state.reward)) >= convertNumber(minimumRewards);
    }, [state, minimumRewards]);

    const isGranted = useMemo(() => {
        return state.granted && state.delegated > 0;
    }, [state]);

    const restakeStatus = useMemo(() => {
        if (state.delegated <= 0) {
            return RESTAKE_STATUS['NO_DELEGATION'];
        } else {
            if (state.granted) {
                return RESTAKE_STATUS['ACTIVE'];
            } else {
                return RESTAKE_STATUS['INACTIVE'];
            }
        }
    }, [state]);

    const inlineStyles1 = {
        inlineStyle1: { justifyContent: 'flex-end' },
        inlineStyle2: { fontSize: 12, fontWeight: '400', color: RestakeNoDelegationColor },
        inlineStyle3: {
            backgroundColor: restakeStatus.color + '30',
            color: restakeStatus.color,
            marginLeft: 6
        }
    } as const;

    return (
        <Pressable style={styles.box}>
            <View style={styles.monikerWrapperH}>
                <ValidatorProfile uri={state.avatarURL} size={20} customStyle={styles.inlineStyle5} />
                <Text numberOfLines={1} ellipsizeMode="middle" style={styles.moniker}>
                    {state.moniker}
                </Text>
            </View>
            <View style={[styles.wrapperH, inlineStyles1.inlineStyle1]}>
                {isGranted ? (
                    <Fragment>
                        <View style={[styles.dot, isRestakeActive ? styles.inlineStyle1 : styles.inlineStyle2]} />
                        <Text style={[styles.value, isRestakeActive ? styles.inlineStyle3 : styles.inlineStyle4]}>
                            {convertAmount({ value: state.reward })}
                            <Text style={inlineStyles1.inlineStyle2}>{` / ${minimumRewards} ${_CHAIN_SYMBOL}`}</Text>
                        </Text>
                    </Fragment>
                ) : (
                    <Text style={[styles.label, inlineStyles1.inlineStyle3]}>{restakeStatus.title}</Text>
                )}
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    inlineStyle1: { backgroundColor: RestakeActiveColor },
    inlineStyle2: { backgroundColor: RestakeNoDelegationColor + '80' },
    inlineStyle3: { color: RestakeActiveColor },
    inlineStyle4: { color: RestakeNoDelegationColor },
    inlineStyle5: { marginRight: 7 },
    box: {
        width: '100%',
        backgroundColor: BgColor,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    monikerWrapperH: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderRadius: 50,
        paddingBottom: 5
    },
    wrapperH: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    moniker: {
        flex: 1,
        fontFamily: Lato,
        fontSize: 16,
        color: TextColor
    },
    value: {
        fontFamily: Lato,
        fontSize: 16,
        fontWeight: '600',
        color: TextDisableColor,
        paddingLeft: 10
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 50
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

export default ValidatorSection;
