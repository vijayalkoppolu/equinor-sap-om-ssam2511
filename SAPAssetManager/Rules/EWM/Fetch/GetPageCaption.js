/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import SetFetchText from './SetFetchText';
export default function GetPageCaption(clientAPI) {
 return SetFetchText(clientAPI).then((pageType) => {
        return clientAPI.localizeText('x_fetch_download',[pageType]);
    }); 
}
