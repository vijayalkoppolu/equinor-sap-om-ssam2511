export default function FormInstanceCreateMandatory(context) {
    const pageProxy = context.getPageProxy();
    const formCellContainer = pageProxy.getControl('FormCellContainer');
    const mandatorySwitch = formCellContainer.getControl('MandatorySwitch');
    return mandatorySwitch.getValue() ? 'X' : '';
}
