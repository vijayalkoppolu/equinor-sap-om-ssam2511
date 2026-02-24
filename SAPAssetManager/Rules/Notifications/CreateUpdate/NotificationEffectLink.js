import libCom from '../../Common/Library/CommonLibrary';

export default function NotificationEffectLink(context) {
    let effectValue = libCom.getListPickerValue(libCom.getTargetPathValue(context, '#Control:EffectListPicker/#Value'));
    let breakdown = libCom.getTargetPathValue(context, '#Control:BreakdownSwitch/#Value');
    let links = [];

    if (breakdown && effectValue) {
        links.push({
            'Property': 'Effect_Nav',
            'Target':
            {
                'EntitySet': 'Effects',
                'ReadLink': `Effects('${effectValue}')`,
            },
        });
    }

    return links;
}
