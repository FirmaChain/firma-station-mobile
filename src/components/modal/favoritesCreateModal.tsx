import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    EXIST_ADDRESS_IN_FAVORITE_WARN_TEXT,
    EXIST_NAME_IN_FAVORITE_WARN_TEXT,
    FAVORITE_ADD_SUCCESS,
    FAVORITE_ADJUST_SUCCESS,
    WRONG_TARGET_ADDRESS_WARN_TEXT
} from '@/constants/common';
import {
    BgColor,
    BoxColor,
    InputBgColor,
    InputPlaceholderColor,
    Lato,
    TextCatTitleColor,
    TextColor,
    TextDisableColor,
    TextGrayColor,
    WhiteColor
} from '@/constants/theme';
import { ModalActions, StorageActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { IFavoriteProps, IFavoriteState } from '@/redux/types';
import { addressCheck } from '@/util/firma';
import Clipboard from '@react-native-clipboard/clipboard';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';

import CustomModal from '@/components/modal/customModal';

import Button from '../button/button';
import TextButton from '../button/textButton';

interface IProps {
    open: boolean;
    address: string;
    setOpenModal: (open: boolean) => void;
    handleOpenFavoriteModal: (isAdded: boolean) => void;
}

const FavoritesCreateModal = ({ open, address, setOpenModal, handleOpenFavoriteModal }: IProps) => {
    const { loading: isLoading } = useAppSelector((state) => state.common);
    const { favorite } = useAppSelector((state) => state.storage);
    const { address: walletAddress } = useAppSelector((state) => state.wallet);
    const { favoriteData } = useAppSelector((state) => state.modal);

    const [addressFocus, setAddressFocus] = useState(false);
    const [addressValue, setAddressValue] = useState('');
    const [nameFocus, setNameFocus] = useState(false);
    const [nameValue, setNameValue] = useState('');
    const [memoFocus, setMemoFocus] = useState(false);
    const [memoValue, setMemoValue] = useState('');

    const isAdjust = useMemo(() => {
        return favoriteData !== null;
    }, [favoriteData]);

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

            const _favorites = favorite;

            if (_favorites === undefined) {
                addFirstFavorite();
            } else {
                const myList = _favorites.find((value) => value.ownerAddress === walletAddress);
                if (myList === undefined) {
                    addNewFavorite(_favorites);
                } else {
                    const newFavorite = [...myList.favorite];
                    if (isAdjust) {
                        const adjustList = newFavorite.map((value) => {
                            if (value.address === addressValue) {
                                return {
                                    name: nameValue,
                                    address: addressValue,
                                    memo: memoValue
                                };
                            } else {
                                return value;
                            }
                        });
                        addNewFavoriteAtMine(_favorites, adjustList);
                    } else {
                        newFavorite.unshift({
                            name: nameValue,
                            address: addressValue,
                            memo: memoValue
                        });
                        addNewFavoriteAtMine(_favorites, newFavorite);
                    }
                }
            }

            Toast.show({
                type: 'info',
                text1: isAdjust ? FAVORITE_ADJUST_SUCCESS : FAVORITE_ADD_SUCCESS
            });

            handleOpenModalPrev(true);
        } catch (error) {
            console.error(error);
            return Toast.show({
                type: 'error',
                text1: String(error)
            });
        }
    };

    const addFirstFavorite = () => {
        StorageActions.handleFavorite([
            {
                ownerAddress: walletAddress,
                favorite: [
                    {
                        name: nameValue,
                        address: addressValue,
                        memo: memoValue
                    }
                ]
            }
        ]);
    };

    const addNewFavorite = (favorites: IFavoriteState[]) => {
        StorageActions.handleFavorite([
            ...favorites,
            {
                ownerAddress: walletAddress,
                favorite: [
                    {
                        name: nameValue,
                        address: addressValue,
                        memo: memoValue
                    }
                ]
            }
        ]);
    };

    const addNewFavoriteAtMine = (favorites: IFavoriteState[], newFavorite: IFavoriteProps[]) => {
        const newList = favorites.map((value) => {
            if (value.ownerAddress === walletAddress) {
                return {
                    ownerAddress: value.ownerAddress,
                    favorite: newFavorite
                };
            } else {
                return value;
            }
        });
        StorageActions.handleFavorite(newList);
    };

    const verifyAddress = useCallback(() => {
        try {
            const result = addressCheck(addressValue);
            if (result === false) throw WRONG_TARGET_ADDRESS_WARN_TEXT;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }, [addressValue, walletAddress]);

    const verifyExistFavorite = useCallback(() => {
        try {
            if (isAdjust === true) return;
            const _favorite = favorite;
            if (_favorite === undefined) return;

            const result = _favorite.find((value) => value.ownerAddress === walletAddress);
            if (result !== undefined) {
                if (result.favorite.find((value) => value.address === addressValue) !== undefined)
                    throw EXIST_ADDRESS_IN_FAVORITE_WARN_TEXT;
                if (result.favorite.find((value) => value.name === nameValue) !== undefined) throw EXIST_NAME_IN_FAVORITE_WARN_TEXT;
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }, [isAdjust, addressValue, nameValue, walletAddress]);

    useEffect(() => {
        if (isAdjust) {
            const address = favoriteData;
            const favoriteList = favorite;
            const myList = favoriteList.find((value) => value.ownerAddress === walletAddress);

            if (myList !== undefined) {
                const favorite = myList.favorite.find((value) => value.address === address);
                if (favorite !== undefined) {
                    setAddressValue(favorite.address);
                    setNameValue(favorite.name);
                    setMemoValue(favorite.memo === undefined ? '' : favorite.memo);
                }
            }
        }
    }, [isAdjust, favoriteData, favorite]);

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

    const inlineStyles1 = {
        inlineStyle1: { marginTop: 15 },
        inlineStyle2: { borderColor: nameFocus ? WhiteColor : 'transparent' },
        inlineStyle3: {
            color: isAdjust === false ? TextColor : TextDisableColor,
            borderColor: addressFocus ? WhiteColor : 'transparent'
        },
        inlineStyle4: { fontSize: 12 },
        inlineStyle5: { borderColor: memoFocus ? WhiteColor : 'transparent' },
        inlineStyle6: { flex: 1 },
        inlineStyle7: { width: 10 },
        inlineStyle8: { flex: 1 }
    } as const;

    return (
        <CustomModal
            visible={open}
            bgColor={BgColor}
            toastInModal={false}
            forceActive={true}
            handleOpen={open === false ? () => null : handleOpenModal}
        >
            <View style={styles.modalContainer}>
                <View style={styles.headerBox}>
                    <Text style={styles.headerTitle}>{isAdjust ? 'Edit Favorite' : 'Add Favorite'}</Text>
                </View>
                <View style={[styles.inputContainer, inlineStyles1.inlineStyle1]}>
                    <View style={styles.textContainer}>
                        <Text style={styles.text}>{'Name'}</Text>
                    </View>
                    <TextInput
                        style={[styles.input, inlineStyles1.inlineStyle2]}
                        placeholder={'Name'}
                        placeholderTextColor={InputPlaceholderColor}
                        secureTextEntry={false}
                        keyboardType={'default'}
                        autoCapitalize="none"
                        value={nameValue}
                        selectionColor={TextGrayColor}
                        onFocus={() => setNameFocus(true)}
                        onBlur={() => setNameFocus(false)}
                        onChangeText={(text) => handleNameValue(text)}
                        editable={!isLoading}
                    />
                    <View style={styles.textContainer}>
                        <Text style={styles.text}>{'Address'}</Text>
                        {isAdjust === false && <TextButton title={'Paste'} onPressEvent={handlePaste} />}
                    </View>
                    <TextInput
                        style={[styles.input, inlineStyles1.inlineStyle3]}
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
                        onChangeText={(text) => handleAddressValue(text)}
                    />
                    <View style={styles.textContainer}>
                        <Text style={styles.text}>
                            {'Memo'}
                            <Text style={[styles.text, inlineStyles1.inlineStyle4]}>{' (Optional) '}</Text>
                        </Text>
                    </View>
                    <TextInput
                        style={[styles.input, inlineStyles1.inlineStyle5]}
                        placeholder={'Memo'}
                        placeholderTextColor={InputPlaceholderColor}
                        secureTextEntry={false}
                        keyboardType={'default'}
                        autoCapitalize="none"
                        value={memoValue}
                        selectionColor={TextGrayColor}
                        onFocus={() => setMemoFocus(true)}
                        onBlur={() => setMemoFocus(false)}
                        onChangeText={(text) => handleMemoValue(text)}
                        editable={!isLoading}
                    />
                    <View style={styles.buttonBox}>
                        <View style={inlineStyles1.inlineStyle6}>
                            <Button title={'Cancel'} active={true} border={true} onPressEvent={() => handleOpenModalPrev(false)} />
                        </View>
                        <View style={inlineStyles1.inlineStyle7} />
                        <View style={inlineStyles1.inlineStyle8}>
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
        paddingBottom: 20
    },
    headerBox: {
        paddingHorizontal: 10,
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
    inputContainer: {
        paddingHorizontal: 20
    },
    textContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginBottom: 8
    },
    text: {
        flex: 1,
        fontFamily: Lato,
        fontSize: 16,
        color: TextCatTitleColor
    },
    input: {
        color: TextColor,
        padding: 12,
        borderWidth: 1,
        backgroundColor: InputBgColor,
        marginBottom: 13
    },
    buttonBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    }
});

export default FavoritesCreateModal;
