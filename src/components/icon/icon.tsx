import AppstoreFillIcon from '@/assets/icons/antDesign/appstore.svg';
import CloseFillIcon from '@/assets/icons/antDesign/close-fill.svg';
import DownFillIcon from '@/assets/icons/antDesign/down-fill.svg';
import DownLineIcon from '@/assets/icons/antDesign/down-line.svg';
import ErrorCircleLineIcon from '@/assets/icons/antDesign/error-line.svg';
import ExclamationCircleLineIcon from '@/assets/icons/antDesign/exclamationCircleLine.svg';
import InboxLineIcon from '@/assets/icons/antDesign/inbox-line.svg';
import QuestionCircleFillIcon from '@/assets/icons/antDesign/question-fill.svg';
import QuestionCircleLineIcon from '@/assets/icons/antDesign/question-line.svg';
import SettingsIcon from '@/assets/icons/antDesign/settings-line.svg';
import SuccessCircleFillIcon from '@/assets/icons/antDesign/success-fill.svg';
import SuccessCircleLineIcon from '@/assets/icons/antDesign/success-line.svg';
import UpCircleFillIcon from '@/assets/icons/antDesign/up-circle-fill.svg';
import AstariskFillIcon from '@/assets/icons/fontAwesome/astarisk.svg';
import LockFillIcon from '@/assets/icons/fontAwesome/lock.svg';
import PaperPlaneIcon from '@/assets/icons/fontAwesome/paper-plane.svg';
import ArrowForwardTailLineIcon from '@/assets/icons/ionIcons/arrowForwardTailLineIcon.svg';
import IosCloseLineIcon from '@/assets/icons/ionIcons/iosCloseLine.svg';
import IosFingerPrintIcon from '@/assets/icons/ionIcons/iosFingerPrint.svg';
import IosRemoveCircleLineIcon from '@/assets/icons/ionIcons/iosRemoveCircleLineIcon.svg';
import IosSquareIcon from '@/assets/icons/ionIcons/iosSquare.svg';
import _TrendingDownIcon from '@/assets/icons/ionIcons/trendingDownIcon.svg';
import _TrendingUpIcon from '@/assets/icons/ionIcons/trendingUpIcon.svg';
import WalletLineIcon from '@/assets/icons/ionIcons/walletLineIcon.svg';
import ArrowBackIosIcon from '@/assets/icons/material/arrowBackIos.svg';
import ArrorForwardIosIcon from '@/assets/icons/material/arrowForwardIos.svg';
import _QRCodeIcon from '@/assets/icons/material/qrCode.svg';
import _QRCodeScannerIcon from '@/assets/icons/material/qrCodeScanner.svg';
import _RefreshIcon from '@/assets/icons/material/refresh.svg';
import _VerifiedIcon from '@/assets/icons/material/verified.svg';
import CardAccountDetailsStarLine from '@/assets/icons/materialCommunity/cardAccountDetailsStarLine.svg';
import ContentCopy from '@/assets/icons/materialCommunity/contentCopy.svg';
import ContentPaste from '@/assets/icons/materialCommunity/contentPaste.svg';
import _MenuIcon from '@/assets/icons/materialCommunity/menu.svg';
import RadioboxEmptyIcon from '@/assets/icons/materialCommunity/radioboxEmpty.svg';
import RadioboxMarkedIcon from '@/assets/icons/materialCommunity/radioboxMarked.svg';
import SquareEditLintIcon from '@/assets/icons/materialCommunity/squareEditLine.svg';
import CheckCircleFillIcon from '@/assets/icons/octIcons/checkCircleFill.svg';
import SortAscIcon from '@/assets/icons/octIcons/sortAsc.svg';
import SortDescIcon from '@/assets/icons/octIcons/sortDesc.svg';
import _LockIcon from '@/assets/icons/simpleLine/lock.svg';
import { StyleSheet } from 'react-native';

interface IProps {
    size: number;
    color?: string;
    active?: boolean;
}

export const Close = ({ size, color }: IProps) => {
    return <IosCloseLineIcon width={size} height={size} color={color} />;
};

export const QRCodeIcon = ({ size, color }: IProps) => {
    return <_QRCodeIcon width={size} height={size} color={color} />;
};

export const QRCodeScannerIcon = ({ size, color }: IProps) => {
    return <_QRCodeScannerIcon width={size} height={size} color={color} />;
};

export const Copy = ({ size, color }: IProps) => {
    return <ContentCopy width={size} height={size} color={color} />;
};

export const Paste = ({ size, color }: IProps) => {
    return <ContentPaste width={size} height={size} color={color} />;
};

export const Setting = ({ size, color }: IProps) => {
    return <SettingsIcon width={size} height={size} color={color} />;
};

export const BackArrow = ({ size, color }: IProps) => {
    return <ArrowBackIosIcon width={size} height={size} color={color} />;
};

export const ForwardArrowWithTail = ({ size, color }: IProps) => {
    return <ArrowForwardTailLineIcon width={size} height={size} color={color} />;
};

export const ForwardArrow = ({ size, color }: IProps) => {
    return <ArrorForwardIosIcon width={size} height={size} color={color} />;
};

export const DownArrow = ({ size, color }: IProps) => {
    return <DownFillIcon width={size} height={size} color={color} />;
};
export const UpArrow = ({ size, color }: IProps) => {
    return <DownFillIcon width={size} height={size} color={color} style={styles.inlineStyle1} />;
};

export const UpEmptyArrow = ({ size, color }: IProps) => {
    return <DownLineIcon width={size} height={size} color={color} style={styles.inlineStyle2} />;
};

export const DownEmptyArrow = ({ size, color }: IProps) => {
    return <DownLineIcon width={size} height={size} color={color} />;
};

export const RefreshIcon = ({ size, color }: IProps) => {
    return <_RefreshIcon width={size} height={size} color={color} />;
};

export const Radio = ({ size, color, active }: IProps) => {
    return active ? (
        <RadioboxMarkedIcon width={size} height={size} color={color} />
    ) : (
        <RadioboxEmptyIcon width={size} height={size} color={color} />
    );
};

export const ExclamationCircle = ({ size, color }: IProps) => {
    return <ExclamationCircleLineIcon width={size} height={size} color={color} />;
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
    return <_VerifiedIcon width={size} height={size} color={color} />;
};

export const VoteCircle = ({ size, color }: IProps) => {
    return <CheckCircleFillIcon width={size} height={size} color={color} />;
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
    return <SortAscIcon width={size} height={size} color={color} />;
};

export const SortDESC = ({ size, color }: IProps) => {
    return <SortDescIcon width={size} height={size} color={color} />;
};

export const FingerPrint = ({ size, color }: IProps) => {
    return <IosFingerPrintIcon width={size} height={size} color={color} />;
};

export const MenuIcon = ({ size, color }: IProps) => {
    return <_MenuIcon width={size} height={size} color={color} />;
};

export const ScrollToTop = ({ size, color }: IProps) => {
    return <UpCircleFillIcon width={size} height={size} color={color} />;
};

export const SendIcon = ({ size, color }: IProps) => {
    return <PaperPlaneIcon width={size} height={size} color={color} />;
};

export const LockIcon = ({ size, color }: IProps) => {
    return <_LockIcon width={size} height={size} color={color} />;
};

export const URLLockIcon = ({ size, color }: IProps) => {
    return <LockFillIcon width={size} height={size} color={color} />;
};

export const SquareIcon = ({ size, color }: IProps) => {
    return <IosSquareIcon width={size} height={size} color={color} />;
};

export const StarIcon = ({ size, color }: IProps) => {
    return <AstariskFillIcon width={size} height={size} color={color} />;
};

export const FavoriteIcon = ({ size, color }: IProps) => {
    return <CardAccountDetailsStarLine width={size} height={size} color={color} />;
};

export const RemoveIcon = ({ size, color }: IProps) => {
    return <IosRemoveCircleLineIcon width={size} height={size} color={color} />;
};

export const WalletIcon = ({ size, color }: IProps) => {
    return <WalletLineIcon width={size} height={size} color={color} />;
};

export const InboxIcon = ({ size, color }: IProps) => {
    return <InboxLineIcon width={size} height={size} color={color} />;
};

export const AppstoreIcon = ({ size, color }: IProps) => {
    return <AppstoreFillIcon width={size} height={size} color={color} />;
};

export const TrendingDownIcon = ({ size, color }: IProps) => {
    return <_TrendingDownIcon width={size} height={size} color={color} />;
};

export const TrendingUpIcon = ({ size, color }: IProps) => {
    return <_TrendingUpIcon width={size} height={size} color={color} />;
};

export const SquareEditLine = ({ size, color }: IProps) => {
    return <SquareEditLintIcon width={size} height={size} color={color} />;
};
const styles = StyleSheet.create({
    inlineStyle1: { transform: [{ rotate: '180deg' }] },
    inlineStyle2: { transform: [{ rotate: '180deg' }] }
});
