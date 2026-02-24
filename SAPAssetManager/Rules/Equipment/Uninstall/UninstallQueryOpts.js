export default function UninstallQueryOpts(context) {
    if (context.binding['@odata.type'] === '#sap_mobile.MyEquipment') {
        return `$expand=WorkCenter_Nav&$filter=SuperiorEquip eq '${context.binding.EquipId}'`;
    } else if (context.binding['@odata.type'] === '#sap_mobile.MyFunctionalLocation') {
        return `$expand=WorkCenter_Nav,SystemStatuses_Nav&$filter=sap.entityexists(SystemStatuses_Nav) and FunctionalLocation/FuncLocId eq '${context.binding.FuncLocId}' and SuperiorEquip eq ''`;
    } else {
        return 'false';
    }
}
