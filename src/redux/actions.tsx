import { bindActionCreators } from "redux";
import store from './store';
// import actions
import * as commonActions from "./actions/commonAction";
import * as walletActions from "./actions/walletAction";
import * as stakingActions from "./actions/stakingAction";
import * as removeableActions from "./actions/removeableAction";
const {dispatch} = store;

// export actions
export const WalletActions = bindActionCreators(walletActions, dispatch);
export const CommonActions = bindActionCreators(commonActions, dispatch);
export const StakingActions = bindActionCreators(stakingActions, dispatch);
export const RemoveableActions = bindActionCreators(removeableActions, dispatch);
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
