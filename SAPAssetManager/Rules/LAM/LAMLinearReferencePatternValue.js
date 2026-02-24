export default function LAMLinearReferencePatternValue(controlProxy) {
    return controlProxy.read('/SAPAssetManager/Services/AssetManager.service', controlProxy.binding['@odata.readLink'] + '/LAMObjectDatum_Nav', ['LRPId'], '').then(lamData => {
        if (lamData && lamData.length > 0) {
            return lamData.getItem(0).LRPId;
        }
        return '';
    });
}
