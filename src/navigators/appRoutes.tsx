import { CreateStepOneParams } from '../screens/createWallet/stepOne';
import { CreateStepTwoParams } from '../screens/createWallet/stepTwo';
import { CreateStepThreeParams } from '../screens/createWallet/stepThree';
import { ExportWalletParams } from '../screens/setting/exportWallet';
import { ValidatorParams } from '../screens/home/staking/validator';
import { ProposalParams } from '../screens/home/governance/proposal';
import { DelegateParams } from '../screens/home/staking/delegate';
import { DepositParams } from '@/screens/home/governance/deposit';
import { TransactionParams } from '@/screens/transaction/transaction';
import { WebParams } from '@/screens/webScreen';
import { NFTParams } from '@/screens/home/dapps/nft/nft';
import { CreateStepRecoverParams } from '@/screens/createWallet/stepRecover';
import { SendCW20Params } from '@/screens/home/dapps/sendCW20/sendCW20';
import { SendCW721Params } from '@/screens/home/dapps/sendCW721/sendCW721';
import { SendIBCParams } from '@/screens/home/wallet/sendIBC';

export enum Screens {
    LoginCheck = 'LoginCheck',
    WebScreen = 'Web',

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
    SendIBC = 'SendIBC',

    Staking = 'Staking',
    Validator = 'Validator',
    Delegate = 'Delegate',
    Restake = 'Restake',

    Governance = 'Governance',
    Proposal = 'Proposal',
    Deposit = 'Deposit',

    Dapps = 'Dapps',
    DappDetail = 'DappDetail',
    NFT = 'NFT',
    SendCW20 = 'SendCW20',
    SendCW721 = 'SendCW721',

    Setting = 'Setting',
    ChangePassword = 'ChangePassword',
    ChangeWalletName = 'ChangeWalletName',
    ExportWallet = 'ExportWallet',
    Version = 'Version'
}

export type StackParamList = {
    LoginCheck: undefined;
    Web: WebParams;

    Welcome: undefined;
    CreateStepOne: CreateStepOneParams;
    CreateStepTwo: CreateStepTwoParams;
    CreateStepThree: CreateStepThreeParams;
    StepRecover: CreateStepRecoverParams;
    SelectWallet: undefined;
    RecoverWallet: undefined;

    Home: undefined;
    History: undefined;
    Transaction: TransactionParams;

    Wallet: undefined;
    Send: undefined;
    SendIBC: SendIBCParams;

    Staking: undefined;
    Validator: ValidatorParams;
    Delegate: DelegateParams;
    Restake: undefined;

    Governance: undefined;
    Proposal: ProposalParams;
    Deposit: DepositParams;

    Dapps: undefined;
    DappDetail: undefined;
    NFT: NFTParams;
    SendCW20: SendCW20Params;
    SendCW721: SendCW721Params;

    Setting: undefined;
    ChangePassword: undefined;
    ChangeWalletName: undefined;
    ExportWallet: ExportWalletParams;
    Version: undefined;
};
