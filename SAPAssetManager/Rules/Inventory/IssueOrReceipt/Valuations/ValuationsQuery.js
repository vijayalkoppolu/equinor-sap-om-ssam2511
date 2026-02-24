export default function ValuationsQuery(context) {
    const pageProxy = context.getPageProxy ? context.getPageProxy() : context;
    const material = extractMaterial(pageProxy);
    return fetchMaterialValuations(context, material);
}

function buildValuationsQuery(material) {
    return `$filter=Material eq '${material}'&$orderby=ValuationType`;
}

function fetchMaterialValuations(context, material) {
    if (!material) {
        return Promise.resolve([]);
    }
    const query = buildValuationsQuery(material);
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialValuations', [], query);
}

function extractMaterial(pageProxy) {
    const binding = pageProxy.binding || {};
    let material = binding.MaterialNum || binding.MaterialNumber || binding.Material;

    if (binding.RelatedItem?.[0]?.Material) {
        material = binding.RelatedItem[0].Material;
    }

    const clientData = pageProxy.getClientData?.() || {};
    if (clientData.Material) {
        material = clientData.Material;
    }

    return material;
}
