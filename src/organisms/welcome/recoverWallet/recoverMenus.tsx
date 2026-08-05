import { TextCatTitleColor } from '@/constants/theme';
import { StyleSheet, View } from 'react-native';

import Button from '@/components/button/button';

interface IProps {
    recoverFromWallet: (type: 'mnemonic' | 'privateKey') => void;
    recoverViaQR: (active: boolean) => void;
}

const RecoverMenus = ({ recoverFromWallet, recoverViaQR }: IProps) => {
    return (
        <View>
            <View style={styles.inlineStyle1}>
                <Button
                    title="Use seed phrase"
                    active={true}
                    border={true}
                    borderColor={TextCatTitleColor}
                    borderTextColor={TextCatTitleColor}
                    onPressEvent={() => recoverFromWallet('mnemonic')}
                />
            </View>
            <View style={styles.inlineStyle2}>
                <Button
                    title="Use Private Key"
                    active={true}
                    border={true}
                    borderColor={TextCatTitleColor}
                    borderTextColor={TextCatTitleColor}
                    onPressEvent={() => recoverFromWallet('privateKey')}
                />
            </View>
            <View style={styles.inlineStyle3}>
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

const styles = StyleSheet.create({
    inlineStyle1: { paddingBottom: 20 },
    inlineStyle2: { paddingBottom: 20 },
    inlineStyle3: { paddingBottom: 20 }
});

export default RecoverMenus;
