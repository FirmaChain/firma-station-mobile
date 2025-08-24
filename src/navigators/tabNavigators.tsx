import React from 'react';
import { Image } from 'react-native';
import { CommonActions } from '@/redux/actions';
import { BoxDarkColor, GrayColor, Lato, WhiteColor } from '@/constants/theme';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ICON_DOCUMENT } from '@/constants/images';
import WalletIcon from 'react-native-vector-icons/Ionicons';
import StakingIcon from 'react-native-vector-icons/AntDesign';
import DappIcon from 'react-native-vector-icons/AntDesign';
import WalletScreen from '@/screens/home/wallet/wallet';
import StakingScreen from '@/screens/home/staking/staking';
import GovernanceScreen from '@/screens/home/governance/governance';
import DappsScreen from '@/screens/home/dapps/dapps';

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
                    paddingBottom: 10,
                    // Due to layout changes, it does not appear necessary to adjust the height for each operating system.
                },
                tabBarActiveTintColor: WhiteColor,
                tabBarInactiveTintColor: GrayColor,
                tabBarLabelStyle: {
                    fontFamily: Lato,
                    fontSize: 12,
                },
            }}
            initialRouteName="Wallet">
            <Tab.Screen
                name={'Wallet'}
                children={() => <WalletScreen />}
                listeners={() => ({
                    tabPress: () => {
                        CommonActions.handleScrollToTop(true);
                    },
                })}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return <WalletIcon name={'ios-wallet-outline'} size={24} color={focused ? WhiteColor : GrayColor} />;
                    },
                }}
            />
            <Tab.Screen
                name={'Staking'}
                children={() => <StakingScreen />}
                listeners={() => ({
                    tabPress: () => {
                        CommonActions.handleScrollToTop(true);
                    },
                })}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return <StakingIcon name={'inbox'} size={24} color={focused ? WhiteColor : GrayColor} />;
                    },
                }}
            />
            <Tab.Screen
                name={'Governance'}
                children={() => <GovernanceScreen />}
                listeners={() => ({
                    tabPress: () => {
                        CommonActions.handleScrollToTop(true);
                    },
                })}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return <Image style={{ width: 24, height: 24, opacity: focused ? 1 : 0.6 }} source={ICON_DOCUMENT} />;
                    },
                }}
            />
            <Tab.Screen
                name={'Dapps'}
                children={() => <DappsScreen />}
                listeners={() => ({
                    tabPress: () => {
                        CommonActions.handleScrollToTop(true);
                    },
                })}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return <DappIcon name={'appstore1'} size={20} color={focused ? WhiteColor : GrayColor} />;
                    },
                }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigators;
