import React from 'react';
import { View } from 'react-native';
import { TextCatTitleColor } from '@/constants/theme';
import Button from '@/components/button/button';

interface IProps {
    recoverFromWallet: (type: 'mnemonic' | 'privateKey') => void;
    recoverViaQR: (active: boolean) => void;
}

const RecoverMenus = ({ recoverFromWallet, recoverViaQR }: IProps) => {
    return (
        <View>
            <View style={{ paddingBottom: 20 }}>
                <Button
                    title="Use seed phrase"
                    active={true}
                    border={true}
                    borderColor={TextCatTitleColor}
                    borderTextColor={TextCatTitleColor}
                    onPressEvent={() => recoverFromWallet('mnemonic')}
                />
            </View>
            <View style={{ paddingBottom: 20 }}>
                <Button
                    title="Use Private Key"
                    active={true}
                    border={true}
                    borderColor={TextCatTitleColor}
                    borderTextColor={TextCatTitleColor}
                    onPressEvent={() => recoverFromWallet('privateKey')}
                />
            </View>
            <View style={{ paddingBottom: 20 }}>
                <Button
                    title="Scan QR code"
                    active={true}
                    border={true}
                    borderColor={TextCatTitleColor}
                    borderTextColor={TextCatTitleColor}
                    onPressEvent={() => recoverViaQR(true)}
                />
            </View>
        </View>
    );
};

export default RecoverMenus;
