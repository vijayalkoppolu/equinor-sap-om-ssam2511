import CommonLibrary from '../../../Common/Library/CommonLibrary';
export default function OnValueChangeExceptionCode(context) {

    let pageProxy = context.getPageProxy();
    let quantityField = CommonLibrary.getControlProxy(pageProxy, 'WhQuantitySimple');
    let destinationBinField = CommonLibrary.getControlProxy(pageProxy, 'WhDestinationBinSimple');

    quantityField.reset().then(() => {
        return destinationBinField.reset();
      }).then(() => {
        return pageProxy.redraw();
      });
}
