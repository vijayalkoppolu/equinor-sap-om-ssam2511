export default function SerialNumberTitle(context) {
    return context.binding.SerialNumber + (context.binding.downloaded ? '' : ' - ' + context.localizeText('New'));
}
