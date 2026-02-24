import Logger from '../../Log/Logger';
import isPartnerPickerVisible from './PartnerPickerVisible';

export default async function PartnerValue(context) {
	let partnerValue = '';

	const controlName = context.getName();
	const pageProxy = context.getPageProxy();
	const binding = context.getPageProxy().binding;

	const isVisible = await isPartnerPickerVisible(context);
	if (isVisible && binding['@odata.readLink']) {
		const itemIndex = controlName === 'PartnerPicker1' ? 0 : 1;
		const businessPartner = await readPartner(pageProxy, binding['@odata.readLink'], itemIndex);

		if (businessPartner) {
			if (controlName === 'PartnerPicker1') {
				pageProxy.getClientData().OldPartner1 = businessPartner.PartnerNum;
			} else if (controlName === 'PartnerPicker2') {
				pageProxy.getClientData().OldPartner2 = businessPartner.PartnerNum;
			}

			partnerValue = businessPartner.PartnerNum;

			if (!!businessPartner.NewPartner && partnerValue !== businessPartner.NewPartner) {
				partnerValue = businessPartner.NewPartner;
			}
		}	
	}
		
	return partnerValue;
}

function readPartner(context, readLink, itemIndex = 0) {
	return context.read('/SAPAssetManager/Services/AssetManager.service', `${readLink}/Partners`, [], '$orderby=PartnerFunction&$expand=PartnerFunction_Nav')
		.then(result => {
			return result.length ? result.getItem(itemIndex) : null;
		})
		.catch(error => {
			Logger.error('readPartner', error);
			return null;
		});	
}
