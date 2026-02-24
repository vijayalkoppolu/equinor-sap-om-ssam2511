import EditAllItems from '../BulkUpdate/EditAllItems';
import libCom from '../../Common/Library/CommonLibrary';
import { ContainerItemStatus } from '../Common/FLLibrary';
import RedrawFilter from './RedrawFilter';

export default function ReceiveAll(context) {
    libCom.setStateVariable(context, 'ValidateOthers', true);
    libCom.setStateVariable(context, 'Receive', true);
    const page = libCom.getPageName(context);
    const section = context.getPageProxy().getControls()[0].getSections()[0];
    const selectedItems = section.getSelectedItems().map(item => item.binding);
    libCom.setStateVariable(context, 'SelectedItems', selectedItems);
    return ValidateItems(context).then((validationResult) => {

        if (!validationResult.allValid) {
            if (libCom.getStateVariable(context, 'ValidateOthers')) {
                return EditAllItems(context);
            } else {
                return context.executeAction('/SAPAssetManager/Actions/FL/Containers/ReceiveError.action');
            }
        }
        return context.executeAction('/SAPAssetManager/Actions/FL/Containers/FLReceiveAllChangeset.action')
            .then(() => {
                section.setSelectionMode('None');  
                if (page === 'ContainerItemsListPage' || page === 'PackageItemsListPage') {
                const ContainerItems = page === 'ContainerItemsListPage' ? context?._context?.binding?.FldLogsContainerItem_Nav : context?._context?.binding?.FldLogsPackageItem_Nav;
                const totalItems = ContainerItems.length;
                const receivedItems = ContainerItems.filter(item => item.ContainerItemStatus === ContainerItemStatus.Received).length;

                if (receivedItems === totalItems) {
                    context.binding.ContainerStatus = '30'; 
                } else if (receivedItems > 0) {
                    context.binding.ContainerStatus = '20';
                }

                }
                return RedrawFilter(context);
            });
    });
}

export function ValidateItems(context, containerItems) {
    const items = containerItems || getItems(context);
    let validationResult = [];
    items.forEach(async item => {
        validationResult.push(ValidateSingleItem(context, item, containerItems));
    });
    return Promise.all(validationResult).then(results => {
        const failedItems = results.filter(result => !result.isValid).map(result => result.item);
        const allValid = results.every(result => result.isValid);
        return { allValid, failedItems };
    });
}

function ValidateSingleItem(context, item, containerItems) {
    let [handlingdecision, storageLocation, validateOthers] = [ValidateHandlingDecision(item), ValidateStorageLocation(item), ValidateOthers(item)];
    return Promise.all([handlingdecision, storageLocation, validateOthers]).then(([hdecValid, slocValid, othersValid]) => {
        let isValid = true;
        isValid &= hdecValid;
        isValid &= slocValid;
        if (!containerItems) {
            isValid &= othersValid;
        }
        if (!othersValid) {
            libCom.setStateVariable(context, 'ValidateOthers', othersValid);
        }
        return { isValid: !!isValid, item };

    });
}
function ValidateStorageLocation(item) {
    return Promise.resolve(!(item && !item.DestStorLocID));
}
function ValidateHandlingDecision(item) {
    return Promise.resolve(!(item && !item.HandlingDecision));
}
function ValidateOthers(item) {
    return Promise.resolve(!(item && (item.VoyageUUID && item.ContainerItemStatus === ContainerItemStatus.Dispatched || item.ContainerItemStatus === ContainerItemStatus.Received)));
}

export function getItems(context) {
    const section = context.getPageProxy().getControl('SectionedTable');
    const selectedItems = section.getSections()[0].getSelectedItems()?.map(item => item.binding) || [];
    const containerItems = context.binding?.FldLogsContainerItem_Nav?.filter(item =>
        item.ContainerItemStatus !== ContainerItemStatus.Received &&
        item.ContainerItemStatus !== ContainerItemStatus.NotFound,
    ) || [];
    const packageItems = context.binding?.FldLogsPackageItem_Nav?.filter(item =>
        item.ContainerItemStatus !== ContainerItemStatus.Received &&
        item.ContainerItemStatus !== ContainerItemStatus.NotFound,
    ) || [];
    
    if (selectedItems?.length > 0) {
        return selectedItems;
    }
    if (containerItems?.length > 0) {
        return containerItems;
    }
    if (packageItems?.length > 0) {
        return packageItems;
    }
    return undefined;
}
