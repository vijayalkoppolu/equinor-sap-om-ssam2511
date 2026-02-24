import libCom from '../../../Common/Library/CommonLibrary';
import SerialNumDisable from '../../../Inventory/SerialNumbers/SerialNumDisable';
/**
* This function calls the barcode scan action until as many serial numbers are scanned as per the quantity entered
* @param {IClientAPI} context
*/
export default function BarcodeScanSuccess(context) {
	const actionResult = context.getActionResult('BarcodeScanner');
	const sectionedTable = context.getPageProxy().getControl('SectionedTable');
	if (!actionResult) {
		return '';
	}
	const newSerialNumber = actionResult.data;
	const quantityPicker = sectionedTable.getControl('QuantitySimple');
	const quantityValue = quantityPicker.getValue();
	let serialMap = libCom.getStateVariable(context, 'SerialNumbers').actual;
	if (!newSerialNumber) {
		return context.executeAction({
			Name: '/SAPAssetManager/Actions/Inventory/IssueOrReceipt/ScanFailedMessage.action',
			Properties: {
				Message: '$(L, scan_failed)',
			},
		});
	}
	if (serialMap.find(item => item.SerialNumber === newSerialNumber)) {
		return context.executeAction({
			Name: '/SAPAssetManager/Actions/Inventory/IssueOrReceipt/ScanFailedMessage.action',
			Properties: {
				Message: '$(L, already_scanned)',
			},
		});
	} else {
		const serial = {
			SerialNumber: newSerialNumber,
			Date: new Date(),
			IsLocal: true,
			new: true,
			Selected: true,
		};
		serialMap.push(serial);
	}
	serialMap = serialMap.filter(item => item.Selected);
	const serialLength = serialMap?.length || 0;
	const totalCount = quantityValue - serialLength;
	const scanButton = sectionedTable.getControl('ScanButton');
	scanButton.setTitle(context.localizeText('scan_serial_number', [totalCount]));
	if (serialLength >= quantityValue) {
		SerialNumDisable(context, false);
		sectionedTable.redraw();
		const binding = {...(context.binding || {}), Temp_Serial_EntryQuantity: quantityValue, Temp_Serial_ScannedNum: serialLength};
		context.getPageProxy().setActionBinding(binding);
		return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/ScanSuccess.action');
	} else {
		SerialNumDisable(context, true);
		sectionedTable.redraw();
		return context.executeAction('/SAPAssetManager/Actions/EWM/PhysicalInventory/SerialNumberScan.action');
	}
}

