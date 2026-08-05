import React, { useMemo, useState } from 'react';
import { CW_TX_NOTICE_TEXT } from '@/constants/common';
import { CommonActions, ModalActions, WalletActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { wait } from '@/util/common';
import { StyleSheet, View } from 'react-native';

import InputSetVertical from '@/components/input/inputSetVertical';
import InputSetVerticalForAddress from '@/components/input/inputSetVerticalForAddress';
import { FavoritesCreateModal, FavoritesModal } from '@/components/modal';
import WarnContainer from '@/components/parts/containers/warnContainer';

interface IProps {
    handleSendInfo: (type: string, value: string | number) => void;
    reset: boolean;
    dstAddress: string;
}

const SendInputBox = ({ handleSendInfo, reset, dstAddress }: IProps) => {
    const { favoriteModal, favoriteCreateModal } = useAppSelector((state) => state.modal);

    const [addressValue, setAddressValue] = useState(dstAddress);
    const [memoValue, setMemoValue] = useState('');

    const openFavoriteModal = useMemo(() => {
        return favoriteModal;
    }, [favoriteModal]);

    const openFavoriteCreateModal = useMemo(() => {
        return favoriteCreateModal;
    }, [favoriteCreateModal]);

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
        const loadingRequestId = CommonActions.beginLoadingProgress();
        wait(600).then(() => {
            CommonActions.endLoadingProgress(loadingRequestId);
            setOpenFavoriteCreateModal(true);
        });
    };

    const handleCreatedFavoriteModal = () => {
        setOpenFavoriteCreateModal(false);
        const loadingRequestId = CommonActions.beginLoadingProgress();
        wait(600).then(() => {
            CommonActions.endLoadingProgress(loadingRequestId);
            setOpenFavoriteModal(true);
        });
    };

    return (
        <View>
            <InputSetVerticalForAddress
                title="To address"
                placeholder="Address"
                value={addressValue}
                resetValues={reset}
                onChangeEvent={(value: string) => handleSendInfoState('address', value)}
            />
            <InputSetVertical
                title="Memo"
                value={memoValue}
                validation={true}
                placeholder="Memo"
                resetValues={reset}
                onChangeEvent={(value: string) => handleSendInfoState('memo', value)}
            />
            <View style={styles.inlineStyle1}>
                <WarnContainer text={CW_TX_NOTICE_TEXT} question={false} />
            </View>

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
    inlineStyle1: { paddingTop: 20 }
});

export default SendInputBox;
