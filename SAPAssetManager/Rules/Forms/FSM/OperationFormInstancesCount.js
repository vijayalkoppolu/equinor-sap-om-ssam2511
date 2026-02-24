import libCom from '../../Common/Library/CommonLibrary';
import QueryBuilder from '../../Common/Query/QueryBuilder';

/**
 * Count of smartforms associated with this operation or service item
 * @param {*} sectionProxy 
 * @param {*} queryOptions 
 * @returns 
 */
export default function OperationFormInstancesCount(sectionProxy, queryOptions='') {
    let binding = (sectionProxy.getPageProxy ? sectionProxy.getPageProxy().binding : sectionProxy.binding);
    const s4 = binding['@odata.type'] ==='#sap_mobile.S4ServiceItem' || binding['@odata.type'] ==='#sap_mobile.S4ServiceOrder';

	if (sectionProxy.constructor.name === 'SectionedTableProxy') {
        binding = sectionProxy.getPageProxy().getExecutedContextMenuItem().getBinding();
    }

    if (!queryOptions) {
        let queryBuilder = new QueryBuilder();
        if (s4) {
            queryBuilder.addFilter(`S4ServiceOrderId eq '${binding.ObjectID}'`);

            if (binding.ItemNo) {
                queryBuilder.addFilter(`S4ServiceItemNumber eq '${binding.ItemNo}'`);
            } else {
                queryBuilder.addFilter('(S4ServiceItemNumber eq \'000000\' or S4ServiceItemNumber eq null or S4ServiceItemNumber eq \'\')');
            }
        } else {
            queryBuilder.addFilter(`WorkOrder eq '${binding.OrderId}'`);

            if (binding.OperationNo) {
                queryBuilder.addFilter(`Operation eq '${binding.OperationNo}'`);
            } else {
                queryBuilder.addFilter('(Operation eq \'0000\' or Operation eq null or Operation eq \'\')');
            }
        }

        queryOptions = queryBuilder.build();
    }

    return libCom.getEntitySetCount(sectionProxy, 'FSMFormInstances', queryOptions);
}
