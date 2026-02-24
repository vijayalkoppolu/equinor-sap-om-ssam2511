import inspCharLib from './InspectionCharacteristics';
import libVal from '../../Common/Library/ValidationLibrary';
import { SortInspectionCodesPickerItems } from '../InspectionCodesSortedPickerItems';
import ODataLibrary from '../../OData/ODataLibrary';

/**
* Describe this function...
* @param {IContext} context
*/
export default async function InspectionCharacteristicsQuantitativeAndQualitativeEDTControls(context) {
    let binding = context.binding;
    let isMandatory = !!(binding.CharCategory && binding.CharCategory === 'X');
    let IsReadOnly = false;
    let NoCharRecordingFlag = !!(binding.NoCharRecordingFlag && binding.NoCharRecordingFlag === 'X');
    if (inspCharLib.isQuantitative(binding)) {
        IsReadOnly = checkAcceptance(binding);
        if (String(binding.ResultValue) === '0' && !ODataLibrary.hasAnyPendingChanges(binding)) {
            return {
                'Type': 'Number',
                'Name': 'Quantitive',
                'IsMandatory': isMandatory,
                'IsReadOnly': IsReadOnly || NoCharRecordingFlag,
                'OnValueChange': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsQuantitativeOnValueChangeEDT.js',
                'Property': 'ResultValue',
                'Parameters': {},
            };
        }
        return {
            'Type': 'Number',
            'Name': 'Quantitive',
            'IsMandatory': isMandatory,
            'IsReadOnly': IsReadOnly || NoCharRecordingFlag,
            'OnValueChange': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsQuantitativeOnValueChangeEDT.js',
            'Property': 'ResultValue',
            'Parameters': {
                'Value': binding.ResultValue,
            },
        };

    } else if (inspCharLib.isCalculatedAndQuantitative(binding)) {
        if (String(binding.ResultValue) === '0' && !ODataLibrary.hasAnyPendingChanges(binding)) {
            let formula = binding.Formula1;
            if (binding.Formula2) {
                formula += binding.Formula2;
            }
            return {
                Type: 'Text',
                'Name': 'Calculate',
                IsMandatory: false,
                IsReadOnly: true,
                Property: 'ResultValue',
                Parameters: {
                    'Value': formula,
                },
            };
        }
        let formattedValue = inspCharLib.formatCalculatedValueByLocale(context, binding.ResultValue, binding.DecimalPlaces);
        return {
            Type: 'Text',
            'Name': 'Calculate',
            IsMandatory: false,
            IsReadOnly: true,
            Property: 'ResultValue',
            Parameters: {
                'Value': formattedValue,
            },
        };
    } else if (inspCharLib.isQualitative(binding)) {
        let listPickerValue = '';
        let listPickerDisplayValue = '';
        if (!libVal.evalIsEmpty(binding.InspectionCode_Nav) && !libVal.evalIsEmpty(binding.InspectionCode_Nav.CodeDesc)) {
            listPickerValue = `InspectionCodes(Plant='${binding.SelectedSetPlant}',SelectedSet='${encodeURIComponent(binding.SelectedSet)}',Catalog='${binding.Catalog}',CodeGroup='${encodeURIComponent(binding.CodeGroup)}',Code='${binding.Code}')`;
            listPickerDisplayValue = binding.InspectionCode_Nav.CodeDesc;
            isMandatory = true;
        }
        const maxSegments = 3;
        let queryOption = '$orderby=Code asc&$filter=(SelectedSet eq \'' + binding.SelectedSet + '\' and Plant eq \'' + binding.SelectedSetPlant + '\' and Catalog eq \'' + binding.Catalog + '\')';
        let items = await context.read('/SAPAssetManager/Services/AssetManager.service','InspectionCodes', [], queryOption);

        const segments = SortInspectionCodesPickerItems(items);

        if (items && items.length <= maxSegments) {
            // use segmented control
            return {
                'Type': 'SegmentedControl',
                'Name': 'Qualitative',
                'IsMandatory': isMandatory,
                'IsReadOnly': IsReadOnly || NoCharRecordingFlag,
                'Property': 'Code',
                'OnValueChange': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsQualitativeOnChangeEDT.js',
                'Parameters': {
                    'Segments': segments,
                    'Value': listPickerValue,
                },
            };
        } else {
            // use list picker
            return {
                'Type': 'ListPicker',
                'Name': 'Qualitative',
                'IsMandatory': isMandatory,
                'IsReadOnly': IsReadOnly || NoCharRecordingFlag,
                'OnValueChange': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsQualitativeOnChangeEDT.js',
                'Property': 'Code',
                'Parameters': {
                    'Search': {
                        'Enabled': true,
                        'Delay': 500,
                        'MinimumCharacterThreshold': 3,
                        'Placeholder': context.localizeText('search'),
                        'BarcodeScanner': true,
                    },
                    'Caption': context.localizeText('value'),
                    'DisplayValue': listPickerDisplayValue,
                    'Value': listPickerValue,
                    'PickerItems': segments,
                },
             };
        }
    }
    return {
        Type: 'Text',
        'Name': 'PlaceHolder',
        IsMandatory: false,
        IsReadOnly: false,
        OnValueChange: '',
        Property: 'Status',
        Parameters: {
            Value: 'Test',
        },
    };
}

function checkAcceptance(binding) {
    return inspCharLib.isCalculatedAndQuantitative(binding) || binding.AfterAcceptance === 'X' || binding.AfterRejection === 'X';
}
