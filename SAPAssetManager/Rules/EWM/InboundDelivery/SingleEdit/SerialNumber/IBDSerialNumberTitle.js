export default function IBDSerialNumberTitle(context) {
    return `${context.binding.SerialNumber}${context.binding.downloaded ? '' : ' - ' + context.localizeText('New')}`;
}
