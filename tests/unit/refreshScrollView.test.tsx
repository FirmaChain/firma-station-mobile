import React, { type Dispatch, type ReactElement, type ReactNode, type SetStateAction } from 'react';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { RefreshControlProps } from 'react-native';

import RefreshScrollView from '@/components/parts/refreshScrollView';

const mockSetRefreshing = jest.fn<Dispatch<SetStateAction<unknown>>>();
const mockEffectCleanups: Array<() => void> = [];
const mockRefs: Array<{ current: unknown }> = [];
const mockStateValues: Array<readonly [unknown, Dispatch<SetStateAction<unknown>>]> = [];
let mockRefreshing = false;
let mockRefIndex = 0;

jest.mock('react', () => {
    const createElement = (type: unknown, props: Record<string, unknown> | null, ...children: ReactNode[]) => ({
        type,
        props: { ...props, children: children.length === 1 ? children[0] : children }
    });
    const react = {
        Children: {
            toArray: (children: ReactNode): ReactNode[] => (Array.isArray(children) ? children : children === null ? [] : [children])
        },
        createElement,
        isValidElement: (node: unknown): node is { readonly type: unknown; readonly props: Record<string, unknown> } =>
            typeof node === 'object' && node !== null && 'type' in node && 'props' in node,
        useCallback: (callback: () => unknown): (() => unknown) => callback,
        useEffect: (effect: () => void | (() => void)): void => {
            const cleanup = effect();
            if (typeof cleanup === 'function') {
                mockEffectCleanups.push(cleanup);
            }
        },
        useRef: (initialValue: unknown): { current: unknown } => {
            const existingRef = mockRefs[mockRefIndex];
            mockRefIndex += 1;
            if (existingRef !== undefined) {
                return existingRef;
            }

            const ref = { current: initialValue };
            mockRefs.push(ref);
            return ref;
        },
        useState: (): readonly [unknown, Dispatch<SetStateAction<unknown>>] => {
            const state = mockStateValues.shift();
            if (state === undefined) {
                throw new Error('useState mock was not configured');
            }
            return state;
        }
    };

    return { __esModule: true, ...react, default: react };
});

jest.mock('react/jsx-runtime', () => ({
    Fragment: 'Fragment',
    jsx: (type: unknown, props: Record<string, unknown>) => ({ type, props }),
    jsxs: (type: unknown, props: Record<string, unknown>) => ({ type, props })
}));

jest.mock('@react-navigation/native', () => ({
    useFocusEffect: jest.fn()
}));

jest.mock('@/redux/hooks', () => ({
    useAppSelector: jest.fn(() => ({ scrollToTop: false }))
}));

jest.mock('@/redux/actions', () => ({
    CommonActions: {
        handleScrollToTop: jest.fn()
    }
}));

jest.mock('@/util/animation', () => ({
    fadeIn: jest.fn(),
    fadeOut: jest.fn()
}));

jest.mock('@/components/icon/icon', () => ({
    ScrollToTop: 'ScrollToTop'
}));

jest.mock('react-native', () => ({
    Animated: {
        Value: jest.fn(),
        View: 'AnimatedView'
    },
    RefreshControl: 'RefreshControl',
    ScrollView: 'ScrollView',
    StyleSheet: {
        create: <T,>(styles: T): T => styles
    },
    TouchableOpacity: 'TouchableOpacity',
    View: 'View'
}));

type Deferred = {
    readonly promise: Promise<void>;
    readonly reject: (reason: Error) => void;
    readonly resolve: () => void;
};

const deferred = (): Deferred => {
    let rejectPromise: (reason: Error) => void = () => undefined;
    let resolvePromise: () => void = () => undefined;
    const promise = new Promise<void>((resolve, reject) => {
        rejectPromise = reject;
        resolvePromise = resolve;
    });

    return { promise, reject: rejectPromise, resolve: resolvePromise };
};

const isScrollViewElement = (
    node: ReactNode
): node is ReactElement<{ readonly refreshControl: ReactElement<RefreshControlProps>; readonly children?: ReactNode }> =>
    React.isValidElement(node) && node.type === 'ScrollView';

const findRefreshControl = (node: ReactNode): ReactElement<RefreshControlProps> => {
    if (isScrollViewElement(node)) {
        return node.props.refreshControl;
    }

    if (React.isValidElement<{ readonly children?: ReactNode }>(node)) {
        for (const child of React.Children.toArray(node.props.children)) {
            const refreshControl = findRefreshControl(child);
            if (refreshControl) {
                return refreshControl;
            }
        }
    }

    throw new Error('RefreshControl was not rendered');
};

const render = (refreshFunc: () => Promise<void>): RefreshControlProps => {
    mockRefIndex = 0;
    mockStateValues.push([mockRefreshing, mockSetRefreshing], [false, jest.fn<Dispatch<SetStateAction<unknown>>>()]);
    const element = RefreshScrollView({ children: null, refreshFunc });

    return findRefreshControl(element).props;
};

describe('RefreshScrollView refresh lifecycle', () => {
    beforeEach(() => {
        mockSetRefreshing.mockReset();
        mockSetRefreshing.mockImplementation((value) => {
            if (typeof value !== 'boolean') {
                throw new Error('RefreshScrollView only sets refreshing with a boolean value');
            }
            mockRefreshing = value;
        });
        mockEffectCleanups.splice(0, mockEffectCleanups.length);
        mockRefs.splice(0, mockRefs.length);
        mockStateValues.splice(0, mockStateValues.length);
        mockRefreshing = false;
        mockRefIndex = 0;
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('keeps RefreshControl active until a joined deferred refresh settles', async () => {
        // Given
        const request = deferred();
        const refresh = jest.fn<() => Promise<void>>(() => request.promise);
        const initial = render(refresh);

        // When
        initial.onRefresh?.();
        const active = render(refresh);
        active.onRefresh?.();

        // Then
        expect(initial.refreshing).toBe(false);
        expect(active.refreshing).toBe(true);
        expect(refresh).toHaveBeenCalledTimes(1);
        expect(mockSetRefreshing).toHaveBeenNthCalledWith(1, true);
        request.resolve();
        await new Promise<void>((resolve) => setImmediate(resolve));
        const settled = render(refresh);
        expect(settled.refreshing).toBe(false);
        expect(mockSetRefreshing).toHaveBeenNthCalledWith(2, false);
    });

    it('emits development refresh-indicator transitions around the shared refresh promise', async () => {
        // Given
        const request = deferred();
        const refresh = jest.fn<() => Promise<void>>(() => request.promise);
        const trace = jest.spyOn(console, 'log').mockImplementation(() => undefined);
        const control = render(refresh);

        // When
        control.onRefresh?.();
        request.resolve();
        await new Promise<void>((resolve) => setImmediate(resolve));

        // Then
        expect(trace).toHaveBeenNthCalledWith(1, '[RefreshScrollView]', { refreshing: true });
        expect(trace).toHaveBeenNthCalledWith(2, '[RefreshScrollView]', { refreshing: false });
    });

    it('keeps RefreshControl active while a deferred CW721 request settles', async () => {
        // Given
        const request = deferred();
        const handleCW721NFTIdList = jest.fn<(startId: string) => Promise<void>>(() => request.promise);
        const refreshCW721NFTs = (): Promise<void> => handleCW721NFTIdList('0');
        const initial = render(refreshCW721NFTs);

        // When
        initial.onRefresh?.();
        const active = render(refreshCW721NFTs);

        // Then
        expect(handleCW721NFTIdList).toHaveBeenCalledWith('0');
        expect(active.refreshing).toBe(true);
        request.resolve();
        await new Promise<void>((resolve) => setImmediate(resolve));
        expect(render(refreshCW721NFTs).refreshing).toBe(false);
    });

    it('cleans up the refresh indicator when the callback rejects', async () => {
        // Given
        const request = deferred();
        const refresh = jest.fn<() => Promise<void>>(() => request.promise);
        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
        const unhandledReasons: unknown[] = [];
        const onUnhandledRejection = (reason: unknown): void => {
            unhandledReasons.push(reason);
        };
        process.on('unhandledRejection', onUnhandledRejection);
        const initial = render(refresh);

        // When
        initial.onRefresh?.();
        request.reject(new Error('offline'));
        await new Promise<void>((resolve) => setImmediate(resolve));
        process.off('unhandledRejection', onUnhandledRejection);

        // Then
        expect(unhandledReasons).toHaveLength(0);
        expect(errorSpy).toHaveBeenCalledTimes(1);
        expect(mockSetRefreshing).toHaveBeenNthCalledWith(1, true);
        expect(mockSetRefreshing).toHaveBeenNthCalledWith(2, false);
    });

    it('does not update RefreshControl state after unmounting during a deferred refresh', async () => {
        // Given
        const request = deferred();
        const refresh = jest.fn<() => Promise<void>>(() => request.promise);
        const initial = render(refresh);
        const unmount = mockEffectCleanups[0];
        if (unmount === undefined) {
            throw new Error('RefreshScrollView did not register its unmount cleanup');
        }

        // When
        initial.onRefresh?.();
        unmount();
        request.resolve();
        await new Promise<void>((resolve) => setImmediate(resolve));

        // Then
        expect(mockSetRefreshing).toHaveBeenCalledTimes(1);
        expect(mockSetRefreshing).toHaveBeenCalledWith(true);
    });
});
