import { SplitReadLink } from '../../Common/Library/ReadLinkUtils';
import SetMaterialUoM from './SetMaterialUoM';

export default function MaterialLstPkrOnValueChange(context) { 

    //Set Storage Bin display
    let binNumberCell = context.getPageProxy().evaluateTargetPathForAPI('#Control:BinNumberSim');
    if (binNumberCell && context.getValue().length > 0) {
        let returnValue = context.getValue()[0].ReturnValue;
        let readLinkData = SplitReadLink(returnValue);

        if (readLinkData && readLinkData.MaterialNum && readLinkData.Plant && readLinkData.StorageLocation) {
            binNumberCell.setValue(context.read(
                '/SAPAssetManager/Services/AssetManager.service',
                'MaterialSLocs',
                [],
                "$select=StorageBin&$filter=MaterialNum eq '" + readLinkData.MaterialNum + "' and Plant eq '" + readLinkData.Plant + "' and StorageLocation eq '" + readLinkData.StorageLocation + "'").then(result => {
                    if (result && result.length > 0) {
                        // Grab the first row (should only ever be one row) and return StorageBin
                        return result.getItem(0).StorageBin;
                    } else {
                        return '-';
                    }
                }));
        } else {
            binNumberCell.setValue('');
        }
    } else if (binNumberCell) {
        binNumberCell.setValue('');
    }

    SetMaterialUoM(context);

}
