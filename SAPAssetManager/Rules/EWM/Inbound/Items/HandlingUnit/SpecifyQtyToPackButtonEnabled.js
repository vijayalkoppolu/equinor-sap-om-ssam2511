export default function SpecifyQtyToPackButtonEnabled(context) {
    const formCellContainer = context.getPageProxy().getControl('FormCellContainer');

    return formCellContainer?.getControl('NumberOfHUs')?.getValue() > 1 || false;
}
