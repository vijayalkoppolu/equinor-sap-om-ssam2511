export default function MeasuringPointDescriptionCaptionFDC(pageClientAPI) {
    let binding = pageClientAPI.binding;
    if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderTool') {
        return `${binding.PRTPoint.PointDesc}*`;
    }
    if (Object.prototype.hasOwnProperty.call(binding,'PointDesc')) {
        return `${binding.PointDesc}*`;
    } else {
        return `${binding.MeasuringPoint.PointDesc}*`;
    }
}
