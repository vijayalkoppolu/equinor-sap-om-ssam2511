import libCommon from '../../Library/CommonLibrary';

export default function CategoryValueChanged(context, filteringProperty) {
    let pageProxy = context.getPageProxy();

    let templatePicker = libCommon.getControlProxy(pageProxy, 'TemplateLstPkr');
    templatePicker.setValue('');
    let templateSpecifier = templatePicker.getTargetSpecifier();
    let queryOptions = '';

    let categoryPickerValue = libCommon.getControlProxy(pageProxy, 'CategoryLstPkr').getValue();

    if (categoryPickerValue && Array.isArray(categoryPickerValue) && categoryPickerValue.length === 1) {
        queryOptions = `$filter=${filteringProperty} eq '${categoryPickerValue[0].ReturnValue}'`;
    } else {
        queryOptions = '$filter=1 eq 0';
    }

    templateSpecifier.setQueryOptions(queryOptions);
    templatePicker.setTargetSpecifier(templateSpecifier);
}
