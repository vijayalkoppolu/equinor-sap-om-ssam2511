import Logger from '../Log/Logger';
import { GlobalVar as GlobalClass } from './Library/GlobalCommon';
import { ItemCategoryVar as GlobalItemCategory } from './Library/GlobalItemCategory';
import { InspectionValuationVar as GlobalInspectionResults } from './Library/GlobalInspectionResults';
import { PartnerFunction } from './Library/PartnerFunction';
import common from './Library/CommonLibrary';
import { cacheEWMProcessesPreference, cacheLayoutStylePreference } from '../UserPreferences/PersonalizationPreferences';
import CacheMobileStatusTexts from './CacheMobileStatusTexts';
import CacheMobileStatusSequences from './CacheMobileStatusSeqs';

export function setupStaticAppParameters(pageProxy) {
    return pageProxy.read('/SAPAssetManager/Services/AssetManager.service', 'AppParameters', ['ParamGroup', 'ParamValue', 'ParameterName'], '')
        .then((/** @type {ObservableArray<AppParameter>} */ appParams) => {
            const result = {};
            const resultProxy = common.defaultObject(result, () => ({}));
            appParams.forEach(param => resultProxy[param.ParamGroup][param.ParameterName] = param.ParamValue);
            GlobalClass.setAppParam(result);
        });
}

export function setDeltaSyncUserPreferenceInfo(pageProxy) {
    const perfGrp = pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Personalization/DeltaSync/DeltaSyncPersonalizationPreferenceGroup.global').getValue();
    return pageProxy.read('/SAPAssetManager/Services/AssetManager.service', 'UserPreferences', ['PreferenceGroup', 'PreferenceName', 'PreferenceValue'], `$filter=PreferenceGroup eq '${perfGrp}'`)
        .then((/** @type {ObservableArray<AppParameter>} */ params) => {
            const result = {};
            const resultProxy = common.defaultObject(result, () => ({}));
            params.forEach(param => resultProxy[param.PreferenceGroup][param.PreferenceName] = (param.PreferenceValue === 'true') ? true : (param.PreferenceValue === 'false') ? false : param.PreferenceValue);
            GlobalClass.setDeltaSyncUserPreferenceInfo(result);
        });
}

export function setNotificationProcessingContextsInfo(pageProxy) {
    return pageProxy.read('/SAPAssetManager/Services/AssetManager.service', 'NotificationProcessingContexts', ['ProcessingContext', 'Description'], '')
        .then(userProfile => {
            const result = new Map(userProfile.map((i) => [i.ProcessingContext, i.Description]));
            GlobalClass.setNotificationProcessingContexts(result);
        }).catch((error) => {
            Logger.error('setNotificationProcessingContextsInfo' , error);
        });
}

export function setupStaticSoldToPartyPartner(pageProxy) {
    //set Sold-To-Party PartnerFunction
    let soldToPartnerType = GlobalClass.getAppParam().PARTNERFUNCTION.SoldToParty;
    return pageProxy.read('/SAPAssetManager/Services/AssetManager.service', 'PartnerFunctions', [], `$filter=PartnerType eq '${soldToPartnerType}'`)
        .then(PF => {
            if (PF && PF.getItem(0)) {
                PartnerFunction.setSoldToPartyPartnerFunction(PF.getItem(0).PartnerFunction);
            } else {
                PartnerFunction.setSoldToPartyPartnerFunction('');
            }
        });
}

export function setupStaticUserSystemInfos(pageProxy) {
    return pageProxy.read('/SAPAssetManager/Services/AssetManager.service', 'UserSystemInfos', ['SystemSettingName', 'SystemSettingValue'], '')
        .then(userProfile => {
            const result = new Map(userProfile.map((i) => [i.SystemSettingName, i.SystemSettingValue]));
            common.setStateVariable(pageProxy, 'UserSystemInfos', result);
            GlobalClass.setUserSystemInfo(result);
        });
}


export function setupStaticUserGeneralInfos(pageProxy) {
    return pageProxy.read('/SAPAssetManager/Services/AssetManager.service', 'UserGeneralInfos', [], '').then(userGeneralInfo => {
        if (userGeneralInfo && userGeneralInfo.length > 0) {
            let row = userGeneralInfo.getItem(0);
            GlobalClass.setUserGeneralInfo(row);
        }
    });
}

export function setupStaticItemCategories(pageProxy) {
    return pageProxy.read('/SAPAssetManager/Services/AssetManager.service', 'ItemCategories', [], '').then(itemCategoriesInfo => {
        const categories = {};
        itemCategoriesInfo.forEach(element => categories[element.ItemCategory] = element.ItemCategoryDesc);
        GlobalItemCategory.setItemCategories(categories);
    });
}
export function setupStaticInspectionResultValuations(pageProxy) {
    return pageProxy.read('/SAPAssetManager/Services/AssetManager.service', 'InspectionResultValuations', ['ShortText', 'Valuation'], '')
        .then(inspectionValuationsInfo => {
            const valuations = {};
            inspectionValuationsInfo.forEach(element => valuations[element.ShortText] = element.Valuation);
            GlobalInspectionResults.setInspectionResultValuations(valuations);
        });
}

export function setupStaticPersonnelNumberPartner(pageProxy) {
    //set Personel Number PartnerFunction
    let personelPartnerType = GlobalClass.getAppParam().PARTNERFUNCTION.PersonelNumber;
    return pageProxy.read('/SAPAssetManager/Services/AssetManager.service', 'PartnerFunctions', [], `$filter=PartnerType eq '${personelPartnerType}'`)
        .then(PF => PartnerFunction.setPersonnelPartnerFunction(PF?.getItem(0)?.PartnerFunction || ''));
}

export default function InitializeCachedStaticVariables(pageProxy) {
    return [
        setupStaticAppParameters,
        setupStaticSoldToPartyPartner,
        setupStaticPersonnelNumberPartner,
        setupStaticUserSystemInfos,
        setupStaticUserGeneralInfos,
        setupStaticItemCategories,
        setupStaticInspectionResultValuations,
        cacheLayoutStylePreference,
        cacheEWMProcessesPreference,
        setDeltaSyncUserPreferenceInfo,
        setNotificationProcessingContextsInfo,
        CacheMobileStatusTexts,
        CacheMobileStatusSequences,
    ]
        .reduce((acc, p) => acc.then(() => p(pageProxy)), Promise.resolve())
        .catch(error => Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCommon.global').getValue(), `Failed to initialize static cached globals : ${error}`));
}
