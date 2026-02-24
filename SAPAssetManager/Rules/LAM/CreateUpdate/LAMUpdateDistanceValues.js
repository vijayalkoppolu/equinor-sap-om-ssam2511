import CommonLibrary from '../../Common/Library/CommonLibrary';
import libLocal from '../../Common/Library/LocalizationLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';

/** @param {IFormCellProxy} controlProxy  */
export default function LAMUpdateDistanceValues(controlProxy) {
    const pageProxy = controlProxy.getPageProxy();
    const controls = CommonLibrary.getControlDictionaryFromPage(pageProxy);
    const lrpId = CommonLibrary.getListPickerValue(controls.LRPLstPkr?.getValue());

    return Promise.all([
        ...[['StartPoint', 'StartMarkerLstPkr', 'DistanceFromStart'], ['EndPoint', 'EndMarkerLstPkr', 'DistanceFromEnd']]
            .map(([point, marker, distance]) => [controls[point]?.getValue(), controls[marker]?.getValue()?.map(r => r.ReturnValue).find(i => i), controls[distance]])
            .map(([pointVal, markerVal, distance]) => setDistanceControl(markerVal, controlProxy, pointVal, distance, lrpId)),
    ]);
}

function setDistanceControl(markerValue, controlProxy, endVal, distanceControl, lrpId) {
    if (ValidationLibrary.evalIsEmpty(markerValue) || !libLocal.isNumber(controlProxy, endVal)) {
        return undefined;
    }
    return controlProxy.read('/SAPAssetManager/Services/AssetManager.service', 'LinearReferencePatternItems', [], `$filter=(LRPId eq '${lrpId}' and Marker eq '${markerValue}' and StartPoint ne '')`).then(linearReferencePatternItems => {
    if (ValidationLibrary.evalIsEmpty(linearReferencePatternItems)) {
            distanceControl.setValue('');
            return undefined;
        }
        const markerVal = libLocal.toNumber(controlProxy, linearReferencePatternItems.getItem(0).StartPoint);
        return distanceControl.setValue(controlProxy.formatNumber(libLocal.toNumber(controlProxy, endVal) - markerVal, undefined, { useGrouping: false }));
    });
}
