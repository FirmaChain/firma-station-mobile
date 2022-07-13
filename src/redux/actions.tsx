import { bindActionCreators } from "redux";
import store from './store';
// import actions
import * as storageActions from "./actions/storageAction";
import * as walletActions from "./actions/walletAction";
import * as stakingActions from "./actions/stakingAction";
import * as commonActions from "./actions/commonAction";
import * as modalActions from "./actions/modalAction";
const {dispatch} = store;

// export actions
export const WalletActions = bindActionCreators(walletActions, dispatch);
export const StorageActions = bindActionCreators(storageActions, dispatch);
export const StakingActions = bindActionCreators(stakingActions, dispatch);
export const CommonActions = bindActionCreators(commonActions, dispatch);
export const ModalActions = bindActionCreators(modalActions, dispatch);
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
