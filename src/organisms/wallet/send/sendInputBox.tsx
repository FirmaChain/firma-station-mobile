import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
    BgColor,
    BoxColor,
    DisableColor,
    InputBgColor,
    InputPlaceholderColor,
    Lato,
    PointColor,
    TextCatTitleColor,
    TextColor,
    WhiteColor,
} from '@/constants/theme';
import {
    AUTO_ENTERED_AMOUNT_TEXT,
    CHAIN_SYMBOL,
    CW_TX_NOTICE_TEXT,
    FAVORITE_ADD_SUCCESS,
    FEE_INSUFFICIENT_NOTICE,
} from '@/constants/common';
import InputSetVerticalForAddress from '@/components/input/inputSetVerticalForAddress';
import InputSetVerticalForAmount from '@/components/input/inputSetVerticalForAmount';
import InputSetVertical from '@/components/input/inputSetVertical';
import WarnContainer from '@/components/parts/containers/warnContainer';
import { CommonActions, ModalActions, WalletActions } from '@/redux/actions';
import { FavoritesCreateModal, FavoritesModal } from '@/components/modal';
import { useAppSelector } from '@/redux/hooks';
import { rootState } from '@/redux/reducers';
import { convertNumber, convertToFctNumberForInput, wait } from '@/util/common';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { SendType } from '../common/senTypeSelector';
import { IBC_SEND_CHAIN_CONFIG, IBCChainState } from '../../../../config';
import { easeInAndOutCustomAnim, LayoutAnim } from '@/util/animation';
import { DownArrow } from '@/components/icon/icon';
import CustomModal from '@/components/modal/customModal';
import ModalIBCChain from '@/components/modal/modalIBCChain';
import { getFirmaConfig } from '@/util/firma';

interface IProps {
    handleSendInfo: (type: string, value: string | number | IBCChainState | null) => void;
    available: number;
    type: SendType;
    reset: boolean;
    dstAddress: string;
}

const SendInputBox = ({ handleSendInfo, available, type, reset, dstAddress }: IProps) => {
    const _CHAIN_SYMBOL = CHAIN_SYMBOL();

    const { modal } = useAppSelector((state: rootState) => state);

    const [safetyActive, setSafetyActive] = useState(true);
    const [limitAvailable, setLimitAvailable] = useState(0);
    const [addressValue, setAddressValue] = useState(dstAddress);
    const [memoValue, setMemoValue] = useState('');
    const [openChainSelectModal, setOpenChainSelectModal] = useState(false);
    const [accordionHeight, setAccordionHeight] = useState(0);
    const [selectChain, setSelectChain] = useState<IBCChainState | null>(null);
    const [isMaxAmount, setIsMaxAmount] = useState(false);
    const [amount, setAmount] = useState(0);

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

    const handleSendInfoState = (type: string, value: string | number | IBCChainState | null) => {
        handleSendInfo(type, value);
        if (type === 'amount' && typeof value === 'number') setAmount(value);
        if (type === 'address' && (typeof value === 'string' || typeof value === 'number')) setAddressValue(value.toString());
        if (type === 'memo' && (typeof value === 'string' || typeof value === 'number')) setMemoValue(value.toString());
        if (type === 'chain' && typeof value !== 'string' && typeof value !== 'number') {
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

    useEffect(() => {
        setIsMaxAmount(safetyActive === false && amount >= convertNumber(convertToFctNumberForInput(limitAvailable)));
    }, [amount, limitAvailable, safetyActive]);

    return (
        <View>
            <View style={[styles.chainContainer, { height: accordionHeight }]}>
                <Text style={styles.chainTitle}>Destination Chain</Text>
                <TouchableOpacity style={styles.chainSelectBox} onPress={() => setOpenChainSelectModal(true)}>
                    <Text style={[styles.chain, { color: selectChain === null ? InputPlaceholderColor : TextColor }]}>
                        {selectChain === null ? 'Select IBC chain' : `${selectChain.name.toUpperCase()} (${selectChain.channel})`}
                    </Text>
                    <DownArrow size={10} color={InputPlaceholderColor} />
                </TouchableOpacity>
            </View>

            <InputSetVerticalForAddress
                title="To address"
                placeholder="Address"
                value={addressValue}
                resetValues={reset}
                onChangeEvent={(value: any) => handleSendInfoState('address', value)}
                type={type}
            />
            <InputSetVerticalForAmount
                title="Amount"
                placeholder={`0 ${_CHAIN_SYMBOL}`}
                accent={safetyActive || isMaxAmount}
                limitValue={limitAvailable}
                resetValues={reset}
                enableMaxAmount={true}
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
                            safetyActive ? { backgroundColor: PointColor, alignItems: 'flex-end' } : { backgroundColor: DisableColor },
                        ]}>
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
            {safetyActive === false && available > 20000 && (
                <View>
                    <WarnContainer text={CW_TX_NOTICE_TEXT} question={false} />
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
            <CustomModal visible={openChainSelectModal} bgColor={BgColor} handleOpen={setOpenChainSelectModal}>
                <React.Fragment>
                    <View style={styles.modalHeaderBox}>
                        <Text style={styles.modalHeaderTitle}>{'Destination Chain'}</Text>
                    </View>
                    <ModalIBCChain
                        data={IBC_SEND_CHAIN_CONFIG[getFirmaConfig().denom]}
                        selectChain={selectChain}
                        onPressEvent={(value: IBCChainState) => handleSendInfoState('chain', value)}
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
        marginBottom: 5,
    },
    radioBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 10,
    },
    radioWrapper: {
        width: 45,
        borderRadius: 20,
        justifyContent: 'center',
        padding: 3,
    },
    radio: {
        width: 18,
        height: 18,
        borderRadius: 50,
        backgroundColor: WhiteColor,
    },
    chainContainer: {
        marginBottom: 20,
        overflow: 'hidden',
    },
    chainTitle: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextCatTitleColor,
        marginBottom: 5,
    },
    chainSelectBox: {
        flexDirection: 'row',
        alignItems: 'center',
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
    modalHeaderBox: {
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: BoxColor,
    },
    modalHeaderTitle: {
        fontFamily: Lato,
        fontSize: 18,
        color: TextCatTitleColor,
        paddingHorizontal: 10,
    },
});

export default SendInputBox;
