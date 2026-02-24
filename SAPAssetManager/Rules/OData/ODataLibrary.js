import libThis from './ODataLibrary';
import Logger from '../Log/Logger';
import libCommon from '../Common/Library/CommonLibrary';

export default class {

    static isOnlineService(context) {
        let provider = context.getODataProvider('/SAPAssetManager/Services/OnlineAssetManager.service');
        return provider.isInitialized() && libCommon.getStateVariable(context, 'OnlineServiceInitialized') === true;
    }

    static async initializeOnlineService(context) {
        if (libThis.isOnlineService(context)) {
            return Promise.resolve(true);
        }
        return context.executeAction('/SAPAssetManager/Actions/OData/OpenOnlineService.action').then(() => {
            libCommon.setStateVariable(context, 'OnlineServiceInitialized', true);
            return true;
        }).catch((error) => {
            libCommon.setStateVariable(context, 'OnlineServiceInitialized', false);
            Logger.error('initializeOnlineService', error);
            context.getClientData().Error = error?.message;
            return false;
        });
    }

    static async readFromOfflineService(context, entitySet, queryOptions, properties = []) {
        try {
            return await context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, properties, queryOptions);
        } catch (error) {
            Logger.error('readFromOfflineService', error);
            return [];
        }
    }

    static hasAnyPendingChanges(binding) {
        if (binding) {
            return Object.prototype.hasOwnProperty.call(binding, '@sap.hasPendingChanges') || Object.prototype.hasOwnProperty.call(binding, '@sap.inErrorState');
        } else {
            return false;
        }

    }

    static isLocal(binding) {
        if (binding) {
            return this.hasAnyPendingChanges(binding) && libCommon.isCurrentReadLinkLocal(binding['@odata.readLink']);
        } else {
            return false;
        }
        
    }
}
