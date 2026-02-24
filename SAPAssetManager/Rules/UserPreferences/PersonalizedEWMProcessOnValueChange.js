import { ProcessesPersonalizationMapping } from '../EWM/Common/EWMLibrary';

export default async function PersonalizedEWMProcessOnValueChange(context) {
    const fcContainer = context.getPageProxy().getControls()[0];

    const [enabledProcessesControls, disabledProcessesControls] = Object.keys(ProcessesPersonalizationMapping).reduce((acc, key) => {
        const control = fcContainer.getControl(key);

        acc[control.getValue() ? 0 : 1].push(control);

        return acc;
    }, [[], []]);

    enabledProcessesControls.forEach(control => {
        const isOnlyOneSelected = enabledProcessesControls.length === 1;
        control.setEditable(!isOnlyOneSelected);
        control.setHelperText(isOnlyOneSelected ? context.localizeText('process_switch_disabled_helper_text') : '');
    });

    disabledProcessesControls.forEach(control => {
        control.setEditable(true);
        control.setHelperText('');
    });
}
