export default function UpdateButtonState(context, nextStep) {
    const controls = ['RecordButton', 'SubmitButton', 'StopRecording', 'ReRecordButton'];
    const page = context.getPageProxy().getControl('SectionedTable');
    const buttons = Object.fromEntries(controls.map(id => [id, page.getControl(id)]));

    const visibilityMap = {
        start: { RecordButton: true, StopRecording: false, SubmitButton: false, ReRecordButton: false },
        stop: { RecordButton: false, StopRecording: true, SubmitButton: false, ReRecordButton: false },
        re_record: { RecordButton: true, StopRecording: false, SubmitButton: false, ReRecordButton: false },
        submit: { RecordButton: false, StopRecording: false, SubmitButton: true, ReRecordButton: true },
        process: { RecordButton: false, StopRecording: false, SubmitButton: true, ReRecordButton: true },
    };

    if (nextStep in visibilityMap) {
        if (nextStep === 're_record') buttons.RecordButton.setTitle(context.localizeText('re_record'));
        Object.entries(visibilityMap[nextStep]).forEach(([key, value]) => buttons[key]?.setVisible(value));
    }
}
