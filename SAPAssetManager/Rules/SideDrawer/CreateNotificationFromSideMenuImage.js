import IsWCMOperator from '../WCM/IsWCMOperator';

export default function CreateNotificationFromSideMenuImage(context) {
    return IsWCMOperator(context) ? 'sap-icon://message-warning' : 'sap-icon://add';
}
