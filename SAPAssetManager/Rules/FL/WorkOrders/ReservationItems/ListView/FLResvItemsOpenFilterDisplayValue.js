import libCom from '../../../../Common/Library/CommonLibrary';
export default function FLResvItemsOpenFilterDisplayValue(clientAPI) {
  
     return libCom.getEntitySetCount(clientAPI, `${clientAPI.getPageProxy().binding['@odata.readLink']}/FldLogsWoResvItem_Nav`, "$filter=Status eq ''").then(count => {
        return clientAPI.localizeText('open_x',[count]);
    }); 
}
