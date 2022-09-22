import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { useNavigation } from '@react-navigation/native';
import { DividerColor } from '@/constants/theme';
import Container from '@/components/parts/containers/conatainer';
import ViewContainer from '@/components/parts/containers/viewContainer';
import DescriptionBox from './descriptionBox';
import BalanceBox from './balanceBox';
import TabBox from './tabBox';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.DappDetail>;

interface IProps {
    data: any;
}

const DappDetail = ({ data }: IProps) => {
    const navigation: ScreenNavgationProps = useNavigation();

    const dappData = useMemo(() => {
        if (data) {
            return { identity: data.identity, isServiceOnly: data.isServiceOnly, serviceList: data.serviceList, token: data.token };
        }
        return {
            identity: '',
            isServiceOnly: false,
            serviceList: [],
            token: null
        };
    }, [data]);

    const isServiceOnly = useMemo(() => {
        return dappData.isServiceOnly;
    }, [dappData]);

    const isBalanceSectionOpen = useMemo(() => {
        if (isServiceOnly === false) {
            return dappData.token !== undefined;
        }
        return false;
    }, [dappData, isServiceOnly]);

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <Container titleOn={false} backEvent={handleBack}>
            <ViewContainer>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={{ flex: 1 }}>
                        <DescriptionBox data={data} />
                        <View style={{ padding: 20 }}>
                            <View style={styles.divider} />
                        </View>
                        {isBalanceSectionOpen && <BalanceBox tokenData={dappData.token} />}
                        <TabBox data={dappData} serviceOnly={isServiceOnly} />
                    </View>
                </ScrollView>
            </ViewContainer>
        </Container>
    );
};

const styles = StyleSheet.create({
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: DividerColor
    }
});

export default DappDetail;
