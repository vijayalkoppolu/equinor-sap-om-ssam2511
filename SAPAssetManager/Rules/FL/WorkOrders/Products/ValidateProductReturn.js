import libCom from '../../../Common/Library/CommonLibrary';
export default async function ValidateProductReturn(context) {
    const dict = libCom.getControlDictionaryFromPage(context);
    libCom.setInlineControlErrorVisibility(dict.StorageLocLstPkr, false);
    const valuated = await context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialValuations', [], "$filter=(Material eq '" + context.binding.Product + "' and ValuationArea eq '" + context.binding.Plant + "')").then((results) => {
        if (results && results.length > 0) {
            const item = results.getItem(0);
            if (item.ValuationCategory) {
                return Promise.resolve(true);
            }
        }
        return Promise.resolve(false);
    });

    if (context.binding.IsBatchManaged || context.binding.IsSerialNumberManaged || valuated) {
        libCom.executeInlineControlError(context, dict.StorageLocLstPkr, context.localizeText('fld_return_not_allowed'));
        return Promise.resolve(false);
    }
    dict.StorageLocLstPkr.clearValidation();
    return Promise.resolve(true);
}
