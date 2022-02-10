import React, { useEffect, useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Container from "@/components/parts/containers/conatainer";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import InputSetVertical from "@/components/input/inputSetVertical";
import Button from "@/components/button/button";
import ViewContainer from "@/components/parts/containers/viewContainer";
import TransactionConfirmModal from "@/components/modal/transactionConfirmModal";
import ValidatorSelectModal from "@/organims/staking/delegate/validatorSelectModal";
import WalletInfo from "@/organims/wallet/send/walletInfo";
import { KeyValue, TRANSACTION_TYPE } from "@/constants/common";
import { DownArrow } from "@/components/icon/icon";
import { InputBgColor, InputPlaceholderColor, Lato, TextColor, TextGrayColor } from "@/constants/theme";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Delegate>;

export type DelegateParams = {
    state: any;
}

interface DelegateScreenProps {
    route: {params: DelegateParams};
    navigation: ScreenNavgationProps;
}

const DelegateScreen: React.FunctionComponent<DelegateScreenProps> = (props) => {
    const {navigation, route} = props;
    const {params} = route;
    const {state} = params;

    const [amount, setAmount] = useState(0);
    const [status, setStatus] = useState(0);
    const [openSignModal, setOpenSignModal] = useState(false);

    const [selectOperatorAddressSrc, setSelectOperatorAddressSrc] = useState("");
    const [selectValidatorMoniker, setSelectValidatorMoniker] = useState("");
    const [selectDelegationAmount, setSelectDelegationAmount] = useState(0);
    const [openSelectModal, setOpenSelectModal] = useState(false);

    const handleTransaction = (password:string) => {
        let transactionState:KeyValue = {
            type: TRANSACTION_TYPE[state.type.toUpperCase()],
            password: password,
            operatorAddressDst : state.operatorAddress,
            amount: amount,
        }

        if(state.type === "Redelegate"){
            transactionState['operatorAddressSrc'] = selectOperatorAddressSrc;
        }

        navigation.navigate(Screens.Transaction, {state: transactionState});
    }

    const handleAmount = (value:number) => {
        setStatus(0);
        setAmount(value);
    }

    const handleBack = () => {
        navigation.goBack();
    }

    const ClassifyByType = () => {
        switch (state.type) {
            case "Delegate":
            case "Undelegate":
                return delegate();
            case "Redelegate":
                return redelegate();
        }
    }

    const delegate = () => {
        return (
            <View style={styles.conatainer}>
                <InputSetVertical
                    title="Amount"
                    numberOnly={true}
                    placeholder="0"
                    validation={true}
                    onChangeEvent={handleAmount}/>
            </View>
        )
    }

    const redelegate = () => {
        return (
            <View>
                <View style={[styles.conatainer, {marginBottom: 13}]}>
                    <View style={styles.selectBox}>
                        <Text style={styles.title}>Source Validator</Text>
                        <TouchableOpacity style={styles.select} onPress={() => handleSelectModal(true)}>
                            <Text style={[styles.selectTitle, selectOperatorAddressSrc === "" &&{color: InputPlaceholderColor}]}>{selectOperatorAddressSrc === ""? "Select..." : selectValidatorMoniker}</Text>
                            <DownArrow size={10} color={InputPlaceholderColor} />
                        </TouchableOpacity>
                    </View>
                </View>
                {selectOperatorAddressSrc !== "" && delegate()}
            </View>
        )
    }

    const handleNext = () => {
        if(status > 0) return; 
        setStatus(status + 1);
    }

    const handleSignModal = (open:boolean) => {
        setOpenSignModal(open);
        if(open === false) setStatus(status - 1);
    }

    const handleSelectValidator = (address:string) => {
        setSelectOperatorAddressSrc(address);
        const selectedValidator = state.delegations.find((item:any) => item.validatorAddress === address);
        setSelectValidatorMoniker(selectedValidator.moniker);
        setSelectDelegationAmount(selectedValidator.amount);
    }

    const handleSelectModal = (open:boolean) => {
        setOpenSelectModal(open);
    }

    useEffect(() => {
        setOpenSignModal(status > 0);
    }, [status])

    useEffect(() => {
        if(state){
            if(state.type === "Undelegate"){
                const amount = state.delegations.find((item:any) => item.validatorAddress === state.operatorAddress).amount;
                setSelectDelegationAmount(amount);
            }
        }
    }, [state.type]);

    return (
        <Container
            title={state.type}
            backEvent={handleBack}>
                <ViewContainer>
                    <>
                    <View style={{paddingHorizontal: 20}}>
                        {state.type === "Delegate"?
                        <WalletInfo address={state.address}/>
                        :
                        <WalletInfo available={Number(selectDelegationAmount)}/>
                        }
                    </View>
                    {ClassifyByType()}
                    <TransactionConfirmModal transactionHandler={handleTransaction} title={state.type} amount={amount} open={openSignModal} setOpenModal={handleSignModal} />
                    <ValidatorSelectModal list={state.delegations.filter((item:any) => item.validatorAddress !== state.operatorAddress)} open={openSelectModal} setOpenModal={handleSelectModal} setValue={handleSelectValidator}/> 
                    <View style={styles.buttonBox}>
                        <Button
                            title={"Next"}
                            active={Number(amount) > 0}
                            onPressEvent={handleNext}/>
                    </View>
                    </>
                </ViewContainer>
        </Container>
    )
}

const styles = StyleSheet.create({
    conatainer: {
        paddingHorizontal: 20,
    },
    boxH: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    buttonBox: {
        flex: 1,
        justifyContent: "flex-end",
        paddingHorizontal: 20,
    },
    selectBox: {
        width: "100%",
    },
    title: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextGrayColor,
        marginBottom: 5,
    },
    select: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: InputBgColor,
        marginBottom: 5,
    },
    selectTitle: {
        fontFamily: Lato,
        fontSize:14,
        color: TextColor,
    },
})

export default DelegateScreen;