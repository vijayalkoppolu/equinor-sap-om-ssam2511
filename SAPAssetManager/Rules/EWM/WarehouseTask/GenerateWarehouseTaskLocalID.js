import GenerateLocalID from '../../Common/GenerateLocalID';
import libCom from '../../Common/Library/CommonLibrary';

export default function GenerateWarehouseTaskLocalID(context) {
    return GenerateLocalID(context, 'WarehouseTasks', 'WarehouseTask', '0000',"$filter=startswith(WarehouseTask, 'LOCAL') eq true", 'LOCAL_').then(LocalId => {
        libCom.setStateVariable(context, 'LocalId', LocalId);
        return LocalId;
    });
}
