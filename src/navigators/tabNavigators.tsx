import React from "react";
import { Image } from "react-native";
import { BoxDarkColor, GrayColor, WhiteColor } from "@/constants/theme";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import WalletIcon from "react-native-vector-icons/Ionicons";
import StakingIcon from "react-native-vector-icons/AntDesign";
import { ICON_DOCUMENT } from "@/constants/images";
import WalletScreen from "@/screens/home/wallet/wallet";
import StakingScreen from "@/screens/home/staking/staking";
import GovernanceScreen from "@/screens/home/governance/governance";

const Tab = createBottomTabNavigator();

const TabNavigators = () => {
    return (
        <Tab.Navigator 
            screenOptions={{ 
                headerShown: false, 
                tabBarStyle: { backgroundColor: BoxDarkColor, borderTopColor: BoxDarkColor},
                tabBarActiveTintColor: WhiteColor,
                tabBarInactiveTintColor: GrayColor,
            }}
            initialRouteName="Wallet">
        
            <Tab.Screen 
                name={'Wallet'} 
                children={() => <WalletScreen />}
                options={{
                    tabBarIcon: ({focused}) => {
                        return <WalletIcon name={'ios-wallet-outline'} size={24} color={focused? WhiteColor : GrayColor}/>
                    }
                }}/>
            <Tab.Screen 
                name={'Staking'} 
                children={() => <StakingScreen />}
                options={{
                    tabBarIcon:
                    ({focused}) => {
                        return <StakingIcon name={'inbox'} size={24} color={focused? WhiteColor : GrayColor}/>
                    }
                }}/>
            <Tab.Screen 
                name={'Governance'} 
                children={() => <GovernanceScreen />}
                options={{
                    tabBarIcon: ({focused}) => {
                        return <Image style={{width: 24, height: 24, opacity: focused? 1: .6}} source={ICON_DOCUMENT}/>
                    }
                }}/>
        </Tab.Navigator>
    )
}

export default TabNavigators;