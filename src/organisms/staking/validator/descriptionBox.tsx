import React, { useMemo } from 'react';
import { BoxColor, DisableColor, Lato, TextCatTitleColor, TextColor, TextDarkGrayColor } from '@/constants/theme';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { IValidatorDescription } from '@/hooks/staking/hooks';
import ValidatorProfile from '@/components/parts/validatorProfile';

interface IProps {
    validator: IValidatorDescription | undefined;
}

const DescriptionBox = ({ validator }: IProps) => {
    const Avatar = useMemo(() => {
        if (validator === undefined) return '';
        return validator.avatar;
    }, [validator]);

    const Description = useMemo(() => {
        if (validator === undefined) return '';
        return validator.description;
    }, [validator]);

    const Website = useMemo(() => {
        if (validator === undefined) return '';
        return validator.website;
    }, [validator]);

    const Moniker = useMemo(() => {
        if (validator === undefined) return '';
        return validator.moniker;
    }, [validator]);

    const MonikerPaddingBottom = useMemo(() => {
        if (Description !== '' || Website !== '') return 8;
        return 0;
    }, [Description, Website]);

    const handleUrl = async (url: string) => {
        let urlValid = url;
        if (urlValid.includes('://') === false) urlValid = 'https://' + urlValid;
        await Linking.openURL(urlValid);
    };

    return (
        <View style={[styles.boxH, { backgroundColor: BoxColor, paddingHorizontal: 20, paddingTop: 10 }]}>
            <ValidatorProfile uri={Avatar} size={68} customStyle={{ marginRight: 10 }} />
            <View style={[styles.boxV, { flex: 1 }]}>
                <Text numberOfLines={2} ellipsizeMode="tail" style={[styles.moniker, { paddingBottom: MonikerPaddingBottom }]}>
                    {Moniker}
                </Text>
                {Description !== '' && <Text style={styles.desc}>{Description}</Text>}
                {Website !== '' && (
                    <TouchableOpacity onPress={() => handleUrl(Website)}>
                        <Text style={styles.url}>{Website}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    boxH: {
        flexDirection: 'row'
    },
    boxV: {
        alignItems: 'flex-start'
    },
    moniker: {
        width: '100%',
        fontSize: 24,
        fontFamily: Lato,
        fontWeight: 'bold',
        color: TextColor
    },
    desc: {
        width: 'auto',
        color: TextDarkGrayColor,
        fontSize: 16,
        paddingBottom: 12
    },
    url: {
        width: '100%',
        paddingVertical: 4,
        paddingHorizontal: 12,
        backgroundColor: DisableColor,
        borderRadius: 4,
        overflow: 'hidden',
        color: TextCatTitleColor,
        fontSize: 14
    }
});

export default DescriptionBox;
