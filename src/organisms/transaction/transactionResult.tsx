import { EXPLORER_URL } from '@/constants/common';
import { BgColor, Lato, PointLightColor, TextAddressColor, TextColor, TextGrayColor, TextWarnColor } from '@/constants/theme';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Button from '@/components/button/button';
import { FailCircle, SuccessCircle } from '@/components/icon/icon';

import { IResultState } from '.';

interface IProps {
    result: IResultState;
    handleExplorer: (uri: string) => void;
    handleBack: () => void;
}

const TransactionResult = ({ result, handleExplorer, handleBack }: IProps) => {
    const convertTransactionCodeToText = (code: number) => {
        if (code === 0) return 'Transaction Success';
        if (code === 1) return 'Sign Success';
        return 'Transaction Failed';
    };

    const inlineStyles1 = {
        inlineStyle1: { flex: 1, justifyContent: 'center', alignItems: 'center' },
        inlineStyle2: { color: result.code === -1 ? TextWarnColor : PointLightColor },
        inlineStyle3: { color: TextGrayColor },
        inlineStyle4: { color: result.code === 0 ? TextAddressColor : TextColor, paddingHorizontal: 5 },
        inlineStyle5: { justifyContent: 'flex-end' }
    } as const;

    return (
        <View style={styles.container}>
            <View style={[styles.resultBox, inlineStyles1.inlineStyle1]}>
                {result.code === -1 ? <FailCircle size={45} color={TextWarnColor} /> : <SuccessCircle size={45} color={PointLightColor} />}
                <Text style={[styles.result, inlineStyles1.inlineStyle2]}>{convertTransactionCodeToText(result.code)}</Text>
                <View style={styles.resultWrapper}>
                    {result.code === 0 && <Text style={[styles.hash, inlineStyles1.inlineStyle3]}>HASH: </Text>}
                    <TouchableOpacity
                        disabled={result.code !== 0}
                        onPress={() => handleExplorer(EXPLORER_URL() + '/transactions/' + result.result)}
                    >
                        <Text
                            numberOfLines={result.code === -1 ? 10 : 1}
                            ellipsizeMode={'middle'}
                            style={[styles.hash, inlineStyles1.inlineStyle4]}
                        >
                            {result.result}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={[styles.resultBox, inlineStyles1.inlineStyle5]}>
                <Button title={'OK'} active={true} onPressEvent={handleBack} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: BgColor,
        paddingHorizontal: 20
    },
    resultBox: {
        width: '100%'
    },
    resultWrapper: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20
    },
    result: {
        fontFamily: Lato,
        fontSize: 22,
        fontWeight: '600',
        textAlign: 'center',
        color: PointLightColor,
        paddingTop: 10,
        paddingBottom: 20
    },
    hash: {
        fontFamily: Lato,
        fontSize: 14,
        textAlign: 'center',
        paddingBottom: 20
    }
});

export default TransactionResult;
