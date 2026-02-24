export function FLVoyagesSubhead(context) {
    let subhead = '';
    if (context.binding.FldLogsSrcePlnt) {
        subhead += context.binding.FldLogsSrcePlnt;
    }
    if (context.binding.FldLogsVoyageSrceStage) {
        if (subhead) {
            subhead += ', ';
        }
        subhead += context.binding.FldLogsVoyageSrceStage;
    }
    return subhead;
}
