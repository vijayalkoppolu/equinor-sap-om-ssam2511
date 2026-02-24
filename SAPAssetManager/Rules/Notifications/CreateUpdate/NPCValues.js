import Logger from '../../Log/Logger';
import IsMinorWorkEnabled from '../../WorkOrders/IsMinorWorkEnabled';
import IsEmergencyWorkEnabled from '../../WorkOrders/IsEmergencyWorkEnabled';

export default function NPCValues(context) {
	return context.read('/SAPAssetManager/Services/AssetManager.service', 'NotificationProcessingContexts', [], '').then(values => {
		let retValues = [{ 'DisplayValue': context.localizeText('regular_work'), 'ReturnValue': '00' }];

		values.forEach(value => { //Restrict minor and emergency work based on feature flags
			if (value.ProcessingContext === '02' && IsMinorWorkEnabled(context)) {
				retValues.push({ 'DisplayValue': value.Description, 'ReturnValue': value.ProcessingContext });
			}
			if (value.ProcessingContext === '01' && IsEmergencyWorkEnabled(context)) {
				retValues.push({ 'DisplayValue': value.Description, 'ReturnValue': value.ProcessingContext });
			}
		});

		return retValues;
	}).catch((err) => {
		Logger.error('NPCValues', err);
		return [{ 'DisplayValue': context.localizeText('regular_work'), 'ReturnValue': '00' }];
	});
}
