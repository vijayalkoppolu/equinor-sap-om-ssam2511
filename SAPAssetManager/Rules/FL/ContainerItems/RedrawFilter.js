import CommonLibrary from '../../Common/Library/CommonLibrary';
import { redrawToolbar } from '../../Common/DetailsPageToolbar/ToolbarRefresh';
import { CONTAINER_ITEMS_OPEN_FILTER } from './ContainerItemsListQueryOptions';
import { PACKAGE_ITEMS_OPEN_FILTER } from '../PackageItems/PackageItemsOnLoadQuery';

export default function RedrawFilter(clientAPI) {
    const section = clientAPI.getPageProxy().getControl('SectionedTable');
      // Workaround suggested in MDKBUG-1391
        // Setting the filters will redraw the FilterFeedbackBar.
        // Triggering section redraw with true param would force full redraw instead of row redraw.
        const context =  clientAPI.context;
        const currentFilters = section.filters;
        
        section.filters = currentFilters;
        section.redraw();
        const page = CommonLibrary.getPageName(clientAPI);
        CommonLibrary.enableToolBar(clientAPI, page, 'ReceiveItem', false);
        CommonLibrary.enableToolBar(clientAPI, page, 'NotFoundItem', false);
        CommonLibrary.clearStateVariable(clientAPI, 'Receive');
        CommonLibrary.clearStateVariable(clientAPI, 'FailedItems');
        if (context.filters) {
          const filter = context?.filters[0]?.filterItems[0];
          const filterLength = context?.filters[0].filterItems?.length;
          if ((filter === CONTAINER_ITEMS_OPEN_FILTER && filterLength === 1) || (filter === PACKAGE_ITEMS_OPEN_FILTER && filterLength === 1)) {
            CommonLibrary.switchToolBarVisibility(context, page, 'ReceiveAll', true);
          } else {
            CommonLibrary.switchToolBarVisibility(context, page, 'ReceiveAll', false);
          }   
        }
        return redrawToolbar(clientAPI.getPageProxy());

}     
