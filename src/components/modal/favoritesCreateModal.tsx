import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useAppSelector } from '@/redux/hooks';
import { rootState } from '@/redux/reducers';
import { ModalActions, StorageActions } from '@/redux/actions';
import { IFavoriteProps, IFavoriteState } from '@/redux/types';
import { TextDisableColor, TextGrayColor, WhiteColor } from '@/constants/theme';
import { InputPlaceholderColor } from '@/constants/theme';
import { BgColor, BoxColor, InputBgColor, Lato, TextCatTitleColor, TextColor } from '@/constants/theme';
import {
    EXIST_ADDRESS_IN_FAVORITE_WARN_TEXT,
    EXIST_NAME_IN_FAVORITE_WARN_TEXT,
    FAVORITE_ADD_SUCCESS,
    FAVORITE_ADJUST_SUCCESS,
    WRONG_TARGET_ADDRESS_WARN_TEXT,
} from '@/constants/common';
import { addressCheck } from '@/util/firma';
import Toast from 'react-native-toast-message';
import CustomModal from '@/components/modal/customModal';
import Button from '../button/button';
import TextButton from '../button/textButton';
import Clipboard from '@react-native-clipboard/clipboard';
import { useSelector } from 'react-redux';

interface IProps {
    open: boolean;
    address: string;
    setOpenModal: (open: boolean) => void;
    handleOpenFavoriteModal: (isAdded: boolean) => void;
}

const FavoritesCreateModal = ({ open, address, setOpenModal, handleOpenFavoriteModal }: IProps) => {
    const isLoading = useSelector((v: rootState) => v.common.loading);
    const { storage, wallet, modal } = useAppSelector((state: rootState) => state);
    const [addressFocus, setAddressFocus] = useState(false);
    const [addressValue, setAddressValue] = useState('');
    const [nameFocus, setNameFocus] = useState(false);
    const [nameValue, setNameValue] = useState('');
    const [memoFocus, setMemoFocus] = useState(false);
    const [memoValue, setMemoValue] = useState('');

    const isAdjust = useMemo(() => {
        return modal.favoriteData !== null;
    }, [modal.favoriteData]);

    const SaveButtonActive = useMemo(() => {
        return addressValue !== '' && nameValue !== '';
    }, [addressValue, nameValue]);

    const handleOpenModal = (open: boolean) => {
        ModalActions.handleFavoriteData(null);
        setOpenModal(open);
    };

    const handleAddressValue = (addr: string) => {
        setAddressValue(addr);
    };

    const handlePaste = async () => {
        const copied = await Clipboard.getString();
        handleAddressValue(copied);
    };

    const handleNameValue = (name: string) => {
        setNameValue(name);
    };

    const handleMemoValue = (memo: string) => {
        setMemoValue(memo);
    };

    const handleOpenModalPrev = (isAdded: boolean) => {
        ModalActions.handleFavoriteData(null);
        handleOpenFavoriteModal(isAdded);
    };

    const handleSaveFavorite = () => {
        try {
            verifyAddress();
            verifyExistFavorite();

            let favorites = storage.favorite;

            if (favorites === undefined) {
                addFirstFavorite();
            } else {
                let myList = favorites.find(value => value.ownerAddress === wallet.address);
                if (myList === undefined) {
                    addNewFavorite(favorites);
                } else {
                    let newFavorite = [...myList.favorite];
                    if (isAdjust) {
                        let adjustList = newFavorite.map(value => {
                            if (value.address === addressValue) {
                                return {
                                    name: nameValue,
                                    address: addressValue,
                                    memo: memoValue,
                                };
                            } else {
                                return value;
                            }
                        });
                        addNewFavoriteAtMine(favorites, adjustList);
                    } else {
                        newFavorite.unshift({
                            name: nameValue,
                            address: addressValue,
                            memo: memoValue,
                        });
                        addNewFavoriteAtMine(favorites, newFavorite);
                    }
                }
            }

            Toast.show({
                type: 'info',
                text1: isAdjust ? FAVORITE_ADJUST_SUCCESS : FAVORITE_ADD_SUCCESS,
            });

            handleOpenModalPrev(true);
        } catch (error) {
            console.log(error);
            return Toast.show({
                type: 'error',
                text1: String(error),
            });
        }
    };

    const addFirstFavorite = () => {
        StorageActions.handleFavorite([
            {
                ownerAddress: wallet.address,
                favorite: [
                    {
                        name: nameValue,
                        address: addressValue,
                        memo: memoValue,
                    },
                ],
            },
        ]);
    };

    const addNewFavorite = (favorites: IFavoriteState[]) => {
        StorageActions.handleFavorite([
            ...favorites,
            {
                ownerAddress: wallet.address,
                favorite: [
                    {
                        name: nameValue,
                        address: addressValue,
                        memo: memoValue,
                    },
                ],
            },
        ]);
    };

    const addNewFavoriteAtMine = (favorites: IFavoriteState[], newFavorite: IFavoriteProps[]) => {
        let newList = favorites.map(value => {
            if (value.ownerAddress === wallet.address) {
                return {
                    ownerAddress: value.ownerAddress,
                    favorite: newFavorite,
                };
            } else {
                return value;
            }
        });
        StorageActions.handleFavorite(newList);
    };

    const verifyAddress = useCallback(() => {
        try {
            let result = addressCheck(addressValue);
            if (result === false) throw WRONG_TARGET_ADDRESS_WARN_TEXT;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }, [addressValue, wallet]);

    const verifyExistFavorite = useCallback(() => {
        try {
            if (isAdjust === true) return;
            let favorite = storage.favorite;
            if (favorite === undefined) return;

            let result = favorite.find(value => value.ownerAddress === wallet.address);
            if (result !== undefined) {
                if (result.favorite.find(value => value.address === addressValue) !== undefined) throw EXIST_ADDRESS_IN_FAVORITE_WARN_TEXT;
                if (result.favorite.find(value => value.name === nameValue) !== undefined) throw EXIST_NAME_IN_FAVORITE_WARN_TEXT;
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }, [isAdjust, addressValue, nameValue, wallet]);

    useEffect(() => {
        if (isAdjust) {
            let address = modal.favoriteData;
            let favoriteList = storage.favorite;
            let myList = favoriteList.find(value => value.ownerAddress === wallet.address);

            if (myList !== undefined) {
                let favorite = myList.favorite.find(value => value.address === address);
                if (favorite !== undefined) {
                    setAddressValue(favorite.address);
                    setNameValue(favorite.name);
                    setMemoValue(favorite.memo === undefined ? '' : favorite.memo);
                }
            }
        }
    }, [isAdjust, modal.favoriteData, storage.favorite]);

    useEffect(() => {
        if (open === false) {
            setAddressValue('');
            setAddressFocus(false);
            setNameFocus(false);
            setNameValue('');
            setMemoFocus(false);
            setMemoValue('');
        }
    }, [open, address]);

    return (
        <CustomModal
            visible={open}
            bgColor={BgColor}
            toastInModal={false}
            forceActive={true}
            handleOpen={open === false ? () => null : handleOpenModal}>
            <View style={styles.modalContainer}>
                <View style={styles.headerBox}>
                    <Text style={styles.headerTitle}>{isAdjust ? 'Edit Favorite' : 'Add Favorite'}</Text>
                </View>
                <View style={[styles.inputContainer, { marginTop: 15 }]}>
                    <View style={styles.textContainer}>
                        <Text style={styles.text}>{'Name'}</Text>
                    </View>
                    <TextInput
                        style={[styles.input, { borderColor: nameFocus ? WhiteColor : 'transparent' }]}
                        placeholder={'Name'}
                        placeholderTextColor={InputPlaceholderColor}
                        secureTextEntry={false}
                        keyboardType={'default'}
                        autoCapitalize="none"
                        value={nameValue}
                        selectionColor={TextGrayColor}
                        onFocus={() => setNameFocus(true)}
                        onBlur={() => setNameFocus(false)}
                        onChangeText={text => handleNameValue(text)}
                        editable={!isLoading}
                    />
                    <View style={styles.textContainer}>
                        <Text style={styles.text}>{'Address'}</Text>
                        {isAdjust === false && <TextButton title={'Paste'} onPressEvent={handlePaste} />}
                    </View>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                color: isAdjust === false ? TextColor : TextDisableColor,
                                borderColor: addressFocus ? WhiteColor : 'transparent',
                            },
                        ]}
                        placeholder={'Address'}
                        placeholderTextColor={InputPlaceholderColor}
                        secureTextEntry={false}
                        keyboardType={'default'}
                        autoCapitalize="none"
                        value={addressValue}
                        selectionColor={TextGrayColor}
                        editable={isAdjust === false && !isLoading}
                        onFocus={() => setAddressFocus(true)}
                        onBlur={() => setAddressFocus(false)}
                        onChangeText={text => handleAddressValue(text)}
                    />
                    <View style={styles.textContainer}>
                        <Text style={styles.text}>
                            {'Memo'}
                            <Text style={[styles.text, { fontSize: 12 }]}>{' (Optional) '}</Text>
                        </Text>
                    </View>
                    <TextInput
                        style={[styles.input, { borderColor: memoFocus ? WhiteColor : 'transparent' }]}
                        placeholder={'Memo'}
                        placeholderTextColor={InputPlaceholderColor}
                        secureTextEntry={false}
                        keyboardType={'default'}
                        autoCapitalize="none"
                        value={memoValue}
                        selectionColor={TextGrayColor}
                        onFocus={() => setMemoFocus(true)}
                        onBlur={() => setMemoFocus(false)}
                        onChangeText={text => handleMemoValue(text)}
                        editable={!isLoading}
                    />
                    <View style={styles.buttonBox}>
                        <View style={{ flex: 1 }}>
                            <Button title={'Cancel'} active={true} border={true} onPressEvent={() => handleOpenModalPrev(false)} />
                        </View>
                        <View style={{ width: 10 }} />
                        <View style={{ flex: 1 }}>
                            <Button title={isAdjust ? 'Edit' : 'Add'} active={SaveButtonActive} onPressEvent={() => handleSaveFavorite()} />
                        </View>
                    </View>
                </View>
            </View>
        </CustomModal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        width: '100%',
        maxHeight: 500,
        backgroundColor: BgColor,
        paddingBottom: 20,
    },
    headerBox: {
        paddingHorizontal: 10,
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
        marginBottom: 8,
    },
    text: {
        flex: 1,
        fontFamily: Lato,
        fontSize: 16,
        color: TextCatTitleColor,
    },
    input: {
        color: TextColor,
        padding: 12,
        borderWidth: 1,
        backgroundColor: InputBgColor,
        marginBottom: 13,
    },
    buttonBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
});

export default FavoritesCreateModal;
