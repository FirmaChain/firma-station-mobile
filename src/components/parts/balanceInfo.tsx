import { CHAIN_SYMBOL } from '@/constants/common';
import { BorderColor, Lato, TextCatTitleColor, TextColor, TextGrayColor } from '@/constants/theme';
import { convertAmount } from '@/util/common';
import { StyleSheet, Text, View } from 'react-native';

interface IProps {
    title?: string;
    available: number;
    decimal?: number | null;
    symbol?: string;
    showSubBalance?: boolean;
    subTitle?: string;
    subAvailable?: number;
    subDecimal?: number | null;
    subSymbol?: string;
}

const BalanceInfo = ({
    title = 'Available',
    available = 0,
    decimal = null,
    symbol = CHAIN_SYMBOL(),
    showSubBalance = false,
    subTitle = 'reward',
    subAvailable = 0,
    subDecimal = null,
    subSymbol = CHAIN_SYMBOL()
}: IProps) => {
    const inlineStyles1 = {
        inlineStyle1: { fontSize: 14 },
        inlineStyle2: {
            display: showSubBalance ? 'flex' : 'none',
            justifyContent: 'flex-end',
            paddingVertical: 0,
            paddingBottom: 10
        },
        inlineStyle3: { fontSize: 14, color: TextGrayColor },
        inlineStyle4: { fontSize: 14, color: TextGrayColor },
        inlineStyle5: { fontSize: 12, color: TextGrayColor }
    } as const;

    return (
        <View style={styles.box}>
            <View style={styles.boxH}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.balance}>
                    {convertAmount({
                        value: available,
                        point: 6,
                        isUfct: decimal === null,
                        decimal: decimal
                    })}
                    <Text style={[styles.title, inlineStyles1.inlineStyle1]}>{`  ${symbol.toUpperCase()}`}</Text>
                </Text>
            </View>
            <View style={[styles.boxH, inlineStyles1.inlineStyle2]}>
                <Text style={[styles.title, inlineStyles1.inlineStyle3]}>{subTitle}</Text>
                <Text style={[styles.balance, inlineStyles1.inlineStyle4]}>
                    {convertAmount({
                        value: subAvailable,
                        point: 6,
                        isUfct: subDecimal === null,
                        decimal: subDecimal
                    })}
                    <Text style={[styles.title, inlineStyles1.inlineStyle5]}>{`  ${subSymbol.toUpperCase()}`}</Text>
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    box: {
        borderBottomColor: BorderColor,
        borderBottomWidth: 1,
        paddingVertical: 10,
        marginBottom: 20
    },
    boxH: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingVertical: 5
    },
    title: {
        flex: 1,
        fontFamily: Lato,
        fontSize: 18,
        fontWeight: 'normal',
        color: TextCatTitleColor
    },
    balance: {
        fontSize: 20,
        fontFamily: Lato,
        fontWeight: 'normal',
        color: TextColor
    }
});

export default BalanceInfo;
