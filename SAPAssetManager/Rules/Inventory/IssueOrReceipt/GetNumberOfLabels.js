import libCom from '../../Common/Library/CommonLibrary';

export default function GetNumberOfLabels(context) {

    if (context.binding) {
        const objectType = libCom.getStateVariable(context, 'IMObjectType');
        const type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        if ((type === 'MaterialDocItem') && (['REV', 'ADHOC'].includes(objectType))) {
            //replacing 000 by removing leading zeroes
            return context.binding.NumOfLabels.replace(/^0+/, '');
        }
    }
    return '';
}
