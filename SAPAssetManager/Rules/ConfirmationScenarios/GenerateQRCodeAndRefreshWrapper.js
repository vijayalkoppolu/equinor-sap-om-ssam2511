import libConfirm from './ConfirmationScenariosLibrary';

/**
* Generate the current dynamic QR Code for this user and update the screen image with that data
* @param {IClientAPI} context
*/
export default async function GenerateQRCodeAndRefreshWrapper(context) {
	return await libConfirm.generateQRCodeAndRefresh(context); //Generate the current dynamic QR Code
}
