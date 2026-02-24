import IsCSServiceOrderEnabled from '../UserFeatures/IsCSServiceOrderEnabled';
import IsPMWorkOrderEnabled from '../UserFeatures/IsPMWorkOrderEnabled';

export default function TimeSheetIsOrderFieldVisible(context) {
    return IsPMWorkOrderEnabled(context) || IsCSServiceOrderEnabled(context);
} 
