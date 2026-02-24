import { PackedPackagesTransStatus } from '../Common/FLLibrary';

export default function ShowEditButton(context) {
    const status = context.evaluateTargetPath('#Property:FldLogsCtnIntTranspStsCode');
    return status !== PackedPackagesTransStatus.Dispatched;
}
