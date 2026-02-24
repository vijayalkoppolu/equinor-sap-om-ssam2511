/**
 *  Returns the selected items from the multi-select control for Exception Codes
 * @returns 
 */
export default function SetMultiExceptionCodesProperty(context) {
    const codes =[]; 
    context.getPageProxy().getControls()[0]._control.controls.find(x => { 
        return x.name === 'ExceptionPicker';
    }).getValue().forEach(element => codes.push(element.ReturnValue)); 
    return codes.join();
}
