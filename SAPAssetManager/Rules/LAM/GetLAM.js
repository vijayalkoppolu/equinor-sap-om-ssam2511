import Logger from '../Log/Logger';
import lamIsEnabled from './LAMIsEnabled';

export default function GetLAM(context, entity, options = [], filter = '') {
    if (!lamIsEnabled(context)) return Promise.resolve(null);

    return context.read('/SAPAssetManager/Services/AssetManager.service', entity, options, filter).then(results => {
        let lam = null;

        if (results.length) {
            let result = results.getItem(0);
            if (result['@odata.type'] === '#sap_mobile.LAMObjectDatum') {
                lam = result;
            } else if (result.LAMObjectDatum_Nav) {
                lam = result.LAMObjectDatum_Nav;
            }
        } 
        
        return lam;
    }).catch(error => {
        Logger.error('GetLAM', error);
        return Promise.resolve(null);
    });
}
