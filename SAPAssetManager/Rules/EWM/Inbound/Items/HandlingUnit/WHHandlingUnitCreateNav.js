import libCommon from '../../../../Common/Library/CommonLibrary';
import { WarehouseTaskStatus } from '../../../Common/EWMLibrary';

export default async function WHHandlingUnitCreateNav(context) {
    const binding = context.getActionBinding?.() || context.binding;

    if (await libCommon.getEntitySetCount(context, `${binding['@odata.readLink']}/WarehouseTask_Nav`, `$filter=WTStatus eq '${WarehouseTaskStatus.Open}'`)) {
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/Common/GenericErrorDialog.action',
            'Properties': {
                'OKCaption': context.localizeText('ok'),
                'Title': context.localizeText('error'),
                'Message': context.localizeText('handling_unit_create_error_task_open'),
            },
        });
    }

    return context.executeAction('/SAPAssetManager/Actions/EWM/Inbound/HandlingUnit/WHHandlingUnitCreateNav.action');
}
