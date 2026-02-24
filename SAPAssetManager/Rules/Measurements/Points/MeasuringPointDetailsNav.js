import Logger from '../../Log/Logger';
import libVal from '../../Common/Library/ValidationLibrary';

export default function MeasuringPointDetailsNav(context) {
    const binding = context.binding;
    const pageProxy = context.getPageProxy();
    const actionContext = pageProxy.getActionBinding();

    let readLink;
    const query = '$expand=MeasurementDocs,WorkOrderTool';

    if (actionContext['@odata.type'] === '#sap_mobile.MeasuringPoint') {
        readLink = actionContext['@odata.readLink'];
    } else if (binding.PRTPoint) {
        readLink = binding.PRTPoint['@odata.readLink'];
    } else {
        readLink = actionContext['@odata.readLink'] + '/PRTPoint';
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', readLink, [], query)
        .then(result => {
            let newBinding = result.getItem(0) || {};
            // Check for WO/Operation
            if (binding.ObjectKey && binding.WOHeader?.ObjectKey) {
                newBinding.OperationObjectKey = context.binding.ObjectKey;
                newBinding.OrderObjectKey = context.binding.WOHeader.ObjectKey;
            }
            const entity = processEntity(newBinding, actionContext);
            return openDetailsPage(pageProxy, entity); 
        })
        .catch(error => {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryMeasuringPoints.global').getValue(), error);
        });
}

export function processEntity(entity, context) {
    if (context && context.disableReading) {
        entity.disableReading = true;
    }
    return entity;
}

function openDetailsPage(context, entity) {
    context.setActionBinding(entity);

    if (libVal.evalIsNotEmpty(entity.CodeGroup)) {
        if (libVal.evalIsEmpty(entity.CharName)) { // Navigation to a different detail pages if val code only
            return context.executeAction('/SAPAssetManager/Actions/Measurements/MeasuringPointDetailsValCodeNav.action');
        }
        return context.executeAction('/SAPAssetManager/Actions/Measurements/MeasuringPointDetailsNav.action');
    }
    return context.executeAction('/SAPAssetManager/Actions/Measurements/MeasuringPointDetailsNav.action');
}
