import MobileStatusUpdateWrapper from './MobileStatusUpdateWrapper';

export default function HoldMobileStatusUpdateWrapper(context) {
    const transitionText = context.localizeText('hold');

    return MobileStatusUpdateWrapper(context, transitionText);
}
