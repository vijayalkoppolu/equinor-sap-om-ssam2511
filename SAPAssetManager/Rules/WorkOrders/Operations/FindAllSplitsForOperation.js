import Logger from '../../Log/Logger';

export default async function FindAllSplitsForOperation(context, operation) {

    try {
        let splits = await context.read('/SAPAssetManager/Services/AssetManager.service', `${operation['@odata.readLink']}/MyWorkOrderOperationCapacityRequirement_`, [], '$expand=MyWorkOrderOperation_Nav/OperationMobileStatus_Nav,PMMobileStatus_Nav/OverallStatusCfg_Nav,Employee_Nav,MyWorkOrderOperation_Nav/WOHeader,UserTimeEntry_Nav');
        return splits || [];
    } catch (error) {
        Logger.error(`Error finding splits for operation ${operation.id}: ${error.message}`);
        return [];
    }
}
