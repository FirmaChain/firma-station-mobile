import { CreateStepOneParams } from '../screens/createWallet/stepOne';
import { CreateStepTwoParams } from '../screens/createWallet/stepTwo';
import { CreateStepThreeParams } from '../screens/createWallet/stepThree';
import { ChangePasswordParams } from "../screens/setting/changePassword";
import { ExportWalletParams } from "../screens/setting/exportWallet";
import { ValidatorParams } from "../screens/home/staking/validator";
import { ProposalParams } from "../screens/home/governance/proposal";
import { DelegateParams } from "../screens/home/staking/delegate";
import { DepositParams } from "@/screens/home/governance/deposit";
import { TransactionParams } from '@/screens/transaction/transaction';

export enum Screens {
    LoginCheck = 'LoginCheck',

    Welcome = 'Welcome',
    CreateStepOne = 'CreateStepOne',
    CreateStepTwo = 'CreateStepTwo',
    CreateStepThree = 'CreateStepThree',
    StepRecover = 'StepRecover',
    SelectWallet = 'SelectWallet',
    RecoverWallet = 'RecoverWallet',

    Home = 'Home',
    History = 'History',
    Transaction = 'Transaction',
    
    Wallet = 'Wallet',
    Send = 'Send',

    Staking = 'Staking',
    Validator = 'Validator',
    Delegate = 'Delegate',
    
    Governance = 'Governance',
    Proposal = "Proposal",
    Deposit = "Deposit",

    Setting = 'Setting',
    ChangePassword = 'ChangePassword',
    ExportWallet = 'ExportPrivateKey',
}

export type StackParamList = {
    LoginCheck: undefined;

    Welcome: undefined;
    CreateStepOne: CreateStepOneParams;
    CreateStepTwo: CreateStepTwoParams;
    CreateStepThree: CreateStepThreeParams;
    StepRecover: undefined;
    SelectWallet: undefined;
    RecoverWallet: undefined;

    Home: undefined;
    History: undefined;
    Transaction: TransactionParams;

    Wallet: undefined;
    Send: undefined;

    Staking: undefined;
    Validator: ValidatorParams;
    Delegate: DelegateParams;

    Governance: undefined;
    Proposal: ProposalParams;
    Deposit: DepositParams;

    Setting: undefined;
    ChangePassword: ChangePasswordParams;
    ExportPrivateKey: ExportWalletParams;
}
