import React, { useEffect, useState } from 'react';
import FirmaLogo from '@/assets/icons/blockchain/firmachain.svg';
import ArrowForward from '@/assets/icons/material/arrowForward.svg';
import { ChakraPetch, GrayColor, Lato, PointLightColor, TextColor, TextGrayColor } from '@/constants/theme';
import { StyleSheet, Text, View } from 'react-native';

import { WalletIcon } from '@/components/icon/icon';

interface IProps {
    title: string;
    desc?: string;
}

const Description = ({ title, desc }: IProps) => {
    const [arrowIndex, setArrowIndex] = useState(0);

    const handleArrowIndex = () => {
        setArrowIndex((arrowIndex) => (arrowIndex === 2 ? 0 : arrowIndex + 1));
    };

    useEffect(() => {
        handleArrowIndex();
        let timerId = setTimeout(function progress() {
            handleArrowIndex();
            timerId = setTimeout(progress, 500);
        }, 500);

        return () => {
            clearTimeout(timerId);
        };
    }, []);

    return (
        <View style={styles.styledView}>
            <View>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.box}>
                    <WalletIcon size={50} color={GrayColor} />
                    <View style={styles.arrowBox}>
                        <ArrowForward style={styles.arrow} color={arrowIndex === 0 ? PointLightColor : GrayColor} />
                        <ArrowForward style={styles.arrow} color={arrowIndex === 1 ? PointLightColor : GrayColor} />
                        <ArrowForward style={styles.arrow} color={arrowIndex === 2 ? PointLightColor : GrayColor} />
                    </View>
                    <FirmaLogo width={50} height={50} color={GrayColor} />
                </View>
                {desc && <Text style={styles.desc}>{desc}</Text>}
            </View>
        </View>
    );
};

export default Description;

const styles = StyleSheet.create({
    styledView: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontFamily: ChakraPetch,
        fontWeight: '600',
        fontSize: 36,
        color: TextColor,
        textAlign: 'center'
    },
    desc: {
        fontFamily: Lato,
        fontSize: 18,
        fontWeight: 'normal',
        color: TextGrayColor,
        textAlign: 'center'
    },
    box: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 48
    },
    arrowBox: {
        width: 93,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        gap: 2
    },
    arrow: {
        width: 16,
        height: 16
    },
    logo: {
        width: 50,
        height: 50
    }
});
