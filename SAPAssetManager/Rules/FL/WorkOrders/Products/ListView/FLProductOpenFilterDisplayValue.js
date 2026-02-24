import libCom from '../../../../Common/Library/CommonLibrary';
export default function FLProductOpenFilterDisplayValue(clientAPI) {
  
     return libCom.getEntitySetCount(clientAPI, `${clientAPI.getPageProxy().binding['@odata.readLink']}/FldLogsWoProduct_Nav`, "$filter=Status eq ''").then(count => {
        return clientAPI.localizeText('open_x',[count]);
    }); 
}
