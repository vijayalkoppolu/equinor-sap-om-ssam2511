import libCom from '../../Common/Library/CommonLibrary';
import ResetValidationOnInput from '../../Common/Validation/ResetValidationOnInput';

/**
 * Handles the value change event for the Movement Type control.
 * Resets validation and updates captions for Receiving Plant and Storage Location fields,
 * adding an asterisk if Movement Type is defined (indicating required fields).
 *
 * @param {IClientAPI} control
 */
export default function MovementTypeOnValueChange(control) {
    ResetValidationOnInput(control);
    const formCellContainer = control.getPageProxy().getControl('FormCellContainer');
    const movementTypeDefined = libCom.isDefined(formCellContainer.getControl('MovementTypeLstPkr').getValue());
    [
        { control: formCellContainer.getControl('ReceivingPlantLstPkr'), label: 'receiving_plant' },
        { control: formCellContainer.getControl('StorageLocationLstPkr'), label: 'storage_location' },
    ].forEach(({ control: fieldControl, label }) => {
        const caption = control.localizeText(label) + (movementTypeDefined ? '*' : '');
        fieldControl.setCaption(caption);
    });
}
