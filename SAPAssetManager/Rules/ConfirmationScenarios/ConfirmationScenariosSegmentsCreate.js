import CooperationIsEnabledForWorkOrder from './CooperationIsEnabledForWorkOrder';
import DoubleCheckIsEnabledForWorkOrder from './DoubleCheckIsEnabledForWorkOrder';
import ConfirmationScenariosFeatureIsEnabled from './ConfirmationScenariosFeatureIsEnabled';  

/**
* Returns list of confirmation cooperation segment buttons
* @param {IClientAPI} context MDK context
*/
export default async function ConfirmationScenariosSegmentsCreate(context) {
    let segments = [];

    if (ConfirmationScenariosFeatureIsEnabled(context)) { //Do not build segments if feature is disabled
        segments.push({
            'DisplayValue': context.localizeText('scenario_none'),
            'ReturnValue': 'None',
        });

        if (await CooperationIsEnabledForWorkOrder(context)) {
            segments.push({
                'DisplayValue': context.localizeText('scenario_support'),
                'ReturnValue': 'Support',
            });
        }

        if (await DoubleCheckIsEnabledForWorkOrder(context)) {
            segments.push({
                'DisplayValue': context.localizeText('scenario_double_check'),
                'ReturnValue': 'DoubleCheck',
            });
        }  
    }
   
    return segments;
}
