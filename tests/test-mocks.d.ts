import '@firmachain/firma-js';
import 'react-native-permissions';

declare module '@firmachain/firma-js' {
    export const __reset: () => void;
    export const __state: {
        mnemonicInputs: string[];
        privateKeyInputs: string[];
        rejectMnemonic: boolean;
    };
}

declare module 'react-native-permissions' {
    export const __reset: () => void;
    export const __setCheckStatus: (status: string) => void;
}
