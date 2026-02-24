import CommonLibrary from '../../../Common/Library/CommonLibrary';
import GetMaintainPickHandlingUnit from './GetMaintainPickHandlingUnit';
import Logger from '../../../Log/Logger';

export default function WarehouseTaskHandlingUnitCreate(context) {

    const handlingUnitValue = GetMaintainPickHandlingUnit(context);
    const pageProxy = context.getPageProxy('WarehouseTaskHandlingUnitPage');
    const formCellSection = pageProxy.getControls('FormCellSection0');
    const handlingUnitControl = formCellSection[0]?.getControl('WhPickHandlingUnitSimple');

    // check if handlingunitvalue and packagingmaterialvalue are inputted by user, only then proceed with create action
    if (handlingUnitValue && CommonLibrary.getStateVariable(context, 'PackagingMaterialCreate')) {
        return context.executeAction('/SAPAssetManager/Actions/EWM/WarehouseTasks/HandlingUnit/WarehouseTaskHandlingUnitCreate.action')
            .then(result => {
                Logger.debug('WarehouseTaskConfirmationCSCreate', result);
                return Promise.resolve(result);
            })
            .catch(error => {
                Logger.error('WarehouseTaskConfirmationCSCreate', error);
                if (error && error.message && error.message.includes('duplicate')) {
                CommonLibrary.executeInlineControlError(context, handlingUnitControl, context.localizeText('validation_duplicate_handlingunit'));
                }
                return Promise.reject(error);
            });
    } else {
        return Promise.resolve();
    }
}
