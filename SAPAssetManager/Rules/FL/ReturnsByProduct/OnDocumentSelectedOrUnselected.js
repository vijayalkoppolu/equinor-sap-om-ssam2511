import CommonLibrary from '../../Common/Library/CommonLibrary';
import { SetVisibleItem, HEADER_ITEMS } from './ListView/SwitchSelect';
/**
* Enable/disable FioriToolbar fragments based on fast filter selection
* @param {IClientAPI} context
*/
export default function OnDocumentSelectedOrUnselected(context) {
    let filters = context.filters;
    let filterLength = filters ? filters[0].filterItemsDisplayValue.length : 0;
    const filterLabel = filters && filterLength > 0 ? filters[0].filterItemsDisplayValue[0].match(/^[^\(]+/)[0].trim() : '';
    const section = context.getPageProxy().getControls()[0].getSections()[0];
    const itemCount = section.getSelectedItemsCount();
    if (filterLength === 1 && itemCount > 0) {
        toolBarFilterMapping(filterLabel, context);
    } else {
        // More than one filter selected or none, disable all toolbar buttons
        toggleToolBar(context, false);
    }
    OnProductSelectedOrUnselected(context, section, itemCount);
}

function setToolBarItems(context, initiateEnabled, loadEnabled, initiateType, loadType) {
    const page = CommonLibrary.getPageName(context);
    // Enable/disable only required buttons
    CommonLibrary.enableToolBar(context, page, 'InitiateReturnsButton', initiateEnabled, initiateType);
    CommonLibrary.enableToolBar(context, page, 'FLLoadQuantityButton', loadEnabled, loadType);
}

export function toggleToolBar(context, isEnabled) {
    const page = CommonLibrary.getPageName(context);
    CommonLibrary.enableToolBar(context, page, 'InitiateReturnsButton', isEnabled);
    CommonLibrary.enableToolBar(context, page, 'FLLoadQuantityButton', isEnabled);
}

export function toolBarFilterMapping(filterLabel, context) {
    // Map fast filter selection to fragment states
    switch (filterLabel) {
        case context.localizeText('fld_remote'):
            setToolBarItems(context, true, false, 'Primary', 'Text');
            break;
        case context.localizeText('fld_return_scheduled'):
            setToolBarItems(context, false, true, 'Text', 'Primary');
            break;
        case context.localizeText('fld_ready_for_dispatch'):
            setToolBarItems(context, false, false, 'Text', 'Text');
            break;
        case context.localizeText('fld_dispatched'):
            setToolBarItems(context, false, false, 'Text', 'Text');
            break;
        default:
            setToolBarItems(context, false, false, 'Text', 'Text');
    }
}

 function OnProductSelectedOrUnselected(context, section, itemCount) {

    if (itemCount === 0) {
        SetVisibleItem(context, HEADER_ITEMS.SelectAll);
    } else if (section?._context.element?.binding?.length === itemCount) {
        SetVisibleItem(context, HEADER_ITEMS.DeselectAll);
    }

}
