import React, { useEffect, useMemo, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAppSelector } from "@/redux/hooks";
import { StorageActions } from "@/redux/actions";
import { IStakingState } from "@/hooks/staking/hooks";
import { convertAmount, 
        convertCurrent, 
        convertNumber, 
        convertToFctNumber, 
        makeDecimalPoint, 
        resizeFontSize } from "@/util/common";
import { DownArrow, ForwardArrow } from "@/components/icon/icon";
import { FIRMA_LOGO } from "@/constants/images";
import { CHAIN_CURRENCY, CURRENCY_LIST, CURRENCY_SYMBOL } from "@/constants/common";
import { BoxColor, DisableColor, GrayColor, Lato, TextCatTitleColor, TextColor, TextDarkGrayColor } from "@/constants/theme";
import SmallButton from "@/components/button/smallButton";
import CustomModal from "@/components/modal/customModal";
import ModalItems from "@/components/modal/modalItems";
import { FirmaUtil } from "@firmachain/firma-js";

interface IProps {
    stakingValues: IStakingState;
    handleSend: Function;
    handleStaking: Function;
    chainInfo: any;
}

const BalanceBox = ({stakingValues, handleSend, handleStaking, chainInfo}:IProps) => {
    const {storage, staking} = useAppSelector(state => state);
    
    const [currencyIndex, setCurrencyIndex] = useState(0);
    const [openCurrencySelectModal, setOpenCurrencySelectModal] = useState(false);

    const currencyList = useMemo(() => {
        if(chainInfo.market_data === undefined) return [];
        const allList = Object.keys(chainInfo.market_data.current_price);
        let list:string[] = [];
        allList
            .filter(key => CURRENCY_LIST.includes(key.toUpperCase()))
            .map(value => {list[CURRENCY_LIST.indexOf(value.toUpperCase())] = value.toUpperCase();});
        return list.filter(value => value !== undefined).map(value => {
            return value;
        });
    }, [chainInfo]);

    const symbolList = useMemo(() => {
        if(currencyList.length === 0) return [];
        let result = currencyList.map(value => {
            if(CURRENCY_SYMBOL[value.toUpperCase()] === undefined){
                if(CHAIN_CURRENCY[value.toUpperCase()] === undefined){
                    return value.toUpperCase();
                } else {
                    return CHAIN_CURRENCY[value.toUpperCase()];
                }
            } else {
                return CURRENCY_SYMBOL[value.toUpperCase()];
            }
        })
        return result;
    }, [currencyList]);

    useEffect(() => {
        setCurrencyIndex(currencyList.indexOf(storage.currency));
    }, [currencyList])

    const currentPrice = useMemo(() => {
        if(chainInfo?.market_data === undefined) return 0;
        return Number(chainInfo.market_data.current_price[storage.currency.toLowerCase()]);
    }, [chainInfo, storage.currency]);

    const currentExchange = useMemo(() => {
        if(chainInfo?.market_data === undefined) return 0;
        return makeDecimalPoint(chainInfo.market_data.current_price['usd'], 3)
    }, [chainInfo])

    const available = useMemo(() => {
        return stakingValues.available;
    }, [stakingValues])

    const delegated = useMemo(() => {
        return convertCurrent(makeDecimalPoint(stakingValues.delegated));
    }, [stakingValues]);

    const undelegate = useMemo(() => {
        return convertCurrent(makeDecimalPoint((stakingValues.undelegate)));
    }, [stakingValues]);

    const reward = useMemo(() => {
        return convertCurrent(makeDecimalPoint((staking.stakingReward)));
    }, [staking.stakingReward]);
    
    const currencyData = useMemo(() => {
        let decimal = 2;
        const fct = convertToFctNumber(available) * currentPrice;
        if(["BTC","ETH"].includes(storage.currency)){
            decimal = 6;
            if(fct > 10) decimal = 5;
            if(fct > 100) decimal = 4;
            if(fct > 1000) decimal = 3;
            if(fct > 10000) decimal = 2;
        }
        return convertCurrent(makeDecimalPoint(fct.toFixed(6), decimal));
    }, [currentPrice, available])

    const balanceTextSize = useMemo(() => {
        return resizeFontSize(convertNumber(FirmaUtil.getFCTStringFromUFCT(available)), 100000, 28);
    }, [available])

    const handleCurrencySelectModal = (open: boolean) => {
        setOpenCurrencySelectModal(open);
    }

    const CurrencyText = () => {
        if(CURRENCY_SYMBOL[storage.currency] === undefined){
            return (
                <View style={styles.currencyWrapper}>
                    <Text style={[styles.balance, {fontSize: 16}]}>{currencyData}</Text>
                    <Text style={[styles.balance, {fontSize: 10, paddingBottom: 1, paddingLeft: 4}]}>{storage.currency}</Text>
                </View>
            )
        } else {
            return (
                <View style={styles.currencyWrapper}>
                    <Text style={[styles.balance, {fontSize: 16}]}>{CURRENCY_SYMBOL[storage.currency]}</Text>
                    <Text style={[styles.balance, {fontSize: 16, paddingLeft: 4}]}>{currencyData}</Text>
                </View>
            )
        }
    }

    const handleSelectCurrency = (index:number) => {
        setCurrencyIndex(index);
        StorageActions.handleCurrency(currencyList[index]);
        setOpenCurrencySelectModal(false);
    }

    return (
        <View style={styles.container}>
            <View style={[styles.box, {paddingBottom: 20}]}>
                <Text style={styles.title}>Available</Text>
                <View style={[styles.wrapperH, {justifyContent: "space-between", alignItems: "center", paddingTop: 8, paddingBottom: 19}]}>
                    <View style={[styles.wrapperH, {alignItems: "center"}]}>
                        <Image style={styles.logo} source={FIRMA_LOGO} />
                        <Text style={[styles.balance, {fontSize:balanceTextSize, paddingLeft: 5,}]}>{convertAmount(available)}
                            <Text style={[styles.chainName, {paddingLeft: 2}]}> FCT</Text>
                        </Text>
                    </View>
                    <SmallButton
                        title="Send"
                        active={available > 0}
                        size={90}
                        onPressEvent={handleSend}/>
                </View>
                <View style={styles.divider} />
                <View style={[styles.wrapperH, {justifyContent: "space-between", paddingTop: 12}]}>
                    <TouchableOpacity style={styles.currency} onPress={()=>handleCurrencySelectModal(true)}>
                        <Text style={[styles.chainName, {fontSize: 16, paddingRight: 4}]}>{storage.currency}</Text>
                        <DownArrow size={12} color={GrayColor} />
                    </TouchableOpacity>
                    {CurrencyText()}
                    <CustomModal visible={openCurrencySelectModal} handleOpen={handleCurrencySelectModal}>
                        <>
                        <View style={styles.headerBox}>
                            <Text style={styles.headerTitle}>Currency</Text>
                        </View>
                        <ModalItems initVal={currencyIndex} data={currencyList} subData={symbolList} onPressEvent={handleSelectCurrency}/>
                        </>
                    </CustomModal>
                </View>
                <View style={[styles.wrapperH, {justifyContent: "flex-end", paddingTop: 5}]}>
                    <Text 
                        style={[styles.balance, 
                            {fontSize: 12, 
                            fontWeight: "normal", 
                            color: TextDarkGrayColor}]}>
                            {"(1 FCT = $ "+ currentExchange +")"}
                    </Text>
                </View>
            </View>

            <TouchableOpacity style={[styles.box, {marginVertical: 16, paddingHorizontal: 0}]} 
                    onPress={()=>handleStaking()}>
                <View 
                    style={[styles.wrapperH, {justifyContent: "space-between", alignItems: "center",paddingHorizontal: 20}]} >
                    <Text style={styles.title}>Staking</Text>
                    <ForwardArrow size={20} color={TextCatTitleColor}/>
                </View>
                <View style={[styles.wrapperH, {justifyContent: "space-between", alignItems: "center", paddingTop: 18}]}>
                    <View style={styles.stakingWrapper}>
                        <Text style={[styles.chainName, {fontSize: 14}]}>Delegated</Text>
                        <Text style={[styles.balance, {fontSize: 18}]}>{delegated}</Text>
                    </View>
                    <View style={styles.dividerV} />
                    <View style={styles.stakingWrapper}>
                        <Text style={[styles.chainName, {fontSize: 14}]}>Undelegate</Text>
                        <Text style={[styles.balance, {fontSize: 18}]}>{undelegate}</Text>
                    </View>
                    <View style={styles.dividerV} />
                    <View style={styles.stakingWrapper}>
                        <Text style={[styles.chainName, {fontSize: 14}]}>Reward</Text>
                        <Text style={[styles.balance, {fontSize: 18}]}>{reward}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: "auto",
        paddingHorizontal: 20,
        marginTop: 16,
    },
    box: {
        borderRadius: 8,
        backgroundColor: BoxColor,
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 30,
    },
    wrapperH: {
        flexDirection: "row",
    },
    title: {
        fontFamily: Lato,
        fontSize: 20,
        fontWeight: "bold",
        color: TextCatTitleColor,
    },
    logo: {
        width: 30,
        height: 30,
    },
    balance: {
        fontFamily: Lato,
        fontSize: 28,
        fontWeight: "600",
        textAlign: "center",
        color: TextColor,
    },
    chainName: {
        fontFamily: Lato,
        fontSize: 14,
        fontWeight: "normal",
        textAlign: "center",
        color: TextDarkGrayColor,
    },
    stakingWrapper: {
        flex: 1,
        height: 51,
        justifyContent: "space-between",
        alignItems: "center",
    },
    divider: {
        height: 1,
        backgroundColor: DisableColor,
    },
    dividerV: {
        width: .5,
        height: 50,
        backgroundColor: DisableColor,
    },
    headerBox: {
        width: "100%",
        paddingHorizontal: 10,
        paddingVertical: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: BoxColor,
    },
    headerTitle: {
        fontFamily: Lato,
        fontSize: 18,
        color: TextCatTitleColor,
        paddingHorizontal: 10,
    },
    currencyWrapper: {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "flex-end",
    },
    currency: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },
})

export default BalanceBox;