import ValidationLibrary from '../../Common/Library/ValidationLibrary';

export default function MeasuringPointHistoryListViewPageMetadata(context) {
    let page = context.getPageDefinition('/SAPAssetManager/Pages/Measurements/MeasuringPointHistoryListView.page');

    const binding = context.binding;
    const sectionedTable = page.Controls[0];
    let columns = sectionedTable.Sections[0].Header.DataTable.Items;
    let rows = sectionedTable.Sections[0].Row.Items;

    if (ValidationLibrary.evalIsNotEmpty(binding.CodeGroup)) { // add valuation code column and row
        columns.splice(2, 0, {
            'Text': '$(L, valuation_code)',
            'Style': 'GridTableHeaderText',
            'TextAlignment': 'Center',
        });
        rows.splice(2, 0, {
            'Text': '/SAPAssetManager/Rules/Measurements/ValuationCode.js',
            'Style': 'GridTableRowText',
            'TextAlignment': 'Center',
        });
    }

    if (binding.IsCounter === 'X') { // add total reading column and row
        columns.splice(2, 0, {
            'Text': '$(L,total_difference)',
            'Style': 'GridTableHeaderText',
            'TextAlignment': 'Center',
        });
        rows.splice(2, 0, {
            'Text': '/SAPAssetManager/Rules/Measurements/Points/MeasuringPointTotalAndReadingDifference.js',
            'Style': 'GridTableRowText',
            'TextAlignment': 'Center',
        });
    }

    if (binding.IsOnline) {
        sectionedTable.Sections[0].Target = {
            'EntitySet': 'MeasurementDocuments',
            'QueryOptions': '/SAPAssetManager/Rules/Measurements/Document/OnlineMeasurementDocsQueryOptions.js',
            'Service': '/SAPAssetManager/Services/OnlineAssetManager.service',
        };
    }

    return page;
}
