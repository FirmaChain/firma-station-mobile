import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DisableColor, Lato, PointColor, TextCatTitleColor, WhiteColor } from '@/constants/theme';
import { AUTO_ENTERED_AMOUNT_TEXT, CHAIN_SYMBOL, FAVORITE_ADD_SUCCESS, FEE_INSUFFICIENT_NOTICE } from '@/constants/common';
import InputSetVerticalForAddress from '@/components/input/inputSetVerticalForAddress';
import InputSetVerticalForAmount from '@/components/input/inputSetVerticalForAmount';
import InputSetVertical from '@/components/input/inputSetVertical';
import WarnContainer from '@/components/parts/containers/warnContainer';
import { CommonActions, ModalActions, WalletActions } from '@/redux/actions';
import { FavoritesCreateModal, FavoritesModal } from '@/components/modal';
import { useAppSelector } from '@/redux/hooks';
import { rootState } from '@/redux/reducers';
import { wait } from '@/util/common';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

interface IProps {
    handleSendInfo: (type: string, value: string | number) => void;
    available: number;
    reset: boolean;
    dstAddress: string;
}

const SendInputBox = ({ handleSendInfo, available, reset, dstAddress }: IProps) => {
    const _CHAIN_SYMBOL = CHAIN_SYMBOL();

    const { modal } = useAppSelector((state: rootState) => state);

    const [safetyActive, setSafetyActive] = useState(true);
    const [limitAvailable, setLimitAvailable] = useState(0);
    const [addressValue, setAddressValue] = useState(dstAddress);
    const [memoValue, setMemoValue] = useState('');

    const openFavoriteModal = useMemo(() => {
        return modal.favoriteModal;
    }, [modal.favoriteModal]);

    const openFavoriteCreateModal = useMemo(() => {
        return modal.favoriteCreateModal;
    }, [modal.favoriteCreateModal]);

    const handleSendInfoState = (type: string, value: string | number) => {
        handleSendInfo(type, value);
        if (type === 'address') setAddressValue(value.toString());
        if (type === 'memo') setMemoValue(value.toString());
        WalletActions.handleDstAddress('');
    };

    const handleValuesFromFavorite = (address: string, memo: string) => {
        setAddressValue(address);
        setMemoValue(memo);
    };

    const setOpenFavoriteModal = (active: boolean) => {
        ModalActions.handleFavoriteModal(active);
    };

    const setOpenFavoriteCreateModal = (active: boolean) => {
        ModalActions.handleFavoriteCreateModal(active);
    };

    const handleOpenCreateFavoriteModal = () => {
        setOpenFavoriteModal(false);
        CommonActions.handleLoadingProgress(true);
        wait(600).then(() => {
            CommonActions.handleLoadingProgress(false);
            setOpenFavoriteCreateModal(true);
        });
    };

    const handleCreatedFavoriteModal = (_isAdded: boolean) => {
        setOpenFavoriteCreateModal(false);
        CommonActions.handleLoadingProgress(true);
        wait(600).then(() => {
            CommonActions.handleLoadingProgress(false);
            setOpenFavoriteModal(true);
        });
    };

    useEffect(() => {
        if (safetyActive) {
            if (available > 100000) {
                setLimitAvailable(available - 100000);
            }
        } else {
            if (available > 20000) {
                setLimitAvailable(available - 20000);
            } else {
                setLimitAvailable(0);
            }
        }
    }, [available, safetyActive]);

    useEffect(() => {
        if (available > 100000) {
            setSafetyActive(true);
        } else {
            setLimitAvailable(available >= 20000 ? available - 20000 : 0);
            setSafetyActive(false);
        }
    }, [available]);

    return (
        <View>
            <InputSetVerticalForAddress
                title="To address"
                placeholder="Address"
                value={addressValue}
                resetValues={reset}
                onChangeEvent={(value: any) => handleSendInfoState('address', value)}
            />
            <InputSetVerticalForAmount
                title="Amount"
                placeholder={`0 ${_CHAIN_SYMBOL}`}
                accent={safetyActive}
                limitValue={limitAvailable}
                resetValues={reset}
                onChangeEvent={(value: any) => handleSendInfoState('amount', value)}
            />
            <InputSetVertical
                title="Memo"
                value={memoValue}
                validation={true}
                placeholder="Memo"
                resetValues={reset}
                onChangeEvent={(value: any) => handleSendInfoState('memo', value)}
            />
            <View style={styles.radioBox}>
                <Text style={[styles.title, { paddingRight: 5 }]}>Safety</Text>
                <TouchableOpacity disabled={available <= 100000} onPress={() => setSafetyActive(!safetyActive)}>
                    <View
                        style={[
                            styles.radioWrapper,
                            safetyActive ? { backgroundColor: PointColor, alignItems: 'flex-end' } : { backgroundColor: DisableColor }
                        ]}
                    >
                        <View style={styles.radio} />
                    </View>
                </TouchableOpacity>
            </View>
            {available > 0 && available <= 20000 && (
                <View style={{ marginBottom: 10 }}>
                    <WarnContainer text={FEE_INSUFFICIENT_NOTICE} />
                </View>
            )}
            {safetyActive && available > 100000 && (
                <View>
                    <WarnContainer text={AUTO_ENTERED_AMOUNT_TEXT} question={true} />
                </View>
            )}

            <FavoritesModal
                open={openFavoriteModal}
                address={addressValue}
                memo={memoValue}
                setOpenModal={setOpenFavoriteModal}
                setValue={handleValuesFromFavorite}
                handleCreateFavorite={handleOpenCreateFavoriteModal}
            />
            <FavoritesCreateModal
                open={openFavoriteCreateModal}
                address={addressValue}
                setOpenModal={setOpenFavoriteCreateModal}
                handleOpenFavoriteModal={handleCreatedFavoriteModal}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextCatTitleColor,
        marginBottom: 5
    },
    radioBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 10
    },
    radioWrapper: {
        width: 45,
        borderRadius: 20,
        justifyContent: 'center',
        padding: 3
    },
    radio: {
        width: 18,
        height: 18,
        borderRadius: 50,
        backgroundColor: WhiteColor
    }
});

export default SendInputBox;
