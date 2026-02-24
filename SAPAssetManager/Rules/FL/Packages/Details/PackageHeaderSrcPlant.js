import { getPlantNameFL } from '../../Common/FLLibrary';
 
export default function PackageHeaderSrcPlant(context) {
    return getPlantNameFL(context, context.binding.DispatchLoc);
}
