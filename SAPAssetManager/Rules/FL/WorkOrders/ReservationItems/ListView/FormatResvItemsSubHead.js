
export default function FormatResvItemsSubHead(context) {
   
if (context.binding.Operation && context.binding.Plant ) {
    return `${Number(context.binding.Operation)} - ${context.binding.Plant}`;

} else if (context.binding.Operation !== '') {
    return `${Number(context.binding.Operation)}`;
} else if (context.binding.Plant !== '') {
    return `${context.binding.Plant}`;
} else 
    return '';
}

