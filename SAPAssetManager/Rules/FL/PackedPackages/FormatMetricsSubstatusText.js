import libVal from '../../Common/Library/ValidationLibrary';
export default function FormatMetricsSubstatusText(clientAPI) {
    let weight = [];
    let volume = [];
    let actualWeight;
    let actualWeightUnit;
    let grossVolume;
    const grossVolumeUnit = clientAPI.binding.FldLogsGrossVolumeUnit;

    if (clientAPI.binding['@odata.type'] === '#sap_mobile.FldLogsPackCtnPkdPkg') {
        actualWeight = Number(clientAPI.binding.ProductGrossWeight);
        actualWeightUnit = clientAPI.binding.ProductWeightUnit;
        grossVolume = Number(clientAPI.binding.FldLogsGrossVolume);

    } else if (clientAPI.binding['@odata.type'] === '#sap_mobile.FldLogsPackCtnPkdCtn') {
        actualWeight = Number(clientAPI.binding.ProductGrossWeight);
        actualWeightUnit = clientAPI.binding.FldLogsCtnActualWeightUnit;
        grossVolume = Number(clientAPI.binding.FldLogsGrossVolume);
    } else if (clientAPI.binding['@odata.type'] === '#sap_mobile.FldLogsCtnPackageId') {
        actualWeight = Number(clientAPI.binding.ItemWeight);
        actualWeightUnit = clientAPI.binding.ProductWeightUnit;
        grossVolume = Number(clientAPI.binding.ItemVolume);
    } else {
        actualWeight = Number(clientAPI.binding.ItemWeight);
        actualWeightUnit = clientAPI.binding.ProductWeightUnit;
        grossVolume = Number(clientAPI.binding.FldLogsGrossVolume);
    }

    // Only show weight if actualWeight is not 0
    if (!libVal.evalIsEmpty(actualWeight) && actualWeight !== 0) {
        weight.push(actualWeight);
        if (!libVal.evalIsEmpty(actualWeightUnit)) {
            weight.push(actualWeightUnit);
        }
    }
    // Only show volume if grossVolume is not 0
    if (!libVal.evalIsEmpty(grossVolume) && grossVolume !== 0) {
        volume.push(grossVolume);
        if (!libVal.evalIsEmpty(grossVolumeUnit)) {
            volume.push(grossVolumeUnit);
        }
    }

    return `${weight.join(' ')} ${volume.join(' ')}`.trim();
}
