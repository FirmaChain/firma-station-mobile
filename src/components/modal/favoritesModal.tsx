import React, { useEffect, useMemo, useState } from 'react';
import { NO_FAVORITE } from '@/constants/common';
import {
    BgColor,
    BoxColor,
    BoxDarkColor,
    //   InputBgColor,
    Lato,
    TextCatTitleColor,
    //   TextColor,
    TextGrayColor
} from '@/constants/theme';
import { ModalActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { IFavoriteProps } from '@/redux/types';
import { easeInAndOutCustomAnim } from '@/util/animation';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import CustomModal from '@/components/modal/customModal';

import ModalItemsForFavorites from './modalItemsForFavorites';

interface IProps {
    open: boolean;
    address: string;
    memo: string;
    setOpenModal: (open: boolean) => void;
    setValue: (value: string, memo: string) => void;
    handleCreateFavorite: (open: boolean) => void;
}

const FavoritesModal = ({ open, address, memo, setOpenModal, setValue, handleCreateFavorite }: IProps) => {
    const { favorite } = useAppSelector((state) => state.storage);
    const { address: walletAddress } = useAppSelector((state) => state.wallet);

    const [selected, setSelected] = useState('');
    const [isEdit, setIsEdit] = useState(false);

    const FavoriteList: IFavoriteProps[] = useMemo(() => {
        try {
            const list = favorite.find((value) => value.ownerAddress === walletAddress);
            if (list === undefined) return [];
            return list.favorite;
        } catch {
            return [];
        }
    }, [favorite]);

    const FavoriteExist = useMemo(() => {
        const exist = FavoriteList.length > 0;
        if (exist === false) setIsEdit(false);
        return exist;
    }, [FavoriteList]);

    const AnimationState = useMemo(() => {
        easeInAndOutCustomAnim(150);
        if (isEdit) {
            return {
                addSize: 0,
                addOpacity: 0
            };
        } else {
            return {
                addSize: 'auto',
                addOpacity: 1
            };
        }
    }, [isEdit]);

    const handleOpenModal = (open: boolean) => {
        if (setOpenModal) setOpenModal(open);
    };

    const handleSelectWallet = (address: string, memo: string) => {
        setValue(address, memo);
        setSelected(address);
        handleOpenModal(false);
    };

    const handleSelectWalletForEdit = (address: string) => {
        ModalActions.handleFavoriteData(address);
        handleCreateFavorite(true);
    };

    useEffect(() => {
        if (open === false) {
            setSelected('');
            setIsEdit(false);
        } else {
            setSelected(address);
            setValue(address, memo);
        }
    }, [open, address, memo]);

    const inlineStyles1 = {
        inlineStyle1: { marginBottom: FavoriteExist ? 20 : 10 },
        inlineStyle2: { flexDirection: 'row', alignItems: 'center' },
        inlineStyle3: {
            marginRight: FavoriteExist ? 5 : 16,
            paddingLeft: 10,
            paddingRight: 5
        },
        inlineStyle4: {
            opacity: AnimationState.addOpacity
        },
        inlineStyle5: { display: FavoriteExist ? 'flex' : 'none', paddingRight: FavoriteExist ? 10 : 0 },
        inlineStyle6: {
            height: 300,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: BgColor
        }
    } as const;

    return (
        <CustomModal
            visible={open}
            bgColor={BgColor}
            toastInModal={false}
            forceActive={true}
            handleOpen={open === false ? () => null : handleOpenModal}
        >
            <View style={[styles.modalContainer, inlineStyles1.inlineStyle1]}>
                <View style={styles.headerBox}>
                    <Text style={styles.headerTitle}>{'Favorites'}</Text>
                    <View style={inlineStyles1.inlineStyle2}>
                        <TouchableOpacity
                            hitSlop={{ top: 5, bottom: 5, left: 0, right: 0 }}
                            style={inlineStyles1.inlineStyle3}
                            onPress={() => {
                                if (isEdit === false) handleCreateFavorite(true);
                            }}
                        >
                            <Text style={[styles.headerEditButton, inlineStyles1.inlineStyle4]}>{'Add'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            hitSlop={{ top: 5, bottom: 5, left: 0, right: 0 }}
                            style={[styles.editButton, inlineStyles1.inlineStyle5]}
                            onPress={() => setIsEdit(!isEdit)}
                        >
                            <Text style={styles.headerEditButton}>{isEdit ? 'Done' : 'Edit'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {FavoriteExist ? (
                    <ModalItemsForFavorites
                        initVal={selected}
                        data={FavoriteList}
                        isEdit={isEdit}
                        onPressEvent={handleSelectWallet}
                        onPressEventForEdit={handleSelectWalletForEdit}
                    />
                ) : (
                    <View style={inlineStyles1.inlineStyle6}>
                        <Text style={styles.notice}>{NO_FAVORITE}</Text>
                    </View>
                )}
            </View>
        </CustomModal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        width: '100%',
        maxHeight: 500,
        backgroundColor: BoxDarkColor
    },
    headerBox: {
        paddingLeft: 10,
        paddingVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: BoxColor
    },
    headerTitle: {
        fontFamily: Lato,
        fontSize: 18,
        color: TextCatTitleColor,
        paddingHorizontal: 10
    },
    editButton: {
        paddingRight: 10
    },
    headerEditButton: {
        minWidth: 60,
        fontFamily: Lato,
        fontSize: 16,
        color: TextCatTitleColor,
        paddingHorizontal: 10,
        textAlign: 'right'
    },
    notice: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextGrayColor
    }
});

export default FavoritesModal;
