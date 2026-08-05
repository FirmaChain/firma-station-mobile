import { VALIDATORS_PROFILE_API } from '@/../config';
import { IValidatorsProfileState } from '@/redux/reducers/storageReducer';
import kyInstance from '@/util/kyService';

export interface IAvatarStateProps {
    status: {
        code: number;
        name: string;
    };
    them: [
        {
            id: string;
            pictures: {
                primary: {
                    url: string;
                    // FIXME: The validator profile API does not publish a schema for this value.
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    source: any | null;
                };
            };
        }
    ];
}

export const getValidatorsProfile = () => {
    return kyInstance.get<IValidatorsProfileState>(VALIDATORS_PROFILE_API).json();
};
