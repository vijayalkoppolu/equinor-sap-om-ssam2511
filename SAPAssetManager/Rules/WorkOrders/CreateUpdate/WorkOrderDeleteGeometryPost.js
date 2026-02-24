import GeometryDelete from '../../Geometries/GeometryDelete';

export default function WorkOrderDeleteGeometryPost(context) {
    return GeometryDelete(context, 'Geometry_Nav', 'Geometries')
        .then(() => {
            return GeometryDelete(context, 'WOGeometries', 'MyWorkOrderGeometries');
        }).catch(() => {
            return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/DeleteEntityFailureMessage.action');
        });
}
