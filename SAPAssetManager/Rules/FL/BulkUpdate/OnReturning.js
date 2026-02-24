/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function OnReturning(context) {
    return context.getControl('SectionedTable').redraw();
}
