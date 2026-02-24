
export default function TaskControlValue(context) {
    const binding = context.getPageProxy().binding;

    switch (binding['@odata.type']) {
        case '#sap_mobile.S4ServiceItem': 
            return binding.ItemNo;
        case '#sap_mobile.S4ServiceOrder': 
            return binding.ObjectID;
        case '#sap_mobile.MyWorkOrderOperation':
            return binding.OperationNo;
        case '#sap_mobile.MyWorkOrderHeader':
            return binding.OrderId;
    }

    return '';
}
