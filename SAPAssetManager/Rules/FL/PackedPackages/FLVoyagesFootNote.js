export default function FLVoyagesFootNote(context) {
    let footNote = [];

     if (context.binding.FldLogsSrcePlnt) {
        footNote.push(context.binding.FldLogsSrcePlnt);
     } 
     if (context.binding.FldLogsVoyageSrceStage) {
        footNote.push(context.binding.FldLogsVoyageSrceStage);
     } 
     if (context.binding.FldLogsDestPlnt) {
        footNote.push(context.binding.FldLogsDestPlnt);
     } 
     if (context.binding.FldLogsVoyageDestStage) {
        footNote.push(context.binding.FldLogsVoyageDestStage);
     } 

    return footNote.join(', ');
}
