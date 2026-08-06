import { BgColor, Lato, TextCatTitleColor, VerifiedColor } from '@/constants/theme';
import { StyleSheet, Text, View } from 'react-native';

import { URLLockIcon, VerifiedCircle } from '@/components/icon/icon';

interface IProps {
    certifiedState: number;
    url: string;
}

const DappURLBox = ({ certifiedState, url }: IProps) => {
    return (
        <View style={styles.urlBox}>
            {certifiedState === 1 && (
                <View style={styles.inlineStyle1}>
                    <URLLockIcon size={16} color={TextCatTitleColor} />
                </View>
            )}
            {certifiedState === 2 && <VerifiedCircle size={18} color={VerifiedColor} />}
            <Text style={[styles.url, styles.inlineStyle2]} numberOfLines={1} ellipsizeMode={'middle'}>
                {url}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    inlineStyle1: { paddingVertical: 3, paddingHorizontal: 5 },
    inlineStyle2: { paddingBottom: 0, paddingHorizontal: 5 },
    urlBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 25,
        paddingVertical: 5,
        borderRadius: 15,
        backgroundColor: BgColor
    },
    url: {
        fontFamily: Lato,
        fontSize: 14,
        fontWeight: '700',
        color: TextCatTitleColor
    }
});

export default DappURLBox;
