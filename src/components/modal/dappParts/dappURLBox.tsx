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
                <View style={{ paddingVertical: 3, paddingHorizontal: 5 }}>
                    <URLLockIcon size={16} color={TextCatTitleColor} />
                </View>
            )}
            {certifiedState === 2 && <VerifiedCircle size={18} color={VerifiedColor} />}
            <Text style={[styles.url, { paddingBottom: 0, paddingHorizontal: 5 }]} numberOfLines={1} ellipsizeMode={'middle'}>
                {url}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
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
        fontWeight: 'bold',
        color: TextCatTitleColor
    }
});

export default DappURLBox;
