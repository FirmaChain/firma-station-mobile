import React from 'react';
import DocumentIcon from '@/assets/icons/material/document.svg';
// import { ICON_DOCUMENT } from '@/constants/images';
import { BoxDarkColor, GrayColor, Lato, WhiteColor } from '@/constants/theme';
import Dapps from '@/organisms/dapps';
import Governance from '@/organisms/governance/governance';
import Staking from '@/organisms/staking/staking';
import Wallet from '@/organisms/wallet/wallet';
import { CommonActions } from '@/redux/actions';
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
                    height: 58
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
                {() => <Wallet />}
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
                {() => <Staking />}
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
                    }
                }}
            >
                {() => <Governance />}
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
                {() => <Dapps />}
            </Tab.Screen>
        </Tab.Navigator>
    );
};

export default TabNavigators;
