import React, { useEffect, useMemo, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BgColor, BoxColor, InputBgColor, InputPlaceholderColor, Lato, TextCatTitleColor, TextColor, WhiteColor } from '@/constants/theme';
import { CHAIN_SYMBOL, CW_TX_NOTICE_TEXT } from '@/constants/common';
import InputSetVerticalForAddress from '@/components/input/inputSetVerticalForAddress';
import InputSetVerticalForAmount from '@/components/input/inputSetVerticalForAmount';
import InputSetVertical from '@/components/input/inputSetVertical';
import WarnContainer from '@/components/parts/containers/warnContainer';
import { CommonActions, ModalActions, WalletActions } from '@/redux/actions';
import { FavoritesCreateModal, FavoritesModal } from '@/components/modal';
import { useAppSelector } from '@/redux/hooks';
import { rootState } from '@/redux/reducers';
import { wait } from '@/util/common';
import { DownArrow } from '@/components/icon/icon';
import { SendType } from '.';
import { easeInAndOutCustomAnim, LayoutAnim } from '@/util/animation';
import CustomModal from '@/components/modal/customModal';
import ModalIBCChain from '@/components/modal/modalIBCChain';
import { IBC_SEND_CHAIN_CONFIG, IbcChainState } from '../../../../config';

interface IProps {
    handleSendInfo: (type: string, value: string | number | IbcChainState | null) => void;
    type: SendType;
    denom: string;
    available: number;
    symbol?: string;
    reset: boolean;
    dstAddress: string;
}

const SendInputBox = ({ handleSendInfo, type, denom, available, symbol = CHAIN_SYMBOL(), reset, dstAddress }: IProps) => {
    const { modal } = useAppSelector((state: rootState) => state);
    const _CHAIN_SYMBOL = symbol;
    const [addressValue, setAddressValue] = useState(dstAddress);
    const [memoValue, setMemoValue] = useState('');
    const [openChainSelectModal, setOpenChainSelectModal] = useState(false);
    const [accordionHeight, setAccordionHeight] = useState(0);
    const [selectChain, setSelectChain] = useState<IbcChainState | null>(null);

    useEffect(() => {
        LayoutAnim();
        easeInAndOutCustomAnim(150);
        if (type === 'SEND_IBC') {
            setAccordionHeight(70);
        } else {
            handleSendInfoState('chain', null);
            setAccordionHeight(0);
        }
    }, [type]);

    const openFavoriteModal = useMemo(() => {
        return modal.favoriteModal;
    }, [modal.favoriteModal]);

    const openFavoriteCreateModal = useMemo(() => {
        return modal.favoriteCreateModal;
    }, [modal.favoriteCreateModal]);

    const handleSendInfoState = (type: string, value: string | number | IbcChainState | null) => {
        handleSendInfo(type, value);
        if (type === 'address' && (typeof value === 'string' || typeof value === 'number')) setAddressValue(value.toString());
        if (type === 'memo' && (typeof value === 'string' || typeof value === 'number')) setMemoValue(value.toString());
        if (type === 'chain' && (typeof value !== 'string' && typeof value !== 'number')) {
            setSelectChain(value);
            setOpenChainSelectModal(false);
        }
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

    return (
        <View>
            <View style={[styles.chainContainer, { height: accordionHeight }]}>
                <Text style={styles.chainTitle}>Destination Chain</Text>
                <TouchableOpacity style={styles.chainSelectBox} onPress={() => setOpenChainSelectModal(true)}>
                    <Text style={[styles.chain, { color: selectChain === null ? InputPlaceholderColor : TextColor }]}>{selectChain === null ? 'Select IBC chain' : `${selectChain.name.toUpperCase()} (${selectChain.channel})`}</Text>
                    <DownArrow size={10} color={InputPlaceholderColor} />
                </TouchableOpacity>
            </View>

            <InputSetVerticalForAddress
                title="To address"
                placeholder="Address"
                value={addressValue}
                resetValues={reset}
                onChangeEvent={(value: any) => handleSendInfoState('address', value)}
            />
            <InputSetVerticalForAmount
                title="Amount"
                placeholder={`0 ${_CHAIN_SYMBOL.toUpperCase()}`}
                accent={false}
                limitValue={available}
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

            <View style={{ paddingTop: 20 }}>
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
            <CustomModal visible={openChainSelectModal} bgColor={BgColor} handleOpen={setOpenChainSelectModal}>
                <React.Fragment>
                    <View style={styles.headerBox}>
                        <Text style={styles.headerTitle}>{'Destination Chain'}</Text>
                    </View>
                    <ModalIBCChain
                        data={IBC_SEND_CHAIN_CONFIG[denom]}
                        selectChain={selectChain}
                        onPressEvent={(value: IbcChainState) => handleSendInfoState('chain', value)}
                    />
                </React.Fragment>
            </CustomModal>
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
    },
    chainContainer: {
        marginBottom: 20,
        overflow: 'hidden'
    },
    chainTitle: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextCatTitleColor,
        marginBottom: 5,
    },
    chainSelectBox: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: InputBgColor,
        marginBottom: 5,
    },
    chain: {
        fontFamily: Lato,
        fontSize: 14,
        color: TextColor,
    },
    headerBox: {
        width: '100%',
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
});

export default SendInputBox;
