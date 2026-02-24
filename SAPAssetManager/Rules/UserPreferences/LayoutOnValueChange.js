import { LayoutStyleValues } from './PersonalizationPreferences';
/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function LayoutOnValueChange(context) {
    let selectedSegment = context.getValue()[0];
    if (selectedSegment.ReturnValue === LayoutStyleValues.Tab) {
        // tabs
        context.getPageProxy().evaluateTargetPath('#Control:tabs').setVisible(true, true);
        context.getPageProxy().evaluateTargetPath('#Control:kpi').setVisible(true, true);
    } else {
        context.getPageProxy().evaluateTargetPath('#Control:tabs').setVisible(false, true);
        context.getPageProxy().evaluateTargetPath('#Control:kpi').setVisible(false, true);
    }
}
