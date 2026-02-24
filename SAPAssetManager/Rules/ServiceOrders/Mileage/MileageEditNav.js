import ODataLibrary from '../../OData/ODataLibrary';

export default function MileageEditNav(context) {
    let binding = context.getPageProxy().getActionBinding();

    if (binding) {
        let isLocal = ODataLibrary.isLocal(binding);
        return isLocal ? context.executeAction('/SAPAssetManager/Actions/ServiceOrders/Mileage/MileageAddEditNav.action') : '';
    }
    
    return '';
}
