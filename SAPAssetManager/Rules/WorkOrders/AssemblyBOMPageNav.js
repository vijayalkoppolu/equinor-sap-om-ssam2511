import Logger from '../Log/Logger';
import TelemetryLibrary from '../Extensions/EventLoggers/Telemetry/TelemetryLibrary';

export default function AssemblyBOMPageNav(context) {
    let assembly = context?.binding?.Assembly ? context?.binding?.Assembly : context.getPageProxy()?.binding?.Assembly || '';
    let filterQuery = `$expand=MaterialBOM_Nav&$filter=MaterialNum eq '${assembly}'`;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'Materials', [], filterQuery).then(function(result) {
       if (result && result.length > 0) {
           let binding = result.getItem(0);
           return context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialBOMs', [], `$expand=BOMHeader_Nav/BOMItems_Nav&$filter=MaterialNum eq '${assembly}'`).then(function(results) {
               binding.HC_ROOT_CHILDCOUNT = 0;
               if (results && results.length > 0) {
                    const bomHeaderNav = results.getItem(0).BOMHeader_Nav;
                    const bomItemsNav = bomHeaderNav && bomHeaderNav.BOMItems_Nav;

                    if (bomItemsNav) {
                        binding.HC_ROOT_CHILDCOUNT = bomItemsNav.length;
                    }
               }
               context.getPageProxy().setActionBinding(binding);
               return TelemetryLibrary.executeActionWithLogPageEvent(context,
                    '/SAPAssetManager/Actions/WorkOrders/AssemblyListViewNav.action',
                    context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Assembly.global').getValue(),
                    TelemetryLibrary.PAGE_TYPE_HIERARCHY);
           }).catch(function(err) {
               Logger.error(`Failed to get BOMItems count : ${err}`);
           });
       }
       return true;
    });
}
