import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { BgColor, GrayColor, Lato, PointLightColor, TextGrayColor } from '@/constants/theme';
import { CommonActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { orderBy } from 'es-toolkit/compat';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { IValidatorState, useValidatorData } from '@/hooks/staking/hooks';
import { DownArrow, SortASC, SortDESC } from '@/components/icon/icon';
import CustomModal from '@/components/modal/customModal';
import ModalItems from '@/components/modal/modalItems';

import ValidatorItem from './validatorItem';

interface IProps {
    isRefresh: boolean;
    handleIsRefresh: (refresh: boolean) => void;
    navigateValidator: (address: string) => void;
}

const sortItems = ['Voting Power', 'Commission', 'Uptime'];

const ValidatorList = ({ isRefresh, handleIsRefresh, navigateValidator }: IProps) => {
    const { appState, dataLoadStatus } = useAppSelector((state) => state.common);

    const { validators, handleValidatorsPolling } = useValidatorData();

    const [selected, setSelected] = useState(0);
    const [sortWithDesc, setSortWithDesc] = useState(true);
    const [openModal, setOpenModal] = useState(false);

    const validatorList: IValidatorState[] = useMemo(() => {
        if (!validators.length) return [];

        const sortKey = selected === 1 ? 'commission' : selected === 2 ? 'condition' : 'votingPower';

        // sortWithDesc -> 'desc' / 'asc'
        const sortOrder: 'asc' | 'desc' = sortWithDesc ? 'desc' : 'asc';

        // orderBy returns new array (no mutation)
        return orderBy(validators, [sortKey], [sortOrder]);
    }, [validators, selected, sortWithDesc]);

    const handleOpenModal = (open: boolean) => {
        setOpenModal(open);
    };

    const handleSelectSort = (index: number) => {
        setSelected(index);
        handleOpenModal(false);
    };

    const handleSort = useCallback(
        (sort: boolean) => {
            setSortWithDesc(sort);
        },
        [sortWithDesc]
    );

    const refreshValidators = useCallback(async () => {
        try {
            await handleValidatorsPolling();
            handleIsRefresh(false);
        } catch (error) {
            CommonActions.handleDataLoadStatus(dataLoadStatus + 1);

            console.error(error);
        }
    }, []);

    const sort = sortItems[selected] === 'Commission' ? !sortWithDesc : sortWithDesc;

    useEffect(() => {
        if (appState === 'active' && (validatorList.length === 0 || isRefresh)) {
            refreshValidators();
        }
    }, [isRefresh]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    List
                    <Text style={styles.inlineStyle1}> {validatorList.length}</Text>
                </Text>
                <View style={styles.inlineStyle2}>
                    <TouchableOpacity style={styles.sortButton} onPress={() => handleOpenModal(true)}>
                        <Text style={[styles.sortItem, styles.inlineStyle3]}>{sortItems[selected]}</Text>
                        <DownArrow size={12} color={GrayColor} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.inlineStyle4} onPress={() => handleSort(!sortWithDesc)}>
                        {sort ? <SortDESC size={20} color={GrayColor} /> : <SortASC size={20} color={GrayColor} />}
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.inlineStyle5}>
                {validatorList.map((vd, index: number) => {
                    const isLastItem = index === validatorList.length - 1;
                    return <ValidatorItem key={index} data={vd} isLastItem={isLastItem} navigate={navigateValidator} />;
                })}
            </View>
            <CustomModal bgColor={BgColor} visible={openModal} handleOpen={handleOpenModal}>
                <ModalItems initVal={selected} data={sortItems} onPressEvent={handleSelectSort} />
            </CustomModal>
        </View>
    );
};

const styles = StyleSheet.create({
    inlineStyle1: { color: PointLightColor },
    inlineStyle2: { flexDirection: 'row', alignItems: 'center' },
    inlineStyle3: { paddingRight: 4 },
    inlineStyle4: { paddingLeft: 10, paddingVertical: 10 },
    inlineStyle5: {
        backgroundColor: BgColor,
        flex: 1,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8
    },
    container: {
        borderRadius: 4,
        overflow: 'hidden',
        justifyContent: 'center',
        flex: 1
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
    }
});

export default memo(ValidatorList);
