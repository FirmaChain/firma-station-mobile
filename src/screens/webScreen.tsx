import { memo } from 'react';
import Web from '@/organisms/web/web';

interface IProps {
    route: { params: WebParams };
}

export type WebParams = {
    uri: string;
};

const WebScreen = (props: IProps) => {
    const { uri } = props.route.params;
    return <Web uri={uri} />;
};

export default memo(WebScreen);
