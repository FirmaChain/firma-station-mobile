import { bindActionCreators } from "redux";
import store from './store';
// import actions
import * as commonActions from "./actions/commonAction";
import * as walletActions from "./actions/walletAction";
import * as stakingActions from "./actions/stakingAction";
const {dispatch} = store;

// export actions
export const WalletActions = bindActionCreators(walletActions, dispatch);
export const CommonActions = bindActionCreators(commonActions, dispatch);
export const StakingActions = bindActionCreators(stakingActions, dispatch);
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
