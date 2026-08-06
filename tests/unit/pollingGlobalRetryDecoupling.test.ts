import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from '@jest/globals';

const MIGRATED_POLLING_CALLERS = [
    'src/organisms/wallet/wallet/index.tsx',
    'src/organisms/staking/staking/index.tsx',
    'src/organisms/staking/validator/index.tsx',
    'src/organisms/staking/delegate/index.tsx',
    'src/organisms/governance/governance/index.tsx',
    'src/organisms/governance/proposal/index.tsx'
] as const;

describe('migrated polling callers', () => {
    it.each(MIGRATED_POLLING_CALLERS)('%s does not couple retries to the global data load status', (path) => {
        // Given
        const source = readFileSync(resolve(process.cwd(), path), 'utf8');

        // When
        const usesGlobalRetryStatus = source.includes('dataLoadStatus');

        // Then
        expect(usesGlobalRetryStatus).toBe(false);
    });
});
