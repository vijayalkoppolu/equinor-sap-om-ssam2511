
import CommonLibrary from '../../Common/Library/CommonLibrary';
import { ProductReturnStatus } from '../Common/FLLibrary';
export default function IsProductCellAccessoryType(clientAPI) {
     const page = CommonLibrary.getPageName(clientAPI);
         if (page === 'FLReturnsbyProductListViewPage') {
              const statusReturnDispatched = ProductReturnStatus.Dispatched;
              if (clientAPI.binding.FldLogsReturnStatus === statusReturnDispatched) {
                   return 'None';
              }
              if (clientAPI.binding?.IsSerialized === 'X' || clientAPI.binding?.IsInternalBatchManaged === 'X' || clientAPI.binding?.ValuationType === 'X') {
                   return 'None';
    
              }
              return 'DisclosureIndicator';
         }
    
         return 'None';
}
