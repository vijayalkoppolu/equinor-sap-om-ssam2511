import TechniciansCount from './TechniciansCount';

export default async function TechniciansExist(clientAPI, operation = clientAPI.getPageProxy().binding) {
    const count = await TechniciansCount(clientAPI, operation);
    return count > 0;
}
