import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

interface IProps {
    bgColor?: string;
    full?: boolean;
    children: ReactNode;
}

const ViewContainer = ({ bgColor, children }: IProps) => {
    const inlineStyles1 = {
        inlineStyle1: {
            backgroundColor: bgColor
        }
    } as const;

    return <View style={[styles.viewContainer, inlineStyles1.inlineStyle1]}>{children}</View>;
};

const styles = StyleSheet.create({
    viewContainer: {
        paddingBottom: 20,
        flex: 6
    }
});

export default ViewContainer;
