
export default function LAMFilter(context, customBinding) {
    let binding = customBinding || context.binding;
    let filter = '';

    switch (binding?.['@odata.type']) {
        case '#sap_mobile.MyWorkOrderHeader':
            filter = "$filter=ObjectType eq 'OR'";
            break;
        case '#sap_mobile.MyNotificationHeader':
            filter = "$filter=ObjectType eq 'QM'";
            break;
        default:
            filter = '$expand=LAMObjectDatum_Nav';
            break;

    }

    return filter;
}
