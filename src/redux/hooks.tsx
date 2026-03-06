import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, AppState } from './actions';

export const useAppDispatch = () => useDispatch<AppDispatch>();

// Custom hook that always uses shallow equality check
export const useAppSelector = <TSelected = unknown,>(selector: (state: AppState) => TSelected): TSelected =>
    useSelector(selector, shallowEqual);
