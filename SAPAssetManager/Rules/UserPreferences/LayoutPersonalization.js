import isWindows from '../Common/IsWindows';
import EnableForTechniciansAndWCM from '../SideDrawer/EnableForTechniciansAndWCM';

export default function LayoutPersonalization(context) {
    return EnableForTechniciansAndWCM(context) && !isWindows(context);
}
