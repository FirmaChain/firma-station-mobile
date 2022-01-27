import { CreateStepOneParams } from '../screens/createWallet/stepOne';
import { CreateStepTwoParams } from '../screens/createWallet/stepTwo';
import { CreateStepThreeParams } from '../screens/createWallet/stepThree';
import { HomeParams } from "../screens/home/home";
import { SettingParams } from "../screens/setting/setting";
import { ChangePasswordParams } from "../screens/setting/changePassword";
import { ExportPrivateKeyParams } from "../screens/setting/exportPrivateKey";
import { ValidatorParams } from "../screens/home/staking/validator";
import { ProposalParams } from "../screens/home/governance/proposal";
import { SendParams } from "../screens/home/wallet/send";
import { DelegateParams } from "../screens/home/staking/delegate";
import { DepositParams } from "@/screens/home/governance/deposit";
import { HistoryParams } from '@/screens/home/history/history';

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
    Hisory = 'History',
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
    ExportPrivateKey = 'ExportPrivateKey',
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

    Home: HomeParams;
    History: HistoryParams;
    Transaction: undefined;

    Wallet: undefined;
    Send: SendParams;

    Staking: undefined;
    Validator: ValidatorParams;
    Delegate: DelegateParams;

    Governance: undefined;
    Proposal: ProposalParams;
    Deposit: DepositParams;

    Setting: SettingParams;
    ChangePassword: ChangePasswordParams;
    ExportPrivateKey: ExportPrivateKeyParams;
}
