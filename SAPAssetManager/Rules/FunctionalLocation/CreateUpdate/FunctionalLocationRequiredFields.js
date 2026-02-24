import libCommon from '../../Common/Library/CommonLibrary';
import DocumentFieldsAddRequired from '../../Documents/Create/DocumentFieldsAddRequired';
import ODataLibrary from '../../OData/ODataLibrary';

export default function FunctionalLocationRequiredFields(context) {
    let requiredFields = [
        'DescriptionNote',
        'IdProperty',
    ];

    if (libCommon.IsOnCreate(context)) {
        requiredFields.push('CreateFromLstPkr');
        requiredFields.push('StrcutureIndLstPkr');
    } else if (ODataLibrary.isLocal(context.binding)) {
        requiredFields.push('StrcutureIndLstPkr');
    }

    if (libCommon.IsOnCreate(context) ||ODataLibrary.isLocal(context.binding)) {
        const createFrom = libCommon.getControlValue(libCommon.getControlProxy(context, 'CreateFromLstPkr'));
        const reference = libCommon.getControlValue(libCommon.getControlProxy(context, 'ReferenceLstPkr'));
        const template = libCommon.getControlValue(libCommon.getControlProxy(context, 'TemplateLstPkr'));
        const templateVisible = libCommon.getControlProxy(context, 'TemplateLstPkr').getVisible();
        if (createFrom === 'PREVIOUSLY_CREATED' && !reference) {
            requiredFields.push('ReferenceLstPkr');
        } else if (createFrom === 'TEMPLATE' && !template && templateVisible) {
            requiredFields.push('TemplateLstPkr');
        } else {
            requiredFields.push('CategoryLstPkr');
        }
    }

    DocumentFieldsAddRequired(context, requiredFields);

    return requiredFields;
}
