import IsAnyNoteTypeAvailable from '../../Notes/Create/IsAnyNoteTypeAvailable';
import QABSettings from '../../QAB/QABSettings';
import AddConfirmationToServiceItemEnabled from '../../ServiceOrders/ServiceItems/AddConfirmationToServiceItemEnabled';
import IsS4ConfirmationItemIsNotCompletedAndCreateEnabled from './IsS4ConfirmationItemIsNotCompletedAndCreateEnabled';

export default class ConfirmationItemQABSettings extends QABSettings {
    async generateChips() {
        return super.generateChips([
            this._createAddServiceConfirmationChip({
            'Label': this._context.localizeText('confirm_item'),
            'IsButtonEnabled': await AddConfirmationToServiceItemEnabled(this._context, this._context.binding.S4ServiceConfirmation_Nav),
        }),
        this._createAddNoteChip({ 
            'IsButtonVisibleBySettings': false,
            'IsButtonEnabled': await IsS4ConfirmationItemIsNotCompletedAndCreateEnabled(this._context) && await IsAnyNoteTypeAvailable(this._context),
        }),
        this._createAddReminderChip({ 'IsButtonVisibleBySettings': false }),
    ]);
    }
}
