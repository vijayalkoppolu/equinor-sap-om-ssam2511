/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import libCom from '../../../Common/Library/CommonLibrary';
export default function OnStorageLocationValueChange(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    const batchPkrControl = libCom.getControlProxy(pageProxy, 'BatchLstPkr');
    const specifier = batchPkrControl.getTargetSpecifier();
    let objectValue = libCom.getControlValue(libCom.getControlProxy(pageProxy, 'StorageLocLstPkr'));

    specifier.setQueryOptions(`$filter=MaterialNum eq '${clientAPI.binding.Product}' and Plant eq '${clientAPI.binding.Plant}' and StorageLocation eq '${objectValue}'&$orderby=MaterialNum`);
    batchPkrControl.setTargetSpecifier(specifier);
    batchPkrControl.redraw();
}
