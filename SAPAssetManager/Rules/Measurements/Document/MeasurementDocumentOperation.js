import libCom from '../../Common/Library/CommonLibrary';
export default function MeasurementDocumentOperation(context) {
	try {
		if (Object.prototype.hasOwnProperty.call(context.binding,'Point')) {
			return libCom.isDefined(context.getClientData().MeasuringPointData[context.binding.Point].Operation) ? context.getClientData().MeasuringPointData[context.binding.Point].Operation : '';
		} else {
			return libCom.isDefined(context.getClientData().MeasuringPointData[context.binding.MeasuringPoint.Point].Operation) ? context.getClientData().MeasuringPointData[context.binding.MeasuringPoint.Point].Operation : '';
		}
	} catch (exc) {
        if (context.binding.WOOperation_Nav && context.binding.WOOperation_Nav.ObjectKey) { //PRT from operations
            return context.binding.WOOperation_Nav.ObjectKey;
         } else if (context.binding.OperationObjectKey) {
            return context.binding.OperationObjectKey;
         } else {
            return '';
         }
	}
}
