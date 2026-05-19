import { DarkGrayColor, Lato, TextColor } from '@/constants/theme';
import { StyleSheet, Text, View } from 'react-native';

import { ForwardArrow } from '@/components/icon/icon';
import ValidatorProfile from '@/components/parts/validatorProfile';

interface IProps {
    validator: {
        avatarURL: string;
        moniker: string;
    };
}

const MonikerSection = ({ validator }: IProps) => {
    return (
        <View style={[styles.vdWrapperH, { alignItems: 'center' }]}>
            <View style={styles.monikerWrapperH}>
                <ValidatorProfile uri={validator.avatarURL} size={32} customStyle={{ marginRight: 10 }} />
                <Text numberOfLines={1} ellipsizeMode="middle" style={styles.moniker}>
                    {validator.moniker}
                </Text>
            </View>
            <ForwardArrow size={24} color={DarkGrayColor} />
        </View>
    );
};

const styles = StyleSheet.create({
    vdWrapperH: {
        paddingHorizontal: 20,
        paddingVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    monikerWrapperH: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingRight: 20,
        borderRadius: 50
    },
    moniker: {
        flex: 1,
        fontFamily: Lato,
        fontSize: 18,
        fontWeight: '600',
        color: TextColor
    }
});

export default MonikerSection;
