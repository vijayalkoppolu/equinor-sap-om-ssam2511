import Logger from '../Log/Logger';
import appSettings from '../Common/Library/ApplicationSettings';
import IsESRINameUserAuthEnabled from './IsESRINameUserAuthEnabled';
import EsriLibrary from './EsriLibrary';
import libCom from '../Common/Library/CommonLibrary';
import IsGISEnabledForAnyPersona from '../Maps/IsGISEnabledForAnyPersona';
import ODataLibrary from '../OData/ODataLibrary';
import DownloadDefiningRequest from '../OData/Download/DownloadDefiningRequest';
/**
* Reads ESRI parameters from the AppParameters
* Redirects to ESRI login page
* @param {IClientAPI} clientAPI
*/
export default function ESRIUserLogin(clientAPI) {
    if (libCom.isInitialSync(clientAPI) && !EsriLibrary.isESRILoginCompleted(clientAPI) && IsGISEnabledForAnyPersona(clientAPI)) {
        return ODataLibrary.initializeOnlineService(clientAPI).then(() => { 
            let gis = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/ESRI/GIS.global').getValue();
            
            return clientAPI.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'AppParameters', [], `$filter=ParamGroup eq '${gis}'`).then((results) => { 
                SaveEsriParamsToAppSettings(clientAPI, results);
                if (IsESRINameUserAuthEnabled(clientAPI)) {
                    return EsriLibrary.callESRIAuthenticate(clientAPI, '/SAPAssetManager/Rules/OData/Download/DownloadDefiningRequest.js', false, true);
                }
                clientAPI.dismissActivityIndicator();
                return DownloadDefiningRequest(clientAPI);
            }).catch(function(err) {
                Logger.error(`ESRIUserLogin - Failed to read Online app parameters: ${err}`);
                clientAPI.dismissActivityIndicator();
                return DownloadDefiningRequest(clientAPI);
            });
        }).catch(function(err) {
            Logger.error(`ESRIUserLogin - Failed to initialize Online OData Service: ${err}`);
            clientAPI.dismissActivityIndicator();
            return DownloadDefiningRequest(clientAPI);
        });
    }
    clientAPI.dismissActivityIndicator();
    return DownloadDefiningRequest(clientAPI);
}

function SaveEsriParamsToAppSettings(clientAPI, params) {
    if (params?.length) {
        for (let index = 0; index < params.length; index++) {
            appSettings.remove(clientAPI, params.getItem(index).ParameterName);
            appSettings.setString(clientAPI, params.getItem(index).ParameterName, params.getItem(index).ParamValue);
            Logger.info(`parameter name: ${params.getItem(index).ParameterName}, parameter name: ${params.getItem(index).ParamValue}`);
        }
    }
}
