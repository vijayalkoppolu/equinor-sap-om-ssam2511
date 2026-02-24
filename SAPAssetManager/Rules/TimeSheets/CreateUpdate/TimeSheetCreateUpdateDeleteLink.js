import libCom from '../../Common/Library/CommonLibrary';
import valLibrary from '../../Common/Library/ValidationLibrary';

export default function TimeSheetCreateUpdateDeleteLink(pageProxy) {
    let links = [];
    const woReadLink = libCom.getListPickerValue(libCom.getTargetPathValue(pageProxy, '#Control:RecOrderLstPkr/#Value'));
    const opReadLink = libCom.getListPickerValue(libCom.getTargetPathValue(pageProxy, '#Control:OperationLstPkr/#Value'));
    const subOpReadLink = libCom.getListPickerValue(libCom.getTargetPathValue(pageProxy, '#Control:SubOperationLstPkr/#Value'));
    if (woReadLink === '' && !valLibrary.evalIsEmpty(pageProxy.binding.MyWOHeader)) {
        links.push({
            'Property': 'MyWOHeader',
            'Target':
            {
                'EntitySet': 'MyWorkOrderHeaders',
                'ReadLink': pageProxy.binding.MyWOHeader['@odata.readLink'],
            },
        });
    }
    if (opReadLink === '' && !valLibrary.evalIsEmpty(pageProxy.binding.MyWOOperation)) {
        links.push({
            'Property': 'MyWOOperation',
            'Target':
            {
                'EntitySet': 'MyWorkOrderOperations',
                'ReadLink': pageProxy.binding.MyWOOperation['@odata.readLink'],
            },
        });
    }
    if (subOpReadLink === '' && !valLibrary.evalIsEmpty(pageProxy.binding.MyWOSubOperation)) {
        links.push({
            'Property': 'MyWOSubOperation',
            'Target':
            {
                'EntitySet': 'MyWorkOrderSubOperations',
                'ReadLink': pageProxy.binding.MyWOSubOperation['@odata.readLink'],
            },
        });
    }
    return links;
}
