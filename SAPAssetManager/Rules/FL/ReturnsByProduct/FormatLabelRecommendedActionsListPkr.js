import libCom from '../../Common/Library/CommonLibrary';
export default function FormatLabelRecommendedActionsListPkr(clientAPI) {
    return libCom.formatCaptionWithRequiredSign(clientAPI, 'recommended_action', true);
}
