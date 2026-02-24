
import libCom from '../../../Common/Library/CommonLibrary';
import Logger from '../../../Log/Logger';
export default function FLOProductReturnToStock(context) {

   return context.executeAction('/SAPAssetManager/Actions/FL/WorkOrders/FLOProductReturnToStock.action')
      .then(() => {
         if (!libCom.getStateVariable(context, 'BulkFLUpdateNav')) {
            return context.executeAction('/SAPAssetManager/Actions/FL/WorkOrders/FLResvItemReturnToStockSuccess.action');
         } else {
            return context.executeAction({
               'Name': '/SAPAssetManager/Actions/FL/WorkOrders/FLResvItemReturnToStockSuccess.action',
               'Properties': {
                  'OnSuccess': '',
               },
            }).then(() => {
               const page = libCom.getPageName(context);
               const onSuccessAction = (page === 'FLOProductReturnStock') ? '/SAPAssetManager/Rules/FL/BulkUpdate/BulkUpdateClosePage.js' : '';
               const actionProperties = {
                  'Name': '/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntitySuccessMessage.action',
                  'Properties': {
                     'Message': context.localizeText('update_successful'),
                     'OnSuccess': onSuccessAction,
                  },
               };
               return context.executeAction(actionProperties).catch(error => {
                  Logger.error('FLUpdate', error);
               });
            });
         }
      });
}
