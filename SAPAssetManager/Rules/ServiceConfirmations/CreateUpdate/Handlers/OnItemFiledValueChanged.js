import IsServiceItem from '../../../ServiceItems/CreateUpdate/IsServiceItem';

export default async function OnItemFiledValueChanged(control) {
    const pageProxy = control.getPageProxy();
    const value = control.getValue();
    let selectedBindingObject;

    if (value?.length) {
        selectedBindingObject = value[0].BindingObject;
    }

    const description = selectedBindingObject?.ItemDesc || '';
    const productId = selectedBindingObject?.ProductID || '';
    const quantityUOM = selectedBindingObject?.QuantityUOM || '';
    const quantity = selectedBindingObject?.Quantity || '';

    const formCellContainer = pageProxy.getControl('FormCellContainer');
    formCellContainer.getControl('DescriptionNote').setValue(description);
    formCellContainer.getControl('ProductIdProperty').setValue(productId);
    formCellContainer.getControl('UomSimple').setValue(quantityUOM);
    formCellContainer.getControl('QuantitySimple').setValue(quantity);

    if (selectedBindingObject) {
        const isServiceItem = await IsServiceItem(pageProxy, selectedBindingObject);
        updateServiceItemFields(selectedBindingObject, formCellContainer, isServiceItem);
        updateNonServiceItemFields(selectedBindingObject, formCellContainer, isServiceItem);

        pageProxy.binding.ProductID = productId;
        formCellContainer.getControl('ItemCategoryLstPkr').reset();
    } else {
        formCellContainer.getControl('ItemCategoryLstPkr').setValue('');
    }
}

function updateServiceItemFields(selectedBindingObject, formCellContainer, isServiceItem) {
    const requestedStart = selectedBindingObject?.RequestedStart || '';
    const durationUOM = selectedBindingObject?.DurationUOM || '';
    const duration = selectedBindingObject?.Duration || '';
    const serviceType = selectedBindingObject?.ServiceType || '';
    const valuationType = selectedBindingObject?.ValuationType || '';

    formCellContainer.getControl('StartDatePkr').setVisible(isServiceItem);
    formCellContainer.getControl('StartTimePkr').setVisible(isServiceItem);
    formCellContainer.getControl('TimeUnitLstPkr').setVisible(isServiceItem);
    formCellContainer.getControl('PlannedDurationSimple').setVisible(isServiceItem);
    formCellContainer.getControl('ServiceTypeLstPkr').setVisible(isServiceItem);
    formCellContainer.getControl('ValuationTypeLstPkr').setVisible(isServiceItem);

    if (isServiceItem) {
        formCellContainer.getControl('StartDatePkr').setValue(requestedStart);
        formCellContainer.getControl('StartTimePkr').setValue(requestedStart);
        formCellContainer.getControl('TimeUnitLstPkr').setValue(durationUOM);
        formCellContainer.getControl('PlannedDurationSimple').setValue(duration);
        formCellContainer.getControl('ServiceTypeLstPkr').setValue(serviceType);
        formCellContainer.getControl('ValuationTypeLstPkr').setValue(valuationType);
    } else {
        formCellContainer.getControl('StartDatePkr').setValue('');
        formCellContainer.getControl('StartTimePkr').setValue('');
        formCellContainer.getControl('TimeUnitLstPkr').setValue('');
        formCellContainer.getControl('PlannedDurationSimple').setValue('');
        formCellContainer.getControl('ServiceTypeLstPkr').setValue('');
        formCellContainer.getControl('ValuationTypeLstPkr').setValue('');
    }
}

function updateNonServiceItemFields(selectedBindingObject, formCellContainer, isServiceItem) {
    const netValue = selectedBindingObject?.NetValue || '';
    const currency = selectedBindingObject?.Currency || '';

    formCellContainer.getControl('CurrencyLstPkr').setVisible(!isServiceItem);
    formCellContainer.getControl('AmountProperty').setVisible(!isServiceItem);

    if (isServiceItem) {
        formCellContainer.getControl('CurrencyLstPkr').setValue('');
        formCellContainer.getControl('AmountProperty').setValue('');
    } else {
        formCellContainer.getControl('CurrencyLstPkr').setValue(currency);
        formCellContainer.getControl('AmountProperty').setValue(netValue);
    }
}
