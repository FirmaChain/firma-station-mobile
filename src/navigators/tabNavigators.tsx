import React from 'react';
import DocumentIcon from '@/assets/icons/material/document.svg';
// import { ICON_DOCUMENT } from '@/constants/images';
import { BoxDarkColor, GrayColor, Lato, WhiteColor } from '@/constants/theme';
import { CommonActions } from '@/redux/actions';
import DappsScreen from '@/screens/home/dapps/dapps';
import GovernanceScreen from '@/screens/home/governance/governance';
import StakingScreen from '@/screens/home/staking/staking';
import WalletScreen from '@/screens/home/wallet/wallet';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// import { Image } from 'react-native';

import { AppstoreIcon, InboxIcon, WalletIcon } from '@/components/icon/icon';

const Tab = createBottomTabNavigator();

const TabNavigators = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: BoxDarkColor,
                    borderTopColor: BoxDarkColor,
                    height: 58,
                    paddingTop: 4,
                    paddingBottom: 10
                    // Due to layout changes, it does not appear necessary to adjust the height for each operating system.
                },
                tabBarActiveTintColor: WhiteColor,
                tabBarInactiveTintColor: GrayColor,
                tabBarLabelStyle: {
                    fontFamily: Lato,
                    fontSize: 12
                }
            }}
            initialRouteName="Wallet"
        >
            <Tab.Screen
                name={'Wallet'}
                listeners={() => ({
                    tabPress: () => {
                        CommonActions.handleScrollToTop(true);
                    }
                })}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return <WalletIcon size={24} color={focused ? WhiteColor : GrayColor} />;
                    }
                }}
            >
                {() => <WalletScreen />}
            </Tab.Screen>
            <Tab.Screen
                name={'Staking'}
                listeners={() => ({
                    tabPress: () => {
                        CommonActions.handleScrollToTop(true);
                    }
                })}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return <InboxIcon size={24} color={focused ? WhiteColor : GrayColor} />;
                    }
                }}
            >
                {() => <StakingScreen />}
            </Tab.Screen>
            <Tab.Screen
                name={'Governance'}
                listeners={() => ({
                    tabPress: () => {
                        CommonActions.handleScrollToTop(true);
                    }
                })}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return <DocumentIcon width={24} height={24} color={focused ? WhiteColor : GrayColor} />;
                        // return <Image style={{ width: 24, height: 24, opacity: focused ? 1 : 0.6 }} source={ICON_DOCUMENT} />;
                    }
                }}
            >
                {() => <GovernanceScreen />}
            </Tab.Screen>
            <Tab.Screen
                name={'Dapps'}
                listeners={() => ({
                    tabPress: () => {
                        CommonActions.handleScrollToTop(true);
                    }
                })}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return <AppstoreIcon size={20} color={focused ? WhiteColor : GrayColor} />;
                    }
                }}
            >
                {() => <DappsScreen />}
            </Tab.Screen>
        </Tab.Navigator>
    );
};

export default TabNavigators;
