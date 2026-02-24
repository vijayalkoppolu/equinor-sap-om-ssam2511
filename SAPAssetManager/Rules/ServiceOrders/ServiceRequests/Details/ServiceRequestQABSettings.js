import IsAnyNoteTypeAvailable from '../../../Notes/Create/IsAnyNoteTypeAvailable';
import QABSettings from '../../../QAB/QABSettings';
import IsServiceRequestIsNotCompleted from './IsServiceRequestIsNotCompleted';
import IsServiceRequestIsNotCompletedAndCreateEnabled from './IsServiceRequestIsNotCompletedAndCreateEnabled';

export default class ServiceRequestQABSettings extends QABSettings {
    async generateChips() {
        const chips = [
            this._createAddServiceOrderChip({
                'Label': this._context.localizeText('add_service_order'),
            }),
            await this._createDownloadDocumentsChip(),
            this._createAddNoteChip({
                'IsButtonEnabled': await IsServiceRequestIsNotCompletedAndCreateEnabled(this._context) && await IsAnyNoteTypeAvailable(this._context),
                'IsButtonVisibleBySettings': false,
            }),
            this._createAddReminderChip({
                'IsButtonEnabled': await IsServiceRequestIsNotCompleted(this._context),
                'IsButtonVisibleBySettings': false,
            }),
            this._createAddAttachmentChip({
                'IsButtonEnabled': await IsServiceRequestIsNotCompletedAndCreateEnabled(this._context),
            }),
            this._createBusinessPartnersChip(),
        ];

        return super.generateChips(chips);
    }
}
