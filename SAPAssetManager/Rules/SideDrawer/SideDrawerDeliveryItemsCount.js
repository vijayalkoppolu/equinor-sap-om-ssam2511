import libCommon from '../Common/Library/CommonLibrary';

export default function SideDrawerDeliveryItemsCount(clientAPI) {
    return libCommon.getEntitySetCount(clientAPI, 'FldLogsHuDelItems')
        .then(count => {
            return clientAPI.localizeText('fld_delivery_items_handling_units_x', [count]);
        });
}
