import { Lato, TextDisableColor } from '@/constants/theme';
import { StyleSheet, Text, View } from 'react-native';

interface IProps {
    title: string;
    data: string;
    color?: string;
    label?: boolean;
}

const DataSection = ({ title, data, color = TextDisableColor, label = false }: IProps) => {
    const inlineStyles1 = {
        inlineStyle1: { color: color }
    } as const;

    const inlineStyles2 = {
        inlineStyle1: { backgroundColor: color + '30' }
    } as const;

    return (
        <View style={styles.vdWrapperH}>
            <Text style={styles.descTitle}>{title}</Text>
            <Text style={[label ? styles.descLabel : styles.descItem, inlineStyles1.inlineStyle1, label && inlineStyles2.inlineStyle1]}>
                {data}
            </Text>
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
    descTitle: {
        fontFamily: Lato,
        fontSize: 14,
        color: TextDisableColor
    },
    descItem: {
        fontFamily: Lato,
        fontSize: 14,
        fontWeight: '600'
    },
    descLabel: {
        fontFamily: Lato,
        fontSize: 14,
        borderRadius: 10,
        textAlign: 'center',
        overflow: 'hidden',
        paddingHorizontal: 10,
        paddingVertical: 3
    }
});

export default DataSection;
