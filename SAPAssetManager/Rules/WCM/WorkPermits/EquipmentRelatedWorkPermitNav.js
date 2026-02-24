import WorkPermitsPageMetadata from './WorkPermitsPageMetadata';
import WorkPermitsListViewNav from '../WorkPermitsListViewNav';

export default function EquipmentRelatedWorkPermitNav(context) {
    return NavToRelatedWorkPermitListPage(context, 'EquipmentRelatedWorkPermitListPage');
}

export function NavToRelatedWorkPermitListPage(context, relatedToName) {
    const page = WorkPermitsPageMetadata(context);
    page._Name = relatedToName;

    return WorkPermitsListViewNav(context, {
        'Name': '/SAPAssetManager/Actions/WCM/WorkPermitsListViewNav.action',
        'Properties': {
            'PageMetadata': page,
        },
    });
}
