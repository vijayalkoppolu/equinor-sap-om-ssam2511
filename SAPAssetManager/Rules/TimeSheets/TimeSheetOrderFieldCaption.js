import IsCSServiceOrderEnabled from '../UserFeatures/IsCSServiceOrderEnabled';

export default function TimeSheetOrderFieldCaption(context) {
    if (IsCSServiceOrderEnabled(context)) {
        return context.localizeText('serviceorder');
    }

    return context.localizeText('workorder');
}
