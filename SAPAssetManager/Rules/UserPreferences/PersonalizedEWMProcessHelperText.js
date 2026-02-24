import PersonalizedEWMProcessIsEditable from './PersonalizedEWMProcessIsEditable';

export default function PersonalizedEWMProcessHelperText(context) {
    return PersonalizedEWMProcessIsEditable(context) ? '' : context.localizeText('process_switch_disabled_helper_text');
}
