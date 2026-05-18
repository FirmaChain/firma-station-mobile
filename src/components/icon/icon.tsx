import AppstoreFillIcon from '@/assets/icons/antDesign/appstore.svg';
import CloseFillIcon from '@/assets/icons/antDesign/close-fill.svg';
import DownFillIcon from '@/assets/icons/antDesign/down-fill.svg';
import DownLineIcon from '@/assets/icons/antDesign/down-line.svg';
import ErrorCircleLineIcon from '@/assets/icons/antDesign/error-line.svg';
import QuestionCircleFillIcon from '@/assets/icons/antDesign/question-fill.svg';
import QuestionCircleLineIcon from '@/assets/icons/antDesign/question-line.svg';
import SettingsIcon from '@/assets/icons/antDesign/settings-line.svg';
import SuccessCircleFillIcon from '@/assets/icons/antDesign/success-fill.svg';
import SuccessCircleLineIcon from '@/assets/icons/antDesign/success-line.svg';
import UpCircleFillIcon from '@/assets/icons/antDesign/up-circle-fill.svg';
import InboxLineIcon from '@/assets/icons/inbox-line.svg';
import PaperPlaneIcon from '@/assets/icons/paper-plane.svg';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

interface IProps {
    size: number;
    color?: string;
    active?: boolean;
}

export const Close = ({ size, color }: IProps) => {
    return <Ionicons name="ios-close" size={size} color={color} />;
};

export const QRCodeIcon = ({ size, color }: IProps) => {
    return <MaterialIcons name="qr-code" size={size} color={color} />;
};

export const QRCodeScannerIcon = ({ size, color }: IProps) => {
    return <MaterialIcons name="qr-code-scanner" size={size} color={color} />;
};

export const Copy = ({ size, color }: IProps) => {
    return <MaterialCommunityIcons name="content-copy" size={size} color={color} />;
};

export const Paste = ({ size, color }: IProps) => {
    return <MaterialCommunityIcons name="content-paste" size={size} color={color} />;
};

export const Setting = ({ size, color }: IProps) => {
    return <SettingsIcon width={size} height={size} color={color} />;
};

export const TopRightArrow = ({ size, color }: IProps) => {
    return <MaterialCommunityIcons name="arrow-top-right" size={size} color={color} />;
};

export const BackArrow = ({ size, color }: IProps) => {
    return <MaterialIcons name="arrow-back-ios" size={size} color={color} />;
};

export const ForwardArrowWithTail = ({ size, color }: IProps) => {
    return <Ionicons name="arrow-forward" size={size} color={color} />;
};

export const BackArrowWithTail = ({ size, color }: IProps) => {
    return <Ionicons name="arrow-back" size={size} color={color} />;
};

export const ForwardArrow = ({ size, color }: IProps) => {
    return <MaterialIcons name="arrow-forward-ios" size={size} color={color} />;
};

export const DownArrow = ({ size, color }: IProps) => {
    return <DownFillIcon width={size} height={size} color={color} />;
};
export const UpArrow = ({ size, color }: IProps) => {
    return <DownFillIcon width={size} height={size} color={color} style={{ transform: [{ rotate: '180deg' }] }} />;
};

export const UpEmptyArrow = ({ size, color }: IProps) => {
    return <DownLineIcon width={size} height={size} color={color} style={{ transform: [{ rotate: '180deg' }] }} />;
};

export const DownEmptyArrow = ({ size, color }: IProps) => {
    return <DownLineIcon width={size} height={size} color={color} />;
};

export const MoreViewArrow = ({ size, color }: IProps) => {
    return <Ionicons name="caret-up" size={size} color={color} />;
};

export const RefreshIcon = ({ size, color }: IProps) => {
    return <MaterialIcons name="refresh" size={size} color={color} />;
};

export const Radio = ({ size, color, active }: IProps) => {
    return <MaterialCommunityIcons name={active ? 'radiobox-marked' : 'radiobox-blank'} size={size} color={color} />;
};

export const Person = ({ size, color }: IProps) => {
    return <Ionicons name="ios-person-circle-outline" size={size} color={color} />;
};

export const ExclamationCircle = ({ size, color }: IProps) => {
    return <ErrorCircleLineIcon width={size} height={size} color={color} />;
};

export const QuestionCircle = ({ size, color }: IProps) => {
    return <QuestionCircleLineIcon width={size} height={size} color={color} />;
};

export const QuestionFilledCircle = ({ size, color }: IProps) => {
    return <QuestionCircleFillIcon width={size} height={size} color={color} />;
};

export const SuccessCircle = ({ size, color }: IProps) => {
    return <SuccessCircleLineIcon width={size} height={size} color={color} />;
};

export const VerifiedCircle = ({ size, color }: IProps) => {
    return <MaterialIcons name="verified" size={size} color={color} />;
};

export const VoteCircle = ({ size, color }: IProps) => {
    return <Octicons name="check-circle-fill" size={size} color={color} />;
};

export const SuccessFilledCircle = ({ size, color }: IProps) => {
    return <SuccessCircleFillIcon width={size} height={size} color={color} />;
};

export const FailCircle = ({ size, color }: IProps) => {
    return <ErrorCircleLineIcon width={size} height={size} color={color} />;
};

export const FailFilledCircle = ({ size, color }: IProps) => {
    return <CloseFillIcon width={size} height={size} color={color} />;
};

export const SortASC = ({ size, color }: IProps) => {
    return <Octicons name="sort-asc" size={size} color={color} />;
};

export const SortDESC = ({ size, color }: IProps) => {
    return <Octicons name="sort-desc" size={size} color={color} />;
};

export const FingerPrint = ({ size, color }: IProps) => {
    return <Ionicons name="ios-finger-print" size={size} color={color} />;
};

export const ExternalLink = ({ size, color }: IProps) => {
    return <Octicons name="link-external" size={size} color={color} />;
};

export const ListEdit = ({ size, color }: IProps) => {
    return <MaterialCommunityIcons name="playlist-edit" size={size} color={color} />;
};

export const ListEditDone = ({ size, color }: IProps) => {
    return <MaterialCommunityIcons name="playlist-check" size={size} color={color} />;
};

export const CheckIcon = ({ size, color }: IProps) => {
    return <Ionicons name="checkmark-sharp" size={size} color={color} />;
};

export const MenuIcon = ({ size, color }: IProps) => {
    return <MaterialCommunityIcons name="menu" size={size} color={color} />;
};

export const ScrollToTop = ({ size, color }: IProps) => {
    return <UpCircleFillIcon width={size} height={size} color={color} />;
};

export const SendIcon = ({ size, color }: IProps) => {
    return <PaperPlaneIcon width={size} height={size} color={color} />;
};

export const LockIcon = ({ size, color }: IProps) => {
    return <SimpleLineIcons name="lock" size={size} color={color} />;
};

export const URLLockIcon = ({ size, color }: IProps) => {
    return <FontAwesome name="lock" size={size} color={color} />;
};

export const SquareIcon = ({ size, color }: IProps) => {
    return <Ionicons name="ios-square" size={size} color={color} />;
};

export const StarIcon = ({ size, color }: IProps) => {
    return <Fontisto name="asterisk" size={size} color={color} />;
};

export const FavoriteIcon = ({ size, color }: IProps) => {
    return <MaterialCommunityIcons name="card-account-details-star-outline" size={size} color={color} />;
};

export const BookmarkPlusIcon = ({ size, color }: IProps) => {
    return <MaterialCommunityIcons name="bookmark-plus-outline" size={size} color={color} />;
};

export const RemoveIcon = ({ size, color }: IProps) => {
    return <Ionicons name="ios-remove-circle-outline" size={size} color={color} />;
};

export const WalletIcon = ({ size, color }: IProps) => {
    return <Ionicons name="ios-wallet-outline" size={size} color={color} />;
};

export const InboxIcon = ({ size, color }: IProps) => {
    return <InboxLineIcon width={size} height={size} color={color} />;
};

export const AppstoreIcon = ({ size, color }: IProps) => {
    return <AppstoreFillIcon width={size} height={size} color={color} />;
};
