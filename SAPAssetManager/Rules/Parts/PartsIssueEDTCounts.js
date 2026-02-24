import libCom from '../Common/Library/CommonLibrary';
import partsIssueEDTQueryOptions from './PartsIssueEDTQueryOptions';

export default function PartsIssueEDTCounts(context) {
    return libCom.getEntitySetCount(context, 'MyWorkOrderComponents', partsIssueEDTQueryOptions(context)).then(count => {
        return count;
    });
}
