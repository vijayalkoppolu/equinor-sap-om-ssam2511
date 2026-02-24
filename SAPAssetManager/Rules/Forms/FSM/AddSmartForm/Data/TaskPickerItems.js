
export default function TaskPickerItems(context) {
    const binding = context.getPageProxy().binding;
    const items = [];

    switch (binding['@odata.type']) {
        case '#sap_mobile.S4ServiceItem': 
            items.push({
                'DisplayValue': binding.ItemDesc,
                'ReturnValue': binding.ItemNo,
            });
            break;
        case '#sap_mobile.S4ServiceOrder': 
            items.push({
                'DisplayValue': binding.Description,
                'ReturnValue': binding.ObjectID,
            });
            break;
        case '#sap_mobile.MyWorkOrderOperation':
            items.push({
                'DisplayValue': binding.OperationShortText,
                'ReturnValue': binding.OperationNo,
            });
            break;
        case '#sap_mobile.MyWorkOrderHeader':
            items.push({
                'DisplayValue': binding.OrderDescription,
                'ReturnValue': binding.OrderId,
            });
            break;
    }

    return items;
}
