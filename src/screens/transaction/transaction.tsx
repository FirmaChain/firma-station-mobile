import React, { useEffect, useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Screens, StackParamList } from "../../navigators/appRoutes";
import Button from "../../components/button/button";
import { BgColor } from "../../constants/theme";
import ViewContainer from "../../components/parts/containers/viewContainer";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Transaction>;

// export type TransactionParams = {
// }

interface TransactionScreenProps {
    // route: {params: TransactionParams};
    navigation: ScreenNavgationProps;
}

const TransactionScreen: React.FunctionComponent<TransactionScreenProps> = (props) => {
    const {navigation} = props;
    // const {navigation, route} = props;
    // const {params} = route;

    const [count, setCount] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCount(count => count + 1);
            if(count > 5) clearInterval(interval);
        }, 1000);

        return () => {
            clearInterval(interval);
        }
    }, [])

    const handleBack = () => {
        navigation.goBack();
    }
    const transactionResult = () => {
        return (
            <View>
                <Text>complete!</Text>
                <Button
                    title="OK"
                    active={true}
                    onPressEvent={handleBack}/>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                animated={true}
                barStyle={'dark-content'} />
            <ViewContainer>
                <>
                {count <= 5 ?
                <Text>loading....{count}</Text>
                :
                transactionResult()
                }
                </>
            </ViewContainer>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: BgColor,
    },
})

export default TransactionScreen;