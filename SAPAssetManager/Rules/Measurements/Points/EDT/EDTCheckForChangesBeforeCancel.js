import ResetFlagsAndClosePage from '../../../Common/ChangeSet/ResetFlagsAndClosePage';
import CommonLibrary from '../../../Common/Library/CommonLibrary';
import Logger from '../../../Log/Logger';
import EDTHelper from './MeasuringPointsEDTHelper';

export default function EDTCheckForChangesBeforeCancel(context) {
    const cachedSectionsBindings = CommonLibrary.getStateVariable(context, 'EDTSectionBindings');

    let cachedDocs = [];
    cachedSectionsBindings.forEach(section => {
        section.forEach(row => {
            let docs = row.MeasurementDocs.map(doc => {
                return nullishDocProperties(doc);
            });
            cachedDocs = cachedDocs.concat(docs);
        });
    });

    const initialCachedDocs = CommonLibrary.getStateVariable(context, 'InitialEDTDocs');
    let unsavedChangesPresent = false;
    try {
        unsavedChangesPresent = JSON.stringify(cachedDocs) !== JSON.stringify(initialCachedDocs);
    } catch (error) {
        Logger.error('EDTCheckForChangesBeforeCancel', error);
    }

    if (unsavedChangesPresent) {
        return context.executeAction('/SAPAssetManager/Actions/Page/ConfirmCancelPage.action');
    } else {
        // proceed with cancel without asking
        return ResetFlagsAndClosePage(context);
    }
}

export function saveEDTInitialBinding(context, binding) {
    let initialDocs = [];

    if (binding) {
        binding.forEach(section => {
            section.forEach(row => {
                if (!row.MeasurementDocs || row.MeasurementDocs.length === 0) {
                    let doc = EDTHelper.createMeasurementDoc(row);
                    initialDocs.push(nullishDocProperties(doc));
                } else {
                    let docs = row.MeasurementDocs.map(doc => {
                        return nullishDocProperties(doc);
                    });
                    initialDocs = initialDocs.concat(docs);
                }
            });
        });
    }

    CommonLibrary.setStateVariable(context, 'InitialEDTDocs', initialDocs);
}

function nullishDocProperties(doc) {
    // Use destructuring for the properties we don't want so that we can grab only 'rest'
    /* eslint-disable no-unused-vars */
    const {
        _created,
        _error,
        _updated,
        _reset,
        OrderObjNum,
        OperationObjNum,
        '@sap.hasPendingChanges': _,
        MeasuringPoint,
        ...rest
    } = doc;

    return {
        ...rest,
        ReadingTimestamp: 0,
    };
}
