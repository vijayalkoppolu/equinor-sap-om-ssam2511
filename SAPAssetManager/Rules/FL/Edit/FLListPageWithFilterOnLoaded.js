import ListPageWithFilterOnLoaded from '../../Filter/ListPageWithFilterOnLoaded';
import libCom from '../../Common/Library/CommonLibrary';

export default function FLListPageWithFilterOnLoaded(context) {
    libCom.saveInitialValues(context);

    ListPageWithFilterOnLoaded(context);
}
