import React, { type Dispatch, type ReactElement, type ReactNode, type SetStateAction } from 'react';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import CW721 from '@/organisms/wallet/cw721';

const mockHandleCW721NFTIdList = jest.fn<(startId: string) => Promise<void>>();
const mockStateValues: Array<readonly [unknown, Dispatch<SetStateAction<unknown>>]> = [];

jest.mock('react', () => {
    const react = {
        Fragment: 'Fragment',
        Children: {
            toArray: (children: ReactNode): ReactNode[] => (Array.isArray(children) ? children : children === null ? [] : [children])
        },
        isValidElement: (node: unknown): node is { readonly type: unknown; readonly props: Record<string, unknown> } =>
            typeof node === 'object' && node !== null && 'type' in node && 'props' in node,
        useCallback: (callback: () => unknown): (() => unknown) => callback,
        useEffect: (): void => undefined,
        useMemo: <T,>(factory: () => T): T => factory(),
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

jest.mock('@/constants/common', () => ({ DAPP_LOADING_NFT: 'Loading', DAPP_NO_NFT: 'No NFTs' }));
jest.mock('@/constants/theme', () => ({
    BoxColor: 'box',
    BoxDarkColor: 'boxDark',
    CW721BackgroundColor: 'background',
    CW721Color: 'color',
    Lato: 'Lato',
    TextColor: 'text',
    TextGrayColor: 'gray'
}));
jest.mock('@/context/cwContext', () => ({ useCWContext: () => ({ cw721Data: [] }) }));
jest.mock('@/navigators/appRoutes', () => ({ Screens: { WebScreen: 'WebScreen' } }));
jest.mock('@/organisms/dapps/dappDetail/nftItem', () => ({ __esModule: true, default: 'NftItem' }));
jest.mock('@/organisms/staking/validator/addressBox', () => ({ __esModule: true, default: 'AddressBox' }));
jest.mock('@/util/getScreenSize', () => ({ ScreenWidth: () => 320 }));
jest.mock('@react-navigation/native', () => ({
    useFocusEffect: jest.fn(),
    useNavigation: () => ({ goBack: jest.fn(), navigate: jest.fn() })
}));
jest.mock('@/hooks/dapps/hooks', () => ({
    useCW721NFT: () => ({
        MyCW721NFTS: null,
        handleCW721NFTIdList: mockHandleCW721NFTIdList,
        isFetching: false
    })
}));
jest.mock('@/components/parts/containers/conatainer', () => ({ __esModule: true, default: 'Container' }));
jest.mock('@/components/parts/containers/viewContainer', () => ({ __esModule: true, default: 'ViewContainer' }));
jest.mock('@/components/parts/refreshScrollView', () => ({ __esModule: true, default: 'RefreshScrollView' }));
jest.mock('@/components/parts/smallProgress', () => ({ __esModule: true, default: 'SmallProgress' }));
jest.mock('@/organisms/wallet/assets/common/dataSection', () => ({ __esModule: true, default: 'DataSection' }));
jest.mock('react-native', () => ({
    StyleSheet: { create: <T,>(styles: T): T => styles },
    Text: 'Text',
    View: 'View'
}));

type Deferred = {
    readonly promise: Promise<void>;
    readonly resolve: () => void;
};

const deferred = (): Deferred => {
    let resolvePromise: () => void = () => undefined;
    const promise = new Promise<void>((resolve) => {
        resolvePromise = resolve;
    });

    return { promise, resolve: resolvePromise };
};

const findRefreshScrollView = (node: ReactNode): ReactElement<{ readonly refreshFunc: () => Promise<void> }> => {
    if (React.isValidElement<{ readonly refreshFunc: () => Promise<void>; readonly children?: ReactNode }>(node)) {
        if (node.type === 'RefreshScrollView') {
            return node;
        }

        for (const child of React.Children.toArray(node.props.children)) {
            return findRefreshScrollView(child);
        }
    }

    throw new Error('CW721 did not render RefreshScrollView');
};

describe('CW721 pull-to-refresh callback', () => {
    beforeEach(() => {
        mockHandleCW721NFTIdList.mockReset();
        mockStateValues.splice(0, mockStateValues.length);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('returns the deferred CW721 request so RefreshScrollView can await it', async () => {
        // Given
        const request = deferred();
        let settled = false;
        mockHandleCW721NFTIdList.mockReturnValue(request.promise);
        mockStateValues.push(
            [0, jest.fn<Dispatch<SetStateAction<unknown>>>()],
            [false, jest.fn<Dispatch<SetStateAction<unknown>>>()],
            [null, jest.fn<Dispatch<SetStateAction<unknown>>>()]
        );
        const element = CW721({ contract: 'contract' });
        const refreshFunc = findRefreshScrollView(element).props.refreshFunc;

        // When
        const refresh = refreshFunc();
        refresh.then(() => {
            settled = true;
        });
        await new Promise<void>((resolve) => setImmediate(resolve));

        // Then
        expect(mockHandleCW721NFTIdList).toHaveBeenCalledWith('0');
        expect(settled).toBe(false);
        request.resolve();
        await refresh;
        expect(settled).toBe(true);
    });
});
