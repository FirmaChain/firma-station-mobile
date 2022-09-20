import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { CommonActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { useValidatorData } from '@/hooks/staking/hooks';
import {
    BgColor,
    DisableColor,
    GrayColor,
    Lato,
    PointLightColor,
    TextColor,
    TextDarkGrayColor,
    TextDisableColor,
    TextGrayColor
} from '@/constants/theme';
import { DownArrow, SortASC, SortDESC } from '@/components/icon/icon';
import CustomModal from '@/components/modal/customModal';
import ModalItems from '@/components/modal/modalItems';
import ValidatorItem from './validatorItem';

interface IProps {
    visible: boolean;
    isRefresh: boolean;
    handleIsRefresh: (refresh: boolean) => void;
    navigateValidator: (address: string) => void;
}

const ValidatorList = ({ visible, isRefresh, handleIsRefresh, navigateValidator }: IProps) => {
    const { common } = useAppSelector((state) => state);
    const { validators, handleValidatorsPolling } = useValidatorData();

    const sortItems = ['Voting Power', 'Commission', 'Uptime'];
    const [selected, setSelected] = useState(0);
    const [sortWithDesc, setSortWithDesc] = useState(true);
    const [openModal, setOpenModal] = useState(false);

    const validatorList = useMemo(() => {
        return validators;
    }, [validators]);

    useMemo(() => {
        if (validatorList.length === 0) return;
        switch (selected) {
            case 0:
                return validatorList.sort((a: any, b: any) =>
                    sortWithDesc ? b.votingPower - a.votingPower : a.votingPower - b.votingPower
                );
            case 1:
                return validatorList.sort((a: any, b: any) => (sortWithDesc ? a.commission - b.commission : b.commission - a.commission));
            case 2:
                return validatorList.sort((a: any, b: any) => (sortWithDesc ? b.condition - a.condition : a.condition - b.condition));
        }
    }, [selected, validatorList, sortWithDesc]);

    const handleOpenModal = (open: boolean) => {
        setOpenModal(open);
    };

    const handleSelectSort = (index: number) => {
        setSelected(index);
        handleOpenModal(false);
    };

    const refreshValidators = async () => {
        if (validatorList.length === 0) {
            CommonActions.handleLoadingProgress(true);
        }
        try {
            if (visible) {
                await handleValidatorsPolling();
            }
            CommonActions.handleLoadingProgress(false);
            handleIsRefresh(false);
        } catch (error) {
            if (visible) {
                CommonActions.handleDataLoadStatus(common.dataLoadStatus + 1);
            }
            console.log(error);
        }
    };

    const renderSortIcon = () => {
        let sort = sortItems[selected] === 'Commission' ? !sortWithDesc : sortWithDesc;
        switch (sort) {
            case true:
                return <SortDESC size={20} color={GrayColor} />;
            case false:
                return <SortASC size={20} color={GrayColor} />;
        }
    };

    useEffect(() => {
        if (isRefresh && visible) {
            refreshValidators();
        }
    }, [isRefresh, visible]);

    useEffect(() => {
        if (visible) {
            refreshValidators();
        }
    }, [visible]);

    return (
        <>
            {visible && (
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            List
                            <Text style={{ color: PointLightColor }}> {validatorList.length}</Text>
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity style={styles.sortButton} onPress={() => handleOpenModal(true)}>
                                <Text style={[styles.sortItem, { paddingRight: 4 }]}>{sortItems[selected]}</Text>
                                <DownArrow size={12} color={GrayColor} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ paddingLeft: 10, paddingVertical: 10 }}
                                onPress={() => setSortWithDesc(!sortWithDesc)}
                            >
                                {renderSortIcon()}
                            </TouchableOpacity>
                        </View>
                    </View>
                    {validatorList.map((vd: any, index: number) => {
                        const isLastItem = index === validatorList.length - 1;
                        return <ValidatorItem key={index} data={vd} isLastItem={isLastItem} navigate={navigateValidator} />;
                    })}
                    <CustomModal bgColor={BgColor} visible={openModal} handleOpen={handleOpenModal}>
                        <ModalItems initVal={selected} data={sortItems} onPressEvent={handleSelectSort} />
                    </CustomModal>
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 4,
        overflow: 'hidden',
        justifyContent: 'center',
        marginBottom: 20,
        paddingHorizontal: 20
    },
    header: {
        height: 48,
        paddingHorizontal: 20,
        backgroundColor: BgColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    title: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextGrayColor
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10
    },
    sortItem: {
        color: GrayColor,
        fontFamily: Lato,
        fontSize: 16
    },

    moniikerWrapperH: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    vdWrapperH: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    descWrapperH: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 5
    },
    vdWrapperV: {
        flex: 1,
        alignItems: 'flex-start'
    },
    avatar: {
        width: 35,
        maxWidth: 35,
        height: 35,
        borderRadius: 50,
        overflow: 'hidden',
        marginRight: 10
    },
    icon: {
        marginRight: 10
    },
    moniker: {
        fontSize: 16,
        paddingBottom: 5,
        fontFamily: Lato,
        color: TextColor
    },
    divider: {
        height: 1,
        marginHorizontal: 20,
        backgroundColor: DisableColor
    },
    descTitle: {
        fontFamily: Lato,
        fontSize: 14,
        color: TextDisableColor
    },
    descItem: {
        fontFamily: Lato,
        fontSize: 14,
        fontWeight: '600',
        color: TextDarkGrayColor
    }
});

export default ValidatorList;
