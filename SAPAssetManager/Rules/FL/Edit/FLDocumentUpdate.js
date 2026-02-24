/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import { FLEntitySetNames } from '../Common/FLLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';
/**
 * Main function to handle the document update.
 * @param {IClientAPI} clientAPI
 * @param {Object} item - The item object.
 */
export default function FLDocumentUpdate(clientAPI, item) {
    const binding = item || clientAPI.binding;
    const entitySet = binding['@odata.readLink'].split('(')[0];
    let properties = getCommonProperties(clientAPI,binding, item, entitySet);
    let transactionID = '';
    let navProperty = '';
    [transactionID, navProperty, properties] = getTransactionIDAndProperties(entitySet, binding, properties);
    let [createLinks,updateLinks] = getUpdateLinks(binding,item, navProperty, properties,entitySet);
    if (!item) {
        return validateFields(clientAPI)
            .then(() => executeUpdateAction(clientAPI, properties, createLinks, updateLinks, transactionID, entitySet, binding))
            .catch(error => Logger.error('FLUpdate', error));
    } else {
       return executeUpdateAction(clientAPI, properties, createLinks, updateLinks, transactionID, entitySet, binding);
    }
}

/**
 * Get the update links.
 * @param {Object} binding - The binding object.
 * @param {Object} item - The item object.
 * @param {string} navProperty - The navigation property.
 * @returns {Array} The update links.
 */
function getUpdateLinks(binding, item, navProperty, properties, entitySet) {
    const updateLinks = [];
    const createLinks = [];
    let handlingDecision = {};
    let itemStatus = '';
    let containerStatus = '';
    if (properties.HandlingDecision !== '') {
    handlingDecision = ({
        'Property': 'FldLogsHandlingDecision_Nav',
        'Target': {
            'EntitySet': 'FldLogsHandlingDecisions',
            'ReadLink': `FldLogsHandlingDecisions(HandlingDecision='${properties.HandlingDecision}',ProcessType='${properties.ProcessType}')`,
        },
    });
}
    switch (entitySet) {
        case FLEntitySetNames.ContainerItem:
        case FLEntitySetNames.PackageItem:
        case FLEntitySetNames.HuDelItem:

    if (properties.HandlingDecision !== '') {     
    if (binding.FldLogsHandlingDecision_Nav) {
        updateLinks.push(handlingDecision);
    } else {
        createLinks.push(handlingDecision);
    }
}
    // Handle ContainerItemStatus
     itemStatus = item ? item.ContainerItemStatus : binding.ContainerItemStatus;
    if (itemStatus) {
        updateLinks.push({
            'Property': navProperty,
            'Target': {
                'EntitySet': 'FldLogsContainerItemStatuses',
                'ReadLink': `FldLogsContainerItemStatuses('${itemStatus}')`,
            },
        });
    }
    break;
    case FLEntitySetNames.Container:
    case FLEntitySetNames.Package:
    case FLEntitySetNames.HuDel:
    // Handle ContainerStatus
    containerStatus = item ? item.ContainerStatus : binding.ContainerStatus;
    if (containerStatus) {
        updateLinks.push({
            'Property': navProperty,
            'Target': {
                'EntitySet': 'FldLogsContainerStatuses',
                'ReadLink': `FldLogsContainerStatuses('${containerStatus}')`,
            },
        });
    }
    break;
}
    return [createLinks,updateLinks];
}

/**
 * Validate the fields.
 * @param {IClientAPI} clientAPI
 * @returns {Promise} A promise that resolves when validation is complete.
 */
function validateFields(clientAPI) {
    if (!libCom.getStateVariable(clientAPI, 'Receive')) {
        return Promise.resolve();
    }
    const handlingDecisionListPicker = libCom.getControlProxy(clientAPI, 'HandlingDecisionListPicker');
    const sLoctLstPkr = libCom.getControlProxy(clientAPI, 'SLoctLstPkr');
    const handlingDecision = libCom.getListPickerValue(handlingDecisionListPicker.getValue());
    const destStorLocID = libCom.getListPickerValue(sLoctLstPkr.getValue());

    return Promise.all([
        validateField(clientAPI, handlingDecisionListPicker, handlingDecision),
        validateField(clientAPI, sLoctLstPkr, destStorLocID),
    ]);
}

/**
 * Execute the update action.
 * @param {IClientAPI} clientAPI
 * @param {Object} properties - The properties to update.
 * @param {Array} updateLinks - The links to update.
 * @param {string} transactionID - The transaction ID.
 * @param {string} entitySet - The entity set.
 * @param {Object} binding - The binding object.
 */
function executeUpdateAction(clientAPI, properties, createLinks, updateLinks, transactionID, entitySet, binding) {
    return clientAPI.executeAction({
        'Name': '/SAPAssetManager/Actions/Common/GenericUpdate.action',
        'Properties': {
            'Target': {
                'EntitySet': entitySet,
                'Service': '/SAPAssetManager/Services/AssetManager.service',
                'ReadLink': binding['@odata.readLink'],
            },
            'Properties': properties,
            'RequestOptions': {
                'UpdateMode': 'Replace',
            },
            'ActionResult': {
                '_Name': 'result',
            },
            'OnSuccess': '/SAPAssetManager/Rules/FL/ContainerItems/ItemUpdateOrReceiveMessage.js',
            'OnFailure': '/SAPAssetManager/Actions/FL/Edit/SwitchResourceFailure.action',
            'ShowActivityIndicator': true,
            'CreateLinks': createLinks,
            'UpdateLinks': updateLinks,
            'Headers': {
                'OfflineOData.TransactionID': transactionID,
            },
            'TransactionID': transactionID,
        },
    });
}

/**
 * Get common properties for the update.
 * @param {Object} binding - The binding object.
 * @param {Object} item - The item object.
 * @returns {Object} The common properties.
 */
function getCommonProperties(clientAPI, binding, item, entityType) {

    // base properties for all cases
    const baseProperties = {
        'ContainerID': binding.ContainerID,
        'DispatchDate': binding.DispatchDate,
        'DispatchLoc': binding.DispatchLoc,
    };

    //specic properties for each entity type
    switch (entityType) {
        case FLEntitySetNames.ContainerItem:
        case FLEntitySetNames.PackageItem:
        case FLEntitySetNames.HuDelItem:
            return {
                ...baseProperties,
                'HandlingUnitID': binding.HandlingUnitID,
                'ReferenceDocNumber': binding.ReferenceDocNumber,
                'ShipmentItemID': binding.ShipmentItemID,
                'HandlingDecision': item ? binding.HandlingDecision : libCom.getListPickerValue(libCom.getTargetPathValue(clientAPI, '#Control:HandlingDecisionListPicker/#Value')),
                'ProcessType': item ? item?.ProcessType : binding?.ProcessType,
                'DestStorLocID': item ? binding.DestStorLocID : '#Control:SLoctLstPkr/#SelectedValue',
                'VisualInspection': item ? binding.VisualInspection : '#Control:VisualInspecitonPicker/#SelectedValue',
                'Reservation': item ? binding.Reservation : '#Control:ReservationSimple/#Value',
                'ReservationItem': item ? binding.ReservationItem : '#Control:ReservationItemSimple/#Value',
                'Comments1': item ? binding.Comments1 : '#Control:CommentsSimple/#Value',
                'ContainerItemStatus': item ? item.ContainerItemStatus : binding.ContainerItemStatus,
                'ActionType': item ? item.ActionType : binding.ActionType,
            };
        case FLEntitySetNames.Container:
        case FLEntitySetNames.Package:
            return {
                ...baseProperties,
                'ActionType': item ? item.ActionType : binding.ActionType,
                'ContainerStatus': item ? item.ContainerStatus : binding.ContainerStatus,
                'IsContainerReleased': item ? item.IsContainerReleased : binding.IsContainerReleased,
            };
        default:
            return {};
    }
}

/**
 * Get transaction ID and properties.
 * @param {string} entitySet - The entity set.
 * @param {Object} binding - The binding object.
 * @param {Object} properties - The properties object.
 * @returns {Array} The transaction ID and navigation property.
 */
function getTransactionIDAndProperties(entitySet, binding, properties) {
    let transactionID = '';
    let navProperty = '';
    switch (entitySet) {
        case FLEntitySetNames.ContainerItem:
        case FLEntitySetNames.PackageItem:
            transactionID = `${binding.ContainerID}${binding.DispatchDate}${binding.DispatchLoc}${binding.HandlingUnitID}${binding.ReferenceDocNumber}${binding.TripCounter}`;
            properties.TripCounter = binding.TripCounter;
            navProperty = 'FldLogsContainerItemStatus_Nav';
            break;
        case FLEntitySetNames.Container:
        case FLEntitySetNames.Package:
            transactionID = `${binding.ContainerID}${binding.DispatchDate}${binding.DispatchLoc}${binding.TripCounter}`;
            properties.TripCounter = binding.TripCounter;
            navProperty = 'FldLogsContainerStatus_Nav';
            break;
        case FLEntitySetNames.HuDelItem:
            transactionID = `${binding.DispatchDate}${binding.DispatchLoc}${binding.HandlingUnitID}${binding.ReferenceDocNumber}${binding.ShipmentItemID}`;
            navProperty = 'FldLogsHUDelItemStatus_Nav';
            break;
    }
    return [transactionID, navProperty, properties];
}

/**
 * Validate a single field.
 * @param {IClientAPI} clientAPI
 * @param {Object} control - The control to validate.
 * @param {string} value - The value to validate.
 * @returns {Promise} A promise that resolves when validation is complete.
 */
export function validateField(clientAPI, control, value) {
    return new Promise((resolve, reject) => {
        if (!value) {
            libCom.executeInlineControlError(clientAPI, control, clientAPI.localizeText('field_is_required'));
            return reject();
        } else {
            return resolve();
        }
    });
}
