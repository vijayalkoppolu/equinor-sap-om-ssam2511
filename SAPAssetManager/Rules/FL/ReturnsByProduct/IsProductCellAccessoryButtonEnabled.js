
import CommonLibrary from '../../Common/Library/CommonLibrary';
import { ProductReturnStatus } from '../Common/FLLibrary';
export default function IsProductCellAccessoryButtonEnabled(clientAPI) {
     const page = CommonLibrary.getPageName(clientAPI);
     if (page === 'FLReturnsbyProductListViewPage') {
          const statusReturnDispatched = ProductReturnStatus.Dispatched;
          const statusAtRemote = ProductReturnStatus.AtRemote;
          const stausReadyDispatch = ProductReturnStatus.ReadyForDispatch;
          
          if (clientAPI.binding.FldLogsReturnStatus === statusReturnDispatched) {
               return '';
          }
          if ((clientAPI.binding?.IsSerialized === 'X' || clientAPI.binding?.IsInternalBatchManaged === 'X' || clientAPI.binding?.ValuationType === 'X') && clientAPI.binding.FldLogsReturnStatus === statusAtRemote) {
               return '';

          }
          if (clientAPI.binding.FldLogsReturnStatus === stausReadyDispatch) {
               return '';
          }
          return 'sap-icon://write-new';
     }
     return '';
}
