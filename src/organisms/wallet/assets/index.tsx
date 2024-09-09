import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
    BgColor,
    BoxColor,
    BoxDarkColor,
    DisableColor,
    InputPlaceholderColor,
    Lato,
    TextCatTitleColor,
    TextColor,
    WhiteColor
} from '@/constants/theme';
import { ScreenWidth } from '@/util/getScreenSize';
import { useSelector } from 'react-redux';
import { rootState } from '@/redux/reducers';
import { ModalActions, StorageActions } from '@/redux/actions';
import Container from '@/components/parts/containers/conatainer';
import AddCWContractModal from '@/components/modal/addCWContractModal';
import CW20List from './cw20List';
import CW721List from './cw721List';
import Toast from 'react-native-toast-message';
import { useCWContext } from '@/context/cwContext';
import { useCW20, useCW721 } from '@/hooks/assets/hooks';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Assets>;

const Assets = () => {
    const navigation: ScreenNavgationProps = useNavigation();
    const { modal, storage, wallet } = useSelector((state: rootState) => state);
    const { cw20Data, cw721Data } = useCWContext();

    const { handleCW721ContractsInfo } = useCW721();
    const { handleCW20ContractsInfo } = useCW20();

    useEffect(() => {
        handleCW20ContractsInfo();
    }, [storage.cw20Contracts]);

    useEffect(() => {
        handleCW721ContractsInfo();
    }, [storage.cw721Contracts, wallet]);

    const [tab, setTab] = useState(0);
    const [isEdit, setIsEdit] = useState(false);

    const handleTab = (index: number) => {
        if (index === tab) {
            return;
        }
        setTab(index);
        setIsEdit(false);
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const successAddContract = (value: number) => {
        setTab(value);

        Toast.show({
            type: 'success',
            text1: `successfully added the ${value === 0 ? 'CW20' : 'CW721'} contract`
        });
    };

    const openAddCWContractModal = useMemo(() => {
        return modal.addCWContractModal;
    }, [modal.addCWContractModal]);

    const setOpenAddCWContractModal = (active: boolean) => {
        ModalActions.handleAddCWContractModal(active);
    };

    const handleAddCWContractModal = (_isAdded: boolean) => {
        setOpenAddCWContractModal(_isAdded);
    };

    return (
        <Container backEvent={handleBack} titleOn={false}>
            <View style={[styles.listBox, { justifyContent: 'space-between' }]}>
                <View style={styles.titleBox}>
                    <Text style={styles.title}>{'Assets'}</Text>
                    <View style={styles.titleButtonBox}>
                        {isEdit === false && (
                            <TouchableOpacity style={styles.textButtonWrap} onPress={() => handleAddCWContractModal(true)}>
                                <Text style={styles.textButton}>{'Add'}</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity style={styles.textButtonWrap} onPress={() => setIsEdit(!isEdit)}>
                            <Text style={styles.textButton}>{isEdit ? 'Done' : 'Edit'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.listContainer}>
                    <View style={styles.tabBox}>
                        <TouchableOpacity
                            style={[styles.tab, { borderBottomColor: tab === 0 ? WhiteColor : 'transparent' }]}
                            onPress={() => handleTab(0)}
                        >
                            <Text style={tab === 0 ? styles.tabTitleActive : styles.tabTitleInactive}>{'CW 20'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, { borderBottomColor: tab === 1 ? WhiteColor : 'transparent' }]}
                            onPress={() => handleTab(1)}
                        >
                            <Text style={tab === 1 ? styles.tabTitleActive : styles.tabTitleInactive}>{'CW 721'}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.container}>
                        {tab === 0 && <CW20List isEdit={isEdit} data={cw20Data} />}
                        {tab === 1 && <CW721List isEdit={isEdit} data={cw721Data} />}
                    </View>
                </View>
                <AddCWContractModal
                    open={openAddCWContractModal}
                    setOpenModal={handleAddCWContractModal}
                    successCallback={successAddContract}
                />
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingVertical: 20,
        marginHorizontal: 20,
        overflow: 'hidden',
        backgroundColor: BgColor
    },
    listContainer: {
        height: '100%',
        paddingVertical: 15,
        backgroundColor: BoxColor,
        position: 'relative'
    },
    titleBox: {
        height: 50,
        width: ScreenWidth(),
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 18,
        backgroundColor: BoxDarkColor
    },
    title: {
        fontFamily: Lato,
        fontSize: 24,
        fontWeight: 'bold',
        color: TextColor
    },
    titleButtonBox: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    textButtonWrap: {
        paddingLeft: 10,
        paddingRight: 3
    },
    textButton: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextCatTitleColor,
        paddingHorizontal: 10
    },
    listBox: {
        flex: 1,
        backgroundColor: BgColor
    },
    tabBox: {
        height: 58,
        marginHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: BgColor,
        borderBottomWidth: 1,
        borderBottomColor: DisableColor,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8
    },
    tab: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 3
    },
    tabTitleActive: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextColor,
        fontWeight: 'bold',
        paddingTop: 3
    },
    tabTitleInactive: {
        fontFamily: Lato,
        fontSize: 16,
        color: InputPlaceholderColor,
        paddingTop: 3
    }
});

export default Assets;
