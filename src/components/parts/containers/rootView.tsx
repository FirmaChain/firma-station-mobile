import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BgColor, BoxDarkColor } from '@/constants/theme';
import { useAppSelector } from '@/redux/hooks';
import { Screens } from '@/navigators/appRoutes';

interface IProps {
    children: JSX.Element;
    bgColor?: string;
}

const RootView = ({ children, bgColor = BgColor }: IProps) => {
    const insets = useSafeAreaInsets();
    const currentRoute = useAppSelector(state => state.common.currentRoute);

    const isDarkBottom = [Screens.Wallet, Screens.Staking, Screens.Governance, Screens.Dapps].includes(currentRoute as Screens);

    return (
        <SafeAreaView
            style={[
                styles.container,
                {
                    backgroundColor: bgColor,
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                    paddingLeft: insets.left,
                    paddingRight: insets.right,
                },
            ]}>
            {children}
            <View
                style={[
                    styles.bottomView,
                    {
                        height: insets.bottom,
                        backgroundColor: isDarkBottom ? BoxDarkColor : 'transparent',
                    },
                ]}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bottomView: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
    },
});

export default RootView;
