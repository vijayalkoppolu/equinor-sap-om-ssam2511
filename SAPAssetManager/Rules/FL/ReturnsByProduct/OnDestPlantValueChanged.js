
import libCom from '../../Common/Library/CommonLibrary';
export default function OnDestPlantValueChanged(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    const destStoreLocPkrControl = libCom.getControlProxy(pageProxy, 'DestStoreLocLstPkr');
    const specifier = destStoreLocPkrControl.getTargetSpecifier();
    let plantValue = clientAPI.getValue()[0] ? clientAPI.getValue()[0].ReturnValue : '';

    specifier.setQueryOptions(`$filter=Plant eq '${plantValue}'&$orderby=StorageLocation`);
    destStoreLocPkrControl.setTargetSpecifier(specifier);
    destStoreLocPkrControl.redraw();
}
