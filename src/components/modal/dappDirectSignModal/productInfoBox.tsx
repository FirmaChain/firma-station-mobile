import React, { Fragment } from 'react';
import { CHAIN_SYMBOL } from '@/constants/common';
import { DisableColor, Lato, TextCatTitleColor, TextColor, TextDisableColor } from '@/constants/theme';
import { StyleSheet, Text, View } from 'react-native';

interface IProps {
    productName: string;
    productPrice: number;
}

const ProductInfoBox = ({ productName, productPrice }: IProps) => {
    const _CHAIN_SYMBOL = CHAIN_SYMBOL();

    const inlineStyles1 = {
        inlineStyle1: { display: productName === '' ? 'none' : 'flex' },
        inlineStyle2: { alignItems: 'baseline' },
        inlineStyle3: { color: TextDisableColor }
    } as const;

    return (
        <Fragment>
            <View style={[styles.productBox, inlineStyles1.inlineStyle1]}>
                <Text style={styles.productTitle}>{productName}</Text>
                <View style={[styles.boxH, inlineStyles1.inlineStyle2]}>
                    <Text style={styles.productPrice}>{productPrice}</Text>
                    <Text style={[styles.productTitle, inlineStyles1.inlineStyle3]}>{_CHAIN_SYMBOL}</Text>
                </View>
            </View>
        </Fragment>
    );
};

const styles = StyleSheet.create({
    boxH: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    productBox: {
        width: '100%',
        alignItems: 'center',
        backgroundColor: DisableColor,
        padding: 20,
        borderRadius: 8
    },
    productTitle: {
        fontFamily: Lato,
        fontSize: 14,
        color: TextCatTitleColor
    },
    productPrice: {
        fontFamily: Lato,
        fontSize: 26,
        fontWeight: '600',
        color: TextColor,
        paddingRight: 6,
        paddingTop: 8
    }
});

export default ProductInfoBox;
