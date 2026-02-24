
import LAMFilter from './LAMFilter';
import GetLAM from './GetLAM';
import LAMReadLink from './LAMReadLink';

export default async function LAMVisible(context) {
    const lam = await GetLAM(context, LAMReadLink(context), [], LAMFilter(context));
    return !!lam;
}
