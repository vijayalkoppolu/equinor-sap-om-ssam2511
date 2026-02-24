import CommonLibrary from '../../../Common/Library/CommonLibrary';
import QueryBuilder from '../../../Common/Query/QueryBuilder';

export default function OrganizationalDataNav(context) {
    const queryBuilder = new QueryBuilder();

    const binding = context.getPageProxy().binding;
    const readLink = binding['@odata.readLink'];

    if (binding['@odata.type'] === '#sap_mobile.S4ServiceItem') {
        queryBuilder.addSelectStatement('SalesRespOrg,SalesOrg,S4ServiceOrder_Nav/DistributionChannel,S4ServiceOrder_Nav/Division,ServiceOrg,ServiceRespOrg,ServiceOrg_Nav/ShortDescription,ServiceOrg_Nav/Description,SalesOrg_Nav/Description,SalesOrg_Nav/ShortDescription,ServiceRespOrg_Nav/Description,SalesRespOrg_Nav/Description,SalesRespOrg_Nav/ShortDescription');
        queryBuilder.addExpandStatement('ServiceOrg_Nav,SalesOrg_Nav,SalesRespOrg_Nav,ServiceRespOrg_Nav,S4ServiceOrder_Nav');
    } else {
        queryBuilder.addSelectStatement('SalesRespOrg,SalesOrg,DistributionChannel,Division,ServiceOrg,ServiceRespOrg,ServiceOrg_Nav/ShortDescription,ServiceOrg_Nav/Description,SalesOrg_Nav/Description,SalesOrg_Nav/ShortDescription,ServiceRespOrg_Nav/Description,SalesRespOrg_Nav/Description,SalesRespOrg_Nav/ShortDescription');
        queryBuilder.addExpandStatement('ServiceOrg_Nav,SalesOrg_Nav,SalesRespOrg_Nav,ServiceRespOrg_Nav');
    }

    return CommonLibrary.navigateOnRead(context, '/SAPAssetManager/Actions/ServiceOrders/ServiceOrganizationalDataNav.action', readLink, queryBuilder.build());
}
