import libCommon from './Library/CommonLibrary';
import libMeter from '../Meter/Common/MeterLibrary';
import IsMeterComponentEnabled from '../ComponentsEnablement/IsMeterComponentEnabled';
import ODataLibrary from '../OData/ODataLibrary';
import Logger from '../Log/Logger';

export default function IsDiscardButtonVisible(context) {
    if (IsMeterComponentEnabled(context) && libMeter.isMeterObjectBinding(context.binding)) {
        return libMeter.isDiscardMeterEnabled(context);
    }

    if (libCommon.IsOnCreate(context) || libCommon.getStateVariable(context, 'MaterialDocNumberBulkUpdate')) {
        return false;
    } else {
        const currentReadLink = context.binding['@odata.readLink'];
        const currentObjectType = context.binding['@odata.type'];
        const isLinkLocal = ODataLibrary.isLocal(context.binding);
        const pageName = libCommon.getPageName(context);

        switch (currentObjectType) {
            case '#sap_mobile.MyNotificationItem': {
                return handleNotificationItem(context, currentReadLink);
            }
            case '#sap_mobile.MyWorkOrderOperation': {
                return handleOperation(context, currentReadLink);
            }
            case '#sap_mobile.InboundDeliveryItem':
            case '#sap_mobile.OutboundDeliveryItem': {
                return ODataLibrary.hasAnyPendingChanges(context.binding);
            }
            default: {
                if (isLinkLocal && pageName === 'WorkOrderTransfer') {
                    return false;
                }
                return isLinkLocal;
            }
        }
    }
}

function handleNotificationItem(context, currentReadLink) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', currentReadLink, [], '$expand=ItemActivities,ItemCauses,ItemTasks')
        .then(result => {
            if (result.length) {
                const notificationItem = result.getItem(0);
                const itemProperties = ['ItemCauses', 'ItemTasks', 'ItemActivities'];

                // Check if any Item Tasks, Item Causes or Item Activities are synced (non-local)
                for (let prop of itemProperties) {
                    for (let item of notificationItem[prop]) {
                        if (!ODataLibrary.isLocal(item)) {
                            return false;
                        }
                    }
                }
            }
            // Deletion is permitted
            return ODataLibrary.isLocal(context.binding);
        })
        .catch(error => {
            Logger.error('IsDiscardButtonVisible-handleNotificationItem', error);
            return false;
        });
}

function handleOperation(context, currentReadLink) {
    return context.count('/SAPAssetManager/Services/AssetManager.service', `${currentReadLink}/WOHeader/Operations`, '')
        .then(count => {
            return (count > 1) && ODataLibrary.isLocal(context.binding);
        })
        .catch(error => {
            Logger.error('IsDiscardButtonVisible-handleOperation', error);
            return false;
        });
}
