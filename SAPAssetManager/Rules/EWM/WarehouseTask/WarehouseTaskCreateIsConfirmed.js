export default function WarehouseTaskCreateIsConfirmed(context) {
    const pageProxy = context.evaluateTargetPathForAPI('#Page:WHTaskCreatePage');
    const confirmvalue = pageProxy?.getControl('FormCellContainer').getControl('ConfirmTaskSwitch')?.getValue();
    return confirmvalue ? 'C' : '';
}
