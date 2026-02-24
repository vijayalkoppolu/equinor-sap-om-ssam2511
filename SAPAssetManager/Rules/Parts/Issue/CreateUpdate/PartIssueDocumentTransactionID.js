import libPart from '../../PartLibrary';
import PartIssueDocumentLocalID from './PartIssueDocumentLocalID';

export default function PartIssueDocumentTransactionID(context) {
    const orderID = libPart.partMovementLineItemCreateUpdateSetODataValue(context, 'OrderNumber');
    if (orderID) {
        context.getClientData().LocalMatDocId = orderID;
        return orderID;
    }
    return PartIssueDocumentLocalID(context);
}
