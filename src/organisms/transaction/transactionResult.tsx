import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BgColor, Lato, PointLightColor, TextAddressColor, TextColor, TextGrayColor, TextWarnColor } from '@/constants/theme';
import { EXPLORER_URL } from '@/constants/common';
import { FailCircle, SuccessCircle } from '@/components/icon/icon';
import { IResultState } from '.';
import Button from '@/components/button/button';

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

    return (
        <View style={styles.container}>
            <View style={[styles.resultBox, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
                {result.code === -1 ? <FailCircle size={45} color={TextWarnColor} /> : <SuccessCircle size={45} color={PointLightColor} />}
                <Text style={[styles.result, { color: result.code === -1 ? TextWarnColor : PointLightColor }]}>
                    {convertTransactionCodeToText(result.code)}
                </Text>
                <View style={styles.resultWrapper}>
                    {result.code === 0 && <Text style={[styles.hash, { color: TextGrayColor }]}>HASH: </Text>}
                    <TouchableOpacity
                        disabled={result.code !== 0}
                        onPress={() => handleExplorer(EXPLORER_URL() + '/transactions/' + result.result)}
                    >
                        <Text
                            numberOfLines={result.code === -1 ? 10 : 1}
                            ellipsizeMode={'middle'}
                            style={[styles.hash, { color: result.code === 0 ? TextAddressColor : TextColor, paddingHorizontal: 5 }]}
                        >
                            {result.result}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={[styles.resultBox, { justifyContent: 'flex-end' }]}>
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
        paddingBottom: Platform.select({ android: 30, ios: 50 }),
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
    },
    noticeBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    warnText: {
        fontSize: 14,
        lineHeight: 20,
        paddingLeft: 10
    }
});

export default TransactionResult;
