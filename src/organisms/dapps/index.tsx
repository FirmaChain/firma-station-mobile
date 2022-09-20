import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { StackNavigationProp } from '@react-navigation/stack';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { BgColor, Lato, TextCatTitleColor, TextDisableColor } from '@/constants/theme';
import { CHAIN_NETWORK } from '@/../config';
import { CommonActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import ConnectClient from '@/util/connectClient';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Dapps>;

const itemCountPerLine = 2;

const Dapps = () => {
    const navigation: ScreenNavgationProps = useNavigation();
    const isFocused = useIsFocused();

    const { storage } = useAppSelector((state) => state);
    const connectClient = new ConnectClient(CHAIN_NETWORK[storage.network].RELAY_HOST);

    const [containerSize, setContainerSize] = useState(0);
    const [projectList, setProjectList] = useState<Array<any>>([]);

    const moveToDetail = (data: any) => {
        navigation.navigate(Screens.DappDetail, { data: data });
    };

    const getProjectList = async () => {
        try {
            CommonActions.handleLoadingProgress(true);
            let list = await connectClient.getProjects();
            setProjectList(list.projectList);
            CommonActions.handleLoadingProgress(false);
        } catch (error) {
            CommonActions.handleLoadingProgress(false);
            console.log(error);
        }
    };

    useEffect(() => {
        if (isFocused) {
            getProjectList();
        }
    }, [isFocused]);

    const DappItem = ({ item, size }: any) => {
        return (
            <TouchableOpacity style={[styles.contentWrap, { width: size }]} onPress={() => moveToDetail(item)}>
                <View style={{ paddingHorizontal: 10 }}>
                    <Image style={[styles.contentImage, { width: '100%', height: size - 20 }]} source={{ uri: item.icon }} />
                    {/* <Image style={[styles.contentImage, { width: '100%', height: size - 20 }]} source={item.icon} /> */}
                    <Text style={[styles.contentTitle, { width: '100%' }]} numberOfLines={1}>
                        {item.name}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.box}>
                    <View style={styles.wrapBox} onLayout={(e) => setContainerSize(e.nativeEvent.layout.width)}>
                        {projectList.length > 0 ? (
                            projectList.map((value, index) => {
                                return <DappItem key={index} item={value} size={(containerSize - 20) / itemCountPerLine} />;
                            })
                        ) : (
                            <View style={styles.noDappsBox}>
                                <Text style={styles.noDappsText}>No Dapps</Text>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        paddingTop: 20,
        backgroundColor: BgColor
    },
    box: {
        width: '100%',
        height: '100%'
    },
    wrapBox: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingHorizontal: 10
    },
    contentWrap: {
        marginBottom: 20
    },
    contentImage: {
        resizeMode: 'contain',
        overflow: 'hidden',
        borderRadius: 8
    },
    contentTitle: {
        fontFamily: Lato,
        fontSize: 14,
        textAlign: 'center',
        textTransform: 'uppercase',
        color: TextCatTitleColor,
        padding: 5,
        marginTop: 5
    },
    noDappsBox: {
        flexGrow: 1,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    noDappsText: {
        fontFamily: Lato,
        fontSize: 16,
        textAlign: 'center',
        color: TextDisableColor
    }
});

export default Dapps;
