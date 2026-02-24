
export default function LAMReadLink(context, customBinding) {
    let binding = customBinding || context.binding;
    let entity = '';

    switch (binding?.['@odata.type']) {
        case '#sap_mobile.MyWorkOrderHeader':
        case '#sap_mobile.MyNotificationHeader':
            entity = binding['@odata.readLink'] + '/LAMObjectDatum_Nav';
            break;
        default:
            entity = binding['@odata.readLink'];
            break;

    }

    return entity;
}
