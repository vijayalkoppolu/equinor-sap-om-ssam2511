import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import { IsOnlineEntityAvailableOffline } from '../IsOnlineEntityAvailableOffline';

//original translations that are comming from backend are too long for android phone
const mapCodeWithTranslation = {
    'OSNO': 'outstanding_notifications', 
    'NOCO': 'completed', 
    'NOPR': 'sdf_status_in_process', 
    'NOPO': 'postponed', 
    'OSTS': 'outstanding_tasts_exist', 
    'ORAS': 'order_assigned', 
    'APOK': 'approval_ok', 
    'APRQ': 'approval_required_notification',
};

export default async function NotificationSystemStatus(context) {
    const binding = context.binding;

    if (binding) {
        const isAvailableOffline = await IsOnlineEntityAvailableOffline(context, 'MyNotificationHeaders', 'NotificationNumber');
        if (isAvailableOffline) {
            return getNotificationMobileStatus(context, binding);
        }
        const sysStatuses = binding.SystemStatus.split(' ');
        const sysStatusCode = sysStatuses[0];
        const searchSystemStatus = getSearchSystemStatus(context, sysStatuses, sysStatusCode);
        const shortStatus = context.localizeText(mapCodeWithTranslation[sysStatusCode]) ?? binding.SystemStatusDesc;
        const concatTwoStatuses = searchSystemStatus ? `${searchSystemStatus}, ${shortStatus}` : shortStatus;
        return concatTwoStatuses;
    }
    return '';
}

function getSearchSystemStatus(context, sysStatuses, sysStatusCode) {
    const clientData = context.evaluateTargetPath('#Page:OnlineSearchNotificationsList/#ClientData');
    let sameSysCodes = [];
    if (clientData.NotificationSystemStatusFilter) {
        sameSysCodes = clientData.NotificationSystemStatusFilter?.filterItems.filter((code) => { 
            return sysStatuses.indexOf(code) !== -1; 
        });
    } else {
        return null;
    }
    let resultStatus = null;
    if (sameSysCodes.length && !sameSysCodes.includes(sysStatusCode)) {
        const shortStatus = mapCodeWithTranslation[sameSysCodes[0]];
        resultStatus = shortStatus ? context.localizeText(shortStatus) : findDisplayValue(clientData, sysStatuses, sameSysCodes[0]);
    }
    return sameSysCodes.includes(sysStatusCode) ? null : resultStatus;
}

function findDisplayValue(clientData, sysStatuses, code) {
    const index = sysStatuses.findIndex(code);
    return clientData.filterItemsDisplayValue[index];
}

function getNotificationMobileStatus(context, binding) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `MyNotificationHeaders('${binding.NotificationNumber}')`, [], '$expand=NotifMobileStatus_Nav/OverallStatusCfg_Nav').then(result => {
        const notification = result.getItem(0);
        const mobileStatus = MobileStatusLibrary.getMobileStatus(notification, context);
        if (mobileStatus) {
            return context.localizeText(mobileStatus);
        } else if (notification.NotifMobileStatus_Nav.OverallStatusCfg_Nav) {
            return notification.NotifMobileStatus_Nav.OverallStatusCfg_Nav.OverallStatusLabel;
        }
        return '';
    });
}
