import React, { useMemo, useState } from 'react';
import { BgColor, Lato, RestakeActiveColor, RestakeNoDelegationColor, TextColor, TextDisableColor } from '@/constants/theme';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { VALIDATOR_PROFILE } from '@/constants/images';
import { convertAmount, convertNumber } from '@/util/common';
import { CHAIN_SYMBOL, RESTAKE_STATUS } from '@/constants/common';
import { FirmaUtil } from '@firmachain/firma-js';

interface IProps {
    data: any;
    minimumRewards: number;
}

const ValidatorSection = ({ data, minimumRewards }: IProps) => {
    const _CHAIN_SYMBOL = CHAIN_SYMBOL();

    const [avatarError, setAvatarError] = useState(false);

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

    return (
        <Pressable style={styles.box}>
            <View style={styles.monikerWrapperH}>
                <Image
                    style={styles.avatar}
                    onError={() => {
                        setAvatarError(true);
                    }}
                    source={
                        avatarError || state.avatarURL === null || state.avatarURL === '' ? VALIDATOR_PROFILE : { uri: state.avatarURL }
                    }
                />
                <Text numberOfLines={1} ellipsizeMode="middle" style={styles.moniker}>
                    {state.moniker}
                </Text>
            </View>
            <View style={[styles.wrapperH, { justifyContent: 'flex-end' }]}>
                {isGranted ? (
                    <React.Fragment>
                        <View
                            style={[
                                styles.dot,
                                isRestakeActive
                                    ? { backgroundColor: RestakeActiveColor }
                                    : { backgroundColor: RestakeNoDelegationColor + '80' }
                            ]}
                        />
                        <Text style={[styles.value, isRestakeActive ? { color: RestakeActiveColor } : { color: RestakeNoDelegationColor }]}>
                            {convertAmount(state.reward, true, 2)}
                            <Text
                                style={{ fontSize: 12, fontWeight: 'normal', color: RestakeNoDelegationColor }}
                            >{` / ${minimumRewards} ${_CHAIN_SYMBOL}`}</Text>
                        </Text>
                    </React.Fragment>
                ) : (
                    <Text
                        style={[styles.label, { backgroundColor: restakeStatus.color + '30', color: restakeStatus.color, marginLeft: 6 }]}
                    >
                        {restakeStatus.title}
                    </Text>
                )}
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    box: {
        width: '100%',
        backgroundColor: BgColor,
        padding: 20,
        marginBottom: 1,
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
    avatar: {
        width: 20,
        maxWidth: 20,
        height: 20,
        borderRadius: 50,
        overflow: 'hidden',
        marginRight: 7
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
