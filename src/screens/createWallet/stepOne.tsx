import StepOne from '@/organisms/createWallet/stepOne';

interface IProps {
    route: { params: CreateStepOneParams };
}

export type CreateStepOneParams = {
    // FIXME: Navigation provides recovery data from multiple external wallet formats.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recoverValue?: any;
};

const CreateStepOneScreen = (props: IProps) => {
    const { recoverValue } = props.route.params;

    return <StepOne recoverValue={recoverValue} />;
};

export default CreateStepOneScreen;
