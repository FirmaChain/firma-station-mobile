import StepThree from '@/organisms/createWallet/stepThree';

interface IProps {
    route: { params: CreateStepThreeParams };
}

export type CreateStepThreeParams = {
    // FIXME: Navigation provides wallet data from multiple external wallet formats.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    wallet: any;
};

const CreateStepThreeScreen = (props: IProps) => {
    const { wallet } = props.route.params;

    return <StepThree walletInfo={wallet} />;
};

export default CreateStepThreeScreen;
