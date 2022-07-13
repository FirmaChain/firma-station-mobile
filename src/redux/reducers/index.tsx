import { combineReducers } from "redux";
import StorageReducer from "./storageReducer";
import WalletReducer from "./walletReducer";
import StakingReducer from "./stakingReducer";
import CommonReducer from "./commonReducer";
import ModalReducer from "./modalReducer";

const appReducer = combineReducers({
    wallet: WalletReducer,
    storage: StorageReducer,
    staking: StakingReducer,
    common: CommonReducer,
    modal: ModalReducer,
});

export default appReducer;