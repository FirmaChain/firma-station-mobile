import { DarkGrayColor, Lato, TextColor, TextDarkGrayColor } from '@/constants/theme';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { IRedelegationInfo } from '@/hooks/staking/hooks';
import { ForwardArrow, ForwardArrowWithTail } from '@/components/icon/icon';
import ValidatorProfile from '@/components/parts/validatorProfile';

interface IProps {
    validators: IRedelegationInfo;
    navigateValidator: (address: string) => void;
}

const MonikerSectionForRedelegate = ({ validators, navigateValidator }: IProps) => {
    return (
        <View style={[styles.vdWrapperH, styles.inlineStyle1]}>
            <TouchableOpacity style={styles.monikerWrapperH} onPress={() => navigateValidator(validators.srcAddress)}>
                <ValidatorProfile uri={validators.srcAvatarURL} size={32} customStyle={styles.inlineStyle3} />
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.moniker}>
                    {validators.srcMoniker}
                </Text>
            </TouchableOpacity>
            <View style={styles.inlineStyle2}>
                <ForwardArrowWithTail size={20} color={TextDarkGrayColor} />
            </View>
            <TouchableOpacity style={styles.monikerWrapperH} onPress={() => navigateValidator(validators.dstAddress)}>
                <ValidatorProfile uri={validators.dstAvatarURL} size={32} customStyle={styles.inlineStyle3} />
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.moniker}>
                    {validators.dstMoniker}
                </Text>
            </TouchableOpacity>
            <ForwardArrow size={24} color={DarkGrayColor} />
        </View>
    );
};

const styles = StyleSheet.create({
    inlineStyle1: { alignItems: 'center' },
    inlineStyle2: { paddingRight: 5 },
    inlineStyle3: { marginRight: 10 },
    vdWrapperH: {
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    monikerWrapperH: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingRight: 5,
        paddingVertical: 6
    },
    moniker: {
        flex: 1,
        fontFamily: Lato,
        fontSize: 18,
        fontWeight: '600',
        color: TextColor
    }
});

export default MonikerSectionForRedelegate;
