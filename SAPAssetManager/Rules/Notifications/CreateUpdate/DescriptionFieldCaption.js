/**
* Add '*' symbol for FSM CS
* @param {IClientAPI} context
*/
export default function DescriptionFieldCaption(context) {
    return `${context.localizeText('notification_description')}*`;
}
