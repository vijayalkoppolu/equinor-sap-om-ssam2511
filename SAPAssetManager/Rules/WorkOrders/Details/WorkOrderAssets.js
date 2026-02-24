import { IsBindingObjectOnline } from '../IsBindingObjectOnline';
import { EquipmentFlocAssetLibrary } from '../Operations/Details/OperationAssets/EquipmentFlocAssetLibrary';

export default async function WorkOrderTarget(context) {
    return IsBindingObjectOnline(context) ? await EquipmentFlocAssetLibrary.OnlineBusinessObjectAssets(context) : await EquipmentFlocAssetLibrary.WorkOrderAssets(context);
}
