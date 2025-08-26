import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IFavoriteProps } from '@/redux/types';
import { useAppSelector } from '@/redux/hooks';
import { rootState } from '@/redux/reducers';
import { LayoutAnim, easeInAndOutCustomAnim } from '@/util/animation';
import { BgColor, BoxColor, BoxDarkColor, InputBgColor, Lato, TextCatTitleColor, TextColor, TextGrayColor } from '@/constants/theme';
import { NO_FAVORITE } from '@/constants/common';
import CustomModal from '@/components/modal/customModal';
import ModalItemsForFavorites from './modalItemsForFavorites';
import { ModalActions } from '@/redux/actions';

interface IProps {
    open: boolean;
    address: string;
    memo: string;
    setOpenModal: (open: boolean) => void;
    setValue: (value: string, memo: string) => void;
    handleCreateFavorite: (open: boolean) => void;
}

const FavoritesModal = ({ open, address, memo, setOpenModal, setValue, handleCreateFavorite }: IProps) => {
    const { storage, wallet } = useAppSelector((state: rootState) => state);

    const [selected, setSelected] = useState('');
    const [isEdit, setIsEdit] = useState(false);

    const FavoriteList: IFavoriteProps[] = useMemo(() => {
        try {
            let list = storage.favorite.find(value => value.ownerAddress === wallet.address);
            if (list === undefined) return [];
            return list.favorite;
        } catch (error) {
            return [];
        }
    }, [storage]);

    const FavoriteExist = useMemo(() => {
        let exist = FavoriteList.length > 0;
        if (exist === false) setIsEdit(false);
        return exist;
    }, [FavoriteList]);

    const AnimationState = useMemo(() => {
        LayoutAnim();
        easeInAndOutCustomAnim(150);
        if (isEdit) {
            return {
                addSize: 0,
                addOpacity: 0,
            };
        } else {
            return {
                addSize: 'auto',
                addOpacity: 1,
            };
        }
    }, [isEdit]);

    const handleOpenModal = (open: boolean) => {
        setOpenModal && setOpenModal(open);
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

    return (
        <CustomModal
            visible={open}
            bgColor={BgColor}
            toastInModal={false}
            forceActive={true}
            handleOpen={open === false ? () => null : handleOpenModal}>
            <View style={[styles.modalContainer, { marginBottom: FavoriteExist ? 20 : 10 }]}>
                <View style={styles.headerBox}>
                    <Text style={styles.headerTitle}>{'Favorites'}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            hitSlop={{ top: 5, bottom: 5, left: 0, right: 0 }}
                            style={{
                                marginRight: FavoriteExist ? 5 : 16,
                                paddingLeft: 10,
                                paddingRight: 5,
                            }}
                            onPress={() => {
                                isEdit === false && handleCreateFavorite(true);
                            }}>
                            <Text
                                style={[
                                    styles.headerEditButton,
                                    {
                                        opacity: AnimationState.addOpacity,
                                    },
                                ]}>
                                {'Add'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            hitSlop={{ top: 5, bottom: 5, left: 0, right: 0 }}
                            style={[styles.editButton, { display: FavoriteExist ? 'flex' : 'none', paddingRight: FavoriteExist ? 10 : 0 }]}
                            onPress={() => setIsEdit(!isEdit)}>
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
                    <View style={{ height: 300, justifyContent: 'center', alignItems: 'center', backgroundColor: BgColor }}>
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
        backgroundColor: BoxDarkColor,
    },
    headerBox: {
        paddingLeft: 10,
        paddingVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: BoxColor,
    },
    headerTitle: {
        fontFamily: Lato,
        fontSize: 18,
        color: TextCatTitleColor,
        paddingHorizontal: 10,
    },
    inputContainer: {
        paddingHorizontal: 20,
    },
    textContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    text: {
        flex: 1,
        fontFamily: Lato,
        fontSize: 14,
        color: TextCatTitleColor,
    },
    input: {
        color: TextColor,
        padding: 12,
        borderWidth: 1,
        backgroundColor: InputBgColor,
        marginBottom: 5,
    },
    editButton: {
        paddingRight: 10,
    },
    headerEditButton: {
        minWidth: 60,
        fontFamily: Lato,
        fontSize: 16,
        color: TextCatTitleColor,
        paddingHorizontal: 10,
        textAlign: 'right',
    },
    notice: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextGrayColor,
    },
});

export default FavoritesModal;
