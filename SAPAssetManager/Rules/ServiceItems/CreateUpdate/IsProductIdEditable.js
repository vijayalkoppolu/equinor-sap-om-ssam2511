import IsOnCreate from '../../Common/IsOnCreate';

export default function IsProductIdEditable(context) {
    const binding = context.getPageProxy().binding || {};
    const isForVehicleStock = binding['@odata.type'] === '#sap_mobile.MaterialSLoc';

    return isForVehicleStock ? false : IsOnCreate(context);
}
