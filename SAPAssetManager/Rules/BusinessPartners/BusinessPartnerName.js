import {BusinessPartnerWrapper} from './BusinessPartnerWrapper';
import libEval from '../Common/Library/ValidationLibrary';
import contextConverter from '../Meter/BusinessPartners/BusinessPartnerContextConverter';
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';
import CommonLibrary from '../Common/Library/CommonLibrary';
import ODataLibrary from '../OData/ODataLibrary';

export default function BusinessPartnerName(context, bindingObject = context.getBindingObject()) {
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
        contextConverter(context);
    }
    let wrapper = new BusinessPartnerWrapper(bindingObject);
    let name = wrapper.name();

    const currentPageName = CommonLibrary.getPageName(context);
    if (currentPageName === 'BusinessPartnersListViewPage' && wrapper.partnerType === 'S4' && ODataLibrary.hasAnyPendingChanges(bindingObject)) {
        return context.localizeText('local_partner_name', [name || '-']);
    }

    //SP PartnerFunction Section
    if (bindingObject.PartnerFunction === 'SP') {
        let partnerId = bindingObject.Partner ? bindingObject.Partner : bindingObject.PartnerNum;
        if (!!bindingObject.NewPartner && partnerId !== bindingObject.NewPartner) { // partner was updated
            partnerId = bindingObject.NewPartner;
        }
        return readSPCustomerName(context, partnerId);
    }

    return libEval.evalIsEmpty(name) ? '-' : name;
}

function readSPCustomerName(context, Partner) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'Customers', [], `$filter=Customer eq '${Partner}'`).then(result => {
        if (result.length) {
            return result.getItem(0).Name1;
        } else {
            return '-';
        }
    });
}
