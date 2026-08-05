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
        inlineStyle1: { alignItems: 'flex-start' },
        inlineStyle2: { paddingTop: label ? 3 : 0 },
        inlineStyle3: { color: color }
    } as const;

    const inlineStyles2 = {
        inlineStyle1: {
            flexShrink: 1,
            backgroundColor: color + '30',
            borderRadius: 10,
            paddingHorizontal: 10,
            paddingVertical: 3
        }
    } as const;

    return (
        <View style={[styles.vdWrapperH, inlineStyles1.inlineStyle1]}>
            <Text style={[styles.descTitle, inlineStyles1.inlineStyle2]}>{title}</Text>

            <View style={label && inlineStyles2.inlineStyle1}>
                <Text
                    style={[
                        label ? styles.descLabel : styles.descItem,
                        inlineStyles1.inlineStyle3
                        // label && { flexShrink: 1, backgroundColor: color + '30', minHeight: 18 }
                    ]}
                >
                    {data}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    vdWrapperH: {
        paddingVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    descTitle: {
        fontFamily: Lato,
        fontSize: 14,
        color: TextDisableColor,
        minWidth: 100
    },
    descItem: {
        fontFamily: Lato,
        fontSize: 14,
        fontWeight: '600'
    },
    descLabel: {
        fontFamily: Lato,
        fontSize: 14,
        // borderRadius: 10,
        textAlign: 'center',
        minHeight: 18
        // overflow: 'hidden'
        // paddingHorizontal: 10,
        // paddingVertical: 3
    }
});

export default DataSection;
