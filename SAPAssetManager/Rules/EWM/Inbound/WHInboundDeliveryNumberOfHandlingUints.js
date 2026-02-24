import libCommon from '../../Common/Library/CommonLibrary';

export default function WHInboundDeliveryNumberOfHandlingUints(context) {
    return libCommon.getEntitySetCount(context, 'HandlingUnitItems', `$filter=RefDocId eq '${context.binding.DocumentID}'`);
}
