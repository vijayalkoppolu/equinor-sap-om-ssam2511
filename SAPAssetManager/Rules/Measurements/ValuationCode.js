import libForm from '../Common/Library/FormatLibrary';
import Logger from '../Log/Logger';

export default async function ValuationCode(context) {
    const binding = context.binding;

    if (binding.ValuationCode && binding.CodeShortText) {
        return libForm.getFormattedKeyDescriptionPair(context, binding.ValuationCode, binding.CodeShortText);
    } else if (binding.ValuationCode) {
        let link = encodeURIComponent(`PMCatalogCodes(Catalog='${binding.MeasuringPoint?.CatalogType}',CodeGroup='${binding.MeasuringPoint?.CodeGroup}',Code='${binding.ValuationCode}')`);
        return await context.read('/SAPAssetManager/Services/AssetManager.service', link, [], '$select=CodeDescription')
            .then(result => {  
                let description;
                if (result.length) {
                    description = result.getItem(0).CodeDescription;
                }

                return libForm.getFormattedKeyDescriptionPair(context, binding.ValuationCode, description);
            })
            .catch(error => {
                Logger.error('ValuationCode', error);
                return libForm.getFormattedKeyDescriptionPair(context, binding.ValuationCode, ''); 
            });
    } else {
        return '-';
    }
}
