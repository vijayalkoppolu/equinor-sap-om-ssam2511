import CommonLibrary from '../../Common/Library/CommonLibrary';
import ServiceConfirmationLibrary from './ServiceConfirmationLibrary';
import ServiceConfirmationItemCreateNav from './ServiceConfirmationItemCreateNav';
import GetConfirmationObjectType from './Data/GetConfirmationObjectType';
import nilGuid from '../../Common/nilGuid';

export default async function AutoCreateServiceConfirmation(context, customBinding) {
    CommonLibrary.setStateVariable(context, 'LocalId', '');

    const isServiceItem = customBinding['@odata.type'] === '#sap_mobile.S4ServiceItem';
    const serviceOrder = await readServiceOrderDetails(context, customBinding, isServiceItem);

    if (!serviceOrder) return Promise.reject();

    const processType = await ServiceConfirmationLibrary.getConfirmationProcessType(context, serviceOrder['@odata.readLink']);
    ServiceConfirmationLibrary.getInstance().storeConfirmationFilledValues({
        'Description': serviceOrder.Description || '-',
        'Category1': serviceOrder.Category1 || nilGuid(),
        'Category2': serviceOrder.Category2 || nilGuid(),
        'Category3': serviceOrder.Category3 || nilGuid(),
        'Category4': serviceOrder.Category4 || nilGuid(),
        'ObjectType': GetConfirmationObjectType(context),
        'ProcessType': processType,
        'FinalConfirmation': 'N',
        'Status': '',
        'CreatedBy': CommonLibrary.getSapUserName(context),
        'SchemaID': serviceOrder.SchemaID,
        'CategoryID': serviceOrder.CategoryID,
        'SubjectProfile': serviceOrder.SubjectProfile,
        'CatalogType': serviceOrder.CodeCatalog,
        'CodeGroup': serviceOrder.CodeGroup,
        'Code': serviceOrder.Code,
    });

    const selectedRefObject = getAppliedRefObject(serviceOrder);
    ServiceConfirmationLibrary.getInstance().storeComponentRelatedObjectIds({
        'Product': selectedRefObject.type === 'P' ? selectedRefObject.id : '',
        'FunctionalLocation': selectedRefObject.type === 'F' ? selectedRefObject.id : '',
        'Equipment': selectedRefObject.type === 'E' ? selectedRefObject.id : '',
        'ServiceOrder': serviceOrder['@odata.readLink'],
        'Note': '',
        'NoteType': '',
        'AttachmentDescription': '',
        'Attachments': [],
        'AttachmentsCount': 0,
    });

    if (isServiceItem) {
        return ServiceConfirmationItemCreateNav(context, customBinding);
    } else {
        return context.executeAction('/SAPAssetManager/Actions/ServiceConfirmations/ServiceConfirmationSelectItemNav.action');
    }
}

async function readServiceOrderDetails(context, customBinding, isServiceItem) {
    const link = isServiceItem ? customBinding['@odata.readLink'] + '/S4ServiceOrder_Nav' : customBinding['@odata.readLink'];
    return await context.read('/SAPAssetManager/Services/AssetManager.service', link, [], '$expand=RefObjects_Nav/Equipment_Nav,RefObjects_Nav/FuncLoc_Nav,RefObjects_Nav/Material_Nav').then(result => result.length ? result.getItem(0) : null);
}

function getAppliedRefObject(serviceOrder) {
    const refObjects = serviceOrder.RefObjects_Nav || [];
    const selectedRefObject = {'type': '', 'id': ''};
    refObjects.find(object => {
        if (object.ProductID && object.Material_Nav) {
            selectedRefObject.type = 'P';
            selectedRefObject.id = object.ProductID;
            return true;
        } else if (object.FLocID && object.FuncLoc_Nav) {
            selectedRefObject.type = 'F';
            selectedRefObject.id = object.FLocID;
            return true;
        } else if (object.EquipID && object.Equipment_Nav) {
            selectedRefObject.type = 'E';
            selectedRefObject.id = object.EquipID;
            return true;
        }
        return false;
    });
    return selectedRefObject;
}
