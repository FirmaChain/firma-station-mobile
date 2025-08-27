import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BgColor, BoxDarkColor } from '@/constants/theme';
import { useAppSelector } from '@/redux/hooks';
import { Screens } from '@/navigators/appRoutes';
import { useSelector } from 'react-redux';
import { rootState } from '@/redux/reducers';

interface IProps {
    children: JSX.Element;
    bgColor?: string;
}

const RootView = ({ children, bgColor = BgColor }: IProps) => {
    const insets = useSafeAreaInsets();
    const { name } = useSelector((v: rootState) => v.wallet);
    const { loggedIn, currentRoute, lockStation, isBioAuthInProgress, appState, appPausedTime } = useSelector(
        (state: rootState) => state.common
    );
    const modal = useAppSelector(state => state.modal);

    const isMainPage = [Screens.Wallet, Screens.Staking, Screens.Governance, Screens.Dapps].includes(currentRoute as Screens);
    const isModalOpen = Object.values(modal).some(value => value === true);

    const chkLoginStatus = name !== '' && loggedIn;
    const isLockStation = chkLoginStatus && lockStation;
    const isDim = chkLoginStatus && isBioAuthInProgress === false && appState !== 'active';
    const isDim2 = chkLoginStatus && isBioAuthInProgress === false && appPausedTime !== '';

    const bottomViewBg = isMainPage && !isModalOpen && !isLockStation && !isDim && !isDim2 ? BoxDarkColor : 'transparent';

    console.log('isModalOpen', isModalOpen, isMainPage, isLockStation, bottomViewBg);

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
                        backgroundColor: bottomViewBg,
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
