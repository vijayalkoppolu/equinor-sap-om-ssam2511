import CommonLibrary from '../../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../../Common/Library/ValidationLibrary';

/**
 * Assign selected documents to voyage by sending backend payloads
 * @param {IClientAPI} context
 */
export default async function AssignToVoyageSubmit(context) {

    const entitySet = CommonLibrary.getStateVariable(context, 'AssignToVoyageItemType');
    const selectedItems = CommonLibrary.getStateVariable(context, 'AssignToVoyageSelectedItems') || [];

    const selectedVoyage = CommonLibrary.getStateVariable(context, 'AssignToVoyageSelectedVoyage');
    const voyageUuid = selectedVoyage ? selectedVoyage.VoyageStageUUID : '';

    let voyageStageId = '';
    if (ValidationLibrary.evalIsNotEmpty(voyageUuid)) {
        const voyageMasters = await context.read(
            '/SAPAssetManager/Services/AssetManager.service',
            'FldLogsVoyageMasters',
            [],
            `$filter=VoyageStageUUID eq '${voyageUuid}'`,
        );
        if (voyageMasters && voyageMasters.length > 0) {
            voyageStageId = voyageMasters.getItem(0).FldLogsVoyageStageId;
        }
    }

    if (!ValidationLibrary.evalIsNotEmpty(voyageUuid) || !ValidationLibrary.evalIsNotEmpty(voyageStageId)) {
        return context.executeAction('/SAPAssetManager/Actions/Common/ErrorBannerMessage.action');
    }

    for (const item of selectedItems) {
        let objectId = item.ObjectId;
        try {
            await context.executeAction({
                Name: '/SAPAssetManager/Actions/FL/Voyages/AssignToVoyageUpdate.action',
                Properties: {
                    Target: {
                        EntitySet: entitySet,
                        Service: '/SAPAssetManager/Services/AssetManager.service',
                        ReadLink: item['@odata.readLink'],
                    },
                    Properties: {
                        ObjectId: objectId,
                        FldLogsShptVoyageUuidExt: voyageUuid,
                        FldLogsVoyageStageId: voyageStageId,
                        ActionType: 'ASGNTOVYG',
                    },
                },
            });
        } catch (error) {
            CommonLibrary.error(context, error);
        }
    }
}
