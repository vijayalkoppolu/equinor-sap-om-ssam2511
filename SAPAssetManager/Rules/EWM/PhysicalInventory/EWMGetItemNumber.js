export default function EWMGetItemNumber(context) {
    return context.binding?.ITEM_NO?.slice(3) || '-';  //Cut the first 3 digits for display
}
