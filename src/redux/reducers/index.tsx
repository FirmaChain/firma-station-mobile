import { combineReducers } from "redux";
import CommonReducer from "./commonReducer";
import WalletReducer from "./walletReducer";
import StakingReducer from "./stakingReducer";

const appReducer = combineReducers({
    wallet: WalletReducer,
    common: CommonReducer,
    staking: StakingReducer,
});

export default appReducer;