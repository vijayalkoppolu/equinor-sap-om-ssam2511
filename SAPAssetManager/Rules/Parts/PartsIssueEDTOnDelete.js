
import libCom from '../Common/Library/CommonLibrary';
import partsIssueEDTCounts from './PartsIssueEDTCounts';

export default function PartsIssueEDTOnDelete(context) {
    return partsIssueEDTCounts(context).then(count => {
        if (count > 0) {
            context.evaluateTargetPathForAPI('#Page:-Current').setCaption(context.localizeText('parts_x', [count - 1]));
            const itemNumber = context?._control?.context?.binding?.ItemNumber;
            if (itemNumber) {
                const ignoredItemNumberList = libCom.getStateVariable(context, 'IgnoredItemNumberList') || [];
                ignoredItemNumberList.push(itemNumber);
                libCom.setStateVariable(context, 'IgnoredItemNumberList', ignoredItemNumberList);
            }
        }
        context.currentPage.controls[0].redraw(true);
    });
}

