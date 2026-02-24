import libCommon from '../Common/Library/CommonLibrary';
import GuidedFlowGenerator from '../GuidedWorkFlow/GuidedFlowGenerator';
import Logger from '../Log/Logger';
import libMobile from '../MobileStatus/MobileStatusLibrary';

export default async function ProgressTrackerGuidedWorkFlowInitialSteps(context, binding = context.binding) {
    const objectType = libCommon.getMobileStatusEAMObjectType(context, binding);
    const mobileStatusObject = libMobile.getMobileStatusNavLink(context, binding);
    const mobileStatus = mobileStatusObject?.MobileStatus;

    const guidedFlowGenerator = await new GuidedFlowGenerator(context, binding, objectType, mobileStatus);
    const currentStepSequence = await guidedFlowGenerator.getCurrentStepSequence();
    const flowSteps = await guidedFlowGenerator.generateFlowSteps();
    const passedSequences = await mapStatusHistoriesToStepSequences(context, mobileStatusObject, guidedFlowGenerator.getCurrentFlowId());
    return createStepsFromFlowSteps(context, flowSteps, currentStepSequence, mobileStatus, passedSequences);
}

function createStepsFromFlowSteps(context, workFlowSteps, currentStepSequence, mobileStatus, passedSequences) {
    if (workFlowSteps && workFlowSteps.Steps.length > 0) {
        let data = [];
        let selectedIndex = 0;
        let index = 0;
        workFlowSteps.Steps.forEach((step) => {
            const state = getStepState(step, currentStepSequence, passedSequences);
            let stepName = step.ToStep.replace(/[^A-Za-z0-9]+/g, '').toLowerCase();
            let localizedStepName = context.localizeText('flow_Step_' + stepName);
            if (localizedStepName.indexOf('flow_Step_') !== -1) {
                localizedStepName = step.ToStep;
            }
            if (state === 1) {
                data.push({
                    'State': state,
                    'Title': localizedStepName,
                    'Subtitle': context.localizeText(mobileStatus),
                    'IsSelectable': false,
                });
            } else {
                data.push({
                    'State': state,
                    'Title': localizedStepName,
                    'Subtitle': '',
                    'IsSelectable': false,
                });
            }
            if (state === 1) {
                selectedIndex = index;
            }
            index++;
        });
        return {
            SelectedStepIndex: selectedIndex,
            Steps: data,
        };
    }
    return {};
}

function getStepState(step, currentStepSequence, passedSequences) {
    const sequence = parseInt(step.Sequence);
    if (currentStepSequence === sequence) {
        return 1;
    } else if (currentStepSequence > sequence && passedSequences.includes(sequence)) {
        return 2;
    } else {
        return 0;
    }
}

async function mapStatusHistoriesToStepSequences(context, mobileStatusObject, flowId) {
    try {
        const service = '/SAPAssetManager/Services/AssetManager.service';
        // Read PMMobileStatusHistories excluding history record for current mobile status as we only need previous ones
        const statusHistories = await context.read(service, `${mobileStatusObject['@odata.readLink']}/PMMobileStatusHistory_Nav`,
            ['MobileStatus'], '').then(histories => Array.from(histories).map(history => history.MobileStatus));

        if (statusHistories?.length > 0) {
            const uniqueStepNames = await getUniqueFlowStepsForHistories(context, service, flowId, statusHistories);
            const historySequences = await getSequencesForFlowSteps(context, service, flowId, uniqueStepNames);
            return historySequences;
        }

        return [];
    } catch (error) {
        Logger.error(mapStatusHistoriesToStepSequences.name, error);
        return [];
    }
}

// Gets unique step names to which statuses from history belong
function getUniqueFlowStepsForHistories(context, service, flowId, statusHistories) {
    // Read GuidedFlowStatusSeqs which have ToStatus as one of history statuses
    const queryOptions = `$filter=(${statusHistories.map(statusHistory => `ToStatus eq '${statusHistory}'`).join(' or ')}) and FlowID eq '${flowId}'`;
    return context.read(service, 'GuidedFlowStatusSeqs', ['Step', 'FromStatus'], queryOptions)
        .then(guidedFlowStatusSeqs => {
            const RECEIVED = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());
            const steps = [];
            for (let statusSeq of guidedFlowStatusSeqs) {
                // Only add steps whose FromStatus and ToStatus are included in the history statuses,
                // or whose FromStatus is 'RECEIVED', because there is no history record for 'RECEIVED'.
                if (statusHistories.includes(statusSeq.FromStatus) || statusSeq.FromStatus === RECEIVED) {
                    steps.push(statusSeq.Step);
                }
            }
            return steps;
        })
        .then(steps => Array.from(new Set(steps)));
}

// Gets sequence numbers for provided step names
function getSequencesForFlowSteps(context, service, flowId, uniqueStepNames) {
    const queryOptions = `$filter=FlowID eq '${flowId}' and (${uniqueStepNames.map(stepName => `ToStep eq '${stepName}'`).join(' or ')})`;
    return context.read(service, 'GuidedFlowSteps', ['Sequence'], queryOptions)
        .then(flowSteps => Array.from(flowSteps).map(step => parseInt(step.Sequence)));
}
