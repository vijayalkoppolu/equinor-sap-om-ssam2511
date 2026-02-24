import libCom from '../../../../Common/Library/CommonLibrary';
export default function FLResvItemsReturnFilterDispValue(clientAPI) {
  
     return libCom.getEntitySetCount(clientAPI, `${clientAPI.getPageProxy().binding['@odata.readLink']}/FldLogsWoResvItem_Nav`, "$filter=Status eq 'R'").then(count => {
        return clientAPI.localizeText('return_x',[count]);
    }); 
}
