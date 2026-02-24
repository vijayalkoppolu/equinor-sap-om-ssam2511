export default function IsListInSelectionMode(context) {
	return context.getPageProxy().getControl('SectionedTable')?.getSections()[0]?.getSelectionMode() === 'Multiple';
}
