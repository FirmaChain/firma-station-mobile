import { combineReducers } from "redux";
import CommonReducer from "./commonReducer";
import WalletReducer from "./walletReducer";
import StakingReducer from "./stakingReducer";
import RemovableReducer from "./removeableReducer";

const appReducer = combineReducers({
    wallet: WalletReducer,
    common: CommonReducer,
    staking: StakingReducer,
    removeable: RemovableReducer,
});

export default appReducer;