import scannerLibrary from '../Extensions/Scanner/ScannerLibrary';
import edtSoftInputModeConfig from '../Extensions/EDT/EDTSoftInputModeConfig';
import libCom from '../Common/Library/CommonLibrary';

export default async function ScanAllButtonOnPress(context) {
    try {
        const results = await scannerLibrary.triggerMultiScan();
        const [inPartsList, outPartsList] = await parseScanResult(context, results);
        libCom.setStateVariable(context, 'InPartsList', inPartsList);
        libCom.setStateVariable(context, 'OutPartsList', outPartsList);
        libCom.setStateVariable(context, 'IgnoredItemNumberList', []);
        context.getPageProxy().setActionBinding(context.binding);
        edtSoftInputModeConfig(context);
        return context.executeAction('/SAPAssetManager/Actions/Parts/PartsIssueEDTNav.action');
    } catch (error) {
        return context.executeAction('/SAPAssetManager/Actions/Extensions/BarcodeScannerNav.action');
    }
}

async function parseScanResult(context, scanResult) {
    const components = await context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderComponents', [],
        `$filter=OrderId eq '${context.binding.OrderId}'&$expand=Material,MaterialBatch_Nav`);

    if (components && components.length > 0) {
        const inPartsListSet = new Set();
        const outPartsListSet = new Set();

        scanResult.forEach(data => {
            outPartsListSet.add(data);
        });

        for (let component of components._array) {
            if (outPartsListSet.has(component.MaterialNum)) { 
                outPartsListSet.delete(component.MaterialNum);
                inPartsListSet.add(component.MaterialNum);
            }
        }

        return [Array.from(inPartsListSet), Array.from(outPartsListSet)];
    }

    return Promise.resolve();
}
