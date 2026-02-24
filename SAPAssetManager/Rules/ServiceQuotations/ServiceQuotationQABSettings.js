import IsAnyNoteTypeAvailable from '../Notes/Create/IsAnyNoteTypeAvailable';
import QABSettings from '../QAB/QABSettings';
import IsAddS4RelatedObjectEnabled from '../ServiceOrders/IsAddS4RelatedObjectEnabled';
import IsS4ServiceQuotationCreateEnabled from './IsS4ServiceQuotationCreateEnabled';

export default class ServiceQuotationQABSettings extends QABSettings {
    async generateChips() {
        const chips = [
            this._createS4ErrorsChip(),
            this._createChip({
                'Label': this._context.localizeText('add_quotation_item'),
                'IsButtonEnabled': IsS4ServiceQuotationCreateEnabled(this._context),
                'Icon': '$(PLT,/SAPAssetManager/Images/QABAddItem.png,/SAPAssetManager/Images/QABAddItem.android.png)',
                'Action': '/SAPAssetManager/Rules/ServiceQuotations/Items/CreateUpdate/CreateServiceQuotationItemNav.js',
                '_Name': 'ADD_ITEM',
            }),
            this._createAddNoteChip({
                'IsButtonEnabled': IsAddS4RelatedObjectEnabled(this._context) && await IsAnyNoteTypeAvailable(this._context),
            }),
            this._createChip({
                'Label': this._context.localizeText('add_attachment'),
                'Icon': '$(PLT,/SAPAssetManager/Images/QABAddAttachment.ios.png,/SAPAssetManager/Images/QABAddAttachment.android.png)',
                'IsButtonEnabled': IsAddS4RelatedObjectEnabled(this._context),
                'Action': '',
                '_Name': 'ADD_ATTACHMENT',
            }),
            this._createRefObjectsChip(),
            this._createBusinessPartnersChip(),
        ];

        return super.generateChips(chips);
    }
}
