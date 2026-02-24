import ComLib from '../../../../Common/Library/CommonLibrary';
import { SetVisibleItem, HEADER_ITEMS } from './SwitchSelect';
import { checkFilters, SetToolbarVisible } from './FLProductsCountCaption';


export default function OnProductSelectedOrUnselected(clientAPI) {
    const section = clientAPI.getPageProxy().getControls()[0].getSections()[0];
    const itemCount = section.getSelectedItemsCount();
    const page = ComLib.getPageName(clientAPI);
    const filters = clientAPI.getPageProxy().getControls()[0]?.filters;
    const { hasReturnedFilter, hasOpenFilter } = checkFilters(filters);
    const confirmFilterCondition = (itemCount > 0 && !hasReturnedFilter && hasOpenFilter);

    ComLib.enableToolBar(clientAPI, page, 'ReturnStock', confirmFilterCondition);
    SetToolbarVisible(clientAPI, page, confirmFilterCondition);
    clientAPI.getPageProxy().getFioriToolbar().getItems()[0].setVisible(confirmFilterCondition);

    if (itemCount === 0) {    
        SetVisibleItem(clientAPI, HEADER_ITEMS.SelectAll);
    } else if (section?._context.element?.binding?.length === itemCount) { 
        SetVisibleItem(clientAPI, HEADER_ITEMS.DeselectAll);
    }
}


