
export default function TagNumberOrEmpty(context) {
    return context.binding && context.binding.Tag ? context.localizeText('tag_x', [context.binding.Tag]) : '';
}
