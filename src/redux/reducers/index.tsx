import { combineReducers } from "redux";
import StorageReducer from "./storageReducer";
import WalletReducer from "./walletReducer";
import StakingReducer from "./stakingReducer";
import CommonReducer from "./commonReducer";

const appReducer = combineReducers({
    wallet: WalletReducer,
    storage: StorageReducer,
    staking: StakingReducer,
    common: CommonReducer,
});

export default appReducer;