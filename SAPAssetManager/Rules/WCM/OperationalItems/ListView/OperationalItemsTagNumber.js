import { ValueIfExists } from '../../../Common/Library/Formatter';

export default async function OperationalItemsTagNumber(context) {
    return `${context.localizeText('tag_x', [ValueIfExists(context.binding.Tag)])}`;
}
