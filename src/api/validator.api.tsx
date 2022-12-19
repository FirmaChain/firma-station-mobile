import { VALIDATORS_PROFILE_API } from '@/../config';
import { IValidatorsProfileState } from '@/redux/reducers/storageReducer';
import axios from '@/util/axiosService';

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
                    source: any | null;
                };
            };
        }
    ];
}

export const getValidatorsProfile = () => {
    return axios.get<IValidatorsProfileState>(VALIDATORS_PROFILE_API);
};
